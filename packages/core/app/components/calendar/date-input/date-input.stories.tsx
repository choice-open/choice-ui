import { FieldTypeDateAndTime, ArrowRight } from "@choiceform/icons-react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { addDays, isToday, Locale } from "date-fns"
import { de, enUS, fr, zhCN } from "date-fns/locale"
import React, { useRef, useState } from "react"
import { MonthCalendar } from "../../calendar"
import { Panel } from "../../panel"
import { Popover } from "../../popover"
import { Select } from "../../select"
import { DateRangeInput } from "../date-range-input"
import type { CalendarValue, DateFormat } from "../types"
import { LOCALE_MAP } from "../utils/locale"
import { DateInput } from "./date-input"
import { TextField } from "../../text-field"

const meta: Meta<typeof DateInput> = {
  title: "DateAndTime/DateInput",
  component: DateInput,
  parameters: {
    layout: "centered",
  },
  tags: ["new"],
}

export default meta
type Story = StoryObj<typeof meta>

// 基础用法
export const Basic: Story = {
  render: (args) => <DateInput {...args} />,
}

// 状态演示
export const States: Story = {
  render: () => (
    <div className="space-y-4">
      <DateInput placeholder="Enter time...">
        <TextField.Label>Normal</TextField.Label>
      </DateInput>

      <DateInput
        disabled
        value={new Date()}
        placeholder="Disabled state"
      >
        <TextField.Label>Disabled</TextField.Label>
      </DateInput>

      <DateInput
        readOnly
        value={new Date()}
        placeholder="Readonly state"
      >
        <TextField.Label>Readonly</TextField.Label>
      </DateInput>

      <DateInput
        prefixElement={null}
        placeholder="No icon"
      >
        <TextField.Label>No prefix icon</TextField.Label>
      </DateInput>

      <DateInput
        prefixElement={<FieldTypeDateAndTime className="text-accent-foreground" />}
        placeholder="Custom prefix"
      >
        <TextField.Label>Custom prefix</TextField.Label>
      </DateInput>
    </div>
  ),
}

export const Size: Story = {
  render: function Render() {
    const [value, setValue] = useState<Date | null>(null)
    return (
      <div className="space-y-4">
        <DateInput
          size="large"
          value={value}
          onChange={setValue}
        />
      </div>
    )
  },
}

export const Variable: Story = {
  render: function Render() {
    const [value, setValue] = useState<Date | null>(null)
    return (
      <div className="bg-gray-800 p-8">
        <DateInput
          variant="dark"
          value={value}
          onChange={setValue}
        />
      </div>
    )
  },
}

// 键盘导航演示
export const KeyboardNavigation: Story = {
  render: function Render() {
    const [value, setValue] = useState<Date | null>(null)
    return (
      <div className="space-y-4">
        <DateInput
          placeholder="Use keyboard to adjust date"
          value={value}
          onChange={setValue}
        />
        <div className="text-secondary-foreground space-y-2 rounded-md border p-2">
          <div className="font-medium">⌨️ Keyboard Navigation</div>
          <div>
            • <code>↑</code> / <code>↓</code> - Adjust 1 day
          </div>
          <div>
            • <code>Shift + ↑/↓</code> - Adjust 1 week
          </div>
          <div>
            • <code>Ctrl/Cmd + ↑/↓</code> - Adjust 1 month
          </div>
          <div>
            • <code>Enter</code> - Confirm input
          </div>
        </div>
      </div>
    )
  },
}

// 拖拽交互演示
export const DragInteraction: Story = {
  render: function Render() {
    const [value, setValue] = useState<Date | null>(null)
    return (
      <div className="space-y-4">
        <DateInput
          placeholder="Use drag to adjust date"
          value={value}
          onChange={setValue}
        />
        <div className="text-secondary-foreground space-y-2 rounded-md border p-2">
          <div className="font-medium">🖱️ Drag Interaction</div>
          <div>• Click and drag the calendar icon to adjust date</div>
          <div>• Hold Shift key to drag 1 week</div>
          <div>• Hold Ctrl/Cmd key to drag 1 month</div>
        </div>
      </div>
    )
  },
}

