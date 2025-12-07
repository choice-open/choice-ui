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

// 3. 选择Context - 管理选中状态
interface SelectionContextValue {
  isSelected: (id: string) => boolean
  selectedItems: Set<string>
  selection?: boolean
  toggleSelection: (id: string) => void // 是否启用选择功能
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

// 5. 层级Context - 传递嵌套层级信息
interface LevelContextValue {
  level: number
}

export const LevelContext = createContext<LevelContextValue>({ level: 0 })

export function useLevelContext() {
  return useContext(LevelContext)
}
