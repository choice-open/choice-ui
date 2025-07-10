import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { useState } from "react"
import { MonthCalendar, MonthCalendarProps } from "./month-calendar"
import type { CalendarValue } from "../types"

// 单选模式示例组件
const SingleSelectDemo = (args: MonthCalendarProps) => {
  const [value, setValue] = useState<CalendarValue>(null)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <MonthCalendar
          {...args}
          value={value}
          onChange={setValue}
          selectionMode="single"
          className="w-50 rounded-xl border"
        />
        <MonthCalendar
          {...args}
          value={value}
          onChange={setValue}
          selectionMode="single"
          className="w-50 rounded-xl border"
          variant="dark"
        />
      </div>
      {value && value instanceof Date && (
        <p className="text-gray-600">选中日期: {value.toLocaleDateString("zh-CN")}</p>
      )}
    </div>
  )
}

// 多选模式示例组件
const MultiSelectDemo = (args: MonthCalendarProps) => {
  const [value, setValue] = useState<CalendarValue>([])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <MonthCalendar
          {...args}
          value={value}
          onChange={setValue}
          selectionMode="multiple"
          className="w-50 rounded-xl border"
        />
        <MonthCalendar
          {...args}
          value={value}
          onChange={setValue}
          selectionMode="multiple"
          className="w-50 rounded-xl border"
          variant="dark"
        />
      </div>
      {Array.isArray(value) && value.length > 0 && (
        <div className="text-secondary-foreground">
          <p>Selected date ({value.length}):</p>
          <ul className="list-inside list-disc">
            {value.map((date, index) => (
              <li key={index}>{date.toLocaleDateString("zh-CN")}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// 范围选择示例组件
const RangeSelectDemo = (args: MonthCalendarProps) => {
  const [value, setValue] = useState<CalendarValue>(null)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <MonthCalendar
          {...args}
          value={value}
          onChange={setValue}
          selectionMode="range"
          className="w-50 rounded-xl border"
        />
        <MonthCalendar
          {...args}
          value={value}
          onChange={setValue}
          selectionMode="range"
          className="w-50 rounded-xl border"
          variant="dark"
        />
      </div>
      {value && typeof value === "object" && "start" in value && (
        <div className="text-secondary-foreground">
          <p>Selected range:</p>
          <p>Start: {value.start.toLocaleDateString("zh-CN")}</p>
          <p>End: {value.end.toLocaleDateString("zh-CN")}</p>
        </div>
      )}
    </div>
  )
}

// 禁用日期示例组件
const DisabledDatesDemo = (args: MonthCalendarProps) => {
  const [value, setValue] = useState<CalendarValue>(null)

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
      <div className="grid grid-cols-2 gap-4">
        <MonthCalendar
          {...args}
          value={value}
          onChange={setValue}
          disabledDates={disabledDates}
          selectionMode="single"
          className="w-50 rounded-xl border"
        />
        <MonthCalendar
          {...args}
          value={value}
          onChange={setValue}
          disabledDates={disabledDates}
          selectionMode="single"
          className="w-50 rounded-xl border"
          variant="dark"
        />
      </div>
      <div className="text-secondary-foreground">
        <p>
          Disabled dates include: yesterday, the day before yesterday, the 15th and 25th of each
          month
        </p>
        {value && value instanceof Date && (
          <p>Selected date: {value.toLocaleDateString("zh-CN")}</p>
        )}
      </div>
    </div>
  )
}

// 高亮日期示例组件
const HighlightDatesDemo = (args: MonthCalendarProps) => {
  const [value, setValue] = useState<CalendarValue>(null)

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
      <div className="grid grid-cols-2 gap-4">
        <MonthCalendar
          {...args}
          value={value}
          onChange={setValue}
          highlightDates={highlightDates}
          selectionMode="single"
          className="w-50 rounded-xl border"
        />
        <MonthCalendar
          {...args}
          value={value}
          onChange={setValue}
          highlightDates={highlightDates}
          selectionMode="single"
          className="w-50 rounded-xl border"
          variant="dark"
        />
      </div>
      <div className="text-secondary-foreground">
        <p>Highlighted dates include: the 1st, 10th, 20th and 30th of each month</p>
        {value && value instanceof Date && (
          <p>Selected date: {value.toLocaleDateString("zh-CN")}</p>
        )}
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
        className="w-50 rounded-xl border"
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
          className="w-50 rounded-xl border"
        />
        <p className="text-secondary-foreground">
          Display the left week number column, using the ISO week number standard (Monday starts)
        </p>
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
      className="w-50 rounded-xl border"
    />
  ),
}

// 多选模式
export const MultiSelect: Story = {
  args: {
    ...Default.args,
  },
  render: (args) => (
    <MultiSelectDemo
      {...args}
      className="w-50 rounded-xl border"
    />
  ),
}

// 范围选择模式
export const RangeSelect: Story = {
  args: {
    ...Default.args,
  },
  render: (args) => (
    <RangeSelectDemo
      {...args}
      className="w-50 rounded-xl border"
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
      className="w-50 rounded-xl border"
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
      className="w-50 rounded-xl border"
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
          className="w-50 rounded-xl border"
        />
        <p className="text-secondary-foreground">
          Use custom weekday name array to override automatic generation of multiple languages
        </p>
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
      <div className="grid grid-cols-4 gap-3">
        <div>
          <h3 className="mb-2 font-medium">中文 (zh-CN)</h3>
          <MonthCalendar
            {...args}
            locale="zh-CN"
            className="w-50 rounded-xl border"
          />
        </div>
        <div>
          <h3 className="mb-2 font-medium">English (en-US)</h3>
          <MonthCalendar
            {...args}
            locale="en-US"
            className="w-50 rounded-xl border"
          />
        </div>
        <div>
          <h3 className="mb-2 font-medium">日本語 (ja-JP)</h3>
          <MonthCalendar
            {...args}
            locale="ja-JP"
            className="w-50 rounded-xl border"
          />
        </div>
        <div>
          <h3 className="mb-2 font-medium">한국어 (ko-KR)</h3>
          <MonthCalendar
            {...args}
            locale="ko-KR"
            className="w-50 rounded-xl border"
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
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <h3 className="mb-2 font-medium">Starts on Sunday (0) + Week Numbers</h3>
            <MonthCalendar
              {...args}
              weekStartsOn={0}
              className="w-50 rounded-xl border"
            />
          </div>
          <div>
            <h3 className="mb-2 font-medium">Starts on Monday (1) + Week Numbers</h3>
            <MonthCalendar
              {...args}
              weekStartsOn={1}
              className="w-50 rounded-xl border"
            />
          </div>
          <div>
            <h3 className="mb-2 font-medium">Starts on Saturday (6) + Week Numbers</h3>
            <MonthCalendar
              {...args}
              weekStartsOn={6}
              className="w-50 rounded-xl border"
            />
          </div>
        </div>
        <p className="text-secondary-foreground max-w-xl">
          The week number is calculated based on the ISO standard, and the different week start days
          will affect the calendar layout but not the week number calculation
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
          className="w-50 rounded-xl border"
        />
        <p className="text-secondary-foreground">
          Dynamic row mode: display 4-6 rows based on the actual needs of the month, and the height
          will change
        </p>
      </div>
    )
  },
}

// 统一接口示例组件
const UnifiedInterfaceExample = () => {
  const [singleValue, setSingleValue] = useState<CalendarValue>(new Date())
  const [multiValue, setMultiValue] = useState<CalendarValue>([
    new Date(),
    new Date(Date.now() + 86400000),
  ])
  const [rangeValue, setRangeValue] = useState<CalendarValue>({
    start: new Date(),
    end: new Date(Date.now() + 7 * 86400000),
  })

  return (
    <div className="grid grid-cols-4 gap-3">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Single Select</h3>
        <MonthCalendar
          value={singleValue}
          onChange={setSingleValue}
          selectionMode="single"
          className="w-50 rounded-xl border"
        />
        <p className="text-secondary-foreground mt-2">
          Selected: {singleValue instanceof Date ? singleValue.toLocaleDateString() : "None"}
        </p>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Multi Select</h3>
        <MonthCalendar
          value={multiValue}
          onChange={setMultiValue}
          selectionMode="multiple"
          className="w-50 rounded-xl border"
        />
        <p className="text-secondary-foreground mt-2">
          Selected: {Array.isArray(multiValue) ? `${multiValue.length} dates` : "None"}
        </p>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Range Select</h3>
        <MonthCalendar
          value={rangeValue}
          onChange={setRangeValue}
          selectionMode="range"
          className="w-50 rounded-xl border"
        />
        <p className="text-secondary-foreground mt-2">
          Selected range:{" "}
          {rangeValue && typeof rangeValue === "object" && "start" in rangeValue
            ? `${rangeValue.start.toLocaleDateString()} - ${rangeValue.end.toLocaleDateString()}`
            : "None"}
        </p>
      </div>
    </div>
  )
}

// 添加新的统一接口示例
export const UnifiedInterface: StoryObj<typeof MonthCalendar> = {
  render: () => <UnifiedInterfaceExample />,
}
