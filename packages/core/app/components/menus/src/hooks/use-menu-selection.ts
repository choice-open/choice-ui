import { useState, useMemo, useEffect } from "react"
import { useEventCallback } from "usehooks-ts"

/**
 * Menu selection state management Hook
 *
 * Specialized for Select component selection logic:
 * - Manage the mapping of selected index and value
 * - Handle selection delay and blocking mechanism
 * - Handle mouse and keyboard selection
 * - Support controlled and uncontrolled values
 */

export interface MenuSelectionConfig {
  /** Close menu callback */
  handleOpenChange: (open: boolean) => void
  /** Whether to control the open state */
  isControlledOpen: boolean
  /** Value change callback */
  onChange?: (value: string) => void
  /** Option list */
  options: Array<{
    [key: string]: unknown
    disabled?: boolean
    divider?: boolean
    value?: string
  }>
  /** Current value */
  value?: string | null
}

export interface MenuSelectionResult {
  /** Allow mouse up state */
  allowMouseUp: boolean
  /** Allow select state */
  allowSelect: boolean
  /** Block select state */
  blockSelection: boolean
  /** Current selected index (based on value calculation) */
  currentSelectedIndex: number
  /** Handle selection */
  handleSelect: (index: number) => void
  /** Current selected index */
  selectedIndex: number
  /** Set allow mouse up state */
  setAllowMouseUp: (allow: boolean) => void
  /** Set allow select state */
  setAllowSelect: (allow: boolean) => void
  /** Set block select state */
  setBlockSelection: (block: boolean) => void
  /** Set selected index */
  setSelectedIndex: (index: number) => void
}

export function useMenuSelection(config: MenuSelectionConfig): MenuSelectionResult {
  const { value, onChange, options, isControlledOpen, handleOpenChange } = config

  // Selection state
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [blockSelection, setBlockSelection] = useState(false)
  const [allowSelect, setAllowSelect] = useState(false)
  const [allowMouseUp, setAllowMouseUp] = useState(true)

  // Determine current selected index - based on value calculation
  const currentSelectedIndex = useMemo(() => {
    if (value === undefined) return selectedIndex

    // If there is a value, find the corresponding index
    const index = options.findIndex((option) => !option.divider && option.value === value)
    return index === -1 ? selectedIndex : index
  }, [value, selectedIndex, options])

  // Selection handling when menu is opened
  useEffect(() => {
    if (isControlledOpen) {
      const timeout = setTimeout(() => {
        setAllowSelect(true)
      }, 300)

      return () => {
        clearTimeout(timeout)
      }
    } else {
      setAllowSelect(false)
      setAllowMouseUp(true)
    }
  }, [isControlledOpen])

  // Handle selection logic
  const handleSelect = useEventCallback((index: number) => {
    // Check if selection is allowed
    if (allowSelect) {
      setSelectedIndex(index)
      handleOpenChange(false)

      const selectedOption = options[index]
      if (selectedOption && !selectedOption.divider) {
        const resultValue = selectedOption.value ?? ""

        if (resultValue !== value) {
          onChange?.(resultValue)
        }
      }
    }
  })

  return {
    selectedIndex,
    currentSelectedIndex,
    blockSelection,
    allowSelect,
    allowMouseUp,
    setSelectedIndex,
    setBlockSelection,
    setAllowSelect,
    setAllowMouseUp,
    handleSelect,
  }
}
