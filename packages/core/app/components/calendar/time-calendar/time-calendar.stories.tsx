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
  tags: ["new", "autodocs"],
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * `TimeCalendar` is a specialized calendar component for time selection with customizable time steps and formats.
 *
 * Features:
 * - Scrollable time list with configurable step intervals (1, 5, 15, 30 minutes)
 * - Support for both 12-hour and 24-hour time formats
 * - Intelligent handling of values outside step ranges
 * - Smooth scrolling and keyboard navigation
 * - Controlled and uncontrolled modes
 * - Customizable time format strings
 * - Compact vertical layout optimized for popovers
 * - Accessibility support with proper ARIA labels
 * - Today's current time highlighting
 *
 * Usage:
 * - Use in time picker popovers and dropdowns
 * - Ideal for scheduling applications and time-based forms
 * - Combine with time input components for complete time selection
 * - Perfect for appointment booking and event scheduling
 *
 * Best Practices:
 * - Choose appropriate step intervals based on use case precision
 * - Use 24-hour format for international applications
 * - Consider 12-hour format for US-focused applications
 * - Provide reasonable default values for better UX
 *
 * Accessibility:
 * - Full keyboard navigation with arrow keys and page up/down
 * - Screen reader friendly with proper time announcements
 * - Focus management and proper ARIA roles
 * - High contrast support for all time entries
 */

/**
 * Default: Shows the basic TimeCalendar with 24-hour format and 15-minute steps.
 * - Demonstrates standard time selection with scrollable list interface.
 * - Uses 24-hour format (HH:mm) with 15-minute intervals.
 * - Shows selected time display and state management.
 */
export const Default: Story = {
  args: {
    format: "HH:mm",
    step: 15,
  },
  render: (args) => <SingleColumnDemo {...args} />,
}

/**
 * TwelveHourFormat: Demonstrates 12-hour time format with AM/PM indicators.
 * - Shows time selection using 12-hour format with AM/PM suffix.
 * - Maintains 15-minute step intervals in 12-hour display.
 * - Useful for applications targeting US users or 12-hour time preferences.
 */
export const TwelveHourFormat: Story = {
  args: {
    format: "h:mm a",
    step: 15,
  },
  render: (args) => <SingleColumnDemo {...args} />,
}

/**
 * CustomSteps: Demonstrates 30-minute step intervals for broader time selection.
 * - Shows time selection with 30-minute intervals instead of default 15-minute.
 * - Useful for applications with less precise time requirements.
 * - Reduces list length for faster navigation in broad time ranges.
 */
export const CustomSteps: Story = {
  args: {
    format: "HH:mm",
    step: 30,
  },
  render: (args) => <SingleColumnDemo {...args} />,
}

/**
 * PreciseMinutes: Demonstrates 5-minute step intervals for precise time selection.
 * - Shows time selection with 5-minute intervals for high precision.
 * - Ideal for applications requiring detailed time scheduling.
 * - Provides more granular control over time selection.
 */
export const PreciseMinutes: Story = {
  args: {
    format: "HH:mm",
    step: 5,
  },
  render: (args) => <SingleColumnDemo {...args} />,
}

/**
 * SpecialValue: Demonstrates handling of times outside the configured step range.
 * - Shows how the component handles 14:37 with 15-minute steps.
 * - Displays special values that don't align with step intervals.
 * - Useful for understanding flexible time value handling.
 */
export const SpecialValue: Story = {
  args: {
    format: "HH:mm",
    step: 15,
  },
  render: (args) => <SpecialValueDemo {...args} />,
}

/**
 * Uncontrolled: Demonstrates uncontrolled mode with default value.
 * - Shows TimeCalendar operating in uncontrolled mode with defaultValue.
 * - Useful for simple implementations without external state management.
 * - Demonstrates internal state handling and default value setting.
 */
export const Uncontrolled: Story = {
  args: {
    format: "HH:mm",
    step: 15,
  },
  render: (args) => <UncontrolledDemo {...args} />,
}
