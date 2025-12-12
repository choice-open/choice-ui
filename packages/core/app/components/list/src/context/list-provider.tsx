import { ReactNode, useCallback, useMemo, useReducer, useState } from "react"
import {
  ActiveItemContext,
  ExpandContext,
  SelectionContext,
  StructureContext,
} from "./list-context"

interface ListProviderProps {
  children: ReactNode
  interactive?: boolean
  selection?: boolean
  shouldShowReferenceLine?: boolean
  size?: "default" | "large"
  variant?: "default" | "primary"
}

// Use reducer to manage complex state, reduce re-rendering
type ExpandAction = { id: string; type: "TOGGLE_SUBLIST" }

function expandReducer(state: Set<string>, action: ExpandAction): Set<string> {
  switch (action.type) {
    case "TOGGLE_SUBLIST": {
      const newState = new Set(state)
      if (newState.has(action.id)) {
        newState.delete(action.id)
      } else {
        newState.add(action.id)
      }
      return newState
    }
    default:
      return state
  }
}

type SelectionAction =
  | { id: string; type: "TOGGLE_SELECTION" }
  | { ids: Set<string>; type: "SET_SELECTION" }

function selectionReducer(state: Set<string>, action: SelectionAction): Set<string> {
  switch (action.type) {
    case "TOGGLE_SELECTION": {
      const newState = new Set(state)
      if (newState.has(action.id)) {
        newState.delete(action.id)
      } else {
        newState.add(action.id)
      }
      return newState
    }
    case "SET_SELECTION":
      return new Set(action.ids)
    default:
      return state
  }
}

type StructureAction =
  | { id: string; parentId?: string; type: "REGISTER_ITEM" }
  | { id: string; type: "UNREGISTER_ITEM" }

function structureReducer(
  state: Map<string, { parentId?: string }>,
  action: StructureAction,
): Map<string, { parentId?: string }> {
  switch (action.type) {
    case "REGISTER_ITEM": {
      const newState = new Map(state)
      newState.set(action.id, { parentId: action.parentId })
      return newState
    }
    case "UNREGISTER_ITEM": {
      const newState = new Map(state)
      newState.delete(action.id)
      return newState
    }
    default:
      return state
  }
}

export function ListProvider({
  children,
  interactive = true,
  shouldShowReferenceLine,
  selection,
  variant = "default",
  size = "default",
}: ListProviderProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null)

  const [expandedSubLists, dispatchExpand] = useReducer(expandReducer, new Set<string>())
  const [selectedItems, dispatchSelection] = useReducer(selectionReducer, new Set<string>())
  const [itemsMap, dispatchStructure] = useReducer(structureReducer, new Map())

  // 优化的回调函数
  const toggleSubList = useCallback((id: string) => {
    dispatchExpand({ type: "TOGGLE_SUBLIST", id })
  }, [])

  const isSubListExpanded = useCallback(
    (id: string) => expandedSubLists.has(id),
    [expandedSubLists],
  )

  const toggleSelection = useCallback((id: string) => {
    dispatchSelection({ type: "TOGGLE_SELECTION", id })
  }, [])

  const isSelected = useCallback((id: string) => selectedItems.has(id), [selectedItems])

  const registerItem = useCallback((id: string, parentId?: string) => {
    dispatchStructure({ type: "REGISTER_ITEM", id, parentId })
  }, [])

  const unregisterItem = useCallback((id: string) => {
    dispatchStructure({ type: "UNREGISTER_ITEM", id })
  }, [])

  // Create independent value objects for each Context to reduce unnecessary re-rendering
  const activeItemValue = useMemo(
    () => ({
      activeItem,
      setActiveItem,
    }),
    [activeItem],
  )

  const expandValue = useMemo(
    () => ({
      expandedSubLists,
      toggleSubList,
      isSubListExpanded,
    }),
    [expandedSubLists, toggleSubList, isSubListExpanded],
  )

  const selectionValue = useMemo(
    () => ({
      selectedItems,
      toggleSelection,
      isSelected,
      selection,
    }),
    [selectedItems, toggleSelection, isSelected, selection],
  )

  const structureValue = useMemo(
    () => ({
      registerItem,
      unregisterItem,
      itemsMap,
      interactive,
      shouldShowReferenceLine,
      variant,
      size,
    }),
    [registerItem, unregisterItem, itemsMap, interactive, shouldShowReferenceLine, variant, size],
  )

  // Use nested Provider pattern, allowing components to selectively subscribe to the minimum required Context
  return (
    <StructureContext.Provider value={structureValue}>
      <ActiveItemContext.Provider value={activeItemValue}>
        <ExpandContext.Provider value={expandValue}>
          <SelectionContext.Provider value={selectionValue}>{children}</SelectionContext.Provider>
        </ExpandContext.Provider>
      </ActiveItemContext.Provider>
    </StructureContext.Provider>
  )
}
