import { useCallback, useState } from "react"

export function useHasHorizontalScroll(scrollRef: React.RefObject<HTMLElement> | undefined) {
  const [hasScroll, setHasScroll] = useState(false)

  const checkScroll = useCallback(() => {
    if (!scrollRef?.current) return false
    return scrollRef.current.scrollWidth > scrollRef.current.clientWidth
  }, [scrollRef])

  const checkAndUpdateScroll = useCallback(() => {
    const scrollExists = checkScroll()
    if (scrollExists !== hasScroll) {
      setHasScroll(scrollExists)
    }
    return scrollExists
  }, [checkScroll, hasScroll])

  return { hasHorizontalScroll: hasScroll, checkAndUpdateScroll }
}
