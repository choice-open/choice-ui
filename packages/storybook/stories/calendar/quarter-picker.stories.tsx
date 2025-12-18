import type { Quarter, QuarterCalendarProps } from "@choice-ui/react"
import { formatQuarter, getCurrentQuarter, QuarterCalendar } from "@choice-ui/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { useState } from "react"

// 辅助组件
const QuarterCalendarDemo = (args: QuarterCalendarProps) => {
  const [selectedQuarter, setSelectedQuarter] = useState<Quarter | null>(
    args.value ?? getCurrentQuarter(args.currentYear, args.locale),
  )

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <QuarterCalendar
          {...args}
          value={selectedQuarter}
          onChange={setSelectedQuarter}
          className="w-48 rounded-xl border"
        />
        <QuarterCalendar
          {...args}
          value={selectedQuarter}
          onChange={setSelectedQuarter}
          className="w-48 rounded-xl border"
          variant="dark"
        />
      </div>
      <div className="text-secondary-foreground">
        Selected quarter: {selectedQuarter ? formatQuarter(selectedQuarter) : "None"}
      </div>
    </div>
  )
}

const ComparisonDemo = (args: QuarterCalendarProps) => {
  const [zhQuarter, setZhQuarter] = useState<Quarter | null>(
    getCurrentQuarter(args.currentYear, "zh-CN"),
  )
  const [enQuarter, setEnQuarter] = useState<Quarter | null>(
    getCurrentQuarter(args.currentYear, "en-US"),
  )

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-body-large-strong mb-4">Chinese</h3>
        <div className="space-y-2">
          <QuarterCalendar
            {...args}
            value={zhQuarter}
            locale="zh-CN"
            onChange={setZhQuarter}
          />
          <div className="text-secondary-foreground">
            Selected quarter: {zhQuarter ? formatQuarter(zhQuarter) : "None"}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-body-large-strong mb-4">English</h3>
        <div className="space-y-2">
          <QuarterCalendar
            {...args}
            value={enQuarter}
            locale="en-US"
            onChange={setEnQuarter}
          />
          <div className="text-secondary-foreground">
            Selected quarter: {enQuarter ? formatQuarter(enQuarter) : "None"}
          </div>
        </div>
      </div>
    </div>
  )
}

// 单个语言的季度选择器组件
const LocaleQuarterCalendar: React.FC<{
  args: QuarterCalendarProps
  locale: { code: string; name: string }
}> = ({ locale, args }) => {
  const [quarter, setQuarter] = useState<Quarter | null>(
    getCurrentQuarter(args.currentYear, locale.code),
  )

  return (
    <div>
      <h3 className="text-body-large-strong mb-4">{locale.name}</h3>
      <div className="space-y-2">
        <QuarterCalendar
          {...args}
          value={quarter}
          locale={locale.code}
          onChange={setQuarter}
          className="w-48 rounded-xl border"
        />
        <div className="text-secondary-foreground">
          Selected quarter: {quarter ? formatQuarter(quarter) : "None"}
        </div>
      </div>
    </div>
  )
}

const MultiLanguageDemo = (args: QuarterCalendarProps) => {
  const locales = [
    { code: "zh-CN", name: "中文" },
    { code: "en-US", name: "English" },
    { code: "ja-JP", name: "日本語" },
    { code: "ko-KR", name: "한국어" },
    { code: "fr-FR", name: "Français" },
    { code: "de-DE", name: "Deutsch" },
  ]

  return (
    <div className="grid grid-cols-2 gap-6">
      {locales.map((locale) => (
        <LocaleQuarterCalendar
          key={locale.code}
          locale={locale}
          args={args}
        />
      ))}
    </div>
  )
}

