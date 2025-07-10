import { useMemo } from "react"
import type { ScrollState, ScrollbarVisibilityType } from "../types"

/**
 * 缓存的溢出检查 hook
 */
export function useHasOverflow(scrollState: ScrollState, orientation: "vertical" | "horizontal") {
  return useMemo(() => {
    // 🔧 添加更严格的检查，避免在DOM未完全初始化时出现错误判断
    if (orientation === "vertical") {
      // 确保两个值都是有效的正数
      const hasValidDimensions =
        scrollState.scrollHeight > 0 &&
        scrollState.clientHeight > 0 &&
        Number.isFinite(scrollState.scrollHeight) &&
        Number.isFinite(scrollState.clientHeight)

      if (!hasValidDimensions) {
        return false
      }

      // 允许1px的容差，避免浮点数精度问题
      return scrollState.scrollHeight > scrollState.clientHeight + 1
    } else {
      // 确保两个值都是有效的正数
      const hasValidDimensions =
        scrollState.scrollWidth > 0 &&
        scrollState.clientWidth > 0 &&
        Number.isFinite(scrollState.scrollWidth) &&
        Number.isFinite(scrollState.clientWidth)

      if (!hasValidDimensions) {
        return false
      }

      // 允许1px的容差，避免浮点数精度问题
      return scrollState.scrollWidth > scrollState.clientWidth + 1
    }
  }, [
    scrollState.scrollHeight,
    scrollState.clientHeight,
    scrollState.scrollWidth,
    scrollState.clientWidth,
    orientation,
  ])
}

/**
 * 缓存的滚动条显示判断 hook
 */
export function useScrollbarShouldShow(
  type: ScrollbarVisibilityType,
  hasOverflow: boolean,
  isScrolling: boolean,
  isHovering: boolean,
) {
  return useMemo(() => {
    switch (type) {
      case "always":
        return true
      case "auto":
        return hasOverflow
      case "scroll":
        return hasOverflow && isScrolling
      case "hover":
        return hasOverflow && (isScrolling || isHovering)
      default:
        return hasOverflow
    }
  }, [type, hasOverflow, isScrolling, isHovering])
}
