import React, { MutableRefObject, RefObject, ErrorInfo } from "react"

export type ConstRef<T> = Readonly<MutableRefObject<T>>

export interface ElementSize {
  height: number
  width: number
}

export interface ElementScroll {
  x: number
  y: number
}

export interface ItemDataProps {
  height: number
  key: string
}

export interface EntryProps<P> {
  data: ItemDataProps
  item: P
}

export interface ConfigDataProps<P> {
  columnCount: number
  entries: EntryProps<P>[]
  gridGap: number
  overscan: number
}

export interface ContainerDataProps {
  elementSize: ElementSize | null
  elementWindowOffset: number | null
  windowScroll: ElementScroll
  windowSize: ElementSize
}

export interface CellProps<P> {
  columnNumber: number
  height: number
  item: P
  key: string
  offset: number
  rowNumber: number
}

export interface LayoutDataProps<P> {
  cells: CellProps<P>[]
  totalHeight: number
}

export interface RenderDataProps<P> {
  cellsToRender: CellProps<P>[]
  firstRenderedRowNumber: number | null
  firstRenderedRowOffset: number | null
}

export interface VirtualizedGridProps<P> {
  className?: string
  columnCount: (elementWidth: number, gridGap: number) => number
  containerRef?: RefObject<HTMLElement>
  enablePooling?: boolean
  errorFallback?: React.ComponentType<{
    error?: Error
    retry: () => void
  }>
  fixedColumnWidth?: number
  gridGap?: (elementWidth: number, windowHeight: number) => number
  itemData: (item: P, columnWidth: number) => ItemDataProps
  itemProps?: React.HTMLAttributes<HTMLDivElement>
  items: P[]
  listMode?: boolean
  maxPoolSize?: number
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  /** Number of items to render outside the visible area for smoother scrolling (default: 5) */
  overscan?: number
  poolSize?: number
  renderItem: (item: P, index?: number) => React.ReactNode
  scrollRef?: RefObject<HTMLElement>
}
