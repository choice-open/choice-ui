import { useCallback, useEffect, useRef, useState } from "react"
import { useEventCallback } from "usehooks-ts"

export type PanelDropPosition = "top" | "bottom" | null

export interface PanelDragState {
  dragItemId: string | null
  dropPosition: PanelDropPosition
  dropTargetId: string | null
  isDragging: boolean
}

interface PanelDragItem {
  element: HTMLElement
  id: string
}

interface UsePanelDragDropProps {
  // 自动滚动相关配置
  autoScroll?: boolean
  nodeHeight?: number
  onDrop?: (dragId: string, dropId: string, position: PanelDropPosition) => void
  scrollContainer?: HTMLElement | null
  scrollEdgeSize?: number // 边缘区域大小
  scrollSpeed?: number // 滚动速度
}

const INDICATOR_CLASS = "drag-drop-indicator pointer-events-none absolute right-0 left-0 z-20"
const INDICATOR_LINE_CLASS = "bg-default-foreground"

// 默认边缘区域大小（像素）
const DEFAULT_SCROLL_EDGE_SIZE = 40
// 默认最大滚动速度（像素/帧）
const DEFAULT_SCROLL_SPEED = 10

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
  line.style.borderRadius = "1px"
  indicator.appendChild(line)

  return indicator
}

export function usePanelDragDrop({
  onDrop,
  autoScroll = true,
  scrollEdgeSize = DEFAULT_SCROLL_EDGE_SIZE,
  scrollSpeed = DEFAULT_SCROLL_SPEED,
}: UsePanelDragDropProps = {}) {
  const dragStateRef = useRef<PanelDragState>({
    isDragging: false,
    dragItemId: null,
    dropTargetId: null,
    dropPosition: null,
  })

  const lastValidRef = useRef<{
    id: string | null
    position: PanelDropPosition
  }>({
    id: null,
    position: null,
  })

  const mousePositionRef = useRef({ x: 0, y: 0 })

  // 存储自动滚动的动画帧请求ID，用于清理
  const autoScrollRAFRef = useRef<number | null>(null)
  // 记录滚动容器
  const scrollContainerRef = useRef<HTMLElement | null>(null)

  const [isDragging, setIsDragging] = useState(false)
  const [dragItemId, setDragItemId] = useState<string | null>(null)

  const containerRef = useRef<HTMLDivElement | null>(null)

  // 清理所有放置指示器
  const clearDropIndicators = useEventCallback(() => {
    // 清理所有指示器元素
    document.querySelectorAll(".drag-drop-indicator").forEach((indicator) => {
      indicator.remove()
    })

    document.querySelectorAll('[data-drop-target="true"]').forEach((element) => {
      const htmlElement = element as HTMLElement
      htmlElement.dataset.dropTarget = "false"
      htmlElement.dataset.dropPosition = ""
    })
  })

  // 查找或创建滚动容器
  const findScrollContainer = useEventCallback(() => {
    if (scrollContainerRef.current) return scrollContainerRef.current

    if (containerRef.current) {
      // 尝试查找第一个可滚动的父元素
      let parent = containerRef.current.parentElement

      while (parent) {
        // 检查元素是否可滚动
        const hasVerticalScroll = parent.scrollHeight > parent.clientHeight
        const style = window.getComputedStyle(parent)
        const isScrollable = style.overflowY === "auto" || style.overflowY === "scroll"

        if (hasVerticalScroll && isScrollable) {
          scrollContainerRef.current = parent
          return parent
        }
        parent = parent.parentElement
      }
    }

    return null
  })

  // 处理自动滚动
  const handleAutoScroll = useEventCallback(() => {
    if (!isDragging || !autoScroll) return

    const scrollContainer = findScrollContainer()
    if (!scrollContainer) return

    const containerRect = scrollContainer.getBoundingClientRect()
    const { y } = mousePositionRef.current

    // 计算鼠标距离顶部和底部边缘的距离
    const distanceToTop = y - containerRect.top
    const distanceToBottom = containerRect.bottom - y

    let scrollAmount = 0

    // 如果鼠标在顶部边缘区域内，向上滚动
    if (distanceToTop < scrollEdgeSize && distanceToTop >= 0) {
      // 计算滚动速度：越接近边缘，速度越快
      const scrollFactor = 1 - distanceToTop / scrollEdgeSize
      scrollAmount = -Math.round(scrollSpeed * scrollFactor)
    }
    // 如果鼠标在底部边缘区域内，向下滚动
    else if (distanceToBottom < scrollEdgeSize && distanceToBottom >= 0) {
      // 计算滚动速度：越接近边缘，速度越快
      const scrollFactor = 1 - distanceToBottom / scrollEdgeSize
      scrollAmount = Math.round(scrollSpeed * scrollFactor)
    }

    // 如果需要滚动
    if (scrollAmount !== 0) {
      scrollContainer.scrollTop += scrollAmount
      // 递归调用，创建动画效果
      autoScrollRAFRef.current = requestAnimationFrame(handleAutoScroll)
    } else {
      // 不需要滚动时，停止递归
      autoScrollRAFRef.current = null
    }
  })

  // 停止自动滚动
  const stopAutoScroll = useEventCallback(() => {
    if (autoScrollRAFRef.current !== null) {
      cancelAnimationFrame(autoScrollRAFRef.current)
      autoScrollRAFRef.current = null
    }
  })

  // 预先声明函数，避免循环依赖
  const endDragRef = useRef<() => void>()

  // 处理鼠标移动逻辑，判断放置目标和位置
  const handleDragOver = useEventCallback(
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
  )

  // 全局鼠标移动处理
  const handleGlobalMouseMove = useEventCallback((e: MouseEvent) => {
    if (!dragStateRef.current.isDragging || !containerRef.current) {
      return
    }

    mousePositionRef.current = { x: e.clientX, y: e.clientY }

    // 处理自动滚动
    if (autoScroll) {
      // 先停止之前的自动滚动请求
      stopAutoScroll()
      // 启动新的自动滚动
      autoScrollRAFRef.current = requestAnimationFrame(handleAutoScroll)
    }

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

    // 停止自动滚动
    stopAutoScroll()

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
  }, [endDrag])

  // 组件卸载时清理资源
  useEffect(() => {
    return () => {
      // 清理事件监听器
      document.removeEventListener("mousemove", handleGlobalMouseMove)
      document.removeEventListener("mouseup", handleGlobalMouseUp)
      // 清理 DOM 指示器
      clearDropIndicators()
      // 清理滚动动画
      stopAutoScroll()
      // 清理滚动容器引用
      scrollContainerRef.current = null
    }
  }, [handleGlobalMouseMove, handleGlobalMouseUp, clearDropIndicators, stopAutoScroll])

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

    // 查找滚动容器
    if (autoScroll) {
      findScrollContainer()
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
