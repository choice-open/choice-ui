import { useCallback } from "react"
import { useEventCallback } from "usehooks-ts"

/**
 * 菜单触摸交互 Hook
 *
 * 处理菜单组件的触摸交互逻辑：
 * - 触摸状态检测
 * - 触摸开始事件处理
 * - 指针移动事件处理
 * - 触摸相关的事件处理器
 */

export interface MenuTouchConfig {
  /** 设置触摸状态 */
  setTouch: (touch: boolean) => void
  /** 触摸状态 */
  touch: boolean
}

export interface MenuTouchResult {
  /** 获取触摸相关的引用属性 */
  getTouchProps: () => {
    onPointerMove: (event: React.PointerEvent) => void
    onTouchStart: () => void
  }
  /** 指针移动事件处理器 */
  handlePointerMove: (event: React.PointerEvent) => void
  /** 触摸开始事件处理器 */
  handleTouchStart: () => void
}

export function useMenuTouch(config: MenuTouchConfig): MenuTouchResult {
  const { touch, setTouch } = config

  // 触摸开始处理 - 使用 useEventCallback 确保引用稳定
  const handleTouchStart = useEventCallback(() => {
    if (!touch) {
      setTouch(true)
    }
  })

  // 指针移动处理 - 区分触摸和非触摸输入
  const handlePointerMove = useEventCallback((event: React.PointerEvent) => {
    // 如果不是触摸输入，更新状态
    if (event.pointerType !== "touch" && touch) {
      setTouch(false)
    }
  })

  // 获取触摸相关的属性 - 使用 useCallback 而不是 useEventCallback
  const getTouchProps = useCallback(
    () => ({
      onTouchStart: handleTouchStart,
      onPointerMove: handlePointerMove,
    }),
    [handleTouchStart, handlePointerMove],
  )

  return {
    handleTouchStart,
    handlePointerMove,
    getTouchProps,
  }
}
