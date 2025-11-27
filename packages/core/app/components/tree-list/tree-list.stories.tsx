import { Element, ToolbarFrame } from "@choiceform/icons-react"
import { observable } from "@legendapp/state"
import { observer } from "@legendapp/state/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { ContextMenu } from "../context-menu"
import { Splitter } from "../splitter"
import { TreeList } from "./tree-list"
import { DropPosition, TreeNodeData, TreeListHandle, TreeNodeType } from "./types"

// 生成示例数据（带可预测的ID结构，便于调试）
const generateDemoTreeData = (): TreeNodeData[] => {
  return [
    {
      id: "home",
      name: "Home",
      isFolder: true,
      isEditable: false, // Home 节点不可编辑，不允许拖拽，始终在最前面
      children: [],
    },
    {
      id: "1",
      name: "Folder 1",
      isFolder: true,
      children: [
        {
          id: "1-1",
          name: "Item 1",
          children: [],
        },
        {
          id: "1-2",
          name: "Item 2",
          children: [],
        },
        {
          id: "1-3",
          name: "Item 3",
          children: [],
        },
      ],
    },
    {
      id: "2",
      name: "Folder 2",
      isFolder: true,
      children: [
        {
          id: "2-1",
          name: "Group 1",
          isFolder: true,
          children: [
            {
              id: "2-1-1",
              name: "Item 1",
              children: [
                {
                  id: "2-1-1-1",
                  name: "Detail 1",
                  children: [],
                },
                {
                  id: "2-1-1-2",
                  name: "Detail 2",
                  children: [],
                },
              ],
            },
            {
              id: "2-1-2",
              name: "Item 2",
              children: [
                {
                  id: "2-1-2-1",
                  name: "Detail 1",
                  children: [],
                },
              ],
            },
          ],
        },
        {
          id: "2-2",
          name: "Group 2",
          isFolder: true,
          children: [
            {
              id: "2-2-1",
              name: "Item 1",
              children: [],
            },
            {
              id: "2-2-2",
              name: "Item 2",
              children: [
                {
                  id: "2-2-2-1",
                  name: "Detail 1",
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "3",
      name: "Folder 3",
      isFolder: true,
      children: [],
    },
  ]
}

// 创建测试数据
const demoTreeData = generateDemoTreeData()
console.log("🤖 ~ demoTreeData:", demoTreeData)

const generateLargeTestData = (rootCount = 500, childrenPerRoot = 20): TreeNodeData[] => {
  const result: TreeNodeData[] = []

  for (let i = 0; i < rootCount; i++) {
    const rootId = `${i + 1}`
    const rootName = `Folder ${i + 1}`

    const children: TreeNodeData[] = []
    for (let j = 0; j < childrenPerRoot; j++) {
      const childId = `${rootId}-${j + 1}`
      children.push({
        id: childId,
        name: `${rootName} / Item ${j + 1}`,
        children: [],
      })
    }

    result.push({
      id: rootId,
      name: rootName,
      isFolder: true,
      children,
    })
  }

  return result
}

const performanceTestData = generateLargeTestData()

const countTreeNodes = (nodes: TreeNodeData[]): number => {
  return nodes.reduce((total, node) => {
    const childCount = node.children ? countTreeNodes(node.children) : 0
    return total + 1 + childCount
  }, 0)
}

const performanceTotalNodes = countTreeNodes(performanceTestData)

const labelVisibilityData: TreeNodeData[] = [
  {
    id: "suite",
    name: "Design suite",
    isFolder: true,
    children: [
      {
        id: "suite-research",
        name: "Research docs",
        children: [],
      },
      {
        id: "suite-wireframes",
        name: "Wireframes",
        children: [],
      },
    ],
  },
  {
    id: "notes",
    name: "Personal notes",
    isFolder: false,
    children: [],
  },
]

const meta: Meta<typeof TreeList> = {
  title: "Components/TreeList",
  component: TreeList,
  tags: ["autodocs", "beta"],
}

export default meta
type Story = StoryObj<typeof TreeList>

// 使用LegendApp状态
const treeState = observable({
  data: demoTreeData, // 使用演示数据集展示全量交互
  selectedNodes: [] as TreeNodeType[],
  expandedNodes: [] as TreeNodeType[],
  useVirtualScroll: true, // 默认启用虚拟滚动
})

// 综合示例组件：包含所有功能
const findNodePath = (
  nodes: TreeNodeData[],
  targetId: string,
  path: TreeNodeData[] = [],
): TreeNodeData[] | null => {
  for (const node of nodes) {
    const currentPath = [...path, node]
    if (node.id === targetId) {
      return currentPath
    }
    if (node.children?.length) {
      const result = findNodePath(node.children, targetId, currentPath)
      if (result) {
        return result
      }
    }
  }
  return null
}

const ComprehensiveTreeList = observer(() => {
  // 处理节点重命名
  const handleNodeRename = (node: TreeNodeType, newName: string) => {
    // 如果节点不可编辑，阻止重命名
    if (node.isEditable === false) {
      console.log("[TreeList] 节点重命名被阻止：节点不可编辑", {
        nodeId: node.id,
        nodeName: node.name,
      })
      return
    }

    const trimmedName = newName.trim()
    const currentData = treeState.data.get()
    const path = findNodePath(currentData, node.id)
    const currentNode = path?.[path.length - 1]

    if (!trimmedName || !currentNode || currentNode.name === trimmedName) {
      if (!trimmedName) {
        console.log("[TreeList] 节点重命名被跳过：新名称为空", {
          nodeId: node.id,
          oldName: currentNode?.name,
        })
      } else if (currentNode && currentNode.name === trimmedName) {
        console.log("[TreeList] 节点重命名被跳过：名称未改变", {
          nodeId: node.id,
          name: trimmedName,
        })
      }
      return
    }

    // 打印重命名信息，方便使用者了解逻辑
    const pathNames = path?.map((n) => n.name) ?? []
    console.log("[TreeList] 节点重命名", {
      nodeId: node.id,
      oldName: currentNode.name,
      newName: trimmedName,
      path: pathNames.length > 0 ? pathNames.join(" / ") : "根节点",
      fullPath: pathNames,
      // 如果 newName 包含 "/"，说明是完整路径（showFullPathOnRename 为 true）
      isFullPath: trimmedName.includes("/"),
    })

    // 递归更新节点
    const updateNodeName = (nodes: TreeNodeData[]): TreeNodeData[] => {
      return nodes.map((n) => {
        if (n.id === node.id) {
          return {
            ...n,
            name: trimmedName,
          }
        }

        if (n.children && n.children.length > 0) {
          return {
            ...n,
            children: updateNodeName(n.children),
          }
        }

        return n
      })
    }

    treeState.data.set(updateNodeName(currentData))
  }

  // 处理节点拖放
  const handleNodeDrop = (
    sourceNodes: TreeNodeType[],
    targetNode: TreeNodeType,
    position: DropPosition,
  ) => {
    try {
      // 实际处理拖放逻辑
      const currentData = treeState.data.get()
      const sourceIds = new Set(sourceNodes.map((n) => n.id))

      // 当目标节点包含在源节点中时，说明拖拽回了原位，直接跳过
      if (sourceIds.has(targetNode.id)) {
        return
      }
      console.log(
        "处理拖放操作：",
        sourceNodes.map((n) => n.id),
        targetNode.id,
        position,
      )

      // 查找节点的父节点路径
      const findNodePath = (
        nodes: TreeNodeData[],
        id: string,
        path: (number | string)[] = [],
      ): (number | string)[] | null => {
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].id === id) {
            return [...path, i]
          }

          if (nodes[i].children?.length) {
            const foundPath = findNodePath(nodes[i].children!, id, [...path, i, "children"])
            if (foundPath) return foundPath
          }
        }
        return null
      }

      // 检查目标节点是否是源节点的子孙节点
      const isDescendantOf = (
        data: TreeNodeData[],
        targetId: string,
        sourceId: string,
      ): boolean => {
        // 获取目标节点的完整路径
        const targetPath = findNodePath(data, targetId)
        if (!targetPath) return false

        // 找到各个节点
        let current = data
        const nodeIds: string[] = []

        // 遍历路径，收集所有父节点ID
        for (let i = 0; i < targetPath.length; i += 2) {
          if (i % 2 === 0) {
            const nodeIndex = targetPath[i] as number
            const node = current[nodeIndex]
            if (node) {
              nodeIds.push(node.id)
              current = i + 1 < targetPath.length && node.children ? node.children : []
            }
          }
        }

        // 检查是否有父节点ID匹配源节点ID
        return nodeIds.includes(sourceId)
      }

      // 根据路径获取节点引用
      const getNodeByPath = (
        nodes: TreeNodeData[],
        path: (number | string)[],
      ): TreeNodeData | null => {
        let current: TreeNodeData[] | TreeNodeData | null = nodes
        for (const segment of path) {
          if (current === null || current === undefined) return null
          if (Array.isArray(current)) {
            current = typeof segment === "number" ? current[segment] : null
          } else {
            current = segment === "children" && current.children ? current.children : null
          }
        }
        return current as TreeNodeData | null
      }

      // 根据路径删除节点
      const removeNodeByPath = (
        nodes: TreeNodeData[],
        path: (number | string)[],
      ): TreeNodeData[] => {
        // 创建深拷贝以避免修改原始数据
        const result = JSON.parse(JSON.stringify(nodes)) as TreeNodeData[]
        let current: TreeNodeData[] | TreeNodeData | undefined = result

        // 导航到要删除节点的父级
        for (let i = 0; i < path.length - 1; i++) {
          const segment = path[i]
          if (Array.isArray(current)) {
            current = typeof segment === "number" ? current[segment] : current
          } else if (current && typeof current === "object") {
            current = segment === "children" && current.children ? current.children : undefined
          }
        }

        // 删除节点
        const lastSegment = path[path.length - 1]
        if (typeof lastSegment === "number") {
          if (Array.isArray(current)) {
            current.splice(lastSegment, 1)
          }
        }

        return result
      }

      // 根据路径在特定位置插入节点
      const insertNodeAtPath = (
        nodes: TreeNodeData[],
        path: (number | string)[],
        nodeToInsert: TreeNodeData,
        position: DropPosition,
      ): TreeNodeData[] => {
        // 创建深拷贝
        const result = JSON.parse(JSON.stringify(nodes)) as TreeNodeData[]

        if (position === "inside") {
          // 向节点内部插入
          let current: TreeNodeData[] | TreeNodeData | null | undefined = result
          for (const segment of path) {
            if (current === null || current === undefined) break
            if (Array.isArray(current)) {
              current = typeof segment === "number" ? current[segment] : undefined
            } else {
              current = segment === "children" ? current.children : undefined
            }
          }

          // 确保children数组存在
          if (current && !Array.isArray(current)) {
            if (!current.children) {
              current.children = []
            }
            current.children.push(nodeToInsert)
          }
        } else {
          // 在节点前/后插入
          let current: TreeNodeData[] | TreeNodeData | undefined = result

          // 导航到要插入节点的父级
          for (let i = 0; i < path.length - 1; i++) {
            const segment = path[i]
            if (Array.isArray(current)) {
              current = typeof segment === "number" ? current[segment] : current
            } else if (current && typeof current === "object") {
              current = segment === "children" && current.children ? current.children : undefined
            }
          }

          const lastSegment = path[path.length - 1]
          if (typeof lastSegment === "number") {
            if (Array.isArray(current)) {
              // 计算插入位置
              const insertIndex = position === "before" ? lastSegment : lastSegment + 1
              current.splice(insertIndex, 0, nodeToInsert)
            }
          }
        }

        return result
      }

      // 主处理流程开始
      let updatedData = [...currentData]

      // ======关键改进：首先检查循环引用问题======
      if (position === "inside") {
        // 检查源节点中是否有文件夹节点
        const folderNodes = sourceNodes.filter(
          (node) => Boolean(node.children && node.children.length > 0) || Boolean(node.isFolder),
        )

        for (const sourceNode of folderNodes) {
          // 检查目标是否是该文件夹的子节点
          if (isDescendantOf(updatedData, targetNode.id, sourceNode.id)) {
            console.warn("不能将文件夹拖拽到其自身的子节点中", sourceNode.id, "->", targetNode.id)
            return // 禁止操作
          }
        }
      }

      // ======安全处理拖拽操作======
      // 获取所有源节点的路径和完整节点信息
      const sourceNodeCopies: { node: TreeNodeData; path: (number | string)[] }[] = []

      // 收集节点信息
      for (const node of sourceNodes) {
        const path = findNodePath(updatedData, node.id)
        if (!path) continue

        const fullNode = getNodeByPath(updatedData, path)
        if (!fullNode) continue

        sourceNodeCopies.push({
          path: path,
          node: JSON.parse(JSON.stringify(fullNode)),
        })
      }

      // 获取目标节点的路径
      const originalTargetPath = findNodePath(updatedData, targetNode.id)
      if (!originalTargetPath) {
        console.error("无法找到目标节点", targetNode.id)
        return
      }

      // 按路径长度和位置排序，确保从最深/最后的节点开始删除
      sourceNodeCopies.sort((a, b) => {
        // 先按路径长度排序（更深的节点先删除）
        const lenDiff = b.path.length - a.path.length
        if (lenDiff !== 0) return lenDiff

        // 如果长度相同，按索引排序（更大索引先删除）
        const lastIndexA = a.path[a.path.length - 1] as number
        const lastIndexB = b.path[b.path.length - 1] as number
        return lastIndexB - lastIndexA
      })

      // 1. 删除所有源节点
      for (const { path } of sourceNodeCopies) {
        updatedData = removeNodeByPath(updatedData, path)
      }

      // 2. 重新查找目标节点路径（因为可能已经变化）
      let targetPath = findNodePath(updatedData, targetNode.id)
      if (!targetPath) {
        console.error("移除源节点后找不到目标节点（可能是循环引用导致）:", targetNode.id)
        return
      }

      // 3. 插入所有节点
      for (let i = 0; i < sourceNodeCopies.length; i++) {
        const { node } = sourceNodeCopies[i]

        // 插入到目标位置
        updatedData = insertNodeAtPath(updatedData, targetPath, node, position)

        // 更新目标路径（可能因为前面的插入而改变）
        if (i < sourceNodeCopies.length - 1) {
          const newPath = findNodePath(updatedData, targetNode.id)
          if (newPath) {
            targetPath = newPath
          }
        }
      }

      // 更新状态
      treeState.data.set(updatedData)
    } catch (err) {
      console.error("Error processing drag and drop:", err)
    }
  }

  const contextMenuTriggerRef = useRef<HTMLDivElement>(null)

  // 处理节点选择
  const handleNodeSelect = (nodes: TreeNodeType[]) => {
    const ids = nodes.map((node) => node.id)

    setSelectedNodeIds(new Set(ids))
    treeState.selectedNodes.set(nodes)
    setExternalSelectionInfo(null)
  }

  const [containerWidth, setContainerWidth] = useState(0)
  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(new Set())
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(new Set())
  const [pendingSelection, setPendingSelection] = useState<string | null>(null)
  const treeListRef = useRef<TreeListHandle>(null)
  const [lastHoveredNode, setLastHoveredNode] = useState<{
    isHovered: boolean
    node: TreeNodeType
    path: string[]
  } | null>(null)
  const [externalSelectionInfo, setExternalSelectionInfo] = useState<{
    id: string
    name: string
    path: string[]
  } | null>(null)
  const [lastActionLog, setLastActionLog] = useState<string>("No node actions triggered yet")
  const [contextMenuNode, setContextMenuNode] = useState<TreeNodeType | null>(null)

  const handleNodeHover = useCallback(
    (node: TreeNodeType, isHovered: boolean, event: React.MouseEvent) => {
      const snapshot = treeState.data.get()
      const path = findNodePath(snapshot, node.id)
      const pathNames = path?.map((item) => item.name) ?? []
      setLastHoveredNode(isHovered ? { node, isHovered, path: pathNames } : null)
    },
    [],
  )

  const renderNodeLabel = useCallback(
    (node: TreeNodeType) => (
      <span className="text-body-tiny text-secondary-foreground">
        {node.isFolder ? "📁" : "📄"} {node.name}
      </span>
    ),
    [],
  )

  const renderNodeActions = useCallback(
    (node: TreeNodeType) => (
      <div className="flex items-center gap-1">
        <button
          type="button"
          title="Favorite node"
          className="text-body-tiny text-secondary-foreground hover:text-default-foreground border-default-border bg-default-background rounded border px-2 py-0.5"
          onClick={(event) => {
            event.stopPropagation()
            event.preventDefault()
            setLastActionLog(`Favorited ${node.name}`)
          }}
        >
          Star
        </button>
        <button
          type="button"
          title="Log node info"
          className="text-body-tiny text-secondary-foreground hover:text-default-foreground border-default-border bg-default-background rounded border px-2 py-0.5"
          onClick={(event) => {
            event.stopPropagation()
            event.preventDefault()
            console.info("[TreeList Story] Inspect node", node)
            setLastActionLog(`Inspected ${node.name}`)
          }}
        >
          Info
        </button>
      </div>
    ),
    [setLastActionLog],
  )

  const handleIconDoubleClick = useCallback((node?: TreeNodeType) => {
    console.log("[TreeList Story] Icon double clicked:")
  }, [])

  const handleNodeContextMenu = useCallback(
    (node: TreeNodeType, event: React.MouseEvent) => {
      setContextMenuNode(node)

      if (typeof window === "undefined") {
        return
      }

      const triggerElement = contextMenuTriggerRef.current
      if (!triggerElement) {
        return
      }

      const { clientX, clientY, screenX, screenY } = event.nativeEvent

      window.requestAnimationFrame(() => {
        const syntheticEvent = new MouseEvent("contextmenu", {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX,
          clientY,
          screenX,
          screenY,
        })

        triggerElement.dispatchEvent(syntheticEvent)
      })
    },
    [contextMenuTriggerRef],
  )

  const handleContextMenuAction = useCallback(
    (action: string) => {
      if (!contextMenuNode) {
        return
      }

      const actionLabel = `${action} ${contextMenuNode.name}`
      setLastActionLog(actionLabel)
      console.info(`[TreeList Story] ${actionLabel}`, contextMenuNode)
    },
    [contextMenuNode],
  )

  const triggerHover = useCallback(() => {
    const dataSnapshot = treeState.data.get()
    const targetId = dataSnapshot[0]?.id
    if (!targetId) {
      return
    }
    const target = document.querySelector<HTMLElement>(`[data-node-id="${targetId}"]`)
    if (!target) {
      return
    }

    const enterEvent = new MouseEvent("mouseenter", {
      bubbles: true,
      cancelable: true,
      view: window,
    })
    target.dispatchEvent(enterEvent)

    window.setTimeout(() => {
      const leaveEvent = new MouseEvent("mouseleave", {
        bubbles: true,
        cancelable: true,
        view: window,
      })
      target.dispatchEvent(leaveEvent)
    }, 1200)
  }, [])

  const selectSpecificNodeExternally = useCallback(() => {
    const snapshot = treeState.data.get()
    const path = findNodePath(snapshot, "2-1-1")
    if (!path) {
      console.warn("[TreeList Story] Target node 2-1-1 not found for external selection")
      return
    }

    const targetNode = path[path.length - 1]
    const ancestorIds = path.slice(0, -1).map((node) => node.id)

    // Check if all ancestors are already expanded
    const allAncestorsExpanded =
      ancestorIds.length === 0 || ancestorIds.every((id) => expandedNodeIds.has(id))

    if (allAncestorsExpanded) {
      // All ancestors are already expanded, select immediately
      setSelectedNodeIds(new Set([targetNode.id]))
      setExternalSelectionInfo({
        id: targetNode.id,
        name: targetNode.name,
        path: path.map((node) => node.name),
      })
    } else {
      // Need to expand ancestors first
      if (ancestorIds.length > 0 && treeListRef.current) {
        treeListRef.current.expandNodes(ancestorIds)
      }

      // Set pending selection - useEffect will handle the actual selection after expansion
      setPendingSelection(targetNode.id)
      setExternalSelectionInfo({
        id: targetNode.id,
        name: targetNode.name,
        path: path.map((node) => node.name),
      })
    }
  }, [expandedNodeIds])

  // Handle pending selection after target node appears in DOM
  useEffect(() => {
    if (!pendingSelection) {
      return
    }

    const snapshot = treeState.data.get()
    const path = findNodePath(snapshot, pendingSelection)
    if (!path) {
      setPendingSelection(null)
      return
    }

    // Check if target node appears in DOM
    const checkNodeInDOM = () => {
      const targetElement = document.querySelector<HTMLElement>(
        `[data-node-id="${pendingSelection}"]`,
      )
      return targetElement !== null
    }

    // If node is already in DOM, select it immediately
    if (checkNodeInDOM()) {
      setSelectedNodeIds(new Set([pendingSelection]))
      setPendingSelection(null)
      return
    }

    // Otherwise, poll for node appearance in DOM
    let attempts = 0
    const maxAttempts = 50 // Maximum 5 seconds (50 * 100ms)
    const pollInterval = 100 // Check every 100ms

    const pollForNode = setInterval(() => {
      attempts++
      if (checkNodeInDOM()) {
        // Node appeared in DOM, select it
        setSelectedNodeIds(new Set([pendingSelection]))
        setPendingSelection(null)
        clearInterval(pollForNode)
      } else if (attempts >= maxAttempts) {
        // Timeout: node didn't appear, give up
        console.warn(
          `[TreeList Story] Timeout waiting for node ${pendingSelection} to appear in DOM`,
        )
        setPendingSelection(null)
        clearInterval(pollForNode)
      }
    }, pollInterval)

    // Cleanup interval on unmount or when pendingSelection changes
    return () => {
      clearInterval(pollForNode)
    }
  }, [pendingSelection])

  const triggerRenameForNodeOneTwo = useCallback(() => {
    if (typeof window === "undefined") {
      return
    }

    const ensureExpanded = (nodeId: string) => {
      const container = document.querySelector<HTMLElement>(`[data-node-id="${nodeId}"]`)
      if (!container) {
        console.warn(`[TreeList Story] Node ${nodeId} not found while expanding`)
        return false
      }

      if (container.dataset.isExpanded === "true") {
        return true
      }

      const toggleButton = container.querySelector<HTMLButtonElement>("button")
      if (!toggleButton) {
        console.warn(`[TreeList Story] Expand toggle not found for node ${nodeId}`)
        return false
      }

      const mouseDownEvent = new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        view: window,
      })
      toggleButton.dispatchEvent(mouseDownEvent)
      return true
    }

    const triggerRename = () => {
      const targetContainer = document.querySelector<HTMLElement>(`[data-node-id="1-2"]`)
      if (!targetContainer) {
        console.warn("[TreeList Story] Target node 1-2 not found for rename trigger")
        return
      }

      const renameTrigger = targetContainer.querySelector<HTMLElement>("span.whitespace-pre")
      if (!renameTrigger) {
        console.warn("[TreeList Story] Rename trigger element not found for node 1-2")
        return
      }

      const dblClickEvent = new MouseEvent("dblclick", {
        bubbles: true,
        cancelable: true,
        view: window,
      })
      renameTrigger.dispatchEvent(dblClickEvent)
    }

    const expanded = ensureExpanded("1")
    if (!expanded) {
      return
    }

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(triggerRename)
    })
  }, [])

  // Handle expanded nodes change callback
  const handleExpandedNodesChange = useCallback((expandedNodeIds: Set<string>) => {
    setExpandedNodeIds(expandedNodeIds)
    // Update treeState for compatibility
    const snapshot = treeState.data.get()
    const expandedNodes = Array.from(expandedNodeIds)
      .map((id) => {
        const path = findNodePath(snapshot, id)
        return path?.[path.length - 1]
      })
      .filter((node): node is TreeNodeType => node !== undefined)
    treeState.expandedNodes.set(expandedNodes)
  }, [])

  // Handle collapse all expanded nodes
  const handleCollapseAll = useCallback(() => {
    if (expandedNodeIds.size === 0) {
      return
    }

    // Call collapseAll method from TreeList ref
    treeListRef.current?.collapseAll()

    console.log("[TreeList Story] Collapsed all nodes", {
      collapsedCount: expandedNodeIds.size,
      nodeIds: Array.from(expandedNodeIds),
    })
  }, [expandedNodeIds])

  return (
    <Splitter
      defaultSizes={[240, 1024]}
      className="absolute! inset-0"
      onChange={(sizes) => {
        setContainerWidth(sizes[0])
      }}
    >
      <Splitter.Pane minSize={240}>
        <div className="relative h-full w-full">
          <TreeList
            ref={treeListRef}
            selectedNodeIds={selectedNodeIds}
            className="h-full w-full"
            containerWidth={containerWidth}
            data={treeState.data.get()}
            virtualScroll={treeState.useVirtualScroll.get()}
            onExpandedNodesChange={handleExpandedNodesChange}
            onNodeRename={handleNodeRename}
            onNodeDrop={handleNodeDrop}
            onNodeSelect={handleNodeSelect}
            onNodeHover={handleNodeHover}
            onNodeIconDoubleClick={handleIconDoubleClick}
            renderLabel={renderNodeLabel}
            renderActions={renderNodeActions}
            onNodeContextMenu={handleNodeContextMenu}
            showFullPathOnRename={true}
            renderIcon={(node) => (
              <>
                {Boolean(node.children && node.children.length > 0) || Boolean(node.isFolder) ? (
                  <ToolbarFrame />
                ) : (
                  <Element />
                )}
              </>
            )}
          />

          <div
            ref={contextMenuTriggerRef}
            className="hidden"
          />

          <ContextMenu triggerRef={contextMenuTriggerRef}>
            <ContextMenu.Content className="min-w-[220px]">
              <ContextMenu.Label>
                {contextMenuNode ? `Actions for ${contextMenuNode.name}` : "Node actions"}
              </ContextMenu.Label>
              <ContextMenu.Item onClick={() => handleContextMenuAction("Rename")}>
                <ContextMenu.Value>Rename</ContextMenu.Value>
              </ContextMenu.Item>
              <ContextMenu.Item onClick={() => handleContextMenuAction("Duplicate")}>
                <ContextMenu.Value>Duplicate</ContextMenu.Value>
              </ContextMenu.Item>
              <ContextMenu.Item onClick={() => handleContextMenuAction("Add child under")}>
                <ContextMenu.Value>Add child</ContextMenu.Value>
              </ContextMenu.Item>
              <ContextMenu.Divider />
              <ContextMenu.Item
                variant="danger"
                onClick={() => handleContextMenuAction("Delete")}
              >
                <ContextMenu.Value>Delete</ContextMenu.Value>
              </ContextMenu.Item>
            </ContextMenu.Content>
          </ContextMenu>
        </div>
      </Splitter.Pane>
      <Splitter.Pane minSize={320}>
        <div className="bg-light-50 flex h-screen min-h-0 w-full flex-1 flex-col">
          <div className="flex flex-col gap-3 p-6">
            <button
              type="button"
              className="border-default-border bg-default-background text-body-small text-default-foreground self-start rounded border px-3 py-2 font-medium shadow-sm hover:bg-gray-100"
              onClick={selectSpecificNodeExternally}
            >
              Select node 2-1-1 externally
            </button>
            <button
              type="button"
              className="border-default-border bg-default-background text-body-small text-default-foreground self-start rounded border px-3 py-2 font-medium shadow-sm hover:bg-gray-100"
              onClick={triggerRenameForNodeOneTwo}
            >
              Rename node 1-2 externally
            </button>
            {expandedNodeIds.size > 0 && (
              <button
                type="button"
                className="border-default-border bg-default-background text-body-small text-default-foreground self-start rounded border px-3 py-2 font-medium shadow-sm hover:bg-gray-100"
                onClick={handleCollapseAll}
              >
                Collapse all folders
              </button>
            )}
            <div className="border-default-border bg-default-background text-body-small text-secondary-foreground rounded border p-3">
              <div className="text-default-foreground font-medium">Last hover</div>
              {lastHoveredNode ? (
                <div className="mt-1 space-y-1">
                  <div>ID: {lastHoveredNode.node.id}</div>
                  <div>Name: {lastHoveredNode.node.name}</div>
                  <div>Status: {lastHoveredNode.isHovered ? "hovered" : "idle"}</div>
                  <div className="truncate">
                    Path: {lastHoveredNode.path.length > 0 ? lastHoveredNode.path.join(" / ") : "—"}
                  </div>
                </div>
              ) : (
                <div className="text-body-small text-tertiary-foreground mt-1">
                  Waiting for hover…
                </div>
              )}
            </div>
            <div className="border-default-border bg-default-background text-body-small text-secondary-foreground rounded border p-3">
              <div className="text-default-foreground font-medium">Recent node action</div>
              <div className="text-default-foreground mt-1">{lastActionLog}</div>
              <div className="text-body-small text-tertiary-foreground mt-1">
                Trigger any tail action button to update this log.
              </div>
            </div>
            <div
              className="border-default-border bg-default-background text-body-small text-secondary-foreground cursor-pointer rounded border p-3 select-none hover:bg-gray-50"
              onDoubleClick={() => {
                const selected = treeState.selectedNodes.get()
                const targetNode = selected[0]

                if (!targetNode) {
                  console.warn(
                    "[TreeList Story] Please select a node before double clicking the demo area.",
                  )
                  return
                }

                handleIconDoubleClick(targetNode)
              }}
            >
              <div className="text-default-foreground font-medium">Manual icon double click</div>
              <div
                className="text-body-small text-default-foreground mt-1"
                onDoubleClick={() => handleIconDoubleClick()}
              >
                Double click
              </div>
            </div>
          </div>
        </div>
      </Splitter.Pane>
    </Splitter>
  )
})

