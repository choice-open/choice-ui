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
  tags: ["new", "autodocs"],
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * `MonthCalendar` is a comprehensive calendar component for displaying and selecting dates within a month view.
 *
 * Features:
 * - Multiple selection modes: single, multiple, and range selection
 * - Comprehensive internationalization support with locale-aware formatting
 * - Flexible week start configuration (Sunday through Saturday)
 * - Week number display with ISO standard support
 * - Date highlighting and disabling capabilities
 * - Light and dark theme variants
 * - Dynamic or fixed grid layout options
 * - Outside day display control
 * - Today highlighting and navigation
 * - Keyboard navigation and accessibility support
 * - Customizable weekday names and formatting
 *
 * Usage:
 * - Use for date selection in forms, filters, and scheduling interfaces
 * - Ideal for booking systems, event planners, and date range pickers
 * - Combine with input components for complete date selection workflows
 * - Leverage multiple selection modes for different use cases
 *
 * Best Practices:
 * - Choose appropriate selection mode based on user needs
 * - Consider locale and cultural differences in week start preferences
 * - Use highlighting and disabling to guide user selection
 * - Provide clear visual feedback for selected dates
 *
 * Accessibility:
 * - Full keyboard navigation with arrow keys and space/enter selection
 * - Screen reader friendly with proper ARIA labels and descriptions
 * - High contrast support for all states and variants
 * - Semantic HTML structure with proper date semantics
 */

/**
 * Default: Shows the basic MonthCalendar with standard configuration.
 * - Demonstrates default month view with Chinese locale and Monday week start.
 * - Shows today highlighting and outside day display.
 * - Provides a foundation for calendar implementation.
 */
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

/**
 * WithWeekNumbers: Demonstrates MonthCalendar with week numbers displayed.
 * - Shows ISO standard week numbers in the left column.
 * - Displays how week numbers enhance date navigation and reference.
 * - Useful for applications requiring week-based scheduling or reporting.
 */
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

/**
 * SingleSelect: Demonstrates single date selection mode with light and dark variants.
 * - Shows how to select one date with visual feedback and state management.
 * - Displays both light and dark theme variants side by side.
 * - Useful for basic date selection in forms and filters.
 */
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

/**
 * MultiSelect: Demonstrates multiple date selection mode.
 * - Shows how to select multiple individual dates with visual feedback.
 * - Displays selected dates count and list in both light and dark variants.
 * - Useful for event scheduling, availability selection, or batch operations.
 */
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

/**
 * RangeSelect: Demonstrates date range selection mode.
 * - Shows how to select a continuous date range with start and end dates.
 * - Displays range selection with visual highlighting between dates.
 * - Useful for booking systems, vacation planning, or report period selection.
 */
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

/**
 * DisabledDates: Demonstrates date disabling functionality.
 * - Shows how to disable specific dates (past dates, 15th, 25th of month).
 * - Displays disabled dates with visual indicators and prevented interaction.
 * - Useful for availability systems, booking restrictions, or business rule enforcement.
 */
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

/**
 * HighlightDates: Demonstrates date highlighting functionality.
 * - Shows how to highlight specific dates (1st, 10th, 20th, 30th of month).
 * - Displays highlighted dates with special visual styling to draw attention.
 * - Useful for marking holidays, deadlines, important events, or special dates.
 */
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

/**
 * CustomWeekdays: Demonstrates custom weekday name configuration.
 * - Shows how to override default locale-generated weekday names.
 * - Displays custom abbreviated weekday names in English format.
 * - Useful for applications requiring specific weekday formatting or branding.
 */
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

/**
 * MultiLanguage: Demonstrates comprehensive internationalization support.
 * - Shows MonthCalendar in 4 different languages (Chinese, English, Japanese, Korean).
 * - Displays locale-specific weekday names, month names, and date formatting.
 * - Useful for testing international compatibility and understanding localization features.
 */
