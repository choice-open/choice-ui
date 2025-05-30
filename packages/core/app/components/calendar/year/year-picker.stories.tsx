import type { Meta, StoryObj } from "@storybook/react"
import React, { useState } from "react"
import { YearPicker } from "./year-picker"
import type { YearPickerProps } from "./types"

// 辅助组件
const YearPickerDemo = (args: YearPickerProps) => {
  const [selectedYear, setSelectedYear] = useState<number>(
    args.selectedYear ?? new Date().getFullYear(),
  )

  return (
    <div className="space-y-4">
      <YearPicker
        {...args}
        selectedYear={selectedYear}
        onYearSelect={setSelectedYear}
      />
      <div className="text-sm text-gray-600">选中年份: {selectedYear}</div>
    </div>
  )
}

const NavigationDemoComponent = (args: YearPickerProps) => {
  const [selectedYear, setSelectedYear] = useState<number>(
    args.selectedYear ?? new Date().getFullYear(),
  )
  const [navLog, setNavLog] = useState<string[]>([])

  const handleNavigate = (direction: "prev" | "next", newStartYear: number) => {
    const endYear = newStartYear + (args.yearCount ?? 12) - 1
    setNavLog((prev) => [
      ...prev.slice(-4), // 只保留最后5条记录
      `${direction === "prev" ? "◀" : "▶"} ${newStartYear} - ${endYear}`,
    ])
  }

  return (
    <div className="space-y-4">
      <YearPicker
        {...args}
        selectedYear={selectedYear}
        onYearSelect={setSelectedYear}
        onNavigate={handleNavigate}
      />
      <div className="text-sm text-gray-600">选中年份: {selectedYear}</div>
      {navLog.length > 0 && (
        <div className="space-y-1 text-xs text-gray-500">
          <div className="font-medium">导航历史:</div>
          {navLog.map((log, index) => (
            <div
              key={index}
              className="font-mono"
            >
              {log}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const meta: Meta<typeof YearPicker> = {
  title: "DateAndTime/YearPicker",
  component: YearPicker,
  parameters: {
    layout: "centered",
  },
  tags: ["new"],
}

export default meta
type Story = StoryObj<typeof meta>

const currentYear = new Date().getFullYear()

// 基础用法
export const Default: Story = {
  args: {
    selectedYear: currentYear,
    currentYear,
    yearCount: 12,
    disabled: false,
  },
  render: (args) => <YearPickerDemo {...args} />,
}

// 范围限制
export const WithRange: Story = {
  args: {
    selectedYear: currentYear,
    currentYear,
    minYear: currentYear - 5,
    maxYear: currentYear + 5,
    yearCount: 12,
    disabled: false,
  },
  render: (args) => <YearPickerDemo {...args} />,
}

// 禁用特定年份
export const WithDisabledYears: Story = {
  args: {
    selectedYear: currentYear,
    currentYear,
    disabledYears: [currentYear - 2, currentYear - 1, currentYear + 1],
    yearCount: 12,
    disabled: false,
  },
  render: (args) => <YearPickerDemo {...args} />,
}

// 不同年份数量
export const DifferentCount: Story = {
  args: {
    selectedYear: currentYear,
    currentYear,
    yearCount: 9,
    disabled: false,
  },
  render: (args) => <YearPickerDemo {...args} />,
}

// 禁用状态
export const Disabled: Story = {
  args: {
    selectedYear: currentYear,
    currentYear,
    yearCount: 12,
    disabled: true,
  },
  render: (args) => <YearPickerDemo {...args} />,
}

// 自定义起始年份
export const CustomStartYear: Story = {
  args: {
    selectedYear: 2025,
    currentYear,
    startYear: 2020,
    yearCount: 15,
    disabled: false,
  },
  render: (args) => <YearPickerDemo {...args} />,
}

// 年份导航功能展示
export const NavigationDemo: Story = {
  args: {
    selectedYear: currentYear,
    currentYear,
    yearCount: 12,
    disabled: false,
  },
  render: (args) => <NavigationDemoComponent {...args} />,
}
