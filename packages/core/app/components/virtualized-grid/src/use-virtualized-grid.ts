import { RefObject, useMemo } from "react"
import type {
  CellProps,
  ConfigDataProps,
  ContainerDataProps,
  LayoutDataProps,
  RenderDataProps,
  VirtualizedGridProps,
} from "./types"
import {
  getColumnWidth,
  useElementScroll,
  useElementSize,
  useElementWindowOffset,
  useWindowScroll,
  useWindowSize,
} from "./utility"

export function useContainerData(
  internalRef: RefObject<HTMLElement>,
  externalRef?: RefObject<HTMLElement>,
  containerRef?: RefObject<HTMLElement>,
): ContainerDataProps {
  const windowSize = useWindowSize()
  const windowScrollPosition = useWindowScroll()
  const actualRef = externalRef && externalRef.current ? externalRef : internalRef
  const elementScrollPosition = useElementScroll(actualRef)

  const windowScroll =
    externalRef && externalRef.current ? elementScrollPosition : windowScrollPosition
  const elementWindowOffset = useElementWindowOffset(actualRef)
  // Always use internalRef (actual grid container) for elementSize calculation
  // containerRef may have different width (e.g., with padding) and should not be used for column width calculation
  const elementSize = useElementSize(internalRef)

  return useMemo(() => {
    return {
      windowSize,
      windowScroll,
      elementWindowOffset,
      elementSize,
    }
  }, [windowSize, windowScroll, elementWindowOffset, elementSize])
}

export function useConfigData<P>(
  containerData: ContainerDataProps,
  props: VirtualizedGridProps<P>,
): ConfigDataProps<P> | null {
  const { items, overscan = 5, gridGap, columnCount, itemData } = props

  const elementWidth = containerData.elementSize ? containerData.elementSize.width : null

  const overscanValue = useMemo(() => {
    return Math.max(0, overscan) // Ensure non-negative overscan
  }, [overscan])

  const gridGapValue = useMemo(() => {
    if (elementWidth === null || elementWidth <= 0) return null
    try {
      if (gridGap) {
        const gap = gridGap(elementWidth, containerData.windowSize.height)
        return Math.max(0, gap) // Ensure non-negative gap
      } else {
        return 0
      }
    } catch (error) {
      console.warn("Error calculating grid gap:", error)
      return 0
    }
  }, [elementWidth, containerData.windowSize.height, gridGap])

  const columnCountValue = useMemo(() => {
    if (elementWidth === null || elementWidth <= 0) return null
    if (gridGapValue === null) return null
    try {
      const count = columnCount(elementWidth, gridGapValue)
      return Math.max(1, Math.floor(count)) // Ensure at least 1 column and integer value
    } catch (error) {
      console.warn("Error calculating column count:", error)
      return 1
    }
  }, [columnCount, elementWidth, gridGapValue])

  const columnWidth = getColumnWidth(columnCountValue, gridGapValue, elementWidth)

  const entries = useMemo(() => {
    if (columnWidth === null || columnWidth <= 0) return null
    const safeColumnWidth = columnWidth
    try {
      return items.map((item, index) => {
        const itemDataResult = itemData(item, safeColumnWidth)
        // Validate item data
        if (!itemDataResult.key) {
          console.warn(`Item at index ${index} missing key, using fallback`)
          itemDataResult.key = `item-${index}`
        }
        if (itemDataResult.height <= 0) {
          console.warn(`Item at index ${index} has invalid height, using default`)
          itemDataResult.height = 50
        }
        return {
          data: itemDataResult,
          item,
        }
      })
    } catch (error) {
      console.error("Error processing items:", error)
      return null
    }
  }, [items, columnWidth, itemData])

  return useMemo(() => {
    // Edge case: No items
    if (!items || items.length === 0) {
      return {
        overscan: overscanValue || 0,
        gridGap: 0,
        columnCount: 1,
        entries: [],
      }
    }

    if (
      overscanValue === null ||
      gridGapValue === null ||
      columnCountValue === null ||
      entries === null
    ) {
      return null
    }
    return {
      overscan: overscanValue,
      gridGap: gridGapValue,
      columnCount: columnCountValue,
      entries,
    }
  }, [overscanValue, gridGapValue, columnCountValue, entries, items])
}

