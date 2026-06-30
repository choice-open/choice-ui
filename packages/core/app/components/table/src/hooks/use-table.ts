import { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
import type {
  InternalRow,
  RowKey,
  SelectionMode,
  SortDirection,
  SortingState,
  TableColumnDef,
  TableInstance,
  TableProps,
} from "../types"

interface UseTableOptions<T> {
  data: T[]
  getRowKey: (row: T, index: number) => RowKey
  selectionMode: SelectionMode
  selectedKeys?: RowKey[]
  defaultSelectedKeys?: RowKey[]
  onSelectionChange?: (keys: RowKey[]) => void
  sorting?: SortingState[]
  defaultSorting?: SortingState[]
  onSortingChange?: (sorting: SortingState[]) => void
  tableRef?: TableProps<T>["tableRef"]
  columns?: import("../types").TableColumnDef<T>[]
}

export function useTable<T>(options: UseTableOptions<T>) {
  const {
    data,
    getRowKey,
    selectionMode,
    selectedKeys: controlledSelectedKeys,
    defaultSelectedKeys = [],
    onSelectionChange,
    sorting: controlledSorting,
    defaultSorting = [],
    onSortingChange,
    tableRef,
    columns: columnsProp,
  } = options

  // Column registration
  const [columns, setColumns] = useState<TableColumnDef<T>[]>(columnsProp ?? [])

  const registerColumn = useCallback((column: TableColumnDef<T>) => {
    setColumns((prev) => {
      const exists = prev.find((c) => c.id === column.id)
      if (exists) return prev
      return [...prev, column]
    })
  }, [])

  const unregisterColumn = useCallback((id: string) => {
    setColumns((prev) => prev.filter((c) => c.id !== id))
  }, [])

  // Sync columns from prop when provided
  useEffect(() => {
    if (columnsProp) {
      setColumns(columnsProp)
    }
  }, [columnsProp])

  // Selection state
  const isSelectionControlled = controlledSelectedKeys !== undefined
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<Set<RowKey>>(
    () => new Set(defaultSelectedKeys),
  )

  // Memoize selectedKeys Set to avoid recreating on every render
  const selectedKeys = useMemo(
    () => (isSelectionControlled ? new Set(controlledSelectedKeys) : internalSelectedKeys),
    [isSelectionControlled, controlledSelectedKeys, internalSelectedKeys],
  )

  // Use ref to always access latest selectedKeys in callbacks
  // This avoids stale closure issues
  const selectedKeysRef = useRef(selectedKeys)
  selectedKeysRef.current = selectedKeys

  // Sorting state
  const isSortingControlled = controlledSorting !== undefined
  const [internalSorting, setInternalSorting] = useState<SortingState[]>(defaultSorting)
  const sorting = isSortingControlled ? controlledSorting : internalSorting

  // Track last selected index for shift+click
  const lastSelectedIndexRef = useRef<number | null>(null)

  // Create internal rows with keys
  const rows: InternalRow<T>[] = useMemo(
    () =>
      data.map((item, index) => ({
        key: getRowKey(item, index),
        data: item,
        index,
      })),
    [data, getRowKey],
  )

  // Use ref for rows to access in callbacks
  const rowsRef = useRef(rows)
  rowsRef.current = rows

  // Selection handlers - use refs to avoid stale closures
  const updateSelection = useCallback(
    (newKeys: Set<RowKey>) => {
      if (!isSelectionControlled) {
        setInternalSelectedKeys(newKeys)
      }
      onSelectionChange?.(Array.from(newKeys))
    },
    [isSelectionControlled, onSelectionChange],
  )

  const selectRow = useCallback(
    (key: RowKey) => {
      if (selectionMode === "none") return

      const currentKeys = selectedKeysRef.current
      const newKeys = new Set(currentKeys)
      if (selectionMode === "single") {
        newKeys.clear()
      }
      newKeys.add(key)
      updateSelection(newKeys)
    },
    [selectionMode, updateSelection],
  )

  const deselectRow = useCallback(
    (key: RowKey) => {
      const currentKeys = selectedKeysRef.current
      const newKeys = new Set(currentKeys)
      newKeys.delete(key)
      updateSelection(newKeys)
    },
    [updateSelection],
  )

  const toggleRowSelection = useCallback(
    (key: RowKey, index?: number) => {
      if (selectionMode === "none") return

      const currentKeys = selectedKeysRef.current

      if (currentKeys.has(key)) {
        // Deselect
        const newKeys = new Set(currentKeys)
        newKeys.delete(key)
        updateSelection(newKeys)
      } else {
        // Select
        if (selectionMode === "single") {
          updateSelection(new Set([key]))
        } else {
          const newKeys = new Set(currentKeys)
          newKeys.add(key)
          updateSelection(newKeys)
        }
      }

      if (index !== undefined) {
        lastSelectedIndexRef.current = index
      }
    },
    [selectionMode, updateSelection],
  )

  const selectRange = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (selectionMode !== "multiple") return

      const currentRows = rowsRef.current

      // Edge case: empty data or invalid indices
      if (currentRows.length === 0) return
      if (fromIndex < 0 && toIndex < 0) return

      // Clamp indices to valid range
      const clampedFrom = Math.max(0, Math.min(fromIndex, currentRows.length - 1))
      const clampedTo = Math.max(0, Math.min(toIndex, currentRows.length - 1))

      const start = Math.min(clampedFrom, clampedTo)
      const end = Math.max(clampedFrom, clampedTo)

      const currentKeys = selectedKeysRef.current
      const newKeys = new Set(currentKeys)

      for (let i = start; i <= end; i++) {
        const row = currentRows[i]
        if (row) {
          newKeys.add(row.key)
        }
      }
      updateSelection(newKeys)
    },
    [selectionMode, updateSelection],
  )

  const selectAll = useCallback(() => {
    if (selectionMode !== "multiple") return

    const currentRows = rowsRef.current
    const allKeys = new Set(currentRows.map((row) => row.key))
    updateSelection(allKeys)
  }, [selectionMode, updateSelection])

  const deselectAll = useCallback(() => {
    updateSelection(new Set())
  }, [updateSelection])

  const isRowSelected = useCallback((key: RowKey) => selectedKeys.has(key), [selectedKeys])

  const isAllSelected = useCallback(
    () => rows.length > 0 && rows.every((row) => selectedKeys.has(row.key)),
    [rows, selectedKeys],
  )

  const isSomeSelected = useCallback(
    () => rows.some((row) => selectedKeys.has(row.key)) && !isAllSelected(),
    [rows, selectedKeys, isAllSelected],
  )

  // Sorting handlers
  const updateSorting = useCallback(
    (newSorting: SortingState[]) => {
      if (!isSortingControlled) {
        setInternalSorting(newSorting)
      }
      onSortingChange?.(newSorting)
    },
    [isSortingControlled, onSortingChange],
  )

  const toggleSort = useCallback(
    (columnId: string) => {
      const existingSort = sorting.find((s) => s.id === columnId)

      let newSorting: SortingState[]
      if (!existingSort) {
        newSorting = [{ id: columnId, desc: false }]
      } else if (!existingSort.desc) {
        newSorting = [{ id: columnId, desc: true }]
      } else {
        newSorting = []
      }

      updateSorting(newSorting)
    },
    [sorting, updateSorting],
  )

  const getSortDirection = useCallback(
    (columnId: string): SortDirection | null => {
      const sort = sorting.find((s) => s.id === columnId)
      if (!sort) return null
      return sort.desc ? "desc" : "asc"
    },
    [sorting],
  )

  // Handle checkbox click with shift support
  const handleCheckboxClick = useCallback(
    (key: RowKey, index: number, event: React.MouseEvent) => {
      if (selectionMode === "none") return

      if (event.shiftKey && lastSelectedIndexRef.current !== null && selectionMode === "multiple") {
        selectRange(lastSelectedIndexRef.current, index)
      } else {
        toggleRowSelection(key, index)
      }

      lastSelectedIndexRef.current = index
    },
    [selectionMode, selectRange, toggleRowSelection],
  )

  // Table instance for ref
  const tableInstance: TableInstance<T> = useMemo(
    () => ({
      getData: () => data,
      getSelectedKeys: () => {
        const currentRowKeys = new Set(rows.map((r) => r.key))
        return Array.from(selectedKeys).filter((key) => currentRowKeys.has(key))
      },
      getSelectedRows: () => rows.filter((row) => selectedKeys.has(row.key)).map((row) => row.data),
      isRowSelected,
      selectRow,
      deselectRow,
      toggleRowSelection,
      selectAll,
      deselectAll,
      isAllSelected,
      isSomeSelected,
    }),
    [
      data,
      selectedKeys,
      rows,
      isRowSelected,
      selectRow,
      deselectRow,
      toggleRowSelection,
      selectAll,
      deselectAll,
      isAllSelected,
      isSomeSelected,
    ],
  )

  // Expose instance via ref
  useImperativeHandle(tableRef, () => tableInstance, [tableInstance])

  return {
    // Data
    rows,
    columns,
    registerColumn,
    unregisterColumn,
    // Selection
    selectedKeys,
    selectRow,
    deselectRow,
    toggleRowSelection,
    selectRange,
    selectAll,
    deselectAll,
    isRowSelected,
    isAllSelected,
    isSomeSelected,
    handleCheckboxClick,
    // Sorting
    sorting,
    toggleSort,
    getSortDirection,
    // Instance
    tableInstance,
  }
}
