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
    const thumbRatio = scrollState.clientHeight / scrollState.scrollHeight
    const thumbHeightOnTrack = thumbRatio * rect.height
    const scrollRatio = (clickY - thumbHeightOnTrack / 2) / rect.height
    const maxScrollTop = scrollState.scrollHeight - scrollState.clientHeight
    viewport.scrollTop = Math.max(0, Math.min(scrollRatio * maxScrollTop, maxScrollTop))
  } else {
    const clickX = e.clientX - rect.left
    const thumbRatio = scrollState.clientWidth / scrollState.scrollWidth
    const thumbWidthOnTrack = thumbRatio * rect.width
    const scrollRatio = (clickX - thumbWidthOnTrack / 2) / rect.width
    const maxScrollLeft = scrollState.scrollWidth - scrollState.clientWidth
    viewport.scrollLeft = Math.max(0, Math.min(scrollRatio * maxScrollLeft, maxScrollLeft))
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
