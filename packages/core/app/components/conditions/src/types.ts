/* eslint-disable typescript-sort-keys/string-enum */
// Conditions 组件类型定义

// ============= 基础类型 =============

/**
 * 字段类型枚举
 */
export enum FieldType {
  Boolean = "boolean",
  Date = "date",
  DateTime = "datetime",
  MultiSelect = "multiselect",
  Number = "number",
  Select = "select",
  Tag = "tag",
  Text = "text",
  User = "user",
}

/**
 * 逻辑连接符
 */
export enum LogicalOperator {
  And = "and",
  Or = "or",
}

/**
 * 比较操作符
 */
export enum ComparisonOperator {
  Between = "between",
  // 文本操作符
  Contains = "contains",
  EndsWith = "ends_with",
  // 通用操作符
  Equals = "equals",

  // 数字/日期操作符
  GreaterThan = "greater_than",
  GreaterThanOrEqual = "greater_than_or_equal",
  // 数组操作符
  In = "in",
  IsAfter = "is_after",

  IsBefore = "is_before",
  IsEmpty = "is_empty",
  IsLastMonth = "is_last_month",
  IsLastWeek = "is_last_week",
  IsNextMonth = "is_next_month",

  StartsWith = "starts_with",
  NotIn = "not_in",

  NotContains = "not_contains",
  IsThisWeek = "is_this_week",
  IsToday = "is_today",
  IsTomorrow = "is_tomorrow",
  // 日期特定操作符
  IsWithin = "is_within",
  IsYesterday = "is_yesterday",
  NotEquals = "not_equals",
  LessThanOrEqual = "less_than_or_equal",
  IsNextWeek = "is_next_week",
  IsThisMonth = "is_this_month",
  LessThan = "less_than",
  IsNotEmpty = "is_not_empty",

  // 新增操作符 - 存在性检查
  Exists = "exists",
  DoesNotExist = "does_not_exist",

  // 正则表达式操作符
  MatchesRegex = "matches_regex",
  DoesNotMatchRegex = "does_not_match_regex",

  // 数组长度操作符
  LengthEquals = "length_equals",
  LengthGreaterThan = "length_greater_than",
  LengthLessThan = "length_less_than",
  LengthGreaterThanOrEqual = "length_greater_than_or_equal",
  LengthLessThanOrEqual = "length_less_than_or_equal",

  // 布尔操作符（简化版）
  IsTrue = "is_true",
  IsFalse = "is_false",
}

// ============= 字段定义 =============

/**
 * 选择项接口
 */
export interface SelectOption {
  color?: string
  icon?: string
  label: string
  value: string | number
}

/**
 * 基础字段定义
 */
export interface BaseField {
  description?: string
  key: string
  label: string
  placeholder?: string
  required?: boolean
  type: FieldType
}

/**
 * 文本字段
 */
export interface TextFieldConfig extends BaseField {
  multiline?: boolean
  type: FieldType.Text
}

/**
 * 数字字段
 */
export interface NumberFieldConfig extends BaseField {
  max?: number
  min?: number
  step?: number
  type: FieldType.Number
}

/**
 * 日期字段
 */
export interface DateFieldConfig extends BaseField {
  format?: string
  maxDate?: Date
  minDate?: Date
  type: FieldType.Date | FieldType.DateTime
}

/**
 * 布尔字段
 */
export interface BooleanFieldConfig extends BaseField {
  falseLabel?: string
  trueLabel?: string
  type: FieldType.Boolean
}

/**
 * 选择字段
 */
export interface SelectFieldConfig extends BaseField {
  creatable?: boolean
  options: SelectOption[]
  searchable?: boolean
  type: FieldType.Select | FieldType.MultiSelect
}

/**
 * 用户字段
 */
export interface UserFieldConfig extends BaseField {
  multiple?: boolean
  roles?: string[]
  type: FieldType.User
}

/**
 * 标签字段
 */
export interface TagFieldConfig extends BaseField {
  colorized?: boolean
  multiple?: boolean
  type: FieldType.Tag
}

// 为了保持向后兼容性，保留旧的类型名称作为别名（但排除会导致组件名冲突的类型）
export type NumberField = NumberFieldConfig
export type DateField = DateFieldConfig
export type BooleanField = BooleanFieldConfig
export type SelectField = SelectFieldConfig
export type UserField = UserFieldConfig
export type TagField = TagFieldConfig

/**
 * 字段联合类型
 */
export type Field =
  | TextFieldConfig
  | NumberFieldConfig
  | DateFieldConfig
  | BooleanFieldConfig
  | SelectFieldConfig
  | UserFieldConfig
  | TagFieldConfig

// ============= 类型别名 (为了保持与现有代码的兼容性) =============

/**
 * 字段类型枚举别名
 */
export const ConditionsFieldType = FieldType
export type ConditionsFieldType = FieldType

/**
 * 字段类型别名
 */
export type ConditionsTextField = TextFieldConfig
export type ConditionsNumberField = NumberFieldConfig
export type ConditionsDateField = DateFieldConfig
export type ConditionsBooleanField = BooleanFieldConfig
export type ConditionsSelectField = SelectFieldConfig
export type ConditionsUserField = UserFieldConfig
export type ConditionsTagField = TagFieldConfig

// ============= 条件值类型 =============

/**
 * 条件值类型映射
 */
