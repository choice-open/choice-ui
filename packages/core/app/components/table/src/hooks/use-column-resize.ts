import { useCallback, useState, useRef } from "react"
import type { ColumnWidthState, ResizeState } from "../types"

interface UseColumnResizeOptions {
  columnWidths?: ColumnWidthState
  defaultColumnWidths?: ColumnWidthState
  onColumnWidthsChange?: (widths: ColumnWidthState) => void
  minWidth?: number
  maxWidth?: number
}

export function useColumnResize(options: UseColumnResizeOptions) {
  const {
    columnWidths: controlledWidths,
    defaultColumnWidths = {},
    onColumnWidthsChange,
    minWidth = 50,
    maxWidth = 1000,
  } = options

  const isControlled = controlledWidths !== undefined
  const [internalWidths, setInternalWidths] = useState<ColumnWidthState>(defaultColumnWidths)
  const columnWidths = isControlled ? controlledWidths : internalWidths

  const [resizeState, setResizeState] = useState<ResizeState | null>(null)

  // Use refs to access latest values without causing re-renders or closure issues
  const resizeStateRef = useRef<ResizeState | null>(null)
  const columnWidthsRef = useRef(columnWidths)
  columnWidthsRef.current = columnWidths

  const updateWidths = useCallback(
    (newWidths: ColumnWidthState) => {
      if (!isControlled) {
        setInternalWidths(newWidths)
      }
      onColumnWidthsChange?.(newWidths)
    },
    [isControlled, onColumnWidthsChange],
  )

  const getColumnWidth = useCallback(
    (columnId: string): number | undefined => {
      return columnWidths[columnId]
    },
    [columnWidths],
  )

  const startResize = useCallback((columnId: string, startX: number, startWidth: number) => {
    const state: ResizeState = {
      columnId,
      startX,
      startWidth,
      currentX: startX,
    }
    resizeStateRef.current = state
    setResizeState(state)
  }, [])

  const updateResize = useCallback((currentX: number) => {
    if (resizeStateRef.current) {
      resizeStateRef.current = { ...resizeStateRef.current, currentX }
    }
    setResizeState((prev) => (prev ? { ...prev, currentX } : null))
  }, [])

  const endResize = useCallback(() => {
    const currentResizeState = resizeStateRef.current
    if (!currentResizeState) {
      setResizeState(null)
      return
    }

    const { columnId, startWidth, startX, currentX } = currentResizeState
    const deltaX = currentX - startX
    // Clamp width between min and max
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, Math.max(0, startWidth + deltaX)))

    // Clear resize state first
    resizeStateRef.current = null
    setResizeState(null)

    // Then update widths (outside of setState callback)
    updateWidths({
      ...columnWidthsRef.current,
      [columnId]: clampedWidth,
    })
  }, [updateWidths, minWidth, maxWidth])

  return {
    columnWidths,
    resizeState,
    getColumnWidth,
    startResize,
    updateResize,
    endResize,
  }
}
