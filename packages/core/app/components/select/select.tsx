import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingList,
  FloatingNode,
  FloatingOverlay,
  FloatingPortal,
  FloatingTree,
  inner,
  offset,
  shift,
  SideObject,
  size,
  useClick,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useInnerOffset,
  useInteractions,
  useListNavigation,
  useRole,
  useTypeahead,
  type FloatingFocusManagerProps,
} from "@floating-ui/react"
import React, {
  Children,
  cloneElement,
  isValidElement,
  memo,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"
import { useEventCallback } from "usehooks-ts"
import { tcx } from "~/utils"
import {
  MenuContext,
  MenuContextContent,
  MenuContextItem,
  MenuContextLabel,
  MenuDivider,
  MenuScrollArrow,
  MenuTrigger,
  MenuValue,
  useMenuScroll,
  type MenuContextItemProps,
} from "../menus"
import { Slot } from "../slot"

const PORTAL_ROOT_ID = "floating-menu-root"

export interface SelectProps {
  children?: React.ReactNode
  className?: string
  closeOnEscape?: boolean
  disabled?: boolean
  focusManagerProps?: Partial<FloatingFocusManagerProps>
  matchTriggerWidth?: boolean
  onChange?: (value: string) => void
  onOpenChange?: (open: boolean) => void
  open?: boolean
  placement?: "bottom-start" | "bottom-end"
  portalId?: string
  size?: "default" | "large"
  value?: string | null
}

interface SelectComponentType
  extends React.ForwardRefExoticComponent<SelectProps & React.RefAttributes<HTMLButtonElement>> {
  Content: typeof MenuContextContent
  Divider: typeof MenuDivider
  Item: typeof MenuContextItem
  Label: typeof MenuContextLabel
  Trigger: typeof MenuTrigger
  Value: typeof MenuValue
}

/**
 * Select - 高性能的选择组件，支持 macOS 风格定位
 *
 * 核心特性：
 * - 使用 inner middleware 实现 macOS 风格定位
 * - 当前选中项会显示在触发器附近
 * - 支持 fallback 机制
 * - 优化的性能和代码质量
 */
const SelectComponent = memo(function SelectComponent(props: SelectProps) {
  const {
    className,
    closeOnEscape = true,
    matchTriggerWidth = false,
    value,
    onChange,
    open: controlledOpen,
    onOpenChange,
    disabled = false,
    portalId = PORTAL_ROOT_ID,
    placement = "bottom-start",
    children,
    size: sizeProp = "default",
    focusManagerProps = {
      returnFocus: false,
      modal: true,
    },
  } = props

  // 提取子元素 - 从原来的 Select 复制逻辑
  const [itemElements, triggerElement, contentElement] = useMemo(() => {
    if (!children) return [[], null, null]

    const childrenArray = Children.toArray(children)

    // 找到第一个 MenuTrigger 元素
    const trigger = childrenArray.find(
      (child) => isValidElement(child) && child.type === MenuTrigger,
    ) as React.ReactElement | null

    // 找到 MenuContextContent 元素
    const content = childrenArray.find(
      (child) => isValidElement(child) && child.type === MenuContextContent,
    ) as React.ReactElement | null

    // 必须使用 MenuContextContent，从其子元素中收集选项
    if (!content) {
      return [[], trigger, null]
    }

    const contentChildren = Children.toArray(content.props.children)

    // 递归函数处理Fragment内的子元素
    const extractSelectItems = (children: React.ReactNode[]): React.ReactNode[] => {
      const result: React.ReactNode[] = []

      children.forEach((child) => {
        if (!isValidElement(child)) return

        if (
          child.type === MenuContextItem ||
          child.type === MenuDivider ||
          child.type === MenuContextLabel
        ) {
          result.push(child)
        } else if (child.type === React.Fragment && child.props.children) {
          const fragmentChildren = Children.toArray(child.props.children)
          result.push(...extractSelectItems(fragmentChildren))
        }
      })

      return result
    }

    const items = extractSelectItems(contentChildren)
    return [items, trigger, content]
  }, [children])

  // 从 SelectItem 元素中提取选项数据
  const options = useMemo(() => {
    if (itemElements.length === 0) return []

    return itemElements.map((child, index) => {
      if (!isValidElement(child)) return { divider: true }

      if (child.type === MenuDivider) {
        return { divider: true }
      }

      if (child.type === MenuContextLabel) {
        return { label: true, children: child.props.children }
      }

      // 从 MenuContextItem 元素提取属性
      const {
        value: itemValue,
        children: itemChildren,
        disabled: itemDisabled,
      } = child.props as MenuContextItemProps

      return {
        value: itemValue,
        disabled: itemDisabled,
        _originalIndex: index,
        element: child,
        children: itemChildren,
      }
    })
  }, [itemElements])

  // 创建只包含可选择items的数组（不包含divider和label）
  const selectableOptions = useMemo(() => {
    return options.filter((option) => !option.divider && !option.label)
  }, [options])

  // References
  const listRef = useRef<Array<HTMLElement | null>>([])
  const listContentRef = useRef<Array<string | null>>([])
  const overflowRef = useRef<SideObject>(null)
  const allowSelectRef = useRef(false)
  const allowMouseUpRef = useRef(true)
  const selectTimeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const scrollRef = useRef<HTMLDivElement>(null)

  // 将所有 refs 组合到一个对象中，用 useMemo 包装以避免重新创建
  const refs = useMemo(
    () => ({
      list: listRef,
      listContent: listContentRef,
      overflow: overflowRef,
      allowSelect: allowSelectRef,
      allowMouseUp: allowMouseUpRef,
      selectTimeout: selectTimeoutRef,
      scroll: scrollRef,
    }),
    [], // refs 是稳定的引用，不需要依赖项
  )

  // 状态管理
  const [open, setOpen] = useState(false)
  const [fallback, setFallback] = useState(false) // 关键：fallback 机制
  const [touch, setTouch] = useState(false)
  const [scrollTop, setScrollTop] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [innerOffset, setInnerOffset] = useState(0) // 关键：内部偏移

  // 合并受控与非受控打开状态
  const isControlledOpen = controlledOpen !== undefined ? controlledOpen : open

  // 生成唯一 ID
  const baseId = useId()
  const menuId = `menu-${baseId}`
  const nodeId = useFloatingNodeId()

  // 处理打开状态变化
  const handleOpenChange = useEventCallback((newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  })

  // 确定当前选中索引
  const currentSelectedIndex = useMemo(() => {
    if (value === undefined) return selectedIndex

    // 在可选择的options中找到索引
    const index = selectableOptions.findIndex((option) => option.value === value)
    return index === -1 ? selectedIndex : index
  }, [value, selectedIndex, selectableOptions])

  // 重置状态 - 当菜单关闭时
  if (!open) {
    if (innerOffset !== 0) setInnerOffset(0)
    if (fallback) setFallback(false)
  }

  // 核心：macOS 风格的 floating 配置
  const floating = useFloating({
    nodeId,
    placement,
    open: isControlledOpen,
    onOpenChange: handleOpenChange,
    whileElementsMounted: (reference, floating, update) => {
      return autoUpdate(reference, floating, () => requestAnimationFrame(update), {
        animationFrame: true,
      })
    },
    transform: false,
    // 关键：两套 middleware 配置
    middleware: fallback
      ? [
          // Fallback 模式：普通下拉菜单
          offset(8),
          touch ? shift({ crossAxis: true, padding: 16 }) : flip({ padding: 16 }),
          size({
            apply(args) {
              const { availableHeight } = args
              requestAnimationFrame(() => {
                if (refs.scroll.current) {
                  refs.scroll.current.style.maxHeight = `${availableHeight}px`
                }
              })
            },
            padding: 4,
          }),
        ]
      : [
          // 正常模式：macOS 风格 inner positioning
          inner({
            listRef: refs.list,
            overflowRef: refs.overflow,
            scrollRef: refs.scroll,
            index: currentSelectedIndex >= 0 ? currentSelectedIndex : 0,
            offset: innerOffset,
            onFallbackChange: setFallback,
            padding: 16,
            minItemsVisible: touch ? 8 : 4,
            referenceOverflowThreshold: 20,
          }),
          offset(placement.includes("end") ? { crossAxis: 8 } : { crossAxis: -8 }),
          size({
            apply(args) {
              const { rects, elements } = args
              if (matchTriggerWidth) {
                elements.floating.style.width = `${rects.reference.width + 16}px`
              }
            },
          }),
        ],
  })

  // 交互处理器配置 - 统一写法，与 DropdownV2 保持一致
  const click = useClick(floating.context, {
    event: "mousedown",
    stickIfOpen: false,
  })

  const dismiss = useDismiss(floating.context, {
    escapeKey: closeOnEscape,
  })

  const role = useRole(floating.context, { role: "listbox" })

  // 关键：useInnerOffset 用于处理内部偏移 (Select 特有)
  const innerOffsetInteraction = useInnerOffset(floating.context, {
    enabled: !fallback,
    onChange: (offset) => setInnerOffset(offset as number),
    overflowRef: refs.overflow,
    scrollRef: refs.scroll,
  })

  const listNavigation = useListNavigation(floating.context, {
    listRef: refs.list,
    activeIndex,
    selectedIndex: currentSelectedIndex >= 0 ? currentSelectedIndex : 0,
    onNavigate: setActiveIndex,
  })

  const typeahead = useTypeahead(floating.context, {
    listRef: refs.listContent,
    activeIndex,
    onMatch: isControlledOpen
      ? setActiveIndex
      : (index) => {
          if (index !== -1) setSelectedIndex(index)
        },
  })

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    click,
    dismiss,
    role,
    innerOffsetInteraction,
    listNavigation,
    typeahead,
  ])

  // 菜单打开时的效果
  useEffect(() => {
    if (isControlledOpen) {
      refs.selectTimeout.current = setTimeout(() => {
        refs.allowSelect.current = true
      }, 300)

      return () => {
        if (refs.selectTimeout.current) {
          clearTimeout(refs.selectTimeout.current)
        }
      }
    } else {
      refs.allowSelect.current = false
      refs.allowMouseUp.current = true
    }
  }, [isControlledOpen])

  // 使用共享的滚动逻辑
  const { handleArrowScroll, handleArrowHide, scrollProps } = useMenuScroll({
    scrollRef: refs.scroll,
    selectTimeoutRef: refs.selectTimeout,
    scrollTop,
    setScrollTop,
    touch,
    isSelect: true,
    fallback,
    setInnerOffset,
  })

  // 处理选择
  const handleSelect = useEventCallback((index: number) => {
    if (refs.allowSelect.current) {
      setSelectedIndex(index)
      handleOpenChange(false)
      setOpen(false)

      const selectedOption = selectableOptions[index]
      if (selectedOption) {
        const resultValue = selectedOption.value ?? ""

        if (resultValue !== value) {
          onChange?.(resultValue)
        }
      }
    }
  })

  // 处理焦点状态
  const [hasFocusInside, setHasFocusInside] = useState(false)

  // 创建 MenuContext 值
  const menuContextValue = useMemo(
    () => ({
      activeIndex,
      setActiveIndex,
      getItemProps,
      setHasFocusInside,
      isOpen: isControlledOpen,
      selection: true, // Select always has selection
      close: () => handleOpenChange(false),
    }),
    [activeIndex, setActiveIndex, getItemProps, isControlledOpen, handleOpenChange],
  )

  // 注册列表项
  const registerItem = useEventCallback((index: number, node: HTMLElement | null) => {
    refs.list.current[index] = node
    const option = selectableOptions[index]
    refs.listContent.current[index] = option ? option.value || null : null
  })

  // 渲染菜单项
  const menuItems = useMemo(() => {
    let selectableIndex = 0

    return options.map((option, index) => {
      // 分隔符
      if (option.divider) {
        return <MenuDivider key={`divider-${index}`} />
      }

      // 标签
      if (option.label) {
        return <MenuContextLabel key={`label-${index}`}>{option.children}</MenuContextLabel>
      }

      // 选项项
      const currentSelectableIndex = selectableIndex
      selectableIndex++ // 递增可选择项目索引

      const isSelected = currentSelectedIndex === currentSelectableIndex
      const isDisabled = !!option.disabled

      // 检查是否有自定义的 onClick
      const childProps = option.element?.props as MenuContextItemProps
      const customActive = childProps?.onClick

      // 事件处理器
      const eventHandlers = {
        onTouchStart: () => {
          if (customActive) return
          refs.allowSelect.current = true
          refs.allowMouseUp.current = false
        },
        onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => {
          if (customActive) return
          refs.allowSelect.current = true
        },
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
          if (customActive) {
            childProps.onClick?.(e)
          } else {
            handleSelect(currentSelectableIndex)
          }
        },
        onMouseUp: () => {
          if (!refs.allowMouseUp.current || customActive) return

          if (refs.allowSelect.current) {
            handleSelect(currentSelectableIndex)
          }

          // 重置选择延迟
          if (refs.selectTimeout.current) {
            clearTimeout(refs.selectTimeout.current)
          }
          refs.selectTimeout.current = setTimeout(() => {
            refs.allowSelect.current = true
          }, 100)
        },
      }

      return (
        <MenuContextItem
          key={option.value || `item-${index}`}
          value={option.value || ""}
          ref={(node: HTMLButtonElement | null) => registerItem(currentSelectableIndex, node)}
          selected={isSelected}
          disabled={isDisabled}
          size={sizeProp}
          customActive={customActive ? true : undefined}
          {...eventHandlers}
        >
          {option.children}
        </MenuContextItem>
      )
    })
  }, [
    options,
    currentSelectedIndex,
    sizeProp,
    refs.allowSelect,
    refs.allowMouseUp,
    refs.selectTimeout,
    handleSelect,
    registerItem,
  ])

  const enhancedTriggerElement = useMemo(() => {
    if (!triggerElement) return null
    return cloneElement(triggerElement, {
      ...triggerElement.props,
      active: isControlledOpen,
      size: sizeProp,
    })
  }, [triggerElement, isControlledOpen, sizeProp])

  // 错误处理
  if (!triggerElement || !contentElement) {
    console.error("Select requires both Select.Trigger and Select.Content components as children")
    return null
  }

  return (
    <FloatingNode id={nodeId}>
      <Slot
        ref={floating.refs.setReference}
        aria-haspopup="listbox"
        aria-expanded={isControlledOpen}
        aria-controls={menuId}
        {...getReferenceProps({
          disabled,
          onTouchStart() {
            setTouch(true)
          },
          onPointerMove({ pointerType }: React.PointerEvent) {
            if (pointerType !== "touch") {
              setTouch(false)
            }
          },
        })}
      >
        {enhancedTriggerElement}
      </Slot>

      <FloatingPortal id={portalId}>
        {isControlledOpen && (
          <FloatingOverlay
            lockScroll={!touch}
            className={tcx("z-menu", focusManagerProps.modal ? "" : "pointer-events-none")}
          >
            <FloatingFocusManager
              context={floating.context}
              {...focusManagerProps}
            >
              <div
                style={{
                  opacity: fallback ? (floating.isPositioned ? 1 : 0) : undefined,
                  transitionDelay: fallback && floating.isPositioned ? "0.1s" : undefined,
                }}
              >
                <div
                  id={menuId}
                  ref={floating.refs.setFloating}
                  style={floating.floatingStyles}
                  className={className}
                >
                  <MenuContext.Provider value={menuContextValue}>
                    {cloneElement(contentElement, {
                      ref: refs.scroll,
                      matchTriggerWidth,
                      ...getFloatingProps({
                        ...scrollProps,
                        onContextMenu(e: React.MouseEvent) {
                          e.preventDefault()
                        },
                      }),
                      children: (
                        <FloatingList
                          elementsRef={refs.list}
                          labelsRef={refs.listContent}
                        >
                          {menuItems}
                        </FloatingList>
                      ),
                    })}
                  </MenuContext.Provider>

                  {/* 滚动箭头 */}
                  {["up", "down"].map((dir) => (
                    <MenuScrollArrow
                      key={dir}
                      dir={dir as "up" | "down"}
                      scrollTop={scrollTop}
                      scrollRef={refs.scroll}
                      innerOffset={innerOffset}
                      isPositioned={floating.isPositioned}
                      onScroll={handleArrowScroll}
                      onHide={handleArrowHide}
                    />
                  ))}
                </div>
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </FloatingNode>
  )
})

const BaseSelect = memo(function Select(props: SelectProps) {
  const { children, ...rest } = props
  const parentId = useFloatingParentNodeId()

  if (parentId === null) {
    return (
      <FloatingTree>
        <SelectComponent {...rest}>{children}</SelectComponent>
      </FloatingTree>
    )
  }

  return <SelectComponent {...props}>{children}</SelectComponent>
})

// 创建并导出带有静态属性的 Select 组件
export const Select = Object.assign(BaseSelect, {
  Item: MenuContextItem,
  Trigger: MenuTrigger,
  Divider: MenuDivider,
  Label: MenuContextLabel,
  Content: MenuContextContent,
  Value: MenuValue,
}) as SelectComponentType

Select.displayName = "Select"
