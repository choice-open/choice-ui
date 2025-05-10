import { useVirtualizer } from "@tanstack/react-virtual"
import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Scroll } from "~/components"
import { tcx } from "~/utils"
import { TreeNode } from "./components"
import {
  useDragDrop,
  useExpansion,
  useKeyboardNavigation,
  useRenaming,
  useSelection,
} from "./hooks"
import { DropPosition, TreeListContext, TreeListProps, TreeNodeType } from "./types"
import { flattenTree } from "./utilities/tree-utils"

// 创建上下文
const TreeContext = createContext<TreeListContext | null>(null)

// 自定义Hook获取上下文
export const useTreeContext = () => {
  const context = React.useContext(TreeContext)
  if (!context) {
    throw new Error("useTreeContext must be used within a TreeList")
  }
  return context
}

// 默认节点高度
const DEFAULT_NODE_HEIGHT = 32

export const TreeList = (props: TreeListProps) => {
  const {
    data,
    selectedNodeIds,
    className,
    style,
    containerWidth,
    virtualScroll = true,
    nodeHeight = DEFAULT_NODE_HEIGHT,
    selectionMode = "multiple",
    allowDrag = true,
    allowDrop = true,
    keyboardNavigation = true,
    renderNode,
    renderIcon,
    renderActions,
    onNodeSelect,
    onNodeExpand,
    onNodeRename,
    onNodeContextMenu,
    onNodeDrop,

    onMouseDown,
  } = props

  // 跟踪节点最大宽度的状态
  const [maxNodeWidth, setMaxNodeWidth] = useState<number>(0)

  // 用于测量节点宽度的ref
  const nodeMeasurerRef = useRef<Map<string, number>>(new Map())

  // 使用提取的钩子
  const { expandedNodeIds, expandNode, setExpandedNodeIds } = useExpansion({
    onNodeExpand,
  })

  // 创建初始的节点列表（没有选择状态）
  const initialFlattenedNodes = useMemo(() => {
    return flattenTree(data, 0, null, [], expandedNodeIds, new Set()) as unknown as TreeNodeType[]
  }, [data, expandedNodeIds])

  const selectedNodes = initialFlattenedNodes.filter((node) => selectedNodeIds.has(node.id))

  const { keyboardState, setKeyboardState, selectNode, selectAllVisibleItems } = useSelection({
    selectedNodeIds,
    flattenedNodes: initialFlattenedNodes,
    selectionMode,
    onNodeSelect,
  })

  // 使用选择状态重新计算扁平化节点列表
  const flattenedNodes = useMemo(() => {
    // 获取基本的扁平化节点，包含选择状态
    return flattenTree(
      data,
      0,
      null,
      [],
      expandedNodeIds,
      selectedNodeIds,
    ) as unknown as TreeNodeType[]
  }, [data, expandedNodeIds, selectedNodeIds])

  const {
    isRenaming: _isRenaming,
    startRename,
    endRename,
  } = useRenaming({
    onNodeRename,
  })

  const { dragState, listRef, startDrag, handleDragOver, handleDrop, handleDragEnd } = useDragDrop({
    allowDrag,
    allowDrop,
    nodeHeight,
    onNodeDrop,
  })

  // 添加自动展开文件夹的事件监听
  useEffect(() => {
    // 事件处理函数：当拖拽悬停在关闭的文件夹上时自动展开
    const handleFolderExpand = (event: Event) => {
      const customEvent = event as CustomEvent
      const nodeId = customEvent.detail?.nodeId

      if (nodeId) {
        // 查找对应的节点
        const nodeToExpand = flattenedNodes.find((node) => node.id === nodeId)
        if (nodeToExpand && !nodeToExpand.state.isExpanded) {
          // 执行展开操作
          expandNode(nodeToExpand, true)
        }
      }
    }

    // 添加事件监听器
    document.addEventListener("folder-expand", handleFolderExpand as EventListener)

    // 清理函数
    return () => {
      document.removeEventListener("folder-expand", handleFolderExpand as EventListener)
    }
  }, [expandNode, flattenedNodes])

  const { containerRef, handleKeyDown, isCommandKeyPressed } = useKeyboardNavigation({
    data: flattenedNodes,
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
  })

  // 处理右键菜单
  const handleContextMenu = useCallback(
    (node: TreeNodeType, event: React.MouseEvent) => {
      onNodeContextMenu?.(node, event)
    },
    [onNodeContextMenu],
  )

  // 更新节点的拖拽状态
  const nodesWithDragState = useMemo(() => {
    return flattenedNodes.map((node) => {
      // 判断是否正在拖拽
      const isDragging = dragState.dragNodes.some((dragNode) => dragNode.id === node.id)
      // 判断是否是放置目标
      const isDropTarget = dragState.dropTargetNode?.id === node.id
      // 判断是否已选中
      const isSelected = selectedNodeIds.has(node.id)

      // isParentSelected已经在flattenTree函数中计算好了
      // 这里保持原值即可，因为它考虑了所有祖先节点的选中状态
      const { isParentSelected } = node.state

      if (isDragging || isDropTarget || isSelected || isParentSelected) {
        return {
          ...node,
          state: {
            ...node.state,
            isDragging,
            isDropTarget,
            isSelected,
            // 保持原有的isParentSelected值
            dropPosition: isDropTarget ? dragState.dropPosition : undefined,
          },
        } as TreeNodeType
      }

      return {
        ...node,
        state: {
          ...node.state,
          isSelected,
          // 保持原有的isParentSelected值
        },
      } as TreeNodeType
    })
  }, [flattenedNodes, dragState, selectedNodeIds])

  // 获取可见节点（用于虚拟列表）
  const visibleNodes = useMemo(() => {
    return nodesWithDragState.filter((node) => node.state.isVisible)
  }, [nodesWithDragState])

  // 虚拟滚动设置
  const virtualizer = useVirtualizer({
    count: visibleNodes.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => nodeHeight,
    overscan: 10,
  })

  // 添加节点宽度测量函数
  const measureNodeWidth = useCallback((nodeId: string, width: number) => {
    // 更新节点宽度
    nodeMeasurerRef.current.set(nodeId, width)

    // 查找当前最大宽度
    let currentMax = 0
    nodeMeasurerRef.current.forEach((nodeWidth) => {
      if (nodeWidth > currentMax) {
        currentMax = nodeWidth
      }
    })

    // 无论宽度是增加还是减少，都更新maxNodeWidth
    setMaxNodeWidth(currentMax)
  }, [])

  // 渲染节点
  const renderTreeNode = useCallback(
    (node: TreeNodeType) => {
      // 判断是否是父文件夹的最后一个子项
      const isLastInParent = (() => {
        if (!node.parentId) return false

        // 查找同级节点
        const siblings = flattenedNodes.filter(
          (n) => n.parentId === node.parentId && n.state.level === node.state.level,
        )

        // 如果是同级节点中索引最大的，则为最后一个
        return siblings.length > 0 && siblings[siblings.length - 1].id === node.id
      })()

      // 计算节点在选择组中的位置状态
      const getSelectionPosition = () => {
        // 如果没有选择，或者当前节点没有选择，不需要计算
        if (selectedNodes.length <= 1 || !node.state.isSelected) {
          return {
            isFirstSelected: false,
            isMiddleSelected: false,
            isLastSelected: false,
          }
        }

        // 获取所有可见的已选择节点的索引，并按索引排序
        const selectedIndices = visibleNodes
          .map((n, index) => (n.state.isSelected ? index : -1))
          .filter((index) => index !== -1)
          .sort((a, b) => a - b)

        // 当前节点在visibleNodes中的索引
        const currentNodeIndex = visibleNodes.findIndex((n) => n.id === node.id)

        // 查找当前节点在selectedIndices中的位置
        const positionInSelection = selectedIndices.indexOf(currentNodeIndex)

        // 检查当前选择是否是连续的组
        // 寻找当前节点所在的连续组
        let startOfGroup = positionInSelection
        let endOfGroup = positionInSelection

        // 向前查找连续索引
        while (
          startOfGroup > 0 &&
          selectedIndices[startOfGroup - 1] === selectedIndices[startOfGroup] - 1
        ) {
          startOfGroup--
        }

        // 向后查找连续索引
        while (
          endOfGroup < selectedIndices.length - 1 &&
          selectedIndices[endOfGroup + 1] === selectedIndices[endOfGroup] + 1
        ) {
          endOfGroup++
        }

        // 如果连续组的长度大于1，并且当前节点在这个组内
        const inConsecutiveGroup = endOfGroup - startOfGroup >= 1

        // 判断节点在连续组中的位置
        const isFirstInGroup = inConsecutiveGroup && positionInSelection === startOfGroup
        const isLastInGroup = inConsecutiveGroup && positionInSelection === endOfGroup

        return {
          isFirstSelected: isFirstInGroup,
          isMiddleSelected: inConsecutiveGroup && !isFirstInGroup && !isLastInGroup,
          isLastSelected: isLastInGroup,
        }
      }

      const { isFirstSelected, isMiddleSelected, isLastSelected } = getSelectionPosition()

      const hasHorizontalScroll =
        listRef.current && listRef.current.scrollWidth > listRef.current.clientWidth

      // 判断是否处于多选模式（选中的节点数大于1）
      const isMultiSelectionActive = selectedNodes.length > 1

      // 检查目标节点是否是拖拽节点的子孙
      const isInvalidDropTarget =
        dragState.isDragging &&
        dragState.dragNodes.some((dragNode) => {
          // 只检查文件夹节点
          if (dragNode.children && dragNode.children.length > 0) {
            // 检查是否存在祖先-后代关系
            let current: TreeNodeType | undefined = node

            // 如果节点本身是拖拽节点，不是无效目标
            if (current.id === dragNode.id) return false

            // 检查父节点链
            while (current && current.parentId) {
              if (current.parentId === dragNode.id) {
                return true // 找到了祖先关系，是无效目标
              }
              // 获取父节点
              current = flattenedNodes.find((n) => n.id === current?.parentId)
              if (!current) break
            }
          }
          return false
        })

      return renderNode ? (
        renderNode(node)
      ) : (
        <TreeNode
          key={node.id}
          node={node}
          containerWidth={containerWidth}
          renderIcon={renderIcon}
          renderActions={renderActions}
          isLastInParent={isLastInParent}
          isFirstSelected={isFirstSelected}
          isMiddleSelected={isMiddleSelected}
          isLastSelected={isLastSelected}
          hasHorizontalScroll={!!hasHorizontalScroll}
          isMultiSelectionActive={isMultiSelectionActive}
          isCommandKeyPressed={isCommandKeyPressed}
          onSelect={(node, event) =>
            selectNode(node, event?.ctrlKey || event?.metaKey, event?.shiftKey, event)
          }
          onExpand={expandNode}
          onDragStart={(_node, event) =>
            startDrag(
              selectedNodes.length > 0 && node.state.isSelected ? selectedNodes : [node],
              event,
            )
          }
          onDragOver={(node, event) => {
            // 如果目标节点是拖拽文件夹的子节点，完全阻止操作
            if (isInvalidDropTarget) {
              event.stopPropagation()
              event.preventDefault()
              return
            }
            handleDragOver(node, event)
          }}
          onDragEnd={handleDragEnd}
          onDrop={(node, event) => {
            // 如果目标节点是拖拽文件夹的子节点，完全阻止操作
            if (isInvalidDropTarget) {
              event.stopPropagation()
              event.preventDefault()
              return
            }

            // 使用与handleDragOver相同的逻辑计算放置位置
            const targetElement = event.currentTarget as HTMLElement
            const rect = targetElement.getBoundingClientRect()
            const relY = event.clientY - rect.top
            const height = rect.height

            // 严格判断是否是文件夹（必须有子项）
            const isFolderWithChildren = Boolean(
              node.children && Array.isArray(node.children) && node.children.length > 0,
            )

            // 判断文件夹是否已展开
            const isFolderExpanded = isFolderWithChildren && node.state.isExpanded

            // 默认放置位置
            let position: DropPosition = "after"

            // 放置位置逻辑
            if (isFolderExpanded) {
              // 对于已展开的文件夹：
              // - 上部区域允许before放置
              // - 中部和下部区域强制为inside
              if (relY < height * 0.25) {
                position = "before" // 在文件夹上方放置仍然允许
              } else {
                position = "inside" // 中部和下部区域强制为inside
                // 确保文件夹在放置时已展开
                if (!node.state.isExpanded) {
                  expandNode(node, true)
                }
              }
            } else if (isFolderWithChildren) {
              // 未展开的文件夹根据鼠标位置决定放置位置
              if (relY < height * 0.25) {
                position = "before"
              } else if (relY > height * 0.75) {
                position = "after"
              } else {
                position = "inside"
                // 确保文件夹在放置时已展开
                if (!node.state.isExpanded) {
                  expandNode(node, true)
                }
              }
            } else {
              // 普通项目只能放在前面或后面
              if (relY < height * 0.5) {
                position = "before"
              } else {
                position = "after"
              }
            }

            handleDrop(node, position)
          }}
          onRename={endRename}
          onContextMenu={handleContextMenu}
          onMeasure={(width) => measureNodeWidth(node.id, width)}
        />
      )
    },
    [
      listRef,
      selectedNodes,
      dragState.isDragging,
      dragState.dragNodes,
      renderNode,
      containerWidth,
      renderIcon,
      renderActions,
      isCommandKeyPressed,
      expandNode,
      handleDragEnd,
      endRename,
      handleContextMenu,
      flattenedNodes,
      visibleNodes,
      selectNode,
      startDrag,
      handleDragOver,
      handleDrop,
      measureNodeWidth,
    ],
  )

  // 上下文值
  const contextValue = useMemo<TreeListContext>(
    () => ({
      flattenedNodes: nodesWithDragState,
      selectedNodes,
      expandedNodeIds,
      dragState,
      keyboardState,
      selectNode,
      expandNode,
      startDrag,
      handleDrop,
      handleContextMenu,
      startRename,
      endRename,
      handleKeyDown,
    }),
    [
      nodesWithDragState,
      selectedNodes,
      expandedNodeIds,
      dragState,
      keyboardState,
      selectNode,
      expandNode,
      startDrag,
      handleDrop,
      handleContextMenu,
      startRename,
      endRename,
      handleKeyDown,
    ],
  )

  return (
    <TreeContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        onMouseDown={() => {
          onMouseDown?.()
        }}
        className={tcx(
          className,
          "group/tree-list tree-list",
          dragState.isDragging && "dragging-active",
        )}
        style={
          {
            ...style,
            "--tree-list-width": containerWidth + "px",
            "--tree-list-height": `${virtualizer.getTotalSize()}px`,
            "--tree-node-width": `${
              maxNodeWidth > 0 ? `${Math.max(maxNodeWidth + 16, containerWidth || 0)}px` : "100%"
            }`,
          } as React.CSSProperties
        }
        onContextMenu={(e) => {
          // 如果点击背景，可能会创建新节点
          if (e.target === e.currentTarget) {
            e.preventDefault()
            // 这里可以添加创建新节点的逻辑或者调用上下文菜单
          }
        }}
      >
        <Scroll className="h-full overflow-hidden">
          <Scroll.Viewport
            ref={listRef}
            className="tree-list__viewport h-full"
          >
            <div className="tree-list__content">
              {virtualScroll ? (
                <>
                  {virtualizer.getVirtualItems().map((virtualItem) => {
                    const node = visibleNodes[virtualItem.index]
                    return (
                      <div
                        key={node.id}
                        className="group/tree-node"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: `${virtualItem.size}px`,
                          transform: `translateY(${virtualItem.start}px)`,
                        }}
                      >
                        {renderTreeNode(node)}
                      </div>
                    )
                  })}
                </>
              ) : (
                visibleNodes.map((node) => renderTreeNode(node))
              )}
            </div>
          </Scroll.Viewport>
        </Scroll>
      </div>
    </TreeContext.Provider>
  )
}
