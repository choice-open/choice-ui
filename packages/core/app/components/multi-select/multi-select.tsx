import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingList,
  FloatingNode,
  FloatingOverlay,
  FloatingPortal,
  FloatingTree,
  offset,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useFloatingTree,
  useInteractions,
  useListNavigation,
  useRole,
  useTypeahead,
  type FloatingFocusManagerProps,
  type Placement,
} from "@floating-ui/react"
import React, {
  Children,
  cloneElement,
  forwardRef,
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
  MenuValue,
  useMenuBaseRefs,
  useMenuScroll,
  useMenuScrollHeight,
  type MenuContextItemProps,
} from "../menus"
import { Slot } from "../slot"
import { MultiSelectTrigger } from "./components"
import { useMultiSelectSelection, useMultiSelectState } from "./hooks"
import { extractItemElements, filterSelectableOptions, processOptions } from "./utils"
import { ChipProps } from "../chip"

const PORTAL_ROOT_ID = "floating-menu-root"

export interface MultiSelectProps {
  children?: React.ReactNode
  className?: string
  closeOnSelect?: boolean
  disabled?: boolean
  focusManagerProps?: FloatingFocusManagerProps
  getDisplayValue?: (value: string) => string
  i18n?: {
    maxSelectionMessage?: (maxSelection: number) => string
    minSelectionMessage?: (minSelection: number) => string
  }
  matchTriggerWidth?: boolean
  maxChips?: number
  maxSelection?: number
  minSelection?: number
  onChange?: (values: string[]) => void
  onOpenChange?: (open: boolean) => void
  open?: boolean
  placeholder?: string
  placement?: Placement
  portalId?: string
  readonly?: boolean
  renderChip?: (props: {
    disabled?: boolean
    displayValue: string
    index: number
    onRemove?: (e: React.MouseEvent<HTMLButtonElement>) => void
    value: string
  }) => React.ReactNode
  root?: HTMLElement | null
  showValidationMessage?: boolean
  size?: "default" | "large"
  values?: string[]
  variant?: ChipProps["variant"]
}

interface MultiSelectComponentType
  extends React.ForwardRefExoticComponent<MultiSelectProps & React.RefAttributes<HTMLDivElement>> {
  Content: typeof MenuContextContent
  Divider: typeof MenuDivider
  Item: typeof MenuContextItem
  Label: typeof MenuContextLabel
  Trigger: typeof MultiSelectTrigger
  Value: typeof MenuValue
}

/**
 * MultiSelect - 多选组件，支持标准下拉定位
 *
 * 核心特性：
 * - 使用 Dropdown 的定位逻辑
 * - 支持最大/最小选择数量限制
 * - 支持多选状态管理
 * - 支持排他选项（组间互斥、全局互斥）
 * - 支持控制选择后是否关闭菜单（closeOnSelect）
 * - Trigger 不是 button，避免嵌套问题
 */
