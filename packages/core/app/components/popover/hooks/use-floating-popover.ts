import type { Placement } from "@floating-ui/react"
import {
  flip,
  autoUpdate as floatingAutoUpdate,
  offset,
  safePolygon,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react"
import { useCallback, useEffect, useRef, useState, useMemo } from "react"
import { useEventCallback } from "usehooks-ts"
import { useMergedValue } from "~/hooks"

interface UseFloatingPopoverParams {
  autoSize?: boolean
  autoUpdate?: boolean
  closeOnEscape?: boolean
  defaultOpen?: boolean
  delay?: { close?: number; open?: number }
  draggable: boolean
  interactions?: "hover" | "click" | "focus" | "none"
  matchTriggerWidth?: boolean
  maxWidth?: number
  nodeId: string | undefined
  offset?: number
  onOpenChange?: (open: boolean) => void
  open?: boolean
  outsidePressIgnore?: string | string[] | boolean
  placement?: Placement
  rememberPosition?: boolean
  resetDragState: () => void
  resetPosition: () => void
}

export function useFloatingPopover({
  open,
  defaultOpen,
  onOpenChange,
  placement = "bottom",
  offset: offsetDistance = 8,
  interactions = "click",
  outsidePressIgnore,
  delay,
  autoUpdate = true,
  closeOnEscape = true,
  draggable,
  nodeId,
  resetDragState,
  resetPosition,
  rememberPosition = false,
  autoSize = true,
  maxWidth: maxWidthValue = 320,
  matchTriggerWidth = false,
}: UseFloatingPopoverParams) {
  const [isClosing, setIsClosing] = useState(false)
  const positionRef = useRef({ x: 0, y: 0 })

  const triggerRefs = useRef({
    last: null as HTMLElement | null,
    changed: false,
  })

  // 🔧 使用官方推荐的受控/非受控状态管理
  const [innerOpen, setInnerOpen] = useMergedValue({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })

  // 🔧 使用 useMemo 缓存 middleware 数组，避免每次渲染重新创建
  const middleware = useMemo(() => {
    return [
      offset(offsetDistance),
      flip({ padding: 8 }),
      shift({ mainAxis: true, crossAxis: true }),
      autoSize
        ? size({
            apply({ availableWidth, availableHeight, elements, rects }) {
              const maxWidth = Math.min(availableWidth, maxWidthValue)
              Object.assign(elements.floating.style, {
                maxWidth: matchTriggerWidth ? undefined : `${maxWidth}px`,
                maxHeight: `${availableHeight}px`,
              })
              if (matchTriggerWidth) {
                elements.floating.style.width = `${rects.reference.width}px`
              }
            },
            padding: 16,
          })
        : undefined,
    ].filter(Boolean) // 过滤掉 undefined
  }, [offsetDistance, autoSize, maxWidthValue, matchTriggerWidth])

  // 🔧 缓存 onOpenChange 回调，避免每次渲染重新创建
  const handleOpenChange = useEventCallback((nextOpen: boolean) => {
    if (!nextOpen) {
      // 关闭逻辑
      setIsClosing(true)
      resetDragState()
      setInnerOpen(false)

      // 如果不记住位置，重置位置
      if (!rememberPosition) {
        requestAnimationFrame(() => {
          resetPosition()
          setIsClosing(false)
        })
      } else {
        setIsClosing(false)
      }
    } else {
      // 开启逻辑
      setIsClosing(false)
      setInnerOpen(nextOpen)
    }
  })

  // 🔧 使用官方推荐的 useFloating 模式
  const { refs, floatingStyles, context, x, y, isPositioned } = useFloating({
    nodeId,
    open: innerOpen, // 直接传递状态
    onOpenChange: handleOpenChange,
    placement,
    middleware,
    whileElementsMounted: autoUpdate ? floatingAutoUpdate : undefined,
  })

  // 🔧 使用官方推荐的 isPositioned 来管理位置状态
  useEffect(() => {
    if (innerOpen && isPositioned && x !== null && y !== null) {
      // 保存位置信息
      positionRef.current = { x, y }
    }
  }, [innerOpen, isPositioned, x, y])

  const hover = useHover(context, {
    enabled: interactions === "hover",
    handleClose: safePolygon({ blockPointerEvents: true, buffer: 1 }),
    mouseOnly: true,
    restMs: 150,
  })

  const click = useClick(context, {
    enabled: interactions === "click",
    // 🔧 使用 mousedown 事件而不是 click，提前处理，避免与 dismiss 冲突
    event: "mousedown",
    // 🔧 如果已经有其他 Popover 打开，点击时保持逻辑一致
    stickIfOpen: false,
  })

  const focus = useFocus(context, {
    enabled: interactions === "focus",
  })

  const outsidePressHandler = useCallback(
    (event: MouseEvent) => {
      let checkingNode = event.target
      while (checkingNode instanceof Element) {
        if (outsidePressIgnore === true) {
          return false
        }
        if (
          outsidePressIgnore &&
          typeof outsidePressIgnore === "string" &&
          checkingNode instanceof Element &&
          checkingNode.classList.contains(outsidePressIgnore)
        ) {
          return false
        }
        if (
          outsidePressIgnore &&
          Array.isArray(outsidePressIgnore) &&
          outsidePressIgnore.some(
            (ignore) => checkingNode instanceof Element && checkingNode.classList.contains(ignore),
          )
        ) {
          return false
        }
        checkingNode = checkingNode.parentElement
      }
      return true
    },
    [outsidePressIgnore],
  )

  const dismiss = useDismiss(context, {
    enabled: interactions !== "none",
    escapeKey: closeOnEscape,
    outsidePress: outsidePressHandler,
    bubbles: true,
  })

  const role = useRole(context)

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    click,
    focus,
    dismiss,
    role,
  ])

  const getStyles = useCallback(
    (dragPosition: { x: number; y: number } | null, isDragging: boolean) => {
      // 如果存在拖拽位置且拖拽功能开启，优先使用拖拽位置
      const transform =
        dragPosition && draggable
          ? `translate(${dragPosition.x}px, ${dragPosition.y}px)`
          : `translate(${x}px, ${y}px)`

      return {
        ...floatingStyles,
        transform,
        // 仅在拖拽功能开启且正在拖拽时禁用过渡动画
        transition: draggable && isDragging ? "none" : floatingStyles.transition,
      } as React.CSSProperties
    },
    [floatingStyles, x, y, draggable],
  )

  const handleClose = useCallback(() => {
    if (innerOpen) {
      context.onOpenChange(false)
    }
  }, [innerOpen, context])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation()
        e.preventDefault()

        if (closeOnEscape) {
          handleClose()
        }
      }
    }

    window.addEventListener("keydown", handleEscape, { capture: true })
    return () => window.removeEventListener("keydown", handleEscape, { capture: true })
  }, [closeOnEscape, handleClose])

  const handleTriggerRef = useCallback(
    (triggerRef: React.RefObject<HTMLElement>) => {
      // 只有在触发器实际变化时才更新引用
      if (triggerRef?.current && triggerRef.current !== triggerRefs.current.last) {
        // 标记此次触发器变化
        triggerRefs.current.changed = true
        triggerRefs.current.last = triggerRef.current
        refs.setReference(triggerRef.current)
      }
    },
    [refs],
  )

  return {
    refs,
    triggerRefs,
    context,
    positionReady: isPositioned, // 🔧 使用官方的 isPositioned
    innerOpen,
    setInnerOpen,
    x,
    y,
    getReferenceProps,
    getFloatingProps,
    getStyles,
    handleClose,
    handleTriggerRef,
    isClosing,
  }
}
