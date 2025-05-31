import { useEffect, useRef } from "react"
import { PressProps, usePress } from "./use-press"

export type PressMoveProps = PressProps & {
  disabled?: boolean
  onPressEnd?: (e: PointerEvent) => void
  onPressMove?: (e: PointerEvent) => void
  onPressMoveBottom?: (delta: number) => void
  onPressMoveLeft?: (delta: number) => void
  onPressMoveRight?: (delta: number) => void
  onPressMoveTop?: (delta: number) => void
  onPressStart?: (e: PointerEvent) => void
}

export interface PressMoveResult {
  isPressed: boolean
  pressMoveProps: {
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => void
    ref: (el: HTMLElement | null) => void
    style?: React.CSSProperties
  }
}

export const usePressMove = ({
  onPressMove,
  onPressMoveLeft,
  onPressMoveRight,
  onPressMoveTop,
  onPressMoveBottom,
  onPressStart,
  onPressEnd,
  ...rest
}: PressMoveProps): PressMoveResult => {
  const targetRef = useRef<HTMLElement | null>(null)
  const isPressedRef = useRef(false)
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const cursorRef = useRef<HTMLDivElement | null>(null)
  const distanceThreshold = 5
  const movementRef = useRef({ x: 0, y: 0 })
  const virtualPositionRef = useRef({ x: 0, y: 0 })

  const { isPressed, pressProps } = usePress({
    ...rest,
    onPressStart: (e) => {
      if (!rest.disabled && "clientX" in e && "clientY" in e && targetRef.current) {
        // 延迟创建 overlay 和锁定指针，避免立即触发重绘
        requestAnimationFrame(() => {
          createOverlay()
          virtualPositionRef.current = { x: e.clientX, y: e.clientY }
          updateVirtualCursor()
          document.documentElement.requestPointerLock()
          document.addEventListener("pointermove", handlePointerMove)
          document.addEventListener("pointerup", handlePointerUp, { once: true })
        })

        // 调用原始的 onPressStart
        if (onPressStart && "nativeEvent" in e) {
          onPressStart(e.nativeEvent as PointerEvent)
        }
      }
    },
  })

  isPressedRef.current = isPressed

  const createOverlay = () => {
    if (!overlayRef.current) {
      const virtualCursor = document.createElement("div")
      virtualCursor.className = "press-move-cursor"
      document.body.appendChild(virtualCursor)
      cursorRef.current = virtualCursor
    }
  }

  const removeOverlay = () => {
    if (overlayRef.current) {
      document.body.removeChild(overlayRef.current)
      overlayRef.current = null
    }
    if (cursorRef.current) {
      document.body.removeChild(cursorRef.current)
      cursorRef.current = null
    }
    // 退出指针锁定
    if (document.pointerLockElement === document.documentElement) {
      document.exitPointerLock()
    }
    // 移除事件监听
    document.removeEventListener("pointermove", handlePointerMove)
  }

  const updateVirtualCursor = () => {
    if (!cursorRef.current) return

    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    const cursorWidth = 34 // 鼠标图标宽度
    const cursorHeight = 24 // 鼠标图标高度
    const halfCursorWidth = cursorWidth / 2
    const halfCursorHeight = cursorHeight / 2

    // 处理水平循环
    if (virtualPositionRef.current.x < -halfCursorWidth) {
      virtualPositionRef.current.x = screenWidth + halfCursorWidth
    } else if (virtualPositionRef.current.x > screenWidth + halfCursorWidth) {
      virtualPositionRef.current.x = -halfCursorWidth
    }

    // 处理垂直循环
    if (virtualPositionRef.current.y < -halfCursorHeight) {
      virtualPositionRef.current.y = screenHeight + halfCursorHeight
    } else if (virtualPositionRef.current.y > screenHeight + halfCursorHeight) {
      virtualPositionRef.current.y = -halfCursorHeight
    }

    // 使用transform来定位元素，保持元素原点在左上角
    cursorRef.current.style.transform = `translate3d(${virtualPositionRef.current.x - halfCursorWidth}px, ${virtualPositionRef.current.y - halfCursorHeight}px, 0)`
  }

  const handlePointerMove = (e: PointerEvent) => {
    if (isPressedRef.current && !rest.disabled && targetRef.current) {
      onPressMove?.(e)

      // 累积移动距离
      movementRef.current.x += e.movementX
      movementRef.current.y += e.movementY
      virtualPositionRef.current.x += e.movementX
      virtualPositionRef.current.y += e.movementY

      // 更新虚拟鼠标位置
      updateVirtualCursor()

      // 处理水平方向的数值变化
      const movementX = Math.abs(movementRef.current.x)
      if (movementX >= distanceThreshold) {
        if (movementRef.current.x < 0 && onPressMoveLeft) {
          onPressMoveLeft(Math.floor(movementX / distanceThreshold))
        } else if (movementRef.current.x > 0 && onPressMoveRight) {
          onPressMoveRight(Math.floor(movementX / distanceThreshold))
        }
        // 保留余数部分的移动距离
        movementRef.current.x = movementRef.current.x % distanceThreshold
      }

      // 处理垂直方向的数值变化
      const movementY = Math.abs(movementRef.current.y)
      if (movementY >= distanceThreshold) {
        if (movementRef.current.y < 0 && onPressMoveTop) {
          onPressMoveTop(Math.floor(movementY / distanceThreshold))
        } else if (movementRef.current.y > 0 && onPressMoveBottom) {
          onPressMoveBottom(Math.floor(movementY / distanceThreshold))
        }
        // 保留余数部分的移动距离
        movementRef.current.y = movementRef.current.y % distanceThreshold
      }
    }
  }

  const handlePointerUp = (e: PointerEvent) => {
    removeOverlay()
    movementRef.current = { x: 0, y: 0 }
    onPressEnd?.(e)
  }

  // 清理函数
  useEffect(() => {
    return () => {
      removeOverlay()
    }
  }, [])

  return {
    isPressed,
    pressMoveProps: {
      ...pressProps,
      ref: (el: HTMLElement | null) => {
        targetRef.current = el
      },
    },
  }
}
