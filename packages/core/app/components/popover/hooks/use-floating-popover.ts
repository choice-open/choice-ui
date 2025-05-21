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
import { useCallback, useEffect, useRef, useState } from "react"
import { useMergedValue } from "~/hooks"

interface UseFloatingPopoverParams {
  autoSize?: boolean
  autoUpdate?: boolean
  defaultOpen?: boolean
  delay?: { close?: number; open?: number }
  draggable: boolean
  interactions?: "hover" | "click" | "focus" | "none"
  nodeId: string
  offset?: number
  onOpenChange?: (open: boolean) => void
  open?: boolean
  outsidePressIgnore?: string
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
  draggable,
  nodeId,
  resetDragState,
  resetPosition,
  rememberPosition = false,
  autoSize = true,
}: UseFloatingPopoverParams) {
  const [positionReady, setPositionReady] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const positionRef = useRef({ x: 0, y: 0 })
  const rafIdRef = useRef<number | null>(null)

  const triggerRefs = useRef({
    last: null as HTMLElement | null,
    changed: false,
  })

  const [innerOpen, setInnerOpen] = useMergedValue({
    value: open,
    defaultValue: defaultOpen,
    onChange: (isOpen) => {
      onOpenChange?.(isOpen)
    },
  })

  const middleware = [
    offset(offsetDistance),
    flip({ padding: 8 }),
    shift({ mainAxis: true, crossAxis: true }),
    autoSize
      ? size({
          apply({ availableWidth, availableHeight, elements }) {
            const maxWidth = Math.min(availableWidth, 320)
            Object.assign(elements.floating.style, {
              maxWidth: `${maxWidth}px`,
              maxHeight: `${availableHeight}px`,
            })
          },
          padding: 16,
        })
      : undefined,
  ]

  // 清理RAF
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [])

  const { refs, floatingStyles, context, x, y } = useFloating({
    nodeId,
    open: innerOpen,
    onOpenChange: (open) => {
      // 只处理关闭情况
      if (!open) {
        // 设置正在关闭状态
        setIsClosing(true)
        // 先重置拖拽状态，保持位置不变
        resetDragState()
        setPositionReady(false)
        // 关闭Popover
        setInnerOpen(false)

        // 如果不需要记住位置，在下一帧重置位置
        if (!rememberPosition) {
          // 清理可能存在的之前的RAF
          if (rafIdRef.current !== null) {
            cancelAnimationFrame(rafIdRef.current)
          }

          // 在下一帧重置位置，确保UI先更新
          rafIdRef.current = requestAnimationFrame(() => {
            resetPosition()
            setIsClosing(false)
            rafIdRef.current = null
          })
        }
      } else {
        setInnerOpen(open)
      }
    },
    placement,
    middleware,
    whileElementsMounted: autoUpdate ? floatingAutoUpdate : undefined,
  })

  // 打开时重置就绪状态
  useEffect(() => {
    if (innerOpen) {
      setIsClosing(false)
      setPositionReady(false)
    }
  }, [innerOpen])

  // 位置计算完成后设置就绪状态
  useEffect(() => {
    if (innerOpen && x !== null && y !== null) {
      // 保存位置信息
      positionRef.current = { x, y }

      // 使用RAF设置就绪状态
      const frameId = requestAnimationFrame(() => {
        setPositionReady(true)
      })

      return () => cancelAnimationFrame(frameId)
    }
  }, [innerOpen, x, y])

  const hover = useHover(context, {
    handleClose: safePolygon({ blockPointerEvents: true, buffer: 1 }),
    enabled: interactions === "hover",
    delay,
  })

  const click = useClick(context, {
    enabled: interactions === "click",
  })

  const focus = useFocus(context, {
    enabled: interactions === "focus",
  })

  const outsidePressHandler = useCallback(
    (event: MouseEvent) => {
      let checkingNode = event.target
      while (checkingNode instanceof Element) {
        if (outsidePressIgnore && checkingNode.classList.contains(outsidePressIgnore)) {
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
    escapeKey: true,
    outsidePress: outsidePressHandler,
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
    positionReady,
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
