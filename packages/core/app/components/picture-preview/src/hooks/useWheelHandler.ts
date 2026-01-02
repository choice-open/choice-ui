import { useCallback, useEffect, useRef } from "react"

interface Position {
  x: number
  y: number
}

interface ZoomAtPointParams {
  newZoom: number
  newPosition: Position
}

interface WheelHandlerOptions {
  minZoom?: number
  maxZoom?: number
  zoomStep?: number
  onZoom?: (newZoom: number) => void
  onPan?: (newPosition: Position) => void
  onZoomAtPoint?: (params: ZoomAtPointParams) => void
}

/**
 * 用于处理鼠标滚轮和触摸板手势的自定义Hook
 * @param targetRef 目标元素的ref
 * @param zoomRef 当前缩放值的ref
 * @param positionRef 当前位置的ref
 * @param options 配置选项
 */
export function useWheelHandler(
  targetRef: React.RefObject<HTMLElement | null>,
  zoomRef: React.RefObject<number>,
  positionRef: React.RefObject<Position>,
  options: WheelHandlerOptions = {},
) {
  const { minZoom = 0.01, maxZoom = 10, zoomStep = 0.1, onZoom, onPan, onZoomAtPoint } = options

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

      if (zoomRef.current === undefined || zoomRef.current === null || !positionRef.current) return

      // Mac 触摸板检测 - 精确的滚动事件
      const isPreciseEvent = event.deltaMode === 0
      const hasDeltaX = Math.abs(event.deltaX) > 0

      // 检测是否按下了 Command/Ctrl 键
      const isZoomModifier = (isMac.current && event.metaKey) || (!isMac.current && event.ctrlKey)

      // 检测触摸板双指捏合缩放 (Mac上 ctrlKey + 精确滚动)
      const isPinchZoom = event.ctrlKey && isPreciseEvent && !event.metaKey

      if (isZoomModifier || isPinchZoom) {
        // Command/Ctrl + 滚轮 或 触摸板双指捏合 - 缩放
        const oldZoom = zoomRef.current
        let newZoom: number

        // 统一使用连续缩放，基于实际 deltaY 值
        // 使用指数缩放公式: newZoom = oldZoom * e^(-delta * sensitivity)
        // 这样可以实现更自然的缩放感觉
        const sensitivity = isPinchZoom ? 0.008 : 0.003
        const delta = event.deltaY
        newZoom = oldZoom * Math.exp(-delta * sensitivity)
        newZoom = Math.max(minZoom, Math.min(maxZoom, newZoom))

        const target = targetRef.current
        if (onZoomAtPoint && target) {
          // 获取容器的边界信息
          const rect = target.getBoundingClientRect()

          // 鼠标相对于容器中心的位置
          const mouseX = event.clientX - rect.left - rect.width / 2
          const mouseY = event.clientY - rect.top - rect.height / 2

          // 计算缩放比例
          const zoomRatio = newZoom / oldZoom

          // 当前位置
          const currentX = positionRef.current.x
          const currentY = positionRef.current.y

          // 计算新位置，使鼠标指向的点保持不变
          // 公式: newPos = mousePos - (mousePos - currentPos) * zoomRatio
          const newPosition = {
            x: mouseX - (mouseX - currentX) * zoomRatio,
            y: mouseY - (mouseY - currentY) * zoomRatio,
          }

          onZoomAtPoint({ newZoom, newPosition })
        } else if (onZoom) {
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
    [minZoom, maxZoom, onZoom, onPan, onZoomAtPoint, targetRef],
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
