import { createContext, useContext } from "react"

// 1. 活跃项Context - 管理hover和focus状态
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

// 2. 展开/折叠Context - 管理子列表的展开状态
interface ExpandContextValue {
  expandedSubLists: Set<string>
  toggleSubList: (id: string) => void
  isSubListExpanded: (id: string) => boolean
}

export const ExpandContext = createContext<ExpandContextValue | undefined>(undefined)

export function useExpandContext() {
  const context = useContext(ExpandContext)
  if (!context) {
    throw new Error("useExpandContext must be used within a ListProvider")
  }
  return context
}

// 3. 选择Context - 管理选中状态
interface SelectionContextValue {
  selectedItems: Set<string>
  toggleSelection: (id: string) => void
  isSelected: (id: string) => boolean
  selection?: boolean // 是否启用选择功能
}

export const SelectionContext = createContext<SelectionContextValue | undefined>(undefined)

export function useSelectionContext() {
  const context = useContext(SelectionContext)
  if (!context) {
    throw new Error("useSelectionContext must be used within a ListProvider")
  }
  return context
}

// 4. 结构Context - 管理列表项的结构关系
interface StructureContextValue {
  registerItem: (id: string, parentId?: string) => void
  unregisterItem: (id: string) => void
  itemsMap: Map<string, { parentId?: string }>
  interactive?: boolean
  shouldShowReferenceLine?: boolean
  variant?: "default" | "primary"
  size?: "default" | "large"
}

export const StructureContext = createContext<StructureContextValue | undefined>(undefined)

export function useStructureContext() {
  const context = useContext(StructureContext)
  if (!context) {
    throw new Error("useStructureContext must be used within a ListProvider")
  }
  return context
}

// 5. 层级Context - 传递嵌套层级信息
interface LevelContextValue {
  level: number
}

export const LevelContext = createContext<LevelContextValue>({ level: 0 })

export function useLevelContext() {
  return useContext(LevelContext)
}
