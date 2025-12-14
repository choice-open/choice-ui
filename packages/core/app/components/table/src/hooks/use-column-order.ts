import { useCallback, useState, useRef } from "react"
import type { ColumnOrderState } from "../types"

interface UseColumnOrderOptions {
  columnOrder?: ColumnOrderState
  defaultColumnOrder?: ColumnOrderState
  onColumnOrderChange?: (order: ColumnOrderState) => void
}

export interface DragState {
  columnId: string
  targetIndex: number
  /** Mouse X position relative to table */
  mouseX: number
  /** Source column left offset */
  sourceLeft: number
  /** Source column width */
  sourceWidth: number
}

export function useColumnOrder(options: UseColumnOrderOptions) {
  const { columnOrder: controlledOrder, defaultColumnOrder = [], onColumnOrderChange } = options

  const isControlled = controlledOrder !== undefined
  const [internalOrder, setInternalOrder] = useState<ColumnOrderState>(defaultColumnOrder)
  const columnOrder = isControlled ? controlledOrder : internalOrder

  const [dragState, setDragState] = useState<DragState | null>(null)

  // Use refs to access latest values without closure issues
  const dragStateRef = useRef<DragState | null>(null)
  const columnOrderRef = useRef(columnOrder)
  columnOrderRef.current = columnOrder

  const updateOrder = useCallback(
    (newOrder: ColumnOrderState) => {
      if (!isControlled) {
        setInternalOrder(newOrder)
      }
      onColumnOrderChange?.(newOrder)
    },
    [isControlled, onColumnOrderChange],
  )

  const startDrag = useCallback(
    (columnId: string, mouseX: number, sourceLeft: number, sourceWidth: number) => {
      const state: DragState = { columnId, targetIndex: -1, mouseX, sourceLeft, sourceWidth }
      dragStateRef.current = state
      setDragState(state)
    },
    [],
  )

  const updateDragTarget = useCallback((targetIndex: number) => {
    if (dragStateRef.current) {
      dragStateRef.current = { ...dragStateRef.current, targetIndex }
    }
    setDragState((prev) => (prev ? { ...prev, targetIndex } : null))
  }, [])

  const updateDragPosition = useCallback((mouseX: number) => {
    if (dragStateRef.current) {
      dragStateRef.current = { ...dragStateRef.current, mouseX }
    }
    setDragState((prev) => (prev ? { ...prev, mouseX } : null))
  }, [])

  const endDrag = useCallback(() => {
    const currentDragState = dragStateRef.current
    if (!currentDragState || currentDragState.targetIndex < 0) {
      dragStateRef.current = null
      setDragState(null)
      return
    }

    const { columnId, targetIndex } = currentDragState

    // Validate columnId is not empty
    if (!columnId) {
      dragStateRef.current = null
      setDragState(null)
      return
    }

    const currentOrder = columnOrderRef.current
    const workingOrder = currentOrder.length > 0 ? [...currentOrder] : []
    const currentIndex = workingOrder.indexOf(columnId)

    // If column not found in order, can't reorder
    if (currentIndex === -1) {
      dragStateRef.current = null
      setDragState(null)
      return
    }

    // Validate target index is within bounds
    if (targetIndex < 0 || targetIndex > workingOrder.length) {
      dragStateRef.current = null
      setDragState(null)
      return
    }

    // If dropping in same position, no change needed
    if (currentIndex === targetIndex || currentIndex + 1 === targetIndex) {
      dragStateRef.current = null
      setDragState(null)
      return
    }

    // Remove from current position
    workingOrder.splice(currentIndex, 1)

    // Insert at new position (adjust for removal if needed)
    const adjustedTarget = targetIndex > currentIndex ? targetIndex - 1 : targetIndex

    // Final bounds check for adjusted target
    const safeTarget = Math.max(0, Math.min(adjustedTarget, workingOrder.length))
    workingOrder.splice(safeTarget, 0, columnId)

    // Clear drag state first
    dragStateRef.current = null
    setDragState(null)

    // Then update order (outside of setState callback)
    updateOrder(workingOrder)
  }, [updateOrder])

  const cancelDrag = useCallback(() => {
    dragStateRef.current = null
    setDragState(null)
  }, [])

  return {
    columnOrder,
    dragState,
    startDrag,
    updateDragTarget,
    updateDragPosition,
    endDrag,
    cancelDrag,
  }
}
