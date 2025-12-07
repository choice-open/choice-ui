import { nanoid } from "nanoid"
import {
  Condition,
  ConditionGroup,
  ConditionGroupType,
  ConditionsRoot,
  Field,
  FieldType,
  ComparisonOperator,
  LogicalOperator,
  ValidationResult,
  ValidationError,
} from "../types"

import {
  FIELD_OPERATOR_MAP,
  OPERATOR_CONFIGS,
  DEFAULT_LOGICAL_OPERATOR,
  DEFAULT_COMPARISON_OPERATOR,
  ID_PREFIXES,
} from "./constants"

// ============= ID生成工具 =============

/**
 * 生成唯一ID
 */
export function generateId(prefix: keyof typeof ID_PREFIXES): string {
  return `${ID_PREFIXES[prefix]}${nanoid()}`
}

/**
 * 生成条件ID
 */
export function generateConditionId(): string {
  return generateId("condition")
}

/**
 * 生成条件组ID
 */
export function generateGroupId(): string {
  return generateId("group")
}

/**
 * 生成默认组名称
 */
export function generateGroupName(existingGroups: ConditionGroupType[] = []): string {
  // 获取现有组名中的最大索引
  let maxIndex = 0

  // 递归查找所有组（包括嵌套的）
  function findMaxIndex(groups: ConditionGroupType[]): void {
    groups.forEach((group) => {
      // 解析组名中的索引，例如 "Group 1" -> 1
      if (group.name) {
        const match = group.name.match(/^Group (\d+)$/i)
        if (match) {
          const index = parseInt(match[1], 10)
          if (index > maxIndex) {
            maxIndex = index
          }
        }
      }

      // 递归查找嵌套组
      const nestedGroups = group.conditions.filter(
        (item) => "logicalOperator" in item,
      ) as ConditionGroupType[]
      if (nestedGroups.length > 0) {
        findMaxIndex(nestedGroups)
      }
    })
  }

  findMaxIndex(existingGroups)

  return `Group ${maxIndex + 1}`
}

/**
 * 生成根容器ID
 */
export function generateRootId(): string {
  return generateId("root")
}

// ============= 条件创建工具 =============

/**
 * 创建新的条件
 */
export function createCondition(
  fieldKey?: string,
  operator?: ComparisonOperator,
  value?: unknown,
): Condition {
  return {
    id: generateConditionId(),
    fieldKey: fieldKey || "",
    operator: operator || DEFAULT_COMPARISON_OPERATOR,
    value: value || null,
  }
}

/**
 * 创建新的条件组
 */
export function createConditionGroup(
  logicalOperator: LogicalOperator = DEFAULT_LOGICAL_OPERATOR,
  conditions: (Condition | ConditionGroupType)[] = [],
  name?: string,
): ConditionGroupType {
  return {
    id: generateGroupId(),
    logicalOperator,
    conditions,
    name,
  }
}

/**
 * 创建新的根容器
 */
export function createConditionsRoot(groups: ConditionGroupType[] = []): ConditionsRoot {
  return {
    id: generateRootId(),
    groups,
  }
}

/**
 * 创建空的条件根容器
 */
export function createEmptyConditions(): ConditionsRoot {
  return createConditionsRoot([
    createConditionGroup(DEFAULT_LOGICAL_OPERATOR, [createCondition()], "Group 1"),
  ])
}

// ============= 查找工具 =============

/**
 * 在条件树中查找条件
 */
export function findCondition(
  root: ConditionsRoot,
  conditionId: string,
): { condition: Condition; parent: ConditionGroup } | null {
  for (const group of root.groups) {
    const result = findConditionInGroup(group, conditionId)
    if (result) return result
  }
  return null
}

/**
 * 在条件组中查找条件
 */
function findConditionInGroup(
  group: ConditionGroupType,
  conditionId: string,
): { condition: Condition; parent: ConditionGroupType } | null {
  for (const item of group.conditions) {
    if ("fieldKey" in item && item.id === conditionId) {
      return { condition: item, parent: group }
    }
    if ("logicalOperator" in item) {
      const result = findConditionInGroup(item, conditionId)
      if (result) return result
    }
  }
  return null
}

/**
 * 在条件树中查找条件组
 */
