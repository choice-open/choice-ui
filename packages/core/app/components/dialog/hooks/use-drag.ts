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
  viewportWidth = window.innerWidth,
  viewportHeight = window.innerHeight,
): Position {
  // 确保至少 25% 的窗口宽度在可视范围内
  const minVisibleWidth = dialogRect.width * MIN_VISIBLE_RATIO
  const maxLeft = viewportWidth - minVisibleWidth
  const minLeft = minVisibleWidth - dialogRect.width

  // 确保 header 始终在可视范围内
  const maxTop = viewportHeight - HEADER_HEIGHT
  const minTop = 0

  return {
    x: Math.min(Math.max(position.x, minLeft), maxLeft),
    y: Math.min(Math.max(position.y, minTop), maxTop),
  }
}

export function useDrag(elementRef: React.RefObject<HTMLElement>, options: UseDragOptions = {}) {
  const { enabled = true, onDragStart, onDragEnd, rememberPosition = false } = options

  // 使用useState管理活跃状态
  const [state, setState] = useState<DragState>({
    isDragging: false,
    position: null,
  })

  // 使用useRef存储位置，避免不必要的重渲染
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

      // 记录初始位置用于重置
      initialPositionRef.current = position

      // 仅在首次初始化时设置当前位置
      if (!positionRef.current) {
        positionRef.current = position
        setState((prev) => ({ ...prev, position }))
      }

      isInitializedRef.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // 仅在首次初始化时设置当前位置

  const handleDragStart = useEventCallback((e: React.MouseEvent) => {
    if (!enabled) return

    const rect = elementRef.current?.getBoundingClientRect()
    if (!rect) return

    e.preventDefault()
    e.stopPropagation()

    // 记录初始位置(只在首次记录)
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

    // 设置初始位置 - 优先使用当前位置
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

    // 结束拖拽前清理未执行的 rAF
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
      pendingRef.current = false
    }

    if (elementRef.current && positionRef.current) {
      const dialogRect = elementRef.current.getBoundingClientRect()
      const adjustedPosition = adjustPosition(positionRef.current, dialogRect)

      // 更新位置状态
      positionRef.current = adjustedPosition
      setState((prev) => ({ ...prev, position: adjustedPosition, isDragging: false }))
      onDragEnd?.(adjustedPosition)
    } else {
      setState((prev) => ({ ...prev, isDragging: false }))
    }
  }, [elementRef, enabled, onDragEnd])

  // 重置拖拽状态
  const resetDragState = useCallback(() => {
    setState({
      isDragging: false,
      position: positionRef.current,
    })
  }, [])

  // 重置位置到初始状态 - 只在不记住位置时调用
  const resetPosition = useCallback(() => {
    if (!rememberPosition) {
      positionRef.current = null
      setState((prev) => ({
        ...prev,
        position: null,
      }))
    }
  }, [rememberPosition])

  // 完全重置，包括所有状态和引用
  const reset = useCallback(() => {
    if (!rememberPosition) {
      // 不记住位置时，完全重置
      positionRef.current = null
      isInitializedRef.current = false
      initialPositionRef.current = null
      setState({
        isDragging: false,
        position: null,
      })
    } else {
      // 如果需要记住位置，只重置拖拽状态
      resetDragState()
    }
  }, [rememberPosition, resetDragState])

  // 当rememberPosition变化时
  useEffect(() => {
    if (!rememberPosition) {
      // 如果关闭了记住位置，重置位置到初始状态
      resetPosition()
    }
  }, [rememberPosition, resetPosition])

  // 卸载时清理 rAF
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
