import { tcx } from "@choice-ui/shared"
import { forwardRef, useMemo } from "react"
import { LevelContext, useExpandContext, useStructureContext } from "../context"
import { ListContentTv } from "../tv"

export interface ListContentProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode
  parentId?: string
}

export const ListContent = forwardRef<HTMLDivElement, ListContentProps>((props, ref) => {
  const { children, className, parentId, ...rest } = props

  const { isSubListExpanded } = useExpandContext()
  const { itemsMap, shouldShowReferenceLine, size } = useStructureContext()

  const level = useMemo(() => {
    if (!parentId) return 0

    // Use iteration instead of recursion to calculate level, avoid potential call stack overflow
    let currentLevel = 1
    let currentParentId = parentId
    const visitedIds = new Set<string>() // Avoid infinite loop caused by circular references

    while (currentParentId && !visitedIds.has(currentParentId)) {
      visitedIds.add(currentParentId)
      const parentItem = itemsMap.get(currentParentId)

      if (parentItem?.parentId) {
        currentLevel++
        currentParentId = parentItem.parentId
      } else {
        break
      }

      // Safe check to prevent exceeding maximum nested levels
      if (currentLevel > 5) break
    }

    return currentLevel
  }, [parentId, itemsMap])

  // Early return to avoid unnecessary style calculations
  if (parentId && !isSubListExpanded(parentId)) {
    return null
  }

  // Type safety: ensure level value is in the range of 1-5
  const safeLevel = level > 5 ? 5 : ((level < 0 ? 0 : level) as 0 | 1 | 2 | 3 | 4 | 5)

  const tv = ListContentTv({
    showReferenceLine: shouldShowReferenceLine,
    level: safeLevel,
    size,
  })

  return (
    <LevelContext.Provider value={{ level: safeLevel }}>
      <div
        ref={ref}
        role="group"
        data-level={safeLevel}
        className={tcx(tv, className)}
        {...rest}
      >
        {children}
      </div>
    </LevelContext.Provider>
  )
})

ListContent.displayName = "ListContent"
