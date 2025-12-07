import { useCallback, useState } from "react"
import { TreeNodeType } from "../types"

export interface UseRenamingProps {
  onNodeRename?: (node: TreeNodeType, newName: string) => void
}

export function useRenaming({ onNodeRename }: UseRenamingProps) {
  const [isRenaming, setIsRenaming] = useState<string | null>(null)

  // 处理重命名开始
  const startRename = useCallback((node: TreeNodeType) => {
    setIsRenaming(node.id)
  }, [])

  // 处理重命名结束
  const endRename = useCallback(
    (node: TreeNodeType, newName: string) => {
      onNodeRename?.(node, newName)
      setIsRenaming(null)
    },
    [onNodeRename],
  )

  return {
    isRenaming,
    startRename,
    endRename,
  }
}
