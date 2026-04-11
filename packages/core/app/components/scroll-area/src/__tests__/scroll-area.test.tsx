/**
 * ScrollArea bug-focused tests
 *
 * BUG 1: Track click doesn't account for thumb size in scroll calculation
 *   - User scenario: User clicks the scrollbar track expecting the thumb to center
 *     on the click point (standard OS scrollbar behavior). Instead, the top edge
 *     of the thumb jumps to the click point, causing overshoot.
 *   - Regression it prevents: Scrollbar track clicks produce jarring jumps that
 *     don't match user expectations or native scrollbar behavior.
 *   - Logic change that makes it fail: The `scrollRatio = clickY / rect.height`
 *     calculation (line 16) treats the thumb as infinitely small. Fix = subtract
 *     half the thumb's proportional size from the click ratio before multiplying
 *     by maxScroll, so the thumb center (not top edge) lands on the click point.
 */
import { describe, expect, it } from "vitest"
import { handleScrollbarTrackClick } from "../utils"

function createMockEvent(overrides: {
  clientX: number
  clientY: number
  rect: { top: number; left: number; width: number; height: number }
}) {
  return {
    clientX: overrides.clientX,
    clientY: overrides.clientY,
    currentTarget: {
      getBoundingClientRect: () => overrides.rect,
    },
  } as unknown as React.MouseEvent
}

function createMockViewport() {
  return { scrollTop: 0, scrollLeft: 0 } as HTMLDivElement
}

describe("ScrollArea bugs", () => {
  describe("BUG 1: track click must center thumb on click point, not align thumb top edge", () => {
    it("vertical: clicking track center should scroll so thumb center lands on click point", () => {
      const trackHeight = 200
      const clientHeight = 200
      const scrollHeight = 1000
      const maxScrollTop = scrollHeight - clientHeight
      const thumbRatio = clientHeight / scrollHeight
      const thumbHeightOnTrack = thumbRatio * trackHeight

      const viewport = createMockViewport()
      const e = createMockEvent({
        clientY: 100,
        clientX: 0,
        rect: { top: 0, left: 0, width: 14, height: trackHeight },
      })

      handleScrollbarTrackClick(
        e,
        viewport,
        {
          clientHeight,
          clientWidth: 400,
          scrollHeight,
          scrollWidth: 400,
          scrollTop: 0,
          scrollLeft: 0,
        },
        "vertical",
      )

      const expectedThumbTopRatio = (100 - thumbHeightOnTrack / 2) / trackHeight
      const expectedScrollTop = expectedThumbTopRatio * maxScrollTop

      expect(viewport.scrollTop).toBeCloseTo(expectedScrollTop, 0)
    })

    it("horizontal: clicking track center should scroll so thumb center lands on click point", () => {
      const trackWidth = 400
      const clientWidth = 400
      const scrollWidth = 2000
      const maxScrollLeft = scrollWidth - clientWidth
      const thumbRatio = clientWidth / scrollWidth
      const thumbWidthOnTrack = thumbRatio * trackWidth

      const viewport = createMockViewport()
      const e = createMockEvent({
        clientX: 200,
        clientY: 0,
        rect: { top: 0, left: 0, width: trackWidth, height: 14 },
      })

      handleScrollbarTrackClick(
        e,
        viewport,
        {
          clientHeight: 200,
          clientWidth,
          scrollHeight: 200,
          scrollWidth,
          scrollTop: 0,
          scrollLeft: 0,
        },
        "horizontal",
      )

      const expectedThumbLeftRatio = (200 - thumbWidthOnTrack / 2) / trackWidth
      const expectedScrollLeft = expectedThumbLeftRatio * maxScrollLeft

      expect(viewport.scrollLeft).toBeCloseTo(expectedScrollLeft, 0)
    })

    it("vertical: clicking near bottom should not overshoot max scroll when thumb is large", () => {
      const trackHeight = 200
      const clientHeight = 200
      const scrollHeight = 400
      const maxScrollTop = scrollHeight - clientHeight
      const thumbRatio = clientHeight / scrollHeight
      const thumbHeightOnTrack = thumbRatio * trackHeight

      const viewport = createMockViewport()
      const e = createMockEvent({
        clientY: 180,
        clientX: 0,
        rect: { top: 0, left: 0, width: 14, height: trackHeight },
      })

      handleScrollbarTrackClick(
        e,
        viewport,
        {
          clientHeight,
          clientWidth: 400,
          scrollHeight,
          scrollWidth: 400,
          scrollTop: 0,
          scrollLeft: 0,
        },
        "vertical",
      )

      const expectedThumbTopRatio = (180 - thumbHeightOnTrack / 2) / trackHeight
      const expectedScrollTop = expectedThumbTopRatio * maxScrollTop

      expect(expectedScrollTop).toBeLessThanOrEqual(maxScrollTop)
      expect(viewport.scrollTop).toBeCloseTo(expectedScrollTop, 0)
    })
  })
})
