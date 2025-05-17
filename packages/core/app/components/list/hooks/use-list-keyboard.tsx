import { KeyboardEvent, useCallback } from "react"
import {
  useActiveItemContext,
  useExpandContext,
  useSelectionContext,
  useStructureContext,
} from "../context"

export function useListKeyboard() {
  const { activeItem, setActiveItem } = useActiveItemContext()
  const { toggleSubList, isSubListExpanded } = useExpandContext()
  const { toggleSelection } = useSelectionContext()
  const { itemsMap } = useStructureContext()

  const getVisibleItems = useCallback(() => {
    const visibleItems: string[] = []
    const seen = new Set<string>()

    // 使用深度优先搜索检索可见项目
    const dfs = (itemId: string, isVisible: boolean) => {
      if (seen.has(itemId)) return
      seen.add(itemId)

      // 如果项目可见，则添加到结果中
      if (isVisible) {
        visibleItems.push(itemId)
      }

      // 查找所有直接子项目
      const childItems = Array.from(itemsMap.entries())
        .filter(([_, data]) => data.parentId === itemId)
        .map(([id]) => id)

      // 递归处理子项目，仅当当前项目展开时才显示子项目
      const isExpanded = isSubListExpanded(itemId)
      childItems.forEach((childId) => {
        dfs(childId, isVisible && isExpanded)
      })
    }

    // 处理所有顶级项目（没有父级的项目）
    const rootItems = Array.from(itemsMap.entries())
      .filter(([_, data]) => !data.parentId)
      .map(([id]) => id)

    rootItems.forEach((id) => dfs(id, true))

    return visibleItems
  }, [itemsMap, isSubListExpanded])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      const visibleItems = getVisibleItems()
      if (!visibleItems.length) return

      if (!activeItem) {
        // 如果没有激活项，激活第一个可见项
        setActiveItem(visibleItems[0])
        return
      }

      const currentIndex = visibleItems.indexOf(activeItem)
      if (currentIndex === -1) {
        // 如果当前活动项不在可见项目中，重置为第一个可见项
        setActiveItem(visibleItems[0])
        return
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          if (currentIndex < visibleItems.length - 1) {
            setActiveItem(visibleItems[currentIndex + 1])
          }
          break

        case "ArrowUp":
          e.preventDefault()
          if (currentIndex > 0) {
            setActiveItem(visibleItems[currentIndex - 1])
          }
          break

        case "Enter":
        case " ":
          e.preventDefault()
          toggleSelection(activeItem)
          break

        case "ArrowRight":
          e.preventDefault()
          // 只有当项目是子列表触发器时才展开
          toggleSubList(activeItem)
          break

        case "ArrowLeft":
          e.preventDefault()
          const item = itemsMap.get(activeItem)
          if (item?.parentId) {
            toggleSubList(item.parentId)
            setActiveItem(item.parentId)
          }
          break

        case "Home":
          e.preventDefault()
          setActiveItem(visibleItems[0])
          break

        case "End":
          e.preventDefault()
          setActiveItem(visibleItems[visibleItems.length - 1])
          break
      }
    },
    [activeItem, getVisibleItems, itemsMap, setActiveItem, toggleSelection, toggleSubList],
  )

  return handleKeyDown
}
