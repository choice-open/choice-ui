import { useEventCallback } from "usehooks-ts"
import { type MenuContextItemProps } from "../../menus"

export interface UseMultiSelectSelectionProps {
  closeOnSelect?: boolean
  handleOpenChange: (open: boolean) => void
  i18n?: {
    maxSelectionMessage?: (maxSelection: number) => string
    minSelectionMessage?: (minSelection: number) => string
  }
  maxSelection?: number
  minSelection?: number
  onChange?: (values: string[]) => void
  selectableOptions: Array<{
    disabled?: boolean
    element?: React.ReactElement
    value?: string
  }>
  setValidationMessage: (message: string | null) => void
  values: string[]
}

export function useMultiSelectSelection({
  values,
  onChange,
  selectableOptions,
  maxSelection,
  minSelection,
  closeOnSelect,
  i18n,
  setValidationMessage,
  handleOpenChange,
}: UseMultiSelectSelectionProps) {
  // 处理选择 - 多选逻辑（支持排他选项）
  const handleSelect = useEventCallback((index: number) => {
    const selectedOption = selectableOptions[index]
    if (!selectedOption) return

    const resultValue = selectedOption.value ?? ""
    const isSelected = values.includes(resultValue)
    const exclusiveIndex = (selectedOption.element?.props as MenuContextItemProps)?.exclusiveIndex

    let newValues: string[]

    if (isSelected) {
      // 移除选项
      if (minSelection && values.length <= minSelection) {
        setValidationMessage(
          i18n?.minSelectionMessage?.(minSelection) || `Select at least ${minSelection} options`,
        )
        return // 不能再移除了
      }
      newValues = values.filter((v) => v !== resultValue)
    } else {
      // 添加选项
      if (maxSelection && values.length >= maxSelection) {
        setValidationMessage(
          i18n?.maxSelectionMessage?.(maxSelection) || `Select up to ${maxSelection} options`,
        )
        return // 不能再添加了
      }

      // 处理排他逻辑
      if (exclusiveIndex === -1) {
        // 全局互斥：选择后清空所有其他选项
        newValues = [resultValue]
      } else if (exclusiveIndex && exclusiveIndex > 0) {
        // 组间互斥：清空其他组的选项，保留同组选项
        const filteredValues = values.filter((value) => {
          const option = selectableOptions.find((opt) => opt.value === value)
          const valueExclusiveIndex = (option?.element?.props as MenuContextItemProps)
            ?.exclusiveIndex
          // 保留同组选项和无约束选项
          return valueExclusiveIndex === exclusiveIndex || valueExclusiveIndex === undefined
        })
        newValues = [...filteredValues, resultValue]
      } else {
        // 无排他约束：正常添加
        // 但需要检查是否有全局互斥选项已选中
        const hasGlobalExclusive = values.some((value) => {
          const option = selectableOptions.find((opt) => opt.value === value)
          return (option?.element?.props as MenuContextItemProps)?.exclusiveIndex === -1
        })

        if (hasGlobalExclusive) {
          // 如果已有全局互斥选项，清空后添加当前选项
          newValues = [resultValue]
        } else {
          // 清空有排他约束的选项，保留无约束选项
          const filteredValues = values.filter((value) => {
            const option = selectableOptions.find((opt) => opt.value === value)
            const valueExclusiveIndex = (option?.element?.props as MenuContextItemProps)
              ?.exclusiveIndex
            return valueExclusiveIndex === undefined
          })
          newValues = [...filteredValues, resultValue]
        }
      }
    }

    onChange?.(newValues)

    // 清空验证消息
    setValidationMessage(null)

    // 根据 closeOnSelect 决定是否关闭菜单
    if (closeOnSelect) {
      handleOpenChange(false)
    }
  })

  // 处理移除选项
  const handleRemove = useEventCallback((valueToRemove: string) => {
    const newValues = values.filter((v) => v !== valueToRemove)
    onChange?.(newValues)
  })

  return {
    handleSelect,
    handleRemove,
  }
}
