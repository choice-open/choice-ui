import React from "react"
import { Select } from "../../select"
import { ArrayLengthInput } from "../components/condition-items/array-length-input"
import { BooleanInput } from "../components/condition-items/boolean-input"
import {
  ConditionDateInput,
  ConditionDateRangeInput,
} from "../components/condition-items/date-input"
import { MultiSelectInput } from "../components/condition-items/multi-select-input"
import { NumberInput, NumberRangeInput } from "../components/condition-items/number-input"
import { RegexInput } from "../components/condition-items/regex-input"
import { SelectInput } from "../components/condition-items/select-input"
import { TagInput } from "../components/condition-items/tag-input"
import { TextInput } from "../components/condition-items/text-input"
import { UserInput } from "../components/condition-items/user-input"
import { ComparisonOperator, ConditionsFieldType, type Condition, type Field } from "../types"
import { OPERATOR_CONFIGS } from "./constants"

export interface OperatorGroup {
  label: string
  operators: ComparisonOperator[]
}

export function getOperatorGroups(availableOperators: ComparisonOperator[]): OperatorGroup[] {
  const groups: OperatorGroup[] = [
    {
      label: "General",
      operators: [
        ComparisonOperator.Equals,
        ComparisonOperator.NotEquals,
        ComparisonOperator.Exists,
        ComparisonOperator.DoesNotExist,
      ],
    },
    {
      label: "Text",
      operators: [
        ComparisonOperator.Contains,
        ComparisonOperator.NotContains,
        ComparisonOperator.StartsWith,
        ComparisonOperator.EndsWith,
        ComparisonOperator.MatchesRegex,
        ComparisonOperator.DoesNotMatchRegex,
      ],
    },
    {
      label: "Numbers & Comparison",
      operators: [
        ComparisonOperator.GreaterThan,
        ComparisonOperator.GreaterThanOrEqual,
        ComparisonOperator.LessThan,
        ComparisonOperator.LessThanOrEqual,
        ComparisonOperator.Between,
      ],
    },
    {
      label: "Arrays & Collections",
      operators: [
        ComparisonOperator.In,
        ComparisonOperator.NotIn,
        ComparisonOperator.IsEmpty,
        ComparisonOperator.IsNotEmpty,
        ComparisonOperator.LengthEquals,
        ComparisonOperator.LengthGreaterThan,
        ComparisonOperator.LengthLessThan,
        ComparisonOperator.LengthGreaterThanOrEqual,
        ComparisonOperator.LengthLessThanOrEqual,
      ],
    },
    {
      label: "Dates",
      operators: [
        ComparisonOperator.IsAfter,
        ComparisonOperator.IsBefore,
        ComparisonOperator.IsWithin,
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
    },
    {
      label: "Boolean",
      operators: [ComparisonOperator.IsTrue, ComparisonOperator.IsFalse],
    },
  ]

  // 只返回包含可用操作符的分组
  return groups
    .map((group) => ({
      ...group,
      operators: group.operators.filter((op) => availableOperators.includes(op)),
    }))
    .filter((group) => group.operators.length > 0)
}

export function renderGroupedOperators(operatorGroups: OperatorGroup[]): React.ReactNode[] {
  const elements: React.ReactNode[] = []

  operatorGroups.forEach((group, groupIndex) => {
    // 如果不是第一个分组，添加分割线
    if (groupIndex > 0) {
      elements.push(<Select.Divider key={`divider-${groupIndex}`} />)
    }

    // 添加分组标签（如果有多个分组）
    if (operatorGroups.length > 1) {
      elements.push(<Select.Label key={`label-${groupIndex}`}>{group.label}</Select.Label>)
    }

    // 添加该分组的操作符
    group.operators.forEach((operator) => {
      const config = OPERATOR_CONFIGS[operator]
      elements.push(
        <Select.Item
          key={operator}
          value={operator}
        >
          <Select.Value>{config?.label || operator}</Select.Value>
        </Select.Item>,
      )
    })
  })

  return elements
}

interface ValueInputProps {
  condition: Condition
  disabled?: boolean
  field: Field
  onChange: (value: unknown) => void
  onSecondValueChange?: (secondValue: unknown) => void
}

export function renderValueInput(props: ValueInputProps): React.ReactNode | null {
  const { condition, field, disabled, onChange } = props
  const commonProps = {
    condition,
    field,
    disabled,
    onChange,
  }

  // 特殊操作符处理
  if (
    condition.operator === ComparisonOperator.MatchesRegex ||
    condition.operator === ComparisonOperator.DoesNotMatchRegex
  ) {
    return <RegexInput {...commonProps} />
  }

  if (
    condition.operator === ComparisonOperator.LengthEquals ||
    condition.operator === ComparisonOperator.LengthGreaterThan ||
    condition.operator === ComparisonOperator.LengthLessThan ||
    condition.operator === ComparisonOperator.LengthGreaterThanOrEqual ||
    condition.operator === ComparisonOperator.LengthLessThanOrEqual
  ) {
    return <ArrayLengthInput {...commonProps} />
  }

  // 基于字段类型的处理
  switch (field.type) {
    case ConditionsFieldType.Text:
      return <TextInput {...commonProps} />

    case ConditionsFieldType.Number:
      return <NumberInput {...commonProps} />

    case ConditionsFieldType.Boolean:
      return <BooleanInput {...commonProps} />

    case ConditionsFieldType.Date:
    case ConditionsFieldType.DateTime:
      return <ConditionDateInput {...commonProps} />

    case ConditionsFieldType.Select:
      return <SelectInput {...commonProps} />

    case ConditionsFieldType.MultiSelect:
      return <MultiSelectInput {...commonProps} />

    case ConditionsFieldType.User:
      return <UserInput {...commonProps} />

    case ConditionsFieldType.Tag:
      return <TagInput {...commonProps} />

    default:
      return <TextInput {...commonProps} />
  }
}

export function renderSecondValueInput(props: ValueInputProps): React.ReactNode | null {
  const { condition, field, disabled, onChange, onSecondValueChange } = props

  if (!onSecondValueChange) {
    return null
  }

  const commonProps = {
    condition,
    field,
    disabled,
    onChange,
    onSecondValueChange,
  }

  switch (field.type) {
    case ConditionsFieldType.Number:
      return <NumberRangeInput {...commonProps} />

    case ConditionsFieldType.DateTime:
      return <ConditionDateRangeInput {...commonProps} />

    default:
      return null
  }
}
