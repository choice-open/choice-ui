import { tcx } from "@choice-ui/shared"
import { ScrollArea } from "@choice-ui/scroll-area"
import { useVirtualizer, useWindowVirtualizer } from "@tanstack/react-virtual"
import type { ReactNode, CSSProperties } from "react"
import {
  memo,
  useCallback,
  useMemo,
  useState,
  useEffect,
  isValidElement,
  cloneElement,
} from "react"
import { useTableStatic, useTableRows, useTableScroll } from "../context"
import type { TableBodyProps, RowKey, InternalRow } from "../types"
import { tableVariants } from "../tv"

// Cache variants at module level
const TV = tableVariants()

/**
 * Memoized wrapper for virtualized row positioning
 */
interface VirtualRowWrapperProps {
  rowKey: RowKey
  start: number
  height: number
  children: ReactNode
}

const VirtualRowWrapper = memo(
  function VirtualRowWrapper({ start, height, children }: VirtualRowWrapperProps) {
    const style = useMemo<CSSProperties>(
      () => ({
        position: "absolute",
        top: 0,
        left: 0,
        height,
        transform: `translateY(${start}px)`,
      }),
      [start, height],
    )
    return <div style={style}>{children}</div>
  },
  (prev, next) =>
    prev.rowKey === next.rowKey && prev.start === next.start && prev.height === next.height,
)

/**
 * Window scroll mode - uses useWindowVirtualizer
 */
function WindowScrollBody<T>({
  rows,
  rowHeight,
  overscan,
  renderRow,
  onScroll,
  className,
}: {
  rows: InternalRow<T>[]
  rowHeight: number
  overscan: number
  renderRow: (row: T, index: number) => ReactNode
  onScroll?: (event: { scrollTop: number; scrollHeight: number; clientHeight: number }) => void
  className?: string
}) {
  const getItemSize = useCallback(() => rowHeight, [rowHeight])

  const virtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: getItemSize,
    overscan,
  })

  const virtualItems = virtualizer.getVirtualItems()
  const totalSize = virtualizer.getTotalSize()

  const containerStyle = useMemo<CSSProperties>(
    () => ({ height: totalSize, position: "relative" }),
    [totalSize],
  )

  useEffect(() => {
    const handleWindowScroll = () => {
      onScroll?.({
        scrollTop: window.scrollY,
        scrollHeight: document.documentElement.scrollHeight,
        clientHeight: document.documentElement.clientHeight,
      })
    }

    window.addEventListener("scroll", handleWindowScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleWindowScroll)
  }, [onScroll])

  return (
    <div className={tcx(TV.bodyWrapper(), className)}>
      <div
        role="rowgroup"
        className={TV.body()}
        style={containerStyle}
      >
        {virtualItems.map((virtualRow) => {
          const row = rows[virtualRow.index]
          if (!row) return null
          return (
            <VirtualRowWrapper
              key={row.key}
              rowKey={row.key}
              start={virtualRow.start}
              height={rowHeight}
            >
              {renderRow(row.data, virtualRow.index)}
            </VirtualRowWrapper>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Container scroll mode - uses useVirtualizer with ScrollArea
 */
function ContainerScrollBody<T>({
  rows,
  rowHeight,
  overscan,
  renderRow,
  onScroll,
  className,
  classNames,
}: {
  rows: InternalRow<T>[]
  rowHeight: number
  overscan: number
  renderRow: (row: T, index: number) => ReactNode
  onScroll?: (event: { scrollTop: number; scrollHeight: number; clientHeight: number }) => void
  className?: string
  classNames?: {
    viewport?: string
  }
}) {
  // Use state for scroll element to trigger re-render when available
  const [scrollElement, setScrollElement] = useState<HTMLDivElement | null>(null)
  const { syncScrollLeft, setBodyScrollRef } = useTableScroll()

  // Callback ref for ScrollArea.Viewport
  const setViewportRef = useCallback(
    (node: HTMLDivElement | null) => {
      setScrollElement(node)
      if (node) {
        // Create a ref-like object for context
        const refObject = { current: node } as React.RefObject<HTMLDivElement>
        setBodyScrollRef(refObject)
      }
    },
    [setBodyScrollRef],
  )

  // Listen to scroll events for header sync and user callback
  useEffect(() => {
    if (!scrollElement) return

    const handleScroll = () => {
      // Direct DOM sync - bypasses React for performance
      syncScrollLeft(scrollElement.scrollLeft)
      // Call user's onScroll callback
      onScroll?.({
        scrollTop: scrollElement.scrollTop,
        scrollHeight: scrollElement.scrollHeight,
        clientHeight: scrollElement.clientHeight,
      })
    }

    scrollElement.addEventListener("scroll", handleScroll, { passive: true })
    return () => scrollElement.removeEventListener("scroll", handleScroll)
  }, [scrollElement, syncScrollLeft, onScroll])

  const getScrollElement = useCallback(() => scrollElement, [scrollElement])
  const getItemSize = useCallback(() => rowHeight, [rowHeight])

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement,
    estimateSize: getItemSize,
    overscan,
  })

  const virtualItems = virtualizer.getVirtualItems()
  const totalSize = virtualizer.getTotalSize()

  const containerStyle = useMemo<CSSProperties>(
    () => ({ height: totalSize, position: "relative" }),
    [totalSize],
  )

  return (
    <div className={tcx(TV.bodyWrapper(), className)}>
      <ScrollArea
        className={TV.bodyScroll()}
        orientation="both"
      >
        <ScrollArea.Viewport
          ref={setViewportRef}
          className={classNames?.viewport}
        >
          <ScrollArea.Content>
            <div
              role="rowgroup"
              className={TV.body()}
              style={containerStyle}
            >
              {virtualItems.map((virtualRow) => {
                const row = rows[virtualRow.index]
                if (!row) return null
                return (
                  <VirtualRowWrapper
                    key={row.key}
                    rowKey={row.key}
                    start={virtualRow.start}
                    height={rowHeight}
                  >
                    {renderRow(row.data, virtualRow.index)}
                  </VirtualRowWrapper>
                )
              })}
            </div>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
      </ScrollArea>
    </div>
  )
}

/**
 * External scroll mode - uses useVirtualizer with external scroll ref
 */
function ExternalScrollBody<T>({
  rows,
  rowHeight,
  overscan,
  renderRow,
  scrollRef,
  className,
}: {
  rows: InternalRow<T>[]
  rowHeight: number
  overscan: number
  renderRow: (row: T, index: number) => ReactNode
  scrollRef: React.RefObject<HTMLElement>
  className?: string
}) {
  const { syncScrollLeft } = useTableScroll()

  // Sync scroll position from external container - direct DOM manipulation
  useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    const handleScroll = () => {
      syncScrollLeft(element.scrollLeft)
    }

    element.addEventListener("scroll", handleScroll, { passive: true })
    return () => element.removeEventListener("scroll", handleScroll)
  }, [scrollRef, syncScrollLeft])

  const getScrollElement = useCallback(() => scrollRef.current, [scrollRef])
  const getItemSize = useCallback(() => rowHeight, [rowHeight])

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement,
    estimateSize: getItemSize,
    overscan,
  })

  const virtualItems = virtualizer.getVirtualItems()
  const totalSize = virtualizer.getTotalSize()

  const containerStyle = useMemo<CSSProperties>(
    () => ({ height: totalSize, position: "relative" }),
    [totalSize],
  )

  return (
    <div className={tcx(TV.bodyWrapper(), className)}>
      <div
        role="rowgroup"
        className={TV.body()}
        style={containerStyle}
      >
        {virtualItems.map((virtualRow) => {
          const row = rows[virtualRow.index]
          if (!row) return null
          return (
            <VirtualRowWrapper
              key={row.key}
              rowKey={row.key}
              start={virtualRow.start}
              height={rowHeight}
            >
              {renderRow(row.data, virtualRow.index)}
            </VirtualRowWrapper>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Non-virtualized body with ScrollArea
 */
function NonVirtualizedBody<T>({
  rows,
  renderRow,
  onScroll,
  className,
  classNames,
}: {
  rows: InternalRow<T>[]
  renderRow: (row: T, index: number) => ReactNode
  onScroll?: (event: { scrollTop: number; scrollHeight: number; clientHeight: number }) => void
  className?: string
  classNames?: {
    viewport?: string
  }
}) {
  const { syncScrollLeft, setBodyScrollRef } = useTableScroll()

  // Callback ref for ScrollArea.Viewport
  const setViewportRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        const refObject = { current: node } as React.RefObject<HTMLDivElement>
        setBodyScrollRef(refObject)
      }
    },
    [setBodyScrollRef],
  )

  // Handle scroll for header sync and user callback
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget
      syncScrollLeft(target.scrollLeft)
      onScroll?.({
        scrollTop: target.scrollTop,
        scrollHeight: target.scrollHeight,
        clientHeight: target.clientHeight,
      })
    },
    [syncScrollLeft, onScroll],
  )

  return (
    <div className={tcx(TV.bodyWrapper(), className)}>
      <ScrollArea
        className={TV.bodyScroll()}
        orientation="both"
      >
        <ScrollArea.Viewport
          ref={setViewportRef}
          className={classNames?.viewport}
          onScroll={handleScroll}
        >
          <ScrollArea.Content>
            <div
              role="rowgroup"
              className={TV.body()}
            >
              {rows.map((row, index) => {
                const element = renderRow(row.data, index)
                if (isValidElement(element)) {
                  return cloneElement(element, { key: row.key })
                }
                return element
              })}
            </div>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
      </ScrollArea>
    </div>
  )
}

