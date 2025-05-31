import type { Meta, StoryObj } from "@storybook/react"
import React, { useState } from "react"
import { YearCalendar } from "./year-calendar"
import type { YearCalendarProps } from "./types"

// 辅助组件
const YearPickerDemo = (args: YearCalendarProps) => {
  const [selectedYear, setSelectedYear] = useState<Date | null>(args.value ?? new Date())

  return (
    <div className="space-y-4">
      <YearCalendar
        {...args}
        value={selectedYear}
        onChange={setSelectedYear}
        className="w-48 rounded-lg border"
      />
      <YearCalendar
        {...args}
        value={selectedYear}
        onChange={setSelectedYear}
        className="w-48 rounded-lg border"
        variant="dark"
      />
      <div className="text-sm text-gray-600">
        选中年份: {selectedYear?.getFullYear() ?? "未选择"}
      </div>
    </div>
  )
}

const meta: Meta<typeof YearCalendar> = {
  title: "DateAndTime/YearCalendar",
  component: YearCalendar,
  parameters: {
    layout: "centered",
  },
  tags: ["new"],
}

export default meta
type Story = StoryObj<typeof meta>

const currentYear = new Date()

// 基础用法
export const Default: Story = {
  args: {
    value: currentYear,
    currentYear,
    yearCount: 12,
    disabled: false,
  },
  render: (args) => <YearPickerDemo {...args} />,
}

// 范围限制
export const WithRange: Story = {
  args: {
    value: currentYear,
    currentYear,
    minYear: new Date(currentYear.getFullYear() - 5, 0, 1),
    maxYear: new Date(currentYear.getFullYear() + 5, 0, 1),
    yearCount: 12,
    disabled: false,
  },
  render: (args) => <YearPickerDemo {...args} />,
}

// 禁用特定年份
export const WithDisabledYears: Story = {
  args: {
    value: currentYear,
    currentYear,
    disabledYears: [
      new Date(currentYear.getFullYear() - 2, 0, 1),
      new Date(currentYear.getFullYear() - 1, 0, 1),
      new Date(currentYear.getFullYear() + 1, 0, 1),
    ],
    yearCount: 12,
    disabled: false,
  },
  render: (args) => <YearPickerDemo {...args} />,
}

// 不同年份数量
export const DifferentCount: Story = {
  args: {
    value: currentYear,
    currentYear,
    yearCount: 9,
    disabled: false,
  },
  render: (args) => <YearPickerDemo {...args} />,
}

// 禁用状态
export const Disabled: Story = {
  args: {
    value: currentYear,
    currentYear,
    yearCount: 12,
    disabled: true,
  },
  render: (args) => <YearPickerDemo {...args} />,
}

// 自定义起始年份
export const CustomStartYear: Story = {
  args: {
    value: new Date(2025, 0, 1),
    currentYear,
    startYear: new Date(2020, 0, 1),
    yearCount: 15,
    disabled: false,
  },
  render: (args) => <YearPickerDemo {...args} />,
}
