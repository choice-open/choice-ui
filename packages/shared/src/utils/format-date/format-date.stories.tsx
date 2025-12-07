import type { Meta, StoryObj } from "@storybook/react"
import React, { useState, useEffect } from "react"
import {
  formatRelativeTime,
  createDateFormatter,
  formatSimpleDate,
  formatTime,
} from "./format-date"
import type { FormatRelativeTimeOptions, SupportedLanguage } from "./format-date.types"

// Mock component to demonstrate the formatting utilities
const DateFormattingDemo = ({
  date,
  options = {},
}: {
  date: Date
  options?: FormatRelativeTimeOptions
}) => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const relativeResult = formatRelativeTime(date, {
    ...options,
    timezone: {
      ...options.timezone,
      referenceTime: currentTime,
    },
  })

  const simpleResult = formatSimpleDate(date, options)
  const timeResult = formatTime(date, options)

  return (
    <div className="bg-default-background space-y-4 rounded-lg border p-4">
      <div className="text-secondary-foreground">
        <strong>Input Date:</strong> {date.toISOString()}
      </div>
      <div className="text-secondary-foreground">
        <strong>Current Time:</strong> {currentTime.toISOString()}
      </div>

      <div className="space-y-2">
        <div className="bg-secondary-background rounded p-2">
          <strong>Relative Time:</strong>
          <div className="text-body-large-strong">{relativeResult}</div>
        </div>

        <div className="bg-secondary-background rounded p-2">
          <strong>Simple Date:</strong>
          <div className="text-body-large-strong">{simpleResult}</div>
        </div>

        <div className="bg-secondary-background rounded p-2">
          <strong>Time Only:</strong>
          <div className="text-body-large-strong">{timeResult}</div>
        </div>
      </div>
    </div>
  )
}

