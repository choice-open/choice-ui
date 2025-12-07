import { useEventCallback } from "usehooks-ts"
import { PointerEvent, PointerEventHandler, useCallback, useRef, useState } from "react"
import { Point } from "./types"

export function useHandleState(
  moveHandle: (start: Point, coordinates: Point) => void,
  handleMoveStart: () => void,
): [
  boolean,
  Record<
    "handlePointerLeaveOrUp" | "handlePointerMove" | "handlePointerStartMoving",
    PointerEventHandler<HTMLButtonElement>
  >,
] {
  const startPositionRef = useRef<Point>({ x: 0, y: 0 })
  const [movingHandle, setMovingHandle] = useState(false)

  const handlePointerStartMoving = useEventCallback((event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault()

    // 如果已经在拖拽中，不要重复开始
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      return
    }

    // 先捕获起始位置
    const startX = event.clientX
    const startY = event.clientY
    startPositionRef.current = { x: startX, y: startY }

    // 设置指针捕获
    event.currentTarget.setPointerCapture(event.pointerId)

    // 然后更新状态
    setMovingHandle(true)
    handleMoveStart()
  })

  const handlePointerMove = useEventCallback((event: PointerEvent<HTMLButtonElement>) => {
    if (movingHandle && event.currentTarget.hasPointerCapture(event.pointerId)) {
      const x = event.clientX
      const y = event.clientY
      moveHandle(startPositionRef.current, { x, y })
    }
  })

  const handlePointerLeaveOrUp = useCallback((event: PointerEvent<HTMLButtonElement>) => {
    // 先重置状态，避免状态卡住
    setMovingHandle(false)

    // 尝试释放指针捕获，如果失败也不影响状态重置
    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
    } catch (error) {
      // 在某些情况下释放指针捕获可能失败，但我们仍然需要重置状态
      console.warn("Failed to release pointer capture:", error)
    }
  }, [])

  return [movingHandle, { handlePointerLeaveOrUp, handlePointerMove, handlePointerStartMoving }]
}
