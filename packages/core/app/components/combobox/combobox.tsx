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
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useFloatingTree,
  useInteractions,
  useListNavigation,
  useRole,
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
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useEventCallback } from "usehooks-ts"
import { tcx } from "~/utils"
import {
  MenuButton,
  MenuContext,
  MenuContextContent,
  MenuContextItem,
  MenuContextLabel,
  MenuDivider,
  MenuInput,
  MenuScrollArrow,
  MenuValue,
  useMenuScroll,
} from "../menus"
import { ComboboxTrigger } from "./combobox-trigger"

const PORTAL_ROOT_ID = "floating-menu-root"
const DEFAULT_OFFSET = 4

export interface ComboboxRef {
  handleKeyDown: (event: React.KeyboardEvent) => void
}

export interface ComboboxProps {
  autoSelection?: boolean
  children?: React.ReactNode
  disabled?: boolean
  focusManagerProps?: FloatingFocusManagerProps
  matchTriggerWidth?: boolean
  onBlur?: (value: string) => void
  onChange?: (value: string) => void
  onOpenChange?: (open: boolean, trigger?: "click" | "focus" | "input") => void
  open?: boolean
  placement?: Placement
  portalId?: string
  position?: { x: number; y: number } | null
  trigger?: "input" | "coordinate" // 新增：明确指定触发器类型
  value?: string
}

interface ComboboxComponentType
  extends React.ForwardRefExoticComponent<ComboboxProps & React.RefAttributes<ComboboxRef>> {
  Button: typeof MenuButton
  Content: typeof MenuContextContent
  Divider: typeof MenuDivider
  Input: typeof MenuInput
  Item: typeof MenuContextItem
  Label: typeof MenuContextLabel
  Trigger: typeof ComboboxTrigger
  Value: typeof MenuValue
}