// Language comparison component
const LanguageComparison = ({ date }: { date: Date }) => {
  const languages: SupportedLanguage[] = [
    "en",
    "cn",
    "ja",
    "ko",
    "es",
    "fr",
    "de",
    "pt",
    "ru",
    "ar",
  ]

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {languages.map((language) => (
        <div
          key={language}
          className="bg-secondary-background rounded-lg border p-4"
        >
          <div className="text-secondary-foreground font-strong mb-2">{language.toUpperCase()}</div>
          <div className="space-y-1">
            <div>{formatRelativeTime(date, { language })}</div>
            <div className="text-secondary-foreground">{formatSimpleDate(date, { language })}</div>
            <div className="text-secondary-foreground">{formatTime(date, { language })}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Demo of all formatting modes
const FormattingModes = ({ date }: { date: Date }) => {
  const modes = [
    { name: "Default Relative", options: {} },
    { name: "Show Specific Time", options: { showSpecificTime: true } },
    { name: "Force Numeric", options: { forceNumericFormat: true } },
    { name: "Custom Threshold (30 days)", options: { daysThreshold: 30 } },
    { name: "Year Threshold (2 years)", options: { yearThreshold: 2 } },
    {
      name: "Custom Formats",
      options: {
        customFormat: {
          fullDate: "dd/MM/yyyy",
          monthDay: "MMM dd",
          time: "HH:mm:ss",
        },
      },
    },
  ] as const

  return (
    <div className="space-y-4">
      {modes.map((mode) => (
        <div
          key={mode.name}
          className="rounded-lg border p-4"
        >
          <div className="text-secondary-foreground font-strong mb-2">{mode.name}</div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <div className="text-secondary-foreground">English</div>
              <div>{formatRelativeTime(date, { ...mode.options, language: "en" })}</div>
            </div>
            <div>
              <div className="text-secondary-foreground">中文</div>
              <div>{formatRelativeTime(date, { ...mode.options, language: "cn" })}</div>
            </div>
            <div>
              <div className="text-secondary-foreground">日本語</div>
              <div>{formatRelativeTime(date, { ...mode.options, language: "ja" })}</div>
            </div>
            <div>
              <div className="text-secondary-foreground">한국어</div>
              <div>{formatRelativeTime(date, { ...mode.options, language: "ko" })}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Custom formatter demo
const CustomFormatterDemo = () => {
  const chineseFormatter = createDateFormatter({
    language: "cn",
    daysThreshold: 14,
    showSpecificTime: true,
  })

  const englishFormatter = createDateFormatter({
    language: "en",
    customFormat: {
      fullDate: "MMMM do, yyyy",
      time: "h:mm a",
    },
  })

  const dates = [
    new Date(), // now
    new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-body-large-strong mb-4">
          Chinese Formatter (14 day threshold, specific time)
        </h3>
        <div className="space-y-2">
          {dates.map((date, index) => (
            <div
              key={index}
              className="bg-secondary-background rounded p-2"
            >
              <div className="text-secondary-foreground">{date.toLocaleString()}</div>
              <div className="font-strong">{chineseFormatter(date)}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-body-large-strong mb-4">English Formatter (custom formats)</h3>
        <div className="space-y-2">
          {dates.map((date, index) => (
            <div
              key={index}
              className="bg-secondary-background rounded p-2"
            >
              <div className="text-secondary-foreground">{date.toLocaleString()}</div>
              <div className="font-strong">{englishFormatter(date)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const meta: Meta<typeof DateFormattingDemo> = {
  title: "Utils/Date Formatting",
  component: DateFormattingDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A comprehensive internationalized date formatting utility that supports:

- **10 languages**: English, Chinese, Japanese, Korean, Spanish, French, German, Portuguese, Russian, Arabic
- **Multiple formats**: Relative time, specific time display, simple dates
- **Customizable thresholds**: Configure when to switch between relative and absolute formats
- **Timezone support**: UTC handling and custom reference times
- **Custom formats**: Define your own date/time display patterns
- **Performance optimized**: Cached language configurations

## Key Functions

- \`formatRelativeTime(date, options)\` - Main formatting function with full customization
- \`createDateFormatter(defaultOptions)\` - Create reusable formatter with default settings
- \`formatSimpleDate(date, options)\` - Simple date formatting
- \`formatTime(date, options)\` - Time-only formatting

## Examples

\`\`\`typescript
// Basic usage
formatRelativeTime(new Date()) // "a few seconds ago"

// Chinese locale
formatRelativeTime(date, { language: "cn" }) // "几秒前"

// Show specific time for recent dates
formatRelativeTime(date, { showSpecificTime: true }) // "Today at 2:30 PM"

// Custom thresholds
formatRelativeTime(oldDate, {
  daysThreshold: 30,
  yearThreshold: 2
})

// Custom formatter
const formatter = createDateFormatter({ language: "cn" })
formatter(date) // Uses Chinese by default
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    date: {
      control: "date",
      description: "The date to format",
    },
    options: {
      control: "object",
      description: "Formatting options",
    },
  },
}

export default meta
type Story = StoryObj<typeof DateFormattingDemo>

// Basic story with current time
export const LiveDemo: Story = {
  args: {
    date: new Date(),
    options: {
      language: "en",
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Live demonstration showing real-time relative formatting. The relative time updates every second.",
      },
    },
  },
}

// Different time periods
export const FiveMinutesAgo: Story = {
  args: {
    date: new Date(Date.now() - 5 * 60 * 1000),
    options: { language: "en" },
  },
}

export const TwoHoursAgo: Story = {
  args: {
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    options: { language: "en" },
  },
}

export const Yesterday: Story = {
  args: {
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    options: { language: "en" },
  },
}

export const OneWeekAgo: Story = {
  args: {
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    options: { language: "en" },
  },
}

export const OneMonthAgo: Story = {
  args: {
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    options: { language: "en" },
  },
}

export const OneYearAgo: Story = {
  args: {
    date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    options: { language: "en" },
  },
}

// Language examples
export const ChineseLocale: Story = {
  args: {
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    options: { language: "cn" },
  },
  parameters: {
    docs: {
      description: {
        story: "Demonstrates Chinese locale formatting with appropriate cultural conventions.",
      },
    },
  },
}

export const JapaneseLocale: Story = {
  args: {
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    options: { language: "ja" },
  },
}

export const SpanishLocale: Story = {
  args: {
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    options: { language: "es" },
  },
}

// Feature demonstrations
export const SpecificTimeMode: Story = {
  args: {
    date: new Date(Date.now() - 3 * 60 * 60 * 1000),
    options: {
      language: "en",
      showSpecificTime: true,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "When `showSpecificTime` is enabled, shows 'Today at 2:30 PM' style formatting for recent dates.",
      },
    },
  },
}

export const CustomThresholds: Story = {
  args: {
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    options: {
      language: "en",
      daysThreshold: 30,
      yearThreshold: 2,
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Custom thresholds control when to switch from relative time to absolute dates.",
      },
    },
  },
}

export const ForceNumericFormat: Story = {
  args: {
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    options: {
      language: "en",
      forceNumericFormat: true,
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Forces numeric date formats (MM/dd) instead of text-based formats (January 15).",
      },
    },
  },
}

export const CustomFormats: Story = {
  args: {
    date: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000),
    options: {
      language: "en",
      customFormat: {
        fullDate: "EEEE, MMMM do, yyyy",
        monthDay: "MMM dd",
        time: "h:mm:ss a",
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Custom format strings allow complete control over date/time display patterns.",
      },
    },
  },
}

export const TimezoneHandling: Story = {
  args: {
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    options: {
      language: "en",
      timezone: {
        useUTC: true,
        referenceTime: new Date(),
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Timezone options allow for UTC calculations and custom reference times.",
      },
    },
  },
}

// Comprehensive comparison stories
export const AllLanguagesComparison: Story = {
  render: () => <LanguageComparison date={new Date(Date.now() - 2 * 60 * 60 * 1000)} />,
  parameters: {
    docs: {
      description: {
        story: "Side-by-side comparison of all 10 supported languages formatting the same date.",
      },
    },
  },
}

export const AllFormattingModes: Story = {
  render: () => <FormattingModes date={new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)} />,
  parameters: {
    docs: {
      description: {
        story: "Demonstrates all major formatting modes and options available.",
      },
    },
  },
}

export const CustomFormatterExamples: Story = {
  render: () => <CustomFormatterDemo />,
  parameters: {
    docs: {
      description: {
        story: "Examples of creating reusable formatters with predefined configurations.",
      },
    },
  },
}

// Edge cases and error handling
export const InvalidDate: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="rounded-lg border bg-red-50 p-4">
        <strong>Invalid Date Input:</strong>
        <div className="mt-2">{formatRelativeTime(new Date("invalid date"))}</div>
      </div>
      <div className="rounded-lg border bg-red-50 p-4">
        <strong>Null Input:</strong>
        <div className="mt-2">{formatRelativeTime(null as unknown as Date)}</div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Demonstrates graceful error handling for invalid date inputs.",
      },
    },
  },
}

export const FutureDates: Story = {
  render: () => (
    <div className="space-y-4">
      {[
        { name: "In 5 minutes", date: new Date(Date.now() + 5 * 60 * 1000) },
        { name: "In 2 hours", date: new Date(Date.now() + 2 * 60 * 60 * 1000) },
        { name: "Tomorrow", date: new Date(Date.now() + 24 * 60 * 60 * 1000) },
        { name: "Next week", date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      ].map((item) => (
        <div
          key={item.name}
          className="rounded-lg border bg-blue-50 p-4"
        >
          <strong>{item.name}:</strong>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div>
              <div className="text-secondary-foreground">English</div>
              <div>{formatRelativeTime(item.date, { language: "en" })}</div>
            </div>
            <div>
              <div className="text-secondary-foreground">中文</div>
              <div>{formatRelativeTime(item.date, { language: "cn" })}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Shows how the utility handles future dates and times.",
      },
    },
  },
}