export type ConditionValue<T extends FieldType = FieldType> = T extends FieldType.Text
  ? string
  : T extends FieldType.Number
    ? number
    : T extends FieldType.Date | FieldType.DateTime
      ? Date | string
      : T extends FieldType.Boolean
        ? boolean
        : T extends FieldType.Select
          ? string | number
          : T extends FieldType.MultiSelect
            ? (string | number)[]
            : T extends FieldType.User
              ? string | string[]
              : T extends FieldType.Tag
                ? string | string[]
                : unknown

/**
 * 范围值类型
 */
export interface RangeValue<T = unknown> {
  from: T
  to: T
}

/**
 * 日期范围预设
 */
export enum DateRangePreset {
  Last30Days = "last_30_days",
  Last7Days = "last_7_days",
  Last90Days = "last_90_days",
  LastMonth = "last_month",
  LastWeek = "last_week",
  NextMonth = "next_month",
  NextWeek = "next_week",
  ThisMonth = "this_month",
  ThisWeek = "this_week",
  Today = "today",
  Tomorrow = "tomorrow",
  Yesterday = "yesterday",
}

// ============= 条件定义 =============

/**
 * 单个条件
 */
export interface Condition {
  fieldKey: string
  id: string
  operator: ComparisonOperator
  // 对于需要两个值的操作符（如 between）
  secondValue?: unknown
  value: unknown
}

/**
 * 条件组
 */
export interface ConditionGroupType {
  conditions: (Condition | ConditionGroupType)[]
  id: string
  logicalOperator: LogicalOperator
  name?: string
}

// 保持向后兼容性的类型别名
export type ConditionGroup = ConditionGroupType

/**
 * 根条件容器
 */
export interface ConditionsRoot {
  groups: ConditionGroupType[]
  id: string
}

// ============= 组件Props =============

/**
 * 条件项渲染Props
 */
export interface ConditionItemProps {
  className?: string
  condition: Condition
  disabled?: boolean
  fields: Field[]
  onDelete: () => void
  onDuplicate?: () => void
  onUpdate: (condition: Condition) => void
}

/**
 * 条件组渲染Props
 */
export interface ConditionGroupProps {
  className?: string
  disabled?: boolean
  fields: Field[]
  group: ConditionGroupType
  level?: number
  onAddCondition: (parentGroupId: string) => void
  onAddGroup: (parentGroupId: string) => void
  onDelete: () => void
  onUpdate: (group: ConditionGroupType) => void
  onUpdateCondition?: (conditionId: string, updates: Partial<Condition>) => void
}

/**
 * 主组件Props
 */
export interface ConditionsProps {
  /**
   * 自定义样式类名
   */
  className?: string

  /**
   * 是否禁用
   */
  disabled?: boolean

  /**
   * 可用字段定义
   */
  fields: Field[]

  /**
   * 本地化文本
   */
  localization?: {
    [key: string]: string
    addCondition: string
    addGroup: string
    and: string
    deleteCondition: string
    deleteGroup: string
    duplicateCondition: string
    or: string
    where: string
  }

  /**
   * 最大嵌套层级
   */
  maxDepth?: number

  /**
   * 条件变更回调
   */
  onChange?: (conditions: ConditionsRoot) => void

  /**
   * 自定义渲染器
   */
  renderers?: {
    condition?: React.ComponentType<ConditionItemProps>
    group?: React.ComponentType<ConditionGroupProps>
  }

  /**
   * 条件配置
   */
  value?: ConditionsRoot
}

// ============= 工具类型 =============

/**
 * 字段类型与操作符的映射
 */
export type FieldOperatorMap = {
  [K in FieldType]: ComparisonOperator[]
}

/**
 * 操作符配置
 */
export interface OperatorConfig {
  description?: string
  label: string
  operator: ComparisonOperator
  secondValueRequired?: boolean
  supportedTypes: FieldType[]
  valueRequired: boolean
}

/**
 * 条件验证结果
 */
export interface ValidationResult {
  errors: ValidationError[]
  isValid: boolean
}

/**
 * 验证错误
 */
export interface ValidationError {
  field?: string
  message: string
  operator?: ComparisonOperator
  path: string[]
}

// ============= Hook 类型 =============

/**
 * useConditions Hook 返回类型
 */
export interface UseConditionsReturn {
  addCondition: (parentGroupId?: string, fieldKey?: string) => void
  addGroup: (parentGroupId?: string, logicalOperator?: LogicalOperator) => void
  clearAll: () => void
  conditions: ConditionsRoot
  deleteCondition: (conditionId: string) => void
  deleteGroup: (groupId: string) => void
  duplicateCondition: (conditionId: string) => void
  getConditionPath: (conditionId: string) => string[]
  getGroupPath: (groupId: string) => string[]
  updateCondition: (conditionId: string, updates: Partial<Condition>) => void
  updateGroup: (groupId: string, updates: Partial<ConditionGroupType>) => void
  validate: () => ValidationResult
}

/**
 * useFieldOperators Hook 返回类型
 */
export interface UseFieldOperatorsReturn {
  getOperatorConfig: (operator: ComparisonOperator) => OperatorConfig | undefined
  getOperatorsForField: (fieldKey: string) => ComparisonOperator[]
  isOperatorValidForField: (fieldKey: string, operator: ComparisonOperator) => boolean
}
