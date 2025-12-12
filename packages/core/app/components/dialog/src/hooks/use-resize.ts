import { useCallback, useEffect, useRef, useState } from "react"
import { useEventCallback } from "usehooks-ts"

interface Size {
  height: number
  width: number
}

interface ResizeDirection {
  height: boolean
  width: boolean
}

interface ResizeState {
  isResizing: ResizeDirection | null
  size: Size | null
}

interface UseResizeOptions {
  defaultHeight?: number
  defaultWidth?: number
  enabled?: boolean
  maxHeight?: number
  maxWidth?: number
  minHeight?: number
  minWidth?: number
  onResizeEnd?: (size: Size) => void
  onResizeStart?: (e: React.MouseEvent, direction: ResizeDirection) => void
  rememberSize?: boolean
}

const MAX_SIZE_RATIO = 0.9

function adjustSize(
  size: Size,
  minWidth = 200,
  maxWidth?: number,
  minHeight = 100,
  maxHeight?: number,
): Size {
  const mw = maxWidth ?? (typeof window !== "undefined" ? window.innerWidth * MAX_SIZE_RATIO : 800)
  const mh =
    maxHeight ?? (typeof window !== "undefined" ? window.innerHeight * MAX_SIZE_RATIO : 600)
  return {
    width: Math.min(Math.max(size.width, minWidth), mw),
    height: Math.min(Math.max(size.height, minHeight), mh),
  }
}

// Get corresponding cursor style based on adjustment direction
function getCursorStyle(direction: ResizeDirection | null): string {
  if (!direction) return "default"
  if (direction.width && direction.height) return "nwse-resize"
  if (direction.width) return "ew-resize"
  if (direction.height) return "ns-resize"
  return "default"
}

