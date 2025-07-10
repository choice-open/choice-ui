import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { useState } from "react"
import { createTimeToday } from "../utils/time"
import type { TimeCalendarProps } from "./time-calendar"
import { TimeCalendar } from "./time-calendar"

// 辅助组件
const SingleColumnDemo = (args: TimeCalendarProps) => {
  const [time, setTime] = useState<Date | null>(createTimeToday(0, 30))

  return (
    <div className="space-y-4">
      <TimeCalendar
        {...args}
        value={time}
        onChange={setTime}
        className="h-64"
      />
      <div className="text-secondary-foreground">
        Selected time:{" "}
        {time ? time.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }) : "None"}
      </div>
    </div>
  )
}

const SpecialValueDemo = (args: TimeCalendarProps) => {
  const [time, setTime] = useState<Date | null>(createTimeToday(14, 37)) // 不在15分钟步进中的值

  return (
    <div className="space-y-4">
      <TimeCalendar
        {...args}
        value={time}
        onChange={setTime}
        className="h-64"
      />
      <div className="text-secondary-foreground">
        Selected time:{" "}
        {time ? time.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }) : "None"}
        <br />
        <span className="text-orange-600">
          Note: 14:37 is not in the 15-minute step range, but it will still be displayed in the list
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
        defaultValue={createTimeToday(10, 45)}
        className="h-64"
      />
      <div className="text-secondary-foreground">Uncontrolled mode, default value: 10:45</div>
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
    format: "HH:mm",
    step: 15,
  },
  render: (args) => <SingleColumnDemo {...args} />,
}

// 12小时制
export const TwelveHourFormat: Story = {
  args: {
    format: "h:mm a",
    step: 15,
  },
  render: (args) => <SingleColumnDemo {...args} />,
}

// 不同步进设置
export const CustomSteps: Story = {
  args: {
    format: "HH:mm",
    step: 30,
  },
  render: (args) => <SingleColumnDemo {...args} />,
}

// 精确分钟（5分钟步进）
export const PreciseMinutes: Story = {
  args: {
    format: "HH:mm",
    step: 5,
  },
  render: (args) => <SingleColumnDemo {...args} />,
}

// 特殊值（不在步进范围内）
export const SpecialValue: Story = {
  args: {
    format: "HH:mm",
    step: 15,
  },
  render: (args) => <SpecialValueDemo {...args} />,
}

// 非受控模式
export const Uncontrolled: Story = {
  args: {
    format: "HH:mm",
    step: 15,
  },
  render: (args) => <UncontrolledDemo {...args} />,
}
