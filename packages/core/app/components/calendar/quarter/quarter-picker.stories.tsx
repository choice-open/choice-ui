import type { Meta, StoryObj } from "@storybook/react"
import React, { useState } from "react"
import { QuarterPicker } from "./quarter-picker"
import type { QuarterPickerProps, Quarter } from "./types"
import { getCurrentQuarter, formatQuarter } from "./utils"

// 辅助组件
const QuarterPickerDemo = (args: QuarterPickerProps) => {
  const [selectedQuarter, setSelectedQuarter] = useState<Quarter | undefined>(
    args.selectedQuarter ?? getCurrentQuarter(args.currentYear, args.locale),
  )
  const [currentYear, setCurrentYear] = useState<number>(
    args.currentYear ?? new Date().getFullYear(),
  )

  return (
    <div className="space-y-4">
      <QuarterPicker
        {...args}
        selectedQuarter={selectedQuarter}
        currentYear={currentYear}
        onQuarterSelect={setSelectedQuarter}
        onYearChange={setCurrentYear}
      />
      <div className="text-sm text-gray-600">
        选中季度: {selectedQuarter ? formatQuarter(selectedQuarter) : "未选择"}
      </div>
    </div>
  )
}

const ComparisonDemo = (args: QuarterPickerProps) => {
  const [zhQuarter, setZhQuarter] = useState<Quarter | undefined>(
    getCurrentQuarter(args.currentYear, "zh-CN"),
  )
  const [enQuarter, setEnQuarter] = useState<Quarter | undefined>(
    getCurrentQuarter(args.currentYear, "en-US"),
  )
  const [zhYear, setZhYear] = useState<number>(args.currentYear!)
  const [enYear, setEnYear] = useState<number>(args.currentYear!)

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-medium">中文版本</h3>
        <div className="space-y-2">
          <QuarterPicker
            {...args}
            selectedQuarter={zhQuarter}
            currentYear={zhYear}
            locale="zh-CN"
            onQuarterSelect={setZhQuarter}
            onYearChange={setZhYear}
          />
          <div className="text-sm text-gray-600">
            选中季度: {zhQuarter ? formatQuarter(zhQuarter) : "未选择"}
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">英文版本</h3>
        <div className="space-y-2">
          <QuarterPicker
            {...args}
            selectedQuarter={enQuarter}
            currentYear={enYear}
            locale="en-US"
            onQuarterSelect={setEnQuarter}
            onYearChange={setEnYear}
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
const LocaleQuarterPicker: React.FC<{
  args: QuarterPickerProps
  locale: { code: string; name: string }
}> = ({ locale, args }) => {
  const [quarter, setQuarter] = useState<Quarter | undefined>(
    getCurrentQuarter(args.currentYear, locale.code),
  )
  const [year, setYear] = useState<number>(args.currentYear!)

  return (
    <div>
      <h3 className="mb-4 text-lg font-medium">{locale.name}</h3>
      <div className="space-y-2">
        <QuarterPicker
          {...args}
          selectedQuarter={quarter}
          currentYear={year}
          locale={locale.code}
          onQuarterSelect={setQuarter}
          onYearChange={setYear}
        />
        <div className="text-sm text-gray-600">
          选中季度: {quarter ? formatQuarter(quarter) : "未选择"}
        </div>
      </div>
    </div>
  )
}

const MultiLanguageDemo = (args: QuarterPickerProps) => {
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
        <LocaleQuarterPicker
          key={locale.code}
          locale={locale}
          args={args}
        />
      ))}
    </div>
  )
}

const meta: Meta<typeof QuarterPicker> = {
  title: "DateAndTime/QuarterPicker",
  component: QuarterPicker,
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
  render: (args) => <QuarterPickerDemo {...args} />,
}

// 英文版本
export const English: Story = {
  args: {
    currentYear,
    locale: "en-US",
    disabled: false,
  },
  render: (args) => <QuarterPickerDemo {...args} />,
}

// 日文版本
export const Japanese: Story = {
  args: {
    currentYear,
    locale: "ja-JP",
    disabled: false,
  },
  render: (args) => <QuarterPickerDemo {...args} />,
}

// 韩文版本
export const Korean: Story = {
  args: {
    currentYear,
    locale: "ko-KR",
    disabled: false,
  },
  render: (args) => <QuarterPickerDemo {...args} />,
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
  render: (args) => <QuarterPickerDemo {...args} />,
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
  render: (args) => <QuarterPickerDemo {...args} />,
}

// 禁用状态
export const Disabled: Story = {
  args: {
    currentYear,
    locale: "zh-CN",
    disabled: true,
  },
  render: (args) => <QuarterPickerDemo {...args} />,
}

// 指定选中季度
export const WithSelectedQuarter: Story = {
  args: {
    currentYear,
    selectedQuarter: {
      quarter: 2,
      year: currentYear,
      label: "第二季度",
      months: ["四月", "五月", "六月"],
    },
    locale: "zh-CN",
    disabled: false,
  },
  render: (args) => <QuarterPickerDemo {...args} />,
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
