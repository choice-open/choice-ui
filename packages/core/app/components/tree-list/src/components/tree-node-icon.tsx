import { tcx } from "@choiceform/design-shared"
import type { MouseEvent, ReactNode } from "react"
import { TreeNodeType } from "../types"

interface TreeNodeIconProps {
  isSelected: boolean
  node: TreeNodeType
  onIconDoubleClick?: (node: TreeNodeType, event: MouseEvent<HTMLDivElement>) => void
  renderIcon?: (node: TreeNodeType) => ReactNode
}

export function TreeNodeIcon({
  node,
  isSelected,
  renderIcon,
  onIconDoubleClick,
}: TreeNodeIconProps) {
  if (!renderIcon) {
    return null
  }

  const handleDoubleClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    onIconDoubleClick?.(node, event)
  }

  return (
    <div
      className={tcx(
        "flex h-4 w-4 flex-none items-center justify-center",
        isSelected ? "text-default-foreground" : "text-secondary-foreground",
      )}
      onDoubleClick={handleDoubleClick}
    >
      {renderIcon(node)}
    </div>
  )
}