const meta: Meta<typeof QuarterCalendar> = {
  title: "DateAndTime/QuarterCalendar",
  component: QuarterCalendar,
  parameters: {
    layout: "centered",
  },
  tags: ["new", "autodocs"],
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * `QuarterCalendar` is a specialized calendar component for selecting quarters (Q1, Q2, Q3, Q4) within a year.
 *
 * Features:
 * - Intuitive quarter selection with visual quarter representation
 * - Year navigation with customizable year range limits
 * - Comprehensive internationalization support with locale-specific formatting
 * - Disabled state support for entire component or specific quarters
 * - Light and dark theme variants
 * - Accessible keyboard navigation and screen reader support
 * - Current quarter highlighting and selection state management
 * - Flexible styling and customization options
 *
 * Usage:
 * - Use for quarterly reporting, financial period selection, or seasonal planning
 * - Ideal for business applications requiring quarter-based data filtering
 * - Combine with other calendar components for comprehensive date selection
 * - Leverage internationalization for global business applications
 *
 * Best Practices:
 * - Provide clear visual feedback for selected quarters
 * - Use consistent quarter labeling across your application
 * - Consider business context when setting year ranges
 * - Test with multiple locales for international compatibility
 *
 * Accessibility:
 * - Full keyboard navigation with arrow keys and enter/space selection
 * - Screen reader friendly with proper ARIA labels and descriptions
 * - High contrast support for disabled and selected states
 * - Semantic HTML structure for optimal accessibility
 */

const currentYear = new Date().getFullYear()

/**
 * Default: Shows the basic QuarterCalendar usage with standard configuration.
 * - Demonstrates quarter selection with both light and dark variants side by side.
 * - Uses English locale and current year as defaults.
 * - Provides a foundation for quarter selection implementation.
 */
export const Basic: Story = {
  args: {
    currentYear,
    locale: "en-US",
    disabled: false,
  },
  render: (args) => <QuarterCalendarDemo {...args} />,
}

/**
 * WithRange: Demonstrates QuarterCalendar with year range restrictions.
 * - Shows how to limit selectable years to a specific range (current year ±2).
 * - Displays navigation boundaries and how they affect user interaction.
 * - Useful for applications with relevant time period constraints.
 */
export const WithRange: Story = {
  args: {
    currentYear,
    minYear: currentYear - 2,
    maxYear: currentYear + 2,
    locale: "zh-CN",
    disabled: false,
  },
  render: (args) => <QuarterCalendarDemo {...args} />,
}

/**
 * WithDisabledQuarters: Demonstrates selective quarter disabling functionality.
 * - Shows how to disable specific quarters (Q1 and Q3 in this example).
 * - Displays visual and functional differences for disabled quarters.
 * - Useful for restricting selection based on business rules or data availability.
 */
export const WithDisabledQuarters: Story = {
  args: {
    currentYear,
    disabledQuarters: [
      { quarter: 1, year: currentYear },
      { quarter: 3, year: currentYear },
    ],
    locale: "zh-CN",
    disabled: false,
  },
  render: (args) => <QuarterCalendarDemo {...args} />,
}

/**
 * Disabled: Demonstrates the completely disabled state of QuarterCalendar.
 * - Shows how the entire component appears and behaves when disabled.
 * - Displays proper disabled styling and interaction prevention.
 * - Useful for readOnly scenarios or when quarter selection is not applicable.
 */
export const Disabled: Story = {
  args: {
    currentYear,
    locale: "zh-CN",
    disabled: true,
  },
  render: (args) => <QuarterCalendarDemo {...args} />,
}

/**
 * WithSelectedQuarter: Demonstrates QuarterCalendar with a pre-selected quarter.
 * - Shows Q2 as initially selected with Chinese locale formatting.
 * - Displays how selected state is visually represented and maintained.
 * - Useful for forms or interfaces that need default quarter selections.
 */
export const WithSelectedQuarter: Story = {
  args: {
    currentYear,
    value: {
      quarter: 2,
      year: currentYear,
      label: "第二季度",
      months: ["四月", "五月", "六月"],
    },
    locale: "zh-CN",
    disabled: false,
  },
  render: (args) => <QuarterCalendarDemo {...args} />,
}

/**
 * DarkVariant: Demonstrates the dark theme styling of QuarterCalendar.
 * - Shows the component optimized for dark backgrounds and themes.
 * - Displays proper contrast and accessibility in dark mode.
 * - Useful for applications with dark UI themes or night mode functionality.
 */
export const DarkVariant: Story = {
  args: {
    currentYear,
    locale: "zh-CN",
    variant: "dark",
    disabled: false,
  },
  render: (args) => (
    <div className="rounded-xl bg-slate-900 p-4">
      <QuarterCalendarDemo {...args} />
    </div>
  ),
}

/**
 * Comparison: Demonstrates side-by-side comparison of Chinese and English locales.
 * - Shows how quarter labels and formatting differ between languages.
 * - Displays independent selection states for each locale variant.
 * - Useful for understanding localization differences and testing scenarios.
 */
export const Comparison: Story = {
  args: {
    currentYear,
    disabled: false,
  },
  render: (args) => <ComparisonDemo {...args} />,
}

/**
 * MultiLanguage: Demonstrates comprehensive internationalization support.
 * - Shows QuarterCalendar in 6 different languages (Chinese, English, Japanese, Korean, French, German).
 * - Displays locale-specific quarter formatting and labeling.
 * - Useful for testing international compatibility and understanding localization features.
 */
export const MultiLanguage: Story = {
  args: {
    currentYear,
    disabled: false,
  },
  render: (args) => <MultiLanguageDemo {...args} />,
}

/**
 * ReadOnly: Demonstrates the QuarterCalendar component in readOnly mode.
 * - Prevents value changes while allowing focus and navigation
 * - Maintains normal visual appearance (unlike disabled)
 * - Useful for displaying non-editable quarter information
 */
export const ReadOnly: Story = {
  render: function ReadOnlyStory() {
    const currentYear = new Date().getFullYear()
    const [value, setValue] = useState<Quarter | null>({
      quarter: 1,
      year: 2024,
      label: "Q1",
      months: ["January", "February", "March"],
    })
    const [changeCount, setChangeCount] = useState(0)

    const handleChange = (newValue: Quarter | null) => {
      setValue(newValue)
      setChangeCount((prev) => prev + 1)
    }

    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border bg-stone-50 p-4">
          <div className="text-body-small-strong mb-2 text-stone-700">Current Value:</div>
          <div className="text-body-small font-mono text-stone-600">
            {value ? `Q${value.quarter} ${value.year}` : "null"}
          </div>
          <div className="text-body-small-strong mt-2 text-stone-700">Change Count:</div>
          <div className="text-body-small font-mono text-stone-600">{changeCount}</div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <QuarterCalendar
            readOnly
            value={value}
            onChange={handleChange}
            currentYear={currentYear}
          />
          <QuarterCalendar
            value={value}
            onChange={handleChange}
            currentYear={currentYear}
          />
        </div>
        <div className="text-body-small text-stone-600">
          💡 Try clicking quarters on the readonly calendar - the value should not change and the
          change count should remain at 0. Only the normal calendar will change the value.
        </div>
      </div>
    )
  },
}
