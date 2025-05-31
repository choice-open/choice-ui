import type { Meta, StoryObj } from "@storybook/react"
import { addDays, isToday } from "date-fns"
import { de, enUS, fr, zhCN } from "date-fns/locale"
import React, { useRef, useState } from "react"
import { MonthCalendar } from "../../calendar"
import { Panel } from "../../panel"
import { Popover } from "../../popover"
import { Select } from "../../select"
import type { CalendarValue } from "../month/types"
import { LOCALE_MAP } from "../utils/locale"
import { DateInput } from "./date-input"
import { DateRangeInput } from "../date-range-input"

const meta: Meta<typeof DateInput> = {
  title: "DateAndTime/DateInput",
  component: DateInput,
  tags: ["new"],
}

export default meta
type Story = StoryObj<typeof meta>

// 基础用法
export const Default: Story = {
  render: (args) => <DateInput {...args} />,
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => <DateInput {...args} />,
}

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    value: new Date(),
  },
  render: (args) => <DateInput {...args} />,
}

// 高级功能展示
export const Prediction: Story = {
  args: {
    placeholder: "试试智能预测功能...",
    format: "yyyy-MM-dd",
    enablePrediction: true,
  },
  render: (args) => (
    <div className="space-y-6">
      <DateInput {...args} />

      <div className="space-y-4 text-sm">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <div className="font-semibold text-blue-600">🎨 实时高亮</div>
            <div className="space-y-2 text-gray-600">
              <div>• 数字自动高亮显示</div>
              <div>• 快捷键变色提示</div>
              <div>• 输入内容智能识别</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="font-semibold text-purple-600">💡 智能预测</div>
            <div className="space-y-2 text-gray-600">
              <div>• 实时预测提示框 ✅</div>
              <div>• 数字格式识别 ✅</div>
              <div>• 智能补全建议 ✅</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="font-semibold text-green-600">⌨️ 键盘交互</div>
            <div className="space-y-2 text-gray-600">
              <div>
                • <kbd className="rounded bg-gray-100 px-1">Enter</kbd> 确认输入
              </div>
              <div>
                • <kbd className="rounded bg-gray-100 px-1">Esc</kbd> 隐藏提示
              </div>
              <div>• 失焦自动格式化</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="font-semibold text-orange-600">🔄 格式化</div>
            <div className="space-y-2 text-gray-600">
              <div>• 自动格式化输出</div>
              <div>• 智能错误修正</div>
              <div>• 实时内容同步</div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-purple-50 p-4">
          <div className="mb-2 font-medium text-purple-800">🎉 新功能亮点</div>
          <div className="space-y-2 text-sm text-purple-700">
            <div>
              • <strong>智能预测</strong>：现在会在输入框下方实时显示预测结果
            </div>
            <div>
              • <strong>数字识别</strong>：自动识别各种数字格式并提供智能提示
            </div>
            <div>
              • <strong>置信度指示</strong>：不同颜色表示预测的可信度
              <br />
              <span className="text-green-600">绿色</span> = 高置信度 |{" "}
              <span className="text-blue-600">蓝色</span> = 中等置信度 |{" "}
              <span className="text-gray-600">灰色</span> = 低置信度
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
    placeholder: "试试快捷键...",
    format: "yyyy-MM-dd",
  },
  render: (args) => (
    <div className="space-y-6">
      <DateInput {...args} />

      <div className="space-y-4">
        <div className="font-semibold">⚡ 快捷键高亮演示</div>
        <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
          <div className="rounded border bg-green-50 p-2">
            <div className="font-medium">今天</div>
            <div className="text-gray-600">
              输入: <code>t</code> 或 <code>今</code>
            </div>
          </div>
          <div className="rounded border bg-blue-50 p-2">
            <div className="font-medium">昨天</div>
            <div className="text-gray-600">
              输入: <code>y</code> 或 <code>昨</code>
            </div>
          </div>
          <div className="rounded border bg-purple-50 p-2">
            <div className="font-medium">明天</div>
            <div className="text-gray-600">
              输入: <code>tm</code> 或 <code>明</code>
            </div>
          </div>
          <div className="rounded border bg-orange-50 p-2">
            <div className="font-medium">本周</div>
            <div className="text-gray-600">
              输入: <code>w</code> 或 <code>周</code>
            </div>
          </div>
          <div className="rounded border bg-pink-50 p-2">
            <div className="font-medium">本月</div>
            <div className="text-gray-600">
              输入: <code>m</code> 或 <code>月</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

// 不同格式演示
export const Formats: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 font-medium">ISO 格式 (yyyy-MM-dd)</h3>
        <DateInput
          format="yyyy-MM-dd"
          placeholder="2024-03-15"
        />
      </div>

      <div>
        <h3 className="mb-2 font-medium">中文格式 (yyyy年MM月dd日)</h3>
        <DateInput
          format="yyyy年MM月dd日"
          placeholder="2024年03月15日"
        />
      </div>

      <div>
        <h3 className="mb-2 font-medium">美式格式 (MM/dd/yyyy)</h3>
        <DateInput
          format="MM/dd/yyyy"
          placeholder="03/15/2024"
        />
      </div>
    </div>
  ),
}

