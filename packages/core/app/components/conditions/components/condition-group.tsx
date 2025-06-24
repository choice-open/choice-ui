import React, { useCallback, useRef, useState } from "react"
import { nanoid } from "nanoid"
import { tcx } from "~/utils"
import { useDragAndDrop } from "../hooks"
import { generateGroupName } from "../utils"
import {
  ComparisonOperator,
  LogicalOperator,
  type Condition,
  type ConditionGroupProps,
  type ConditionGroup as ConditionGroupType,
} from "../types"
import { ConditionItem } from "./condition-item"
import {
  AddConditionDropdown,
  DragGuide,
  GroupActionsDropdown,
  LogicalOperatorChip,
} from "./group-renderers"
import { GripVerticalSmall } from "@choiceform/icons-react"
import { IconButton } from "~/components/icon-button"
import { Input } from "~/components/input"

export function ConditionGroup({
  group,
  fields,
  onUpdate,
  onDelete,
  onDuplicate,
  onAddCondition,
  onAddGroup,
  onUpdateCondition,
  level = 0,
  maxDepth = 2,
  disabled = false,
  className = "",
  // 新增：组与上级的逻辑关系
  groupLogicalOperator = LogicalOperator.And,
  isFirstGroup = false,
  // 拖拽相关回调
  onDragComplete,
  onDragStart,
  onDragEnd,
  onClearOtherGuides,
  onRegisterGuideClear,
  onUnregisterGuideClear,
  // 验证相关的props
  globalDragData,
  isValidDropTarget,
  // 当前组自身的拖拽事件
  onGroupDragStart,
  onGroupDragEnd,
}: ConditionGroupProps & {
  // 新增：验证相关的props
  globalDragData?: {
    item: Condition | ConditionGroupType
    sourceGroupId: string
    sourceIndex: number
    type: "condition" | "group"
  } | null
  groupLogicalOperator?: LogicalOperator
  isFirstGroup?: boolean
  isValidDropTarget?: (
    targetGroupId: string,
    dragInfo: {
      item: Condition | ConditionGroupType
      sourceGroupId: string
      sourceIndex: number
      type: "condition" | "group"
    },
  ) => boolean
  maxDepth?: number
  onClearOtherGuides?: (currentGroupId: string) => void
  onDragComplete?: (
    targetGroupId: string,
    targetIndex?: number,
    dragInfo?: {
      item: Condition | ConditionGroupType
      sourceGroupId: string
      sourceIndex: number
      type: "condition" | "group"
    },
  ) => void
  onDragEnd?: () => void
  onDragStart?: (dragInfo: {
    item: Condition | ConditionGroupType
    sourceGroupId: string
    sourceIndex: number
    type: "condition" | "group"
  }) => void
  onDuplicate?: () => void
  onGroupDragEnd?: (e: React.DragEvent) => void
  // 当前组自身的拖拽事件（用于拖拽手柄）
  onGroupDragStart?: (e: React.DragEvent) => void
  onRegisterGuideClear?: (groupId: string, clearFunction: () => void) => void
  onUnregisterGuideClear?: (groupId: string) => void
}) {
  // 组容器的ref，用于拖拽预览
  const groupRef = useRef<HTMLDivElement>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [groupNameEditing, setGroupNameEditing] = useState(false)

  // 使用拖拽hook
  const { dragGuideIndex, handlers, helpers } = useDragAndDrop({
    groupId: group.id,
    onDragComplete,
    onDragStart,
    onDragEnd,
    onClearOtherGuides,
    onRegisterGuideClear,
    onUnregisterGuideClear,
    globalDragData,
    isValidDropTarget,
  })

  // 简化的拖拽处理：优先使用全局处理器
  const handleSimpleDrop = useCallback(
    (
      dropResult: {
        draggedItem: Condition | ConditionGroupType
        finalTargetIndex?: number
        sourceGroupId: string
        sourceIndex: number
      } | null,
    ) => {
      if (!dropResult) return

      // 优先使用全局处理器
      if (onDragComplete) {
        onDragComplete(group.id, dropResult.finalTargetIndex, {
          item: dropResult.draggedItem,
          sourceGroupId: dropResult.sourceGroupId,
          sourceIndex: dropResult.sourceIndex,
          type: "fieldKey" in dropResult.draggedItem ? "condition" : "group",
        })
      }
    },
    [group.id, onDragComplete],
  )

  // 处理逻辑操作符变更
  const handleLogicalOperatorChange = useCallback(
    (newOperator: LogicalOperator) => {
      onUpdate({
        ...group,
        logicalOperator: newOperator,
      })
    },
    [group, onUpdate],
  )

  // 处理组拖拽开始，设置自定义拖拽预览
  const handleGroupDragStart = useCallback(
    (e: React.DragEvent) => {
      // 调用原始的拖拽开始事件
      onGroupDragStart?.(e)

      // 设置自定义拖拽预览
      if (groupRef.current) {
        // 创建拖拽预览元素
        const dragPreview = groupRef.current.cloneNode(true) as HTMLElement
        dragPreview.style.position = "absolute"
        dragPreview.style.top = "-1000px"
        dragPreview.style.pointerEvents = "none"
        dragPreview.style.opacity = "0.8"
        document.body.appendChild(dragPreview)

        // 设置拖拽预览
        e.dataTransfer.setDragImage(dragPreview, 20, 20)

        // 清理临时元素
        setTimeout(() => {
          document.body.removeChild(dragPreview)
        }, 0)
      }
    },
    [onGroupDragStart],
  )

  // 渲染条件列表（Notion风格，简洁版）
  const renderConditions = () => {
    const result: React.ReactNode[] = []

    group.conditions.forEach((item, index) => {
      const key = "fieldKey" in item ? item.id : item.id

      // 在条件前渲染引导线
      result.push(
        <DragGuide
          key={`guide-${index}`}
          index={index}
          dragGuideIndex={dragGuideIndex}
        />,
      )

      if ("fieldKey" in item) {
        // 渲染条件项（拖拽手柄可拖拽）
        result.push(
          <div
            key={key}
            className="col-start-1 py-1"
            onDragOver={(e) => {
              e.stopPropagation() // 阻止事件冒泡
              handlers.handleDragOverWithGuide(e, index) // 使用带引导线的处理器
            }}
            onDrop={(e) => {
              e.stopPropagation() // 阻止事件冒泡
              const result = handlers.handleDrop(e, index)
              if (result) handleSimpleDrop(result)
            }}
            style={{ transition: "opacity 0.2s" }}
          >
            <ConditionItem
              condition={item}
              fields={fields}
              level={level}
              onUpdate={(updatedCondition) => {
                if (onUpdateCondition) {
                  onUpdateCondition(item.id, updatedCondition)
                } else {
                  const newConditions = [...group.conditions]
                  newConditions[index] = updatedCondition
                  onUpdate({
                    ...group,
                    conditions: newConditions,
                  })
                }
              }}
              onDelete={() => {
                const newConditions = group.conditions.filter((_, i) => i !== index)

                // 如果删除后没有条件了，且这是嵌套组，则删除整个组
                if (newConditions.length === 0 && level > 0 && onDelete) {
                  onDelete()
                  return
                }

                // 否则更新组，确保至少有一个空条件
                onUpdate({
                  ...group,
                  conditions:
                    newConditions.length > 0
                      ? newConditions
                      : [
                          {
                            id: `condition_${nanoid()}`,
                            fieldKey: "",
                            operator: ComparisonOperator.Equals,
                            value: null,
                          },
                        ],
                })
              }}
              onDuplicate={() => {
                const duplicatedCondition = {
                  ...item,
                  id: `condition_${nanoid()}`,
                }
                const newConditions = [...group.conditions]
                newConditions.splice(index + 1, 0, duplicatedCondition)
                onUpdate({
                  ...group,
                  conditions: newConditions,
                })
              }}
              disabled={disabled}
              // 传递拖拽事件给条件项的拖拽手柄
              onDragStart={(e) => {
                e.stopPropagation() // 阻止事件冒泡
                handlers.handleDragStart(e, item, index)
              }}
              onDragEnd={(e) => {
                e.stopPropagation() // 阻止事件冒泡
                handlers.handleDragEnd(e)
              }}
            />
          </div>,
        )
      } else {
        // 渲染子组（拖拽手柄可拖拽）
        result.push(
          <div
            key={key}
            className="col-start-1 py-1"
            onDragOver={(e) => {
              e.stopPropagation() // 阻止事件冒泡
              handlers.handleDragOverWithGuide(e, index) // 保持一致性
            }}
            onDrop={(e) => {
              e.stopPropagation() // 阻止事件冒泡
              const result = handlers.handleDrop(e, index)
              if (result) handleSimpleDrop(result)
            }}
            style={{ transition: "opacity 0.2s" }}
          >
            <ConditionGroup
              group={item}
              fields={fields}
              onUpdate={(updatedGroup) => {
                const newConditions = [...group.conditions]
                newConditions[index] = updatedGroup
                onUpdate({
                  ...group,
                  conditions: newConditions,
                })
              }}
              onDelete={() => {
                const newConditions = group.conditions.filter((_, i) => i !== index)
                onUpdate({
                  ...group,
                  conditions:
                    newConditions.length > 0
                      ? newConditions
                      : [
                          {
                            id: `condition_${nanoid()}`,
                            fieldKey: "",
                            operator: ComparisonOperator.Equals,
                            value: null,
                          },
                        ],
                })
              }}
              onDuplicate={() => {
                // 为复制的组生成新名称
                const newName = item.name
                  ? `${item.name} Copy`
                  : generateGroupName(
                      group.conditions.filter(
                        (c) => "logicalOperator" in c,
                      ) as ConditionGroupType[],
                    )

                const duplicatedGroup = {
                  ...item,
                  id: `group_${nanoid()}`,
                  name: newName,
                }
                const newConditions = [...group.conditions]
                newConditions.splice(index + 1, 0, duplicatedGroup)
                onUpdate({
                  ...group,
                  conditions: newConditions,
                })
              }}
              onAddCondition={onAddCondition}
              onAddGroup={onAddGroup}
              onUpdateCondition={onUpdateCondition}
              level={level + 1}
              maxDepth={maxDepth}
              disabled={disabled}
              groupLogicalOperator={LogicalOperator.And}
              isFirstGroup={false}
              // 传递拖拽回调给子组
              onDragComplete={onDragComplete}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onClearOtherGuides={helpers.handleClearOtherGuides}
              onRegisterGuideClear={onRegisterGuideClear}
              onUnregisterGuideClear={onUnregisterGuideClear}
              // 传递验证相关的props给子组
              globalDragData={globalDragData}
              isValidDropTarget={isValidDropTarget}
              // 传递子组自身的拖拽事件
              onGroupDragStart={(e: React.DragEvent) => {
                e.stopPropagation()
                handlers.handleDragStart(e, item, index)
              }}
              onGroupDragEnd={(e: React.DragEvent) => {
                e.stopPropagation()
                handlers.handleDragEnd(e)
              }}
            />
          </div>,
        )
      }
    })

    // 在最后添加引导线（用于在最后插入）
    result.push(
      <DragGuide
        key={`guide-${group.conditions.length}`}
        index={group.conditions.length}
        dragGuideIndex={dragGuideIndex}
      />,
    )

    return result
  }

  const hasMultipleItems = group.conditions.length > 1

  return (
    <>
      {/* 组的内容 */}
      <div
        ref={groupRef}
        className={tcx(
          "group/condition-group",
          "relative grid items-center gap-x-2",
          // 嵌套组添加背景色和边框
          level > 0
            ? "bg-default-background rounded-lg border border-dashed py-2 pr-2"
            : "condition-group",
          hasMultipleItems ? "pl-12" : "pl-2",
        )}
        onDragOver={(e) => handlers.handleGroupDragOver(e, group.conditions.length)}
        onDragLeave={handlers.handleDragLeave}
        onDrop={(e) => {
          const result = handlers.handleGroupDrop(e)
          if (result) handleSimpleDrop(result)
        }}
      >
        {/* 逻辑操作符覆盖层 - 覆盖在所有条件上方 */}
        {hasMultipleItems && (
          <div
            className="logical-operator pointer-events-none absolute top-0 bottom-8 left-0 flex items-center justify-center"
            data-level={level}
          >
            <div className="pointer-events-auto">
              <LogicalOperatorChip
                operator={group.logicalOperator}
                disabled={disabled}
                onChange={handleLogicalOperatorChange}
              />
            </div>
          </div>
        )}

        {/* 组操作按钮 - 在右上角 */}
        {level > 0 && (
          <div className={tcx("flex items-center gap-0.5", hasMultipleItems ? "-ml-12" : "")}>
            {/* 拖拽手柄 */}
            <IconButton
              className="cursor-move"
              variant="ghost"
              draggable={!disabled}
              onDragStart={handleGroupDragStart}
              onDragEnd={onGroupDragEnd}
            >
              <GripVerticalSmall />
            </IconButton>

            {groupNameEditing ? (
              <Input
                value={group.name || ""}
                onChange={(value) => onUpdate({ ...group, name: value })}
                onBlur={() => setGroupNameEditing(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setGroupNameEditing(false)
                  }
                  if (e.key === "Escape") {
                    setGroupNameEditing(false)
                  }
                }}
                autoFocus
                className="px-1"
              />
            ) : (
              <div
                className="hover:bg-secondary-background flex h-6 items-center truncate rounded-md border border-transparent px-1 font-medium"
                onClick={() => setGroupNameEditing(true)}
                title="Click to edit group name"
              >
                {group.name || "Unnamed Group"}
              </div>
            )}

            <div
              className={tcx(
                "ml-auto",
                isMenuOpen ? "opacity-100" : "opacity-0 group-hover/condition-group:opacity-100",
              )}
            >
              <GroupActionsDropdown
                open={isMenuOpen}
                onOpenChange={setIsMenuOpen}
                disabled={disabled}
                onDuplicate={onDuplicate}
                onDelete={onDelete}
              />
            </div>
          </div>
        )}

        {/* 渲染条件列表 */}
        {renderConditions()}

        {/* 添加操作 Dropdown */}
        <div className="pointer-events-none col-start-1 py-1">
          <AddConditionDropdown
            disabled={disabled}
            onAddCondition={() => onAddCondition(group.id)}
            onAddGroup={() => onAddGroup(group.id)}
            canAddGroup={level < maxDepth}
          />
        </div>
      </div>
    </>
  )
}
