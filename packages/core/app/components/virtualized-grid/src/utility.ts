import { RefObject, useEffect, useRef, useState } from "react"
import type { CellProps, ConstRef, ElementScroll, ElementSize, RenderDataProps } from "./types"

const isBrowser = typeof window !== "undefined"

function isSameElementSize(a: ElementSize, b: ElementSize) {
  return a.width === b.width && a.height === b.height
}

function getWindowSize(): ElementSize {
  if (!isBrowser) return { width: 0, height: 0 }
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

function getElementSize(element: Element): ElementSize {
  const rect = element.getBoundingClientRect()
  return {
    width: rect.width,
    height: rect.height,
  }
}

function isSameElementScroll(a: ElementScroll, b: ElementScroll) {
  return a.x === b.x && a.y === b.y
}

function getWindowScroll(): ElementScroll {
  if (!isBrowser) return { x: 0, y: 0 }
  return {
    x: window.scrollX,
    y: window.scrollY,
  }
}

function getElementOffset(element: Element, scrollContainer?: Element | null) {
  if (!isBrowser) return 0
  if (scrollContainer) {
    // Calculate offset relative to scroll container
    const elementRect = element.getBoundingClientRect()
    const containerRect = scrollContainer.getBoundingClientRect()
    return elementRect.top - containerRect.top + scrollContainer.scrollTop
  }
  return window.scrollY + element.getBoundingClientRect().top
}

function getElementScroll(element: HTMLElement): ElementScroll {
  return { x: element.scrollLeft, y: element.scrollTop }
}

export function useConstRef<T>(value: T): ConstRef<T> {
  const ref = useRef(value)
  ref.current = value
  return ref
}

export function useWindowSize(): ElementSize {
  const [windowSize, setWindowSize] = useState(() => getWindowSize())
  const windowSizeRef = useConstRef(windowSize)

  useEffect(() => {
    function onResize() {
      const nextWindowSize = getWindowSize()
      if (!isSameElementSize(windowSizeRef.current, nextWindowSize)) {
        setWindowSize(nextWindowSize)
      }
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [windowSizeRef])

  return windowSize
}

export function useElementSize(ref: RefObject<Element>): ElementSize | null {
  const [elementSize, setElementSize] = useState(() => {
    if (ref.current) {
      return getElementSize(ref.current)
    } else {
      return null
    }
  })

  const elementSizeRef = useConstRef(elementSize)

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const nextElementSize = getElementSize(entries[0].target)
      if (
        elementSizeRef.current === null ||
        !isSameElementSize(elementSizeRef.current, nextElementSize)
      ) {
        setElementSize(nextElementSize)
      }
    })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref])

  return elementSize
}

export function useWindowScroll(): ElementScroll {
  const [scrollPosition, setScrollPosition] = useState(getWindowScroll)
  const scrollPositionRef = useConstRef(scrollPosition)

  useEffect(() => {
    function update() {
      const nextScrollPosition = getWindowScroll()
      if (!isSameElementScroll(scrollPositionRef.current, nextScrollPosition)) {
        setScrollPosition(nextScrollPosition)
      }
    }

    // Use passive listeners for better scroll performance
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update, { passive: true })

    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [scrollPositionRef])

  return scrollPosition
}

// Stable initial scroll state to avoid recreating object
const INITIAL_SCROLL: ElementScroll = { x: 0, y: 0 }

export function useElementScroll(ref: RefObject<HTMLElement>): ElementScroll {
  const [scrollPosition, setScrollPosition] = useState<ElementScroll>(() => {
    if (ref.current) {
      return getElementScroll(ref.current)
    }
    return INITIAL_SCROLL
  })

  const scrollPositionRef = useConstRef(scrollPosition)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const onScroll = () => {
      const nextScrollPosition = getElementScroll(element)
      if (!isSameElementScroll(scrollPositionRef.current, nextScrollPosition)) {
        setScrollPosition(nextScrollPosition)
      }
    }

    // Initialize on mount
    onScroll()

    // Use passive listener for better scroll performance
    element.addEventListener("scroll", onScroll, { passive: true })
    return () => element.removeEventListener("scroll", onScroll)
  }, [ref, scrollPositionRef])

  return scrollPosition
}

export function useElementWindowOffset(
  ref: RefObject<HTMLElement>,
  scrollContainerRef?: RefObject<HTMLElement>,
) {
  const [elementOffset, setElementOffset] = useState<number | null>(null)
  const offsetRef = useConstRef(elementOffset)

  useEffect(() => {
    const updateOffset = () => {
      if (ref.current) {
        const newOffset = getElementOffset(ref.current, scrollContainerRef?.current)
        // Only update if value actually changed to prevent unnecessary re-renders
        if (offsetRef.current !== newOffset) {
          setElementOffset(newOffset)
        }
      }
    }

    // Initial calculation
    updateOffset()

    // Only observe resize changes, not scroll
    // For custom scroll container: offset is relative position within container content
    // This doesn't change during scrolling, only when elements resize
    const observer = new ResizeObserver(updateOffset)
    if (ref.current) observer.observe(ref.current)
    if (scrollContainerRef?.current) observer.observe(scrollContainerRef.current)

    return () => observer.disconnect()
  }, [ref, scrollContainerRef, offsetRef])

  return elementOffset
}

export function useIntersecting(ref: RefObject<HTMLElement>, rootMargin: string) {
  const [intersecting, setIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setIntersecting(entries[0].isIntersecting)
      },
      { rootMargin },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref, rootMargin])

  return intersecting
}

export function getColumnWidth(
  columnCount: number | null,
  gridGap: number | null,
  elementWidth: number | null,
) {
  if (columnCount === null || gridGap === null || elementWidth === null) {
    return null
  }

  const totalGapSpace = (columnCount - 1) * gridGap
  const columnWidth = Math.round((elementWidth - totalGapSpace) / columnCount)

  return columnWidth
}

export function getGridRowStart<P>(cell: CellProps<P>, renderData: RenderDataProps<P> | null) {
  if (renderData === null) return undefined

  const offset =
    renderData.firstRenderedRowNumber !== null ? renderData.firstRenderedRowNumber - 1 : 0
  const gridRowStart = cell.rowNumber - offset

  return `${gridRowStart}`
}
