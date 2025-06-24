import { useCallback, useMemo } from "react"
import {
  type Field,
  type ComparisonOperator,
  type OperatorConfig,
  type UseFieldOperatorsReturn,
  ConditionsFieldType,
} from "../types"

import {
  getOperatorsForField as getOperatorsForFieldUtil,
  getOperatorConfig as getOperatorConfigUtil,
  isOperatorValidForFieldType,
} from "../utils"

/**
 * useFieldOperators Hook
 *
 * 提供字段和操作符相关的工具函数，包括：
 * - 获取字段支持的操作符列表
 * - 验证操作符是否适用于字段
 * - 获取操作符配置信息
 */
export function useFieldOperators(fields: Field[]): UseFieldOperatorsReturn {
  // 创建字段映射表以提高查找性能
  const fieldsMap = useMemo(() => {
    const map = new Map<string, Field>()
    fields.forEach((field) => {
      map.set(field.key, field)
    })
    return map
  }, [fields])

  /**
   * 获取字段支持的操作符列表
   */
  const getOperatorsForField = useCallback(
    (fieldKey: string): ComparisonOperator[] => {
      const field = fieldsMap.get(fieldKey)
      if (!field) {
        return []
      }

      return getOperatorsForFieldUtil(fieldKey, fields)
    },
    [fields, fieldsMap],
  )

  /**
   * 获取操作符的配置信息
   */
  const getOperatorConfig = useCallback(
    (operator: ComparisonOperator): OperatorConfig | undefined => {
      return getOperatorConfigUtil(operator)
    },
    [],
  )

  /**
   * 验证操作符是否适用于指定字段
   */
  const isOperatorValidForField = useCallback(
    (fieldKey: string, operator: ComparisonOperator): boolean => {
      const field = fieldsMap.get(fieldKey)
      if (!field) {
        return false
      }

      return isOperatorValidForFieldType(field.type, operator)
    },
    [fieldsMap],
  )

  return {
    getOperatorsForField,
    getOperatorConfig,
    isOperatorValidForField,
  }
}

/**
 * 获取字段类型的显示名称
 */
export function getFieldTypeDisplayName(fieldType: ConditionsFieldType): string {
  const displayNames: Record<ConditionsFieldType, string> = {
    [ConditionsFieldType.Text]: "Text",
    [ConditionsFieldType.Number]: "Number",
    [ConditionsFieldType.Date]: "Date",
    [ConditionsFieldType.DateTime]: "Date & Time",
    [ConditionsFieldType.Boolean]: "Boolean",
    [ConditionsFieldType.Select]: "Select",
    [ConditionsFieldType.MultiSelect]: "Multi-Select",
    [ConditionsFieldType.User]: "User",
    [ConditionsFieldType.Tag]: "Tag",
  }

  return displayNames[fieldType] || fieldType
}

/**
 * 检查字段是否需要选项配置
 */
export function isFieldWithOptions(field: Field): field is Extract<Field, { options: unknown }> {
  return field.type === ConditionsFieldType.Select || field.type === ConditionsFieldType.MultiSelect
}

/**
 * 检查字段是否支持多个值
 */
export function isMultiValueField(field: Field): boolean {
  return (
    field.type === ConditionsFieldType.MultiSelect ||
    (field.type === ConditionsFieldType.User && "multiple" in field && field.multiple === true) ||
    (field.type === ConditionsFieldType.Tag && "multiple" in field && field.multiple !== false)
  )
}

/**
 * 获取字段的默认值
 */
export function getDefaultValueForField(field: Field): unknown {
  switch (field.type) {
    case ConditionsFieldType.Text:
      return ""
    case ConditionsFieldType.Number:
      return 0
    case ConditionsFieldType.Boolean:
      return false
    case ConditionsFieldType.Date:
    case ConditionsFieldType.DateTime:
      return null
    case ConditionsFieldType.Select:
      return null
    case ConditionsFieldType.MultiSelect:
      return []
    case ConditionsFieldType.User:
      return isMultiValueField(field) ? [] : null
    case ConditionsFieldType.Tag:
      return isMultiValueField(field) ? [] : null
    default:
      return null
  }
}

/**
 * 验证字段值是否有效
 */
export function isValidFieldValue(field: Field, value: unknown): boolean {
  if (value === null || value === undefined) {
    return !field.required
  }

  switch (field.type) {
    case ConditionsFieldType.Text:
      return typeof value === "string"

    case ConditionsFieldType.Number:
      if (typeof value !== "number") return false
      if ("min" in field && field.min !== undefined && value < field.min) return false
      if ("max" in field && field.max !== undefined && value > field.max) return false
      return true

    case ConditionsFieldType.Boolean:
      return typeof value === "boolean"

    case ConditionsFieldType.Date:
    case ConditionsFieldType.DateTime:
      return value instanceof Date || typeof value === "string"

    case ConditionsFieldType.Select:
      if (!isFieldWithOptions(field)) return false
      return field.options.some((option) => option.value === value)

    case ConditionsFieldType.MultiSelect:
      if (!Array.isArray(value)) return false
      if (!isFieldWithOptions(field)) return false
      return value.every((v) => field.options.some((option) => option.value === v))

    case ConditionsFieldType.User:
      if (isMultiValueField(field)) {
        return Array.isArray(value) && value.every((v) => typeof v === "string")
      }
      return typeof value === "string"

    case ConditionsFieldType.Tag:
      if (isMultiValueField(field)) {
        return Array.isArray(value) && value.every((v) => typeof v === "string")
      }
      return typeof value === "string"

    default:
      return true
  }
}
