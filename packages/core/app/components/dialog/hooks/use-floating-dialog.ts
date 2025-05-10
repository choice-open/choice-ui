import {
  autoUpdate as floatingAutoUpdate,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useMergedValue } from "~/hooks"

interface UseFloatingDialogParams {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  outsidePress?: boolean
  autoUpdate?: boolean
  draggable?: boolean
  resetDragState: () => void
  resetPosition?: () => void
  resetResizeState: () => void
  resetSize?: () => void
  rememberPosition?: boolean
  rememberSize?: boolean
  afterOpenChange?: (isOpen: boolean) => void
}

export function useFloatingDialog({
  open,
  defaultOpen,
  onOpenChange,
  outsidePress = false,
  autoUpdate = true,
  draggable,
  resetDragState,
  resetPosition,
  resetResizeState,
  resetSize,
  rememberPosition = false,
  rememberSize = false,
  afterOpenChange,
}: UseFloatingDialogParams) {
  const [isReady, setIsReady] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const rafIdRef = useRef<number | null>(null)

  const [innerOpen, setInnerOpen] = useMergedValue({
    value: open,
    defaultValue: defaultOpen,
    onChange: (isOpen) => {
      onOpenChange?.(isOpen)
    },
  })

  // 清理RAF
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [])

  const { refs, context, floatingStyles } = useFloating({
    open: innerOpen,
    onOpenChange: (open) => {
      // 只处理关闭情况
      if (!open) {
        // 设置正在关闭状态
        setIsClosing(true)
        // 先重置拖拽状态和调整尺寸状态，保持位置和尺寸不变
        resetDragState()
        resetResizeState()
        setIsReady(false)
        // 关闭Dialog
        setInnerOpen(false)

        // 如果不需要记住位置和尺寸，在下一帧重置它们
        const needReset = (!rememberPosition && resetPosition) || (!rememberSize && resetSize)

        if (needReset) {
          // 清理可能存在的之前的RAF
          if (rafIdRef.current !== null) {
            cancelAnimationFrame(rafIdRef.current)
          }

          // 在下一帧重置位置和尺寸，确保UI先更新
          rafIdRef.current = requestAnimationFrame(() => {
            // 分别处理位置和尺寸的重置
            if (!rememberPosition && resetPosition) {
              resetPosition()
            }

            if (!rememberSize && resetSize) {
              resetSize()
            }

            setIsClosing(false)
            rafIdRef.current = null

            if (afterOpenChange) {
              afterOpenChange(false)
            }
          })
        } else {
          // 不需要重置任何东西
          if (afterOpenChange) {
            afterOpenChange(false)
          }
        }
      } else {
        setInnerOpen(open)
      }
    },
    whileElementsMounted: autoUpdate ? floatingAutoUpdate : undefined,
  })

  useEffect(() => {
    if (innerOpen) {
      setIsClosing(false)
      setIsReady(false)
      const frameId = requestAnimationFrame(() => {
        setIsReady(true)
        if (afterOpenChange) {
          afterOpenChange(innerOpen)
        }
      })
      return () => cancelAnimationFrame(frameId)
    }
  }, [innerOpen, afterOpenChange])

  const click = useClick(context)
  const dismiss = useDismiss(context, {
    outsidePress,
    escapeKey: true,
  })
  const role = useRole(context)

  const { getFloatingProps } = useInteractions([click, dismiss, role])

  const getStyles = useCallback(
    (
      dragPosition: { x: number; y: number } | null,
      resizeSize?: { width: number; height: number },
    ) => {
      // 如果存在拖拽位置且拖拽功能开启，优先使用拖拽位置
      if (dragPosition && draggable) {
        const dragStyles = {
          ...floatingStyles,
          position: "fixed",
          top: `${dragPosition.y}px`,
          left: `${dragPosition.x}px`,
          transform: "none",
          // 拖拽时移除过渡动画
          transition: "none",
        } as React.CSSProperties

        if (resizeSize) {
          dragStyles.width = `${resizeSize.width}px`
          dragStyles.height = `${resizeSize.height}px`
        }

        return dragStyles
      }

      // 默认居中样式
      const baseStyles = {
        ...floatingStyles,
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      } as React.CSSProperties

      if (resizeSize) {
        baseStyles.width = `${resizeSize.width}px`
        baseStyles.height = `${resizeSize.height}px`
      }

      return baseStyles
    },
    [floatingStyles, draggable],
  )

  const handleClose = useCallback(() => {
    if (innerOpen) {
      context.onOpenChange(false)
    }
  }, [innerOpen, context])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && innerOpen) {
        handleClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [innerOpen, handleClose])

  return {
    refs,
    context,
    isReady,
    isClosing,
    innerOpen,
    setInnerOpen,
    getFloatingProps,
    getStyles,
    handleClose,
  }
}
