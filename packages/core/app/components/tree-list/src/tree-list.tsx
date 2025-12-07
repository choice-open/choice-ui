import { tcx } from "@choiceform/design-shared"
import { ScrollArea } from "@choiceform/scroll-area"
import { useVirtualizer } from "@tanstack/react-virtual"
import React, {
  createContext,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import { TreeNodeWrapper } from "./components"
import { useDragDrop, useModifierKeys, useRenaming, useSelection } from "./hooks"
import { TreeListContext, TreeListHandle, TreeListProps, TreeNodeType } from "./types"
import { findNodePathById, flattenTree } from "./utils/tree"

// 创建上下文
const TreeContext = createContext<TreeListContext | null>(null)

// 自定义 Hook 获取上下文
export const useTreeContext = () => {
  const context = React.useContext(TreeContext)
  if (!context) {
    throw new Error("useTreeContext must be used within a TreeList")
  }
  return context
}

// 默认节点高度
const DEFAULT_NODE_HEIGHT = 32

export const TreeList = React.forwardRef<TreeListHandle, TreeListProps>((props, ref) => {
  const {
    data,
    selectedNodeIds,
    initialExpandedNodeIds,
    className,
    style,
    containerWidth,
    virtualScroll = true,
    nodeHeight = DEFAULT_NODE_HEIGHT,
    allowMultiSelect = true,
    allowDrag = true,
    allowDrop = true,
    renderNode,
    renderIcon,
    renderActions,
    renderLabel,
    onNodeSelect,
    onExpandedNodesChange,
    onNodeRename,
    onNodeContextMenu,
    onNodeDrop,
    onNodeIconDoubleClick,
    onNodeHover,
    onMouseDown,
    showFullPathOnRename,
  } = props

  // 跟踪节点最大宽度的状态
  const [maxNodeWidth, setMaxNodeWidth] = useState<number>(0)

  // 用于测量节点宽度的ref
  const nodeMeasurerRef = useRef<Map<string, number>>(new Map())

  // 使用提取的钩子
  // initialExpandedNodeIds 只作为初始值使用
  const [internalExpandedNodeIds, setInternalExpandedNodeIds] = useState<Set<string>>(
    initialExpandedNodeIds ?? new Set(),
  )

  const expandNode = useCallback(
    (node: TreeNodeType, forceExpanded?: boolean) => {
      const isCurrentlyExpanded = internalExpandedNodeIds.has(node.id)
      const newExpanded = forceExpanded !== undefined ? forceExpanded : !isCurrentlyExpanded

      setInternalExpandedNodeIds((prev) => {
        const newSet = new Set(prev)
        if (newExpanded) {
          newSet.add(node.id)
        } else {
          newSet.delete(node.id)
        }
        return newSet
      })
    },
    [internalExpandedNodeIds],
  )

  const expandedNodeIds = internalExpandedNodeIds

  // 每次展开状态变化时，通知外部
  useEffect(() => {
    onExpandedNodesChange?.(expandedNodeIds)
  }, [expandedNodeIds, onExpandedNodesChange])

  // 暴露方法给外部
  useImperativeHandle(
    ref,
    () => ({
      collapseAll: () => {
        setInternalExpandedNodeIds(new Set())
      },
      expandNodes: (nodeIds: string[]) => {
        setInternalExpandedNodeIds((prev) => {
          const newSet = new Set(prev)
          nodeIds.forEach((id) => {
            newSet.add(id)
          })
          return newSet
        })
      },
    }),
    [],
  )

  // 创建初始的节点列表（没有选择状态）
  const initialFlattenedNodes = useMemo(() => {
    return flattenTree(data, 0, null, [], expandedNodeIds, new Set()) as unknown as TreeNodeType[]
  }, [data, expandedNodeIds])

  const selectedNodes = initialFlattenedNodes.filter((node) => selectedNodeIds.has(node.id))

  const { selectNode } = useSelection({
    allowMultiSelect,
    selectedNodeIds,
    flattenedNodes: initialFlattenedNodes,
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

  const { isCommandKeyPressed, isShiftKeyPressed } = useModifierKeys()

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

  // Track previous selectedNodeIds to only auto-expand when selection changes
  const prevSelectedNodeIdsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (selectedNodeIds.size === 0) {
      prevSelectedNodeIdsRef.current = new Set(selectedNodeIds)
      return
    }

    // Only auto-expand ancestors when selection actually changes, not when expandedNodeIds changes
    const selectionChanged =
      prevSelectedNodeIdsRef.current.size !== selectedNodeIds.size ||
      Array.from(selectedNodeIds).some((id) => !prevSelectedNodeIdsRef.current.has(id)) ||
      Array.from(prevSelectedNodeIdsRef.current).some((id) => !selectedNodeIds.has(id))

    if (!selectionChanged) {
      return
    }

    // Update the ref to track current selection
    prevSelectedNodeIdsRef.current = new Set(selectedNodeIds)

    // Auto-expand ancestors of selected nodes
    setInternalExpandedNodeIds((prev) => {
      const next = new Set(prev)
      let changed = false

      selectedNodeIds.forEach((nodeId) => {
        const path = findNodePathById(data, nodeId)
        if (!path) return
        // expand all ancestors (exclude the node itself)
        path.slice(0, -1).forEach((ancestorId) => {
          if (!next.has(ancestorId)) {
            next.add(ancestorId)
            changed = true
          }
        })
      })

      return changed ? next : prev
    })
  }, [selectedNodeIds, data])

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

  // Track previous selectedNodeIds to detect selection changes
  const prevSelectedForScrollRef = useRef<Set<string>>(new Set())
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 自动滚动到选中的节点
  useEffect(() => {
    // 清理之前的定时器
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
      scrollTimeoutRef.current = null
    }

    if (selectedNodeIds.size === 0 || !virtualScroll) {
      prevSelectedForScrollRef.current = new Set(selectedNodeIds)
      return
    }

    const selectedNodeId = Array.from(selectedNodeIds)[0]

    // 检查选中是否发生变化
    const selectionChanged =
      prevSelectedForScrollRef.current.size !== selectedNodeIds.size ||
      Array.from(selectedNodeIds).some((id) => !prevSelectedForScrollRef.current.has(id))

    const scrollToNode = () => {
      const nodeIndex = visibleNodes.findIndex((node) => node.id === selectedNodeId)
      if (nodeIndex === -1) {
        return false
      }

      // 检查节点是否已经在可见区域内
      const virtualItems = virtualizer.getVirtualItems()
      const isAlreadyVisible = virtualItems.some((item) => item.index === nodeIndex)

      // 如果节点已经在可见区域内，不需要滚动
      if (isAlreadyVisible) {
        return true
      }

      // 节点不在可见区域内，滚动到该节点
      virtualizer.scrollToIndex(nodeIndex, {
        align: "center",
        behavior: "auto",
      })
      return true
    }

    // 如果选中发生变化，立即尝试滚动
    if (selectionChanged) {
      prevSelectedForScrollRef.current = new Set(selectedNodeIds)

      // 尝试立即滚动
      if (scrollToNode()) {
        return
      }

      // 如果节点还未可见（可能需要展开祖先节点），等待展开完成后再尝试滚动
      // 当 expandedNodeIds 变化后，visibleNodes 会更新，这个 effect 会再次触发
      scrollTimeoutRef.current = setTimeout(() => {
        scrollToNode()
        scrollTimeoutRef.current = null
      }, 150) // 等待展开完成
    } else {
      // 即使选中没变化，也检查可见性（处理用户手动滚动后再次点击按钮的情况）
      // 只有当节点不在可见区域内时才滚动
      scrollToNode()
    }
  }, [selectedNodeIds, visibleNodes, virtualizer, virtualScroll, expandedNodeIds])

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

  // 检查是否有水平滚动
  const hasHorizontalScroll =
    listRef.current && listRef.current.scrollWidth > listRef.current.clientWidth

  // 渲染节点
  const renderTreeNode = useCallback(
    (node: TreeNodeType) => {
      return (
        <TreeNodeWrapper
          key={node.id}
          node={node}
          flattenedNodes={flattenedNodes}
          visibleNodes={visibleNodes}
          selectedNodes={selectedNodes}
          containerWidth={containerWidth ?? 0}
          isCommandKeyPressed={isCommandKeyPressed}
          isDragging={dragState.isDragging}
          dragNodes={dragState.dragNodes}
          hasHorizontalScroll={!!hasHorizontalScroll}
          listRef={listRef}
          renderNode={renderNode}
          renderIcon={renderIcon}
          renderActions={renderActions}
          renderLabel={renderLabel}
          onSelect={(node, event) =>
            selectNode(
              node,
              allowMultiSelect && (isCommandKeyPressed || event?.metaKey || event?.ctrlKey),
              isShiftKeyPressed || event?.shiftKey,
              event,
            )
          }
          onExpand={expandNode}
          onDragStart={startDrag}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
          onRename={endRename}
          onContextMenu={handleContextMenu}
          onMeasure={(width) => measureNodeWidth(node.id, width)}
          onIconDoubleClick={onNodeIconDoubleClick}
          onHover={onNodeHover}
          showFullPathOnRename={showFullPathOnRename}
        />
      )
    },
    [
      flattenedNodes,
      visibleNodes,
      selectedNodes,
      containerWidth,
      isCommandKeyPressed,
      dragState.isDragging,
      dragState.dragNodes,
      hasHorizontalScroll,
      listRef,
      renderNode,
      renderIcon,
      renderActions,
      renderLabel,
      selectNode,
      expandNode,
      startDrag,
      handleDragOver,
      handleDragEnd,
      handleDrop,
      endRename,
      handleContextMenu,
      onNodeHover,
      measureNodeWidth,
      allowMultiSelect,
      isShiftKeyPressed,
      onNodeIconDoubleClick,
      showFullPathOnRename,
    ],
  )

  // 上下文值
  const contextValue = useMemo<TreeListContext>(
    () => ({
      flattenedNodes: nodesWithDragState,
      selectedNodes,
      expandedNodeIds,
      dragState,
      selectNode,
      expandNode,
      startDrag,
      handleDrop,
      handleContextMenu,
      startRename,
      endRename,
    }),
    [
      nodesWithDragState,
      selectedNodes,
      expandedNodeIds,
      dragState,
      selectNode,
      expandNode,
      startDrag,
      handleDrop,
      handleContextMenu,
      startRename,
      endRename,
    ],
  )

  return (
    <TreeContext.Provider value={contextValue}>
      <div
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
          if (e.target === e.currentTarget) {
            e.preventDefault()
          }
        }}
      >
        <ScrollArea className="h-full overflow-hidden">
          <ScrollArea.Viewport
            ref={listRef}
            className="tree-list__viewport h-full"
          >
            <ScrollArea.Content className="tree-list__content">
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
            </ScrollArea.Content>
          </ScrollArea.Viewport>
        </ScrollArea>
      </div>
    </TreeContext.Provider>
  )
})

TreeList.displayName = "TreeList"
