import { useMemo } from "react"
import { useEventCallback } from "usehooks-ts"
import { flushSync } from "react-dom"

/**
 * Menu scroll handling Hook
 *
 * Handle scroll related logic in menu components:
 * - Scroll position management
 * - Arrow scroll handling
 * - Scroll event handling
 * - Touch-related scroll hiding logic
 */

export interface MenuScrollConfig {
  /** Select specific: fallback mode */
  fallback?: boolean
  /** Whether to use Select type (uses different scroll logic) */
  isSelect?: boolean
  /** Scroll container reference */
  scrollRef: React.RefObject<HTMLDivElement>
  /** Scroll position state */
  scrollTop: number
  /** Timer reference */
  selectTimeoutRef: React.RefObject<ReturnType<typeof setTimeout> | undefined>
  /** Select specific: set internal offset */
  setInnerOffset?: (offset: number | ((prev: number) => number)) => void
  /** Set scroll position */
  setScrollTop: (scrollTop: number) => void
  /** Touch state */
  touch: boolean
}

export interface MenuScrollResult {
  /** Arrow hide handler */
  handleArrowHide: () => void
  /** Arrow scroll handler */
  handleArrowScroll: (amount: number) => void
  /** Scroll event handler */
  handleScroll: (event: React.UIEvent) => void
  /** Scroll-related property object (cached to avoid creating new objects on every render) */
  scrollProps: {
    onScroll: (event: React.UIEvent) => void
  }
}

export function useMenuScroll(config: MenuScrollConfig): MenuScrollResult {
  const {
    scrollRef,
    selectTimeoutRef,
    scrollTop,
    setScrollTop,
    touch,
    isSelect = false,
    setInnerOffset,
    fallback = false,
  } = config

  // Arrow scroll handling - use useEventCallback to ensure stable references
  const handleArrowScroll = useEventCallback((amount: number) => {
    if (isSelect) {
      // Select component scroll handling
      requestAnimationFrame(() => {
        if (fallback) {
          // fallback mode: scroll container directly
          if (scrollRef.current) {
            scrollRef.current.scrollTop -= amount
            flushSync(() => setScrollTop(scrollRef.current?.scrollTop ?? 0))
          }
        } else {
          // normal mode: update internal offset
          if (setInnerOffset) {
            flushSync(() => setInnerOffset((value) => value - amount))
          }
        }
      })
    } else {
      // Dropdown component scroll handling
      if (scrollRef.current) {
        scrollRef.current.scrollTop -= amount
        flushSync(() => setScrollTop(scrollRef.current?.scrollTop ?? 0))
      }
    }
  })

  // Arrow hide handling - touch-related logic
  const handleArrowHide = useEventCallback(() => {
    if (touch && selectTimeoutRef.current) {
      clearTimeout(selectTimeoutRef.current)
    }
  })

  // Scroll event handling
  const handleScroll = useEventCallback((event: React.UIEvent) => {
    const target = event.currentTarget
    flushSync(() => setScrollTop(target.scrollTop))
  })

  // Cache scroll property object, avoid creating new objects on every render
  // Use useMemo to ensure handleScroll reference changes before creating a new one
  const scrollProps = useMemo(
    () => ({
      onScroll: handleScroll,
    }),
    [handleScroll],
  )

  return {
    handleArrowScroll,
    handleArrowHide,
    handleScroll,
    scrollProps,
  }
}