/**
 * Main TableBody component
 */
export function TableBody<T>({ children, className, classNames }: TableBodyProps<T>): ReactNode {
  const {
    scrollMode,
    scrollRef,
    virtualized,
    rowHeight,
    overscan = 5,
    onScroll,
  } = useTableStatic<T>()
  const { rows } = useTableRows<T>()

  // Render function for rows
  const renderRow = useCallback(
    (row: T, index: number) => {
      return (children as (row: T, index: number) => ReactNode)(row, index)
    },
    [children],
  )

  // Non-virtualized mode
  if (!virtualized) {
    return (
      <NonVirtualizedBody
        rows={rows}
        renderRow={renderRow}
        onScroll={onScroll}
        className={className}
        classNames={classNames}
      />
    )
  }

  // Window scroll mode
  if (scrollMode === "window") {
    return (
      <WindowScrollBody
        rows={rows}
        rowHeight={rowHeight}
        overscan={overscan}
        renderRow={renderRow}
        onScroll={onScroll}
        className={className}
      />
    )
  }

  // External scroll mode (user manages their own scroll container)
  if (scrollRef) {
    return (
      <ExternalScrollBody
        rows={rows}
        rowHeight={rowHeight}
        overscan={overscan}
        renderRow={renderRow}
        scrollRef={scrollRef}
        className={className}
      />
    )
  }

  // Default: container scroll mode
  return (
    <ContainerScrollBody
      rows={rows}
      onScroll={onScroll}
      rowHeight={rowHeight}
      overscan={overscan}
      renderRow={renderRow}
      className={className}
      classNames={classNames}
    />
  )
}