// 不同格式演示
export const Formats: Story = {
  render: function Render() {
    const [value, setValue] = useState<Date | null>(new Date())

    return (
      <div className="grid grid-cols-2 gap-4">
        <DateInput
          format="yyyy-MM-dd"
          value={value}
          onChange={setValue}
        >
          <TextField.Label>ISO Format: yyyy-MM-dd</TextField.Label>
        </DateInput>

        <DateInput
          format="yyyy年MM月dd日"
          locale={zhCN}
          value={value}
          onChange={setValue}
        >
          <TextField.Label>Format: yyyy年MM月dd日</TextField.Label>
        </DateInput>

        <DateInput
          format="yy年 MMM do eee"
          locale={zhCN}
          value={value}
          onChange={setValue}
        >
          <TextField.Label>Format: yy年 MMM do eee</TextField.Label>
        </DateInput>

        <DateInput
          format="MM/dd/yyyy"
          value={value}
          onChange={setValue}
        >
          <TextField.Label>Format: MM/dd/yyyy</TextField.Label>
        </DateInput>

        <DateInput
          format="EE MM dd ''yy"
          value={value}
          onChange={setValue}
        >
          <TextField.Label>Format: {`EE MM dd 'yy`}</TextField.Label>
        </DateInput>
      </div>
    )
  },
}

const VariableLengthFormatsComponent = ({
  title,
  value,
  onChange,
  format,
  placeholder,
  locale,
}: {
  format: DateFormat
  locale: string
  onChange: (date: Date | null) => void
  placeholder: string
  title: string
  value: Date | null
}) => {
  return (
    <div className="space-y-4 rounded-md border p-4">
      <DateInput
        format={format}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      >
        <TextField.Label className="text-blue-600">{title}</TextField.Label>
      </DateInput>
      <div className="text-secondary-foreground text-xs">
        Format: <code>{format}</code>
        <br />
        Example: {placeholder}
      </div>
      <div className="text-xs text-gray-500">
        Current Value: {value ? value.toLocaleDateString(locale) : "None"}
      </div>
    </div>
  )
}

