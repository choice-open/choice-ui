import type { Meta, StoryObj } from "@storybook/react"
import React, { useState } from "react"
import { TimeCalendar, type TimeCalendarProps } from "./time-calendar"

// 辅助组件
const SingleColumnDemo = (args: TimeCalendarProps) => {
  const [time, setTime] = useState<string>("00:30")

  return (
    <div className="space-y-4">
      <TimeCalendar
        {...args}
        value={time}
        onValueChange={(value) => {
          if (typeof value === "string") {
            setTime(value)
          }
        }}
        className="h-64"
      />
      <div className="text-sm text-gray-600">选中时间: {time || "未选择"}</div>
    </div>
  )
}

const ObjectFormatDemo = (args: TimeCalendarProps) => {
  const [time, setTime] = useState<{ hour: number; minute: number }>({ hour: 9, minute: 0 })

  return (
    <div className="space-y-4">
      <TimeCalendar
        {...args}
        value={time}
        onValueChange={(value) => {
          if (typeof value === "object" && value !== null) {
            setTime(value)
          }
        }}
        className="h-64"
      />
      <div className="text-sm text-gray-600">
        选中时间:{" "}
        {time
          ? `${time.hour.toString().padStart(2, "0")}:${time.minute.toString().padStart(2, "0")}`
          : "未选择"}
      </div>
    </div>
  )
}

const SpecialValueDemo = (args: TimeCalendarProps) => {
  const [time, setTime] = useState<string>("14:37") // 不在15分钟步进中的值

  return (
    <div className="space-y-4">
      <TimeCalendar
        {...args}
        value={time}
        onValueChange={(value) => {
          if (typeof value === "string") {
            setTime(value)
          }
        }}
        className="h-64"
      />
      <div className="text-sm text-gray-600">
        选中时间: {time || "未选择"}
        <br />
        <span className="text-orange-600">
          注意：14:37 不在 15 分钟步进范围内，但仍会显示在列表中
        </span>
      </div>
    </div>
  )
}

const UncontrolledDemo = (args: TimeCalendarProps) => {
  return (
    <div className="space-y-4">
      <TimeCalendar
        {...args}
        defaultValue="10:45"
        className="h-64"
      />
      <div className="text-sm text-gray-600">非受控模式，默认值: 10:45</div>
    </div>
  )
}

const meta: Meta<typeof TimeCalendar> = {
  title: "DateAndTime/TimeCalendar",
  component: TimeCalendar,
  parameters: {
    layout: "centered",
  },
  tags: ["new"],
}

export default meta
type Story = StoryObj<typeof meta>

// 基础用法
export const Default: Story = {
  args: {
    format: "24h",
    step: 15,
    selection: true,
  },
  render: (args) => <SingleColumnDemo {...args} />,
}

// 12小时制
export const TwelveHourFormat: Story = {
  args: {
    format: "12h",
    step: 15,
    selection: true,
  },
  render: (args) => <SingleColumnDemo {...args} />,
}

// 不同步进设置
export const CustomSteps: Story = {
  args: {
    format: "24h",
    step: 30,
    selection: true,
  },
  render: (args) => <SingleColumnDemo {...args} />,
}

// 精确分钟（5分钟步进）
export const PreciseMinutes: Story = {
  args: {
    format: "24h",
    step: 5,
    selection: true,
  },
  render: (args) => <SingleColumnDemo {...args} />,
}

// 对象格式
export const ObjectFormat: Story = {
  args: {
    format: "24h",
    step: 15,
    selection: true,
  },
  render: (args) => <ObjectFormatDemo {...args} />,
}

// 特殊值（不在步进范围内）
export const SpecialValue: Story = {
  args: {
    format: "24h",
    step: 15,
    selection: true,
  },
  render: (args) => <SpecialValueDemo {...args} />,
}

// 非受控模式
export const Uncontrolled: Story = {
  args: {
    format: "24h",
    step: 15,
    selection: true,
  },
  render: (args) => <UncontrolledDemo {...args} />,
}

// 无选择图标
export const NoSelection: Story = {
  args: {
    format: "24h",
    step: 15,
    selection: false,
  },
  render: (args) => <SingleColumnDemo {...args} />,
}
