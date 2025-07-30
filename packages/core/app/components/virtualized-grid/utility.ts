import { RefObject, useEffect, useRef, useState } from "react"
import type { CellProps, ConstRef, ElementScroll, ElementSize, RenderDataProps } from "./types"

function isSameElementSize(a: ElementSize, b: ElementSize) {
  return a.width === b.width && a.height === b.height
}

function getWindowSize(): ElementSize {
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
  return {
    x: window.scrollX,
    y: window.scrollY,
  }
}

function getElementOffset(element: Element) {
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
  const [scrollPosition, setScrollPosition] = useState(getWindowScroll())
  const ref = useConstRef(scrollPosition)

  useEffect(() => {
    function update() {
      const nextScrollPosition = getWindowScroll()
      if (!isSameElementScroll(ref.current, nextScrollPosition)) {
        setScrollPosition(nextScrollPosition)
      }
    }

    window.addEventListener("scroll", update)
    window.addEventListener("resize", update)

    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [ref])

  return scrollPosition
}

export function useElementScroll(ref: RefObject<HTMLElement>): ElementScroll {
  const [scrollPosition, setScrollPosition] = useState(() => {
    if (ref.current) {
      return getElementScroll(ref.current)
    } else {
      return { x: 0, y: 0 }
    }
  })

  const scrollPositionRef = useConstRef(scrollPosition)

  useEffect(() => {
    const currentRef = ref.current

    const onScroll = () => {
      if (currentRef) {
        const nextScrollPosition = getElementScroll(currentRef)
        if (!isSameElementScroll(scrollPositionRef.current, nextScrollPosition)) {
          setScrollPosition(nextScrollPosition)
        }
      }
    }

    if (currentRef) currentRef.addEventListener("scroll", onScroll)
    return () => {
      if (currentRef) currentRef.removeEventListener("scroll", onScroll)
    }
  }, [ref, scrollPositionRef])

  return scrollPosition
}

export function useElementWindowOffset(ref: RefObject<HTMLElement>) {
  const [elementOffset, setElementOffset] = useState(() => {
    if (ref.current) {
      return getElementOffset(ref.current)
    } else {
      return null
    }
  })

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      setElementOffset(getElementOffset(entries[0].target))
    })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref])

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