// 不同长度格式演示
export const VariableLengthFormats: Story = {
  render: function Render() {
    const [longChineseValue, setLongChineseValue] = useState<Date | null>(null)
    const [shortChineseValue, setShortChineseValue] = useState<Date | null>(null)
    const [longEnglishValue, setLongEnglishValue] = useState<Date | null>(null)
    const [shortEnglishValue, setShortEnglishValue] = useState<Date | null>(null)
    const [flexibleChineseValue, setFlexibleChineseValue] = useState<Date | null>(null)
    const [compactValue, setCompactValue] = useState<Date | null>(null)
    const [longFrenchValue, setLongFrenchValue] = useState<Date | null>(null)
    const [longGermanValue, setLongGermanValue] = useState<Date | null>(null)

    return (
      <div className="space-y-8">
        <div className="text-lg font-medium">📏 Variable Length Formats</div>
        <div className="text-secondary-foreground">
          DateInput now supports any date-fns format string, including different length years,
          months, etc.
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[
            {
              title: "🇨🇳 Chinese Long Format",
              format: "yyyy年MM月dd日",
              placeholder: "2025年12月31日",
              value: longChineseValue,
              onChange: setLongChineseValue,
              locale: "zh-CN",
            },
            {
              title: "🇨🇳 Chinese Short Format",
              format: "yy年M月d日",
              placeholder: "25年12月31日",
              value: shortChineseValue,
              onChange: setShortChineseValue,
              locale: "zh-CN",
            },
            {
              title: "🇨🇳 Chinese Flexible Format",
              format: "yyyy年M月d日",
              placeholder: "2025年1月5日",
              value: flexibleChineseValue,
              onChange: setFlexibleChineseValue,
              locale: "zh-CN",
            },
            {
              title: "🇺🇸 English Long Format",
              format: "MMMM dd, yyyy",
              placeholder: "December 25, 2025",
              value: longEnglishValue,
              onChange: setLongEnglishValue,
              locale: "en-US",
            },
            {
              title: "🇺🇸 English Short Format",
              format: "MMM dd, yy",
              placeholder: "Dec 25, 25",
              value: shortEnglishValue,
              onChange: setShortEnglishValue,
              locale: "en-US",
            },
            {
              title: "📱 Compact Format",
              format: "M/d/yy",
              placeholder: "12/25/25",
              value: compactValue,
              onChange: setCompactValue,
              locale: "en-US",
            },
            {
              title: "🇫🇷 Français",
              format: "MMM d yyyy",
              placeholder: "Déc 25 2025",
              value: longFrenchValue,
              onChange: setLongFrenchValue,
              locale: "fr",
            },
            {
              title: "🇩🇪 Deutsch",
              format: "dd.MM.yyyy",
              placeholder: "25.12.2025",
              value: longGermanValue,
              onChange: setLongGermanValue,
              locale: "de",
            },
          ].map((item) => (
            <VariableLengthFormatsComponent
              key={item.title}
              title={item.title}
              format={item.format}
              placeholder={item.placeholder}
              value={item.value}
              onChange={item.onChange}
              locale={item.locale}
            />
          ))}
        </div>

        <div className="space-y-4 rounded-md border p-4">
          <div className="text-secondary-foreground font-medium">📖 Format Description</div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="bg-blue-50">
              <div className="mb-2 font-medium text-blue-800">Year Format</div>
              <div className="space-y-1 text-blue-700">
                <div>
                  <code>yyyy</code> → 2025 (4-digit year)
                </div>
                <div>
                  <code>yy</code> → 25 (2-digit year)
                </div>
              </div>
            </div>

            <div className="bg-green-50">
              <div className="mb-2 font-medium text-green-800">Month Format</div>
              <div className="space-y-1 text-green-700">
                <div>
                  <code>MMMM</code> → December (full month name)
                </div>
                <div>
                  <code>MMM</code> → Dec (short month name)
                </div>
                <div>
                  <code>MM</code> → 12 (2-digit month)
                </div>
                <div>
                  <code>M</code> → 12 (1-2 digit month)
                </div>
              </div>
            </div>

            <div className="bg-purple-50">
              <div className="mb-2 font-medium text-purple-800">Day Format</div>
              <div className="space-y-1 text-purple-700">
                <div>
                  <code>dd</code> → 31 (2-digit day)
                </div>
                <div>
                  <code>d</code> → 31 (1-2 digit day)
                </div>
              </div>
            </div>

            <div className="bg-orange-50">
              <div className="mb-2 font-medium text-orange-800">Separator Format</div>
              <div className="space-y-1 text-orange-700">
                <div>
                  <code>-</code> → 2025-12-31
                </div>
                <div>
                  <code>/</code> → 12/31/2025
                </div>
                <div>
                  <code>.</code> → 31.12.2025
                </div>
                <div>
                  <code>年月日</code> → 2025年12月31日
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-md border p-4">
          <div className="mb-2 font-medium">💡 Usage Tips</div>
          <div className="text-secondary-foreground">
            Now you can use any date-fns format string directly, no longer limited by predefined
            formats. View full format options:
            <a
              href="https://date-fns.org/v2.29.3/docs/format"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-yellow-800 underline hover:text-yellow-900"
            >
              date-fns format documentation
            </a>
          </div>
        </div>
      </div>
    )
  },
}

