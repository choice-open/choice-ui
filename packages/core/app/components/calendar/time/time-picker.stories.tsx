import type { Meta, StoryObj } from "@storybook/react"
import React, { useState } from "react"
import { TimePicker } from "./time-picker"
import type { TimePickerProps, Time } from "./types"
import { formatTime } from "./utils"

// 辅助组件
const SingleColumnDemo = (args: TimePickerProps) => {
  const [time, setTime] = useState<Time>({ hour: 0, minute: 30 })

  return (
    <div className="space-y-4">
      <TimePicker
        {...args}
        value={time}
        onChange={setTime}
        className="h-64"
      />
      <div className="text-sm text-gray-600">
        选中时间: {time ? formatTime(time, args.format) : "未选择"}
      </div>
    </div>
  )
}

const DualColumnDemo = (args: TimePickerProps) => {
  const [time, setTime] = useState<Time>({ hour: 9, minute: 0 })

  return (
    <div className="space-y-4">
      <TimePicker
        {...args}
        value={time}
        onChange={setTime}
        className="h-64"
      />
      <div className="text-sm text-gray-600">
        选中时间: {time ? formatTime(time, args.format) : "未选择"}
      </div>
    </div>
  )
}

const TimeRangeDemo = (args: TimePickerProps) => {
  const [time, setTime] = useState<Time>({ hour: 10, minute: 0 })

  return (
    <div className="space-y-4">
      <TimePicker
        {...args}
        value={time}
        onChange={setTime}
        minTime={{ hour: 9, minute: 0 }}
        maxTime={{ hour: 17, minute: 30 }}
      />
      <div className="text-sm text-gray-600">
        选中时间: {time ? formatTime(time, args.format) : "未选择"}
        <br />
        时间范围: 09:00 - 17:30
      </div>
    </div>
  )
}

const ComparisonDemo = (args: TimePickerProps) => {
  const [singleTime, setSingleTime] = useState<Time>({ hour: 0, minute: 30 })
  const [dualTime, setDualTime] = useState<Time>({ hour: 9, minute: 0 })

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-medium">单列布局</h3>
        <div className="space-y-2">
          <TimePicker
            {...args}
            layout="single"
            value={singleTime}
            onChange={setSingleTime}
          />
          <div className="text-sm text-gray-600">
            选中时间: {formatTime(singleTime, args.format)}
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">双列布局</h3>
        <div className="space-y-2">
          <TimePicker
            {...args}
            layout="dual"
            value={dualTime}
            onChange={setDualTime}
          />
          <div className="text-sm text-gray-600">选中时间: {formatTime(dualTime, args.format)}</div>
        </div>
      </div>
    </div>
  )
}

const meta: Meta<typeof TimePicker> = {
  title: "DateAndTime/TimePicker",
  component: TimePicker,
  parameters: {
    layout: "centered",
  },
  tags: ["new"],
}

export default meta
type Story = StoryObj<typeof meta>

// 基础用法 - 单列
export const Default: Story = {
  args: {
    layout: "single",
    format: "24h",
    minuteStep: 15,
    hourStep: 1,
    disabled: false,
  },
  render: (args) => <SingleColumnDemo {...args} />,
}

// 双列布局
export const DualColumn: Story = {
  args: {
    layout: "dual",
    format: "24h",
    minuteStep: 15,
    hourStep: 1,
    disabled: false,
  },
  render: (args) => <DualColumnDemo {...args} />,
}

// 12小时制
export const TwelveHourFormat: Story = {
  args: {
    layout: "single",
    format: "12h",
    minuteStep: 15,
    hourStep: 1,
    disabled: false,
  },
  render: (args) => <SingleColumnDemo {...args} />,
}

// 不同步进设置
export const CustomSteps: Story = {
  args: {
    layout: "single",
    format: "24h",
    minuteStep: 30,
    hourStep: 2,
    disabled: false,
  },
  render: (args) => <SingleColumnDemo {...args} />,
}

// 时间范围限制
export const TimeRange: Story = {
  args: {
    layout: "single",
    format: "24h",
    minuteStep: 15,
    hourStep: 1,
    disabled: false,
  },
  render: (args) => <TimeRangeDemo {...args} />,
}

// 禁用状态
export const Disabled: Story = {
  args: {
    layout: "single",
    format: "24h",
    minuteStep: 15,
    hourStep: 1,
    disabled: true,
  },
  render: (args) => <SingleColumnDemo {...args} />,
}

// 精确分钟（1分钟步进）
export const PreciseMinutes: Story = {
  args: {
    layout: "dual",
    format: "24h",
    minuteStep: 1,
    hourStep: 1,
    disabled: false,
  },
  render: (args) => <DualColumnDemo {...args} />,
}

// 对比展示
export const Comparison: Story = {
  args: {
    format: "24h",
    minuteStep: 15,
    hourStep: 1,
    disabled: false,
  },
  render: (args) => <ComparisonDemo {...args} />,
}
