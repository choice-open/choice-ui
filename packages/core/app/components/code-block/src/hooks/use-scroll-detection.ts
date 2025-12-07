import { useState, useEffect, RefObject } from "react"

interface UseScrollDetectionProps {
  children: React.ReactNode
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
  children,
}: UseScrollDetectionProps) {
  const [needsScroll, setNeedsScroll] = useState(false)

  useEffect(() => {
    const checkScrollNeeded = () => {
      if (!scrollRef.current || !contentRef.current) {
        setNeedsScroll(false)
        return
      }

      try {
        const viewport = scrollRef.current
        const content = contentRef.current
        // Check if content height exceeds viewport height
        const hasScroll = content.scrollHeight > viewport.clientHeight
        setNeedsScroll(hasScroll)
      } catch (error) {
        setNeedsScroll(false)
      }
    }

    // Check initially with a small delay to ensure content is rendered
    const timeoutId = setTimeout(checkScrollNeeded, 100)

    // Also check on window resize
    window.addEventListener("resize", checkScrollNeeded)

    // Use ResizeObserver to detect content changes
    let resizeObserver: ResizeObserver | null = null
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(checkScrollNeeded)
      if (contentRef.current) {
        resizeObserver.observe(contentRef.current)
      }
    }

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener("resize", checkScrollNeeded)
      resizeObserver?.disconnect()
    }
  }, [scrollRef, contentRef, isExpanded, codeExpanded, children])

  return needsScroll
}
