import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingList,
  FloatingOverlay,
  FloatingPortal,
  inner,
  offset as off,
  shift,
  SideObject,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInnerOffset,
  useInteractions,
  useListNavigation,
  useRole,
  useTypeahead,
} from "@floating-ui/react"
import { Slot } from "@radix-ui/react-slot"
import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"
import { flushSync } from "react-dom"
import { useEventCallback } from "usehooks-ts"
import { MenuDivider, MenuLabel, MenuScrollArrow, MenuTrigger, MenuValue } from "../menus"
import { SelectContent, SelectItem, type SelectItemPublicProps } from "./components"

const PORTAL_ROOT_ID = "floating-menu-root"

export interface SelectProps {
  disabled?: boolean
  matchTriggerWidth?: boolean
  value?: string | null
  onChange?: (value: string) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  portalId?: string
  placement?: "bottom-start" | "bottom-end"
  children?: ReactNode
}

interface SelectComponentType
  extends React.ForwardRefExoticComponent<SelectProps & React.RefAttributes<HTMLButtonElement>> {
  Item: typeof SelectItem
  Trigger: typeof MenuTrigger
  Divider: typeof MenuDivider
  Label: typeof MenuLabel
  Content: typeof SelectContent
  Value: typeof MenuValue
}

/**
 * Select 组件主体
 */
