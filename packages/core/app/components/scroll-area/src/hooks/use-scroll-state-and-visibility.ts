import { useCallback, useEffect, useRef, useState } from "react"
import type { ScrollState } from "../types"

/**
 * Merged scroll state and visibility management hook
 */
export function useScrollStateAndVisibility(
  viewport: HTMLDivElement | null,
  content: HTMLDivElement | null,
) {
  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollLeft: 0,
    scrollTop: 0,
    scrollWidth: 0,
    scrollHeight: 0,
    clientWidth: 0,
    clientHeight: 0,
  })

  const [isHovering, setIsHovering] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimeoutRef = useRef<number>()
  const rafRef = useRef<number>()
  const resizeObserverRef = useRef<ResizeObserver>()

  // Throttle: prevent duplicate state updates
  const lastUpdateTimeRef = useRef<number>(0)
  const minUpdateIntervalRef = useRef<number>(16) // ~60fps

  // Synchronous DOM read + smart setState with shallow comparison
  const updateScrollState = useCallback(() => {
    if (!viewport) return

    const now = performance.now()
    const timeSinceLastUpdate = now - lastUpdateTimeRef.current

    // If updating too frequently, schedule a deferred update via single RAF
    if (timeSinceLastUpdate < minUpdateIntervalRef.current) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = undefined
        updateScrollState()
      })
      return
    }

    // Cancel any pending deferred update since we're doing it now
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = undefined
    }

    // Read DOM values synchronously — these reads are cheap
    const newState: ScrollState = {
      scrollLeft: viewport.scrollLeft,
      scrollTop: viewport.scrollTop,
      scrollWidth: viewport.scrollWidth,
      scrollHeight: viewport.scrollHeight,
      clientWidth: viewport.clientWidth,
      clientHeight: viewport.clientHeight,
    }

    // Only update state when there is a real change (with floating-point tolerance)
    setScrollState((prevState) => {
      const scrollLeftChanged = Math.abs(prevState.scrollLeft - newState.scrollLeft) > 0.5
      const scrollTopChanged = Math.abs(prevState.scrollTop - newState.scrollTop) > 0.5
      const scrollWidthChanged = prevState.scrollWidth !== newState.scrollWidth
      const scrollHeightChanged = prevState.scrollHeight !== newState.scrollHeight
      const clientWidthChanged = prevState.clientWidth !== newState.clientWidth
      const clientHeightChanged = prevState.clientHeight !== newState.clientHeight

      const hasChanges =
        scrollLeftChanged ||
        scrollTopChanged ||
        scrollWidthChanged ||
        scrollHeightChanged ||
        clientWidthChanged ||
        clientHeightChanged

      if (hasChanges) {
        lastUpdateTimeRef.current = now
        return newState
      }

      return prevState
    })
  }, [viewport])

  // Delay updating scroll state, used to handle layout delay when initializing dialog/popover
  const delayedUpdateScrollState = useCallback(() => {
    setTimeout(() => {
      updateScrollState()
    }, 0)
  }, [updateScrollState])

  // Smart scroll detection — adjust detection sensitivity based on scroll speed
  const handleScroll = useCallback(() => {
    const now = performance.now()
    const timeSinceLastScroll = now - (lastUpdateTimeRef.current || 0)

    // Dynamically adjust update interval based on scroll frequency
    if (timeSinceLastScroll < 8) {
      minUpdateIntervalRef.current = 32 // ~30fps for fast scrolling
    } else if (timeSinceLastScroll > 100) {
      minUpdateIntervalRef.current = 16 // ~60fps for slow scrolling
    }

    updateScrollState()

    // Handle scroll state
    setIsScrolling(true)
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    scrollTimeoutRef.current = window.setTimeout(() => {
      setIsScrolling(false)
      minUpdateIntervalRef.current = 16
    }, 1000)
  }, [updateScrollState])

  useEffect(() => {
    if (!viewport) return

    const handleResize = () => {
      updateScrollState()
    }

    // Use AbortController and passive event listeners
    const abortController = new AbortController()
    const signal = abortController.signal

    viewport.addEventListener("scroll", handleScroll, {
      passive: true,
      signal,
      capture: false,
    })

    window.addEventListener("resize", handleResize, {
      passive: true,
      signal,
    })

    // ResizeObserver: observe both viewport and content element
    if (window.ResizeObserver) {
      resizeObserverRef.current = new ResizeObserver(() => {
        updateScrollState()
      })
      resizeObserverRef.current.observe(viewport)
      if (content) {
        resizeObserverRef.current.observe(content)
      }
    }

    // Delayed initial update for dialog/popover layout
    delayedUpdateScrollState()

    return () => {
      abortController.abort()

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
        scrollTimeoutRef.current = undefined
      }

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = undefined
      }

      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
        resizeObserverRef.current = undefined
      }
    }
  }, [viewport, content, handleScroll, delayedUpdateScrollState, updateScrollState])

  const handleMouseEnter = useCallback(() => setIsHovering(true), [])
  const handleMouseLeave = useCallback(() => setIsHovering(false), [])

  return {
    scrollState,
    isHovering,
    isScrolling,
    handleMouseEnter,
    handleMouseLeave,
  }
}
