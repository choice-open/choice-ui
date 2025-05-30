import type { Meta, StoryObj } from "@storybook/react"
import React, { useEffect, useRef, useState } from "react"
import { DateInput } from "./date-input"
import { Popover } from "../../popover"
import { MonthCalendar } from "../../calendar"
import { Panel } from "../../panel"
import { isToday } from "date-fns"

const meta: Meta<typeof DateInput> = {
  title: "DateAndTime/DateInput",
  component: DateInput,
  tags: ["new"],
}

export default meta
type Story = StoryObj<typeof meta>

// 演示组件
const SlateDemo = (args: React.ComponentProps<typeof DateInput>) => {
  const [value, setValue] = useState<Date | null>(args.value || null)

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
    </div>
  )
}

// 基础用法
export const Default: Story = {
  args: {
    placeholder: "体验 Slate 智能输入...",
    format: "yyyy-MM-dd",
  },
  render: (args) => <SlateDemo {...args} />,
}

// 高级功能展示
export const SlateAdvancedFeatures: Story = {
  args: {
    placeholder: "试试输入节假日日期...",
    format: "yyyy-MM-dd",
  },
  render: (args) => (
    <div className="space-y-6">
      <SlateDemo {...args} />

      <div className="space-y-4 text-sm">
        <div className="text-lg font-semibold">🚀 Slate.js 增强功能</div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <div className="font-semibold text-blue-600">🎨 实时高亮</div>
            <div className="space-y-2 text-gray-600">
              <div>• 节假日自动高亮显示</div>
              <div>• 快捷键变色提示</div>
              <div>• 输入内容智能识别</div>
              <div className="text-xs">
                试试输入：<code className="rounded bg-yellow-100 px-1">1225</code> 或{" "}
                <code className="rounded bg-green-100 px-1">t</code>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="font-semibold text-purple-600">💡 智能预测</div>
            <div className="space-y-2 text-gray-600">
              <div>• 实时预测提示框</div>
              <div>• 节假日信息显示</div>
              <div>• 智能补全建议</div>
              <div className="text-xs">输入时会显示预测提示框</div>
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
      </div>
    </div>
  ),
}

// 节假日演示
export const HolidayHighlight: Story = {
  args: {
    placeholder: "输入节假日看高亮效果...",
    format: "yyyy-MM-dd",
  },
  render: (args) => (
    <div className="space-y-6">
      <SlateDemo {...args} />

      <div className="space-y-4">
        <div className="font-semibold">🎊 节假日高亮演示</div>
        <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
          <div className="rounded border bg-yellow-50 p-2">
            <div className="font-medium">元旦</div>
            <div className="text-gray-600">
              输入: <code>0101</code>
            </div>
          </div>
          <div className="rounded border bg-red-50 p-2">
            <div className="font-medium">情人节</div>
            <div className="text-gray-600">
              输入: <code>0214</code>
            </div>
          </div>
          <div className="rounded border bg-green-50 p-2">
            <div className="font-medium">劳动节</div>
            <div className="text-gray-600">
              输入: <code>0501</code>
            </div>
          </div>
          <div className="rounded border bg-red-50 p-2">
            <div className="font-medium">国庆节</div>
            <div className="text-gray-600">
              输入: <code>1001</code>
            </div>
          </div>
          <div className="rounded border bg-purple-50 p-2">
            <div className="font-medium">光棍节</div>
            <div className="text-gray-600">
              输入: <code>1111</code>
            </div>
          </div>
          <div className="rounded border bg-green-50 p-2">
            <div className="font-medium">圣诞节</div>
            <div className="text-gray-600">
              输入: <code>1225</code>
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
      <SlateDemo {...args} />

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
        <SlateDemo
          format="yyyy-MM-dd"
          placeholder="2024-03-15"
        />
      </div>

      <div>
        <h3 className="mb-2 font-medium">中文格式 (yyyy年MM月dd日)</h3>
        <SlateDemo
          format="yyyy年MM月dd日"
          placeholder="2024年03月15日"
        />
      </div>

      <div>
        <h3 className="mb-2 font-medium">美式格式 (MM/dd/yyyy)</h3>
        <SlateDemo
          format="MM/dd/yyyy"
          placeholder="03/15/2024"
        />
      </div>
    </div>
  ),
}

