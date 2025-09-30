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
const MIN_VISIBLE_RATIO = 0.25 // 至少保留25%在可视范围内
const HEADER_HEIGHT = 40 // header高度

/**
 * 调整位置以确保元素在视窗内可见
 * @param position 当前位置
 * @param dialogRect 元素的矩形信息
 * @param viewportWidth 视窗宽度
 * @param viewportHeight 视窗高度
 */
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

/**
 * 拖拽功能 Hook
 * @param options 配置选项
 * @returns 拖拽状态和控制方法
 */
export function useDrag({ draggable, floatingRef, rememberPosition = false }: UseDragOptions) {
  // 使用useState管理活跃状态
  const [state, setState] = useState<DragState>({
    isDragging: false,
    position: null,
  })

  // 使用useRef存储位置，避免不必要的重渲染
  const positionRef = useRef<Position | null>(null)
  const initialPositionRef = useRef<Position | null>(null)
  const dragOriginRef = useRef({ x: 0, y: 0 })
  const contentRef = useRef<HTMLDivElement>(null)
  const rafIdRef = useRef<number | null>(null)
  const pendingRef = useRef(false)

  // 开始拖拽
  const handleDragStart = useEventCallback((e: React.MouseEvent) => {
    if (!draggable) return
    if (contentRef.current?.contains(e.target as Node)) return
    if (!floatingRef.current) return

    const rect = floatingRef.current.getBoundingClientRect()
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

    // 记录拖拽起始点
    dragOriginRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }

    // 设置初始位置 - 优先使用当前位置
    const currentPosition = positionRef.current || {
      x: rect.left,
      y: rect.top,
    }

    setState({
      isDragging: true,
      position: currentPosition,
    })
  })

  // 拖拽过程
  const handleDrag = useCallback(
    (e: MouseEvent) => {
      if (!draggable || !state.isDragging || !floatingRef.current) return

      // 计算新位置
      const x = e.clientX - dragOriginRef.current.x
      const y = e.clientY - dragOriginRef.current.y
      positionRef.current = { x, y }

      // 使用 rAF 合并同一帧内的多次 mousemove 更新
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

  // 结束拖拽
  const handleDragEnd = useCallback(() => {
    if (!draggable) return

    // 结束时取消未执行的 rAF
    if (rafIdRef.current != null) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
      pendingRef.current = false
    }

    if (floatingRef.current && state.position) {
      const dialogRect = floatingRef.current.getBoundingClientRect()
      const adjustedPosition = adjustPosition(state.position, dialogRect)

      // 更新ref中存储的位置
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
      setState((prev) => ({
        ...prev,
        position: initialPositionRef.current,
      }))
    }
  }, [rememberPosition])

  // 添加和移除事件监听
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

  // 监听 floatingRef.current 变化，重置初始位置和拖拽状态。
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

  // 当rememberPosition变化时
  useEffect(() => {
    if (!rememberPosition) {
      // 如果关闭了记住位置，重置位置到初始状态
      resetPosition()
    }
  }, [rememberPosition, resetPosition])

  // 组件卸载时清理 rAF
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
