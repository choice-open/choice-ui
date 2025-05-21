import { useCallback, useEffect, useRef, useState } from "react"
import { useEventCallback } from "usehooks-ts"

/**
 * 面板放置位置类型
 * - 'top': 放置在目标项上方
 * - 'bottom': 放置在目标项下方
 * - null: 没有有效放置位置
 */
export type PanelDropPosition = "top" | "bottom" | null

/**
 * 面板拖拽状态接口
 * 用于内部追踪拖拽过程中的状态
 */
export interface PanelDragState {
  /** 正在拖拽的项目ID */
  dragItemId: string | null
  /** 放置位置 */
  dropPosition: PanelDropPosition
  /** 放置目标项目ID */
  dropTargetId: string | null
  /** 是否正在拖拽 */
  isDragging: boolean
}

/**
 * 拖拽项目接口
 * 包含项目ID和对应DOM元素
 */
interface PanelDragItem {
  /** 项目DOM元素 */
  element: HTMLElement
  /** 项目唯一ID */
  id: string
}

/**
 * 拖拽放置钩子属性
 */
interface UsePanelDragDropProps {
  /** 节点高度，用于计算放置区域，默认为40 */
  nodeHeight?: number
  /** 放置回调函数，当项目被放置时触发 */
  onDrop?: (dragId: string, dropId: string, position: PanelDropPosition) => void
}

/**
 * 指示器类名和样式常量
 * 抽取为常量避免字符串重复
 */
const INDICATOR_CLASS = "drag-drop-indicator pointer-events-none absolute right-0 left-0 z-20"
const INDICATOR_LINE_CLASS = "bg-default-foreground"

/**
 * 创建拖拽指示器元素
 * 将DOM创建逻辑抽取为单独函数，提高可维护性
 */
function createDropIndicator(position: PanelDropPosition): HTMLElement {
  const indicator = document.createElement("div")
  indicator.className = INDICATOR_CLASS
  indicator.style.position = "absolute"
  indicator.style.left = "0"
  indicator.style.right = "0"
  indicator.style.zIndex = "20"

  if (position === "top") {
    indicator.style.top = "-1px"
  } else {
    indicator.style.bottom = "-1px"
  }

  const line = document.createElement("div")
  line.className = INDICATOR_LINE_CLASS
  line.style.height = "2px"
  line.style.width = "100%"
  line.style.borderRadius = "9999px"
  indicator.appendChild(line)

  return indicator
}

/**
 * 面板拖拽放置钩子
 * 提供高性能的拖拽排序功能，无需依赖HTML5拖放API
 *
 * @param props 配置项
 * @returns 拖拽控制对象
 */
