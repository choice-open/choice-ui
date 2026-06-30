import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { useEventCallback } from "usehooks-ts"

export interface PopoverPosition {
  x: number
  y: number
}

type Position = PopoverPosition

interface DragState {
  isDragging: boolean
  position: Position | null
}

interface UseDragOptions {
  defaultPosition?: Position
  draggable: boolean
  floatingRef: { current: HTMLElement | null }
  onPositionChange?: (position: Position) => void
  rememberPosition?: boolean
}

// Constants
const MIN_VISIBLE_RATIO = 0.25 // At least 25% of the window width should be visible
const HEADER_HEIGHT = 40 // Header height

/**
 * Adjust position to ensure element is visible in viewport
 * @param position current position
 * @param dialogRect element's bounding rectangle
 * @param viewportWidth viewport width
 * @param viewportHeight viewport height
 */
function adjustPosition(
  position: Position,
  dialogRect: DOMRect,
  viewportWidth?: number,
  viewportHeight?: number,
): Position {
  const vw = viewportWidth ?? (typeof window !== "undefined" ? window.innerWidth : 0)
  const vh = viewportHeight ?? (typeof window !== "undefined" ? window.innerHeight : 0)
  // Ensure at least 25% of the window width is visible
  const minVisibleWidth = dialogRect.width * MIN_VISIBLE_RATIO
  const maxLeft = vw - minVisibleWidth
  const minLeft = minVisibleWidth - dialogRect.width

  // Ensure header is always visible
  const maxTop = vh - HEADER_HEIGHT
  const minTop = 0

  return {
    x: Math.min(Math.max(position.x, minLeft), maxLeft),
    y: Math.min(Math.max(position.y, minTop), maxTop),
  }
}

/**
 * Drag functionality Hook
 * @param options configuration options
 * @returns drag state and control methods
 */
