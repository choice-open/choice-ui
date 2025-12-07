import React, { createContext, useContext } from "react"
import type { PanelDropPosition } from "../hooks"

export interface SortableItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
  id: string
  indexKey: string
}

export interface SortableRowDataContextValue<TItem extends SortableItem = SortableItem> {
  item: TItem
}

export const SortableRowDataContext =
  createContext<SortableRowDataContextValue<SortableItem> | null>(null)

export function useSortableRowItem<TItem extends SortableItem = SortableItem>(): TItem {
  const context = useContext(
    SortableRowDataContext as React.Context<SortableRowDataContextValue<TItem> | null>,
  )
  if (!context) {
    throw new Error(
      "useSortableRowItem must be used within a SortableRowDataContext.Provider, typically rendered by PanelSortable for each row.",
    )
  }
  return context.item
}

export interface SortablePaneContextValue {
  getDropPosition: (id: string) => PanelDropPosition
  handleMouseDown: (id: string, e: React.MouseEvent) => void
  isDragging: boolean
  isDropTarget: (id: string) => boolean
  isNodeBeingDragged: (id: string) => boolean
  itemCount: number
  onSelectedIdChange: (id: string | null) => void
  selectedId: string | null
}

export const SortablePaneContext = createContext<SortablePaneContextValue | null>(null)

export const useSortablePane = (): SortablePaneContextValue => {
  const context = useContext(SortablePaneContext)
  if (!context) {
    throw new Error("useSortablePane must be used within PanelSortable")
  }
  return context
}