export function usePanelDragDrop({ nodeHeight = 40, onDrop }: UsePanelDragDropProps = {}) {
  // 使用ref存储拖拽状态，避免状态更新触发重渲染
  const dragStateRef = useRef<PanelDragState>({
    isDragging: false,
    dragItemId: null,
    dropTargetId: null,
    dropPosition: null,
  })

  // 存储最后有效的放置目标，用于最终执行放置操作
  const lastValidRef = useRef<{
    id: string | null
    position: PanelDropPosition
  }>({
    id: null,
    position: null,
  })

  // 存储鼠标位置，用于计算放置位置
  const mousePositionRef = useRef({ x: 0, y: 0 })

  // 只暴露必要的状态给组件，减少不必要的重渲染
  const [isDragging, setIsDragging] = useState(false)
  const [dragItemId, setDragItemId] = useState<string | null>(null)

  // 存储容器引用
  const containerRef = useRef<HTMLDivElement | null>(null)

  // 清理所有放置指示器
  const clearDropIndicators = useEventCallback(() => {
    // 清理所有指示器元素
    document.querySelectorAll(".drag-drop-indicator").forEach((indicator) => {
      indicator.remove()
    })

    // 清理数据属性
    document.querySelectorAll('[data-drop-target="true"]').forEach((element) => {
      const htmlElement = element as HTMLElement
      htmlElement.dataset.dropTarget = "false"
      htmlElement.dataset.dropPosition = ""
    })
  })

  // 预先声明函数，避免循环依赖
  const endDragRef = useRef<() => void>()

  // 处理鼠标移动逻辑，判断放置目标和位置
  const handleDragOver = useCallback(
    (
      currentElement: HTMLElement,
      currentMouseY: number,
    ): { dropPosition: PanelDropPosition; targetElement: HTMLElement | null } => {
      const rect = currentElement.getBoundingClientRect()
      const rowId = currentElement.dataset.rowId

      if (!rowId) return { targetElement: null, dropPosition: null }

      const relY = currentMouseY - rect.top
      const dropPosition = relY < rect.height * 0.5 ? "top" : "bottom"

      return {
        targetElement: currentElement,
        dropPosition,
      }
    },
    [],
  )

  // 全局鼠标移动处理
  const handleGlobalMouseMove = useEventCallback((e: MouseEvent) => {
    if (!dragStateRef.current.isDragging || !containerRef.current) {
      return
    }

    mousePositionRef.current = { x: e.clientX, y: e.clientY }

    // 获取所有有效的行元素
    const allFoundElements = Array.from(
      containerRef.current.querySelectorAll(".panel-sortable-row"),
    ) as HTMLElement[]

    const rowElements = allFoundElements.filter(
      (el) => el.dataset.rowId && el.dataset.rowId.trim() !== "",
    )

    if (rowElements.length === 0) return

    let identifiedTargetElement: HTMLElement | null = null
    let identifiedDropPosition: PanelDropPosition = null

    // 查找鼠标所在的行元素
    for (let i = 0; i < rowElements.length; i++) {
      const rowElement = rowElements[i]
      const rect = rowElement.getBoundingClientRect()
      const rowId = rowElement.dataset.rowId!

      const isCurrentDraggedItem = rowId === dragStateRef.current.dragItemId
      const isTheActualLastItemInDom = i === rowElements.length - 1

      const currentMouseY = mousePositionRef.current.y
      const currentMouseX = mousePositionRef.current.x

      // 使用扩展的检测区域，提高用户体验
      const detectionPadding = rect.height * 0.25
      const isMouseVerticallyOver =
        currentMouseY >= rect.top - detectionPadding &&
        currentMouseY <= rect.bottom + detectionPadding
      const isMouseHorizontallyOver = currentMouseX >= rect.left && currentMouseX <= rect.right

      if (isMouseVerticallyOver && isMouseHorizontallyOver) {
        // 处理特殊情况：拖动到自身
        if (isCurrentDraggedItem) {
          const isFirstItem = i === 0
          const relY = currentMouseY - rect.top

          if (isFirstItem && relY < rect.height * 0.5) {
            identifiedTargetElement = rowElement
            identifiedDropPosition = "top"
            break
          }
          if (isTheActualLastItemInDom && relY >= rect.height * 0.5) {
            identifiedTargetElement = rowElement
            identifiedDropPosition = "bottom"
            break
          }
          continue
        } else {
          // 正常情况：拖动到其他项
          const { targetElement, dropPosition } = handleDragOver(rowElement, currentMouseY)
          identifiedTargetElement = targetElement
          identifiedDropPosition = dropPosition
          break
        }
      }
    }

    const identifiedRowId = identifiedTargetElement ? identifiedTargetElement.dataset.rowId : null

    // 如果找到有效的放置目标和位置，更新指示器
    if (identifiedTargetElement && identifiedRowId && identifiedDropPosition) {
      // 只有当目标或位置发生变化时才更新视觉指示器，避免频繁DOM操作
      if (
        dragStateRef.current.dropTargetId !== identifiedRowId ||
        dragStateRef.current.dropPosition !== identifiedDropPosition
      ) {
        clearDropIndicators()

        // 更新状态
        dragStateRef.current.dropTargetId = identifiedRowId
        dragStateRef.current.dropPosition = identifiedDropPosition
        lastValidRef.current = { id: identifiedRowId, position: identifiedDropPosition }

        // 更新目标元素的数据属性
        identifiedTargetElement.dataset.dropTarget = "true"
        identifiedTargetElement.dataset.dropPosition = identifiedDropPosition

        // 创建并添加指示器
        const indicator = createDropIndicator(identifiedDropPosition)
        identifiedTargetElement.appendChild(indicator)
      }
    } else if (dragStateRef.current.dropTargetId !== null) {
      // 如果没有找到目标但之前有目标，清空目标
      dragStateRef.current.dropTargetId = null
      dragStateRef.current.dropPosition = null
    }
  })

  // 全局鼠标释放处理
  const handleGlobalMouseUp = useEventCallback(() => {
    if (endDragRef.current) {
      endDragRef.current()
    }
  })

  // 结束拖拽
  const endDrag = useEventCallback(() => {
    if (!dragStateRef.current.isDragging) return

    // 清理指示器
    clearDropIndicators()

    // 执行放置操作
    if (
      dragStateRef.current.dragItemId &&
      lastValidRef.current.id &&
      lastValidRef.current.position &&
      onDrop &&
      dragStateRef.current.dragItemId !== lastValidRef.current.id
    ) {
      onDrop(
        dragStateRef.current.dragItemId,
        lastValidRef.current.id,
        lastValidRef.current.position,
      )
    }

    // 重置状态
    dragStateRef.current = {
      isDragging: false,
      dragItemId: null,
      dropTargetId: null,
      dropPosition: null,
    }

    lastValidRef.current = {
      id: null,
      position: null,
    }

    setIsDragging(false)
    setDragItemId(null)

    // 移除全局事件监听器
    document.removeEventListener("mousemove", handleGlobalMouseMove)
    document.removeEventListener("mouseup", handleGlobalMouseUp)
  })

  // 保存endDrag引用
  useEffect(() => {
    endDragRef.current = endDrag

    // 确保组件卸载时清理资源
    return () => {
      if (dragStateRef.current.isDragging) {
        document.removeEventListener("mousemove", handleGlobalMouseMove)
        document.removeEventListener("mouseup", handleGlobalMouseUp)
        clearDropIndicators()
      }
    }
  }, [endDrag, handleGlobalMouseMove, handleGlobalMouseUp, clearDropIndicators])

  // 处理拖拽开始
  const handleDragStart = useEventCallback((item: PanelDragItem, e: React.MouseEvent) => {
    // 阻止默认拖拽行为
    e.preventDefault()
    e.stopPropagation()

    // 清理之前可能存在的状态
    clearDropIndicators()

    // 存储初始鼠标位置
    mousePositionRef.current = { x: e.clientX, y: e.clientY }

    // 重置最后有效目标
    lastValidRef.current = {
      id: null,
      position: null,
    }

    // 更新拖拽状态
    dragStateRef.current = {
      isDragging: true,
      dragItemId: item.id,
      dropTargetId: null,
      dropPosition: null,
    }

    // 更新组件状态
    setIsDragging(true)
    setDragItemId(item.id)

    // 添加全局事件监听器
    document.addEventListener("mousemove", handleGlobalMouseMove)
    document.addEventListener("mouseup", handleGlobalMouseUp)
  })

  // 对外暴露的API
  return {
    containerRef,
    isDragging,
    isItemBeingDragged: useCallback(
      (id: string) => isDragging && dragItemId === id,
      [isDragging, dragItemId],
    ),
    isDropTarget: useCallback((id: string) => dragStateRef.current.dropTargetId === id, []),
    getDropPosition: useCallback(
      (id: string) =>
        dragStateRef.current.dropTargetId === id ? dragStateRef.current.dropPosition : null,
      [],
    ),
    handleDragStart,
  }
}
