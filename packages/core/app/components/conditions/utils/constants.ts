import {
  ConditionsFieldType,
  ComparisonOperator,
  FieldOperatorMap,
  OperatorConfig,
  LogicalOperator,
} from "../types"

// ============= 操作符配置 =============

/**
 * 操作符配置映射
 */
export const OPERATOR_CONFIGS: Record<ComparisonOperator, OperatorConfig> = {
  // 通用操作符
  [ComparisonOperator.Equals]: {
    operator: ComparisonOperator.Equals,
    label: "Is",
    valueRequired: true,
    supportedTypes: [
      ConditionsFieldType.Text,
      ConditionsFieldType.Number,
      ConditionsFieldType.Date,
      ConditionsFieldType.DateTime,
      ConditionsFieldType.Boolean,
      ConditionsFieldType.Select,
      ConditionsFieldType.User,
      ConditionsFieldType.Tag,
    ],
  },

  [ComparisonOperator.NotEquals]: {
    operator: ComparisonOperator.NotEquals,
    label: "Is not",
    valueRequired: true,
    supportedTypes: [
      ConditionsFieldType.Text,
      ConditionsFieldType.Number,
      ConditionsFieldType.Date,
      ConditionsFieldType.DateTime,
      ConditionsFieldType.Boolean,
      ConditionsFieldType.Select,
      ConditionsFieldType.User,
      ConditionsFieldType.Tag,
    ],
  },

  [ComparisonOperator.IsEmpty]: {
    operator: ComparisonOperator.IsEmpty,
    label: "Is empty",
    valueRequired: false,
    supportedTypes: [
      ConditionsFieldType.Text,
      ConditionsFieldType.MultiSelect,
      ConditionsFieldType.User,
      ConditionsFieldType.Tag,
    ],
  },

  [ComparisonOperator.IsNotEmpty]: {
    operator: ComparisonOperator.IsNotEmpty,
    label: "Is not empty",
    valueRequired: false,
    supportedTypes: [
      ConditionsFieldType.Text,
      ConditionsFieldType.MultiSelect,
      ConditionsFieldType.User,
      ConditionsFieldType.Tag,
    ],
  },

  // 文本操作符
  [ComparisonOperator.Contains]: {
    operator: ComparisonOperator.Contains,
    label: "Contains",
    valueRequired: true,
    supportedTypes: [ConditionsFieldType.Text],
  },

  [ComparisonOperator.NotContains]: {
    operator: ComparisonOperator.NotContains,
    label: "Does not contain",
    valueRequired: true,
    supportedTypes: [ConditionsFieldType.Text],
  },

  [ComparisonOperator.StartsWith]: {
    operator: ComparisonOperator.StartsWith,
    label: "Starts with",
    valueRequired: true,
    supportedTypes: [ConditionsFieldType.Text],
  },

  [ComparisonOperator.EndsWith]: {
    operator: ComparisonOperator.EndsWith,
    label: "Ends with",
    valueRequired: true,
    supportedTypes: [ConditionsFieldType.Text],
  },

  // 数字/日期操作符
  [ComparisonOperator.GreaterThan]: {
    operator: ComparisonOperator.GreaterThan,
    label: "Greater than",
    valueRequired: true,
    supportedTypes: [
      ConditionsFieldType.Number,
      ConditionsFieldType.Date,
      ConditionsFieldType.DateTime,
    ],
  },

  [ComparisonOperator.GreaterThanOrEqual]: {
    operator: ComparisonOperator.GreaterThanOrEqual,
    label: "Greater than or equal",
    valueRequired: true,
    supportedTypes: [
      ConditionsFieldType.Number,
      ConditionsFieldType.Date,
      ConditionsFieldType.DateTime,
    ],
  },

  [ComparisonOperator.LessThan]: {
    operator: ComparisonOperator.LessThan,
    label: "Less than",
    valueRequired: true,
    supportedTypes: [
      ConditionsFieldType.Number,
      ConditionsFieldType.Date,
      ConditionsFieldType.DateTime,
    ],
  },

  [ComparisonOperator.LessThanOrEqual]: {
    operator: ComparisonOperator.LessThanOrEqual,
    label: "Less than or equal",
    valueRequired: true,
    supportedTypes: [
      ConditionsFieldType.Number,
      ConditionsFieldType.Date,
      ConditionsFieldType.DateTime,
    ],
  },

  [ComparisonOperator.Between]: {
    operator: ComparisonOperator.Between,
    label: "Is between",
    valueRequired: true,
    secondValueRequired: true,
    supportedTypes: [
      ConditionsFieldType.Number,
      ConditionsFieldType.Date,
      ConditionsFieldType.DateTime,
    ],
  },

  // 数组操作符
  [ComparisonOperator.In]: {
    operator: ComparisonOperator.In,
    label: "Is any of",
    valueRequired: true,
    supportedTypes: [
      ConditionsFieldType.Select,
      ConditionsFieldType.MultiSelect,
      ConditionsFieldType.User,
      ConditionsFieldType.Tag,
    ],
  },

  [ComparisonOperator.NotIn]: {
    operator: ComparisonOperator.NotIn,
    label: "Is not any of",
    valueRequired: true,
    supportedTypes: [
      ConditionsFieldType.Select,
      ConditionsFieldType.MultiSelect,
      ConditionsFieldType.User,
      ConditionsFieldType.Tag,
    ],
  },

  // 日期特定操作符
  [ComparisonOperator.IsWithin]: {
    operator: ComparisonOperator.IsWithin,
    label: "Is within",
    valueRequired: true,
    supportedTypes: [ConditionsFieldType.Date, ConditionsFieldType.DateTime],
  },

  [ComparisonOperator.IsBefore]: {
    operator: ComparisonOperator.IsBefore,
    label: "Is before",
    valueRequired: true,
    supportedTypes: [ConditionsFieldType.Date, ConditionsFieldType.DateTime],
  },

  [ComparisonOperator.IsAfter]: {
    operator: ComparisonOperator.IsAfter,
    label: "Is after",
    valueRequired: true,
    supportedTypes: [ConditionsFieldType.Date, ConditionsFieldType.DateTime],
  },

  [ComparisonOperator.IsToday]: {
    operator: ComparisonOperator.IsToday,
    label: "Is today",
    valueRequired: false,
    supportedTypes: [ConditionsFieldType.Date, ConditionsFieldType.DateTime],
  },

  [ComparisonOperator.IsYesterday]: {
    operator: ComparisonOperator.IsYesterday,
    label: "Is yesterday",
    valueRequired: false,
    supportedTypes: [ConditionsFieldType.Date, ConditionsFieldType.DateTime],
  },

  [ComparisonOperator.IsTomorrow]: {
    operator: ComparisonOperator.IsTomorrow,
    label: "Is tomorrow",
    valueRequired: false,
    supportedTypes: [ConditionsFieldType.Date, ConditionsFieldType.DateTime],
  },

  [ComparisonOperator.IsThisWeek]: {
    operator: ComparisonOperator.IsThisWeek,
    label: "Is this week",
    valueRequired: false,
    supportedTypes: [ConditionsFieldType.Date, ConditionsFieldType.DateTime],
  },

  [ComparisonOperator.IsLastWeek]: {
    operator: ComparisonOperator.IsLastWeek,
    label: "Is last week",
    valueRequired: false,
    supportedTypes: [ConditionsFieldType.Date, ConditionsFieldType.DateTime],
  },

  [ComparisonOperator.IsNextWeek]: {
    operator: ComparisonOperator.IsNextWeek,
    label: "Is next week",
    valueRequired: false,
    supportedTypes: [ConditionsFieldType.Date, ConditionsFieldType.DateTime],
  },

  [ComparisonOperator.IsThisMonth]: {
    operator: ComparisonOperator.IsThisMonth,
    label: "Is this month",
    valueRequired: false,
    supportedTypes: [ConditionsFieldType.Date, ConditionsFieldType.DateTime],
  },

  [ComparisonOperator.IsLastMonth]: {
    operator: ComparisonOperator.IsLastMonth,
    label: "Is last month",
    valueRequired: false,
    supportedTypes: [ConditionsFieldType.Date, ConditionsFieldType.DateTime],
  },

  [ComparisonOperator.IsNextMonth]: {
    operator: ComparisonOperator.IsNextMonth,
    label: "Is next month",
    valueRequired: false,
    supportedTypes: [ConditionsFieldType.Date, ConditionsFieldType.DateTime],
  },

  // 新增操作符 - 存在性检查
  [ComparisonOperator.Exists]: {
    operator: ComparisonOperator.Exists,
    label: "Exists",
    valueRequired: false,
    supportedTypes: [
      ConditionsFieldType.Text,
      ConditionsFieldType.Number,
      ConditionsFieldType.Boolean,
      ConditionsFieldType.Date,
      ConditionsFieldType.DateTime,
      ConditionsFieldType.Select,
      ConditionsFieldType.MultiSelect,
      ConditionsFieldType.User,
      ConditionsFieldType.Tag,
    ],
  },

  [ComparisonOperator.DoesNotExist]: {
    operator: ComparisonOperator.DoesNotExist,
    label: "Does not exist",
    valueRequired: false,
    supportedTypes: [
      ConditionsFieldType.Text,
      ConditionsFieldType.Number,
      ConditionsFieldType.Boolean,
      ConditionsFieldType.Date,
      ConditionsFieldType.DateTime,
      ConditionsFieldType.Select,
      ConditionsFieldType.MultiSelect,
      ConditionsFieldType.User,
      ConditionsFieldType.Tag,
    ],
  },

  // 正则表达式操作符
  [ComparisonOperator.MatchesRegex]: {
    operator: ComparisonOperator.MatchesRegex,
    label: "Matches regex",
    valueRequired: true,
    supportedTypes: [ConditionsFieldType.Text],
  },

  [ComparisonOperator.DoesNotMatchRegex]: {
    operator: ComparisonOperator.DoesNotMatchRegex,
    label: "Does not match regex",
    valueRequired: true,
    supportedTypes: [ConditionsFieldType.Text],
  },

  // 数组长度操作符
  [ComparisonOperator.LengthEquals]: {
    operator: ComparisonOperator.LengthEquals,
    label: "Length equals",
    valueRequired: true,
    supportedTypes: [
      ConditionsFieldType.Text,
      ConditionsFieldType.MultiSelect,
      ConditionsFieldType.User,
      ConditionsFieldType.Tag,
    ],
  },

  [ComparisonOperator.LengthGreaterThan]: {
    operator: ComparisonOperator.LengthGreaterThan,
    label: "Length greater than",
    valueRequired: true,
    supportedTypes: [
      ConditionsFieldType.Text,
      ConditionsFieldType.MultiSelect,
      ConditionsFieldType.User,
      ConditionsFieldType.Tag,
    ],
  },

  [ComparisonOperator.LengthLessThan]: {
    operator: ComparisonOperator.LengthLessThan,
    label: "Length less than",
    valueRequired: true,
    supportedTypes: [
      ConditionsFieldType.Text,
      ConditionsFieldType.MultiSelect,
      ConditionsFieldType.User,
      ConditionsFieldType.Tag,
    ],
  },

  [ComparisonOperator.LengthGreaterThanOrEqual]: {
    operator: ComparisonOperator.LengthGreaterThanOrEqual,
    label: "Length greater than or equal",
    valueRequired: true,
    supportedTypes: [
      ConditionsFieldType.Text,
      ConditionsFieldType.MultiSelect,
      ConditionsFieldType.User,
      ConditionsFieldType.Tag,
    ],
  },

  [ComparisonOperator.LengthLessThanOrEqual]: {
    operator: ComparisonOperator.LengthLessThanOrEqual,
    label: "Length less than or equal",
    valueRequired: true,
    supportedTypes: [
      ConditionsFieldType.Text,
      ConditionsFieldType.MultiSelect,
      ConditionsFieldType.User,
      ConditionsFieldType.Tag,
    ],
  },

  // 布尔操作符（简化版）
  [ComparisonOperator.IsTrue]: {
    operator: ComparisonOperator.IsTrue,
    label: "Is true",
    valueRequired: false,
    supportedTypes: [ConditionsFieldType.Boolean],
  },

  [ComparisonOperator.IsFalse]: {
    operator: ComparisonOperator.IsFalse,
    label: "Is false",
    valueRequired: false,
    supportedTypes: [ConditionsFieldType.Boolean],
  },
}

