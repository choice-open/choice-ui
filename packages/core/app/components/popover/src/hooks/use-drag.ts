import { useCallback, useEffect, useRef, useState } from "react"
import { useEventCallback } from "usehooks-ts"

interface Position {
  x: number
  y: number
}

interface DragState {
  isDragging: boolean
  position: Position | null
}

interface UseDragOptions {
  draggable: boolean
  floatingRef: { current: HTMLElement | null }
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
export function useDrag({ draggable, floatingRef, rememberPosition = false }: UseDragOptions) {
  // Use useState to manage active state
  const [state, setState] = useState<DragState>({
    isDragging: false,
    position: null,
  })

  // Use useRef to store position, avoid unnecessary re-rendering
  const positionRef = useRef<Position | null>(null)
  const initialPositionRef = useRef<Position | null>(null)
  const dragOriginRef = useRef({ x: 0, y: 0 })
  const contentRef = useRef<HTMLDivElement>(null)
  const rafIdRef = useRef<number | null>(null)
  const pendingRef = useRef(false)

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
    } else {
      setState({
        isDragging: false,
        position: positionRef.current,
      })
    }
  }, [draggable, state.position, floatingRef])

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

  // Listen for floatingRef.current changes, reset initial position and drag state.
  useEffect(() => {
    if (rememberPosition) return
    initialPositionRef.current = null
    positionRef.current = null
    setState({
      isDragging: false,
      position: null,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [floatingRef.current])

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
  }
}