const SelectComponent = forwardRef<HTMLButtonElement, SelectProps>(function Select(props, ref) {
  const {
    matchTriggerWidth,
    value,
    onChange,
    open: controlledOpen,
    onOpenChange,
    disabled,
    portalId = PORTAL_ROOT_ID,
    placement = "bottom-start",
    children,
  } = props

  // 提取子元素 - 优化确保稳定引用
  const [itemElements, triggerElement, contentElement] = useMemo(() => {
    if (!children) return [[], null, null]

    const childrenArray = Children.toArray(children)

    // 找到第一个 SelectTrigger 元素
    const trigger = childrenArray.find(
      (child) => isValidElement(child) && child.type === MenuTrigger,
    ) as ReactElement | null

    // 找到 SelectContent 元素
    const content = childrenArray.find(
      (child) => isValidElement(child) && child.type === SelectContent,
    ) as ReactElement | null

    // 必须使用 SelectContent，从其子元素中收集选项
    if (!content) {
      return [[], trigger, null]
    }

    const contentChildren = Children.toArray(content.props.children)

    // 添加递归函数处理Fragment内的子元素
    const extractSelectItems = (children: React.ReactNode[]): React.ReactNode[] => {
      const result: React.ReactNode[] = []

      children.forEach((child) => {
        if (!isValidElement(child)) return

        if (child.type === SelectItem || child.type === MenuDivider || child.type === MenuLabel) {
          result.push(child)
        } else if (child.type === React.Fragment && child.props.children) {
          // 处理Fragment内的子元素
          const fragmentChildren = Children.toArray(child.props.children)
          result.push(...extractSelectItems(fragmentChildren))
        }
      })

      return result
    }

    // 使用递归函数处理所有子元素
    const items = extractSelectItems(contentChildren)

    return [items, trigger, content]
  }, [children])

  // 从 SelectItem 元素中提取选项数据 - 优化记忆化逻辑
  const options = useMemo(() => {
    if (itemElements.length === 0) return []

    return itemElements.map((child, index) => {
      if (!isValidElement(child)) return { divider: true }

      if (child.type === MenuDivider) {
        return { divider: true }
      }

      // 从 SelectItem 元素提取属性
      const { value, children, disabled } = child.props as SelectItemPublicProps

      return {
        label: typeof children === "string" ? children : undefined,
        value,
        disabled,
        _originalIndex: index,
        element: child, // 保存原始元素引用以减少重复计算
      }
    })
  }, [itemElements])

  // Refs - 使用对象分组相关引用以提高代码清晰度
  const refs = {
    list: useRef<Array<HTMLElement | null>>([]),
    listContent: useRef<Array<string | null>>([]),
    overflow: useRef<SideObject>(null),
    allowSelect: useRef(false),
    allowMouseUp: useRef(true),
    selectTimeout: useRef<ReturnType<typeof setTimeout>>(),
    scroll: useRef<HTMLDivElement>(null),
  }

  // 状态管理 - 按功能分组状态以提高可读性
  // UI 状态
  const [open, setOpen] = useState(false)
  const [fallback, setFallback] = useState(false)
  const [touch, setTouch] = useState(false)
  const [scrollTop, setScrollTop] = useState(0)

  // 选择状态
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [blockSelection, setBlockSelection] = useState(false)
  const [innerOffset, setInnerOffset] = useState(0)

  // 合并受控与非受控打开状态
  const isControlledOpen = controlledOpen !== undefined ? controlledOpen : open

  // 生成唯一 ID
  const baseId = useId()
  const menuId = `menu-${baseId}`

  // 处理打开状态变化的回调 - 使用 useEventCallback 确保稳定引用
  const handleOpenChange = useEventCallback((newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  })

  // 确定当前选中索引 - 优化记忆化，减少重复计算
  const currentSelectedIndex = useMemo(() => {
    if (value === undefined) return selectedIndex

    // 如果有值，找到索引
    const index = options.findIndex((option) => option.value === value)

    return index === -1 ? selectedIndex : index
  }, [value, selectedIndex, options])

  // 重置状态 - 当菜单关闭时
  if (!open) {
    if (innerOffset !== 0) setInnerOffset(0)
    if (fallback) setFallback(false)
    if (blockSelection) setBlockSelection(false)
  }

  // 使用 floating-ui 设置浮动菜单 - 优化中间件配置
  const floating = useFloating({
    placement,
    open: isControlledOpen,
    onOpenChange: handleOpenChange,
    whileElementsMounted: (reference, floating, update) => {
      // 优化更新策略，使用 RAF 节流更新
      return autoUpdate(reference, floating, () => requestAnimationFrame(update), {
        animationFrame: true,
      })
    },
    transform: false,
    middleware: fallback
      ? [
          off(8),
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
          off(placement.includes("end") ? { crossAxis: 8 } : { crossAxis: -8 }),
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

  // 设置交互处理程序 - 优化配置，明确分离关注点
  const interactions = useInteractions([
    useClick(floating.context, { event: "mousedown" }),
    useDismiss(floating.context),
    useRole(floating.context, { role: "listbox" }),
    useInnerOffset(floating.context, {
      enabled: !fallback,
      onChange: (offset) => setInnerOffset(offset as number),
      overflowRef: refs.overflow,
      scrollRef: refs.scroll,
    }),
    useListNavigation(floating.context, {
      listRef: refs.list,
      activeIndex,
      selectedIndex: currentSelectedIndex >= 0 ? currentSelectedIndex : 0,
      onNavigate: setActiveIndex,
    }),
    useTypeahead(floating.context, {
      listRef: refs.listContent,
      activeIndex,
      onMatch: open
        ? setActiveIndex
        : (index) => {
            if (index !== -1) setSelectedIndex(index)
          },
    }),
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

  // 处理箭头滚动 - 优化事件回调，使用 useEventCallback 确保稳定引用
  const handleArrowScroll = useEventCallback((amount: number) => {
    requestAnimationFrame(() => {
      if (fallback) {
        if (refs.scroll.current) {
          refs.scroll.current.scrollTop -= amount
          flushSync(() => setScrollTop(refs.scroll.current?.scrollTop ?? 0))
        }
      } else {
        flushSync(() => setInnerOffset((value) => value - amount))
      }
    })
  })

  // 处理箭头隐藏 - 优化事件回调，使用 useEventCallback 确保稳定引用
  const handleArrowHide = useEventCallback(() => {
    if (touch) {
      if (refs.selectTimeout.current) {
        clearTimeout(refs.selectTimeout.current)
      }
      setBlockSelection(true)
      refs.selectTimeout.current = setTimeout(() => {
        setBlockSelection(false)
      }, 400)
    }
  })

  // 处理选择 - 优化事件回调，使用 useEventCallback 确保稳定引用
  const handleSelect = useEventCallback((index: number) => {
    if (refs.allowSelect.current) {
      setSelectedIndex(index)
      handleOpenChange(false)
      setOpen(false)

      const selectedOption = options[index]
      const resultValue = selectedOption.value ?? ""

      if (resultValue !== value) {
        onChange?.(resultValue)
      }
    }
  })

  // 注册列表项到 refs - 提取为可重用方法
  const registerItem = useCallback(
    (index: number, node: HTMLElement | null) => {
      refs.list.current[index] = node
      refs.listContent.current[index] = options[index]?.value || null
    },
    [options],
  )

  // 如果没有 triggerElement 或 contentElement，则无法渲染
  if (!triggerElement || !contentElement) {
    console.error(
      "Select requires both Select.Trigger and Select.Content components as children. Example: <Select><Select.Trigger>Trigger</Select.Trigger><Select.Content>{items}</Select.Content></Select>",
    )
    return null
  }

  // 渲染优化 - 提取通用属性，减少重复
  // 使用 useCallback 缓存渲染函数，避免不必要的重新创建
  const renderSelectItem = useCallback(
    (child: ReactElement, index: number) => {
      // 查找选项索引
      const optionIndex = options.findIndex((o) => o._originalIndex === index)
      if (optionIndex === -1) return null

      const option = options[optionIndex]
      const childProps = isValidElement(child) ? (child.props as SelectItemPublicProps) : {}
      const customActive = childProps.onClick

      // 选项状态计算
      const itemStates = {
        isActive: activeIndex === optionIndex,
        isSelected: currentSelectedIndex === optionIndex,
        isDisabled: blockSelection || !!option.disabled,
      }

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
          customActive ? childProps.onClick?.(e) : handleSelect(optionIndex)
        },
        onMouseUp: () => {
          if (!refs.allowMouseUp.current || customActive) return

          if (refs.allowSelect.current) {
            handleSelect(optionIndex)
          }

          // 清理并重设超时
          if (refs.selectTimeout.current) {
            clearTimeout(refs.selectTimeout.current)
          }
          refs.selectTimeout.current = setTimeout(() => {
            refs.allowSelect.current = true
          })
        },
      }

      // 获取交互属性并合并事件处理器
      const itemProps = interactions.getItemProps(eventHandlers)

      return (
        <SelectItem
          key={option.value || `item-${index}`}
          value={option.value || ""}
          ref={(node) => registerItem(optionIndex, node)}
          active={itemStates.isActive}
          selected={itemStates.isSelected}
          disabled={itemStates.isDisabled}
          customActive={customActive ? true : undefined}
          {...itemProps}
        >
          {option.element && isValidElement(option.element) ? option.element.props.children : null}
        </SelectItem>
      )
    },
    [
      options,
      activeIndex,
      currentSelectedIndex,
      blockSelection,
      interactions,
      handleSelect,
      registerItem,
    ],
  )

  // 使用 useMemo 缓存列表项，以防止不必要的重新渲染
  const menuItems = useMemo(() => {
    return itemElements.map((child, index) => {
      if (!isValidElement(child)) return null

      if (child.type === MenuDivider) {
        return <MenuDivider key={`divider-${index}`} />
      }

      if (child.type === MenuLabel) {
        return (
          <MenuLabel
            key={`label-${index}`}
            selection
          >
            {child.props.children}
          </MenuLabel>
        )
      }

      return renderSelectItem(child, index)
    })
  }, [itemElements, renderSelectItem])

  const enhancedTriggerElement = useMemo(() => {
    if (!triggerElement) return null
    return cloneElement(triggerElement, {
      ...triggerElement.props,
      active: isControlledOpen,
    })
  }, [triggerElement, isControlledOpen])

  return (
    <>
      <Slot
        ref={floating.refs.setReference}
        aria-haspopup="menu"
        aria-expanded={isControlledOpen}
        aria-controls={menuId}
        {...interactions.getReferenceProps({
          disabled,
          onTouchStart() {
            setTouch(true)
          },
          onPointerMove({ pointerType }) {
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
            className="z-menu"
          >
            <FloatingFocusManager
              context={floating.context}
              modal={false}
              returnFocus={false}
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
                >
                  {cloneElement(contentElement, {
                    ref: refs.scroll,
                    matchTriggerWidth,
                    ...interactions.getFloatingProps({
                      onScroll({ currentTarget }) {
                        flushSync(() => setScrollTop(currentTarget.scrollTop))
                      },
                      onContextMenu(e) {
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
    </>
  )
})

// 创建并导出带有静态属性的 Select 组件
export const Select = Object.assign(SelectComponent, {
  Item: SelectItem,
  Trigger: MenuTrigger,
  Divider: MenuDivider,
  Label: MenuLabel,
  Content: SelectContent,
  Value: MenuValue,
}) as SelectComponentType
Select.displayName = "Select"
