import { useCallback, useState } from "react"
import {
  type Condition,
  type ConditionGroup,
  type ConditionsRoot,
  type Field,
  type UseConditionsReturn,
  type ValidationResult,
  LogicalOperator,
} from "../types"

import {
  createCondition,
  createConditionGroup,
  createEmptyConditions,
  findCondition,
  findGroup,
  getConditionPath,
  getGroupPath,
  validateConditions,
  cloneConditions,
  duplicateCondition as duplicateConditionUtil,
} from "../utils"

/**
 * useConditions Hook
 *
 * 提供条件管理的完整功能，包括：
 * - 条件的增删改查
 * - 条件组的嵌套管理
 * - 验证和路径追踪
 */
export function useConditions(
  initialConditions?: ConditionsRoot,
  fields: Field[] = [],
): UseConditionsReturn {
  const [conditions, setConditions] = useState<ConditionsRoot>(
    () => initialConditions || createEmptyConditions(),
  )

  // ============= 条件操作 =============

  /**
   * 添加新条件
   */
  const addCondition = useCallback((parentGroupId?: string, fieldKey?: string) => {
    setConditions((prev) => {
      const newConditions = cloneConditions(prev)
      const newCondition = createCondition(fieldKey)

      if (!parentGroupId) {
        // 添加到第一个组，如果没有组则创建一个
        if (newConditions.groups.length === 0) {
          newConditions.groups.push(createConditionGroup(LogicalOperator.And, [newCondition]))
        } else {
          newConditions.groups[0].conditions.push(newCondition)
        }
      } else {
        // 添加到指定的组
        const groupResult = findGroup(newConditions, parentGroupId)
        if (groupResult) {
          groupResult.group.conditions.push(newCondition)
        }
      }

      return newConditions
    })
  }, [])

  /**
   * 添加新的条件组
   */
  const addGroup = useCallback(
    (parentGroupId?: string, logicalOperator: LogicalOperator = LogicalOperator.And) => {
      setConditions((prev) => {
        const newConditions = cloneConditions(prev)
        const newGroup = createConditionGroup(logicalOperator, [createCondition()])

        if (!parentGroupId) {
          // 添加到根级别
          newConditions.groups.push(newGroup)
        } else {
          // 添加到指定的父组
          const parentResult = findGroup(newConditions, parentGroupId)
          if (parentResult) {
            parentResult.group.conditions.push(newGroup)
          }
        }

        return newConditions
      })
    },
    [],
  )

  /**
   * 更新条件
   */
  const updateCondition = useCallback((conditionId: string, updates: Partial<Condition>) => {
    setConditions((prev) => {
      const newConditions = cloneConditions(prev)
      const conditionResult = findCondition(newConditions, conditionId)

      if (conditionResult) {
        Object.assign(conditionResult.condition, updates)
      }

      return newConditions
    })
  }, [])

  /**
   * 更新条件组
   */
  const updateGroup = useCallback((groupId: string, updates: Partial<ConditionGroup>) => {
    setConditions((prev) => {
      const newConditions = cloneConditions(prev)
      const groupResult = findGroup(newConditions, groupId)

      if (groupResult) {
        Object.assign(groupResult.group, updates)
      }

      return newConditions
    })
  }, [])

  /**
   * 删除条件
   */
  const deleteCondition = useCallback((conditionId: string) => {
    setConditions((prev) => {
      const newConditions = cloneConditions(prev)
      const conditionResult = findCondition(newConditions, conditionId)

      if (conditionResult) {
        const { parent } = conditionResult
        const conditionIndex = parent.conditions.findIndex(
          (item: Condition | ConditionGroup) => "fieldKey" in item && item.id === conditionId,
        )

        if (conditionIndex !== -1) {
          parent.conditions.splice(conditionIndex, 1)

          // 如果组变空了，添加一个空条件
          if (parent.conditions.length === 0) {
            parent.conditions.push(createCondition())
          }
        }
      }

      return newConditions
    })
  }, [])

  /**
   * 删除条件组
   */
  const deleteGroup = useCallback((groupId: string) => {
    setConditions((prev) => {
      const newConditions = cloneConditions(prev)
      const groupResult = findGroup(newConditions, groupId)

      if (groupResult) {
        const { parent } = groupResult

        if ("groups" in parent) {
          // 从根容器删除
          const groupIndex = parent.groups.findIndex((g: ConditionGroup) => g.id === groupId)
          if (groupIndex !== -1) {
            parent.groups.splice(groupIndex, 1)

            // 确保至少有一个组
            if (parent.groups.length === 0) {
              parent.groups.push(createConditionGroup(LogicalOperator.And, [createCondition()]))
            }
          }
        } else {
          // 从父组删除
          const groupIndex = parent.conditions.findIndex(
            (item: Condition | ConditionGroup) => "logicalOperator" in item && item.id === groupId,
          )
          if (groupIndex !== -1) {
            parent.conditions.splice(groupIndex, 1)

            // 如果父组变空了，添加一个空条件
            if (parent.conditions.length === 0) {
              parent.conditions.push(createCondition())
            }
          }
        }
      }

      return newConditions
    })
  }, [])

  /**
   * 复制条件
   */
  const duplicateCondition = useCallback((conditionId: string) => {
    setConditions((prev) => {
      const newConditions = cloneConditions(prev)
      const conditionResult = findCondition(newConditions, conditionId)

      if (conditionResult) {
        const { condition, parent } = conditionResult
        const duplicatedCondition = duplicateConditionUtil(condition)

        const conditionIndex = parent.conditions.findIndex(
          (item: Condition | ConditionGroup) => "fieldKey" in item && item.id === conditionId,
        )

        if (conditionIndex !== -1) {
          // 在原条件后面插入复制的条件
          parent.conditions.splice(conditionIndex + 1, 0, duplicatedCondition)
        }
      }

      return newConditions
    })
  }, [])

  /**
   * 清空所有条件
   */
  const clearAll = useCallback(() => {
    setConditions(createEmptyConditions())
  }, [])

  // ============= 工具函数 =============

  /**
   * 验证条件配置
   */
  const validate = useCallback((): ValidationResult => {
    return validateConditions(conditions, fields)
  }, [conditions, fields])

  /**
   * 获取条件路径
   */
  const getConditionPathMemo = useCallback(
    (conditionId: string): string[] => {
      return getConditionPath(conditions, conditionId)
    },
    [conditions],
  )

  /**
   * 获取条件组路径
   */
  const getGroupPathMemo = useCallback(
    (groupId: string): string[] => {
      return getGroupPath(conditions, groupId)
    },
    [conditions],
  )

  return {
    conditions,
    addCondition,
    addGroup,
    updateCondition,
    updateGroup,
    deleteCondition,
    deleteGroup,
    duplicateCondition,
    clearAll,
    validate,
    getConditionPath: getConditionPathMemo,
    getGroupPath: getGroupPathMemo,
  }
}
