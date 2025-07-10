import type { Meta, StoryObj } from "@storybook/react-vite"
import { enUS, ja, zhCN } from "date-fns/locale"
import React, { useState } from "react"
import { Panel } from "../../panel"
import { timeStringToDate } from "../utils/time"
import { TimeRangeInput } from "./time-range-input"
import { useEventCallback } from "usehooks-ts"

const meta: Meta<typeof TimeRangeInput> = {
  title: "DateAndTime/TimeRangeInput",
  component: TimeRangeInput,
  parameters: {
    layout: "centered",
  },
  tags: ["new"],
}

export default meta
type Story = StoryObj<typeof meta>

// 演示组件
const TimeRangeDemo = (args: React.ComponentProps<typeof TimeRangeInput>) => {
  const [startValue, setStartValue] = useState<Date | null>(args.startValue || null)
  const [endValue, setEndValue] = useState<Date | null>(args.endValue || null)

  return (
    <Panel.Row
      type="two-input-two-icon"
      className="w-96 px-0"
    >
      <TimeRangeInput
        {...args}
        startValue={startValue}
        endValue={endValue}
        onStartChange={setStartValue}
        onEndChange={setEndValue}
      />
    </Panel.Row>
  )
}

// 范围同步演示组件
const RangeSyncDemo = () => {
  const [startValue, setStartValue] = useState<Date | null>(timeStringToDate("09:00"))
  const [endValue, setEndValue] = useState<Date | null>(timeStringToDate("17:00"))

  const handleStartChange = useEventCallback((newStart: Date | null) => {
    if (newStart) {
      // 计算当前range长度（毫秒），fallback为8小时
      const currentRange =
        startValue && endValue ? endValue.getTime() - startValue.getTime() : 8 * 60 * 60 * 1000
      // 保持range长度
      const newEnd = new Date(newStart.getTime() + currentRange)
      setStartValue(newStart)
      setEndValue(newEnd)
    } else {
      setStartValue(newStart)
    }
  })

  const handleEndChange = useEventCallback((newEnd: Date | null) => {
    if (newEnd && startValue && newEnd <= startValue) {
      // end <= start 时推动start
      setStartValue(newEnd)
    }
    setEndValue(newEnd)
  })

  return (
    <div className="space-y-6">
      <Panel.Row
        type="two-input-two-icon"
        className="px-0"
      >
        <TimeRangeInput
          startValue={startValue}
          endValue={endValue}
          onStartChange={handleStartChange}
          onEndChange={handleEndChange}
          startPlaceholder="开始时间"
          endPlaceholder="结束时间"
          format="HH:mm"
        />
      </Panel.Row>

      <div className="space-y-4">
        <div className="font-medium">🎯 Time Range Synchronization Logic</div>
        <div className="text-secondary-foreground space-y-2">
          <div>
            • <strong>Start Time Change</strong>：Automatically adjust the end time to maintain the
            original range length
          </div>
          <div>
            • <strong>End Time Change</strong>：If the end time is less than or equal to the start
            time, the start time is pushed to the end position
          </div>
          <div>
            • <strong>Dynamic Range</strong>
            ：First adjust the end time to set the desired range length, then any changes to the
            start time will maintain this length
          </div>
        </div>

        <div className="rounded-md border p-4">
          <div className="font-medium">🧪 Test Steps</div>
          <div className="mt-2 space-y-1">
            <div>1. Adjust the end time to 19:00 → the range becomes 10 hours</div>
            <div>
              2. Modify the start time to 10:00 → the end time is automatically adjusted to 20:00 to
              maintain a 10-hour distance
            </div>
            <div>
              3. Set the end time to be earlier than the start time (e.g., 08:00) → the start time
              is pushed to 08:00
            </div>
            <div>4. Support cross-day range: start time 22:00, end time the next day 06:00</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 基础用法
export const Default: Story = {
  args: {
    startPlaceholder: "Start Time",
    endPlaceholder: "End Time",
    format: "HH:mm",
  },
  render: (args) => <TimeRangeDemo {...args} />,
}

export const Size: Story = {
  render: function Render() {
    return (
      <div className="space-y-4">
        <TimeRangeDemo size="large" />
      </div>
    )
  },
}

export const Variable: Story = {
  render: function Render() {
    return (
      <div className="rounded-xl bg-gray-800 p-8">
        <TimeRangeDemo variant="dark" />
      </div>
    )
  },
}

// 时间范围同步
export const RangeSynchronization: Story = {
  render: () => <RangeSyncDemo />,
}

// 预设时间范围
export const WithPresetRange: Story = {
  args: {
    startValue: timeStringToDate("09:00"),
    endValue: timeStringToDate("17:30"),
    startPlaceholder: "Start Time",
    endPlaceholder: "End Time",
    format: "HH:mm",
  },
  render: (args) => <TimeRangeDemo {...args} />,
}

// 跨日时间范围
export const CrossMidnight: Story = {
  args: {
    startValue: timeStringToDate("22:00"),
    endValue: timeStringToDate("06:00"),
    startPlaceholder: "Start Time",
    endPlaceholder: "End Time",
    format: "HH:mm",
  },
  render: (args) => (
    <div className="space-y-4">
      <TimeRangeDemo {...args} />
      <div className="text-secondary-foreground">
        💡 Support cross-day time range (e.g., night shift from 22:00 to the next day 06:00)
      </div>
    </div>
  ),
}

// 不同时间格式
export const DifferentFormats: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="mb-4 font-medium">24-hour format (HH:mm)</h3>
        <TimeRangeDemo
          format="HH:mm"
          startPlaceholder="09:00"
          endPlaceholder="17:00"
          startValue={timeStringToDate("09:00")}
          endValue={timeStringToDate("17:00")}
        />
      </div>

      <div>
        <h3 className="mb-4 font-medium">12-hour format (h:mm a)</h3>
        <TimeRangeDemo
          format="h:mm a"
          locale={enUS}
          startPlaceholder="9:00 AM"
          endPlaceholder="5:00 PM"
          startValue={timeStringToDate("09:00")}
          endValue={timeStringToDate("17:00")}
        />
      </div>

      <div>
        <h3 className="mb-4 font-medium">With seconds format (HH:mm:ss)</h3>
        <TimeRangeDemo
          format="HH:mm:ss"
          startPlaceholder="09:00:00"
          endPlaceholder="17:00:00"
          startValue={timeStringToDate("09:00")}
          endValue={timeStringToDate("17:00")}
        />
      </div>
    </div>
  ),
}

