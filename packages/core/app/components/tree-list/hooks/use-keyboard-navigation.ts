import { useCallback, useEffect, useRef, useState } from "react"
import { flattenTree } from "../utilities/tree-utils"
import { TreeNodeType, KeyboardNavigationState } from "../types"

export interface UseKeyboardNavigationProps {
  data: TreeNodeType[]
  flattenedNodes: TreeNodeType[]
  expandedNodeIds: Set<string>
  selectedNodeIds: Set<string>
  keyboardState: KeyboardNavigationState
  setKeyboardState: React.Dispatch<React.SetStateAction<KeyboardNavigationState>>
  setExpandedNodeIds: React.Dispatch<React.SetStateAction<Set<string>>>
  selectAllVisibleItems: () => void
  keyboardNavigation: boolean
  selectionMode: "single" | "multiple"
  onNodeSelect?: (
    selectedNodes: TreeNodeType[],
    event?: React.MouseEvent | React.KeyboardEvent,
  ) => void
  onNodeExpand?: (node: TreeNodeType, isExpanded: boolean) => void
  startRename: (node: TreeNodeType) => void
}

export function useKeyboardNavigation({
  data,
  flattenedNodes,
  expandedNodeIds,
  selectedNodeIds,
  keyboardState,
  setKeyboardState,
  setExpandedNodeIds,
  selectAllVisibleItems,
  keyboardNavigation,
  selectionMode,
  onNodeSelect,
  onNodeExpand,
  startRename,
}: UseKeyboardNavigationProps) {
  // container ref for attaching keyboard events
  const containerRef = useRef<HTMLDivElement>(null)

  // 检测Command键状态
  const [isCommandKeyPressed, setIsCommandKeyPressed] = useState(false)

  // 添加全局Command键监听
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Meta" || e.key === "Control") {
        setIsCommandKeyPressed(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Meta" || e.key === "Control") {
        setIsCommandKeyPressed(false)
      }
    }

    // 当窗口失去焦点时，重置Command键状态
    const handleBlur = () => {
      setIsCommandKeyPressed(false)
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    window.addEventListener("blur", handleBlur)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      window.removeEventListener("blur", handleBlur)
    }
  }, [])

  // 处理键盘导航
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!keyboardNavigation || !keyboardState.focusedNodeId) return

      const { key, ctrlKey, metaKey } = event
      const focusedNode = flattenedNodes.find((node) => node.id === keyboardState.focusedNodeId)
      if (!focusedNode) return

      // 检查是否有节点正在进行重命名
      // 如果正在重命名，Enter键应该由重命名输入框自己处理，不应该在这里拦截
      // 可以通过检查当前是否有激活的输入框来判断
      const isCurrentlyRenaming =
        document.activeElement &&
        document.activeElement.tagName.toLowerCase() === "input" &&
        document.activeElement.closest(".group\\/tree-node") !== null

      if (isCurrentlyRenaming && (key === "Enter" || key === "Escape")) {
        // 重命名状态下，Enter和Escape键由输入框自己处理
        return
      }

      // 阻止默认行为
      let handled = false

      switch (key) {
        case "Enter": {
          // Enter键行为：展开文件夹并选中其中的项目
          handled = true

          // 只处理具有子节点的文件夹
          if (focusedNode.children && focusedNode.children.length > 0) {
            // 确定当前的展开状态
            const isExpanded = focusedNode.state.isExpanded

            if (!isExpanded) {
              // 首先，将此文件夹添加到展开的节点集合中
              const newExpandedIds = new Set(expandedNodeIds)
              newExpandedIds.add(focusedNode.id)

              // 更新状态并同步计算选择项
              setExpandedNodeIds(newExpandedIds)

              // 通知外部展开事件
              onNodeExpand?.(focusedNode, true)

              // 计算并立即选择所有可见项目
              const allVisibleItems = new Set<string>()

              // 创建一个临时的扁平节点列表，模拟展开后的状态
              const updatedNodes = flattenTree(data, 0, null, [], newExpandedIds, selectedNodeIds)

              // 递归函数，收集所有可见的子项（但跳过已展开的文件夹）
              const collectVisibleItems = (node: TreeNodeType) => {
                // 跳过根节点
                if (node.state.level === 0) return

                const isFolder = node.children && node.children.length > 0
                const nodeExpanded = newExpandedIds.has(node.id)

                // 如果是文件夹且已展开，不选择文件夹本身，但要处理其子项
                if (isFolder && nodeExpanded) {
                  // 不添加已展开的文件夹，但要递归处理其子项
                  if (node.children) {
                    node.children.forEach((child) => {
                      // 查找子项在临时节点列表中的完整节点引用
                      const childNode = updatedNodes.find((n) => n.id === child.id)
                      if (childNode) {
                        collectVisibleItems(childNode)
                      }
                    })
                  }
                } else {
                  // 如果是普通项目或未展开的文件夹，直接添加
                  allVisibleItems.add(node.id)
                }
              }

              // 从所有一级节点开始收集
              updatedNodes.forEach((node) => {
                // 只检查当前文件夹的直接子项
                if (node.parentId === focusedNode.id) {
                  collectVisibleItems(node)
                }
              })

              // 立即更新选择状态
              if (allVisibleItems.size > 0) {
                const newSelectableNodes = flattenedNodes.filter((node) =>
                  allVisibleItems.has(node.id),
                )
                onNodeSelect?.(newSelectableNodes, event)
                console.log(`Selected ${allVisibleItems.size} items after expanding folder`)
              }
            } else {
              // 如果当前文件夹已展开，查找第一个未展开的子文件夹
              const findFirstClosedSubfolder = () => {
                // 深度优先搜索未展开的子文件夹
                const dfs = (nodeIds: string[]): TreeNodeType | null => {
                  for (const id of nodeIds) {
                    const node = flattenedNodes.find((n) => n.id === id)
                    if (node && node.children && node.children.length > 0) {
                      // 如果找到未展开的文件夹，返回它
                      if (!node.state.isExpanded) {
                        return node
                      }
                      // 如果文件夹已经展开，递归搜索其子节点
                      const result = dfs(node.children.map((child) => child.id))
                      if (result) return result
                    }
                  }
                  return null
                }

                // 从当前文件夹的子节点开始搜索
                return dfs(focusedNode.children?.map((child) => child.id) || [])
              }

              // 查找第一个未展开的子文件夹
              const nextClosedFolder = findFirstClosedSubfolder()

              if (nextClosedFolder) {
                // 找到了未展开的子文件夹，将焦点设置到它
                setKeyboardState((prev) => ({
                  ...prev,
                  focusedNodeId: nextClosedFolder.id,
                  lastSelectedNodeId: nextClosedFolder.id,
                }))

                // 更新展开状态
                const newExpandedIds = new Set(expandedNodeIds)
                newExpandedIds.add(nextClosedFolder.id)

                // 更新状态
                setExpandedNodeIds(newExpandedIds)

                // 通知外部展开事件
                onNodeExpand?.(nextClosedFolder, true)

                // 计算并立即选择所有可见项目
                const allVisibleItems = new Set<string>()

                // 创建一个临时的扁平节点列表，模拟展开后的状态
                const updatedNodes = flattenTree(data, 0, null, [], newExpandedIds, selectedNodeIds)

                // 递归函数，收集所有可见的子项（但跳过已展开的文件夹）
                const collectVisibleItems = (node: TreeNodeType) => {
                  // 跳过根节点
                  if (node.state.level === 0) return

                  const isFolder = node.children && node.children.length > 0
                  const nodeExpanded = newExpandedIds.has(node.id)

                  // 如果是文件夹且已展开，不选择文件夹本身，但要处理其子项
                  if (isFolder && nodeExpanded) {
                    // 不添加已展开的文件夹，但要递归处理其子项
                    if (node.children) {
                      node.children.forEach((child) => {
                        // 查找子项在临时节点列表中的完整节点引用
                        const childNode = updatedNodes.find((n) => n.id === child.id)
                        if (childNode) {
                          collectVisibleItems(childNode)
                        }
                      })
                    }
                  } else {
                    // 如果是普通项目或未展开的文件夹，直接添加
                    allVisibleItems.add(node.id)
                  }
                }

                // 从所有一级节点开始收集
                updatedNodes.forEach((node) => {
                  // 只检查当前文件夹的直接子项
                  if (node.parentId === focusedNode.id) {
                    collectVisibleItems(node)
                  }
                })

                // 立即更新选择状态
                if (allVisibleItems.size > 0) {
                  const newSelectableNodes = flattenedNodes.filter((node) =>
                    allVisibleItems.has(node.id),
                  )
                  onNodeSelect?.(newSelectableNodes, event)
                  console.log(`Selected ${allVisibleItems.size} items after expanding sub-folder`)
                }
              } else {
                // 如果没有找到未展开的子文件夹，则选择所有可见子项
                selectAllVisibleItems()
              }
            }
          } else if (event.altKey) {
            // 对于非文件夹节点，Alt+Enter 仍然触发重命名
            startRename(focusedNode)
          }
          break
        }

        case "F2": {
          // 开始重命名
          handled = true
          startRename(focusedNode)
          break
        }

        case "a": {
          // Ctrl/Cmd+A 全选
          if ((ctrlKey || metaKey) && selectionMode === "multiple") {
            handled = true
            const allSelectableNodes = flattenedNodes.filter((node) => node.state.isVisible)
            onNodeSelect?.(allSelectableNodes, event)
          }
          break
        }
      }

      if (handled) {
        event.preventDefault()
        event.stopPropagation()
      }
    },
    [
      keyboardNavigation,
      keyboardState.focusedNodeId,
      flattenedNodes,
      startRename,
      selectionMode,
      onNodeSelect,
      selectAllVisibleItems,
      expandedNodeIds,
      onNodeExpand,
      data,
      selectedNodeIds,
      setExpandedNodeIds,
      setKeyboardState,
    ],
  )

  // 监听容器键盘事件
  useEffect(() => {
    const container = containerRef.current
    if (!container || !keyboardNavigation) return

    container.tabIndex = 0
    container.addEventListener("keydown", handleKeyDown as unknown as EventListener)

    return () => {
      container.removeEventListener("keydown", handleKeyDown as unknown as EventListener)
    }
  }, [handleKeyDown, keyboardNavigation])

  return {
    containerRef,
    handleKeyDown,
    isCommandKeyPressed,
  }
}
