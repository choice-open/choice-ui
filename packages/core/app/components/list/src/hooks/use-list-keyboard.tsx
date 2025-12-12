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

    // Use depth-first search to retrieve visible items
    const dfs = (itemId: string, isVisible: boolean) => {
      if (seen.has(itemId)) return
      seen.add(itemId)

      // If item is visible, add it to the result
      if (isVisible) {
        visibleItems.push(itemId)
      }

      // Find all direct child items
      const childItems = Array.from(itemsMap.entries())
        .filter(([_, data]) => data.parentId === itemId)
        .map(([id]) => id)

      // Recursively process child items, only show child items when current item is expanded
      const isExpanded = isSubListExpanded(itemId)
      childItems.forEach((childId) => {
        dfs(childId, isVisible && isExpanded)
      })
    }

    // Process all top-level items (items without parent)
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
        // If no active item, activate the first visible item
        setActiveItem(visibleItems[0])
        return
      }

      const currentIndex = visibleItems.indexOf(activeItem)
      if (currentIndex === -1) {
        // If current active item is not in visible items, reset to the first visible item
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

          // Remove Enter and Space processing, let Item handle it
          break

        case "ArrowRight":
          e.preventDefault()
          // Only expand when item is a sub-list trigger
          toggleSubList(activeItem)
          break

        case "ArrowLeft": {
          e.preventDefault()
          const item = itemsMap.get(activeItem)
          if (item?.parentId) {
            toggleSubList(item.parentId)
            setActiveItem(item.parentId)
          }
          break
        }

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
