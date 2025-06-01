import type { Meta, StoryObj } from "@storybook/react"
import React, { useState } from "react"
import type { Quarter } from "../types"
import { formatQuarter, getCurrentQuarter } from "../utils"
import type { QuarterCalendarProps } from "./quarter-calendar"
import { QuarterCalendar } from "./quarter-calendar"

// 辅助组件
const QuarterCalendarDemo = (args: QuarterCalendarProps) => {
  const [selectedQuarter, setSelectedQuarter] = useState<Quarter | null>(
    args.value ?? getCurrentQuarter(args.currentYear, args.locale),
  )

  return (
    <div className="space-y-4">
      <QuarterCalendar
        {...args}
        value={selectedQuarter}
        onChange={setSelectedQuarter}
        className="w-48 rounded-lg border"
      />
      <QuarterCalendar
        {...args}
        value={selectedQuarter}
        onChange={setSelectedQuarter}
        className="w-48 rounded-lg border"
        variant="dark"
      />
      <div className="text-sm text-gray-600">
        选中季度: {selectedQuarter ? formatQuarter(selectedQuarter) : "未选择"}
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
        <h3 className="mb-4 text-lg font-medium">中文版本</h3>
        <div className="space-y-2">
          <QuarterCalendar
            {...args}
            value={zhQuarter}
            locale="zh-CN"
            onChange={setZhQuarter}
          />
          <div className="text-sm text-gray-600">
            选中季度: {zhQuarter ? formatQuarter(zhQuarter) : "未选择"}
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">英文版本</h3>
        <div className="space-y-2">
          <QuarterCalendar
            {...args}
            value={enQuarter}
            locale="en-US"
            onChange={setEnQuarter}
          />
          <div className="text-sm text-gray-600">
            选中季度: {enQuarter ? formatQuarter(enQuarter) : "未选择"}
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
      <h3 className="mb-4 text-lg font-medium">{locale.name}</h3>
      <div className="space-y-2">
        <QuarterCalendar
          {...args}
          value={quarter}
          locale={locale.code}
          onChange={setQuarter}
        />
        <div className="text-sm text-gray-600">
          选中季度: {quarter ? formatQuarter(quarter) : "未选择"}
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
  tags: ["new"],
}

export default meta
type Story = StoryObj<typeof meta>

const currentYear = new Date().getFullYear()

// 基础用法
export const Default: Story = {
  args: {
    currentYear,
    locale: "zh-CN",
    disabled: false,
  },
  render: (args) => <QuarterCalendarDemo {...args} />,
}

// 英文版本
export const English: Story = {
  args: {
    currentYear,
    locale: "en-US",
    disabled: false,
  },
  render: (args) => <QuarterCalendarDemo {...args} />,
}

// 日文版本
export const Japanese: Story = {
  args: {
    currentYear,
    locale: "ja-JP",
    disabled: false,
  },
  render: (args) => <QuarterCalendarDemo {...args} />,
}

// 韩文版本
export const Korean: Story = {
  args: {
    currentYear,
    locale: "ko-KR",
    disabled: false,
  },
  render: (args) => <QuarterCalendarDemo {...args} />,
}

// 范围限制
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

// 禁用特定季度
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

// 禁用状态
export const Disabled: Story = {
  args: {
    currentYear,
    locale: "zh-CN",
    disabled: true,
  },
  render: (args) => <QuarterCalendarDemo {...args} />,
}

// 指定选中季度
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

// 深色主题
export const DarkVariant: Story = {
  args: {
    currentYear,
    locale: "zh-CN",
    variant: "dark",
    disabled: false,
  },
  render: (args) => (
    <div className="rounded-lg bg-slate-900 p-4">
      <QuarterCalendarDemo {...args} />
    </div>
  ),
}

// 对比展示
export const Comparison: Story = {
  args: {
    currentYear,
    disabled: false,
  },
  render: (args) => <ComparisonDemo {...args} />,
}

// 多语言展示
export const MultiLanguage: Story = {
  args: {
    currentYear,
    disabled: false,
  },
  render: (args) => <MultiLanguageDemo {...args} />,
}