const MultiSelectComponent = memo(
  forwardRef<HTMLDivElement, MultiSelectProps>(function MultiSelectComponent(props, ref) {
    const {
      className,
      closeOnSelect = false,
      getDisplayValue,
      i18n,
      matchTriggerWidth = false,
      maxChips,
      maxSelection,
      minSelection,
      placeholder,
      renderChip,
      showValidationMessage = true,
      values = [],
      onChange,
      open: controlledOpen,
      onOpenChange,
      disabled = false,
      portalId = PORTAL_ROOT_ID,
      placement = "bottom-start",
      readonly = false,
      children,
      size: sizeProp = "default",
      variant = "default",
      focusManagerProps = {
        returnFocus: false,
        modal: true,
      },
      root,
    } = props

    // 提取子元素
    const [itemElements, triggerElement, contentElement] = useMemo(() => {
      if (!children) return [[], null, null]

      const childrenArray = Children.toArray(children)

      // 找到 MultiSelectTrigger 元素
      const trigger = childrenArray.find(
        (child) => isValidElement(child) && child.type === MultiSelectTrigger,
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
      const items = extractItemElements(contentChildren)
      return [items, trigger, content]
    }, [children])

    // 从 MenuContextItem 元素中提取选项数据
    const options = useMemo(() => processOptions(itemElements), [itemElements])

    // 创建只包含可选择items的数组（不包含divider和label）
    const selectableOptions = useMemo(() => filterSelectableOptions(options), [options])

    // References - 使用统一的 refs 管理
    const {
      scrollRef,
      elementsRef: listRef,
      labelsRef: listContentRef,
      selectTimeoutRef,
    } = useMenuBaseRefs()
    const allowSelectRef = useRef(false)

    // 状态管理
    const {
      open,
      setOpen,
      touch,
      setTouch,
      scrollTop,
      setScrollTop,
      activeIndex,
      setActiveIndex,
      validationMessage,
      setValidationMessage,
      isControlledOpen,
    } = useMultiSelectState({ controlledOpen, onOpenChange })

    // 生成唯一 ID
    const baseId = useId()
    const menuId = `menu-${baseId}`
    const nodeId = useFloatingNodeId()
    const tree = useFloatingTree()
    const parentId = useFloatingParentNodeId()

    // 处理打开状态变化
    const handleOpenChange = useEventCallback((newOpen: boolean) => {
      // 当组件被禁用时，不允许打开菜单
      if (disabled && newOpen) {
        return
      }

      if (controlledOpen === undefined) {
        setOpen(newOpen)
      }
      onOpenChange?.(newOpen)
    })

    // Floating UI 配置 - 使用 useMemo 缓存 middleware 数组，避免每次渲染都创建新数组
    const middleware = useMemo(
      () => [
        offset(8),
        flip(),
        shift(),
        size({
          padding: 4,
          apply(args) {
            const { elements, availableHeight, rects } = args
            // 使用 scrollHeight 获取内容的实际高度，而不是 clientHeight
            // scrollHeight 会随着内容变化自动更新，而 clientHeight 可能被 maxHeight 限制
            const contentHeight = scrollRef.current?.scrollHeight || elements.floating.scrollHeight

            // 根据内容实际高度和可用空间计算合适的高度
            const maxHeight = Math.min(contentHeight, availableHeight)

            Object.assign(elements.floating.style, {
              maxHeight: `${maxHeight}px`,
              display: "flex",
              flexDirection: "column",
            })

            // 确保 MenusBase (通过 scrollRef) 能够正确继承高度并滚动
            if (scrollRef.current) {
              scrollRef.current.style.height = "100%"
              scrollRef.current.style.maxHeight = "100%"
            }

            if (matchTriggerWidth) {
              elements.floating.style.width = `${rects.reference.width}px`
            }
          },
        }),
      ],
      [matchTriggerWidth, scrollRef],
    )

    const { refs, floatingStyles, context, isPositioned } = useFloating({
      nodeId,
      open: isControlledOpen,
      onOpenChange: handleOpenChange,
      placement,
      middleware,
      whileElementsMounted: autoUpdate,
    })

    // 交互处理器配置
    const click = useClick(context, {
      event: "click",
      stickIfOpen: false,
    })

    const dismiss = useDismiss(context, {
      bubbles: true,
      escapeKey: true,
    })

    const role = useRole(context, { role: "listbox" })

    const listNavigation = useListNavigation(context, {
      listRef,
      activeIndex,
      onNavigate: setActiveIndex,
    })

    const typeahead = useTypeahead(context, {
      listRef: listContentRef,
      activeIndex,
      onMatch: setActiveIndex,
    })

    const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
      click,
      dismiss,
      role,
      listNavigation,
      typeahead,
    ])

    // 菜单打开时的效果
    useEffect(() => {
      if (isControlledOpen) {
        selectTimeoutRef.current = setTimeout(() => {
          allowSelectRef.current = true
        }, 300)

        return () => {
          if (selectTimeoutRef.current) {
            clearTimeout(selectTimeoutRef.current)
          }
        }
      } else {
        allowSelectRef.current = false
      }
    }, [isControlledOpen, selectTimeoutRef])

    // 使用共享的滚动逻辑
    const { handleArrowScroll, handleArrowHide, scrollProps } = useMenuScroll({
      scrollRef,
      selectTimeoutRef,
      scrollTop,
      setScrollTop,
      touch,
      isSelect: false, // 使用 dropdown 的滚动逻辑
      fallback: false,
    })

    // 选择逻辑
    const { handleSelect: baseHandleSelect, handleRemove: baseHandleRemove } =
      useMultiSelectSelection({
        values,
        onChange,
        selectableOptions,
        maxSelection,
        minSelection,
        closeOnSelect,
        i18n,
        setValidationMessage,
        handleOpenChange,
      })

    // 处理选择 - 添加允许选择的检查
    const handleSelect = useEventCallback((index: number) => {
      if (readonly) return

      if (allowSelectRef.current) {
        baseHandleSelect(index)
      }
    })

    // 处理移除 - 添加 readonly 检查
    const handleRemove = useEventCallback((value: string) => {
      if (readonly) return
      baseHandleRemove(value)
    })

    // Tree 事件处理
    useEffect(() => {
      if (!tree) return

      const handleTreeClick = () => {
        // 根据 closeOnSelect 决定是否关闭菜单
        if (closeOnSelect) {
          handleOpenChange(false)
        }
      }

      const handleSubMenuOpen = (event: { nodeId: string; parentId: string }) => {
        if (event.nodeId !== nodeId && event.parentId === parentId) {
          handleOpenChange(false)
        }
      }

      tree.events.on("click", handleTreeClick)
      tree.events.on("menuopen", handleSubMenuOpen)

      return () => {
        tree.events.off("click", handleTreeClick)
        tree.events.off("menuopen", handleSubMenuOpen)
      }
    }, [tree, nodeId, parentId, handleOpenChange, closeOnSelect])

    // 发送菜单打开事件
    useEffect(() => {
      if (isControlledOpen && tree) {
        tree.events.emit("menuopen", { parentId, nodeId })
      }
    }, [tree, isControlledOpen, nodeId, parentId])

    // 确保滚动容器正确设置高度
    useMenuScrollHeight({
      isControlledOpen,
      isPositioned,
      scrollRef,
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
        selection: true,
        readonly,
        close: () => handleOpenChange(false),
      }),
      [activeIndex, setActiveIndex, getItemProps, isControlledOpen, readonly, handleOpenChange],
    )

    // 注册列表项
    const registerItem = useEventCallback((index: number, node: HTMLElement | null) => {
      listRef.current[index] = node
      const option = selectableOptions[index]
      listContentRef.current[index] = option ? option.value || null : null
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

        const isSelected = values.includes(option.value || "")
        const isDisabled = !!option.disabled

        // 检查是否有自定义的 onClick
        const childProps = option.element?.props as MenuContextItemProps
        const customActive = childProps?.onClick

        // 事件处理器
        const eventHandlers = {
          onTouchStart: () => {
            if (customActive) return
            allowSelectRef.current = true
          },
          onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => {
            if (customActive) return
            allowSelectRef.current = true
          },
          onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
            if (customActive) {
              childProps.onClick?.(e)
            } else {
              handleSelect(currentSelectableIndex)
            }
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
    }, [options, values, sizeProp, handleSelect, registerItem])

    // 增强触发器元素
    const valueDisabledMap = useMemo(() => {
      const map: Record<string, boolean> = {}
      values.forEach((v) => {
        const found = options.find((opt) => opt.value === v)
        map[v] = !!found?.disabled
      })
      return map
    }, [values, options])

    const enhancedTriggerElement = useMemo(() => {
      if (!triggerElement) return null

      return cloneElement(triggerElement, {
        ...triggerElement.props,
        values,
        onRemove: handleRemove,
        size: sizeProp,
        disabled,
        readonly,
        open: isControlledOpen,
        getDisplayValue,
        maxChips,
        placeholder,
        renderChip,
        variant,
        valueDisabledMap,
      })
    }, [
      triggerElement,
      values,
      handleRemove,
      sizeProp,
      disabled,
      readonly,
      isControlledOpen,
      getDisplayValue,
      maxChips,
      placeholder,
      renderChip,
      variant,
      valueDisabledMap,
    ])

    // 错误处理
    if (!triggerElement || !contentElement) {
      console.error(
        "MultiSelect requires both MultiSelect.Trigger and MultiSelect.Content components as children",
      )
      return null
    }

    return (
      <FloatingNode id={nodeId}>
        <Slot
          ref={refs.setReference}
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

        <FloatingPortal
          id={portalId}
          root={root}
        >
          {isControlledOpen && (
            <FloatingOverlay
              lockScroll={!touch}
              className={tcx("z-menu", focusManagerProps.modal ? "" : "pointer-events-none")}
            >
              <FloatingFocusManager
                context={context}
                {...focusManagerProps}
              >
                <div
                  style={{
                    opacity: isPositioned ? 1 : 0,
                  }}
                >
                  <div
                    id={menuId}
                    ref={refs.setFloating}
                    style={floatingStyles}
                    className={className}
                    {...getFloatingProps({
                      onContextMenu(e: React.MouseEvent) {
                        e.preventDefault()
                      },
                    })}
                  >
                    <MenuContext.Provider value={menuContextValue}>
                      {cloneElement(contentElement, {
                        ref: scrollRef,
                        matchTriggerWidth,
                        ...scrollProps,
                        children: (
                          <FloatingList
                            elementsRef={listRef}
                            labelsRef={listContentRef}
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
                        scrollRef={scrollRef}
                        innerOffset={0}
                        isPositioned={isPositioned}
                        onScroll={handleArrowScroll}
                        onHide={handleArrowHide}
                      />
                    ))}
                    {showValidationMessage && validationMessage && (
                      <div className="text-secondary-foreground px-3 py-2">{validationMessage}</div>
                    )}
                  </div>
                </div>
              </FloatingFocusManager>
            </FloatingOverlay>
          )}
        </FloatingPortal>
      </FloatingNode>
    )
  }),
)

const BaseMultiSelect = memo(function MultiSelect(props: MultiSelectProps) {
  const { children, ...rest } = props
  const parentId = useFloatingParentNodeId()

  if (parentId === null) {
    return (
      <FloatingTree>
        <MultiSelectComponent {...rest}>{children}</MultiSelectComponent>
      </FloatingTree>
    )
  }

  return <MultiSelectComponent {...props}>{children}</MultiSelectComponent>
})

// 创建并导出带有静态属性的 MultiSelect 组件
export const MultiSelect = Object.assign(BaseMultiSelect, {
  Item: MenuContextItem,
  Trigger: MultiSelectTrigger,
  Divider: MenuDivider,
  Label: MenuContextLabel,
  Content: MenuContextContent,
  Value: MenuValue,
}) as MultiSelectComponentType

MultiSelect.displayName = "MultiSelect"
