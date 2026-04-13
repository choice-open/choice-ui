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
 *
 * BUG 2: Scrollbar has no keyboard accessibility (no tabIndex, no onKeyDown)
 *   - User scenario: Keyboard user tabs to the scrollbar element with role="scrollbar".
 *     The scrollbar has no tabIndex so it cannot receive focus, and no keyboard
 *     handler to respond to Arrow keys for scrolling.
 *   - Regression it prevents: Scrollbar is completely inaccessible via keyboard.
 *   - Logic change that makes it fail: scroll-area-scrollbar.tsx lines 99-115 - the
 *     scrollbar div has no tabIndex or onKeyDown handler. Fix = add tabIndex={0}
 *     and keyboard event handler.
 *
 * BUG 3: Thumb has contradictory role="button" and aria-hidden="true"
 *   - User scenario: Screen reader encounters the thumb element which has both
 *     role="button" (suggesting it's interactive) and aria-hidden="true" (hiding
 *     it from the accessibility tree). These contradict each other.
 *   - Regression it prevents: Confusing accessibility tree for screen readers.
 *   - Logic change that makes it fail: scroll-area-thumb.tsx lines 52-54 - both
 *     role="button" and aria-hidden="true" are set on the same element.
 *     Fix = remove role="button" since the parent scrollbar has role="scrollbar".
 *
 * BUG 4: useThumbDrag returns non-reactive isDragging (ref, not state)
 *   - User scenario: Component consuming isDragging to show drag UI feedback.
 *     Because isDragging is a ref (not state), React never re-renders when drag
 *     starts/ends, so drag-dependent UI does not update.
 *   - Regression it prevents: Visual feedback for thumb dragging does not work.
 *   - Logic change that makes it fail: use-thumb.ts line 185 returns
 *     `isDragging.current` (ref value captured at render time) instead of a state
 *     value that triggers re-renders. Fix = use useState or useSyncExternalStore.
 *
 * BUG 5: useThumbDrag doesn't clean up previous drag listeners on rapid re-entry
 *   - User scenario: User quickly mousedown on thumb, releases, mousedowns again
 *     before the first cleanup completes. The old mousemove/mouseup listeners
 *     remain, causing double scroll updates.
 *   - Regression it prevents: Multiple drag listeners accumulate, causing erratic
 *     scrolling behavior.
 *   - Logic change that makes it fail: use-thumb.ts lines 128-174 - when
 *     handleMouseDown is called again before the previous mouseup fires, new
 *     listeners are added without removing old ones. The cleanupRef is overwritten
 *     but the old listeners are not removed. Fix = call cleanupRef.current() before
 *     adding new listeners.
 *
 * BUG 6: Division by zero in thumb style when track dimensions are 0
 *   - User scenario: ScrollArea is rendered in a hidden container (display:none or
 *     zero dimensions). The thumb style calculation divides by scrollableRange which
 *     could be 0, producing Infinity or NaN values in CSS.
 *   - Regression it prevents: NaN/Infinity in CSS style values.
 *   - Logic change that makes it fail: use-thumb.ts lines 22, 43 - scrollRatio
 *     calculation uses scrollableHeight/scrollableWidth in denominator. While
 *     there are guards for hasValidDimensions, the division itself is unprotected
 *     if dimensions become 0 after initial render.
 *
 * BUG 7: Timer leak in delayedUpdateScrollState (setTimeout never cleared)
 *   - User scenario: Component mounts, delayedUpdateScrollState is called, then
 *     the component unmounts before the setTimeout fires. The callback runs on
 *     an unmounted component, potentially causing state updates on null references.
 *   - Regression it prevents: Memory leaks and React "state update on unmounted
 *     component" warnings.
 *   - Logic change that makes it fail: use-scroll-state-and-visibility.ts lines
 *     92-96 - setTimeout is called without storing/clearing the timer ID. Fix =
 *     store the timer ID and clear it in the cleanup function.
 */