export function useDrag({
  defaultPosition,
  draggable,
  floatingRef,
  onPositionChange,
  rememberPosition = false,
}: UseDragOptions) {
  const [state, setState] = useState<DragState>(() => ({
    isDragging: false,
    position: defaultPosition ?? null,
  }))

  const [floatingElement, setFloatingElement] = useState<HTMLElement | null>(null)

  // Use useRef to store position, avoid unnecessary re-rendering
  const positionRef = useRef<Position | null>(defaultPosition ?? null)
  const initialPositionRef = useRef<Position | null>(null)
  const dragOriginRef = useRef({ x: 0, y: 0 })
  const contentRef = useRef<HTMLDivElement>(null)
  const rafIdRef = useRef<number | null>(null)
  const pendingRef = useRef(false)

  // defaultValue semantics: the latest prop value is read only when the
  // floating element mounts, so changes while open have no effect.
  // Synced in a layout effect declared before the seeding effect below,
  // so the seeding effect always reads the current render's value.
  const defaultPositionRef = useRef<Position | null>(defaultPosition ?? null)
  useLayoutEffect(() => {
    defaultPositionRef.current = defaultPosition ?? null
  })

  // A seeded defaultPosition has not been clamped to the viewport yet
  const pendingDefaultClampRef = useRef(defaultPosition != null)

  const handlePositionChange = useEventCallback((position: Position) => {
    onPositionChange?.(position)
  })

  // Start drag
  const handleDragStart = useEventCallback((e: React.MouseEvent) => {
    if (!draggable) return
    if (contentRef.current?.contains(e.target as Node)) return
    if (!floatingRef.current) return

    const rect = floatingRef.current.getBoundingClientRect()
    if (!rect) return

    e.preventDefault()
    e.stopPropagation()

    // Record initial position (only on first record)
    if (!initialPositionRef.current) {
      initialPositionRef.current = {
        x: rect.left,
        y: rect.top,
      }
    }

    // Record drag origin
    dragOriginRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }

    // Set initial position - use current position first
    const currentPosition = positionRef.current || {
      x: rect.left,
      y: rect.top,
    }

    setState({
      isDragging: true,
      position: currentPosition,
    })
  })

  // Drag process
  const handleDrag = useCallback(
    (e: MouseEvent) => {
      if (!draggable || !state.isDragging || !floatingRef.current) return

      // Calculate new position
      const x = e.clientX - dragOriginRef.current.x
      const y = e.clientY - dragOriginRef.current.y
      positionRef.current = { x, y }

      // Use rAF to merge multiple mousemove updates within the same frame
      if (pendingRef.current) return
      pendingRef.current = true

      rafIdRef.current = requestAnimationFrame(() => {
        pendingRef.current = false
        setState((prev) => ({
          ...prev,
          position: positionRef.current,
        }))
      })
    },
    [draggable, state.isDragging, floatingRef],
  )

  // End drag
  const handleDragEnd = useCallback(() => {
    if (!draggable) return

    // Cancel pending rAF when ending
    if (rafIdRef.current != null) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
      pendingRef.current = false
    }

    if (floatingRef.current && state.position) {
      const dialogRect = floatingRef.current.getBoundingClientRect()
      const adjustedPosition = adjustPosition(state.position, dialogRect)

      // Update position in ref
      positionRef.current = adjustedPosition

      setState({
        isDragging: false,
        position: adjustedPosition,
      })

      handlePositionChange(adjustedPosition)
    } else {
      setState({
        isDragging: false,
        position: positionRef.current,
      })
    }
  }, [draggable, state.position, floatingRef, handlePositionChange])

  // Reset drag state
  const resetDragState = useCallback(() => {
    setState({
      isDragging: false,
      position: positionRef.current,
    })
  }, [])

  // Reset position to initial state - only when not remembering position
  const resetPosition = useCallback(() => {
    if (!rememberPosition) {
      setState((prev) => ({
        ...prev,
        position: initialPositionRef.current,
      }))
    }
  }, [rememberPosition])

  // Add and remove event listeners
  useEffect(() => {
    if (draggable && state.isDragging) {
      document.addEventListener("mousemove", handleDrag)
      document.addEventListener("mouseup", handleDragEnd)
      return () => {
        document.removeEventListener("mousemove", handleDrag)
        document.removeEventListener("mouseup", handleDragEnd)
      }
    }
  }, [draggable, state.isDragging, handleDrag, handleDragEnd])

  // Clamp a seeded defaultPosition once the floating element can be measured.
  // The first layout pass may happen before the content is rendered
  // (positionReady gates it), so a zero-size rect is skipped and the clamp is
  // retried on the next frame.
  const applyDefaultPositionClamp = useCallback(() => {
    const element = floatingRef.current
    const position = positionRef.current
    if (!element || !position) return

    const dialogRect = element.getBoundingClientRect()
    if (dialogRect.width === 0 && dialogRect.height === 0) return

    const adjustedPosition = adjustPosition(position, dialogRect)
    if (adjustedPosition.x === position.x && adjustedPosition.y === position.y) return

    positionRef.current = adjustedPosition
    setState((prev) => (prev.isDragging ? prev : { ...prev, position: adjustedPosition }))
  }, [floatingRef])

  // Seed drag state when the floating element mounts. Runs as a layout effect
  // so a stale position from the previous open never reaches the screen.
  useLayoutEffect(() => {
    if (!floatingElement) return

    if (!rememberPosition) {
      const nextPosition = defaultPositionRef.current
      initialPositionRef.current = null
      positionRef.current = nextPosition
      pendingDefaultClampRef.current = nextPosition != null
      setState({
        isDragging: false,
        position: nextPosition,
      })
    }

    if (!pendingDefaultClampRef.current) return
    pendingDefaultClampRef.current = false
    applyDefaultPositionClamp()
    const rafId = requestAnimationFrame(applyDefaultPositionClamp)
    return () => cancelAnimationFrame(rafId)
  }, [floatingElement, rememberPosition, applyDefaultPositionClamp])

  // When rememberPosition changes
  useEffect(() => {
    if (!rememberPosition) {
      // If remembering position is closed, reset position to initial state
      resetPosition()
    }
  }, [rememberPosition, resetPosition])

  // Clean up rAF when component unmounts
  useEffect(() => {
    return () => {
      if (rafIdRef.current != null) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
      pendingRef.current = false
    }
  }, [])

  return {
    state,
    contentRef,
    handleDragStart,
    resetDragState,
    resetPosition,
    setFloatingElement,
  }
}
