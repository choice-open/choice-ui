import { useCallback, useEffect, useRef } from "react"

interface Position {
  x: number
  y: number
}

interface WheelHandlerOptions {
  minZoom?: number
  maxZoom?: number
  zoomStep?: number
  onZoom?: (newZoom: number) => void
  onPan?: (newPosition: Position) => void
}

/**
 * 用于处理鼠标滚轮和触摸板手势的自定义Hook
 * @param targetRef 目标元素的ref
 * @param zoomRef 当前缩放值的ref
 * @param positionRef 当前位置的ref
 * @param options 配置选项
 */
export function useWheelHandler(
  targetRef: React.RefObject<HTMLElement>,
  zoomRef: React.RefObject<number>,
  positionRef: React.RefObject<Position>,
  options: WheelHandlerOptions = {},
) {
  const { minZoom = 0.01, maxZoom = 10, zoomStep = 0.1, onZoom, onPan } = options

  // 是否Mac平台
  const isMac = useRef(
    typeof navigator !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0,
  )

  // Command/Control键是否按下
  const isCmdPressed = useRef(false)

  // 处理滚轮事件，支持触摸板双指移动和Cmd+滚轮缩放
  const handleWheel = useCallback(
    (event: WheelEvent) => {
      // 防止事件冒泡和默认行为
      event.preventDefault()
      event.stopPropagation()

      if (!zoomRef.current || !positionRef.current) return

      // Mac 触摸板检测 - 精确的滚动事件
      const isPreciseEvent = event.deltaMode === 0
      const hasDeltaX = Math.abs(event.deltaX) > 0

      // 检测是否按下了 Command/Ctrl 键
      const isZoomModifier = (isMac.current && event.metaKey) || (!isMac.current && event.ctrlKey)

      if (isZoomModifier) {
        // Command/Ctrl + 滚轮 - 缩放
        const delta = -Math.sign(event.deltaY) * zoomStep
        const newZoom = Math.max(minZoom, Math.min(maxZoom, zoomRef.current + delta))

        if (onZoom) {
          onZoom(newZoom)
        }
      } else if (isPreciseEvent && hasDeltaX) {
        // 触摸板双指移动 - 平移图像
        const sensitivity = 1.0
        const newPosition = {
          x: positionRef.current.x - event.deltaX * sensitivity,
          y: positionRef.current.y - event.deltaY * sensitivity,
        }

        if (onPan) {
          onPan(newPosition)
        }
      } else if (event.shiftKey) {
        // Shift + 滚轮 - 水平移动
        const sensitivity = 0.8
        const newPosition = {
          x: positionRef.current.x - event.deltaY * sensitivity,
          y: positionRef.current.y,
        }

        if (onPan) {
          onPan(newPosition)
        }
      } else {
        // 普通滚轮 - 垂直移动
        const sensitivity = 0.8
        const newPosition = {
          x: positionRef.current.x,
          y: positionRef.current.y - event.deltaY * sensitivity,
        }

        if (onPan) {
          onPan(newPosition)
        }
      }
    },
    [minZoom, maxZoom, zoomStep, onZoom, onPan],
  )

  // 处理键盘按下事件
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((isMac.current && e.metaKey) || (!isMac.current && e.ctrlKey)) {
      isCmdPressed.current = true
    }
  }, [])

  // 处理键盘释放事件
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if ((isMac.current && e.key === "Meta") || (!isMac.current && e.key === "Control")) {
      isCmdPressed.current = false
    }
  }, [])

  // 添加事件监听器
  useEffect(() => {
    const target = targetRef.current
    if (!target) return

    // 添加滚轮事件监听器
    target.addEventListener("wheel", handleWheel, { passive: false })

    // 添加键盘事件监听器
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      // 清理事件监听器
      if (target) {
        target.removeEventListener("wheel", handleWheel)
      }
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [targetRef, handleWheel, handleKeyDown, handleKeyUp])

  return {
    isMac: isMac.current,
    isCmdPressed,
  }
}
