import { useCallback, useEffect, useRef, useState } from "react"
import { useEventCallback } from "usehooks-ts"

// Constants
const MIN_VISIBLE_RATIO = 0.25
const HEADER_HEIGHT = 40

interface Position {
  x: number
  y: number
}

interface DragState {
  isDragging: boolean
  position: Position | null
}

interface UseDragOptions {
  enabled?: boolean
  onDragEnd?: (position: Position) => void
  onDragStart?: (e: React.MouseEvent) => void
  rememberPosition?: boolean
}

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

export function useDrag(elementRef: React.RefObject<HTMLElement>, options: UseDragOptions = {}) {
  const { enabled = true, onDragStart, onDragEnd, rememberPosition = false } = options

  // Use useState to manage active state
  const [state, setState] = useState<DragState>({
    isDragging: false,
    position: null,
  })

  // Use useRef to store position, avoid unnecessary re-rendering
  const positionRef = useRef<Position | null>(null)
  const initialPositionRef = useRef<Position | null>(null)
  const dragOriginRef = useRef({ x: 0, y: 0 })
  const isInitializedRef = useRef(false)
  const rafIdRef = useRef<number | null>(null)
  const pendingRef = useRef(false)

  // Initialize position when element is mounted
  useEffect(() => {
    if (!isInitializedRef.current && elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect()
      const position = { x: rect.left, y: rect.top }

      // Record initial position for reset
      initialPositionRef.current = position

      // Only set current position on first initialization
      if (!positionRef.current) {
        positionRef.current = position
        setState((prev) => ({ ...prev, position }))
      }

      isInitializedRef.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only set current position on first initialization

  const handleDragStart = useEventCallback((e: React.MouseEvent) => {
    if (!enabled) return

    const rect = elementRef.current?.getBoundingClientRect()
    if (!rect) return

    e.preventDefault()
    e.stopPropagation()

    // Record initial position(only on first record)
    if (!initialPositionRef.current) {
      initialPositionRef.current = {
        x: rect.left,
        y: rect.top,
      }
    }

    const currentX = positionRef.current?.x ?? rect.left
    const currentY = positionRef.current?.y ?? rect.top

    dragOriginRef.current = {
      x: e.clientX - currentX,
      y: e.clientY - currentY,
    }

    setState((prev) => ({ ...prev, isDragging: true }))
    onDragStart?.(e)

    // Set initial position - use current position first
    if (!positionRef.current) {
      const newPosition = { x: currentX, y: currentY }
      positionRef.current = newPosition
      setState((prev) => ({ ...prev, position: newPosition }))
    }
  })

  const handleDrag = useCallback(
    (e: MouseEvent) => {
      if (!enabled || !state.isDragging) return

      const x = e.clientX - dragOriginRef.current.x
      const y = e.clientY - dragOriginRef.current.y
      positionRef.current = { x, y }

      if (pendingRef.current) return
      pendingRef.current = true

      rafIdRef.current = requestAnimationFrame(() => {
        pendingRef.current = false
        setState((prev) => ({ ...prev, position: positionRef.current }))
      })
    },
    [enabled, state.isDragging],
  )

  const handleDragEnd = useCallback(() => {
    if (!enabled) return

    // Clean up rAF that was not executed before dragging ends
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
      pendingRef.current = false
    }

    if (elementRef.current && positionRef.current) {
      const dialogRect = elementRef.current.getBoundingClientRect()
      const adjustedPosition = adjustPosition(positionRef.current, dialogRect)

      // Update position state
      positionRef.current = adjustedPosition
      setState((prev) => ({ ...prev, position: adjustedPosition, isDragging: false }))
      onDragEnd?.(adjustedPosition)
    } else {
      setState((prev) => ({ ...prev, isDragging: false }))
    }
  }, [elementRef, enabled, onDragEnd])

  // Reset drag state
  const resetDragState = useCallback(() => {
    setState({
      isDragging: false,
      position: positionRef.current,
    })
  }, [])

  // Reset position to initial state - only call when rememberPosition is false
  const resetPosition = useCallback(() => {
    if (!rememberPosition) {
      positionRef.current = null
      setState((prev) => ({
        ...prev,
        position: null,
      }))
    }
  }, [rememberPosition])

  // Completely reset, including all states and references
  const reset = useCallback(() => {
    if (!rememberPosition) {
      // Reset completely when rememberPosition is false
      positionRef.current = null
      isInitializedRef.current = false
      initialPositionRef.current = null
      setState({
        isDragging: false,
        position: null,
      })
    } else {
      // Reset drag state only when rememberPosition is true
      resetDragState()
    }
  }, [rememberPosition, resetDragState])

  // When rememberPosition changes
  useEffect(() => {
    if (!rememberPosition) {
      // Reset position to initial state when rememberPosition is false
      resetPosition()
    }
  }, [rememberPosition, resetPosition])

  // Clean up rAF when unmounting
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
      pendingRef.current = false
    }
  }, [])

  useEffect(() => {
    if (enabled && state.isDragging) {
      document.addEventListener("mousemove", handleDrag)
      document.addEventListener("mouseup", handleDragEnd)
      return () => {
        document.removeEventListener("mousemove", handleDrag)
        document.removeEventListener("mouseup", handleDragEnd)
      }
    }
  }, [enabled, state.isDragging, handleDrag, handleDragEnd])

  return {
    state,
    handleDragStart,
    resetDragState,
    resetPosition,
    reset,
  }
}
