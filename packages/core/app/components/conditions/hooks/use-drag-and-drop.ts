import React, { useCallback, useState } from "react"
import type { Condition, ConditionGroup as ConditionGroupType } from "../types"

interface DragInfo {
  item: Condition | ConditionGroupType
  sourceGroupId: string
  sourceIndex: number
  type: "condition" | "group"
}

interface UseDragAndDropProps {
  // 新增：当前全局拖拽数据和验证函数
  globalDragData?: {
    item: Condition | ConditionGroupType
    sourceGroupId: string
    sourceIndex: number
    type: "condition" | "group"
  } | null
  groupId: string
  isValidDropTarget?: (targetGroupId: string, dragData: DragInfo) => boolean
  onClearOtherGuides?: (currentGroupId: string) => void
  onDragComplete?: (targetGroupId: string, targetIndex?: number, dragInfo?: DragInfo) => void
  onDragEnd?: () => void
  onDragStart?: (dragInfo: DragInfo) => void
  onRegisterGuideClear?: (groupId: string, clearFunction: () => void) => void
  onUnregisterGuideClear?: (groupId: string) => void
}

export function useDragAndDrop({
  groupId,
  onDragComplete,
  onDragStart,
  onDragEnd,
  onClearOtherGuides,
  onRegisterGuideClear,
  onUnregisterGuideClear,
  globalDragData,
  isValidDropTarget,
}: UseDragAndDropProps) {
  // 拖拽引导线状态
  const [dragGuideIndex, setDragGuideIndex] = useState<number | null>(null)
  // 防抖定时器
  const timeoutRef = React.useRef<number | null>(null)

  // 处理清除其他组引导线的请求
  const handleClearOtherGuides = useCallback(
    (currentGroupId: string) => {
      // 如果不是当前组，清除本组的引导线
      if (currentGroupId !== groupId) {
        setDragGuideIndex(null)
      }

      // 向上传递请求，清除父级和兄弟组的引导线
      if (onClearOtherGuides) {
        onClearOtherGuides(currentGroupId)
      }
    },
    [groupId, onClearOtherGuides],
  )

  // 安全更新引导线位置的函数
  const updateDragGuide = useCallback(
    (newIndex: number | null) => {
      // 清除之前的防抖定时器
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      // 如果是清除引导线，立即执行
      if (newIndex === null) {
        setDragGuideIndex(null)
        return
      }

      // 检查是否有有效的拖拽数据和验证函数
      if (globalDragData && isValidDropTarget) {
        const dragInfo: DragInfo = {
          item: globalDragData.item,
          sourceGroupId: globalDragData.sourceGroupId,
          sourceIndex: globalDragData.sourceIndex,
          type: globalDragData.type,
        }

        // 如果目标位置无效，不显示引导线
        if (!isValidDropTarget(groupId, dragInfo)) {
          return
        }
      }

      // 如果是设置新的引导线位置，先清除其他组的引导线
      if (onClearOtherGuides) {
        onClearOtherGuides(groupId)
      }

      // 使用短暂延迟防抖，避免引导线频繁切换
      timeoutRef.current = window.setTimeout(() => {
        if (dragGuideIndex !== newIndex) {
          setDragGuideIndex(newIndex)
        }
        timeoutRef.current = null
      }, 10) // 10ms 延迟
    },
    [dragGuideIndex, groupId, onClearOtherGuides, globalDragData, isValidDropTarget],
  )

  // 处理拖拽开始
  const handleDragStart = useCallback(
    (e: React.DragEvent, item: Condition | ConditionGroupType, index: number) => {
      const type = ("fieldKey" in item ? "condition" : "group") as "condition" | "group"
      const dragData = {
        type,
        item,
        index,
        sourceGroupId: groupId,
      }
      e.dataTransfer.setData("application/json", JSON.stringify(dragData))
      e.dataTransfer.effectAllowed = "move"

      // 通知父组件拖拽开始
      if (onDragStart) {
        onDragStart({
          type,
          item,
          sourceGroupId: groupId,
          sourceIndex: index,
        })
      }

      // 添加拖拽样式
      const target = e.currentTarget as HTMLElement
      target.style.opacity = "0.5"
    },
    [groupId, onDragStart],
  )

  // 处理拖拽结束
  const handleDragEnd = useCallback(
    (e: React.DragEvent) => {
      const target = e.currentTarget as HTMLElement
      target.style.opacity = "1"
      updateDragGuide(null) // 清除本地引导线

      // 调用全局拖拽结束处理
      if (onDragEnd) {
        onDragEnd()
      }
    },
    [updateDragGuide, onDragEnd],
  )

  // 计算拖拽插入位置并显示引导线
  const handleDragOverWithGuide = useCallback(
    (e: React.DragEvent, targetIndex: number) => {
      e.preventDefault()
      e.stopPropagation()
      e.dataTransfer.dropEffect = "move"

      // 计算鼠标相对于容器的位置
      const rect = e.currentTarget.getBoundingClientRect()
      const mouseY = e.clientY - rect.top
      const containerHeight = rect.height

      // 更精确的位置判断：
      // - 上方30%区域：插入到前面
      // - 中间40%区域：不显示引导线（避免误触发）
      // - 下方30%区域：插入到后面
      let guideIndex: number | null = null

      if (mouseY < containerHeight * 0.3) {
        guideIndex = targetIndex // 插入到前面
      } else if (mouseY > containerHeight * 0.7) {
        guideIndex = targetIndex + 1 // 插入到后面
      }
      // 中间区域不显示引导线

      // 更新引导线位置
      updateDragGuide(guideIndex)
    },
    [updateDragGuide],
  )

  // 处理组级别的拖拽悬停
  const handleGroupDragOver = useCallback(
    (e: React.DragEvent, conditionsLength: number) => {
      // 只有当拖拽到组的空白区域时才处理（避免与条件项冲突）
      const target = e.target as HTMLElement
      const isOverConditionOrGroup = target.closest(".col-start-1") !== null

      if (!isOverConditionOrGroup) {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"

        // 如果拖拽到组的空白区域，显示在最后的引导线
        const rect = e.currentTarget.getBoundingClientRect()
        const mouseY = e.clientY - rect.top
        const containerHeight = rect.height

        // 大幅减小阈值，只有在容器最底部很小的区域才显示引导线
        if (mouseY > containerHeight * 0.9) {
          updateDragGuide(conditionsLength)
        }
      }
    },
    [updateDragGuide],
  )

  // 处理拖拽离开
  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      // 当拖拽离开组时清除引导线
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        updateDragGuide(null)
      }
    },
    [updateDragGuide],
  )

  // 处理放置
  const handleDrop = useCallback(
    (e: React.DragEvent, targetIndex?: number) => {
      e.preventDefault()
      e.stopPropagation()

      // 清除引导线
      updateDragGuide(null)

      try {
        const dragDataStr = e.dataTransfer.getData("application/json")
        if (!dragDataStr) {
          return null
        }

        const dragData = JSON.parse(dragDataStr)
        const { item: draggedItem, index: sourceIndex, sourceGroupId, type } = dragData

        // 检测无效拖拽：拖拽组到自己身上
        if (type === "group" && draggedItem.id === groupId) {
          return null
        }

        // 使用引导线位置或传入的目标索引
        const finalTargetIndex = dragGuideIndex !== null ? dragGuideIndex : targetIndex

        // 使用父组件的拖拽完成回调
        if (onDragComplete) {
          onDragComplete(groupId, finalTargetIndex, {
            type,
            item: draggedItem,
            sourceGroupId,
            sourceIndex,
          })
          return null // 全局处理，不返回本地结果
        }
        return {
          sourceGroupId: sourceGroupId as string,
          sourceIndex: sourceIndex as number,
          finalTargetIndex,
          draggedItem: draggedItem as Condition | ConditionGroupType,
        }
      } catch (error) {
        return null
      }
    },
    [dragGuideIndex, groupId, onDragComplete, updateDragGuide],
  )

  // 处理组级别的放置
  const handleGroupDrop = useCallback(
    (e: React.DragEvent) => {
      // 只有当没有更具体的处理器时才处理
      const target = e.target as HTMLElement
      const hasSpecificHandler = target.closest(".col-start-1") !== null

      if (!hasSpecificHandler) {
        return handleDrop(e)
      }
      return null
    },
    [handleDrop],
  )

  // 引导线清除函数
  const clearLocalGuide = useCallback(() => {
    setDragGuideIndex(null)
  }, [])

  // 注册和清理定时器
  React.useEffect(() => {
    // 注册引导线清除函数
    if (onRegisterGuideClear) {
      onRegisterGuideClear(groupId, clearLocalGuide)
    }

    return () => {
      // 清理定时器
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // 注销引导线清除函数
      if (onUnregisterGuideClear) {
        onUnregisterGuideClear(groupId)
      }
    }
  }, [groupId, onRegisterGuideClear, onUnregisterGuideClear, clearLocalGuide])

  return {
    dragGuideIndex,
    handlers: {
      handleDragStart,
      handleDragEnd,
      handleDragOverWithGuide,
      handleGroupDragOver,
      handleDragLeave,
      handleDrop,
      handleGroupDrop,
    },
    helpers: {
      handleClearOtherGuides,
      updateDragGuide,
    },
  }
}