export const MultiLanguage: Story = {
  args: {
    ...Default.args,
  },
  render: (args) => {
    return (
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-strong mb-2">中文 (zh-CN)</h3>
          <MonthCalendar
            {...args}
            locale="zh-CN"
            className="w-50 rounded-xl border"
          />
        </div>
        <div>
          <h3 className="font-strong mb-2">English (en-US)</h3>
          <MonthCalendar
            {...args}
            locale="en-US"
            className="w-50 rounded-xl border"
          />
        </div>
        <div>
          <h3 className="font-strong mb-2">日本語 (ja-JP)</h3>
          <MonthCalendar
            {...args}
            locale="ja-JP"
            className="w-50 rounded-xl border"
          />
        </div>
        <div>
          <h3 className="font-strong mb-2">한국어 (ko-KR)</h3>
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

/**
 * WeekStartOptions: Demonstrates different week start day configurations with week numbers.
 * - Shows calendars starting on Sunday, Monday, and Saturday.
 * - Displays how week start affects layout while maintaining ISO week numbers.
 * - Useful for accommodating different cultural preferences for week structure.
 */
export const WeekStartOptions: Story = {
  args: {
    ...Default.args,
    locale: "en-US",
    showWeekNumbers: true,
  },
  render: (args) => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-strong mb-2">Starts on Sunday (0) + Week Numbers</h3>
            <MonthCalendar
              {...args}
              weekStartsOn={0}
              className="w-50 rounded-xl border"
            />
          </div>
          <div>
            <h3 className="font-strong mb-2">Starts on Monday (1) + Week Numbers</h3>
            <MonthCalendar
              {...args}
              weekStartsOn={1}
              className="w-50 rounded-xl border"
            />
          </div>
          <div>
            <h3 className="font-strong mb-2">Starts on Saturday (6) + Week Numbers</h3>
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

/**
 * DynamicRows: Demonstrates dynamic row layout without fixed 6-row grid.
 * - Shows calendar with 4-6 rows based on actual month requirements.
 * - Displays variable height calendar that adapts to month structure.
 * - Useful for space-efficient layouts or when consistent height isn't required.
 */
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
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="text-body-large-strong mb-4">Single Select</h3>
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
        <h3 className="text-body-large-strong mb-4">Multi Select</h3>
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
        <h3 className="text-body-large-strong mb-4">Range Select</h3>
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

/**
 * UnifiedInterface: Demonstrates all three selection modes with unified interface.
 * - Shows single, multiple, and range selection modes side by side.
 * - Displays how the same component API handles different selection types.
 * - Useful for understanding the component's versatility and selection mode differences.
 */
export const UnifiedInterface: StoryObj<typeof MonthCalendar> = {
  render: () => <UnifiedInterfaceExample />,
}

/**
 * ReadOnly: Demonstrates the MonthCalendar component in readonly mode.
 * - Prevents value changes while allowing focus and navigation
 * - Maintains normal visual appearance (unlike disabled)
 * - Useful for displaying non-editable calendar information
 */
export const ReadOnly: Story = {
  render: function ReadOnlyStory() {
    const [value, setValue] = useState<CalendarValue>(new Date())
    const [changeCount, setChangeCount] = useState(0)

    const handleChange = (newValue: CalendarValue) => {
      setValue(newValue)
      setChangeCount((prev) => prev + 1)
    }

    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border bg-stone-50 p-4">
          <div className="text-body-small-strong mb-2 text-stone-700">Current Value:</div>
          <div className="text-body-small font-mono text-stone-600">
            {value instanceof Date ? value.toLocaleDateString() : "null"}
          </div>
          <div className="text-body-small-strong mt-2 text-stone-700">Change Count:</div>
          <div className="text-body-small font-mono text-stone-600">{changeCount}</div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <MonthCalendar
            readonly
            value={value}
            onChange={handleChange}
            selectionMode="single"
            className="w-50 rounded-xl border"
          />
          <MonthCalendar
            value={value}
            onChange={handleChange}
            selectionMode="single"
            className="w-50 rounded-xl border"
          />
        </div>
        <div className="text-body-small text-stone-600">
          💡 Try clicking dates on the readonly calendar - the value should not change and the change count should remain at 0. Only the normal calendar will change the value.
        </div>
      </div>
    )
  },
}