// 高级功能展示
export const Prediction: Story = {
  args: {
    placeholder: "Try intelligent prediction...",
    format: "yyyy-MM-dd",
    enablePrediction: true,
  },
  render: (args) => (
    <div className="space-y-6">
      <DateInput {...args} />

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <div className="font-medium text-blue-600">🎨 Real-time Highlight</div>
            <div className="text-secondary-foreground space-y-2">
              <div>• Number automatically highlights</div>
              <div>• Shortcut key color change prompt</div>
              <div>• Intelligent recognition of input content</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="font-medium text-purple-600">💡 Intelligent Prediction</div>
            <div className="text-secondary-foreground space-y-2">
              <div>• Real-time prediction prompt box ✅</div>
              <div>• Number format recognition ✅</div>
              <div>• Intelligent completion suggestions ✅</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="font-medium text-green-600">⌨️ Keyboard Interaction</div>
            <div className="text-secondary-foreground space-y-2">
              <div>
                • <kbd className="rounded bg-gray-100 px-1">Enter</kbd> Confirm input
              </div>
              <div>
                • <kbd className="rounded bg-gray-100 px-1">Esc</kbd> Hide prompt
              </div>
              <div>• Automatic formatting when focus is lost</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="font-medium text-orange-600">🔄 Formatting</div>
            <div className="text-secondary-foreground space-y-2">
              <div>• Automatic formatting output</div>
              <div>• Intelligent error correction</div>
              <div>• Real-time content synchronization</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

// 快捷键演示
export const ShortcutKeys: Story = {
  args: {
    placeholder: "Try shortcut keys...",
    format: "yyyy-MM-dd",
  },
  render: (args) => (
    <div className="space-y-6">
      <DateInput {...args} />

      <div className="space-y-4">
        <div className="font-medium">⚡ Shortcut Key Highlight Demo</div>
        <div className="space-y-2 rounded-md border p-2">
          <div>
            <div className="font-medium">Today</div>
            <div className="text-secondary-foreground">
              Input: <code>t</code> or <code>Today</code> or <code>今天</code>
            </div>
          </div>
          <div>
            <div className="font-medium">Yesterday</div>
            <div className="text-secondary-foreground">
              Input: <code>y</code> or <code>Yesterday</code> or <code>昨天</code>
            </div>
          </div>
          <div>
            <div className="font-medium">Tomorrow</div>
            <div className="text-secondary-foreground">
              Input: <code>tm</code> or <code>Tomorrow</code> or <code>明天</code>
            </div>
          </div>
          <div>
            <div className="font-medium">This Week</div>
            <div className="text-secondary-foreground">
              Input: <code>w</code> or <code>This Week</code> or <code>本周</code>
            </div>
          </div>
          <div>
            <div className="font-medium">This Month</div>
            <div className="text-secondary-foreground">
              Input: <code>m</code> or <code>This Month</code> or <code>本月</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

// 英文月份识别演示
export const EnglishMonthSupport: Story = {
  args: {
    placeholder: "Try English month...",
    format: "yyyy-MM-dd",
  },
  render: (args) => (
    <div className="space-y-6">
      <DateInput {...args} />

      <div className="space-y-4">
        <div className="text-lg font-medium">🌍 English Month Recognition</div>

        <div className="space-y-3 rounded-md border p-4">
          <div className="font-medium">📝 支持格式</div>
          <div className="text-secondary-foreground space-y-2">
            <div>
              • <code>may</code> → May 1st
            </div>
            <div>
              • <code>may 15</code> → May 15th
            </div>
            <div>
              • <code>15 may</code> → May 15th
            </div>
            <div>
              • <code>may 15, 2024</code> → May 15th, 2024
            </div>
            <div>
              • <code>15 may 2024</code> → May 15th, 2024
            </div>
            <div>
              • <code>may 15th</code> → May 15th
            </div>
          </div>
        </div>

        <div className="space-y-3 rounded-md border p-4">
          <div className="font-medium">📚 Month Abbreviations</div>
          <div className="text-secondary-foreground space-y-2">
            <div>
              • <code>jan</code> → January
            </div>
            <div>
              • <code>feb</code> → February
            </div>
            <div>
              • <code>mar</code> → March
            </div>
            <div>
              • <code>apr</code> → April
            </div>
            <div>
              • <code>may</code> → May
            </div>
            <div>
              • <code>jun</code> → June
            </div>
            <div>
              • <code>jul</code> → July
            </div>
            <div>
              • <code>aug</code> → August
            </div>
          </div>
        </div>

        <div className="space-y-3 rounded-md border p-4">
          <div className="font-medium">🎯 Intelligent Recognition</div>

          <div>
            <div className="font-medium">Full Name</div>
            <div className="text-secondary-foreground">january, february...</div>
          </div>
          <div>
            <div className="font-medium">Abbreviations</div>
            <div className="text-secondary-foreground">jan, feb, mar...</div>
          </div>
          <div>
            <div className="font-medium">With Dots</div>
            <div className="text-secondary-foreground">jan., feb., mar.</div>
          </div>
          <div>
            <div className="font-medium">Variants</div>
            <div className="text-secondary-foreground">sept, sept.</div>
          </div>
        </div>

        <div className="w-96 rounded-md border p-4">
          <div className="mb-2 font-medium">💡 Tips</div>
          <div className="text-secondary-foreground">
            Support mixed input of English and Chinese, automatically recognize the best match. When
            inputting, it will display the segmented effect and prediction prompt in real time.
          </div>
        </div>
      </div>
    </div>
  ),
}

// 智能日期修正演示
export const SmartDateCorrection: Story = {
  args: {
    placeholder: "Try invalid date, like 2025-04-31...",
    format: "yyyy-MM-dd",
  },
  render: (args) => (
    <div className="space-y-6">
      <DateInput {...args} />

      <div className="w-sm space-y-4">
        <div className="text-lg font-medium">🔧 Smart Date Correction</div>
        <div className="text-secondary-foreground mb-4">
          When an invalid date is entered, the system will automatically correct it to the last day
          of the month, ensuring that the date is always valid. ✨ Now fixed!
        </div>

        <div className="space-y-3 rounded-md border p-4">
          <div className="font-medium text-red-600">❌ Invalid Date Input</div>
          <div className="text-secondary-foreground space-y-2">
            <div>
              • <code>2025-04-31</code> → 2025-04-30 (April has 30 days)
            </div>
            <div>
              • <code>2025-02-30</code> → 2025-02-28 (February has 28 days)
            </div>
            <div>
              • <code>2024-02-30</code> → 2024-02-29 (February 29th in leap year)
            </div>
            <div>
              • <code>2025-13-15</code> → 2025-12-15 (No 13th month)
            </div>
            <div>
              • <code>2025-06-00</code> → 2025-06-01 (No 0th day)
            </div>
          </div>
        </div>

        <div className="space-y-3 rounded-md border p-4">
          <div className="font-medium">✅ Smart Correction Rules</div>
          <div className="text-secondary-foreground space-y-2">
            <div>
              • Date exceeds the number of days in the month → Corrected to the last day of the
              month
            </div>
            <div>• Month greater than 12 → Corrected to December</div>
            <div>• Month less than 1 → Corrected to January</div>
            <div>• Date less than 1 → Corrected to 1st</div>
            <div>• Automatically handle February 29th in leap year</div>
          </div>
        </div>

        <div className="space-y-3 rounded-md border p-4">
          <div className="font-medium">�� Test Examples</div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(128px,1fr))]">
            <div className="space-y-2">
              <div className="font-medium">April 31st</div>
              <div className="text-secondary-foreground">
                Input: <code>20250431</code>
              </div>
              <div className="font-medium text-green-700">→ 2025-04-30</div>
            </div>
            <div className="space-y-2">
              <div className="font-medium">February 30th</div>
              <div className="text-secondary-foreground">
                Input: <code>20250230</code>
              </div>
              <div className="font-medium text-green-700">→ 2025-02-28</div>
            </div>
            <div className="space-y-2">
              <div className="font-medium">13th month 15th</div>
              <div className="text-secondary-foreground">
                Input: <code>20251315</code>
              </div>
              <div className="font-medium text-green-700">→ 2025-12-15</div>
            </div>
            <div className="space-y-2">
              <div className="font-medium">June 0th</div>
              <div className="text-secondary-foreground">
                Input: <code>20250600</code>
              </div>
              <div className="font-medium text-green-700">→ 2025-06-01</div>
            </div>
            <div className="space-y-2">
              <div className="font-medium">Leap year February 29th</div>
              <div className="text-secondary-foreground">
                Input: <code>20240230</code>
              </div>
              <div className="font-medium text-green-700">→ 2024-02-29</div>
            </div>
            <div className="space-y-2">
              <div className="font-medium">September 31st</div>
              <div className="text-secondary-foreground">
                Input: <code>20250931</code>
              </div>
              <div className="font-medium text-green-700">→ 2025-09-30</div>
            </div>
          </div>
        </div>

        <div className="rounded-md border p-4">
          <div className="mb-2 font-medium">✨ Intelligent Features</div>
          <div className="text-secondary-foreground">
            No matter what invalid date is entered, the system will automatically correct it to the
            nearest valid date, ensuring a smooth user experience without error prompts. 🚀 Fixed
            and working properly!
          </div>
        </div>
      </div>
    </div>
  ),
}

// 国际化演示组件
const InternationalizationDemo = () => {
  const [zhValue, setZhValue] = useState<Date | null>(null)
  const [enValue, setEnValue] = useState<Date | null>(null)
  const [deValue, setDeValue] = useState<Date | null>(null)
  const [frValue, setFrValue] = useState<Date | null>(null)

  return (
    <div className="space-y-8">
      <div className="text-lg font-medium">🌍 Internationalization Support</div>
      <div className="text-secondary-foreground">
        The DateInput component now supports multiple language regions, correctly parsing and
        formatting natural language input in different languages.
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* 中文 */}
        <div className="space-y-4 rounded-xl border p-4">
          <DateInput
            locale={zhCN}
            format="yyyy年MM月dd日"
            placeholder="试试输入 '今天' 或 '明天'..."
            value={zhValue}
            onChange={setZhValue}
          >
            <TextField.Label className="text-blue-600">🇨🇳 中文 (zhCN)</TextField.Label>
          </DateInput>
          <div className="text-secondary-foreground space-y-2">
            <div className="font-medium">支持的中文输入：</div>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div>• 今天、明天、昨天</div>
              <div>• 本周、下周、上周</div>
              <div>• 本月、下月、上月</div>
              <div>• 2024年12月25日</div>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Current: {zhValue ? zhValue.toLocaleDateString("zh-CN") : "None"}
          </div>
        </div>

        {/* 英文 */}
        <div className="space-y-4 rounded-xl border p-4">
          <DateInput
            locale={enUS}
            format="MM/dd/yyyy"
            placeholder="Try 'today' or 'tomorrow'..."
            value={enValue}
            onChange={setEnValue}
          >
            <TextField.Label className="text-blue-600">🇺🇸 English (enUS)</TextField.Label>
          </DateInput>
          <div className="text-secondary-foreground space-y-2">
            <div className="font-medium">Supported English input:</div>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div>• today, tomorrow, yesterday</div>
              <div>• this week, next week</div>
              <div>• this month, next month</div>
              <div>• Dec 25, 2024</div>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Current: {enValue ? enValue.toLocaleDateString("en-US") : "None"}
          </div>
        </div>

        {/* 德文 */}
        <div className="space-y-4 rounded-xl border p-4">
          <DateInput
            locale={de}
            format="dd.MM.yyyy"
            placeholder="Versuchen Sie '25.12.2024'..."
            value={deValue}
            onChange={setDeValue}
          >
            <TextField.Label className="text-blue-600">🇩🇪 Deutsch (de)</TextField.Label>
          </DateInput>
          <div className="text-secondary-foreground space-y-2">
            <div className="font-medium">Deutsche Formate:</div>
            <div className="text-xs">
              • 25.12.2024 (Standard)
              <br />
              • Dezember 25, 2024
              <br />• 25. Dezember 2024
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Aktuell: {deValue ? deValue.toLocaleDateString("de-DE") : "Keine"}
          </div>
        </div>

        {/* 法文 */}
        <div className="space-y-4 rounded-xl border p-4">
          <DateInput
            locale={fr}
            format="dd/MM/yyyy"
            placeholder="Essayez '25/12/2024'..."
            value={frValue}
            onChange={setFrValue}
          >
            <TextField.Label className="text-blue-600">🇫🇷 Français (fr)</TextField.Label>
          </DateInput>
          <div className="text-secondary-foreground space-y-2">
            <div className="font-medium">Formats français:</div>
            <div className="text-xs">
              • 25/12/2024 (Standard)
              <br />
              • 25 décembre 2024
              <br />• décembre 25, 2024
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Actuel: {frValue ? frValue.toLocaleDateString("fr-FR") : "Aucun"}
          </div>
        </div>
      </div>

      <div>
        <div className="mb-2 font-medium text-green-800">🚀 Usage</div>
        <div className="text-green-700">
          Simply pass the <code className="rounded bg-green-100 px-1">locale</code> property to
          enable support for the corresponding language:
        </div>
        <pre className="mt-2 rounded bg-green-100 p-2 text-xs text-green-800">
          {`import { zhCN, enUS } from 'date-fns/locale'

<DateInput locale={zhCN} placeholder="输入中文日期..." />
<DateInput locale={enUS} placeholder="Enter English date..." />`}
        </pre>
      </div>
    </div>
  )
}

// 国际化支持演示
export const InternationalizationSupport: Story = {
  render: () => <InternationalizationDemo />,
}

export const Combined: Story = {
  render: function Combined() {
    const [localeKey, setLocaleKey] = useState<string>("en-US")
    const locale = LOCALE_MAP[localeKey]
    const [dateOpen, setDateOpen] = useState(false)
    const [activeInput, setActiveInput] = useState<"single" | "range-start" | "range-end" | null>(
      null,
    )

    const dateRef = useRef<HTMLDivElement>(null)
    const rangeRef = useRef<HTMLDivElement>(null)
    const [date, setDate] = useState<CalendarValue>(isToday(new Date()) ? new Date() : null)
    const [start, setStart] = useState<Date | null>(isToday(new Date()) ? new Date() : null)
    const [end, setEnd] = useState<Date | null>(addDays(new Date(), 1))

    // 🎯 根据活跃输入框决定当前triggerRef和值
    const currentTriggerRef = activeInput === "single" ? dateRef : rangeRef
    const currentValue =
      activeInput === "single"
        ? date
        : activeInput === "range-start"
          ? start
          : activeInput === "range-end"
            ? end
            : null

    // 🎯 统一的值变更处理
    const handleValueChange = (newDate: CalendarValue) => {
      if (activeInput === "single") {
        setDate(newDate)
        setDateOpen(false)
      } else if (activeInput === "range-start") {
        // 🔥 日历选择start时也要推动end
        const startDate = newDate as Date | null
        if (startDate) {
          // 计算当前range长度（毫秒），fallback为1天（与初始状态一致）
          const currentRange =
            start && end ? end.getTime() - start.getTime() : 1 * 24 * 60 * 60 * 1000
          const newEnd = new Date(startDate.getTime() + currentRange)
          setStart(startDate)
          setEnd(newEnd)
          console.log("🔥 Calendar start推动:", {
            newStart: startDate.toISOString(),
            newEnd: newEnd.toISOString(),
            rangeDays: currentRange / (24 * 60 * 60 * 1000),
          })
        } else {
          setStart(startDate)
        }
        setDateOpen(false)
      } else if (activeInput === "range-end") {
        // 🔥 日历选择end时也要检查推动
        const endDate = newDate as Date | null
        if (endDate && start && endDate <= start) {
          setStart(endDate)
          console.log("🔥 Calendar end推动start:", endDate.toISOString())
        }
        setEnd(endDate)
        setDateOpen(false)
      }
    }

    // 语言显示名称映射
    const localeDisplayNames: Record<string, string> = {
      "zh-CN": "🇨🇳 中文简体",
      "en-US": "🇺🇸 English",
      "ja-JP": "🇯🇵 日本語",
      "ko-KR": "🇰🇷 한국어",
      "de-DE": "🇩🇪 Deutsch",
      "fr-FR": "🇫🇷 Français",
      "es-ES": "🇪🇸 Español",
    }

    return (
      <>
        <Panel className="w-80 rounded-xl border">
          <Panel.Title title="Select Date" />

          <Panel.Row>
            <Select
              value={localeKey}
              onChange={setLocaleKey}
            >
              <Select.Trigger className="[grid-area:input]">
                <Select.Value>{localeDisplayNames[localeKey] || localeKey}</Select.Value>
              </Select.Trigger>
              <Select.Content>
                {Object.keys(LOCALE_MAP).map((localeKey) => (
                  <Select.Item
                    key={localeKey}
                    value={localeKey}
                  >
                    {localeDisplayNames[localeKey] || localeKey}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </Panel.Row>
          <Panel.Row
            type="single"
            triggerRef={dateRef}
            className="date-input"
          >
            <DateInput
              className="[grid-area:input]"
              locale={localeKey}
              onFocus={() => {
                setActiveInput("single")
                setDateOpen(true)
              }}
              value={date}
              onChange={(newDate) => {
                setDate(newDate)
                setDateOpen(false)
              }}
              onEnterKeyDown={() => {
                setDateOpen(false)
              }}
            />
          </Panel.Row>

          <Panel.Row
            triggerRef={rangeRef}
            type="two-input-two-icon"
            className="range-input"
          >
            <DateRangeInput
              locale={localeKey}
              startValue={start}
              endValue={end}
              onStartChange={(newStart) => {
                if (newStart) {
                  // 计算当前range长度（毫秒），fallback为1天（与初始状态一致）
                  const currentRange =
                    start && end ? end.getTime() - start.getTime() : 1 * 24 * 60 * 60 * 1000
                  // 保持range长度
                  const newEnd = new Date(newStart.getTime() + currentRange)
                  setStart(newStart)
                  setEnd(newEnd)
                } else {
                  setStart(newStart)
                }
              }}
              onEndChange={(newEnd) => {
                if (newEnd && start && newEnd <= start) {
                  // end <= start 时推动start
                  setStart(newEnd)
                }
                setEnd(newEnd)
              }}
              onStartFocus={() => {
                setActiveInput("range-start")
                setDateOpen(true)
              }}
              onEndFocus={() => {
                setActiveInput("range-end")
                setDateOpen(true)
              }}
              onEnterKeyDown={() => {
                setDateOpen(false)
              }}
              startPlaceholder="Start Date"
              endPlaceholder="End Date"
            />
          </Panel.Row>
        </Panel>

        <Popover
          interactions="focus"
          outsidePressIgnore={activeInput === "single" ? "date-input" : "range-input"}
          triggerRef={currentTriggerRef}
          open={dateOpen}
          onOpenChange={setDateOpen}
          placement="left-start"
          focusManagerProps={{
            initialFocus: -1,
            returnFocus: false,
          }}
        >
          <Popover.Content className="overflow-hidden rounded-xl">
            <MonthCalendar
              locale={locale}
              className="w-48"
              variant="dark"
              value={currentValue}
              onChange={handleValueChange}
              selectionMode="single"
            />
          </Popover.Content>
        </Popover>
      </>
    )
  },
}