const ComboboxComponent = memo(
  forwardRef<ComboboxRef, ComboboxProps>(function ComboboxComponent(props, ref) {
    const {
      children,
      autoSelection = true,
      disabled = false,
      placement = "bottom-start",
      portalId = PORTAL_ROOT_ID,
      matchTriggerWidth = true,
      open: controlledOpen,
      onChange,
      onBlur,
      onOpenChange,
      position,
      trigger = "input", // 默认为输入模式
      value: controlledValue = "",
      focusManagerProps = {
        returnFocus: true,
        modal: false,
      },
    } = props

    // References
    const scrollRef = useRef<HTMLDivElement>(null)
    const selectTimeoutRef = useRef<ReturnType<typeof setTimeout>>()
    const elementsRef = useRef<Array<HTMLButtonElement | null>>([])
    const labelsRef = useRef<Array<string | null>>([])
    const inputRef = useRef<HTMLInputElement>(null)

    // 状态管理
    const [isOpen, setIsOpen] = useState(false)
    const [inputValue, setInputValue] = useState(controlledValue)
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const [scrollTop, setScrollTop] = useState(0)
    const [touch, setTouch] = useState(false)

    // 坐标模式检测 - 基于明确的 trigger prop
    const isCoordinateMode = trigger === "coordinate"

    // 受控/非受控状态处理 - 坐标模式下强制使用受控模式
    const isControlledOpen = isCoordinateMode
      ? (controlledOpen ?? false)
      : controlledOpen === undefined
        ? isOpen
        : controlledOpen

    // FloatingNode 相关
    const tree = useFloatingTree()
    const nodeId = useFloatingNodeId()
    const parentId = useFloatingParentNodeId()

    // 生成唯一 ID
    const baseId = useId()
    const listboxId = `combobox-listbox-${baseId}`

    // 同步外部 value
    useEffect(() => {
      setInputValue(controlledValue)
    }, [controlledValue])

    // 内部状态更新逻辑
    const updateInputState = useEventCallback((value: string, triggerCallback = true) => {
      setInputValue(value)
      const activeIndex = autoSelection ? 0 : null

      if (triggerCallback) {
        onChange?.(value)
      }

      if (value) {
        setActiveIndex(activeIndex)
        if (controlledOpen === undefined) {
          setIsOpen(true)
        }
        onOpenChange?.(true, "input")
      } else {
        if (controlledOpen === undefined) {
          setIsOpen(false)
        }
        onOpenChange?.(false, "input")
      }
    })

    // 值变化处理 - 对外回调
    const handleValueChange = useEventCallback((value: string) => {
      updateInputState(value, true)
    })

    // 处理trigger点击
    const handleTriggerClick = useEventCallback(() => {
      if (disabled) return

      // 当点击trigger时，强制打开菜单
      if (controlledOpen === undefined) {
        setIsOpen(!isOpen)
      }
      onOpenChange?.(true, "click")
    })

    // DOM 事件处理器
    const handleInputChange = useEventCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      handleValueChange(value)
    })

    // Focus 处理 - 有值时显示菜单
    const handleInputFocus = useEventCallback((event: React.FocusEvent<HTMLInputElement>) => {
      const activeIndex = autoSelection ? 0 : null
      // 如果有值，focus时也应该显示菜单
      if (inputValue.trim()) {
        // if (controlledOpen === undefined) {
        //   setIsOpen(true)
        // }
        onOpenChange?.(true, "focus")
        setActiveIndex(activeIndex)
      }
    })

    // 虚拟定位函数 - 用于坐标模式
    const setVirtualPosition = useEventCallback((pos: { x: number; y: number }) => {
      refs.setPositionReference({
        getBoundingClientRect() {
          return {
            x: pos.x,
            y: pos.y,
            width: 0,
            height: 0,
            left: pos.x,
            right: pos.x,
            top: pos.y,
            bottom: pos.y,
          }
        },
        contextElement: document.body,
      })
    })

    // 使用 ref 避免重复设置虚拟位置
    const lastPositionRef = useRef<{ x: number; y: number } | null>(null)

    // Floating UI 配置
    const { context, refs, floatingStyles, isPositioned } = useFloating({
      nodeId,

      open: isControlledOpen,
      onOpenChange: (newOpen, event, reason) => {
        if (controlledOpen === undefined) {
          setIsOpen(newOpen)
        }

        // 根据事件类型确定触发方式
        let trigger: "click" | "focus" | "input" = "click"
        if (reason === "outside-press" || reason === "escape-key") {
          trigger = "click"
        }

        onOpenChange?.(newOpen, trigger)
        if (!newOpen) {
          setActiveIndex(null)
        }
      },
      placement,
      middleware: [
        offset({ mainAxis: DEFAULT_OFFSET, alignmentAxis: 0 }),
        flip(),
        shift(),
        size({
          padding: 4,
          apply(args) {
            const { elements, availableHeight, rects } = args
            // 设置最大高度以防止溢出
            Object.assign(elements.floating.style, {
              maxHeight: `${availableHeight}px`,
            })
            // 只在非坐标模式且需要匹配trigger宽度时设置宽度
            if (!isCoordinateMode && matchTriggerWidth && rects.reference.width > 0) {
              elements.floating.style.width = `${rects.reference.width}px`
            }
          },
        }),
      ],
      whileElementsMounted: autoUpdate,
    })

    // 交互处理器
    const role = useRole(context, { role: "listbox" })
    const dismiss = useDismiss(context)
    const listNavigation = useListNavigation(context, {
      listRef: elementsRef,
      activeIndex,
      onNavigate: setActiveIndex,
      virtual: true,
      loop: true,
      allowEscape: true, // 官方案例中有这个设置
      selectedIndex: activeIndex, // 确保选中状态同步
    })

    const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
      role,
      dismiss,
      listNavigation,
    ])

    // 同步设置虚拟位置 - 坐标模式下使用
    useLayoutEffect(() => {
      if (position && isCoordinateMode) {
        // 只要有position就设置虚拟定位，不管是否open
        if (
          !lastPositionRef.current ||
          lastPositionRef.current.x !== position.x ||
          lastPositionRef.current.y !== position.y
        ) {
          setVirtualPosition(position)
          lastPositionRef.current = position
        }
      }
    }, [position, isCoordinateMode, setVirtualPosition])

    // 坐标模式下自动选择第一项
    useEffect(() => {
      if (isCoordinateMode && isControlledOpen && autoSelection) {
        // 稍微延迟确保元素已经渲染
        const timer = setTimeout(() => {
          if (elementsRef.current.length > 0 && activeIndex === null) {
            setActiveIndex(0)
          }
        }, 16) // 使用 16ms 确保在下一帧渲染后执行

        return () => clearTimeout(timer)
      }
    }, [isCoordinateMode, isControlledOpen, autoSelection, activeIndex, elementsRef.current.length])

    // 坐标模式下，当过滤结果变化时重新自动选择第一项
    useEffect(() => {
      if (isCoordinateMode && isControlledOpen && autoSelection && elementsRef.current.length > 0) {
        if (activeIndex === null || activeIndex >= elementsRef.current.length) {
          setActiveIndex(0)
        }
      }
    }, [isCoordinateMode, isControlledOpen, autoSelection, activeIndex, elementsRef.current.length])

    // 使用共享的滚动逻辑
    const { handleArrowScroll, handleArrowHide, getScrollProps } = useMenuScroll({
      scrollRef,
      selectTimeoutRef,
      scrollTop,
      setScrollTop,
      touch,
      isSelect: false, // Combobox 不是 Select
      fallback: false, // Combobox 没有 fallback 机制
      setInnerOffset: undefined, // Combobox 不使用 innerOffset
    })

    // 触摸处理
    const handleTouchStart = useEventCallback(() => {
      setTouch(true)
    })

    const handlePointerMove = useEventCallback(({ pointerType }: React.PointerEvent) => {
      if (pointerType !== "touch") {
        setTouch(false)
      }
    })

    // Tree 事件处理
    useEffect(() => {
      if (!tree) return

      const handleTreeClick = () => {
        if (controlledOpen === undefined) {
          setIsOpen(false)
        }
        onOpenChange?.(false)
      }

      tree.events.on("click", handleTreeClick)

      return () => {
        tree.events.off("click", handleTreeClick)
      }
    }, [tree, controlledOpen, onOpenChange])

    // 发送菜单打开事件
    useEffect(() => {
      if (isControlledOpen && tree) {
        tree.events.emit("menuopen", { parentId, nodeId })
      }
    }, [tree, isControlledOpen, nodeId, parentId])

    const handleKeyDown = useEventCallback(
      (event: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>) => {
        if (event.key === "Enter" && activeIndex !== null && isControlledOpen) {
          event.preventDefault()
          const activeElement = elementsRef.current[activeIndex]

          if (activeElement) {
            activeElement.click()
          }
        }
      },
    )

    // 创建关闭方法
    const handleClose = useEventCallback(() => {
      if (controlledOpen === undefined) {
        setIsOpen(false)
      }
      onOpenChange?.(false)
    })

    // 处理子元素
    const { triggerElement, contentElement } = useMemo(() => {
      const childrenArray = Children.toArray(children)

      const trigger = childrenArray.find(
        (child) => isValidElement(child) && child.type === ComboboxTrigger,
      ) as React.ReactElement | null

      const content = childrenArray.find(
        (child) => isValidElement(child) && child.type === MenuContextContent,
      ) as React.ReactElement | null

      return {
        triggerElement: trigger,
        contentElement: content,
      }
    }, [children])

    // 创建 MenuContext 值
    const contextValue = useMemo(
      () => ({
        activeIndex,
        setActiveIndex,
        getItemProps,
        setHasFocusInside: () => {},
        isOpen: isControlledOpen,
        selection: false,
        close: handleClose,
      }),
      [activeIndex, getItemProps, handleClose, isControlledOpen],
    )

    return (
      <FloatingNode id={nodeId}>
        {!isCoordinateMode && (
          <div
            ref={refs.setReference}
            onTouchStart={handleTouchStart}
            onPointerMove={handlePointerMove}
          >
            {triggerElement &&
              cloneElement(triggerElement, {
                ...getReferenceProps({
                  ref: inputRef,
                  onChange: handleInputChange,
                  onFocus: handleInputFocus,
                  value: inputValue,
                  "aria-autocomplete": "list" as const,
                  "aria-haspopup": "listbox",
                  "aria-expanded": isControlledOpen,
                  "aria-controls": listboxId,
                  onKeyDown: handleKeyDown,
                }),
                onChange: handleValueChange,
                active: isControlledOpen,
                onBlur,
                disabled,
                onClick: handleTriggerClick,
              })}
          </div>
        )}

        {/* Floating content */}
        <FloatingList
          elementsRef={elementsRef}
          labelsRef={labelsRef}
        >
          <FloatingPortal id={portalId}>
            {isControlledOpen && (
              <FloatingOverlay
                lockScroll={!touch}
                className={tcx("z-menu", focusManagerProps.modal ? "" : "pointer-events-none")}
              >
                <FloatingFocusManager
                  context={context}
                  initialFocus={-1}
                  visuallyHiddenDismiss
                  {...focusManagerProps}
                >
                  <div
                    id={listboxId}
                    style={floatingStyles}
                    ref={refs.setFloating}
                    {...getFloatingProps({
                      ...getScrollProps(),
                      onContextMenu(e: React.MouseEvent) {
                        e.preventDefault()
                      },
                      // 坐标模式下添加键盘事件处理
                      ...(isCoordinateMode && {
                        tabIndex: 0,
                        onKeyDown: handleKeyDown,
                      }),
                    })}
                  >
                    <MenuContext.Provider value={contextValue}>
                      {contentElement &&
                        cloneElement(contentElement, {
                          ref: scrollRef,
                          matchTriggerWidth,
                        })}
                    </MenuContext.Provider>

                    {/* 滚动箭头 */}
                    {["up", "down"].map((dir) => (
                      <MenuScrollArrow
                        key={dir}
                        dir={dir as "up" | "down"}
                        scrollTop={scrollTop}
                        scrollRef={scrollRef}
                        innerOffset={0} // Combobox 不使用 innerOffset
                        isPositioned={isPositioned}
                        onScroll={handleArrowScroll}
                        onHide={handleArrowHide}
                      />
                    ))}
                  </div>
                </FloatingFocusManager>
              </FloatingOverlay>
            )}
          </FloatingPortal>
        </FloatingList>
      </FloatingNode>
    )
  }),
)

// 基础 Combobox 组件 - 参考 Dropdown 结构
const BaseCombobox = memo(function Combobox(props: ComboboxProps) {
  const { children, ...rest } = props
  const parentId = useFloatingParentNodeId()

  if (parentId === null) {
    return (
      <FloatingTree>
        <ComboboxComponent {...rest}>{children}</ComboboxComponent>
      </FloatingTree>
    )
  }

  return <ComboboxComponent {...props}>{children}</ComboboxComponent>
})

// 导出带有静态属性的组件
export const Combobox = Object.assign(BaseCombobox, {
  displayName: "Combobox",
  Trigger: ComboboxTrigger,
  Item: MenuContextItem,
  Divider: MenuDivider,
  Label: MenuContextLabel,
  Button: MenuButton,
  Input: MenuInput,
  Content: MenuContextContent,
  Value: MenuValue,
}) as unknown as ComboboxComponentType
