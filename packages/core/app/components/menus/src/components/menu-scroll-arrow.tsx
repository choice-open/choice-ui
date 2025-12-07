import { tcx } from "@choiceform/design-shared"
import { ChevronDownSmall, ChevronUpSmall } from "@choiceform/icons-react"
import { useRef, useState } from "react"
import { flushSync } from "react-dom"
import { useIsomorphicLayoutEffect } from "@choiceform/design-shared"
import { MenuScrollArrowTv } from "../tv"

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
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const isPositionedRef = useRef(isPositioned)
  const dirRef = useRef(dir)
  const rafRef = useRef<number | null>(null)
  const lastScrollHeightRef = useRef<number>(0)

  // 保持 ref 与最新值同步
  useIsomorphicLayoutEffect(() => {
    isPositionedRef.current = isPositioned
    dirRef.current = dir
  }, [isPositioned, dir])

  const styles = MenuScrollArrowTv({ dir, visible: show })

  // 初始化时检查
  useIsomorphicLayoutEffect(() => {
    if (isPositioned && scrollRef.current) {
      lastScrollHeightRef.current = scrollRef.current.scrollHeight
      requestAnimationFrame(() => {
        flushSync(() => setShow(shouldShowArrow(scrollRef, dir)))
      })
    }
  }, [isPositioned, innerOffset, scrollTop, scrollRef, dir])

  // 使用 ResizeObserver 监听内容高度变化（如 filter 后 item 减少）
  // 使用 RAF 防抖优化，避免频繁更新和 flushSync
  useIsomorphicLayoutEffect(() => {
    if (!isPositioned || !scrollRef.current) {
      return
    }

    // 创建 ResizeObserver 监听 scrollHeight 和 clientHeight 的变化
    resizeObserverRef.current = new ResizeObserver(() => {
      // 使用 RAF 防抖，避免同一帧内多次触发
      if (rafRef.current !== null) {
        return
      }
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        if (isPositionedRef.current && scrollRef.current) {
          const currentScrollHeight = scrollRef.current.scrollHeight
          // 只在 scrollHeight 真正变化时才使用 flushSync，避免不必要的同步更新
          if (currentScrollHeight !== lastScrollHeightRef.current) {
            lastScrollHeightRef.current = currentScrollHeight
            flushSync(() => setShow(shouldShowArrow(scrollRef, dirRef.current)))
          } else {
            // scrollHeight 没变化，但 scrollTop 可能变化了，异步更新即可
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

  // 组件卸载时清理所有动画帧
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
