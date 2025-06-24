import { CopySmall, EllipsisSmall, GripVerticalSmall, Trash } from "@choiceform/icons-react"
import { useCallback, useMemo, useRef, useState } from "react"
import { tcx } from "~/utils"
import { Dropdown } from "../../dropdown"
import { IconButton } from "../../icon-button"
import { Select } from "../../select"
import { getDefaultValueForField, useFieldOperators } from "../hooks"
import { ComparisonOperator, type ConditionItemProps } from "../types"
import {
  getOperatorGroups,
  OPERATOR_CONFIGS,
  renderGroupedOperators,
  renderSecondValueInput,
  renderValueInput,
} from "../utils"

export function ConditionItem({
  condition,
  fields,
  onUpdate,
  onDelete,
  onDuplicate,
  disabled = false,
  className = "",
  level = 0,
  // 拖拽相关props
  onDragStart,
  onDragEnd,
}: ConditionItemProps & {
  level?: number
  onDragEnd?: (e: React.DragEvent) => void
  onDragStart?: (e: React.DragEvent) => void
}) {
  const { getOperatorsForField, getOperatorConfig } = useFieldOperators(fields)
  const conditionRef = useRef<HTMLDivElement>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // 获取当前选中的字段
  const selectedField = useMemo(
    () => fields.find((field) => field.key === condition.fieldKey),
    [fields, condition.fieldKey],
  )

  // 获取可用的操作符
  const availableOperators = useMemo(() => {
    if (!condition.fieldKey) return []
    return getOperatorsForField(condition.fieldKey)
  }, [condition.fieldKey, getOperatorsForField])

  // 操作符分组配置
  const operatorGroups = useMemo(() => getOperatorGroups(availableOperators), [availableOperators])

  // 获取操作符配置
  const operatorConfig = useMemo(
    () => getOperatorConfig(condition.operator),
    [condition.operator, getOperatorConfig],
  )

  // 处理字段变更
  const handleFieldChange = (fieldKey: string) => {
    const field = fields.find((f) => f.key === fieldKey)
    if (!field) return

    const newOperators = getOperatorsForField(fieldKey)
    const newOperator = newOperators.includes(condition.operator)
      ? condition.operator
      : newOperators[0] || ComparisonOperator.Equals

    onUpdate({
      ...condition,
      fieldKey,
      operator: newOperator,
      value: getDefaultValueForField(field),
      secondValue: undefined,
    })
  }

  // 处理操作符变更
  const handleOperatorChange = useCallback(
    (operator: ComparisonOperator) => {
      const config = getOperatorConfig(operator)

      onUpdate({
        ...condition,
        operator,
        value: config?.valueRequired ? condition.value : null,
        secondValue: config?.secondValueRequired ? condition.secondValue : undefined,
      })
    },
    [condition, getOperatorConfig, onUpdate],
  )

  // 处理值变更
  const handleValueChange = useCallback(
    (value: unknown) => {
      onUpdate({
        ...condition,
        value,
      })
    },
    [condition, onUpdate],
  )

  // 处理第二个值变更（用于范围操作符）
  const handleSecondValueChange = useCallback(
    (secondValue: unknown) => {
      onUpdate({
        ...condition,
        secondValue,
      })
    },
    [condition, onUpdate],
  )

  // 处理拖拽开始，设置自定义拖拽预览
  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      // 调用原始的拖拽开始事件
      onDragStart?.(e)

      // 设置自定义拖拽预览
      if (conditionRef.current) {
        // 创建拖拽预览元素
        const dragPreview = conditionRef.current.cloneNode(true) as HTMLElement
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
    [onDragStart],
  )

  // 使用工具函数渲染值输入
  const valueInputElement = useMemo(() => {
    if (!selectedField || !operatorConfig?.valueRequired) {
      return null
    }

    return renderValueInput({
      condition,
      field: selectedField,
      disabled,
      onChange: handleValueChange,
    })
  }, [selectedField, operatorConfig?.valueRequired, condition, disabled, handleValueChange])

  // 使用工具函数渲染第二个值输入
  const secondValueInputElement = useMemo(() => {
    if (!selectedField || !operatorConfig?.secondValueRequired) {
      return null
    }

    return renderSecondValueInput({
      condition,
      field: selectedField,
      disabled,
      onChange: handleValueChange,
      onSecondValueChange: handleSecondValueChange,
    })
  }, [
    selectedField,
    operatorConfig?.secondValueRequired,
    condition,
    disabled,
    handleValueChange,
    handleSecondValueChange,
  ])

  return (
    <div
      ref={conditionRef}
      className={tcx(
        "group/condition-item",
        "bg-default-background flex items-center gap-2 border p-2",
        // 判断在组内：level > 0 表示在嵌套组中
        level > 0 ? "col-span-2 rounded-md" : "rounded-lg",
        className,
      )}
    >
      {/* 拖拽手柄 */}
      <IconButton
        className="-mx-2 cursor-move"
        draggable={!disabled}
        onDragStart={handleDragStart}
        onDragEnd={onDragEnd}
        variant="ghost"
      >
        <GripVerticalSmall />
      </IconButton>

      {/* 字段选择 */}
      <Select
        value={condition.fieldKey || ""}
        onChange={(value) => handleFieldChange(value)}
        disabled={disabled}
      >
        <Select.Trigger>
          <Select.Value>
            {fields.find((f) => f.key === condition.fieldKey)?.label || "Select field..."}
          </Select.Value>
        </Select.Trigger>
        <Select.Content>
          {fields.map((field) => (
            <Select.Item
              key={field.key}
              value={field.key}
            >
              <Select.Value>{field.label}</Select.Value>
            </Select.Item>
          ))}
        </Select.Content>
      </Select>

      {/* 操作符选择 */}

      <Select
        value={condition.operator || ""}
        onChange={(value) => handleOperatorChange(value as ComparisonOperator)}
        disabled={disabled || !condition.fieldKey}
      >
        <Select.Trigger>
          <Select.Value>
            {OPERATOR_CONFIGS[condition.operator]?.label || "Select operator..."}
          </Select.Value>
        </Select.Trigger>
        <Select.Content>{renderGroupedOperators(operatorGroups)}</Select.Content>
      </Select>

      {/* 值输入 */}
      {operatorConfig?.valueRequired && valueInputElement}

      {/* 范围操作符的第二个值 */}
      {operatorConfig?.secondValueRequired && (
        <>
          <span className="text-secondary-foreground">and</span>
          {secondValueInputElement}
        </>
      )}

      {/* 操作按钮 Dropdown */}
      <div
        className={tcx(
          "ml-auto",
          isMenuOpen ? "opacity-100" : "opacity-0 group-hover/condition-item:opacity-100",
        )}
      >
        <Dropdown
          open={isMenuOpen}
          onOpenChange={setIsMenuOpen}
        >
          <Dropdown.Trigger asChild>
            <IconButton
              disabled={disabled}
              aria-label="More actions"
            >
              <EllipsisSmall />
            </IconButton>
          </Dropdown.Trigger>
          <Dropdown.Content>
            {onDuplicate && (
              <Dropdown.Item onMouseUp={onDuplicate}>
                <CopySmall />
                Duplicate
              </Dropdown.Item>
            )}
            <Dropdown.Item
              onMouseUp={onDelete}
              variant="danger"
            >
              <Trash />
              Delete
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>
      </div>
    </div>
  )
}