export function findGroup(
  root: ConditionsRoot,
  groupId: string,
): { group: ConditionGroup; parent: ConditionsRoot | ConditionGroup } | null {
  // 检查根级别的组
  for (const group of root.groups) {
    if (group.id === groupId) {
      return { group, parent: root }
    }

    // 递归检查子组
    const result = findGroupInGroup(group, groupId)
    if (result) return result
  }

  return null
}

/**
 * 在条件组中查找子组
 */
function findGroupInGroup(
  group: ConditionGroup,
  groupId: string,
): { group: ConditionGroup; parent: ConditionGroup } | null {
  for (const item of group.conditions) {
    if ("logicalOperator" in item) {
      if (item.id === groupId) {
        return { group: item, parent: group }
      }

      const result = findGroupInGroup(item, groupId)
      if (result) return result
    }
  }
  return null
}

// ============= 路径工具 =============

/**
 * 获取条件的路径
 */
export function getConditionPath(root: ConditionsRoot, conditionId: string): string[] {
  const path: string[] = []

  function searchInGroup(group: ConditionGroup, currentPath: string[]): boolean {
    for (let i = 0; i < group.conditions.length; i++) {
      const item = group.conditions[i]
      const itemPath = [...currentPath, `conditions[${i}]`]

      if ("fieldKey" in item && item.id === conditionId) {
        path.push(...itemPath)
        return true
      }

      if ("logicalOperator" in item) {
        if (searchInGroup(item, itemPath)) {
          return true
        }
      }
    }
    return false
  }

  for (let i = 0; i < root.groups.length; i++) {
    const group = root.groups[i]
    const groupPath = [`groups[${i}]`]

    if (searchInGroup(group, groupPath)) {
      path.unshift(...groupPath)
      break
    }
  }

  return path
}

/**
 * 获取条件组的路径
 */
export function getGroupPath(root: ConditionsRoot, groupId: string): string[] {
  const path: string[] = []

  function searchInGroup(group: ConditionGroup, currentPath: string[]): boolean {
    if (group.id === groupId) {
      path.push(...currentPath)
      return true
    }

    for (let i = 0; i < group.conditions.length; i++) {
      const item = group.conditions[i]
      if ("logicalOperator" in item) {
        const itemPath = [...currentPath, `conditions[${i}]`]
        if (searchInGroup(item, itemPath)) {
          return true
        }
      }
    }
    return false
  }

  for (let i = 0; i < root.groups.length; i++) {
    const group = root.groups[i]
    const groupPath = [`groups[${i}]`]

    if (searchInGroup(group, groupPath)) {
      break
    }
  }

  return path
}

// ============= 验证工具 =============

/**
 * 验证字段类型是否支持指定操作符
 */
export function isOperatorValidForFieldType(
  fieldType: FieldType,
  operator: ComparisonOperator,
): boolean {
  return FIELD_OPERATOR_MAP[fieldType]?.includes(operator) || false
}

/**
 * 验证条件
 */
export function validateCondition(condition: Condition, fields: Field[]): ValidationError[] {
  const errors: ValidationError[] = []

  // 验证字段
  if (!condition.fieldKey) {
    errors.push({
      path: [condition.id],
      message: "Field is required",
      field: condition.fieldKey,
    })
    return errors
  }

  const field = fields.find((f) => f.key === condition.fieldKey)
  if (!field) {
    errors.push({
      path: [condition.id],
      message: `Field "${condition.fieldKey}" not found`,
      field: condition.fieldKey,
    })
    return errors
  }

  // 验证操作符
  if (!condition.operator) {
    errors.push({
      path: [condition.id],
      message: "Operator is required",
      operator: condition.operator,
    })
    return errors
  }

  if (!isOperatorValidForFieldType(field.type, condition.operator)) {
    errors.push({
      path: [condition.id],
      message: `Operator "${condition.operator}" is not valid for field type "${field.type}"`,
      field: condition.fieldKey,
      operator: condition.operator,
    })
  }

  // 验证值
  const operatorConfig = OPERATOR_CONFIGS[condition.operator]
  if (
    operatorConfig?.valueRequired &&
    (condition.value === null || condition.value === undefined || condition.value === "")
  ) {
    errors.push({
      path: [condition.id],
      message: "Value is required for this operator",
      field: condition.fieldKey,
      operator: condition.operator,
    })
  }

  if (
    operatorConfig?.secondValueRequired &&
    (condition.secondValue === null ||
      condition.secondValue === undefined ||
      condition.secondValue === "")
  ) {
    errors.push({
      path: [condition.id],
      message: "Second value is required for this operator",
      field: condition.fieldKey,
      operator: condition.operator,
    })
  }

  return errors
}