// 英文月份识别演示
export const EnglishMonthSupport: Story = {
  args: {
    placeholder: "试试英文月份...",
    format: "yyyy-MM-dd",
  },
  render: (args) => (
    <div className="space-y-6">
      <DateInput {...args} />

      <div className="space-y-4">
        <div className="text-lg font-semibold">🌍 英文月份识别</div>

        <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-2">
          <div className="space-y-3">
            <div className="font-semibold text-green-600">📝 支持格式</div>
            <div className="space-y-2 text-gray-600">
              <div>
                • <code>may</code> → 当年5月1日
              </div>
              <div>
                • <code>may 15</code> → 当年5月15日
              </div>
              <div>
                • <code>15 may</code> → 当年5月15日
              </div>
              <div>
                • <code>may 15, 2024</code> → 2024年5月15日
              </div>
              <div>
                • <code>15 may 2024</code> → 2024年5月15日
              </div>
              <div>
                • <code>may 15th</code> → 当年5月15日
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="font-semibold text-blue-600">📚 月份缩写</div>
            <div className="space-y-2 text-gray-600">
              <div>
                • <code>jan</code> → 一月
              </div>
              <div>
                • <code>feb</code> → 二月
              </div>
              <div>
                • <code>mar</code> → 三月
              </div>
              <div>
                • <code>apr</code> → 四月
              </div>
              <div>
                • <code>may</code> → 五月
              </div>
              <div>
                • <code>jun</code> → 六月
              </div>
              <div>
                • <code>jul</code> → 七月
              </div>
              <div>
                • <code>aug</code> → 八月
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="font-semibold text-orange-600">🎯 智能识别</div>
          <div className="grid grid-cols-2 gap-3 text-xs md:grid-cols-4">
            <div className="rounded border bg-green-50 p-2">
              <div className="font-medium">全称</div>
              <div className="text-gray-600">january, february...</div>
            </div>
            <div className="rounded border bg-blue-50 p-2">
              <div className="font-medium">缩写</div>
              <div className="text-gray-600">jan, feb, mar...</div>
            </div>
            <div className="rounded border bg-yellow-50 p-2">
              <div className="font-medium">带点</div>
              <div className="text-gray-600">jan., feb., mar.</div>
            </div>
            <div className="rounded border bg-purple-50 p-2">
              <div className="font-medium">变体</div>
              <div className="text-gray-600">sept, sept.</div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-blue-50 p-4">
          <div className="mb-2 font-medium text-blue-800">💡 提示</div>
          <div className="text-sm text-blue-700">
            支持中英文混合输入，自动识别最佳匹配。输入时会实时显示分段效果和预测提示。
          </div>
        </div>
      </div>
    </div>
  ),
}