export function useLayoutData<P>(configData: ConfigDataProps<P> | null): LayoutDataProps<P> | null {
  return useMemo(() => {
    if (configData === null) return null

    let currentRowNumber = 1
    let prevRowsTotalHeight = 0
    let currentRowMaxHeight = 0

    const cells = configData.entries.map((entry, index) => {
      const key = entry.data.key

      const columnNumber = (index % configData.columnCount) + 1
      const rowNumber = Math.floor(index / configData.columnCount) + 1

      if (rowNumber !== currentRowNumber) {
        currentRowNumber = rowNumber
        prevRowsTotalHeight += currentRowMaxHeight + configData.gridGap
        currentRowMaxHeight = 0
      }

      const offset = prevRowsTotalHeight
      const height = Math.round(entry.data.height)

      currentRowMaxHeight = Math.max(currentRowMaxHeight, height)

      return { key, columnNumber, rowNumber, offset, height, item: entry.item }
    })

    const totalHeight = prevRowsTotalHeight + currentRowMaxHeight

    return { totalHeight, cells }
  }, [configData])
}

// Binary search helper to find the first visible cell
function findFirstVisibleCell<P>(
  cells: CellProps<P>[],
  renderTop: number,
  elementWindowOffset: number,
): number {
  let left = 0
  let right = cells.length - 1
  let result = -1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    const cellBottom = elementWindowOffset + cells[mid].offset + cells[mid].height

    if (cellBottom >= renderTop) {
      result = mid
      right = mid - 1
    } else {
      left = mid + 1
    }
  }

  return result
}

// Binary search helper to find the last visible cell
function findLastVisibleCell<P>(
  cells: CellProps<P>[],
  renderBottom: number,
  elementWindowOffset: number,
): number {
  let left = 0
  let right = cells.length - 1
  let result = -1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    const cellTop = elementWindowOffset + cells[mid].offset

    if (cellTop <= renderBottom) {
      result = mid
      left = mid + 1
    } else {
      right = mid - 1
    }
  }

  return result
}

export function useRenderData<P>(
  containerData: ContainerDataProps,
  configData: ConfigDataProps<P> | null,
  layoutData: LayoutDataProps<P> | null,
): RenderDataProps<P> | null {
  return useMemo(() => {
    if (layoutData === null || configData === null) return null

    // Handle edge cases
    if (layoutData.cells.length === 0) {
      return { cellsToRender: [], firstRenderedRowNumber: null, firstRenderedRowOffset: null }
    }

    const cellsToRender: CellProps<P>[] = []
    let firstRenderedRowNumber: null | number = null
    let firstRenderedRowOffset: null | number = null

    if (containerData.elementWindowOffset !== null) {
      const elementWindowOffset = containerData.elementWindowOffset

      const windowTop = containerData.windowScroll.y
      const windowBottom = windowTop + containerData.windowSize.height

      // Convert overscan from rows to approximate pixel margin
      // For better UX, we calculate average row height and multiply by overscan
      const averageRowHeight =
        layoutData.cells.length > 0
          ? layoutData.totalHeight / Math.ceil(layoutData.cells.length / configData.columnCount)
          : 100

      const overscanMargin = configData.overscan * averageRowHeight

      const renderTop = windowTop - overscanMargin
      const renderBottom = windowBottom + overscanMargin

      // Use binary search to find visible range
      const firstIndex = findFirstVisibleCell(layoutData.cells, renderTop, elementWindowOffset)
      const lastIndex = findLastVisibleCell(layoutData.cells, renderBottom, elementWindowOffset)

      if (firstIndex !== -1 && lastIndex !== -1 && firstIndex <= lastIndex) {
        // Extract visible cells
        for (let i = firstIndex; i <= lastIndex; i++) {
          const cell = layoutData.cells[i]

          if (firstRenderedRowNumber === null) {
            firstRenderedRowNumber = cell.rowNumber
            firstRenderedRowOffset = cell.offset
          }

          if (cell.rowNumber === firstRenderedRowNumber) {
            // Fix: properly update firstRenderedRowOffset
            firstRenderedRowOffset = Math.min(firstRenderedRowOffset!, cell.offset)
          }

          cellsToRender.push(cell)
        }
      }
    }

    return { cellsToRender, firstRenderedRowNumber, firstRenderedRowOffset }
  }, [
    layoutData,
    configData,
    containerData.windowScroll.y,
    containerData.windowSize.height,
    containerData.elementWindowOffset,
  ])
}
