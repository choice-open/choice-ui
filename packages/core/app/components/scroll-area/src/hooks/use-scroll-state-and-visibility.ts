import { useCallback, useEffect, useRef, useState } from "react"
import type { ScrollState } from "../types"

/**
 * Merged scroll state and visibility management hook - avoid duplicate scroll event listening
 */
export function useScrollStateAndVisibility(viewport: HTMLDivElement | null) {
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
  const mutationObserverRef = useRef<MutationObserver>()
  const mutationTimeoutRef = useRef<number>()

  // 🚀 Performance optimization: prevent duplicate state caching
  const lastUpdateTimeRef = useRef<number>(0)
  const minUpdateIntervalRef = useRef<number>(16) // ~60fps

  // 🚀 Performance optimization: smart update strategy - adjust update frequency based on scroll speed
  const updateScrollState = useCallback(() => {
    if (!viewport) return

    const now = performance.now()
    const timeSinceLastUpdate = now - lastUpdateTimeRef.current

    // Prevent too frequent updates
    if (timeSinceLastUpdate < minUpdateIntervalRef.current) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      rafRef.current = requestAnimationFrame(() => {
        updateScrollState()
      })
      return
    }

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }

    rafRef.current = requestAnimationFrame(() => {
      const newState = {
        scrollLeft: viewport.scrollLeft,
        scrollTop: viewport.scrollTop,
        scrollWidth: viewport.scrollWidth,
        scrollHeight: viewport.scrollHeight,
        clientWidth: viewport.clientWidth,
        clientHeight: viewport.clientHeight,
      }

      // 🚀 Performance optimization: use more precise shallow comparison, only update state when there is a real change
      setScrollState((prevState) => {
        // Use stricter comparison, avoid floating point precision issues
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
    })
  }, [viewport])

  // Delay updating scroll state, used to handle layout delay when initializing dialog/popover
  const delayedUpdateScrollState = useCallback(() => {
    // Use setTimeout to ensure update after DOM layout is complete
    setTimeout(() => {
      updateScrollState()
    }, 0)
  }, [updateScrollState])

  // 🚀 Performance optimization: smart scroll detection - adjust detection sensitivity based on scroll speed
  const handleScroll = useCallback(() => {
    const now = performance.now()
    const timeSinceLastScroll = now - (lastUpdateTimeRef.current || 0)

    // Dynamically adjust update interval based on scroll frequency
    if (timeSinceLastScroll < 8) {
      // Reduce update frequency when fast scrolling
      minUpdateIntervalRef.current = 32 // ~30fps
    } else if (timeSinceLastScroll > 100) {
      // Increase update precision when slow scrolling
      minUpdateIntervalRef.current = 16 // ~60fps
    }

    updateScrollState()

    // Handle scroll state
    setIsScrolling(true)
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    scrollTimeoutRef.current = window.setTimeout(() => {
      setIsScrolling(false)
      // Reset update interval
      minUpdateIntervalRef.current = 16
    }, 1000)
  }, [updateScrollState])

  useEffect(() => {
    if (!viewport) return

    const handleResize = () => {
      updateScrollState()
    }

    // 🚀 Performance optimization: use AbortController and passive event listeners
    const abortController = new AbortController()
    const signal = abortController.signal

    // Use passive event listeners to improve scroll performance
    viewport.addEventListener("scroll", handleScroll, {
      passive: true,
      signal,
      capture: false, // Avoid unnecessary event capture
    })

    window.addEventListener("resize", handleResize, {
      passive: true,
      signal,
    })

    // 🔧 ResizeObserver listen to viewport size changes
    if (window.ResizeObserver) {
      resizeObserverRef.current = new ResizeObserver((entries) => {
        // 🚀 Performance optimization: batch process ResizeObserver callbacks
        for (const entry of entries) {
          // Only process elements we care about
          if (entry.target === viewport) {
            updateScrollState()
            break
          }
        }
      })
      resizeObserverRef.current.observe(viewport)
    }

    // 🔧 MutationObserver listen to content changes (throttling)
    if (window.MutationObserver) {
      mutationObserverRef.current = new MutationObserver((mutations) => {
        // 🚀 Performance optimization: smart change detection - only respond to changes that affect layout
        const hasLayoutChanges = mutations.some((mutation) => {
          if (mutation.type === "childList") {
            return mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0
          }
          if (mutation.type === "attributes") {
            const attr = mutation.attributeName
            return attr === "style" || attr === "class"
          }
          return mutation.type === "characterData"
        })

        if (!hasLayoutChanges) return

        // Throttling to avoid too frequent updates
        if (mutationTimeoutRef.current) {
          clearTimeout(mutationTimeoutRef.current)
        }
        mutationTimeoutRef.current = window.setTimeout(() => {
          updateScrollState()
        }, 16) // ~60fps update frequency
      })

      mutationObserverRef.current.observe(viewport, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style", "class"], // Only listen to attributes that affect layout
        characterData: true,
        characterDataOldValue: false, // No need for old value, improve performance
        attributeOldValue: false,
      })
    }

    // 🔧 Use delayed update when initializing, handle dialog/popover layout delay
    delayedUpdateScrollState()

    return () => {
      // Clean up all resources
      abortController.abort()

      // Clean up timers
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
        scrollTimeoutRef.current = undefined
      }

      if (mutationTimeoutRef.current) {
        clearTimeout(mutationTimeoutRef.current)
        mutationTimeoutRef.current = undefined
      }

      // Clean up RAF
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = undefined
      }

      // 🔧 Clean up observers
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
        resizeObserverRef.current = undefined
      }

      if (mutationObserverRef.current) {
        mutationObserverRef.current.disconnect()
        mutationObserverRef.current = undefined
      }
    }
  }, [viewport, handleScroll, delayedUpdateScrollState])

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
