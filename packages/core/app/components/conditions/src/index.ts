// 主组件
export * from "./conditions"

// 枚举值（需要在运行时使用）
export {
  FieldType,
  LogicalOperator,
  ComparisonOperator,
  DateRangePreset,
  ConditionsFieldType,
} from "./types"

// 类型定义（但排除会冲突的组件类型）
export type {
  SelectOption,
  BaseField,
  TextFieldConfig,
  NumberFieldConfig,
  DateFieldConfig,
  BooleanFieldConfig,
  SelectFieldConfig,
  UserFieldConfig,
  TagFieldConfig,
  Field,
  ConditionsTextField,
  ConditionsNumberField,
  ConditionsDateField,
  ConditionsBooleanField,
  ConditionsSelectField,
  ConditionsUserField,
  ConditionsTagField,
  ConditionValue,
  RangeValue,
  Condition,
  ConditionGroupType,
  ConditionGroup,
  ConditionsRoot,
  ConditionItemProps,
  ConditionGroupProps,
  ConditionsProps,
  FieldOperatorMap,
  OperatorConfig,
  ValidationResult,
  ValidationError,
  UseConditionsReturn,
  UseFieldOperatorsReturn,
} from "./types"

// 工具函数
export * from "./utils"

// 组件（只导出特定组件以避免冲突）
export { ConditionGroup as ConditionsGroup } from "./components/condition-group"
export { ConditionItem } from "./components/condition-item"
export * from "./components/group-renderers"
export * from "./components/condition-items"

// Hooks
export * from "./hooks"
