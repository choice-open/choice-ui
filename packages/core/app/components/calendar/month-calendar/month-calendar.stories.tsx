import type { Meta, StoryObj } from "@storybook/react"
import React, { useState } from "react"
import { MonthCalendar } from "./month-calendar"
import type { MonthCalendarProps, DateRange, CalendarValue } from "./types"

// 单选模式示例组件
const SingleSelectDemo = (args: MonthCalendarProps) => {
  const [value, setValue] = useState<CalendarValue>(null)

  return (
    <div className="grid grid-cols-2 gap-4">
      <MonthCalendar
        {...args}
        value={value}
        onChange={setValue}
        selectionMode="single"
        className="w-50 rounded-lg border"
      />
      <MonthCalendar
        {...args}
        value={value}
        onChange={setValue}
        selectionMode="single"
        className="w-50 rounded-lg border"
        variant="dark"
      />
      {value && value instanceof Date && (
        <p className="text-sm text-gray-600">选中日期: {value.toLocaleDateString("zh-CN")}</p>
      )}
    </div>
  )
}

// 多选模式示例组件
const MultiSelectDemo = (args: MonthCalendarProps) => {
  const [value, setValue] = useState<CalendarValue>([])

  return (
    <div className="grid grid-cols-2 gap-4">
      <MonthCalendar
        {...args}
        value={value}
        onChange={setValue}
        selectionMode="multiple"
        className="w-50 rounded-lg border"
      />
      {Array.isArray(value) && value.length > 0 && (
        <div className="text-sm text-gray-600">
          <p>选中日期 ({value.length}):</p>
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
    <div className="grid grid-cols-2 gap-4">
      <MonthCalendar
        {...args}
        value={value}
        onChange={setValue}
        selectionMode="range"
        className="w-50 rounded-lg border"
      />
      <MonthCalendar
        {...args}
        value={value}
        onChange={setValue}
        selectionMode="range"
        className="w-50 rounded-lg border"
        variant="dark"
      />
      {value && typeof value === "object" && "start" in value && (
        <div className="text-sm text-gray-600">
          <p>选中范围:</p>
          <p>开始: {value.start.toLocaleDateString("zh-CN")}</p>
          <p>结束: {value.end.toLocaleDateString("zh-CN")}</p>
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
      <MonthCalendar
        {...args}
        value={value}
        onChange={setValue}
        disabledDates={disabledDates}
        selectionMode="single"
        className="w-50 rounded-lg border"
      />
      <div className="text-sm text-gray-600">
        <p>禁用的日期包括：昨天、前天、每月15号和25号</p>
        {value && value instanceof Date && <p>选中日期: {value.toLocaleDateString("zh-CN")}</p>}
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
      <MonthCalendar
        {...args}
        value={value}
        onChange={setValue}
        highlightDates={highlightDates}
        selectionMode="single"
        className="w-50 rounded-lg border"
      />
      <div className="text-sm text-gray-600">
        <p>高亮的日期包括：每月1号、10号、20号和30号</p>
        {value && value instanceof Date && <p>选中日期: {value.toLocaleDateString("zh-CN")}</p>}
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
        className="w-50 rounded-lg border"
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
          className="w-50 rounded-lg border"
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
      className="w-50 rounded-lg border"
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
      className="w-50 rounded-lg border"
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
      className="w-50 rounded-lg border"
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
      className="w-50 rounded-lg border"
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
      className="w-50 rounded-lg border"
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
          className="w-50 rounded-lg border"
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
      <div className="grid grid-cols-4 gap-3">
        <div>
          <h3 className="mb-2 text-sm font-medium">中文 (zh-CN)</h3>
          <MonthCalendar
            {...args}
            locale="zh-CN"
            className="w-50 rounded-lg border"
          />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium">English (en-US)</h3>
          <MonthCalendar
            {...args}
            locale="en-US"
            className="w-50 rounded-lg border"
          />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium">日本語 (ja-JP)</h3>
          <MonthCalendar
            {...args}
            locale="ja-JP"
            className="w-50 rounded-lg border"
          />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium">한국어 (ko-KR)</h3>
          <MonthCalendar
            {...args}
            locale="ko-KR"
            className="w-50 rounded-lg border"
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
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h3 className="mb-2 text-sm font-medium">Week starts on Sunday (0) + Week Numbers</h3>
          <MonthCalendar
            {...args}
            weekStartsOn={0}
            className="w-50 rounded-lg border"
          />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium">Week starts on Monday (1) + Week Numbers</h3>
          <MonthCalendar
            {...args}
            weekStartsOn={1}
            className="w-50 rounded-lg border"
          />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium">Week starts on Saturday (6) + Week Numbers</h3>
          <MonthCalendar
            {...args}
            weekStartsOn={6}
            className="w-50 rounded-lg border"
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
          className="w-50 rounded-lg border"
        />
        <p className="text-sm text-gray-600">动态行数模式：根据月份实际需要显示4-6行，高度会变化</p>
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
        <h3 className="mb-4 text-lg font-semibold">单选模式 (使用统一接口)</h3>
        <MonthCalendar
          value={singleValue}
          onChange={setSingleValue}
          selectionMode="single"
          className="w-50 rounded-lg border"
        />
        <p className="mt-2 text-sm text-gray-600">
          选中: {singleValue instanceof Date ? singleValue.toLocaleDateString() : "无"}
        </p>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">多选模式 (使用统一接口)</h3>
        <MonthCalendar
          value={multiValue}
          onChange={setMultiValue}
          selectionMode="multiple"
          className="w-50 rounded-lg border"
        />
        <p className="mt-2 text-sm text-gray-600">
          选中: {Array.isArray(multiValue) ? `${multiValue.length} 个日期` : "无"}
        </p>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">范围选择模式 (使用统一接口)</h3>
        <MonthCalendar
          value={rangeValue}
          onChange={setRangeValue}
          selectionMode="range"
          className="w-50 rounded-lg border"
        />
        <p className="mt-2 text-sm text-gray-600">
          选中范围:{" "}
          {rangeValue && typeof rangeValue === "object" && "start" in rangeValue
            ? `${rangeValue.start.toLocaleDateString()} - ${rangeValue.end.toLocaleDateString()}`
            : "无"}
        </p>
      </div>
    </div>
  )
}

// 自动推断模式示例组件
const AutoInferModeExample = () => {
  const [value, setValue] = useState<CalendarValue>(new Date())

  const switchToMultiple = () => setValue([new Date()])
  const switchToRange = () =>
    setValue({ start: new Date(), end: new Date(Date.now() + 7 * 86400000) })
  const switchToSingle = () => setValue(new Date())

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={switchToSingle}
          className="rounded bg-blue-500 px-3 py-1 text-white"
        >
          切换到单选
        </button>
        <button
          onClick={switchToMultiple}
          className="rounded bg-green-500 px-3 py-1 text-white"
        >
          切换到多选
        </button>
        <button
          onClick={switchToRange}
          className="rounded bg-purple-500 px-3 py-1 text-white"
        >
          切换到范围选择
        </button>
      </div>

      <MonthCalendar
        value={value}
        onChange={setValue}
        // selectionMode 未指定，将根据 value 类型自动推断
        className="rounded-lg border p-4"
      />

      <p className="text-sm text-gray-600">
        当前模式:{" "}
        {Array.isArray(value)
          ? "多选"
          : value && typeof value === "object" && "start" in value
            ? "范围选择"
            : "单选"}
      </p>
    </div>
  )
}

// 添加新的统一接口示例
export const UnifiedInterface: StoryObj<typeof MonthCalendar> = {
  render: () => <UnifiedInterfaceExample />,
}
