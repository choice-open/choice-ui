import { ReactNode, useCallback, useMemo, useReducer, useState } from "react"
import {
  ActiveItemContext,
  ExpandContext,
  SelectionContext,
  StructureContext,
} from "./list-context"

interface ListProviderProps {
  children: ReactNode
  shouldShowReferenceLine?: boolean
  selection?: boolean
  variant?: "default" | "primary"
}

// 使用reducer管理复杂状态，减少重渲染
type ExpandAction = { type: "TOGGLE_SUBLIST"; id: string }

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
  | { type: "TOGGLE_SELECTION"; id: string }
  | { type: "SET_SELECTION"; ids: Set<string> }

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
  | { type: "REGISTER_ITEM"; id: string; parentId?: string }
  | { type: "UNREGISTER_ITEM"; id: string }

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
  shouldShowReferenceLine,
  selection,
  variant = "default",
}: ListProviderProps) {
  // 使用普通state管理activeItem，因为它频繁变化但逻辑简单
  const [activeItem, setActiveItem] = useState<string | null>(null)

  // 使用useReducer管理更复杂的状态
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

  // 为每个Context创建独立的值对象，减少不必要的重渲染
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
      shouldShowReferenceLine,
      variant,
    }),
    [registerItem, unregisterItem, itemsMap, shouldShowReferenceLine, variant],
  )

  // 使用嵌套Provider模式，允许组件选择性地订阅最小所需Context
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
