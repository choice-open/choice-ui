import type { ReactNode, RefObject } from "react"

/** Selection mode for the table */
export type SelectionMode = "single" | "multiple" | "none"

/** Scroll mode for virtualization */
export type ScrollMode = "container" | "window"

/** Row key type */
export type RowKey = string | number

/** Sort direction */
export type SortDirection = "asc" | "desc"

/** Sorting state */
export interface SortingState {
  id: string
  desc: boolean
}

/** Row selection state */
export type SelectionState = Set<RowKey>

/** Column definition */
export interface TableColumnDef<T = unknown> {
  /** Unique column identifier */
  id: string
  /** Column header content */
  header?: ReactNode
  /** Column width (px or CSS value) */
  width?: number | string
  /** Minimum column width */
  minWidth?: number
  /** Maximum column width */
  maxWidth?: number
  /** Flex grow value for flexible column width (e.g., 1, 2, 3) */
  flex?: number
  /** Whether column is sortable */
  sortable?: boolean
  /** Whether column is resizable */
  resizable?: boolean
  /** Custom cell className */
  className?: string
  /** Custom header className */
  headerClassName?: string
  /** Accessor key for auto-rendering cell values from row data */
  accessorKey?: keyof T & string
}

/** Column width state */
export interface ColumnWidthState {
  [columnId: string]: number
}

/** Alias for ColumnWidthState */
export type ColumnWidthsState = ColumnWidthState

/** Column order state */
export type ColumnOrderState = string[]

/** Resize state for showing guide line during drag */
export interface ResizeState {
  columnId: string
  startX: number
  startWidth: number
  currentX: number
}

/** Table instance (exposed via ref) */
export interface TableInstance<T> {
  /** Get all rows data */
  getData: () => T[]
  /** Get selected row keys */
  getSelectedKeys: () => RowKey[]
  /** Get selected rows data */
  getSelectedRows: () => T[]
  /** Check if row is selected */
  isRowSelected: (key: RowKey) => boolean
  /** Select row */
  selectRow: (key: RowKey) => void
  /** Deselect row */
  deselectRow: (key: RowKey) => void
  /** Toggle row selection */
  toggleRowSelection: (key: RowKey) => void
  /** Select all rows */
  selectAll: () => void
  /** Deselect all rows */
  deselectAll: () => void
  /** Check if all rows are selected */
  isAllSelected: () => boolean
  /** Check if some (but not all) rows are selected */
  isSomeSelected: () => boolean
}

/** Internal row data with metadata */
export interface InternalRow<T> {
  key: RowKey
  data: T
  index: number
}

/** Consecutive selection style type */
export type ConsecutiveStyle = "rounded-md" | "rounded-t-md" | "rounded-b-md" | "rounded-none" | ""

/** Table context value */
export interface TableContextValue<T = unknown> {
  // Data
  data: T[]
  rows: InternalRow<T>[]
  getRowKey: (row: T, index: number) => RowKey
  columns: TableColumnDef<T>[]
  columnOrder: ColumnOrderState
  registerColumn: (column: TableColumnDef<T>) => void
  unregisterColumn: (id: string) => void

  // Selection
  selectable: boolean
  selectionMode: SelectionMode
  selectedKeys: Set<RowKey>
  isRowSelected: (key: RowKey) => boolean
  toggleRowSelection: (key: RowKey, index?: number) => void
  handleCheckboxClick: (key: RowKey, index: number, event: React.MouseEvent) => void
  isAllSelected: () => boolean
  isSomeSelected: () => boolean
  selectAll: () => void
  deselectAll: () => void

  // Sorting
  sortable: boolean
  sorting: SortingState[]
  toggleSort: (columnId: string) => void
  getSortDirection: (columnId: string) => SortDirection | null

  // Column resizing
  resizable: boolean
  columnWidths: ColumnWidthState
  resizeState: ResizeState | null
  getColumnWidth: (columnId: string) => number | undefined
  startResize: (columnId: string, startX: number, startWidth: number) => void
  updateResize: (currentX: number) => void
  endResize: () => void

  // Column reordering
  reorderable: boolean
  dragState: { columnId: string; targetIndex: number } | null
  startDrag: (columnId: string) => void
  updateDragTarget: (targetIndex: number) => void
  endDrag: () => void
  cancelDrag: () => void

  // Scroll & Virtualization
  scrollMode: ScrollMode
  scrollRef?: RefObject<HTMLElement>
  containerRef?: RefObject<HTMLElement>
  virtualized: boolean
  /** Fixed row height in pixels */
  rowHeight: number
  overscan: number

  // UI State
  activeRowKey: RowKey | null
  onRowClick?: (row: T, event: React.MouseEvent) => void
  getConsecutiveStyle: (index: number) => ConsecutiveStyle
  tableRef: RefObject<HTMLDivElement>