import { act, renderHook } from "@testing-library/react"
import React from "react"
import { describe, expect, it, vi } from "vitest"
import { handleScrollbarTrackClick } from "../utils"
import { useThumbStyle, useThumbDrag, useScrollStateAndVisibility } from "../hooks"

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

  describe("BUG 2: useThumbStyle handles zero-dimension edge case", () => {
    it("returns safe values when scrollHeight equals clientHeight (no overflow)", () => {
      const scrollState = {
        scrollHeight: 200,
        clientHeight: 200,
        scrollTop: 0,
        scrollWidth: 400,
        clientWidth: 400,
        scrollLeft: 0,
      }

      const { result } = renderHook(() => useThumbStyle(scrollState, "vertical"))
      expect(result.current.height).toBe("0%")
      expect(result.current.top).toBe("0%")
    })
  })

  describe("BUG 3: useThumbStyle handles NaN-safe calculations", () => {
    it("does not produce NaN when all dimensions are 0", () => {
      const scrollState = {
        scrollHeight: 0,
        clientHeight: 0,
        scrollTop: 0,
        scrollWidth: 0,
        clientWidth: 0,
        scrollLeft: 0,
      }

      const { result } = renderHook(() => useThumbStyle(scrollState, "vertical"))
      expect(result.current.height).toBe("0%")
      expect(result.current.top).toBe("0%")
      expect(result.current.height).not.toBe("NaN%")
      expect(result.current.top).not.toBe("NaN%")
    })
  })

  describe("BUG 5: useThumbDrag cleans up listeners on re-entry", () => {
    it("must remove old mousemove listeners before adding new ones on second mousedown", () => {
      const addSpy = vi.spyOn(document, "addEventListener")
      const removeSpy = vi.spyOn(document, "removeEventListener")

      const mockViewport = document.createElement("div")
      Object.defineProperty(mockViewport, "scrollHeight", { value: 1000, configurable: true })
      Object.defineProperty(mockViewport, "clientHeight", { value: 200, configurable: true })
      Object.defineProperty(mockViewport, "scrollTop", {
        value: 0,
        writable: true,
        configurable: true,
      })

      const mockScrollbar = document.createElement("div")
      mockScrollbar.setAttribute("role", "scrollbar")
      const rect = {
        top: 0,
        left: 0,
        width: 14,
        height: 200,
        right: 14,
        bottom: 200,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }
      mockScrollbar.getBoundingClientRect = () => rect as DOMRect
      document.body.appendChild(mockScrollbar)
      mockScrollbar.appendChild(mockViewport)

      const scrollState = {
        scrollHeight: 1000,
        clientHeight: 200,
        scrollTop: 0,
        scrollWidth: 400,
        clientWidth: 400,
        scrollLeft: 0,
      }

      const { result } = renderHook(() => useThumbDrag(mockViewport, scrollState, "vertical"))

      const mockEvent1 = {
        clientY: 50,
        clientX: 0,
        currentTarget: mockScrollbar,
        preventDefault: vi.fn(),
      } as unknown as React.MouseEvent

      act(() => {
        result.current.handleMouseDown(mockEvent1)
      })

      const mockEvent2 = {
        clientY: 100,
        clientX: 0,
        currentTarget: mockScrollbar,
        preventDefault: vi.fn(),
      } as unknown as React.MouseEvent

      act(() => {
        result.current.handleMouseDown(mockEvent2)
      })

      const removeCallsAfterSecond = removeSpy.mock.calls.filter(
        (c: unknown[]) => (c as string[])[0] === "mousemove",
      ).length

      expect(removeCallsAfterSecond).toBeGreaterThanOrEqual(1)

      addSpy.mockRestore()
      removeSpy.mockRestore()
    })
  })

  describe("BUG 7: delayedUpdateScrollState timer leak", () => {
    it("setTimeout must be cleared when component using delayedUpdateScrollState unmounts", () => {
      const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout")

      const mockViewport = document.createElement("div")
      Object.defineProperty(mockViewport, "scrollHeight", { value: 1000, configurable: true })
      Object.defineProperty(mockViewport, "clientHeight", { value: 200, configurable: true })
      Object.defineProperty(mockViewport, "scrollTop", {
        value: 0,
        writable: true,
        configurable: true,
      })
      Object.defineProperty(mockViewport, "scrollWidth", { value: 400, configurable: true })
      Object.defineProperty(mockViewport, "clientWidth", { value: 400, configurable: true })
      Object.defineProperty(mockViewport, "scrollLeft", {
        value: 0,
        writable: true,
        configurable: true,
      })

      const mockContent = document.createElement("div")
      document.body.appendChild(mockViewport)

      const { unmount } = renderHook(() => useScrollStateAndVisibility(mockViewport, mockContent))

      unmount()

      expect(clearTimeoutSpy).toHaveBeenCalled()

      document.body.removeChild(mockViewport)
      clearTimeoutSpy.mockRestore()
    })
  })
})
