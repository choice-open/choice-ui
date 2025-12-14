import { tcx } from "@choice-ui/shared"
import { useMemo, useRef } from "react"
import { VirtualizedGridErrorBoundary } from "./error-boundary"
import { VirtualizedGridTv } from "./tv"
import { type VirtualizedGridProps } from "./types"
import { useItemPool } from "./use-item-pool"
import {
  useConfigData,
  useContainerData,
  useLayoutData,
  useRenderData,
} from "./use-virtualized-grid"
import { getGridRowStart, useIntersecting } from "./utility"

// Stable empty array for fallback
const EMPTY_VISIBLE_ITEMS: Array<{ key: string; item: never }> = []

function VirtualizedGridInner<P>(props: VirtualizedGridProps<P>) {
  const ref = useRef<HTMLDivElement>(null)
  const containerData = useContainerData(ref, props.scrollRef, props.containerRef)
  const configData = useConfigData(containerData, props)
  const layoutData = useLayoutData(configData)
  const renderData = useRenderData(containerData, configData, layoutData)

  // Pre-compute item to index mapping for O(1) lookup instead of O(n) findIndex
  const itemIndexMap = useMemo(() => {
    const map = new Map<P, number>()
    props.items.forEach((item, index) => map.set(item, index))
    return map
  }, [props.items])

  // Memoize rootMargin to prevent useIntersecting from recreating observer
  const rootMargin = useMemo(
    () => `${configData !== null ? configData.overscan * 100 : 0}px`,
    [configData?.overscan],
  )

  const intersecting = useIntersecting(ref, rootMargin)

  // Memoize visible items array to prevent useItemPool from unnecessary recalculations
  const visibleItemsForPool = useMemo(() => {
    if (!renderData?.cellsToRender) return EMPTY_VISIBLE_ITEMS
    return renderData.cellsToRender.map((cell) => ({ key: cell.key, item: cell }))
  }, [renderData?.cellsToRender])

  // Use item pooling if enabled
  const pooledCells = useItemPool(visibleItemsForPool, {
    poolSize: props.poolSize || 50,
    maxPoolSize: props.maxPoolSize || 200,
  })

  const colWidth = props.fixedColumnWidth ? `${props.fixedColumnWidth}px` : "1fr"

  const tv = VirtualizedGridTv({
    listMode: props.listMode,
  })

  return (
    <div
      className={tcx(tv.base(), props.className)}
      ref={ref}
      style={{
        height: layoutData !== null ? layoutData.totalHeight : undefined,
        paddingTop:
          renderData !== null && renderData.firstRenderedRowOffset !== null
            ? renderData.firstRenderedRowOffset
            : 0,
      }}
    >
      {intersecting && (
        <div
          className={tv.grid()}
          style={{
            gridTemplateColumns: props.listMode
              ? undefined
              : configData !== null
                ? `repeat(${configData.columnCount}, ${colWidth})`
                : undefined,
            gap: configData ? configData.gridGap : undefined,
          }}
        >
          {renderData !== null && props.enablePooling
            ? pooledCells.map((pooledCell) => {
                const cell = pooledCell.item
                const itemIndex = itemIndexMap.get(cell.item) ?? -1
                return (
                  <div
                    className={tv.item()}
                    data-index={itemIndex}
                    data-render-index={pooledCell.index}
                    data-id={cell.key}
                    data-pool-id={pooledCell.poolId}
                    key={`pool-${pooledCell.poolId}`}
                    style={{
                      height: cell.height,
                      gridColumnStart: `${cell.columnNumber}`,
                      gridRowStart: getGridRowStart(cell, renderData),
                      ...props.itemProps?.style,
                    }}
                  >
                    {props.renderItem(cell.item, itemIndex)}
                  </div>
                )
              })
            : renderData !== null &&
              renderData.cellsToRender.map((cell) => {
                const itemIndex = itemIndexMap.get(cell.item) ?? -1
                return (
                  <div
                    className={tv.item()}
                    data-index={itemIndex}
                    data-render-index={itemIndex}
                    data-id={cell.key}
                    key={cell.key}
                    style={{
                      height: cell.height,
                      gridColumnStart: `${cell.columnNumber}`,
                      gridRowStart: getGridRowStart(cell, renderData),
                      ...props.itemProps?.style,
                    }}
                  >
                    {props.renderItem(cell.item, itemIndex)}
                  </div>
                )
              })}
        </div>
      )}
    </div>
  )
}

export function VirtualizedGrid<P>(props: VirtualizedGridProps<P>) {
  return (
    <VirtualizedGridErrorBoundary
      fallback={props.errorFallback}
      onError={props.onError}
    >
      <VirtualizedGridInner {...props} />
    </VirtualizedGridErrorBoundary>
  )
}
