import { tcx } from "@choice-ui/shared"
import { useCallback, useMemo, useRef, useState, type ReactNode, type RefObject } from "react"
import {
  TableColumnStateContext,
  TableDragResizeContext,
  TableRowsContext,
  TableScrollContext,
  TableSelectionContext,
  TableStaticContext,
} from "../context"
import { useColumnOrder, useColumnResize, useConsecutiveSelectionStyle, useTable } from "../hooks"
import type { TableColumnDef, TableProps } from "../types"
import { tableVariants } from "../tv"
import { DragGuide } from "./drag-guide"
import { ResizeGuide } from "./resize-guide"
import { TableHeader } from "./table-header"
import { TableColumn } from "./table-column"
import { TableBody } from "./table-body"
import { TableRow } from "./table-row"
import { TableCell } from "./table-cell"

export function TableRoot<T>({
  data,
  getRowKey,
  selectable = false,
  selectionMode = "multiple",
  selectedKeys: controlledSelectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  virtualized = true,
  rowHeight = 32,
  overscan = 5,
  scrollMode = "container",
  scrollRef,
  sortable = false,
  sorting: controlledSorting,
  defaultSorting,
  onSortingChange,
  resizable = false,
  columnWidths: controlledColumnWidths,
  defaultColumnWidths,
  onColumnWidthsChange,
  reorderable = false,
  columnOrder: controlledColumnOrder,
  defaultColumnOrder,
  onColumnOrderChange,
  activeRowKey,
  onRowClick,
  onScroll,
  className,
  height,
  tableRef: instanceRef,
  columns: columnsProp,
  children,
}: TableProps<T>): ReactNode {
  const tv = tableVariants()
  const tableRef = useRef<HTMLDivElement>(null)

  // Header inner ref for direct DOM manipulation (bypasses React state for performance)
  const headerInnerRef = useRef<HTMLDivElement>(null)

  // Body scroll ref state
  const [bodyScrollRef, setBodyScrollRef] = useState<RefObject<HTMLDivElement> | null>(null)

  // Direct DOM sync for scroll - no React state update, no re-render
  const syncScrollLeft = useCallback((value: number) => {
    if (headerInnerRef.current) {
      headerInnerRef.current.style.transform = `translateX(-${value}px)`
    }
  }, [])

  const {
    rows,
    columns,
    registerColumn,
    unregisterColumn,
    selectedKeys,
    toggleRowSelection,
    selectAll,
    deselectAll,
    isRowSelected,
    isAllSelected,
    isSomeSelected,
    handleCheckboxClick,
    sorting,
    toggleSort,
    getSortDirection,
    tableInstance,
  } = useTable<T>({
    data,
    getRowKey,
    selectionMode: selectable ? selectionMode : "none",
    selectedKeys: controlledSelectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
    sorting: controlledSorting,
    defaultSorting,
    onSortingChange,
    tableRef: instanceRef,
    columns: columnsProp,
  })

  const { columnWidths, resizeState, getColumnWidth, startResize, updateResize, endResize } =
    useColumnResize({
      columnWidths: controlledColumnWidths,
      defaultColumnWidths,
      onColumnWidthsChange,
    })

  const {
    columnOrder,
    dragState,
    startDrag,
    updateDragTarget,
    updateDragPosition,
    endDrag,
    cancelDrag,
  } = useColumnOrder({
    columnOrder: controlledColumnOrder,
    defaultColumnOrder: defaultColumnOrder ?? columns.map((c) => c.id),
    onColumnOrderChange,
  })

  const getConsecutiveStyle = useConsecutiveSelectionStyle(rows, selectedKeys)

  // Stable refs for data accessors
  const dataRef = useRef(data)
  dataRef.current = data

  const getRowKeyRef = useRef(getRowKey)
  getRowKeyRef.current = getRowKey

  const onRowClickRef = useRef(onRowClick)
  onRowClickRef.current = onRowClick

  const onScrollRef = useRef(onScroll)
  onScrollRef.current = onScroll

  // Stable accessor functions
  const stableGetData = useCallback(() => dataRef.current, [])
  const stableGetRowKey = useCallback(
    (row: unknown, index: number) => getRowKeyRef.current(row as T, index),
    [],
  )
  const stableOnRowClick = useCallback(
    (row: unknown, event: React.MouseEvent) => onRowClickRef.current?.(row as T, event),
    [],
  )
  const stableOnScroll = useCallback(
    (event: { scrollTop: number; scrollHeight: number; clientHeight: number }) =>
      onScrollRef.current?.(event),
    [],
  )

  // Stable setBodyScrollRef callback
  const stableSetBodyScrollRef = useCallback((ref: RefObject<HTMLDivElement>) => {
    setBodyScrollRef(ref)
  }, [])

  const effectiveVirtualized =
    height === undefined && columnsProp && !children && scrollMode !== "window"
      ? false
      : virtualized

  // Context values
  const staticContextValue = useMemo(
    () => ({
      getData: stableGetData,
      getRowKey: stableGetRowKey,
      columns: columns as TableColumnDef<unknown>[],
      registerColumn: registerColumn as (column: TableColumnDef<unknown>) => void,
      unregisterColumn,
      selectable,
      selectionMode: selectable ? selectionMode : ("none" as const),
      sortable,
      resizable,
      reorderable,
      virtualized: effectiveVirtualized,
      rowHeight,
      overscan,
      scrollMode,
      scrollRef,
      tableRef,
      toggleSort,
      getSortDirection,
      onRowClick: stableOnRowClick,
      onScroll: stableOnScroll,
      tableInstance: tableInstance as unknown as import("../types").TableInstance<unknown>,
    }),
    [
      stableGetData,
      stableGetRowKey,
      columns,
      registerColumn,
      unregisterColumn,
      selectable,
      selectionMode,
      sortable,
      resizable,
      reorderable,
      effectiveVirtualized,
      rowHeight,
      overscan,
      scrollMode,
      scrollRef,
      toggleSort,
      getSortDirection,
      stableOnRowClick,
      stableOnScroll,
      tableInstance,
    ],
  )

  const scrollContextValue = useMemo(
    () => ({
      headerInnerRef,
      syncScrollLeft,
      bodyScrollRef,
      setBodyScrollRef: stableSetBodyScrollRef,
    }),
    [syncScrollLeft, bodyScrollRef, stableSetBodyScrollRef],
  )

  const selectionContextValue = useMemo(
    () => ({
      selectedKeys,
      isRowSelected,
      toggleRowSelection,
      handleCheckboxClick,
      isAllSelected,
      isSomeSelected,
      selectAll,
      deselectAll,
      getConsecutiveStyle,
      activeRowKey: activeRowKey ?? null,
    }),
    [
      selectedKeys,
      isRowSelected,
      toggleRowSelection,
      handleCheckboxClick,
      isAllSelected,
      isSomeSelected,
      selectAll,
      deselectAll,
      getConsecutiveStyle,
      activeRowKey,
    ],
  )

  const columnStateContextValue = useMemo(
    () => ({
      columnWidths,
      columnOrder: columnOrder.length > 0 ? columnOrder : columns.map((c) => c.id),
      sorting,
      getColumnWidth,
    }),
    [columnWidths, columnOrder, columns, sorting, getColumnWidth],
  )

  const dragResizeContextValue = useMemo(
    () => ({
      resizeState,
      startResize,
      updateResize,
      endResize,
      dragState,
      startDrag,
      updateDragTarget,
      updateDragPosition,
      endDrag,
      cancelDrag,
    }),
    [
      resizeState,
      startResize,
      updateResize,
      endResize,
      dragState,
      startDrag,
      updateDragTarget,
      updateDragPosition,
      endDrag,
      cancelDrag,
    ],
  )

  const rowsContextValue = useMemo(() => ({ rows }), [rows])

  // Table-level drag handlers for column reordering
  const handleTableDragOver = useCallback(
    (e: React.DragEvent) => {
      if (!dragState || !reorderable || !tableRef.current) return

      e.preventDefault()
      e.dataTransfer.dropEffect = "move"

      // Update mouse position for ghost
      const tableRect = tableRef.current.getBoundingClientRect()
      const mouseX = e.clientX - tableRect.left
      updateDragPosition(mouseX)

      // Calculate which column we're over based on X position
      const orderedCols = columnOrder.length > 0 ? columnOrder : columns.map((c) => c.id)
      let leftOffset = selectable ? 40 : 0
      let targetIdx = 0

      for (let i = 0; i < orderedCols.length; i++) {
        const colId = orderedCols[i]
        const col = columns.find((c) => c.id === colId)
        const colWidth = getColumnWidth(colId) ?? (typeof col?.width === "number" ? col.width : 150)

        const colMidpoint = leftOffset + colWidth / 2
        if (e.clientX - tableRect.left < colMidpoint) {
          targetIdx = i
          break
        }
        leftOffset += colWidth
        targetIdx = i + 1
      }

      updateDragTarget(targetIdx)
    },
    [
      dragState,
      reorderable,
      selectable,
      columnOrder,
      columns,
      getColumnWidth,
      updateDragPosition,
      updateDragTarget,
    ],
  )

  const handleTableDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      endDrag()
    },
    [endDrag],
  )

  return (
    <TableStaticContext.Provider value={staticContextValue}>
      <TableScrollContext.Provider value={scrollContextValue}>
        <TableSelectionContext.Provider value={selectionContextValue}>
          <TableColumnStateContext.Provider value={columnStateContextValue}>
            <TableDragResizeContext.Provider value={dragResizeContextValue}>
              <TableRowsContext.Provider value={rowsContextValue}>
                <div
                  ref={tableRef}
                  role="table"
                  aria-rowcount={rows.length + 1}
                  aria-colcount={columns.length + (selectable ? 1 : 0)}
                  className={tcx(
                    tv.root({ resizing: !!resizeState, dragging: !!dragState }),
                    className,
                  )}
                  style={{ height }}
                  onDragOver={handleTableDragOver}
                  onDrop={handleTableDrop}
                >
                  {columnsProp && !children ? (
                    <>
                      <TableHeader>
                        {columnsProp.map((col) => (
                          <TableColumn
                            key={col.id}
                            id={col.id}
                            width={col.width}
                            minWidth={col.minWidth}
                            maxWidth={col.maxWidth}
                            flex={col.flex}
                            sortable={col.sortable}
                            resizable={col.resizable}
                            className={col.headerClassName}
                          >
                            {col.header}
                          </TableColumn>
                        ))}
                      </TableHeader>
                      <TableBody>
                        {(row: T, index: number) => (
                          <TableRow
                            rowKey={stableGetRowKey(row, index)}
                            index={index}
                          >
                            {columnsProp!.map((col) => (
                              <TableCell
                                key={col.id}
                                columnId={col.id}
                              >
                                {col.accessorKey
                                  ? String((row as Record<string, unknown>)[col.accessorKey] ?? "")
                                  : ""}
                              </TableCell>
                            ))}
                          </TableRow>
                        )}
                      </TableBody>
                    </>
                  ) : (
                    children
                  )}
                  <ResizeGuide />
                  <DragGuide />
                </div>
              </TableRowsContext.Provider>
            </TableDragResizeContext.Provider>
          </TableColumnStateContext.Provider>
        </TableSelectionContext.Provider>
      </TableScrollContext.Provider>
    </TableStaticContext.Provider>
  )
}