// 智能日期修正演示
export const SmartDateCorrection: Story = {
  args: {
    placeholder: "试试无效日期，如 2025-04-31...",
    format: "yyyy-MM-dd",
  },
  render: (args) => (
    <div className="space-y-6">
      <DateInput {...args} />

      <div className="space-y-4">
        <div className="text-lg font-semibold">🔧 智能日期修正</div>
        <div className="mb-4 text-sm text-gray-600">
          当输入无效日期时，系统会自动修正为该月的最后一天，确保日期始终有效。✨ 现已修复！
        </div>

        <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-2">
          <div className="space-y-3">
            <div className="font-semibold text-red-600">❌ 无效日期输入</div>
            <div className="space-y-2 text-gray-600">
              <div>
                • <code>2025-04-31</code> → 2025-04-30 (4月没有31天)
              </div>
              <div>
                • <code>2025-02-30</code> → 2025-02-28 (2月没有30天)
              </div>
              <div>
                • <code>2024-02-30</code> → 2024-02-29 (闰年2月)
              </div>
              <div>
                • <code>2025-13-15</code> → 2025-12-15 (没有13月)
              </div>
              <div>
                • <code>2025-06-00</code> → 2025-06-01 (没有0日)
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="font-semibold text-green-600">✅ 智能修正规则</div>
            <div className="space-y-2 text-gray-600">
              <div>• 日期超出月份天数 → 修正为该月最后一天</div>
              <div>• 月份大于12 → 修正为12月</div>
              <div>• 月份小于1 → 修正为1月</div>
              <div>• 日期小于1 → 修正为1日</div>
              <div>• 自动处理闰年2月29日</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="font-semibold text-purple-600">🧪 测试示例</div>
          <div className="grid grid-cols-2 gap-3 text-xs md:grid-cols-3">
            <div className="rounded border bg-red-50 p-2">
              <div className="font-medium">4月31日</div>
              <div className="text-gray-600">
                输入: <code>20250431</code>
              </div>
              <div className="font-medium text-green-700">→ 2025-04-30</div>
            </div>
            <div className="rounded border bg-red-50 p-2">
              <div className="font-medium">2月30日</div>
              <div className="text-gray-600">
                输入: <code>20250230</code>
              </div>
              <div className="font-medium text-green-700">→ 2025-02-28</div>
            </div>
            <div className="rounded border bg-red-50 p-2">
              <div className="font-medium">13月15日</div>
              <div className="text-gray-600">
                输入: <code>20251315</code>
              </div>
              <div className="font-medium text-green-700">→ 2025-12-15</div>
            </div>
            <div className="rounded border bg-red-50 p-2">
              <div className="font-medium">6月0日</div>
              <div className="text-gray-600">
                输入: <code>20250600</code>
              </div>
              <div className="font-medium text-green-700">→ 2025-06-01</div>
            </div>
            <div className="rounded border bg-red-50 p-2">
              <div className="font-medium">闰年2月</div>
              <div className="text-gray-600">
                输入: <code>20240230</code>
              </div>
              <div className="font-medium text-green-700">→ 2024-02-29</div>
            </div>
            <div className="rounded border bg-red-50 p-2">
              <div className="font-medium">9月31日</div>
              <div className="text-gray-600">
                输入: <code>20250931</code>
              </div>
              <div className="font-medium text-green-700">→ 2025-09-30</div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-green-50 p-4">
          <div className="mb-2 font-medium text-green-800">✨ 智能特性</div>
          <div className="text-sm text-green-700">
            无论输入什么无效日期，系统都会智能修正为最接近的有效日期，确保用户体验流畅，不会出现错误提示。
            🚀 修复完成，功能正常运行！
          </div>
        </div>
      </div>
    </div>
  ),
}

export const Basic: Story = {
  render: function Basic() {
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
        setStart(newDate as Date | null)
        setDateOpen(false)
      } else if (activeInput === "range-end") {
        setEnd(newDate as Date | null)
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
      <div className="grid h-screen w-full grid-cols-[1fr_20rem]">
        <div></div>
        <Panel className="border-l">
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
              onStartChange={setStart}
              onEndChange={setEnd}
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
          <Popover.Content className="overflow-hidden rounded-lg">
            <MonthCalendar
              locale={locale}
              className="w-48"
              variant="dark"
              value={currentValue}
              onChange={handleValueChange}
              selectionMode="single"
              minDate={activeInput === "range-end" ? start || undefined : undefined}
              maxDate={activeInput === "range-start" ? end || undefined : undefined}
            />
          </Popover.Content>
        </Popover>
      </div>
    )
  },
}

