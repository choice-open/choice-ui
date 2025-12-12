import { type MenuContextItemProps } from "@choice-ui/menus"
import { useEventCallback } from "usehooks-ts"

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
  // Handle selection - multi-select logic (supports exclusive options)
  const handleSelect = useEventCallback((index: number) => {
    const selectedOption = selectableOptions[index]
    if (!selectedOption) return

    const resultValue = selectedOption.value ?? ""
    const isSelected = values.includes(resultValue)
    const exclusiveIndex = (selectedOption.element?.props as MenuContextItemProps)?.exclusiveIndex

    let newValues: string[]

    if (isSelected) {
      // Remove option
      if (minSelection && values.length <= minSelection) {
        setValidationMessage(
          i18n?.minSelectionMessage?.(minSelection) || `Select at least ${minSelection} options`,
        )
        return // Cannot remove more
      }
      newValues = values.filter((v) => v !== resultValue)
    } else {
      // Add option
      if (maxSelection && values.length >= maxSelection) {
        setValidationMessage(
          i18n?.maxSelectionMessage?.(maxSelection) || `Select up to ${maxSelection} options`,
        )
        return // Cannot add more
      }

      // Handle exclusive logic
      if (exclusiveIndex === -1) {
        // Global exclusion: clear all other options after selection
        newValues = [resultValue]
      } else if (exclusiveIndex && exclusiveIndex > 0) {
        // Group exclusion: clear options from other groups, keep same group options
        const filteredValues = values.filter((value) => {
          const option = selectableOptions.find((opt) => opt.value === value)
          const valueExclusiveIndex = (option?.element?.props as MenuContextItemProps)
            ?.exclusiveIndex
          // Keep same group options and unconstrained options
          return valueExclusiveIndex === exclusiveIndex || valueExclusiveIndex === undefined
        })
        newValues = [...filteredValues, resultValue]
      } else {
        // No exclusive constraint: add normally
        // But need to check if global exclusive option is already selected
        const hasGlobalExclusive = values.some((value) => {
          const option = selectableOptions.find((opt) => opt.value === value)
          return (option?.element?.props as MenuContextItemProps)?.exclusiveIndex === -1
        })

        if (hasGlobalExclusive) {
          // If global exclusive option exists, clear and add current option
          newValues = [resultValue]
        } else {
          // Clear exclusive constrained options, keep unconstrained options
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

    // Clear validation message
    setValidationMessage(null)

    // Close menu based on closeOnSelect
    if (closeOnSelect) {
      handleOpenChange(false)
    }
  })

  // Handle remove option
  const handleRemove = useEventCallback((valueToRemove: string) => {
    const newValues = values.filter((v) => v !== valueToRemove)
    onChange?.(newValues)
  })

  return {
    handleSelect,
    handleRemove,
  }
}