// ============= 字段类型与操作符映射 =============

/**
 * 字段类型支持的操作符映射
 */
export const FIELD_OPERATOR_MAP: FieldOperatorMap = {
  [ConditionsFieldType.Text]: [
    ComparisonOperator.Equals,
    ComparisonOperator.NotEquals,
    ComparisonOperator.Contains,
    ComparisonOperator.NotContains,
    ComparisonOperator.StartsWith,
    ComparisonOperator.EndsWith,
    ComparisonOperator.IsEmpty,
    ComparisonOperator.IsNotEmpty,
    ComparisonOperator.Exists,
    ComparisonOperator.DoesNotExist,
    ComparisonOperator.MatchesRegex,
    ComparisonOperator.DoesNotMatchRegex,
    ComparisonOperator.LengthEquals,
    ComparisonOperator.LengthGreaterThan,
    ComparisonOperator.LengthLessThan,
    ComparisonOperator.LengthGreaterThanOrEqual,
    ComparisonOperator.LengthLessThanOrEqual,
  ],

  [ConditionsFieldType.Number]: [
    ComparisonOperator.Equals,
    ComparisonOperator.NotEquals,
    ComparisonOperator.GreaterThan,
    ComparisonOperator.GreaterThanOrEqual,
    ComparisonOperator.LessThan,
    ComparisonOperator.LessThanOrEqual,
    ComparisonOperator.Between,
    ComparisonOperator.Exists,
    ComparisonOperator.DoesNotExist,
  ],

  [ConditionsFieldType.Date]: [
    ComparisonOperator.Equals,
    ComparisonOperator.NotEquals,
    ComparisonOperator.GreaterThan,
    ComparisonOperator.GreaterThanOrEqual,
    ComparisonOperator.LessThan,
    ComparisonOperator.LessThanOrEqual,
    ComparisonOperator.Between,
    ComparisonOperator.IsWithin,
    ComparisonOperator.IsBefore,
    ComparisonOperator.IsAfter,
    ComparisonOperator.IsToday,
    ComparisonOperator.IsYesterday,
    ComparisonOperator.IsTomorrow,
    ComparisonOperator.IsThisWeek,
    ComparisonOperator.IsLastWeek,
    ComparisonOperator.IsNextWeek,
    ComparisonOperator.IsThisMonth,
    ComparisonOperator.IsLastMonth,
    ComparisonOperator.IsNextMonth,
  ],

  [ConditionsFieldType.DateTime]: [
    ComparisonOperator.Equals,
    ComparisonOperator.NotEquals,
    ComparisonOperator.GreaterThan,
    ComparisonOperator.GreaterThanOrEqual,
    ComparisonOperator.LessThan,
    ComparisonOperator.LessThanOrEqual,
    ComparisonOperator.Between,
    ComparisonOperator.IsWithin,
    ComparisonOperator.IsBefore,
    ComparisonOperator.IsAfter,
    ComparisonOperator.IsToday,
    ComparisonOperator.IsYesterday,
    ComparisonOperator.IsTomorrow,
    ComparisonOperator.IsThisWeek,
    ComparisonOperator.IsLastWeek,
    ComparisonOperator.IsNextWeek,
    ComparisonOperator.IsThisMonth,
    ComparisonOperator.IsLastMonth,
    ComparisonOperator.IsNextMonth,
  ],

  [ConditionsFieldType.Boolean]: [
    ComparisonOperator.Equals,
    ComparisonOperator.NotEquals,
    ComparisonOperator.IsTrue,
    ComparisonOperator.IsFalse,
    ComparisonOperator.Exists,
    ComparisonOperator.DoesNotExist,
  ],

  [ConditionsFieldType.Select]: [
    ComparisonOperator.Equals,
    ComparisonOperator.NotEquals,
    ComparisonOperator.In,
    ComparisonOperator.NotIn,
  ],

  [ConditionsFieldType.MultiSelect]: [
    ComparisonOperator.In,
    ComparisonOperator.NotIn,
    ComparisonOperator.IsEmpty,
    ComparisonOperator.IsNotEmpty,
    ComparisonOperator.Exists,
    ComparisonOperator.DoesNotExist,
    ComparisonOperator.LengthEquals,
    ComparisonOperator.LengthGreaterThan,
    ComparisonOperator.LengthLessThan,
    ComparisonOperator.LengthGreaterThanOrEqual,
    ComparisonOperator.LengthLessThanOrEqual,
  ],

  [ConditionsFieldType.User]: [
    ComparisonOperator.Equals,
    ComparisonOperator.NotEquals,
    ComparisonOperator.In,
    ComparisonOperator.NotIn,
    ComparisonOperator.IsEmpty,
    ComparisonOperator.IsNotEmpty,
  ],

  [ConditionsFieldType.Tag]: [
    ComparisonOperator.Equals,
    ComparisonOperator.NotEquals,
    ComparisonOperator.In,
    ComparisonOperator.NotIn,
    ComparisonOperator.IsEmpty,
    ComparisonOperator.IsNotEmpty,
  ],
}

