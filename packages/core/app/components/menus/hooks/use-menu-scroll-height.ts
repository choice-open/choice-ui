import { useEffect } from "react"

/**
 * 菜单滚动容器高度设置 Hook
 *
 * 确保滚动容器正确设置高度，作为 size middleware 的补充
 * 在所有菜单组件中都有类似的逻辑，统一抽取到这里
 *
 * 功能：
 * - 在菜单打开且定位完成后，确保滚动容器正确继承父元素高度
 * - 使用 requestAnimationFrame 确保 DOM 已更新，避免与 size middleware 的时序冲突
 */

export interface MenuScrollHeightConfig {
  /** 是否打开 */
  isControlledOpen: boolean
  /** 是否已定位 */
  isPositioned: boolean
  /** 滚动容器引用 */
  scrollRef: React.RefObject<HTMLDivElement>
}

/**
 * 设置滚动容器高度
 * 这个 hook 会在菜单打开且定位完成后，确保滚动容器正确设置高度
 */
export function useMenuScrollHeight(config: MenuScrollHeightConfig): void {
  const { isControlledOpen, isPositioned, scrollRef } = config

  useEffect(() => {
    if (!isControlledOpen || !isPositioned) return

    // 使用 requestAnimationFrame 确保 DOM 已更新，避免与 size middleware 的时序冲突
    const rafId = requestAnimationFrame(() => {
      if (scrollRef.current) {
        const parent = scrollRef.current.parentElement
        // 只在父元素已设置高度时才应用样式，避免不必要的 DOM 操作
        if (parent?.style.height) {
          scrollRef.current.style.height = "100%"
          scrollRef.current.style.maxHeight = "100%"
        }
      }
    })

    return () => cancelAnimationFrame(rafId)
  }, [isControlledOpen, isPositioned, scrollRef])
}

