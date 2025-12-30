import { useState, useEffect, useCallback, useRef, type RefObject } from "react"

interface UseScrollDetectionProps {
  codeExpanded: boolean
  contentRef: RefObject<HTMLElement>
  isExpanded: boolean
  scrollRef: RefObject<HTMLElement>
}

export function useScrollDetection({
  scrollRef,
  contentRef,
  isExpanded,
  codeExpanded,
}: UseScrollDetectionProps) {
  const [needsScroll, setNeedsScroll] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const checkScrollNeeded = useCallback(() => {
    // Debounce rapid calls
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      if (!scrollRef.current || !contentRef.current) {
        setNeedsScroll(false)
        return
      }

      try {
        const viewport = scrollRef.current
        const content = contentRef.current
        const hasScroll = content.scrollHeight > viewport.clientHeight
        setNeedsScroll(hasScroll)
      } catch {
        setNeedsScroll(false)
      }
    }, 50)
  }, [scrollRef, contentRef])

  useEffect(() => {
    // Initial check with delay to ensure content is rendered
    const timeoutId = setTimeout(checkScrollNeeded, 100)

    window.addEventListener("resize", checkScrollNeeded)

    // Use ResizeObserver to detect content size changes (replaces children dependency)
    let resizeObserver: ResizeObserver | null = null
    if (typeof ResizeObserver !== "undefined" && contentRef.current) {
      resizeObserver = new ResizeObserver(checkScrollNeeded)
      resizeObserver.observe(contentRef.current)
    }

    return () => {
      clearTimeout(timeoutId)
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      window.removeEventListener("resize", checkScrollNeeded)
      resizeObserver?.disconnect()
    }
  }, [checkScrollNeeded, isExpanded, codeExpanded])

  return needsScroll
}
