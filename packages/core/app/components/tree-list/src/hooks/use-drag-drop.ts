import { useCallback, useEffect, useRef, useState } from "react"
import { DragState, DropPosition, TreeNodeType } from "../types"

export interface UseDragDropProps {
  allowDrag: boolean
  allowDrop: boolean
  nodeHeight: number
  onNodeDrop?: (nodes: TreeNodeType[], targetNode: TreeNodeType, position: DropPosition) => void
}

export function useDragDrop({ allowDrag, allowDrop, nodeHeight, onNodeDrop }: UseDragDropProps) {
  // 拖拽状态
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragNodes: [],
    dropTargetNode: null,
    dropPosition: null,
  })

  // 自动滚动状态
  const [autoScrolling, setAutoScrolling] = useState<{
    active: boolean
    direction: "up" | "down" | null
  }>({
    active: false,
    direction: null,
  })

  // Refs
  const listRef = useRef<HTMLDivElement>(null)
  // 用于存储拖拽过程中的展开延时计时器
  const dragExpandTimeouts = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  // 跟踪最后悬停的节点ID和时间
  const lastHoveredNode = useRef<{ id: string; timestamp: number } | null>(null)
  // 跟踪是否处于自动滚动状态
  const isAutoScrolling = useRef(false)
  // 存储自动滚动interval ID
  const autoScrollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  // 存储全局拖拽事件处理函数的引用
  const handleGlobalDragOverRef = useRef<(event: DragEvent) => void>()
  // Ref for transparent drag image
  const dragImageRef = useRef<HTMLImageElement | null>(null)

  // 检查目标节点是否是源节点的子孙节点（递归检查父节点关系）
  const isTargetDescendantOfSource = useCallback(
    (targetNode: TreeNodeType, sourceNode: TreeNodeType): boolean => {
      // 如果目标节点是源节点本身，直接返回false（不是子孙关系）
      if (targetNode.id === sourceNode.id) {
        return false
      }

      // 如果目标节点是源节点的直接子节点，返回true
      if (targetNode.parentId === sourceNode.id) {
        return true
      }

      // 如果目标节点没有父节点，它不是任何节点的子节点
      if (!targetNode.parentId) {
        return false
      }

      // 递归检查目标节点的父节点是否是源节点的子节点
      // 这里我们已经知道targetNode.parentId不等于sourceNode.id，所以需要继续向上查找
      const parentNode = dragState.dragNodes.find((n) => n.id === targetNode.parentId)
      if (!parentNode) {
        return false // 找不到父节点，中断递归
      }

      // 递归检查父节点
      return isTargetDescendantOfSource(parentNode, sourceNode)
    },
    [dragState.dragNodes],
  )

  // 创建一个透明的拖拽图像
  const TRANSPARENT_IMAGE = new Image()
  TRANSPARENT_IMAGE.src =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"

  // 在组件挂载时创建拖拽图像
  useEffect(() => {
    dragImageRef.current = TRANSPARENT_IMAGE
    document.body.appendChild(dragImageRef.current)

    // 清理函数
    return () => {
      if (dragImageRef.current && dragImageRef.current.parentNode) {
        dragImageRef.current.parentNode.removeChild(dragImageRef.current)
        dragImageRef.current = null
      }
    }
  }, [])

  // 清理所有拖拽相关的计时器
  const clearDragExpandTimeouts = useCallback(() => {
    Object.values(dragExpandTimeouts.current).forEach((timeout) => clearTimeout(timeout))
    dragExpandTimeouts.current = {}
  }, [])

  // 全局拖拽事件处理，用于处理容器的自动滚动
  const handleGlobalDragOver = useCallback(
    (event: DragEvent) => {
      if (!dragState.isDragging) return

      const scrollContainer = listRef.current
      if (!scrollContainer) return

      const containerRect = scrollContainer.getBoundingClientRect()
      const mouseY = event.clientY

      // 使用节点高度作为固定的触发值
      const scrollTriggerSize = nodeHeight

      // 判断是否需要滚动以及滚动方向
      if (mouseY < containerRect.top + scrollTriggerSize) {
        // 设置向上滚动
        if (!autoScrolling.active || autoScrolling.direction !== "up") {
          setAutoScrolling({ active: true, direction: "up" })
        }
      } else if (mouseY > containerRect.bottom - scrollTriggerSize) {
        // 设置向下滚动
        if (!autoScrolling.active || autoScrolling.direction !== "down") {
          setAutoScrolling({ active: true, direction: "down" })
        }
      } else {
        // 不需要滚动
        if (autoScrolling.active) {
          setAutoScrolling({ active: false, direction: null })
        }
      }
    },
    [dragState.isDragging, autoScrolling, nodeHeight],
  )

  // 更新全局拖拽事件处理函数的引用
  useEffect(() => {
    handleGlobalDragOverRef.current = handleGlobalDragOver
  }, [handleGlobalDragOver])

  // 在拖拽结束时清理所有计时器
  useEffect(() => {
    if (!dragState.isDragging) {
      clearDragExpandTimeouts()
    }
  }, [dragState.isDragging, clearDragExpandTimeouts])

  // 处理拖拽开始
  const startDrag = useCallback(
    (nodes: TreeNodeType[], event: React.DragEvent) => {
      if (!allowDrag) return

      // 检查是否有不可编辑的节点，如果有则阻止拖拽
      const hasNonEditableNode = nodes.some((n) => n.isEditable === false)
      if (hasNonEditableNode) {
        event.preventDefault()
        return
      }

      // 设置拖拽数据，用于跨组件拖拽识别
      event.dataTransfer.setData("application/json", JSON.stringify(nodes.map((n) => n.id)))

      // 使用透明图像作为拖拽预览，替代默认的浏览器预览
      if (dragImageRef.current) {
        event.dataTransfer.setDragImage(dragImageRef.current, 0, 0)
        // 只有当元素确实在文档中时才尝试移除
        if (dragImageRef.current.parentNode) {
          requestAnimationFrame(() => {
            if (dragImageRef.current?.parentNode) {
              dragImageRef.current.parentNode.removeChild(dragImageRef.current)
            }
          })
        }
      }

      // 添加拖拽状态类以提高视觉反馈
      event.currentTarget.classList.add("dragging")

      // 设置拖拽状态
      setDragState({
        isDragging: true,
        dragNodes: nodes,
        dropTargetNode: null,
        dropPosition: null,
      })

      // 设置拖拽效果
      event.dataTransfer.effectAllowed = "move"

      // 添加事件监听器来跟踪鼠标位置
      document.addEventListener("dragover", handleGlobalDragOverRef.current!)
    },
    [allowDrag],
  )

  // 计算放置位置
  const calculateDropPosition = useCallback(
    (e: React.DragEvent<Element>, target: HTMLElement, node: TreeNodeType) => {
      const rect = target.getBoundingClientRect()
      const relY = e.clientY - rect.top
      const height = rect.height

      // 严格判断是否是文件夹（允许没有子项但标记为文件夹）
      const isFolderWithChildren =
        Boolean(node.children && Array.isArray(node.children) && node.children.length > 0) ||
        Boolean(node.isFolder)

      // 判断文件夹是否已展开
      const isFolderExpanded = isFolderWithChildren && node.state.isExpanded

      // 放置位置逻辑
      if (isFolderExpanded) {
        // 对于已展开的文件夹：
        // - 上部区域允许before放置
        // - 中部和下部区域只允许inside放置，避免在文件夹内容之间插入同级项目
        if (relY < height * 0.25) {
          return "before" // 在文件夹上方放置仍然允许
        } else {
          return "inside" // 中部和下部区域强制为inside
        }
      } else if (isFolderWithChildren) {
        // 未展开的文件夹根据鼠标位置决定放置位置
        if (relY < height * 0.25) {
          return "before"
        } else if (relY > height * 0.75) {
          return "after"
        } else {
          return "inside"
        }
      } else {
        // 普通项目只能放在前面或后面
        if (relY < height * 0.5) {
          return "before"
        } else {
          return "after"
        }
      }
    },
    [],
  )

  // 处理拖拽进入节点
  const handleDragOver = useCallback(
    (node: TreeNodeType, event: React.DragEvent) => {
      if (!allowDrop) return

      event.preventDefault()
      const targetElement = event.currentTarget as HTMLElement

      // 提前检查是否试图将文件夹拖拽到其子孙节点中
      // 只要有一个拖拽节点是文件夹且目标节点是其子孙，就完全阻止显示拖拽提示
      const hasInvalidDrag = dragState.dragNodes.some((dragNode) => {
        const dragNodeIsFolder =
          Boolean(
            dragNode.children && Array.isArray(dragNode.children) && dragNode.children.length > 0,
          ) || Boolean(dragNode.isFolder)

        if (dragNodeIsFolder) {
          return isTargetDescendantOfSource(node, dragNode)
        }

        return false
      })

      // 如果检测到无效的拖拽操作，完全阻止显示任何拖拽提示
      if (hasInvalidDrag) {
        // 阻止显示拖拽提示和任何后续处理
        return
      }

      // 判断放置位置
      const dropPosition = calculateDropPosition(event, targetElement, node)

      // 如果目标节点不可编辑，且位置是 "before"，阻止显示拖拽提示
      if (node.isEditable === false && dropPosition === "before") {
        return
      }

      // 如果是拖拽到inside，并且是未展开的文件夹，添加自动展开逻辑
      if (dropPosition === "inside") {
        const isFolderWithChildren =
          Boolean(node.children && Array.isArray(node.children) && node.children.length > 0) ||
          Boolean(node.isFolder)

        if (isFolderWithChildren && !node.state.isExpanded) {
          const currentTime = Date.now()

          // 检查是否是同一个节点的持续悬停
          if (lastHoveredNode.current?.id === node.id) {
            // 如果已经悬停超过500ms，且还没有展开计时器，则创建一个
            if (
              currentTime - lastHoveredNode.current.timestamp > 500 &&
              !dragExpandTimeouts.current[node.id]
            ) {
              // 设置一个计时器在700ms后自动展开文件夹
              dragExpandTimeouts.current[node.id] = setTimeout(() => {
                // 更新dragState以便状态更新能被感知
                setDragState((prev) => {
                  // 如果当前悬停的节点仍然是这个节点，才执行展开
                  if (prev.dropTargetNode?.id === node.id) {
                    // 创建一个展开事件来模拟展开动作
                    const expandEvent = new CustomEvent("folder-expand", {
                      detail: { nodeId: node.id },
                    })
                    // 触发事件，让外部监听器可以捕获到
                    document.dispatchEvent(expandEvent)
                    // 移除展开计时器的引用
                    delete dragExpandTimeouts.current[node.id]
                  }
                  return prev
                })
              }, 700)
            }
          } else {
            // 更新最后悬停的节点信息
            lastHoveredNode.current = {
              id: node.id,
              timestamp: currentTime,
            }
          }
        }
      }

      // 如果拖拽的是选中的节点本身，不允许
      const isDraggingSelf = dragState.dragNodes.some((n) => n.id === node.id)
      if (isDraggingSelf) {
        return
      }

      // 更新放置状态
      setDragState((prev) => ({
        ...prev,
        dropTargetNode: node,
        dropPosition,
      }))
    },
    [allowDrop, dragState.dragNodes, calculateDropPosition, isTargetDescendantOfSource],
  )

  // 处理拖拽放置
  const handleDrop = useCallback(
    (targetNode: TreeNodeType, position: DropPosition) => {
      if (!allowDrop || !dragState.isDragging || !dragState.dragNodes.length) return

      // 清理所有展开计时器
      clearDragExpandTimeouts()

      // 如果目标节点不可编辑，且位置是 "before"，阻止放置
      if (targetNode.isEditable === false && position === "before") {
        return
      }

      // 检查是否试图将文件夹拖拽到其子孙节点中（再次验证）
      if (position === "inside") {
        // 对每个拖拽节点进行检查
        for (const dragNode of dragState.dragNodes) {
          const dragNodeIsFolder =
            Boolean(dragNode.children && dragNode.children.length > 0) || Boolean(dragNode.isFolder)
          if (dragNodeIsFolder && isTargetDescendantOfSource(targetNode, dragNode)) {
            return
          }
        }
      }

      // 应用更新到数据结构
      try {
        // 调用外部处理方法
        onNodeDrop?.(dragState.dragNodes, targetNode, position)
      } catch (err) {
        console.error("Error during drag & drop:", err)
      }

      // 重置拖拽状态
      setDragState({
        isDragging: false,
        dragNodes: [],
        dropTargetNode: null,
        dropPosition: null,
      })
    },
    [
      allowDrop,
      dragState.dragNodes,
      dragState.isDragging,
      onNodeDrop,
      clearDragExpandTimeouts,
      isTargetDescendantOfSource,
    ],
  )

  // 处理拖拽结束
  const handleDragEnd = useCallback(() => {
    // 清理所有展开计时器
    clearDragExpandTimeouts()

    // 重置跟踪变量
    lastHoveredNode.current = null
    isAutoScrolling.current = false

    // 停止自动滚动
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current)
      autoScrollIntervalRef.current = null
    }
    setAutoScrolling({ active: false, direction: null })

    // 移除全局事件监听器
    document.removeEventListener("dragover", handleGlobalDragOverRef.current!)

    // 重置拖拽状态
    setDragState({
      isDragging: false,
      dragNodes: [],
      dropTargetNode: null,
      dropPosition: null,
    })
  }, [clearDragExpandTimeouts])

  // 自动滚动效果
  useEffect(() => {
    if (autoScrolling.active && autoScrolling.direction) {
      // 如果已有计时器，先清除
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current)
      }

      // 创建新的滚动计时器
      autoScrollIntervalRef.current = setInterval(() => {
        const scrollContainer = listRef.current
        if (scrollContainer) {
          const scrollAmount = autoScrolling.direction === "up" ? -1 : 1
          scrollContainer.scrollBy({
            top: scrollAmount,
            behavior: "auto",
          })
        }
      }, 16) // 约60fps的滚动

      // 清理函数
      return () => {
        if (autoScrollIntervalRef.current) {
          clearInterval(autoScrollIntervalRef.current)
          autoScrollIntervalRef.current = null
        }
      }
    }
  }, [autoScrolling])

  // 在组件卸载时清理
  useEffect(() => {
    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current)
      }
      document.removeEventListener("dragover", handleGlobalDragOverRef.current!)
    }
  }, [])

  return {
    dragState,
    listRef,
    startDrag,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  }
}
