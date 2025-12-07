import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { nanoid } from "nanoid"
import { ConditionGroup } from "./components/condition-group"
import {
  ComparisonOperator,
  LogicalOperator,
  type Condition,
  type ConditionGroup as ConditionGroupType,
  type ConditionsProps,
  type ConditionsRoot,
} from "./types"
import { DEFAULT_LOCALIZATION, DEFAULT_MAX_DEPTH, generateGroupName } from "./utils"

export function Conditions({
  value,
  fields,
  onChange,
  maxDepth = DEFAULT_MAX_DEPTH,
  disabled = false,
  className = "",
  renderers,
  localization = DEFAULT_LOCALIZATION,
}: ConditionsProps) {
  const [conditions, setConditions] = useState<ConditionsRoot>(
    value || {
      id: "root",
      groups: [
        {
          id: `group_${nanoid()}`,
          logicalOperator: LogicalOperator.And,
          name: "Group 1",
          conditions: [
            {
              id: `condition_${nanoid()}`,
              fieldKey: "",
              operator: ComparisonOperator.Equals,
              value: null,
            },
          ],
        },
      ],
    },
  )

  // 全局拖拽状态管理
  const [globalDragData, setGlobalDragData] = useState<{
    item: Condition | ConditionGroupType
    sourceGroupId: string
    sourceIndex: number
    type: "condition" | "group"
  } | null>(null)

  // 全局引导线清除函数注册表
  const guideClearFunctionsRef = useRef<Map<string, () => void>>(new Map())

  // 处理全局拖拽开始和结束 - 合并简单函数
  const handleGlobalDragStart = useCallback(
    (dragInfo: {
      item: Condition | ConditionGroupType
      sourceGroupId: string
      sourceIndex: number
      type: "condition" | "group"
    }) => setGlobalDragData(dragInfo),
    [],
  )

  const handleGlobalDragEnd = useCallback(() => setGlobalDragData(null), [])

  // 引导线管理函数 - 简化单行函数
  const registerGuideClearFunction = useCallback(
    (groupId: string, clearFunction: () => void) =>
      guideClearFunctionsRef.current.set(groupId, clearFunction),
    [],
  )

  const unregisterGuideClearFunction = useCallback(
    (groupId: string) => guideClearFunctionsRef.current.delete(groupId),
    [],
  )

  // 处理清除其他组的引导线
  const handleClearOtherGuides = useCallback((currentGroupId: string) => {
    // 清除所有其他组的引导线
    guideClearFunctionsRef.current.forEach((clearFunction, groupId) => {
      if (groupId !== currentGroupId) {
        clearFunction()
      }
    })
  }, [])

  // 当内部状态变化时通知父组件
  useEffect(() => {
    onChange?.(conditions)
  }, [conditions, onChange])

  // 处理条件更新
  const handleConditionUpdate = useCallback((conditionId: string, updates: Partial<Condition>) => {
    setConditions((prev) => {
      // 深度克隆整个状态树，确保不可变更新
      const newConditions = JSON.parse(JSON.stringify(prev)) as ConditionsRoot
      const condition = findConditionById(newConditions, conditionId)
      if (condition) {
        // 使用不可变更新替代Object.assign
        Object.assign(condition, updates)
      }
      return newConditions
    })
  }, [])

  // 处理添加条件
  const handleAddCondition = useCallback((parentGroupId?: string, fieldKey?: string) => {
    setConditions((prev) => {
      // 深度克隆整个状态树，确保不可变更新
      const newConditions = JSON.parse(JSON.stringify(prev)) as ConditionsRoot
      const targetGroup = parentGroupId
        ? findGroupById(newConditions, parentGroupId)
        : newConditions.groups[0]

      if (targetGroup) {
        const newCondition: Condition = {
          id: `condition_${nanoid()}`,
          fieldKey: fieldKey || "",
          operator: ComparisonOperator.Equals,
          value: null,
        }
        targetGroup.conditions.push(newCondition)
      }

      return newConditions
    })
  }, [])

  // 处理添加条件组
  const handleAddGroup = useCallback((parentGroupId?: string) => {
    setConditions((prev) => {
      // 深度克隆整个状态树，确保不可变更新
      const newConditions = JSON.parse(JSON.stringify(prev)) as ConditionsRoot

      // 生成默认组名
      const defaultName = generateGroupName(newConditions.groups)

      const newGroup: ConditionGroupType = {
        id: `group_${nanoid()}`,
        logicalOperator: LogicalOperator.And,
        name: defaultName,
        conditions: [
          {
            id: `condition_${nanoid()}`,
            fieldKey: "",
            operator: ComparisonOperator.Equals,
            value: null,
          },
        ],
      }

      if (parentGroupId) {
        // 添加到指定的父组
        const parentGroup = findGroupById(newConditions, parentGroupId)
        if (parentGroup) {
          parentGroup.conditions.push(newGroup)
        }
      } else {
        // 添加到根级别
        newConditions.groups.push(newGroup)
      }

      return newConditions
    })
  }, [])

  // 处理条件组更新
  const handleGroupUpdate = useCallback((groupId: string, updatedGroup: ConditionGroupType) => {
    setConditions((prev) => {
      // 深度克隆整个状态树，确保不可变更新
      const newConditions = JSON.parse(JSON.stringify(prev)) as ConditionsRoot

      // 查找并更新对应的组
      const group = findGroupById(newConditions, groupId)
      if (group) {
        // 使用不可变更新替代Object.assign
        Object.assign(group, updatedGroup)
      }

      return newConditions
    })
  }, [])

  // 处理条件组删除
  const handleGroupDelete = useCallback((groupId: string) => {
    setConditions((prev) => {
      // 深度克隆整个状态树，确保不可变更新
      const newConditions = JSON.parse(JSON.stringify(prev)) as ConditionsRoot
      removeGroupById(newConditions, groupId)
      return newConditions
    })
  }, [])

  // 验证拖拽目标是否有效
  const isValidDropTarget = useCallback(
    (
      targetGroupId: string,
      dragInfo: {
        item: Condition | ConditionGroupType
        sourceGroupId: string
        sourceIndex: number
        type: "condition" | "group"
      },
    ) => {
      // 如果是组拖拽，检查是否拖拽到自己或子组件中
      if (dragInfo.type === "group") {
        // 检查循环引用
        if (isDescendantGroup(dragInfo.item.id, targetGroupId, conditions)) {
          return false
        }

        // 检查深度限制
        const targetGroup = findGroupById(conditions, targetGroupId)
        if (!targetGroup) return false

        // 计算目标组的当前深度
        const targetDepth = calculateGroupDepth(conditions, targetGroupId)

        // 计算被拖拽组的内部最大深度
        const draggedGroupMaxDepth = calculateGroupInternalDepth(
          dragInfo.item as ConditionGroupType,
        )

        // 新深度 = 目标深度 + 1（作为子组） + 被拖拽组的内部深度
        const newMaxDepth = targetDepth + 1 + draggedGroupMaxDepth

        // 检查是否超过最大深度限制
        return newMaxDepth <= maxDepth
      }

      // 条件拖拽总是有效的
      return true
    },
    [conditions, maxDepth],
  )

  // 简单的验证（可以后续扩展）
  const validationResult = useMemo(
    () => ({
      isValid: true,
      errors: [] as Array<{ message: string }>,
    }),
    [],
  )

  // 渲染条件组
  const renderConditionGroups = () => {
    if (conditions.groups.length === 0) {
      return (
        <div className="py-8 text-center text-gray-500">
          <p>No conditions defined</p>
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-2">
        {conditions.groups.map((group, index) => {
          const CustomGroupComponent = renderers?.group || ConditionGroup

          return (
            <div
              key={group.id}
              className="flex flex-col gap-2"
            >
              {/* 在多个组之间显示 OR 连接符 */}
              {index > 0 && (
                <div className="flex justify-center py-2">
                  <span className="bg-secondary-background text-secondary-foreground font-strong rounded-full px-2 py-1">
                    OR
                  </span>
                </div>
              )}

              <CustomGroupComponent
                group={group}
                fields={fields}
                onUpdate={(updatedGroup) => {
                  handleGroupUpdate(group.id, updatedGroup)
                }}
                onDelete={() => {
                  if (conditions.groups.length > 1) {
                    handleGroupDelete(group.id)
                  }
                }}
                onAddCondition={handleAddCondition}
                onAddGroup={handleAddGroup}
                level={0}
                maxDepth={maxDepth}
                disabled={disabled}
                onUpdateCondition={handleConditionUpdate}
                // 传递拖拽回调
                onDragComplete={handleDragComplete}
                onDragStart={handleGlobalDragStart}
                onDragEnd={handleGlobalDragEnd}
                onClearOtherGuides={handleClearOtherGuides}
                onRegisterGuideClear={registerGuideClearFunction}
                onUnregisterGuideClear={unregisterGuideClearFunction}
                // 传递验证相关的props
                globalDragData={globalDragData}
                isValidDropTarget={isValidDropTarget}
              />
            </div>
          )
        })}
      </div>
    )
  }

  // 渲染验证错误
  const renderValidationErrors = () => {
    if (validationResult.isValid || validationResult.errors.length === 0) {
      return null
    }

    return (
      <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3">
        <h4 className="text-body-small-strong mb-2 text-red-800">Validation Errors:</h4>
        <ul className="text-body-small space-y-1 text-red-700">
          {validationResult.errors.map((error, index) => (
            <li
              key={index}
              className="flex items-start"
            >
              <span className="mt-2 mr-2 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-red-500" />
              {error.message}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  // 处理拖拽移动完成
  const handleDragComplete = useCallback(
    (
      targetGroupId: string,
      targetIndex?: number,
      dragInfo?: {
        item: Condition | ConditionGroupType
        sourceGroupId: string
        sourceIndex: number
        type: "condition" | "group"
      },
    ) => {
      const draggedData = dragInfo || globalDragData
      if (!draggedData) {
        return
      }

      const { item: draggedItem, sourceGroupId, sourceIndex } = draggedData

      // 如果是同一个组内重排序，且位置确实没有变化
      if (sourceGroupId === targetGroupId && sourceIndex === targetIndex) {
        setGlobalDragData(null)
        return
      }

      // 执行拖拽移动
      setConditions((prev) => {
        // 检测无效拖拽：组不能拖拽到自己或自己的子组件中，也不能超过深度限制
        if (draggedData.type === "group") {
          // 检查循环引用
          if (isDescendantGroup(draggedItem.id, targetGroupId, prev)) {
            return prev
          }

          // 检查深度限制
          const targetGroup = findGroupById(prev, targetGroupId)
          if (!targetGroup) return prev

          const targetDepth = calculateGroupDepth(prev, targetGroupId)
          const draggedGroupMaxDepth = calculateGroupInternalDepth(
            draggedItem as ConditionGroupType,
          )
          const newMaxDepth = targetDepth + 1 + draggedGroupMaxDepth

          if (newMaxDepth > maxDepth) {
            return prev
          }
        }

        // 深度克隆整个状态树，确保不可变更新
        const newConditions = JSON.parse(JSON.stringify(prev)) as ConditionsRoot

        // 先验证源组和目标组都存在
        const sourceGroup = findGroupById(newConditions, sourceGroupId)
        const targetGroup = findGroupById(newConditions, targetGroupId)

        if (!sourceGroup || !targetGroup) {
          return prev
        }

        // 验证源索引有效
        if (sourceIndex < 0 || sourceIndex >= sourceGroup.conditions.length) {
          return prev
        }

        // 从源组删除
        const itemToMove = sourceGroup.conditions[sourceIndex]

        // 如果是同组内重排序
        if (sourceGroupId === targetGroupId) {
          const newGroupConditions = [...targetGroup.conditions]
          const [removed] = newGroupConditions.splice(sourceIndex, 1)
          const insertIndex = targetIndex !== undefined ? targetIndex : newGroupConditions.length
          newGroupConditions.splice(insertIndex, 0, removed)
          targetGroup.conditions = newGroupConditions
        } else {
          // 跨组移动
          sourceGroup.conditions = sourceGroup.conditions.filter((_, i) => i !== sourceIndex)

          // 如果源组为空且不是根组的第一个组，删除源组
          if (sourceGroup.conditions.length === 0 && sourceGroupId !== prev.groups[0]?.id) {
            removeGroupById(newConditions, sourceGroupId)
          }

          // 添加到目标组
          const insertIndex =
            targetIndex !== undefined
              ? Math.min(targetIndex, targetGroup.conditions.length)
              : targetGroup.conditions.length
          targetGroup.conditions.splice(insertIndex, 0, itemToMove)
        }

        return newConditions
      })

      setGlobalDragData(null)
    },
    [globalDragData, maxDepth],
  )

  // 辅助函数：计算组在整个树中的深度
  const calculateGroupDepth = (root: ConditionsRoot, groupId: string): number => {
    // 检查根级组
    for (const group of root.groups) {
      if (group.id === groupId) {
        return 0 // 根级组深度为0
      }
    }

    // 递归检查嵌套组
    const findDepthInConditions = (
      conditions: (Condition | ConditionGroupType)[],
      currentDepth: number,
    ): number => {
      for (const item of conditions) {
        if ("conditions" in item) {
          if (item.id === groupId) {
            return currentDepth
          }
          const found = findDepthInConditions(item.conditions, currentDepth + 1)
          if (found !== -1) {
            return found
          }
        }
      }
      return -1
    }

    for (const group of root.groups) {
      const depth = findDepthInConditions(group.conditions, 1)
      if (depth !== -1) {
        return depth
      }
    }

    return 0 // 如果没找到，返回0
  }

  // 辅助函数：计算组的内部最大深度
  const calculateGroupInternalDepth = (group: ConditionGroupType): number => {
    let maxDepth = 0

    for (const condition of group.conditions) {
      if ("conditions" in condition) {
        // 子组的深度 = 1 + 子组的内部最大深度
        const childDepth = 1 + calculateGroupInternalDepth(condition)
        maxDepth = Math.max(maxDepth, childDepth)
      }
    }

    return maxDepth
  }

  // 辅助函数：检查目标组是否是被拖拽组的子孙组件 (防止拖拽到自己内部)
  const isDescendantGroup = (
    draggedGroupId: string,
    targetGroupId: string,
    root: ConditionsRoot,
  ): boolean => {
    // 如果目标就是自己，直接返回true
    if (draggedGroupId === targetGroupId) {
      return true
    }

    // 找到被拖拽的组
    const draggedGroup = findGroupById(root, draggedGroupId)
    if (!draggedGroup) {
      return false
    }

    // 递归检查被拖拽组内部是否包含目标组
    const checkGroupContainsTarget = (group: ConditionGroupType): boolean => {
      for (const condition of group.conditions) {
        if ("conditions" in condition) {
          // 如果找到目标组，说明目标是被拖拽组的子孙
          if (condition.id === targetGroupId) {
            return true
          }
          // 递归检查子组
          if (checkGroupContainsTarget(condition)) {
            return true
          }
        }
      }
      return false
    }

    return checkGroupContainsTarget(draggedGroup)
  }

  // 辅助函数：通过ID查找组
  const findGroupById = (root: ConditionsRoot, groupId: string): ConditionGroupType | null => {
    for (const group of root.groups) {
      if (group.id === groupId) return group

      const found = findGroupInConditions(group.conditions, groupId)
      if (found) return found
    }
    return null
  }

  // 辅助函数：通过ID查找条件
  const findConditionById = (root: ConditionsRoot, conditionId: string): Condition | null => {
    for (const group of root.groups) {
      const found = findConditionInConditions(group.conditions, conditionId)
      if (found) return found
    }
    return null
  }

  const findConditionInConditions = (
    conditions: (Condition | ConditionGroupType)[],
    conditionId: string,
  ): Condition | null => {
    for (const item of conditions) {
      if ("fieldKey" in item) {
        if (item.id === conditionId) return item
      } else {
        const found = findConditionInConditions(item.conditions, conditionId)
        if (found) return found
      }
    }
    return null
  }

  const findGroupInConditions = (
    conditions: (Condition | ConditionGroupType)[],
    groupId: string,
  ): ConditionGroupType | null => {
    for (const item of conditions) {
      if ("conditions" in item) {
        if (item.id === groupId) return item

        const found = findGroupInConditions(item.conditions, groupId)
        if (found) return found
      }
    }
    return null
  }

  // 辅助函数：删除组
  const removeGroupById = (root: ConditionsRoot, groupId: string): void => {
    // 从根组中删除
    root.groups = root.groups.filter((group) => group.id !== groupId)

    // 从嵌套组中删除
    for (const group of root.groups) {
      removeGroupFromConditions(group.conditions, groupId)
    }
  }

  const removeGroupFromConditions = (
    conditions: (Condition | ConditionGroupType)[],
    groupId: string,
  ): void => {
    for (let i = conditions.length - 1; i >= 0; i--) {
      const item = conditions[i]
      if ("conditions" in item) {
        if (item.id === groupId) {
          conditions.splice(i, 1)
        } else {
          removeGroupFromConditions(item.conditions, groupId)
        }
      }
    }
  }

  return (
    <div
      className={`conditions-builder ${className}`}
      onDragOver={(e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
      }}
    >
      {/* 主要条件区域 */}
      <div className="flex flex-col gap-2">{renderConditionGroups()}</div>

      {/* 验证错误显示 */}
      {renderValidationErrors()}

      {/* 可选的调试信息组件，在开发时可以启用 */}
    </div>
  )
}

// 导出组件和子组件
Conditions.Group = ConditionGroup