export function useResize(
  elementRef: React.RefObject<HTMLElement>,
  options: UseResizeOptions = {},
) {
  const {
    enabled = true,
    defaultWidth,
    defaultHeight,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    onResizeStart,
    onResizeEnd,
    rememberSize = false,
  } = options

  const [state, setState] = useState<ResizeState>({
    isResizing: null,
    size: null,
  })

  // Use Ref to store size, avoid unnecessary re-rendering
  const sizeRef = useRef<Size | null>(null)
  // Record initial size for reset
  const initialSizeRef = useRef<Size | null>(null)
  const resizeOriginRef = useRef({ x: 0, y: 0, width: 0, height: 0 })
  const isInitializedRef = useRef(false)
  const resizeOffsetRef = useRef({ x: 0, y: 0 })

  // Use default size or DOM size to initialize
  useEffect(() => {
    if (!isInitializedRef.current && elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect()

      // If default size is provided, use default size first
      const initialSize = {
        width: defaultWidth || rect.width,
        height: defaultHeight || rect.height,
      }

      // Record initial size for reset
      initialSizeRef.current = initialSize

      // Only set current size on first initialization or when rememberSize is false
      if (!sizeRef.current || !rememberSize) {
        sizeRef.current = initialSize
        setState((prev) => ({ ...prev, size: initialSize }))
      }

      isInitializedRef.current = true
    }
  }, [defaultWidth, defaultHeight, rememberSize])

  const handleResizeStart = useEventCallback((e: React.MouseEvent, direction: ResizeDirection) => {
    if (!enabled) return

    const rect = elementRef.current?.getBoundingClientRect()
    if (!rect) return

    e.preventDefault()
    e.stopPropagation()

    // Record initial size(only on first record)
    if (!initialSizeRef.current) {
      // Use default size or current size
      initialSizeRef.current = {
        width: defaultWidth || rect.width,
        height: defaultHeight || rect.height,
      }
    }

    // Set body cursor style
    document.body.style.cursor = getCursorStyle(direction)

    setState((prev) => ({ ...prev, isResizing: direction }))
    onResizeStart?.(e, direction)

    // Calculate mouse offset relative to adjustment handle
    if (direction.width) {
      resizeOffsetRef.current.x = rect.right - e.clientX
    }
    if (direction.height) {
      resizeOffsetRef.current.y = rect.bottom - e.clientY
    }

    resizeOriginRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: rect.width,
      height: rect.height,
    }
  })

  const handleResize = useCallback(
    (e: MouseEvent) => {
      if (!enabled || !state.isResizing) return

      const direction = state.isResizing
      const rect = elementRef.current?.getBoundingClientRect()
      if (!rect) return

      // Ensure cursor style is correct during dragging
      document.body.style.cursor = getCursorStyle(direction)

      let newWidth = rect.width
      let newHeight = rect.height

      if (direction.width) {
        newWidth = e.clientX + resizeOffsetRef.current.x - rect.left
      }
      if (direction.height) {
        newHeight = e.clientY + resizeOffsetRef.current.y - rect.top
      }

      const newSize = {
        width: direction.width ? newWidth : rect.width,
        height: direction.height ? newHeight : rect.height,
      }

      const adjustedSize = adjustSize(newSize, minWidth, maxWidth, minHeight, maxHeight)
      // Update Ref stored size
      sizeRef.current = adjustedSize
      setState((prev) => ({ ...prev, size: adjustedSize }))
    },
    [enabled, state.isResizing, minWidth, maxWidth, minHeight, maxHeight],
  )

  const handleResizeEnd = useCallback(() => {
    if (!enabled) return

    // Restore body cursor style
    document.body.style.cursor = "default"

    if (sizeRef.current) {
      onResizeEnd?.(sizeRef.current)
    }

    setState((prev) => ({ ...prev, isResizing: null }))
  }, [enabled, onResizeEnd])

  // Reset size state
  const resetResizeState = useCallback(() => {
    // Restore body cursor style
    document.body.style.cursor = "default"

    setState((prev) => ({
      ...prev,
      isResizing: null,
    }))
  }, [])

  // Reset size to initial state - only call when rememberSize is false
  const resetSize = useCallback(() => {
    if (!rememberSize && initialSizeRef.current) {
      sizeRef.current = initialSizeRef.current
      setState((prev) => ({
        ...prev,
        size: initialSizeRef.current,
      }))
    }
  }, [rememberSize])

  // Completely reset, including all states and references
  const reset = useCallback(() => {
    // Restore body cursor style
    document.body.style.cursor = "default"

    if (!rememberSize) {
      setState({
        isResizing: null,
        size: null,
      })
      sizeRef.current = null
      initialSizeRef.current = null
      isInitializedRef.current = false
    } else {
      // Reset resize state only when rememberSize is true
      resetResizeState()
    }
  }, [rememberSize, resetResizeState])

  // When rememberSize changes
  useEffect(() => {
    if (!rememberSize) {
      // Reset size to initial state when rememberSize is false
      resetSize()
    }
  }, [rememberSize, resetSize])

  useEffect(() => {
    if (enabled && state.isResizing) {
      // Add keyboard event listener, press ESC to cancel adjustment
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          handleResizeEnd()
        }
      }

      // Add window blur event listener, prevent adjustment state from not being properly cleaned when user switches windows
      const handleWindowBlur = () => {
        handleResizeEnd()
      }

      document.addEventListener("mousemove", handleResize)
      document.addEventListener("mouseup", handleResizeEnd)
      document.addEventListener("keydown", handleKeyDown)
      window.addEventListener("blur", handleWindowBlur)

      return () => {
        document.removeEventListener("mousemove", handleResize)
        document.removeEventListener("mouseup", handleResizeEnd)
        document.removeEventListener("keydown", handleKeyDown)
        window.removeEventListener("blur", handleWindowBlur)
        // Ensure cursor style is restored when cleaning up
        document.body.style.cursor = "default"
      }
    }
  }, [enabled, state.isResizing, handleResize, handleResizeEnd])

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.cursor = "default"
    }
  }, [])

  return {
    state,
    handleResizeStart,
    resetResizeState,
    resetSize,
    reset,
  }
}
