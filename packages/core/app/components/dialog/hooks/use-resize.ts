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

// 根据调整方向获取对应的鼠标样式
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

  // 使用Ref存储尺寸，避免不必要的重渲染
  const sizeRef = useRef<Size | null>(null)
  // 记录初始尺寸，用于重置
  const initialSizeRef = useRef<Size | null>(null)
  const resizeOriginRef = useRef({ x: 0, y: 0, width: 0, height: 0 })
  const isInitializedRef = useRef(false)
  const resizeOffsetRef = useRef({ x: 0, y: 0 })

  // 使用默认尺寸或者DOM尺寸初始化
  useEffect(() => {
    if (!isInitializedRef.current && elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect()

      // 如果提供了默认尺寸，优先使用默认尺寸
      const initialSize = {
        width: defaultWidth || rect.width,
        height: defaultHeight || rect.height,
      }

      // 记录初始尺寸用于重置
      initialSizeRef.current = initialSize

      // 仅在首次初始化或不记住尺寸时设置当前尺寸
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

    // 记录初始尺寸(只在首次记录)
    if (!initialSizeRef.current) {
      // 使用默认尺寸或当前尺寸
      initialSizeRef.current = {
        width: defaultWidth || rect.width,
        height: defaultHeight || rect.height,
      }
    }

    // 设置 body 的鼠标样式
    document.body.style.cursor = getCursorStyle(direction)

    setState((prev) => ({ ...prev, isResizing: direction }))
    onResizeStart?.(e, direction)

    // 计算鼠标相对于调整手柄的偏移量
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

      // 确保在拖拽过程中鼠标样式保持正确
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
      // 更新Ref存储的尺寸
      sizeRef.current = adjustedSize
      setState((prev) => ({ ...prev, size: adjustedSize }))
    },
    [enabled, state.isResizing, minWidth, maxWidth, minHeight, maxHeight],
  )

  const handleResizeEnd = useCallback(() => {
    if (!enabled) return

    // 恢复 body 的鼠标样式
    document.body.style.cursor = "default"

    if (sizeRef.current) {
      onResizeEnd?.(sizeRef.current)
    }

    setState((prev) => ({ ...prev, isResizing: null }))
  }, [enabled, onResizeEnd])

  // 重置尺寸状态
  const resetResizeState = useCallback(() => {
    // 恢复 body 的鼠标样式
    document.body.style.cursor = "default"

    setState((prev) => ({
      ...prev,
      isResizing: null,
    }))
  }, [])

  // 重置尺寸到初始状态 - 只在不记住尺寸时调用
  const resetSize = useCallback(() => {
    if (!rememberSize && initialSizeRef.current) {
      sizeRef.current = initialSizeRef.current
      setState((prev) => ({
        ...prev,
        size: initialSizeRef.current,
      }))
    }
  }, [rememberSize])

  // 完全重置，包括所有状态和引用
  const reset = useCallback(() => {
    // 恢复 body 的鼠标样式
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
      // 如果需要记住尺寸，只重置调整状态
      resetResizeState()
    }
  }, [rememberSize, resetResizeState])

  // 当rememberSize变化时
  useEffect(() => {
    if (!rememberSize) {
      // 如果关闭了记住尺寸，重置尺寸到初始状态
      resetSize()
    }
  }, [rememberSize, resetSize])

  useEffect(() => {
    if (enabled && state.isResizing) {
      // 添加键盘事件监听，按ESC取消调整
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          handleResizeEnd()
        }
      }

      // 添加窗口失焦事件监听，防止用户切换窗口时调整状态未正确清理
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
        // 确保清理时恢复鼠标样式
        document.body.style.cursor = "default"
      }
    }
  }, [enabled, state.isResizing, handleResize, handleResizeEnd])

  // 组件卸载时清理
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
