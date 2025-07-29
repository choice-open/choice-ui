import { ChevronDownSmall, ChevronUpSmall } from "@choiceform/icons-react"
import { useLayoutEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { MenuScrollArrowTv } from "../tv"
import { tcx } from "~/utils/tcx"

const SCROLL_ARROW_PADDING = 16

const shouldShowArrow = (
  scrollRef: React.MutableRefObject<HTMLDivElement | null>,
  dir: "down" | "up",
) => {
  if (scrollRef.current) {
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    if (dir === "up") {
      return scrollTop >= SCROLL_ARROW_PADDING
    }

    if (dir === "down") {
      return scrollTop <= scrollHeight - clientHeight - SCROLL_ARROW_PADDING
    }
  }

  return false
}

interface MenuScrollArrowProps {
  className?: string
  dir: "up" | "down"
  innerOffset: number
  isPositioned: boolean
  onHide?: () => void
  onScroll: (amount: number) => void
  scrollRef: React.MutableRefObject<HTMLDivElement | null>
  scrollTop: number
}

export const MenuScrollArrow = function MenuScrollArrow(props: MenuScrollArrowProps) {
  const { isPositioned, dir, scrollRef, scrollTop, onScroll, innerOffset, onHide, className } =
    props

  const [show, setShow] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const statusRef = useRef<"idle" | "active">("idle")
  const frameRef = useRef(-1)

  const styles = MenuScrollArrowTv({ dir, visible: show })

  useLayoutEffect(() => {
    if (isPositioned) {
      requestAnimationFrame(() => {
        flushSync(() => setShow(shouldShowArrow(scrollRef, dir)))
      })
    }
  }, [isPositioned, innerOffset, scrollTop, scrollRef, dir])

  useLayoutEffect(() => {
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
        const currentNow = Date.now()
        const msElapsed = currentNow - prevNow
        prevNow = currentNow

        const pixelsToScroll = msElapsed / 2

        const remainingPixels =
          dir === "up"
            ? scrollRef.current.scrollTop
            : scrollRef.current.scrollHeight -
              scrollRef.current.clientHeight -
              scrollRef.current.scrollTop

        const scrollRemaining =
          dir === "up"
            ? scrollRef.current.scrollTop - pixelsToScroll > 0
            : scrollRef.current.scrollTop + pixelsToScroll <
              scrollRef.current.scrollHeight - scrollRef.current.clientHeight

        onScroll(
          dir === "up"
            ? Math.min(pixelsToScroll, remainingPixels)
            : Math.max(-pixelsToScroll, -remainingPixels),
        )

        if (scrollRemaining) {
          frameRef.current = requestAnimationFrame(frame)
        } else {
          setShow(shouldShowArrow(scrollRef, dir))
        }
      }
    }

    cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(frame)
  }

  const handlePointerLeave = () => {
    statusRef.current = "idle"
    cancelAnimationFrame(frameRef.current)
  }

  return (
    <div
      className={tcx(styles, className)}
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
