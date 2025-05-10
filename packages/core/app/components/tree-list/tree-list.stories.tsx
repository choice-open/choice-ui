import { Element, ToolbarFrame } from "@choiceform/icons-react"
import { observable } from "@legendapp/state"
import { observer } from "@legendapp/state/react"
import type { Meta, StoryObj } from "@storybook/react"
import React, { useState } from "react"
import { Splitter } from "../splitter"
import { TreeList } from "./tree-list"
import { DropPosition, TreeNodeData, TreeNodeType } from "./types"

// 生成随机ID
const generateId = () => Math.random().toString(36).substring(2, 10)

// 大型测试数据（10000+ 节点）
const generateLargeTestData = (): TreeNodeData[] => {
  const result: TreeNodeData[] = []

  // 创建500个顶级节点
  for (let i = 0; i < 500; i++) {
    const id = generateId()
    const name = `Folder ${i + 1}`

    const children: TreeNodeData[] = []

    // 每个顶级节点有20个子节点
    for (let j = 0; j < 20; j++) {
      const childId = generateId()
      const childName = `${name}/Item ${j + 1}`

      children.push({
        id: childId,
        name: childName,
        children: [],
      })
    }

    result.push({
      id,
      name,
      children,
    })
  }

  return result
}

// 创建测试数据
const largeTestData = generateLargeTestData()

const meta: Meta<typeof TreeList> = {
  title: "Layout/Common/TreeList",
  component: TreeList,
}

export default meta
type Story = StoryObj<typeof TreeList>

// 使用LegendApp状态
const treeState = observable({
  data: largeTestData, // 使用大型数据集以展示虚拟滚动
  selectedNodes: [] as TreeNodeType[],
  expandedNodes: [] as TreeNodeType[],
  useVirtualScroll: true, // 默认启用虚拟滚动
})

// 综合示例组件：包含所有功能
const ComprehensiveTreeList = observer(() => {
  // 处理节点重命名
  const handleNodeRename = (node: TreeNodeType, newName: string) => {
    // 递归更新节点
    const updateNodeName = (nodes: TreeNodeData[]): TreeNodeData[] => {
      return nodes.map((n) => {
        if (n.id === node.id) {
          return {
            ...n,
            name: newName,
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

    treeState.data.set(updateNodeName(treeState.data.get()))
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
        let current: TreeNodeData[] | TreeNodeData | { [key: string]: any } = result

        // 导航到要删除节点的父级
        for (let i = 0; i < path.length - 1; i++) {
          const segment = path[i]
          if (Array.isArray(current)) {
            current = typeof segment === "number" ? current[segment] : current
          } else if (current && typeof current === "object") {
            current =
              segment === "children" && (current as TreeNodeData).children
                ? (current as TreeNodeData).children
                : current[segment as string]
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
          let current: TreeNodeData[] | TreeNodeData | { [key: string]: any } = result

          // 导航到要插入节点的父级
          for (let i = 0; i < path.length - 1; i++) {
            const segment = path[i]
            if (Array.isArray(current)) {
              current = typeof segment === "number" ? current[segment] : current
            } else if (current && typeof current === "object") {
              current =
                segment === "children" && (current as TreeNodeData).children
                  ? (current as TreeNodeData).children
                  : current[segment as string]
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
        const folderNodes = sourceNodes.filter((node) => node.children && node.children.length > 0)

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
      const sourceNodeCopies: { path: (number | string)[]; node: TreeNodeData }[] = []

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

  // 处理节点选择
  const handleNodeSelect = (nodes: TreeNodeType[]) => {
    const ids = nodes.map((node) => node.id)

    setSelectedNodeIds(new Set(ids))
    treeState.selectedNodes.set(nodes)
  }

  // 处理节点展开/折叠
  const handleNodeExpand = (node: TreeNodeType, expanded: boolean) => {
    if (expanded) {
      treeState.expandedNodes.set([...treeState.expandedNodes.get(), node])
    } else {
      treeState.expandedNodes.set(
        treeState.expandedNodes.get().filter((n: TreeNodeType) => n.id !== node.id),
      )
    }
  }

  const [containerWidth, setContainerWidth] = useState(0)
  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(new Set())

  return (
    <Splitter
      defaultSizes={[240, 1024]}
      className="absolute! inset-0"
      onChange={(sizes) => {
        setContainerWidth(sizes[0])
      }}
    >
      <Splitter.Pane minSize={240}>
        <TreeList
          selectedNodeIds={selectedNodeIds}
          className="h-full w-full"
          containerWidth={containerWidth}
          data={treeState.data.get()}
          virtualScroll={treeState.useVirtualScroll.get()}
          onNodeRename={handleNodeRename}
          onNodeDrop={handleNodeDrop}
          onNodeSelect={handleNodeSelect}
          onNodeExpand={handleNodeExpand}
          onNodeContextMenu={(node, event) => {
            event.preventDefault()

            // 这里可以实现自定义上下文菜单
            alert(`节点: ${node.name} 的上下文菜单已触发`)
          }}
          renderIcon={(node) => (
            <>{node.children && node.children.length > 0 ? <ToolbarFrame /> : <Element />}</>
          )}
        />
      </Splitter.Pane>
      <Splitter.Pane minSize={320}>
        <div className="bg-light-50 flex h-screen min-h-0 w-full flex-1 flex-col"></div>
      </Splitter.Pane>
    </Splitter>
  )
})

// 导出单一综合示例
export const Comprehensive: Story = {
  render: () => <ComprehensiveTreeList />,
}