// 导出单一综合示例
export const Comprehensive: Story = {
  render: () => <ComprehensiveTreeList />,
}

const LabelVisibilityDemo = () => {
  const [withActionsSelection, setWithActionsSelection] = useState<Set<string>>(() => new Set())
  const [plainSelection, setPlainSelection] = useState<Set<string>>(() => new Set())
  const containerWidth = 320

  const renderLabel = useCallback(
    (node: TreeNodeType) => (
      <span className="text-body-small text-default-foreground font-medium">{node.name}</span>
    ),
    [],
  )

  const renderIcon = useCallback(
    (node: TreeNodeType) =>
      node.children && node.children.length > 0 ? <ToolbarFrame /> : <Element />,
    [],
  )

  const renderActions = useCallback(
    (node: TreeNodeType) => (
      <button
        type="button"
        className="text-body-tiny text-secondary-foreground hover:text-default-foreground border-default-border rounded border px-2 py-0.5"
        onClick={(event) => {
          event.stopPropagation()
          event.preventDefault()
          console.info("[TreeList Story] Tail action clicked", node.name)
        }}
      >
        Quick view
      </button>
    ),
    [],
  )

  const handleSelectionChange = useCallback(
    (nodes: TreeNodeType[], setter: (ids: Set<string>) => void) => {
      setter(new Set(nodes.map((node) => node.id)))
    },
    [],
  )

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="border-default-border bg-default-background rounded border p-4 shadow-sm">
        <div className="text-body-small text-secondary-foreground mb-3">
          Hovering nodes with actions hides the floating label and reveals the buttons.
        </div>
        <div className="w-[320px]">
          <TreeList
            data={labelVisibilityData}
            containerWidth={containerWidth}
            selectedNodeIds={withActionsSelection}
            onNodeSelect={(nodes) => handleSelectionChange(nodes, setWithActionsSelection)}
            renderLabel={renderLabel}
            renderActions={renderActions}
            renderIcon={renderIcon}
            allowDrag={false}
            allowDrop={false}
            virtualScroll={false}
          />
        </div>
      </div>
      <div className="border-default-border bg-default-background rounded border p-4 shadow-sm">
        <div className="text-body-small text-secondary-foreground mb-3">
          Without tail actions the label remains visible even while hovering.
        </div>
        <div className="w-[320px]">
          <TreeList
            data={labelVisibilityData}
            containerWidth={containerWidth}
            selectedNodeIds={plainSelection}
            onNodeSelect={(nodes) => handleSelectionChange(nodes, setPlainSelection)}
            renderLabel={renderLabel}
            renderIcon={renderIcon}
            allowDrag={false}
            allowDrop={false}
            virtualScroll={false}
          />
        </div>
      </div>
    </div>
  )
}