  // Instance
  tableInstance: TableInstance<T>
}

/** Props for the Table root component */
export interface TableProps<T> {
  /** Table data */
  data: T[]
  /** Function to get unique key for each row */
  getRowKey: (row: T, index: number) => RowKey
  /** Whether to show selection column */
  selectable?: boolean
  /** Selection mode */
  selectionMode?: SelectionMode
  /** Controlled selected keys */
  selectedKeys?: RowKey[]
  /** Default selected keys (uncontrolled) */
  defaultSelectedKeys?: RowKey[]
  /** Selection change callback */
  onSelectionChange?: (selectedKeys: RowKey[]) => void
  /** Whether to enable virtualization */
  virtualized?: boolean
  /** Fixed row height in pixels for virtualization (default: 32) */
  rowHeight?: number
  /** Number of rows to render outside viewport */
  overscan?: number
  /** Scroll mode */
  scrollMode?: ScrollMode
  /** Custom scroll element ref (for custom container scroll) */
  scrollRef?: RefObject<HTMLElement>
  /** Custom container ref (for custom container scroll) */
  containerRef?: RefObject<HTMLElement>
  /** Whether table is sortable */
  sortable?: boolean
  /** Controlled sorting state */
  sorting?: SortingState[]
  /** Default sorting state */
  defaultSorting?: SortingState[]
  /** Sorting change callback */
  onSortingChange?: (sorting: SortingState[]) => void
  /** Whether columns are resizable */
  resizable?: boolean
  /** Controlled column widths */
  columnWidths?: ColumnWidthState
  /** Default column widths */
  defaultColumnWidths?: ColumnWidthState
  /** Column width change callback */
  onColumnWidthsChange?: (widths: ColumnWidthState) => void
  /** Whether columns are reorderable */
  reorderable?: boolean
  /** Controlled column order */
  columnOrder?: ColumnOrderState
  /** Default column order */
  defaultColumnOrder?: ColumnOrderState
  /** Column order change callback */
  onColumnOrderChange?: (order: ColumnOrderState) => void
  /** Active row key (for highlighting) */
  activeRowKey?: RowKey | null
  /** Row click handler */
  onRowClick?: (row: T, event: React.MouseEvent) => void
  /** Custom class name */
  className?: string
  /** Container height (for container scroll mode) */
  height?: number | string
  /** Scroll event callback (for infinite scroll, etc.) */
  onScroll?: (event: { scrollTop: number; scrollHeight: number; clientHeight: number }) => void
  /** Ref to table instance */
  tableRef?: RefObject<TableInstance<T> | null>
  /** Column definitions for simplified usage (auto-renders header + body) */
  columns?: TableColumnDef<T>[]
  /** Children (Table.Header, Table.Body) */
  children?: ReactNode
}

/** Props for Table.Header */
export interface TableHeaderProps {
  children: ReactNode
  className?: string
}

/** Props for Table.Column (used inside Table.Header) */
export interface TableColumnProps {
  /** Unique column identifier */
  id: string
  /** Column header content */
  children?: ReactNode
  /** Column width */
  width?: number | string
  /** Minimum width */
  minWidth?: number
  /** Maximum width */
  maxWidth?: number
  /** Flex grow value for flexible column width (e.g., 1, 2, 3) */
  flex?: number
  /** Whether sortable */
  sortable?: boolean
  /** Whether resizable (overrides table-level setting) */
  resizable?: boolean
  /** Header className */
  className?: string
}

/** Props for Table.Body */
export interface TableBodyProps<T = unknown> {
  /** Render function for each row */
  children: (row: T, index: number) => ReactNode
  /** Body className */
  className?: string
  /** Body class names */
  classNames?: {
    viewport?: string
  }
}

/** Props for Table.Row */
export interface TableRowProps {
  /** Row key (must match getRowKey result) */
  rowKey: RowKey
  /** Row index */
  index: number
  /** Children (Table.Cell elements) */
  children: ReactNode
  /** Row className */
  className?: string
  /** Click handler */
  onClick?: (event: React.MouseEvent) => void
}

/** Props for Table.Cell */
export interface TableCellProps {
  /** Cell content */
  children: ReactNode
  /** Column id this cell belongs to */
  columnId?: string
  /** Cell className */
  className?: string
}

/** Props for Table.Value */
export interface TableValueProps {
  /** Value content */
  children?: ReactNode
  /** Value className */
  className?: string
}

/** Props for Table.Footer (e.g., loading indicator for infinite scroll) */
export interface TableFooterProps {
  /** Footer content */
  children: ReactNode
  /** Footer className */
  className?: string
}

/** Props for Table.SelectCell */
export interface TableSelectCellProps {
  /** Row key */
  rowKey: RowKey
  /** Row index */
  index: number
  /** Disabled state */
  disabled?: boolean
}
