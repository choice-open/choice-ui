import { createContext, useContext } from "react"

// 1. Active Item Context - Manage hover and focus state
interface ActiveItemContextValue {
  activeItem: string | null
  setActiveItem: (id: string | null) => void
}

export const ActiveItemContext = createContext<ActiveItemContextValue | undefined>(undefined)

export function useActiveItemContext() {
  const context = useContext(ActiveItemContext)
  if (!context) {
    throw new Error("useActiveItemContext must be used within a ListProvider")
  }
  return context
}

// 2. Expand/Collapse Context - Manage the expanded state of sublists
interface ExpandContextValue {
  expandedSubLists: Set<string>
  isSubListExpanded: (id: string) => boolean
  toggleSubList: (id: string) => void
}

export const ExpandContext = createContext<ExpandContextValue | undefined>(undefined)

export function useExpandContext() {
  const context = useContext(ExpandContext)
  if (!context) {
    throw new Error("useExpandContext must be used within a ListProvider")
  }
  return context
}

// 3. Selection Context - Manage the selected state
interface SelectionContextValue {
  isSelected: (id: string) => boolean
  selectedItems: Set<string>
  selection?: boolean
  toggleSelection: (id: string) => void // Whether to enable selection functionality
}

export const SelectionContext = createContext<SelectionContextValue | undefined>(undefined)

export function useSelectionContext() {
  const context = useContext(SelectionContext)
  if (!context) {
    throw new Error("useSelectionContext must be used within a ListProvider")
  }
  return context
}

// 4. Structure Context - Manage the structural relationship of list items
interface StructureContextValue {
  interactive?: boolean
  itemsMap: Map<string, { parentId?: string }>
  registerItem: (id: string, parentId?: string) => void
  shouldShowReferenceLine?: boolean
  size?: "default" | "large"
  unregisterItem: (id: string) => void
  variant?: "default" | "primary"
}

export const StructureContext = createContext<StructureContextValue | undefined>(undefined)

export function useStructureContext() {
  const context = useContext(StructureContext)
  if (!context) {
    throw new Error("useStructureContext must be used within a ListProvider")
  }
  return context
}

// 5. Level Context - Pass nested level information
interface LevelContextValue {
  level: number
}

export const LevelContext = createContext<LevelContextValue>({ level: 0 })

export function useLevelContext() {
  return useContext(LevelContext)
}