/**
 * Simple side-by-side comparison showing label visibility with and without tail actions.
 */
export const LabelVisibility: Story = {
  render: () => <LabelVisibilityDemo />,
}

const LargeDatasetTreeList = () => {
  const [containerWidth, setContainerWidth] = useState(0)
  const [virtualScroll, setVirtualScroll] = useState(true)
  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(() => new Set())

  const handleNodeSelect = useCallback((nodes: TreeNodeType[]) => {
    const ids = nodes.map((node) => node.id)
    setSelectedNodeIds(new Set(ids))
  }, [])

  const handleResetSelection = useCallback(() => {
    setSelectedNodeIds(new Set())
  }, [])

  const handleSelectFolder100 = useCallback(() => {
    setSelectedNodeIds(new Set(["100"]))
  }, [])

  return (
    <Splitter
      defaultSizes={[360, 320]}
      className="absolute! inset-0"
      onChange={(sizes) => {
        setContainerWidth(sizes[0])
      }}
    >
      <Splitter.Pane minSize={320}>
        <TreeList
          className="h-full w-full"
          containerWidth={containerWidth || 360}
          data={performanceTestData}
          selectedNodeIds={selectedNodeIds}
          virtualScroll={virtualScroll}
          allowDrag={false}
          allowDrop={false}
          onNodeSelect={handleNodeSelect}
          renderIcon={(node) =>
            node.children && node.children.length > 0 ? <ToolbarFrame /> : <Element />
          }
        />
      </Splitter.Pane>
      <Splitter.Pane minSize={280}>
        <div className="bg-light-50 flex h-screen min-h-0 w-full flex-1 flex-col">
          <div className="flex flex-col gap-3 p-6">
            <button
              type="button"
              className="border-default-border bg-default-background text-body-small text-default-foreground self-start rounded border px-3 py-2 font-medium shadow-sm hover:bg-gray-100"
              onClick={() => setVirtualScroll((prev) => !prev)}
            >
              {virtualScroll ? "Disable virtual scroll" : "Enable virtual scroll"}
            </button>
            <button
              type="button"
              className="border-default-border bg-default-background text-body-small text-default-foreground self-start rounded border px-3 py-2 font-medium shadow-sm hover:bg-gray-100"
              onClick={handleResetSelection}
            >
              Clear selection
            </button>
            <button
              type="button"
              className="border-default-border bg-default-background text-body-small text-default-foreground self-start rounded border px-3 py-2 font-medium shadow-sm hover:bg-gray-100"
              onClick={handleSelectFolder100}
            >
              Select Folder 100
            </button>
            <div className="border-default-border bg-default-background text-body-small text-secondary-foreground rounded border p-3">
              <div className="text-default-foreground font-medium">Performance metrics</div>
              <div className="mt-2 space-y-2">
                <div>Total root nodes: {performanceTestData.length}</div>
                <div>Total nodes: {performanceTotalNodes}</div>
                <div>Virtual scroll: {virtualScroll ? "enabled" : "disabled"}</div>
                <div>Selected nodes: {selectedNodeIds.size}</div>
              </div>
            </div>
            <div className="text-body-small text-tertiary-foreground mt-2">
              Toggle virtual scrolling to compare rendering behaviour with a 10k node dataset.
            </div>
          </div>
        </div>
      </Splitter.Pane>
    </Splitter>
  )
}

/**
 * Performance benchmark story rendering a large dataset to evaluate virtual scrolling.
 */
export const LargeDataset: Story = {
  render: () => <LargeDatasetTreeList />,
}
