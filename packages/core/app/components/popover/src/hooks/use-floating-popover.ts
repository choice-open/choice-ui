import { useMergedValue } from "@choice-ui/shared"
import type {
  FloatingContext,
  OffsetOptions,
  Placement,
  ReferenceType,
  UseTransitionStylesProps,
} from "@floating-ui/react"
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
import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react"
import { useEventCallback } from "usehooks-ts"

interface UseFloatingPopoverReturn {
  context: FloatingContext
  getFloatingProps: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>
  getReferenceProps: (userProps?: React.HTMLProps<Element>) => Record<string, unknown>
  getStyles: (
    dragPosition: { x: number; y: number } | null,
    isDragging: boolean,
  ) => React.CSSProperties
  handleClose: () => void
  handleTriggerRef: (triggerRef: RefObject<HTMLElement | null>) => void
  innerOpen: boolean
  isClosing: boolean
  positionReady: boolean
  refs: {
    floating: React.MutableRefObject<HTMLElement | null>
    reference: React.MutableRefObject<ReferenceType | null>
    setFloating: (node: HTMLElement | null) => void
    setReference: (node: ReferenceType | null) => void
  }
  setInnerOpen: (value: boolean) => void
  triggerRefs: React.MutableRefObject<{
    changed: boolean
    last: HTMLElement | null
  }>
  x: number | null
  y: number | null
}

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
  offset?: OffsetOptions
  onOpenChange?: (open: boolean) => void
  open?: boolean
  outsidePressIgnore?: string | string[] | boolean
  placement?: Placement
  rememberPosition?: boolean
  resetDragState: () => void
  resetPosition: () => void
  transitionStylesProps?: UseTransitionStylesProps
}

export function useFloatingPopover({
  open,
  defaultOpen,
  onOpenChange,
  placement = "bottom",
  offset: offsetDistance = { mainAxis: 8, crossAxis: 0 },
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
  transitionStylesProps = {
    duration: 0,
  },
}: UseFloatingPopoverParams): UseFloatingPopoverReturn {
  const [isClosing, setIsClosing] = useState(false)
  const positionRef = useRef({ x: 0, y: 0 })

  const triggerRefs = useRef({
    last: null as HTMLElement | null,
    changed: false,
  })

  // Use official recommended controlled/uncontrolled state management
  const [innerOpen, setInnerOpen] = useMergedValue({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })

  // Use useMemo to cache middleware array, avoid creating them again on each render
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
    ].filter(Boolean) // Filter out undefined
  }, [offsetDistance, autoSize, maxWidthValue, matchTriggerWidth])

  // Cache onOpenChange callback, avoid creating them again on each render
  const handleOpenChange = useEventCallback((nextOpen: boolean) => {
    if (!nextOpen) {
      // Close logic
      setIsClosing(true)
      resetDragState()
      setInnerOpen(false)

      // If not remembering position, reset position
      if (!rememberPosition) {
        requestAnimationFrame(() => {
          resetPosition()
          setIsClosing(false)
        })
      } else {
        setIsClosing(false)
      }
    } else {
      // Open logic
      setIsClosing(false)
      setInnerOpen(nextOpen)
    }
  })

  // Use official recommended useFloating mode
  const { refs, floatingStyles, context, x, y, isPositioned } = useFloating({
    nodeId,
    open: innerOpen, // Pass state directly
    onOpenChange: handleOpenChange,
    placement,
    middleware,
    whileElementsMounted: autoUpdate ? floatingAutoUpdate : undefined,
  })

  // Use official recommended isPositioned to manage position state
  useEffect(() => {
    if (innerOpen && isPositioned && x !== null && y !== null) {
      // Save position information
      positionRef.current = { x, y }
    }
  }, [innerOpen, isPositioned, x, y])

  const hover = useHover(context, {
    enabled: interactions === "hover",
    handleClose: safePolygon({ blockPointerEvents: true, requireIntent: false, buffer: 10 }),
    mouseOnly: true,
    restMs: 150,
  })

  const click = useClick(context, {
    enabled: interactions === "click",
    // Use mousedown event instead of click, handle early, avoid conflict with dismiss
    event: "mousedown",
    // If another Popover is already open, keep logic consistent when clicking
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
      // If drag position exists and drag functionality is enabled, use fixed positioning (same as Dialog)
      if (dragPosition && draggable) {
        return {
          ...floatingStyles,
          position: "fixed",
          top: `${dragPosition.y}px`,
          left: `${dragPosition.x}px`,
          transform: "none",
          transition: isDragging ? "none" : floatingStyles.transition,
        } as React.CSSProperties
      }

      // Default use floating-ui's transform positioning
      return {
        ...floatingStyles,
        transform: `translate(${x}px, ${y}px)`,
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
    // Only listen when popover is open and Escape close is allowed
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

  const handleTriggerRef = useCallback(
    (triggerRef: RefObject<HTMLElement | null>) => {
      // Only update reference when trigger actually changes
      if (triggerRef?.current && triggerRef.current !== triggerRefs.current.last) {
        // Mark this trigger change
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
    positionReady: isPositioned,
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
