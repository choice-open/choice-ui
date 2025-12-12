import type { ScrollState } from "../types"

/**
 * Handle scrollbar track click event
 */
export function handleScrollbarTrackClick(
  e: React.MouseEvent,
  viewport: HTMLDivElement,
  scrollState: ScrollState,
  orientation: "vertical" | "horizontal",
) {
  const rect = e.currentTarget.getBoundingClientRect()

  if (orientation === "vertical") {
    const clickY = e.clientY - rect.top
    const scrollRatio = clickY / rect.height
    const maxScrollTop = scrollState.scrollHeight - scrollState.clientHeight
    viewport.scrollTop = scrollRatio * maxScrollTop
  } else {
    const clickX = e.clientX - rect.left
    const scrollRatio = clickX / rect.width
    const maxScrollLeft = scrollState.scrollWidth - scrollState.clientWidth
    viewport.scrollLeft = scrollRatio * maxScrollLeft
  }
}

/**
 * Get scrollbar position style
 */
export function getScrollbarPositionStyle(orientation: "vertical" | "horizontal") {
  if (orientation === "vertical") {
    return {
      position: "absolute" as const,
      top: 0,
      right: 0,
      height: "100%",
    }
  } else {
    return {
      position: "absolute" as const,
      bottom: 0,
      left: 0,
      width: "100%",
    }
  }
}

/**
 * Check if the corner component should be displayed
 */
export function shouldShowCorner(scrollState: ScrollState): boolean {
  const hasVerticalOverflow = scrollState.scrollHeight > scrollState.clientHeight
  const hasHorizontalOverflow = scrollState.scrollWidth > scrollState.clientWidth
  return hasVerticalOverflow && hasHorizontalOverflow
}
