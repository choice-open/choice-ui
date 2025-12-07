import { tcx } from "@choiceform/design-shared"
import { useRef } from "react"
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

function VirtualizedGridInner<P>(props: VirtualizedGridProps<P>) {
  const ref = useRef<HTMLDivElement>(null)
  const containerData = useContainerData(ref, props.scrollRef, props.containerRef)
  const configData = useConfigData(containerData, props)
  const layoutData = useLayoutData(configData)
  const renderData = useRenderData(containerData, configData, layoutData)

  const intersecting = useIntersecting(
    ref,
    `${configData !== null ? configData.overscan * 100 : 0}px`,
  )

  // Use item pooling if enabled
  const pooledCells = useItemPool(
    renderData?.cellsToRender.map((cell) => ({ key: cell.key, item: cell })) || [],
    {
      poolSize: props.poolSize || 50,
      maxPoolSize: props.maxPoolSize || 200,
    },
  )

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
                return (
                  <div
                    className={tv.item()}
                    data-index={props.items.findIndex((item) => item === cell.item)}
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
                    {props.renderItem(cell.item, pooledCell.index)}
                  </div>
                )
              })
            : renderData !== null &&
              renderData.cellsToRender.map((cell, index) => {
                return (
                  <div
                    className={tv.item()}
                    data-index={props.items.findIndex((item) => item === cell.item)}
                    data-render-index={index}
                    data-id={cell.key}
                    key={cell.key}
                    style={{
                      height: cell.height,
                      gridColumnStart: `${cell.columnNumber}`,
                      gridRowStart: getGridRowStart(cell, renderData),
                      ...props.itemProps?.style,
                    }}
                  >
                    {props.renderItem(cell.item, index)}
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