/**
 * 验证条件组
 */
export function validateConditionGroup(
  group: ConditionGroupType,
  fields: Field[],
): ValidationError[] {
  const errors: ValidationError[] = []

  // 验证条件组至少有一个条件
  if (group.conditions.length === 0) {
    errors.push({
      path: [group.id],
      message: "Condition group must have at least one condition",
    })
  }

  // 验证每个条件/子组
  group.conditions.forEach((item, index) => {
    if ("fieldKey" in item) {
      const conditionErrors = validateCondition(item, fields)
      errors.push(
        ...conditionErrors.map((error) => ({
          ...error,
          path: [group.id, `conditions[${index}]`, ...error.path],
        })),
      )
    } else {
      const groupErrors = validateConditionGroup(item, fields)
      errors.push(
        ...groupErrors.map((error) => ({
          ...error,
          path: [group.id, `conditions[${index}]`, ...error.path],
        })),
      )
    }
  })

  return errors
}

/**
 * 验证完整的条件配置
 */
export function validateConditions(root: ConditionsRoot, fields: Field[]): ValidationResult {
  const errors: ValidationError[] = []

  root.groups.forEach((group, index) => {
    const groupErrors = validateConditionGroup(group, fields)
    errors.push(
      ...groupErrors.map((error) => ({
        ...error,
        path: [`groups[${index}]`, ...error.path],
      })),
    )
  })

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// ============= 操作符工具 =============

/**
 * 获取字段支持的操作符
 */
export function getOperatorsForField(fieldKey: string, fields: Field[]): ComparisonOperator[] {
  const field = fields.find((f) => f.key === fieldKey)
  if (!field) return []

  return FIELD_OPERATOR_MAP[field.type] || []
}

/**
 * 获取操作符配置
 */
export function getOperatorConfig(
  operator: ComparisonOperator,
): (typeof OPERATOR_CONFIGS)[ComparisonOperator] | undefined {
  return OPERATOR_CONFIGS[operator]
}

// ============= 条件操作工具 =============

/**
 * 深拷贝条件配置
 */
export function cloneConditions(root: ConditionsRoot): ConditionsRoot {
  return JSON.parse(JSON.stringify(root))
}

/**
 * 复制条件
 */
export function duplicateCondition(condition: Condition): Condition {
  return {
    ...condition,
    id: generateConditionId(),
  }
}

/**
 * 检查条件树是否为空
 */
export function isConditionsEmpty(root: ConditionsRoot): boolean {
  return root.groups.every((group) =>
    group.conditions.every((item) => ("fieldKey" in item ? !item.fieldKey : isGroupEmpty(item))),
  )
}

/**
 * 检查条件组是否为空
 */
function isGroupEmpty(group: ConditionGroupType): boolean {
  return group.conditions.every((item) =>
    "fieldKey" in item ? !item.fieldKey : isGroupEmpty(item),
  )
}

/**
 * 计算条件树的深度
 */
export function getConditionsDepth(root: ConditionsRoot): number {
  let maxDepth = 0

  function getGroupDepth(group: ConditionGroupType, currentDepth: number): number {
    let depth = currentDepth

    for (const item of group.conditions) {
      if ("logicalOperator" in item) {
        depth = Math.max(depth, getGroupDepth(item, currentDepth + 1))
      }
    }

    return depth
  }

  for (const group of root.groups) {
    maxDepth = Math.max(maxDepth, getGroupDepth(group, 1))
  }

  return maxDepth
}

/**
 * 获取条件总数
 */
export function getConditionsCount(root: ConditionsRoot): number {
  let count = 0

  function countInGroup(group: ConditionGroupType): number {
    let groupCount = 0

    for (const item of group.conditions) {
      if ("fieldKey" in item) {
        groupCount++
      } else {
        groupCount += countInGroup(item)
      }
    }

    return groupCount
  }

  for (const group of root.groups) {
    count += countInGroup(group)
  }

  return count
}