// ============= 默认本地化文本 =============

/**
 * 默认本地化文本
 */
export const DEFAULT_LOCALIZATION = {
  // 基础操作
  addCondition: "Add a filter",
  addGroup: "Add group",
  deleteCondition: "Delete condition",
  deleteGroup: "Delete group",
  duplicateCondition: "Duplicate condition",

  // 逻辑连接符
  where: "Where",
  and: "And",
  or: "Or",

  // 操作符标签
  is: "Is",
  isNot: "Is not",
  contains: "Contains",
  doesNotContain: "Does not contain",
  startsWith: "Starts with",
  endsWith: "Ends with",
  isEmpty: "Is empty",
  isNotEmpty: "Is not empty",
  greaterThan: "Greater than",
  greaterThanOrEqual: "Greater than or equal",
  lessThan: "Less than",
  lessThanOrEqual: "Less than or equal",
  isBetween: "Is between",
  isAnyOf: "Is any of",
  isNotAnyOf: "Is not any of",
  isWithin: "Is within",
  isBefore: "Is before",
  isAfter: "Is after",
  isToday: "Is today",
  isYesterday: "Is yesterday",
  isTomorrow: "Is tomorrow",
  isThisWeek: "Is this week",
  isLastWeek: "Is last week",
  isNextWeek: "Is next week",
  isThisMonth: "Is this month",
  isLastMonth: "Is last month",
  isNextMonth: "Is next month",

  // 占位符文本
  selectField: "Select field...",
  selectOperator: "Select operator...",
  enterValue: "Enter value...",
  selectValue: "Select value...",
  selectDate: "Select date...",

  // 日期范围预设
  today: "Today",
  yesterday: "Yesterday",
  tomorrow: "Tomorrow",
  thisWeek: "This week",
  lastWeek: "Last week",
  nextWeek: "Next week",
  thisMonth: "This month",
  lastMonth: "Last month",
  nextMonth: "Next month",
  last7Days: "Last 7 days",
  last30Days: "Last 30 days",
  last90Days: "Last 90 days",

  // 布尔值
  true: "True",
  false: "False",

  // 验证消息
  fieldRequired: "Field is required",
  operatorRequired: "Operator is required",
  valueRequired: "Value is required",
  invalidValue: "Invalid value",
  invalidOperator: "Invalid operator for this field type",

  // 按钮文本
  apply: "Apply",
  cancel: "Cancel",
  clear: "Clear",
  reset: "Reset",
}

// ============= 默认配置 =============

/**
 * 默认的逻辑操作符
 */
export const DEFAULT_LOGICAL_OPERATOR = LogicalOperator.And

/**
 * 默认的比较操作符
 */
export const DEFAULT_COMPARISON_OPERATOR = ComparisonOperator.Equals

/**
 * 默认最大嵌套深度
 */
export const DEFAULT_MAX_DEPTH = 2

/**
 * 生成唯一ID的前缀
 */
export const ID_PREFIXES = {
  condition: "condition_",
  group: "group_",
  root: "root_",
} as const
