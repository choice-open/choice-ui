import { tcx } from "@choice-ui/shared"
import { ChevronDownSmall, ChevronUpSmall } from "@choiceform/icons-react"
import { useRef, useState } from "react"
import { flushSync } from "react-dom"
import { useIsomorphicLayoutEffect } from "@choice-ui/shared"
import { MenuScrollArrowTv } from "../tv"

const SCROLL_ARROW_PADDING = 16
// Minimum height required to show scroll arrows (arrow height + padding)
const MIN_HEIGHT_FOR_ARROWS = 48

const shouldShowArrow = (
  scrollRef: React.MutableRefObject<HTMLDivElement | null>,
  dir: "down" | "up",
) => {
  if (scrollRef.current) {
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    
    // Don't show arrows if the visible height is too small
    if (clientHeight < MIN_HEIGHT_FOR_ARROWS) {
      return false
    }
    
    if (dir === "up") {
      return scrollTop >= SCROLL_ARROW_PADDING
    }

    if (dir === "down") {
      return scrollTop <= scrollHeight - clientHeight - SCROLL_ARROW_PADDING
    }
  }

  return false
}

export interface MenuScrollArrowProps {
  className?: string
  dir: "up" | "down"
  innerOffset: number
  isPositioned: boolean
  onHide?: () => void
  onScroll: (amount: number) => void
  scrollRef: React.MutableRefObject<HTMLDivElement | null>
  scrollTop: number
  variant?: "default" | "light" | "reset"
}

export const MenuScrollArrow = function MenuScrollArrow(props: MenuScrollArrowProps) {
  const {
    isPositioned,
    dir,
    scrollRef,
    scrollTop,
    onScroll,
    innerOffset,
    onHide,
    className,
    variant = "default",
  } = props

  const [show, setShow] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const statusRef = useRef<"idle" | "active">("idle")
  const frameRef = useRef(-1)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const isPositionedRef = useRef(isPositioned)
  const dirRef = useRef(dir)
  const rafRef = useRef<number | null>(null)
  const lastScrollHeightRef = useRef<number>(0)

  // Keep ref synchronized with latest value
  useIsomorphicLayoutEffect(() => {
    isPositionedRef.current = isPositioned
    dirRef.current = dir
  }, [isPositioned, dir])

  const tv = MenuScrollArrowTv({ dir, visible: show, variant })

  // Check when initializing
  useIsomorphicLayoutEffect(() => {
    if (isPositioned && scrollRef.current) {
      lastScrollHeightRef.current = scrollRef.current.scrollHeight
      requestAnimationFrame(() => {
        flushSync(() => setShow(shouldShowArrow(scrollRef, dir)))
      })
    }
  }, [isPositioned, innerOffset, scrollTop, scrollRef, dir])

  // Use ResizeObserver to listen for content height changes (e.g. after filtering items)
  // Use RAF debounce to optimize, avoid frequent updates and flushSync
  useIsomorphicLayoutEffect(() => {
    if (!isPositioned || !scrollRef.current) {
      return
    }

    // Create ResizeObserver to listen for changes in scrollHeight and clientHeight
    resizeObserverRef.current = new ResizeObserver(() => {
      // Use RAF debounce, avoid triggering multiple times within the same frame
      if (rafRef.current !== null) {
        return
      }
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        if (isPositionedRef.current && scrollRef.current) {
          const currentScrollHeight = scrollRef.current.scrollHeight
          // Only use flushSync when scrollHeight truly changes, avoid unnecessary synchronous updates
          if (currentScrollHeight !== lastScrollHeightRef.current) {
            lastScrollHeightRef.current = currentScrollHeight
            flushSync(() => setShow(shouldShowArrow(scrollRef, dirRef.current)))
          } else {
            // scrollHeight didn't change, but scrollTop may have changed, so update asynchronously
            setShow(shouldShowArrow(scrollRef, dirRef.current))
          }
        }
      })
    })

    resizeObserverRef.current.observe(scrollRef.current)

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
        resizeObserverRef.current = null
      }
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [isPositioned, scrollRef, dir])

  useIsomorphicLayoutEffect(() => {
    if (!show && statusRef.current === "active") {
      onHide?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, scrollTop])

  const handlePointerEnter = () => {
    statusRef.current = "active"
    let prevNow = Date.now()

    function frame() {
      if (scrollRef.current) {
        const currentDir = dirRef.current
        const currentNow = Date.now()
        const msElapsed = currentNow - prevNow
        prevNow = currentNow

        const pixelsToScroll = msElapsed / 2

        const remainingPixels =
          currentDir === "up"
            ? scrollRef.current.scrollTop
            : scrollRef.current.scrollHeight -
              scrollRef.current.clientHeight -
              scrollRef.current.scrollTop

        const scrollRemaining =
          currentDir === "up"
            ? scrollRef.current.scrollTop - pixelsToScroll > 0
            : scrollRef.current.scrollTop + pixelsToScroll <
              scrollRef.current.scrollHeight - scrollRef.current.clientHeight

        onScroll(
          currentDir === "up"
            ? Math.min(pixelsToScroll, remainingPixels)
            : Math.max(-pixelsToScroll, -remainingPixels),
        )

        if (scrollRemaining) {
          frameRef.current = requestAnimationFrame(frame)
        } else {
          setShow(shouldShowArrow(scrollRef, currentDir))
        }
      }
    }

    cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(frame)
  }

  const handlePointerLeave = () => {
    statusRef.current = "idle"
    cancelAnimationFrame(frameRef.current)
    frameRef.current = -1
  }

  // Clean up all animation frames when component unmounts
  useIsomorphicLayoutEffect(() => {
    return () => {
      if (frameRef.current !== -1) {
        cancelAnimationFrame(frameRef.current)
        frameRef.current = -1
      }
    }
  }, [])

  return (
    <div
      className={tcx(tv, className)}
      data-dir={dir}
      ref={ref}
      aria-hidden
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {dir === "up" ? <ChevronUpSmall /> : <ChevronDownSmall />}
    </div>
  )
}