// 国际化支持
export const Internationalization: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 font-medium">中文 (zh-CN)</h3>
        <TimeRangeDemo
          locale={zhCN}
          startPlaceholder="开始时间"
          endPlaceholder="结束时间"
          startValue={timeStringToDate("09:00")}
          endValue={timeStringToDate("17:30")}
        />
        <div className="mt-2 text-sm text-gray-500">Duration display: 8h 30m</div>
      </div>

      <div>
        <h3 className="mb-4 font-medium">English (en-US)</h3>
        <TimeRangeDemo
          locale={enUS}
          format="h:mm a"
          startPlaceholder="Start Time"
          endPlaceholder="End Time"
          startValue={timeStringToDate("09:00")}
          endValue={timeStringToDate("17:30")}
        />
        <div className="mt-2 text-sm text-gray-500">Duration display: 8h 30m</div>
      </div>

      <div>
        <h3 className="mb-4 font-medium">日本語 (ja)</h3>
        <TimeRangeDemo
          locale={ja}
          startPlaceholder="開始時間"
          endPlaceholder="終了時間"
          startValue={timeStringToDate("09:00")}
          endValue={timeStringToDate("17:30")}
        />
        <div className="mt-2 text-sm text-gray-500">Duration display: 8h 30m</div>
      </div>
    </div>
  ),
}

// 常见使用场景
export const CommonScenarios: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 font-medium">🏢 Work Time</h3>
        <TimeRangeDemo
          startValue={timeStringToDate("09:00")}
          endValue={timeStringToDate("18:00")}
          startPlaceholder="Start Time"
          endPlaceholder="End Time"
        />
      </div>

      <div>
        <h3 className="mb-4 font-medium">🍽️ Lunch Time</h3>
        <TimeRangeDemo
          startValue={timeStringToDate("12:00")}
          endValue={timeStringToDate("13:00")}
          startPlaceholder="Start Time"
          endPlaceholder="End Time"
        />
      </div>

      <div>
        <h3 className="mb-4 font-medium">🏃‍♂️ Exercise Time</h3>
        <TimeRangeDemo
          startValue={timeStringToDate("06:30")}
          endValue={timeStringToDate("07:30")}
          startPlaceholder="Start Time"
          endPlaceholder="End Time"
        />
      </div>

      <div>
        <h3 className="mb-4 font-medium">🌙 Night Shift Time</h3>
        <TimeRangeDemo
          startValue={timeStringToDate("22:00")}
          endValue={timeStringToDate("06:00")}
          startPlaceholder="Start Time"
          endPlaceholder="End Time"
        />
        <div className="mt-2 text-sm text-gray-500">💡 Cross-day work, 8 hours</div>
      </div>
    </div>
  ),
}

// 仅持续时间显示
export const DurationOnly: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 font-medium">Short Time Range</h3>
        <TimeRangeDemo
          startValue={timeStringToDate("14:00")}
          endValue={timeStringToDate("14:45")}
          startPlaceholder="Start Time"
          endPlaceholder="End Time"
        />
      </div>

      <div>
        <h3 className="mb-4 font-medium">Full Hour Time Range</h3>
        <TimeRangeDemo
          startValue={timeStringToDate("10:00")}
          endValue={timeStringToDate("12:00")}
          startPlaceholder="Start Time"
          endPlaceholder="End Time"
        />
      </div>

      <div>
        <h3 className="mb-4 font-medium">Long Time Range</h3>
        <TimeRangeDemo
          startValue={timeStringToDate("08:00")}
          endValue={timeStringToDate("20:00")}
          startPlaceholder="Start Time"
          endPlaceholder="End Time"
        />
      </div>
    </div>
  ),
}
