import { useMemo } from "react"
import type { ScrollState, ScrollbarVisibilityType } from "../types"

/**
 * Cached overflow check hook
 */
export function useHasOverflow(scrollState: ScrollState, orientation: "vertical" | "horizontal") {
  return useMemo(() => {
    // 🔧 Add stricter checks to avoid error judgment when DOM is not fully initialized
    if (orientation === "vertical") {
      // Ensure both values are valid positive numbers
      const hasValidDimensions =
        scrollState.scrollHeight > 0 &&
        scrollState.clientHeight > 0 &&
        Number.isFinite(scrollState.scrollHeight) &&
        Number.isFinite(scrollState.clientHeight)

      if (!hasValidDimensions) {
        return false
      }

      // Allow 1px tolerance, avoid floating point precision issues
      return scrollState.scrollHeight > scrollState.clientHeight + 1
    } else {
      // Ensure both values are valid positive numbers
      const hasValidDimensions =
        scrollState.scrollWidth > 0 &&
        scrollState.clientWidth > 0 &&
        Number.isFinite(scrollState.scrollWidth) &&
        Number.isFinite(scrollState.clientWidth)

      if (!hasValidDimensions) {
        return false
      }

      // Allow 1px tolerance, avoid floating point precision issues
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
 * Cached scrollbar display judgment hook
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
