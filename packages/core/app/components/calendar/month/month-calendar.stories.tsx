import type { Meta, StoryObj } from "@storybook/react"
import React, { useState } from "react"
import { MonthCalendar } from "./month-calendar"
import type { MonthCalendarProps, DateRange } from "./types"

// 辅助组件
const SingleSelectDemo = (args: MonthCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()

  return (
    <div className="space-y-4">
      <MonthCalendar
        {...args}
        selectedDate={selectedDate}
        onDateClick={setSelectedDate}
        className="w-48 border"
      />
      {selectedDate && (
        <p className="text-sm text-gray-600">
          选中日期: {selectedDate.toLocaleDateString("zh-CN")}
        </p>
      )}
    </div>
  )
}

const MultiSelectDemo = (args: MonthCalendarProps) => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([])

  return (
    <div className="space-y-4">
      <MonthCalendar
        {...args}
        selectedDates={selectedDates}
        onMultiSelect={setSelectedDates}
        className="w-48 border"
      />
      {selectedDates.length > 0 && (
        <div className="text-sm text-gray-600">
          <p>选中日期 ({selectedDates.length}):</p>
          <ul className="list-inside list-disc">
            {selectedDates.map((date, index) => (
              <li key={index}>{date.toLocaleDateString("zh-CN")}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

const RangeSelectDemo = (args: MonthCalendarProps) => {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(undefined)

  const handleRangeSelect = (range: DateRange | null) => {
    setSelectedRange(range || undefined)
  }

  return (
    <div className="space-y-4">
      <MonthCalendar
        {...args}
        selectedRange={selectedRange}
        onRangeSelect={handleRangeSelect}
        className="w-48 border"
      />
      {selectedRange && (
        <div className="text-sm text-gray-600">
          <p>选中范围:</p>
          <p>开始: {selectedRange.start.toLocaleDateString("zh-CN")}</p>
          <p>结束: {selectedRange.end.toLocaleDateString("zh-CN")}</p>
        </div>
      )}
    </div>
  )
}

const DisabledDatesDemo = (args: MonthCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()

  // 禁用过去的日期和一些特定日期
  const today = new Date()
  const disabledDates = [
    new Date(today.getTime() - 24 * 60 * 60 * 1000), // 昨天
    new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000), // 前天
    new Date(today.getFullYear(), today.getMonth(), 15), // 每月15号
    new Date(today.getFullYear(), today.getMonth(), 25), // 每月25号
  ]

  return (
    <div className="space-y-4">
      <MonthCalendar
        {...args}
        selectedDate={selectedDate}
        disabledDates={disabledDates}
        onDateClick={setSelectedDate}
        className="w-48 border"
      />
      <div className="text-sm text-gray-600">
        <p>禁用的日期包括：昨天、前天、每月15号和25号</p>
        {selectedDate && <p>选中日期: {selectedDate.toLocaleDateString("zh-CN")}</p>}
      </div>
    </div>
  )
}

const HighlightDatesDemo = (args: MonthCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()

  // 高亮一些特定日期（比如节假日）
  const today = new Date()
  const highlightDates = [
    new Date(today.getFullYear(), today.getMonth(), 1), // 每月1号
    new Date(today.getFullYear(), today.getMonth(), 10), // 每月10号
    new Date(today.getFullYear(), today.getMonth(), 20), // 每月20号
    new Date(today.getFullYear(), today.getMonth(), 30), // 每月30号
  ]

  return (
    <div className="space-y-4">
      <MonthCalendar
        {...args}
        selectedDate={selectedDate}
        highlightDates={highlightDates}
        onDateClick={setSelectedDate}
        className="w-48 border"
      />
      <div className="text-sm text-gray-600">
        <p>高亮的日期包括：每月1号、10号、20号和30号</p>
        {selectedDate && <p>选中日期: {selectedDate.toLocaleDateString("zh-CN")}</p>}
      </div>
    </div>
  )
}

const meta: Meta<typeof MonthCalendar> = {
  title: "DateAndTime/MonthCalendar",
  component: MonthCalendar,
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
    highlightToday: true,
    showOutsideDays: true,
    showWeekNumbers: false,
    weekStartsOn: 1,
    locale: "zh-CN",
    fixedGrid: true,
  },
  render: (args) => {
    return (
      <MonthCalendar
        {...args}
        className="w-48 border"
      />
    )
  },
}

// 显示周数
export const WithWeekNumbers: Story = {
  args: {
    ...Default.args,
    showWeekNumbers: true,
  },
  render: (args) => {
    return (
      <div className="space-y-4">
        <MonthCalendar
          {...args}
          className="w-48 border"
        />
        <p className="text-sm text-gray-600">显示左侧周数列，使用ISO周数标准（周一开始）</p>
      </div>
    )
  },
}

// 单选模式
export const SingleSelect: Story = {
  args: {
    ...Default.args,
  },
  render: (args) => (
    <SingleSelectDemo
      {...args}
      className="w-48 border"
    />
  ),
}

// 多选模式
export const MultiSelect: Story = {
  args: {
    ...Default.args,
    multiSelect: true,
  },
  render: (args) => (
    <MultiSelectDemo
      {...args}
      className="w-48 border"
    />
  ),
}

// 范围选择模式
export const RangeSelect: Story = {
  args: {
    ...Default.args,
    rangeSelect: true,
  },
  render: (args) => (
    <RangeSelectDemo
      {...args}
      className="w-48 border"
    />
  ),
}

// 禁用日期
export const DisabledDates: Story = {
  args: {
    ...Default.args,
  },
  render: (args) => (
    <DisabledDatesDemo
      {...args}
      className="w-48 border"
    />
  ),
}

// 高亮日期
export const HighlightDates: Story = {
  args: {
    ...Default.args,
  },
  render: (args) => (
    <HighlightDatesDemo
      {...args}
      className="w-48 border"
    />
  ),
}

// 自定义星期名称
export const CustomWeekdays: Story = {
  args: {
    ...Default.args,
    weekdayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    locale: "en-US",
  },
  render: (args) => {
    return (
      <div className="space-y-4">
        <MonthCalendar
          {...args}
          className="w-48 border"
        />
        <p className="text-sm text-gray-600">使用自定义星期名称数组，覆盖多语言自动生成</p>
      </div>
    )
  },
}

// 多语言支持
export const MultiLanguage: Story = {
  args: {
    ...Default.args,
  },
  render: (args) => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="mb-2 text-sm font-medium">中文 (zh-CN)</h3>
          <MonthCalendar
            {...args}
            locale="zh-CN"
            className="w-48 border"
          />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium">English (en-US)</h3>
          <MonthCalendar
            {...args}
            locale="en-US"
            className="w-48 border"
          />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium">日本語 (ja-JP)</h3>
          <MonthCalendar
            {...args}
            locale="ja-JP"
            className="w-48 border"
          />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium">한국어 (ko-KR)</h3>
          <MonthCalendar
            {...args}
            locale="ko-KR"
            className="w-48 border"
          />
        </div>
      </div>
    )
  },
}

// 不同周开始日 + 多语言 + 周数
export const WeekStartOptions: Story = {
  args: {
    ...Default.args,
    locale: "en-US",
    showWeekNumbers: true,
  },
  render: (args) => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="mb-2 text-sm font-medium">Week starts on Sunday (0) + Week Numbers</h3>
          <MonthCalendar
            {...args}
            weekStartsOn={0}
            className="w-48 border"
          />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium">Week starts on Monday (1) + Week Numbers</h3>
          <MonthCalendar
            {...args}
            weekStartsOn={1}
            className="w-48 border"
          />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium">Week starts on Saturday (6) + Week Numbers</h3>
          <MonthCalendar
            {...args}
            weekStartsOn={6}
            className="w-48 border"
          />
        </div>
        <p className="text-sm text-gray-600">
          周数基于ISO标准计算，不同的周开始日设置会影响日历布局但不影响周数计算
        </p>
      </div>
    )
  },
}

// 动态行数（不固定6行）
export const DynamicRows: Story = {
  args: {
    ...Default.args,
    fixedGrid: false,
  },
  render: (args) => {
    return (
      <div className="space-y-4">
        <MonthCalendar
          {...args}
          className="w-48 border"
        />
        <p className="text-sm text-gray-600">动态行数模式：根据月份实际需要显示4-6行，高度会变化</p>
      </div>
    )
  },
}
