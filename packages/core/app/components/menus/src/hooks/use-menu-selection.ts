import { useState, useMemo, useEffect } from "react"
import { useEventCallback } from "usehooks-ts"

/**
 * 菜单选择状态管理 Hook
 *
 * 专用于 Select 组件的选择逻辑：
 * - 管理选中索引和值的映射
 * - 处理选择延迟和阻止机制
 * - 处理鼠标和键盘选择
 * - 支持受控和非受控值
 */

export interface MenuSelectionConfig {
  /** 关闭菜单回调 */
  handleOpenChange: (open: boolean) => void
  /** 是否控制打开状态 */
  isControlledOpen: boolean
  /** 值变化回调 */
  onChange?: (value: string) => void
  /** 选项列表 */
  options: Array<{
    [key: string]: unknown
    disabled?: boolean
    divider?: boolean
    value?: string
  }>
  /** 当前值 */
  value?: string | null
}

export interface MenuSelectionResult {
  /** 允许鼠标抬起状态 */
  allowMouseUp: boolean
  /** 允许选择状态 */
  allowSelect: boolean
  /** 阻止选择状态 */
  blockSelection: boolean
  /** 当前选中索引（基于 value 计算） */
  currentSelectedIndex: number
  /** 处理选择 */
  handleSelect: (index: number) => void
  /** 当前选中索引 */
  selectedIndex: number
  /** 设置允许鼠标抬起状态 */
  setAllowMouseUp: (allow: boolean) => void
  /** 设置允许选择状态 */
  setAllowSelect: (allow: boolean) => void
  /** 设置阻止选择状态 */
  setBlockSelection: (block: boolean) => void
  /** 设置选中索引 */
  setSelectedIndex: (index: number) => void
}

export function useMenuSelection(config: MenuSelectionConfig): MenuSelectionResult {
  const { value, onChange, options, isControlledOpen, handleOpenChange } = config

  // 选择状态
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [blockSelection, setBlockSelection] = useState(false)
  const [allowSelect, setAllowSelect] = useState(false)
  const [allowMouseUp, setAllowMouseUp] = useState(true)

  // 确定当前选中索引 - 基于 value 计算
  const currentSelectedIndex = useMemo(() => {
    if (value === undefined) return selectedIndex

    // 如果有值，找到对应的索引
    const index = options.findIndex((option) => !option.divider && option.value === value)
    return index === -1 ? selectedIndex : index
  }, [value, selectedIndex, options])

  // 菜单打开时的选择处理
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

  // 处理选择逻辑
  const handleSelect = useEventCallback((index: number) => {
    // 检查是否允许选择
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