// 分段渲染演示
export const SegmentedRendering: Story = {
  args: {
    placeholder: "输入查看分段效果...",
    format: "yyyy-MM-dd",
  },
  render: (args) => (
    <div className="space-y-6">
      <SlateDemo {...args} />

      <div className="space-y-4">
        <div className="text-lg font-semibold">🎨 分段渲染效果</div>
        <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-2">
          <div className="space-y-3">
            <div className="font-semibold text-blue-600">📅 日期组件分段</div>
            <div className="space-y-2 text-gray-600">
              <div>
                • <span className="rounded bg-blue-100 px-1 text-blue-800">年份</span> - 蓝色背景
              </div>
              <div>
                • <span className="rounded bg-green-100 px-1 text-green-800">月份</span> - 绿色背景
              </div>
              <div>
                • <span className="rounded bg-yellow-100 px-1 text-yellow-800">日期</span> -
                黄色背景
              </div>
              <div>
                • <span className="rounded bg-gray-100 px-1 text-gray-600">分隔符</span> - 灰色背景
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="font-semibold text-purple-600">✨ 特殊高亮</div>
            <div className="space-y-2 text-gray-600">
              <div>• 12月 - 节假日月份高亮</div>
              <div>• 25日/14日/11日 - 特殊日期高亮</div>
              <div>• 快捷键变色显示</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="font-semibold">💡 测试示例</div>
          <div className="grid grid-cols-2 gap-3 text-xs md:grid-cols-3">
            <div className="rounded border bg-blue-50 p-2">
              <div className="font-medium">完整日期</div>
              <div className="text-gray-600">
                输入: <code>2024-12-25</code>
              </div>
            </div>
            <div className="rounded border bg-green-50 p-2">
              <div className="font-medium">美式格式</div>
              <div className="text-gray-600">
                输入: <code>12/25/2024</code>
              </div>
            </div>
            <div className="rounded border bg-yellow-50 p-2">
              <div className="font-medium">中文格式</div>
              <div className="text-gray-600">
                输入: <code>2024年12月25日</code>
              </div>
            </div>
            <div className="rounded border bg-purple-50 p-2">
              <div className="font-medium">纯数字</div>
              <div className="text-gray-600">
                输入: <code>1225</code>
              </div>
            </div>
            <div className="rounded border bg-pink-50 p-2">
              <div className="font-medium">快捷键</div>
              <div className="text-gray-600">
                输入: <code>t</code>
              </div>
            </div>
            <div className="rounded border bg-indigo-50 p-2">
              <div className="font-medium">长数字</div>
              <div className="text-gray-600">
                输入: <code>20241225</code>
              </div>
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
    placeholder: "试试英文月份...",
    format: "yyyy-MM-dd",
  },
  render: (args) => (
    <div className="space-y-6">
      <SlateDemo {...args} />

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

export const Basic: Story = {
  render: function Basic() {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLInputElement>(null)
    const [date, setDate] = useState<Date | null>(isToday(new Date()) ? new Date() : null)
    console.log(date)

    return (
      <div className="grid h-screen w-full grid-cols-[1fr_16rem]">
        <div></div>
        <Panel className="border-l">
          <Panel.Title title="Select Date" />
          <Panel.Row triggerRef={ref}>
            <DateInput
              onMouseDown={() => setOpen(true)}
              value={date}
              onChange={setDate}
            />
          </Panel.Row>
        </Panel>

        <Popover
          triggerRef={ref}
          open={open}
          onOpenChange={setOpen}
          placement="left-start"
          initialFocus={ref}
        >
          <Popover.Content>
            <MonthCalendar
              className="w-48"
              selectedDate={date || undefined}
              onDateClick={(date) => {
                setDate(date)
                setOpen(false)
              }}
            />
          </Popover.Content>
        </Popover>
      </div>
    )
  },
}