// 国际化演示组件
const InternationalizationDemo = () => {
  const [zhValue, setZhValue] = useState<Date | null>(null)
  const [enValue, setEnValue] = useState<Date | null>(null)
  const [deValue, setDeValue] = useState<Date | null>(null)
  const [frValue, setFrValue] = useState<Date | null>(null)
  const [jaValue, setJaValue] = useState<Date | null>(null)

  return (
    <div className="space-y-8">
      <div className="text-lg font-semibold">🌍 国际化支持演示</div>
      <div className="text-sm text-gray-600">
        DateInput 组件现在支持多种语言区域，能够正确解析和格式化不同语言的自然语言输入。
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* 中文 */}
        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🇨🇳</span>
            <div className="font-medium">中文 (zhCN)</div>
          </div>
          <DateInput
            locale={zhCN}
            format="yyyy年MM月dd日"
            placeholder="试试输入 '今天' 或 '明天'..."
            value={zhValue}
            onChange={setZhValue}
          />
          <div className="space-y-2 text-sm text-gray-600">
            <div className="font-medium">支持的中文输入：</div>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div>• 今天、明天、昨天</div>
              <div>• 本周、下周、上周</div>
              <div>• 本月、下月、上月</div>
              <div>• 2024年12月25日</div>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            当前值: {zhValue ? zhValue.toLocaleDateString("zh-CN") : "未选择"}
          </div>
        </div>

        {/* 英文 */}
        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🇺🇸</span>
            <div className="font-medium">English (enUS)</div>
          </div>
          <DateInput
            locale={enUS}
            format="MM/dd/yyyy"
            placeholder="Try 'today' or 'tomorrow'..."
            value={enValue}
            onChange={setEnValue}
          />
          <div className="space-y-2 text-sm text-gray-600">
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
        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🇩🇪</span>
            <div className="font-medium">Deutsch (de)</div>
          </div>
          <DateInput
            locale={de}
            format="dd.MM.yyyy"
            placeholder="Versuchen Sie '25.12.2024'..."
            value={deValue}
            onChange={setDeValue}
          />
          <div className="space-y-2 text-sm text-gray-600">
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
        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🇫🇷</span>
            <div className="font-medium">Français (fr)</div>
          </div>
          <DateInput
            locale={fr}
            format="dd/MM/yyyy"
            placeholder="Essayez '25/12/2024'..."
            value={frValue}
            onChange={setFrValue}
          />
          <div className="space-y-2 text-sm text-gray-600">
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

      <div className="rounded-lg bg-blue-50 p-4">
        <div className="mb-2 font-medium text-blue-800">💡 国际化特性</div>
        <div className="space-y-2 text-sm text-blue-700">
          <div>
            • <strong>自动语言检测</strong>：根据 locale 自动使用对应语言的自然语言解析
          </div>
          <div>
            • <strong>格式适应</strong>：月份名称、日期格式自动适配当地习惯
          </div>
          <div>
            • <strong>输入智能</strong>：支持各语言的简写、全称等多种输入方式
          </div>
          <div>
            • <strong>缓存优化</strong>：按语言区域独立缓存，提升解析性能
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-green-50 p-4">
        <div className="mb-2 font-medium text-green-800">🚀 使用方法</div>
        <div className="text-sm text-green-700">
          只需传入 <code className="rounded bg-green-100 px-1">locale</code>{" "}
          属性即可启用对应语言支持：
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

// 不同长度格式演示组件
const VariableLengthFormatsDemo = () => {
  const [longChineseValue, setLongChineseValue] = useState<Date | null>(null)
  const [shortChineseValue, setShortChineseValue] = useState<Date | null>(null)
  const [longEnglishValue, setLongEnglishValue] = useState<Date | null>(null)
  const [shortEnglishValue, setShortEnglishValue] = useState<Date | null>(null)
  const [flexibleChineseValue, setFlexibleChineseValue] = useState<Date | null>(null)
  const [compactValue, setCompactValue] = useState<Date | null>(null)

  return (
    <div className="space-y-8">
      <div className="text-lg font-semibold">📏 不同长度格式演示</div>
      <div className="text-sm text-gray-600">
        DateInput 现在支持任意 date-fns 格式字符串，包括不同长度的年份、月份等变体。
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* 中文长格式 */}
        <div className="space-y-4 rounded-lg border p-4">
          <div className="font-medium text-blue-600">🇨🇳 中文完整格式</div>
          <DateInput
            format="yyyy年MM月dd日"
            placeholder="2025年12月31日"
            value={longChineseValue}
            onChange={setLongChineseValue}
          />
          <div className="text-xs text-gray-600">
            格式：<code>yyyy年MM月dd日</code>
            <br />
            示例：2025年12月31日
          </div>
          <div className="text-xs text-gray-500">
            当前值: {longChineseValue ? longChineseValue.toLocaleDateString("zh-CN") : "未选择"}
          </div>
        </div>

        {/* 中文短格式 */}
        <div className="space-y-4 rounded-lg border p-4">
          <div className="font-medium text-purple-600">🇨🇳 中文简短格式</div>
          <DateInput
            format="yy年M月d日"
            placeholder="25年12月31日"
            value={shortChineseValue}
            onChange={setShortChineseValue}
          />
          <div className="text-xs text-gray-600">
            格式：<code>yy年M月d日</code>
            <br />
            示例：25年12月31日
          </div>
          <div className="text-xs text-gray-500">
            当前值: {shortChineseValue ? shortChineseValue.toLocaleDateString("zh-CN") : "未选择"}
          </div>
        </div>

        {/* 灵活中文格式 */}
        <div className="space-y-4 rounded-lg border p-4">
          <div className="font-medium text-indigo-600">🇨🇳 中文灵活格式</div>
          <DateInput
            format="yyyy年M月d日"
            placeholder="2025年1月5日"
            value={flexibleChineseValue}
            onChange={setFlexibleChineseValue}
          />
          <div className="text-xs text-gray-600">
            格式：<code>yyyy年M月d日</code>
            <br />
            示例：2025年1月5日（不补零）
          </div>
          <div className="text-xs text-gray-500">
            当前值:{" "}
            {flexibleChineseValue ? flexibleChineseValue.toLocaleDateString("zh-CN") : "未选择"}
          </div>
        </div>

        {/* 英文长格式 */}
        <div className="space-y-4 rounded-lg border p-4">
          <div className="font-medium text-green-600">🇺🇸 英文完整格式</div>
          <DateInput
            locale={enUS}
            format="MMMM dd, yyyy"
            placeholder="December 25, 2025"
            value={longEnglishValue}
            onChange={setLongEnglishValue}
          />
          <div className="text-xs text-gray-600">
            格式：<code>MMMM dd, yyyy</code>
            <br />
            示例：December 25, 2025
          </div>
          <div className="text-xs text-gray-500">
            Current: {longEnglishValue ? longEnglishValue.toLocaleDateString("en-US") : "None"}
          </div>
        </div>

        {/* 英文短格式 */}
        <div className="space-y-4 rounded-lg border p-4">
          <div className="font-medium text-orange-600">🇺🇸 英文简写格式</div>
          <DateInput
            locale={enUS}
            format="MMM dd, yy"
            placeholder="Dec 25, 25"
            value={shortEnglishValue}
            onChange={setShortEnglishValue}
          />
          <div className="text-xs text-gray-600">
            格式：<code>MMM dd, yy</code>
            <br />
            示例：Dec 25, 25
          </div>
          <div className="text-xs text-gray-500">
            Current: {shortEnglishValue ? shortEnglishValue.toLocaleDateString("en-US") : "None"}
          </div>
        </div>

        {/* 紧凑格式 */}
        <div className="space-y-4 rounded-lg border p-4">
          <div className="font-medium text-red-600">📱 紧凑格式</div>
          <DateInput
            locale={enUS}
            format="M/d/yy"
            placeholder="12/25/25"
            value={compactValue}
            onChange={setCompactValue}
          />
          <div className="text-xs text-gray-600">
            格式：<code>M/d/yy</code>
            <br />
            示例：12/25/25（全部不补零）
          </div>
          <div className="text-xs text-gray-500">
            Current: {compactValue ? compactValue.toLocaleDateString("en-US") : "None"}
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-lg border p-4">
        <div className="font-semibold text-gray-800">📖 格式说明</div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="bg-blue-50">
            <div className="mb-2 font-medium text-blue-800">年份格式</div>
            <div className="space-y-1 text-sm text-blue-700">
              <div>
                <code>yyyy</code> → 2025 (4位完整年份)
              </div>
              <div>
                <code>yy</code> → 25 (2位简短年份)
              </div>
            </div>
          </div>

          <div className="bg-green-50">
            <div className="mb-2 font-medium text-green-800">月份格式</div>
            <div className="space-y-1 text-sm text-green-700">
              <div>
                <code>MMMM</code> → December (完整月份名)
              </div>
              <div>
                <code>MMM</code> → Dec (简写月份名)
              </div>
              <div>
                <code>MM</code> → 12 (2位数字)
              </div>
              <div>
                <code>M</code> → 12 (1-2位数字)
              </div>
            </div>
          </div>

          <div className="bg-purple-50">
            <div className="mb-2 font-medium text-purple-800">日期格式</div>
            <div className="space-y-1 text-sm text-purple-700">
              <div>
                <code>dd</code> → 31 (2位日期)
              </div>
              <div>
                <code>d</code> → 31 (1-2位日期)
              </div>
            </div>
          </div>

          <div className="bg-orange-50">
            <div className="mb-2 font-medium text-orange-800">分隔符</div>
            <div className="space-y-1 text-sm text-orange-700">
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

      <div className="rounded-lg bg-green-50 p-4">
        <div className="mb-2 font-medium text-green-800">✨ 灵活性优势</div>
        <div className="space-y-2 text-sm text-green-700">
          <div>
            • <strong>无限制</strong>：支持任何 date-fns 格式字符串组合
          </div>
          <div>
            • <strong>智能解析</strong>：自动识别并解析各种格式的输入
          </div>
          <div>
            • <strong>国际化</strong>：根据 locale 自动适配月份名称
          </div>
          <div>
            • <strong>开发友好</strong>：TypeScript 智能提示和格式验证
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-yellow-50 p-4">
        <div className="mb-2 font-medium text-yellow-800">💡 使用提示</div>
        <div className="text-sm text-yellow-700">
          现在可以直接使用任何 date-fns 格式字符串，不再受预定义格式限制。 查看完整格式选项：
          <a
            href="https://date-fns.org/v2.29.3/docs/format"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 text-yellow-800 underline hover:text-yellow-900"
          >
            date-fns 格式文档
          </a>
        </div>
      </div>
    </div>
  )
}

// 不同长度格式演示
export const VariableLengthFormats: Story = {
  render: () => <VariableLengthFormatsDemo />,
}

// 拖拽测试组件
const DragTestDemo = (args: React.ComponentProps<typeof DateInput>) => {
  const [value, setValue] = useState<Date | null>(new Date())

  return (
    <div className="w-80 space-y-4">
      <DateInput
        {...args}
        value={value}
        onChange={setValue}
      />
      <div className="text-sm text-gray-600">
        选中日期: {value ? value.toLocaleDateString("zh-CN") : "未选择"}
      </div>
      <div className="text-xs text-gray-500">
        💡 拖拽时钟图标可以快速调整日期：
        <br />• 右拖：向未来移动
        <br />• 左拖：向过去移动
        <br />• Shift + 拖拽：使用大步长（7天）
      </div>
    </div>
  )
}

// 拖拽测试
export const DragTest: Story = {
  args: {
    placeholder: "拖拽时钟图标测试...",
  },
  render: (args) => <DragTestDemo {...args} />,
}
