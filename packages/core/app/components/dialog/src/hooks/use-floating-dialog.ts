import {
  autoUpdate as floatingAutoUpdate,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  useTransitionStyles,
  UseTransitionStylesProps,
  type FloatingContext,
  type ReferenceType,
} from "@floating-ui/react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useMergedValue } from "@choice-ui/shared"
import { DialogPosition } from "../types"
import { calculateInitialPosition } from "../utils"

interface UseFloatingDialogParams {
  afterOpenChange?: (isOpen: boolean) => void
  autoUpdate?: boolean
  closeOnEscape?: boolean
  defaultOpen?: boolean
  initialPosition?: DialogPosition
  onOpenChange?: (open: boolean) => void
  open?: boolean
  outsidePress?: boolean
  positionPadding?: number
  rememberPosition?: boolean
  rememberSize?: boolean
  resetDragState: () => void
  resetPosition?: () => void
  resetResizeState: () => void
  resetSize?: () => void
  transitionStylesProps?: UseTransitionStylesProps
}

interface UseFloatingDialogReturn {
  context: FloatingContext
  getFloatingProps: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>
  getStyles: (
    dragPosition: { x: number; y: number } | null,
    resizeSize?: { height: number; width: number },
    elementRef?: React.RefObject<HTMLElement>,
  ) => React.CSSProperties
  handleClose: () => void
  innerOpen: boolean
  isClosing: boolean
  isMounted: boolean
  isReady: boolean
  refs: {
    floating: React.MutableRefObject<HTMLElement | null>
    reference: React.MutableRefObject<ReferenceType | null>
    setFloating: (node: HTMLElement | null) => void
    setReference: (node: ReferenceType | null) => void
  }
  setInnerOpen: (value: boolean) => void
  styles: React.CSSProperties
}

export function useFloatingDialog({
  open,
  defaultOpen,
  onOpenChange,
  outsidePress = false,
  autoUpdate = true,
  closeOnEscape = true,
  initialPosition = "center",
  resetDragState,
  resetPosition,
  resetResizeState,
  resetSize,
  rememberPosition = false,
  rememberSize = false,
  positionPadding = 32,
  afterOpenChange,
  transitionStylesProps = {
    duration: 0,
  },
}: UseFloatingDialogParams): UseFloatingDialogReturn {
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

  // Clean up RAF
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
      // Only handle close case
      if (!open) {
        // Set closing state
        setIsClosing(true)
        // Reset drag state and resize state, keep position and size
        resetDragState()
        resetResizeState()
        setIsReady(false)
        // Close Dialog
        setInnerOpen(false)

        // If rememberPosition and rememberSize are false, reset them in the next frame
        const needReset = (!rememberPosition && resetPosition) || (!rememberSize && resetSize)

        if (needReset) {
          // Clean up possible previous RAF
          if (rafIdRef.current !== null) {
            cancelAnimationFrame(rafIdRef.current)
          }

          // Reset position and size in the next frame, ensure UI updates first
          rafIdRef.current = requestAnimationFrame(() => {
            // Reset position and size separately
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
          // No need to reset anything
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

  const { isMounted, styles } = useTransitionStyles(context, transitionStylesProps)

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
    escapeKey: closeOnEscape,
  })
  const role = useRole(context)

  const { getFloatingProps } = useInteractions([click, dismiss, role])

  const getStyles = useCallback(
    (
      dragPosition: { x: number; y: number } | null,
      resizeSize?: { height: number; width: number },
      elementRef?: React.RefObject<HTMLElement>,
    ) => {
      // If drag position exists, use it first
      if (dragPosition) {
        const dragStyles = {
          ...floatingStyles,
          position: "fixed",
          top: `${dragPosition.y}px`,
          left: `${dragPosition.x}px`,
          transform: "none",
          // Remove transition animation when dragging
          transition: "none",
        } as React.CSSProperties

        if (resizeSize) {
          dragStyles.width = `${resizeSize.width}px`
          dragStyles.height = `${resizeSize.height}px`
        }

        return dragStyles
      }

      // If there is no drag position but there is an initial position set, calculate initial position
      if (initialPosition && initialPosition !== "center") {
        // Try to get actual element size
        let dialogWidth = resizeSize?.width || 512
        let dialogHeight = resizeSize?.height || 384

        // If there is elementRef, try to get actual size
        if (elementRef?.current) {
          const rect = elementRef.current.getBoundingClientRect()
          if (rect.width > 0 && rect.height > 0) {
            dialogWidth = rect.width
            dialogHeight = rect.height
          }
        }

        const position = calculateInitialPosition(
          initialPosition,
          dialogWidth,
          dialogHeight,
          positionPadding,
        )

        const initialStyles = {
          ...floatingStyles,
          position: "fixed",
          top: `${position.y}px`,
          left: `${position.x}px`,
          transform: "none",
        } as React.CSSProperties

        if (resizeSize) {
          initialStyles.width = `${resizeSize.width}px`
          initialStyles.height = `${resizeSize.height}px`
        }

        return initialStyles
      }

      // Default center style
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
    [floatingStyles, initialPosition, positionPadding],
  )

  const handleClose = useCallback(() => {
    if (innerOpen) {
      context.onOpenChange(false)
    }
  }, [innerOpen, context])

  useEffect(() => {
    // Only listen when dialog is open and Escape close is allowed
    if (!innerOpen || !closeOnEscape) {
      return
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Only stop propagation when actually handling this event
        e.stopPropagation()
        e.preventDefault()
        handleClose()
      }
    }

    // Use bubble phase (default) instead of capture phase
    // This allows child elements (like Input) to handle ESC first
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [innerOpen, closeOnEscape, handleClose])

  return {
    refs,
    context,
    isReady,
    isClosing,
    innerOpen,
    setInnerOpen,
    getFloatingProps,
    getStyles: (
      dragPosition: { x: number; y: number } | null,
      resizeSize?: { height: number; width: number },
      elementRef?: React.RefObject<HTMLElement>,
    ) => getStyles(dragPosition, resizeSize, elementRef),
    handleClose,
    isMounted,
    styles,
  }
}
