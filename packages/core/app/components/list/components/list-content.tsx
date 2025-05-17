import { forwardRef, useMemo } from "react"
import { tcx } from "~/utils"
import { useExpandContext, useStructureContext } from "../context"
import { ListContentTv } from "../tv"

interface ListContentProps extends React.HTMLProps<HTMLDivElement> {
  parentId?: string
  children: React.ReactNode
}

export const ListContent = forwardRef<HTMLDivElement, ListContentProps>((props, ref) => {
  const { children, className, parentId, ...rest } = props

  const { isSubListExpanded } = useExpandContext()
  const { itemsMap, shouldShowReferenceLine } = useStructureContext()

  const level = useMemo(() => {
    if (!parentId) return 0

    // 使用迭代而非递归计算层级，避免潜在的调用栈溢出
    let currentLevel = 1
    let currentParentId = parentId
    let visitedIds = new Set<string>() // 避免循环引用导致的无限循环

    while (currentParentId && !visitedIds.has(currentParentId)) {
      visitedIds.add(currentParentId)
      const parentItem = itemsMap.get(currentParentId)

      if (parentItem?.parentId) {
        currentLevel++
        currentParentId = parentItem.parentId
      } else {
        break
      }

      // 安全检查，防止超过最大嵌套层级
      if (currentLevel > 5) break
    }

    return currentLevel
  }, [parentId, itemsMap])

  // 早期返回，避免不必要的样式计算
  if (parentId && !isSubListExpanded(parentId)) {
    return null
  }

  // 类型安全：确保level值在1-5范围内
  const safeLevel = level > 5 ? 5 : ((level < 0 ? 0 : level) as 0 | 1 | 2 | 3 | 4 | 5)

  const styles = ListContentTv({
    showReferenceLine: shouldShowReferenceLine,
    level: safeLevel,
  })

  return (
    <div
      ref={ref}
      role="group"
      data-level={safeLevel}
      data-show-reference-line={shouldShowReferenceLine}
      {...rest}
      className={tcx(styles, className)}
    >
      {children}
    </div>
  )
})

ListContent.displayName = "ListContent"
