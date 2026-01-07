import { Tabs } from "@choice-ui/tabs"
import { forwardRef, memo, ReactNode, useMemo } from "react"
import { translation } from "../contents"

// 类型定义
export interface TabItem {
  content: ReactNode
  label: string
  value: string
}

interface ColorPickerTabsProps {
  additionalTabs?: TabItem[]
  customTabLabel?: string
  onPickerTypeChange?: (value: string) => void
  pickerType: string
}

export const ColorPickerTabs = memo(
  forwardRef<HTMLDivElement, ColorPickerTabsProps>(function ColorPickerTabs(props, ref) {
    const { pickerType, onPickerTypeChange, customTabLabel, additionalTabs = [] } = props

    // 构建可用的标签页列表，始终包含 CUSTOM
    const availableTabs = useMemo(() => {
      const tabs = [
        {
          value: "CUSTOM",
          label: customTabLabel ?? translation.colorPicker.CUSTOM,
        },
      ]

      // 添加额外的标签页
      if (additionalTabs.length > 0) {
        additionalTabs.forEach((tab) => {
          tabs.push({
            value: tab.value,
            label: tab.label,
          })
        })
      }

      return tabs
    }, [customTabLabel, additionalTabs])

    return (
      <Tabs
        ref={ref}
        value={pickerType}
        onChange={(value) => onPickerTypeChange?.(value)}
        className="ml-2"
      >
        {availableTabs.map((tab) => (
          <Tabs.Item
            key={tab.value}
            value={tab.value}
          >
            {tab.label}
          </Tabs.Item>
        ))}
      </Tabs>
    )
  }),
)

ColorPickerTabs.displayName = "ColorPickerTabs"
