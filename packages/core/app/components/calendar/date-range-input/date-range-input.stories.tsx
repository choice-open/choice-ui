import type { Meta, StoryObj } from "@storybook/react-vite"
import { addDays, addHours, subDays } from "date-fns"
import { enUS, ja, ko, zhCN } from "date-fns/locale"
import React, { useState } from "react"
import { Panel } from "../../panel"
import { DateRangeInput } from "./date-range-input"
import { useEventCallback } from "usehooks-ts"

const meta: Meta<typeof DateRangeInput> = {
  title: "DateAndTime/DateRangeInput",
  component: DateRangeInput,
  parameters: {
    layout: "centered",
  },
  tags: ["new", "autodocs"],
  argTypes: {
    locale: {
      control: { type: "select" },
      options: ["enUS", "zhCN", "ja", "ko"],
      mapping: { enUS, zhCN, ja, ko },
      description: "语言环境",
    },
    format: {
      control: { type: "text" },
      description: "日期格式",
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * `DateRangeInput` is a sophisticated component for selecting date ranges with intelligent synchronization and validation.
 *
 * Features:
 * - Dual date input fields with automatic range synchronization
 * - Smart range preservation when adjusting start dates
 * - Boundary validation with automatic start date adjustment
 * - Comprehensive internationalization support
 * - Multiple date format options and locale-aware formatting
 * - Flexible sizing and theming variants
 * - Disabled state support for individual inputs
 * - Real-time range calculation and display
 *
 * Usage:
 * - Use for date range selection in filters, reports, and booking systems
 * - Combine with calendar components for enhanced date picking
 * - Leverage range synchronization for consistent user experience
 * - Support international users with multiple locale options
 *
 * Best Practices:
 * - Provide clear placeholder text for start and end dates
 * - Use consistent date formats across your application
 * - Consider range synchronization behavior for optimal UX
 * - Test with various locales for international compatibility
 *
 * Accessibility:
 * - Full keyboard navigation between input fields
 * - Screen reader friendly with proper ARIA labels
 * - Semantic HTML structure for optimal accessibility
 * - Clear focus indicators and validation feedback
 */

// 演示组件
const DateRangeDemo = (args: React.ComponentProps<typeof DateRangeInput>) => {
  const [startValue, setStartValue] = useState<Date | null>(args.startValue || null)
  const [endValue, setEndValue] = useState<Date | null>(args.endValue || null)

  return (
    <Panel.Row
      type="two-input-two-icon"
      className="px-0"
    >
      <DateRangeInput
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
  const [startValue, setStartValue] = useState<Date | null>(new Date())
  const [endValue, setEndValue] = useState<Date | null>(addDays(new Date(), 3))

  const handleStartChange = useEventCallback((newStart: Date | null) => {
    if (newStart) {
      // 计算当前range长度（毫秒），fallback为1天
      const currentRange =
        startValue && endValue ? endValue.getTime() - startValue.getTime() : 1 * 24 * 60 * 60 * 1000
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
        <DateRangeInput
          startValue={startValue}
          endValue={endValue}
          onStartChange={handleStartChange}
          onEndChange={handleEndChange}
          startPlaceholder="Start Date"
          endPlaceholder="End Date"
          locale={zhCN}
        />
      </Panel.Row>

      <div className="space-y-4">
        <div className="font-medium">🎯 Range Synchronization</div>
        <div className="text-secondary-foreground space-y-2">
          <div>
            • <strong>Start Date Change</strong>：Automatically adjust the end date to maintain the
            original range length
          </div>
          <div>
            • <strong>End Date Change</strong>：If the end date is less than or equal to the start
            date, the start date is pushed to the end position
          </div>
          <div>
            • <strong>Dynamic Range</strong>：First adjust the end date to set the desired range
            length, then any changes to the start date will maintain this length
          </div>
        </div>

        <div className="rounded-md border p-4">
          <div className="font-medium">🧪 Test Steps</div>
          <div className="mt-2 space-y-1">
            <div>1. Adjust the end date to 5 days later → the range becomes 5 days</div>
            <div>
              2. Modify the start date → the end date is automatically adjusted to maintain a 5-day
              distance
            </div>
            <div>
              3. Set the end date to be earlier than the start date → the start date is pushed to
              the end position
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Default: Shows the basic DateRangeInput usage with standard configuration.
 * - Demonstrates dual input fields for start and end dates.
 * - Uses ISO date format and English locale as defaults.
 * - Provides a foundation for date range selection implementation.
 */
export const Default: Story = {
  args: {
    startPlaceholder: "Start Date",
    endPlaceholder: "End Date",
    format: "yyyy-MM-dd",
    locale: enUS,
  },
  render: (args) => <DateRangeDemo {...args} />,
}

/**
 * Size: Demonstrates the large size variant of DateRangeInput.
 * - Shows the component with increased dimensions for prominent interfaces.
 * - Useful for applications requiring larger touch targets or enhanced visibility.
 */
export const Size: Story = {
  render: function Render() {
    return (
      <div className="space-y-4">
        <DateRangeDemo size="large" />
      </div>
    )
  },
}

/**
 * Variable: Demonstrates the dark theme variant of DateRangeInput.
 * - Shows the component styled for dark theme environments.
 * - Useful for applications with dark mode or specialized UI themes.
 */
export const Variable: Story = {
  render: function Render() {
    return (
      <div className="rounded-xl bg-gray-800 p-8">
        <DateRangeDemo variant="dark" />
      </div>
    )
  },
}

/**
 * RangeSynchronization: Demonstrates the intelligent range synchronization feature.
 * - Shows how start date changes automatically adjust the end date to maintain range length.
 * - Displays boundary validation where end dates push start dates when necessary.
 * - Includes comprehensive explanation and test scenarios for understanding the behavior.
 */
export const RangeSynchronization: Story = {
  render: () => <RangeSyncDemo />,
}

/**
 * WithPresetRange: Demonstrates DateRangeInput with pre-filled date values.
 * - Shows the component with initial start and end dates already set.
 * - Displays a 7-day range as an example of preset configurations.
 * - Useful for forms or filters that need default date ranges.
 */
export const WithPresetRange: Story = {
  args: {
    startValue: new Date(),
    endValue: addDays(new Date(), 7),
    startPlaceholder: "Start Date",
    endPlaceholder: "End Date",
    format: "yyyy-MM-dd",
    locale: zhCN,
  },
  render: (args) => <DateRangeDemo {...args} />,
}

/**
 * Internationalization: Demonstrates comprehensive multi-language support.
 * - Shows DateRangeInput working with Chinese, English, Japanese, and Korean locales.
 * - Displays locale-specific date formats and placeholder text.
 * - Demonstrates proper range calculation display in multiple languages.
 */
export const Internationalization: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 font-medium">中文 (zh-CN)</h3>
        <DateRangeDemo
          locale={zhCN}
          startValue={new Date()}
          endValue={addDays(new Date(), 7)}
          startPlaceholder="开始日期"
          endPlaceholder="结束日期"
          format="yyyy年MM月dd日"
        />
        <div className="mt-2 text-sm text-gray-500">范围显示：7 天</div>
      </div>

      <div>
        <h3 className="mb-4 font-medium">English (en-US)</h3>
        <DateRangeDemo
          locale={enUS}
          startValue={new Date()}
          endValue={addDays(new Date(), 7)}
          startPlaceholder="Start Date"
          endPlaceholder="End Date"
          format="MM/dd/yyyy"
        />
        <div className="mt-2 text-sm text-gray-500">Range display: 7 days</div>
      </div>

      <div>
        <h3 className="mb-4 font-medium">日本語 (ja)</h3>
        <DateRangeDemo
          locale={ja}
          startValue={new Date()}
          endValue={addDays(new Date(), 7)}
          startPlaceholder="開始日"
          endPlaceholder="終了日"
          format="yyyy/MM/dd"
        />
        <div className="mt-2 text-sm text-gray-500">範囲表示：7日</div>
      </div>

      <div>
        <h3 className="mb-4 font-medium">한국어 (ko)</h3>
        <DateRangeDemo
          locale={ko}
          startValue={new Date()}
          endValue={addDays(new Date(), 7)}
          startPlaceholder="시작일"
          endPlaceholder="종료일"
          format="yyyy.MM.dd"
        />
        <div className="mt-2 text-sm text-gray-500">범위 표시：7일</div>
      </div>
    </div>
  ),
}

/**
 * DifferentFormats: Demonstrates various date format options and their visual representation.
 * - Shows ISO format, American format, Chinese format, and European format.
 * - Displays how different formats affect the display and input experience.
 * - Useful for understanding format flexibility and regional preferences.
 */
export const DifferentFormats: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 font-medium">ISO Format (yyyy-MM-dd)</h3>
        <DateRangeDemo
          format="yyyy-MM-dd"
          startValue={new Date()}
          endValue={addDays(new Date(), 3)}
          locale={enUS}
        />
      </div>

      <div>
        <h3 className="mb-4 font-medium">American Format (MM/dd/yyyy)</h3>
        <DateRangeDemo
          format="MM/dd/yyyy"
          startValue={new Date()}
          endValue={addDays(new Date(), 3)}
          locale={enUS}
        />
      </div>

      <div>
        <h3 className="mb-4 font-medium">Chinese Format (yyyy年MM月dd日)</h3>
        <DateRangeDemo
          format="yyyy年MM月dd日"
          startValue={new Date()}
          endValue={addDays(new Date(), 3)}
          locale={zhCN}
        />
      </div>

      <div>
        <h3 className="mb-4 font-medium">European Format (dd.MM.yyyy)</h3>
        <DateRangeDemo
          format="dd.MM.yyyy"
          startValue={new Date()}
          endValue={addDays(new Date(), 3)}
          locale={enUS}
        />
      </div>
    </div>
  ),
}

/**
 * CommonScenarios: Demonstrates real-world usage scenarios for DateRangeInput.
 * - Shows holiday planning, data analysis periods, and event scheduling examples.
 * - Displays practical applications with appropriate date ranges and contexts.
 * - Useful for understanding when and how to implement date range selection.
 */
export const CommonScenarios: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 font-medium">🏖️ Holiday Planning</h3>
        <DateRangeDemo
          startValue={addDays(new Date(), 30)}
          endValue={addDays(new Date(), 37)}
          startPlaceholder="Holiday Start"
          endPlaceholder="Holiday End"
          locale={zhCN}
          format="yyyy年MM月dd日"
        />
        <div className="text-secondary-foreground mt-2">
          💡 Planning a week-long holiday, displaying the total number of days
        </div>
      </div>

      <div>
        <h3 className="mb-4 font-medium">📊 Data Analysis Period</h3>
        <DateRangeDemo
          startValue={subDays(new Date(), 30)}
          endValue={new Date()}
          startPlaceholder="Start Period"
          endPlaceholder="End Period"
          locale={enUS}
          format="yyyy-MM-dd"
        />
        <div className="text-secondary-foreground mt-2">
          💡 Data analysis period for the past 30 days
        </div>
      </div>

      <div>
        <h3 className="mb-4 font-medium">🎫 Event Time</h3>
        <DateRangeDemo
          startValue={addDays(new Date(), 15)}
          endValue={addDays(new Date(), 17)}
          startPlaceholder="活動開始"
          endPlaceholder="活動終了"
          locale={ja}
          format="yyyy/MM/dd"
        />
        <div className="text-secondary-foreground mt-2">
          💡 3-day event period, Japanese environment
        </div>
      </div>
    </div>
  ),
}

/**
 * EdgeCases: Demonstrates how DateRangeInput handles boundary and edge cases.
 * - Shows same time point handling, reverse time ranges, and cross-year ranges.
 * - Displays proper validation and calculation behavior in unusual scenarios.
 * - Useful for understanding component robustness and error handling.
 */
export const EdgeCases: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 font-medium">Same Time Point</h3>
        <DateRangeDemo
          startValue={new Date()}
          endValue={new Date()}
          locale={enUS}
        />
        <div className="text-secondary-foreground mt-2">
          💡 Display as 1 day at the same time point
        </div>
      </div>

      <div>
        <h3 className="mb-4 font-medium">Reverse Time Range</h3>
        <DateRangeDemo
          startValue={addDays(new Date(), 5)}
          endValue={new Date()}
          locale={enUS}
        />
        <div className="text-secondary-foreground mt-2">
          💡 Display the absolute difference in reverse range
        </div>
      </div>

      <div>
        <h3 className="mb-4 font-medium">Cross-year Range</h3>
        <DateRangeDemo
          startValue={new Date("2024-12-25")}
          endValue={new Date("2025-01-05")}
          locale={zhCN}
          format="yyyy年MM月dd日"
        />
        <div className="text-secondary-foreground mt-2">
          💡 Calculating the cross-year date range
        </div>
      </div>
    </div>
  ),
}

/**
 * DisabledStates: Demonstrates various disabled state configurations.
 * - Shows individual input field disabling (start only, end only, or both).
 * - Displays how disabled states affect user interaction and visual appearance.
 * - Useful for implementing conditional form controls and readonly scenarios.
 */
export const DisabledStates: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 font-medium">Start Date Disabled</h3>
        <DateRangeDemo
          startValue={new Date()}
          endValue={addDays(new Date(), 7)}
          startDisabled={true}
          locale={enUS}
        />
      </div>

      <div>
        <h3 className="mb-4 font-medium">End Date Disabled</h3>
        <DateRangeDemo
          startValue={new Date()}
          endValue={addDays(new Date(), 7)}
          endDisabled={true}
          locale={enUS}
        />
      </div>

      <div>
        <h3 className="mb-4 font-medium">All Disabled</h3>
        <DateRangeDemo
          startValue={new Date()}
          endValue={addDays(new Date(), 7)}
          startDisabled={true}
          endDisabled={true}
          locale={enUS}
        />
      </div>
    </div>
  ),
}
