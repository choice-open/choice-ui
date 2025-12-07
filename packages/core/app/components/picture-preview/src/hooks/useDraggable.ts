import { useCallback, useEffect, useRef, useState } from "react"

interface Position {
  x: number
  y: number
}

interface DraggableOptions {
  onDragStart?: () => void
  onDragEnd?: () => void
}

/**
 * 用于处理元素拖拽的自定义Hook
 * @param initialPosition 初始位置
 * @param options 拖拽配置选项
 * @returns 拖拽相关的状态和处理函数
 */
export function useDraggable(
  initialPosition: Position = { x: 0, y: 0 },
  options: DraggableOptions = {},
) {
  // 使用状态保存位置信息和拖拽状态
  const [position, setPosition] = useState<Position>(initialPosition)
  const [isDragging, setIsDragging] = useState(false)

  // 使用refs保存当前值，避免不必要的渲染
  const positionRef = useRef(position)
  const dragStartRef = useRef({ x: 0, y: 0 })

  // Animation frame 引用，用于平滑更新
  const rafId = useRef<number | null>(null)

  // 同步状态和refs
  useEffect(() => {
    positionRef.current = position
  }, [position])

  // 在组件卸载时取消所有动画帧请求
  useEffect(() => {
    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [])

  // 计划更新状态
  const scheduleUpdate = useCallback(() => {
    if (rafId.current !== null) {
      return // 已有计划更新，避免重复
    }

    rafId.current = requestAnimationFrame(() => {
      setPosition(positionRef.current)
      rafId.current = null
    })
  }, [])

  // 鼠标按下事件处理
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (e.button !== 0) return // 只响应左键

      setIsDragging(true)
      // 直接更新ref，避免触发不必要的重渲染
      dragStartRef.current = {
        x: e.clientX - positionRef.current.x,
        y: e.clientY - positionRef.current.y,
      }

      if (options.onDragStart) {
        options.onDragStart()
      }

      e.preventDefault()
    },
    [options],
  )

  // 鼠标移动事件处理
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return

      // 直接更新位置ref
      positionRef.current = {
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      }

      // 安排更新在下一帧进行，避免频繁setState
      scheduleUpdate()
      e.preventDefault()
    },
    [isDragging, scheduleUpdate],
  )

  // 鼠标释放事件处理
  const handleMouseUp = useCallback(() => {
    if (!isDragging) return

    setIsDragging(false)

    if (options.onDragEnd) {
      options.onDragEnd()
    }
  }, [isDragging, options])

  // 更新位置的方法
  const updatePosition = useCallback(
    (newPosition: Position) => {
      positionRef.current = newPosition
      scheduleUpdate()
    },
    [scheduleUpdate],
  )

  // 使用全局鼠标事件处理器以获得更好的拖动体验
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)

      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return {
    position,
    isDragging,
    handleMouseDown,
    updatePosition,
    positionRef, // 暴露ref以允许直接访问当前位置
  }
}
