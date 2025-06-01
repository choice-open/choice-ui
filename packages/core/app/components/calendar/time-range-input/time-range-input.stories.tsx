import type { Meta, StoryObj } from "@storybook/react"
import { enUS, ja, zhCN } from "date-fns/locale"
import React, { useState } from "react"
import { Panel } from "../../panel"
import { timeStringToDate } from "../utils/time"
import { TimeRangeInput } from "./time-range-input"

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
    <Panel className="w-96">
      <Panel.Row type="two-input-two-icon">
        <TimeRangeInput
          {...args}
          startValue={startValue}
          endValue={endValue}
          onStartChange={setStartValue}
          onEndChange={setEndValue}
        />
      </Panel.Row>
    </Panel>
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

// 预设时间范围
export const WithPresetRange: Story = {
  args: {
    startValue: timeStringToDate("09:00"),
    endValue: timeStringToDate("17:30"),
    startPlaceholder: "工作开始时间",
    endPlaceholder: "工作结束时间",
    format: "HH:mm",
  },
  render: (args) => <TimeRangeDemo {...args} />,
}

// 跨日时间范围
export const CrossMidnight: Story = {
  args: {
    startValue: timeStringToDate("22:00"),
    endValue: timeStringToDate("06:00"),
    startPlaceholder: "夜班开始",
    endPlaceholder: "夜班结束",
    format: "HH:mm",
  },
  render: (args) => (
    <div className="space-y-4">
      <TimeRangeDemo {...args} />
      <div className="text-sm text-gray-600">
        💡 支持跨日时间范围（如夜班从 22:00 到次日 06:00）
      </div>
    </div>
  ),
}

// 不同时间格式
export const DifferentFormats: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 font-medium">24小时格式 (HH:mm)</h3>
        <TimeRangeDemo
          format="HH:mm"
          startPlaceholder="09:00"
          endPlaceholder="17:00"
          startValue={timeStringToDate("09:00")}
          endValue={timeStringToDate("17:00")}
        />
      </div>

      <div>
        <h3 className="mb-4 font-medium">12小时格式 (h:mm a)</h3>
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
        <h3 className="mb-4 font-medium">带秒格式 (HH:mm:ss)</h3>
        <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2">
          <TimeRangeDemo
            format="HH:mm:ss"
            startPlaceholder="09:00:00"
            endPlaceholder="17:00:00"
            startValue={timeStringToDate("09:00")}
            endValue={timeStringToDate("17:00")}
          />
        </div>
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
        <div className="mt-2 text-sm text-gray-500">持续时间显示：8小时30分钟</div>
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
        <div className="mt-2 text-sm text-gray-500">持続時間表示：8時間30分</div>
      </div>
    </div>
  ),
}

// 常见使用场景
export const CommonScenarios: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 font-medium">🏢 工作时间</h3>
        <TimeRangeDemo
          startValue={timeStringToDate("09:00")}
          endValue={timeStringToDate("18:00")}
          startPlaceholder="上班时间"
          endPlaceholder="下班时间"
        />
      </div>

      <div>
        <h3 className="mb-4 font-medium">🍽️ 用餐时间</h3>
        <TimeRangeDemo
          startValue={timeStringToDate("12:00")}
          endValue={timeStringToDate("13:00")}
          startPlaceholder="午餐开始"
          endPlaceholder="午餐结束"
        />
      </div>

      <div>
        <h3 className="mb-4 font-medium">🏃‍♂️ 锻炼时间</h3>
        <TimeRangeDemo
          startValue={timeStringToDate("06:30")}
          endValue={timeStringToDate("07:30")}
          startPlaceholder="开始锻炼"
          endPlaceholder="结束锻炼"
        />
      </div>

      <div>
        <h3 className="mb-4 font-medium">🌙 夜班时间</h3>
        <TimeRangeDemo
          startValue={timeStringToDate("22:00")}
          endValue={timeStringToDate("06:00")}
          startPlaceholder="夜班开始"
          endPlaceholder="夜班结束"
        />
        <div className="mt-2 text-sm text-gray-500">💡 跨日工作，持续8小时</div>
      </div>
    </div>
  ),
}

// 仅持续时间显示
export const DurationOnly: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 font-medium">短时间段</h3>
        <TimeRangeDemo
          startValue={timeStringToDate("14:00")}
          endValue={timeStringToDate("14:45")}
          startPlaceholder="会议开始"
          endPlaceholder="会议结束"
        />
      </div>

      <div>
        <h3 className="mb-4 font-medium">整点时间</h3>
        <TimeRangeDemo
          startValue={timeStringToDate("10:00")}
          endValue={timeStringToDate("12:00")}
          startPlaceholder="培训开始"
          endPlaceholder="培训结束"
        />
      </div>

      <div>
        <h3 className="mb-4 font-medium">长时间段</h3>
        <TimeRangeDemo
          startValue={timeStringToDate("08:00")}
          endValue={timeStringToDate("20:00")}
          startPlaceholder="营业开始"
          endPlaceholder="营业结束"
        />
      </div>
    </div>
  ),
}
