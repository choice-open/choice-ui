import { Clock } from "@choiceform/icons-react"
import type { Meta, StoryObj } from "@storybook/react"
import { enUS, zhCN, ja } from "date-fns/locale"
import React, { useState } from "react"
import { TimeInput } from "./time-input"

const meta: Meta<typeof TimeInput> = {
  title: "DateAndTime/TimeInput",
  component: TimeInput,
  parameters: {
    layout: "centered",
  },
  tags: ["new"],
}

export default meta
type Story = StoryObj<typeof meta>

// 基础用法
export const Basic: Story = {
  render: (args) => <TimeInput {...args} />,
}

// 键盘导航演示
export const KeyboardNavigation: Story = {
  render: function Render() {
    const [value, setValue] = useState<string | null>(null)
    return (
      <div className="space-y-4">
        <TimeInput
          placeholder="Use keyboard to adjust time"
          value={value}
          onChange={setValue}
        />
        <div className="space-y-2 text-sm text-gray-600">
          <div className="font-medium">⌨️ 键盘快捷键：</div>
          <div>
            • <code>↑</code> / <code>↓</code> - 调整1分钟
          </div>
          <div>
            • <code>Shift + ↑/↓</code> - 调整15分钟
          </div>
          <div>
            • <code>Alt + ↑/↓</code> - 调整1小时
          </div>
          <div>
            • <code>Enter</code> - 确认输入
          </div>
        </div>
      </div>
    )
  },
}

// 拖拽交互演示
export const DragInteraction: Story = {
  render: function Render() {
    const [value, setValue] = useState<string | null>(null)
    return (
      <div className="space-y-4">
        <TimeInput
          placeholder="Use drag to adjust time"
          value={value}
          onChange={setValue}
        />
        <div className="space-y-2 text-sm text-gray-600">
          <div className="font-medium">🖱️ 拖拽交互：</div>
          <div>• 点住时钟图标左右拖拽调整时间</div>
          <div>• 按住 Shift 键拖拽调整15分钟步长</div>
          <div>• 按住 Ctrl/Cmd 键拖拽调整1小时步长</div>
        </div>
      </div>
    )
  },
}

// 智能补全演示
export const SmartCompletion: Story = {
  args: {
    placeholder: "试试输入: 9, 930, 2pm, 下午2点...",
    format: "HH:mm",
  },
  render: (args) => (
    <div className="space-y-4">
      <TimeInput {...args} />
      <div className="space-y-2 text-sm text-gray-600">
        <div className="font-medium">💡 智能补全示例：</div>
        <div>
          • <code>9</code> → 09:00
        </div>
        <div>
          • <code>930</code> → 09:30
        </div>
        <div>
          • <code>1430</code> → 14:30
        </div>
        <div>
          • <code>2pm</code> → 14:00
        </div>
        <div>
          • <code>9am</code> → 09:00
        </div>
        <div>
          • <code>下午2点</code> → 14:00
        </div>
      </div>
    </div>
  ),
}

// 不同格式
export const Formats: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 font-medium">24小时格式 (HH:mm)</h3>
        <TimeInput
          format="HH:mm"
          placeholder="14:30"
        />
      </div>

      <div>
        <h3 className="mb-2 font-medium">12小时格式 (h:mm a)</h3>
        <TimeInput
          format="h:mm a"
          placeholder="2:30 PM"
          locale={enUS}
        />
      </div>

      <div>
        <h3 className="mb-2 font-medium">带秒 (HH:mm:ss)</h3>
        <TimeInput
          format="HH:mm:ss"
          placeholder="14:30:45"
        />
      </div>
    </div>
  ),
}

// 国际化支持
export const Internationalization: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 font-medium">中文 (zh-CN)</h3>
        <TimeInput
          format="HH:mm"
          placeholder="输入时间..."
          locale={zhCN}
          value="14:30"
        />
      </div>

      <div>
        <h3 className="mb-2 font-medium">English (en-US)</h3>
        <TimeInput
          format="h:mm a"
          placeholder="Enter time..."
          locale={enUS}
          value="14:30"
        />
      </div>

      <div>
        <h3 className="mb-2 font-medium">日本語 (ja-JP)</h3>
        <TimeInput
          format="HH:mm"
          placeholder="時間を入力..."
          locale={ja}
          value="14:30"
        />
      </div>
    </div>
  ),
}

// 时间范围限制
export const TimeRange: Story = {
  render: function RenderTimeRange() {
    const [workTime, setWorkTime] = useState<string | null>("12:00")
    const [afternoonTime, setAfternoonTime] = useState<string | null>("14:00")
    return (
      <div className="space-y-6">
        <div>
          <h3 className="mb-2 font-medium">工作时间 (09:00 - 18:00)</h3>
          <TimeInput
            placeholder="只能选择工作时间"
            minTime="09:00"
            maxTime="18:00"
            value={workTime}
            onChange={setWorkTime}
          />
        </div>

        <div>
          <h3 className="mb-2 font-medium">下午时间 (12:00 - 23:59)</h3>
          <TimeInput
            placeholder="只能选择下午时间"
            minTime="12:00"
            maxTime="23:59"
            value={afternoonTime}
            onChange={setAfternoonTime}
          />
        </div>
      </div>
    )
  },
}

// 自定义步长
export const CustomSteps: Story = {
  render: function RenderCustomSteps() {
    const [stepA, setStepA] = useState<string | null>("14:30")
    const [stepB, setStepB] = useState<string | null>("14:30")
    return (
      <div className="space-y-6">
        <div>
          <h3 className="mb-2 font-medium">5分钟步长</h3>
          <TimeInput
            placeholder="每次调整5分钟"
            step={5}
            shiftStep={30}
            value={stepA}
            onChange={setStepA}
          />
          <div className="mt-1 text-sm text-gray-500">↑/↓ 键调整5分钟，Shift+↑/↓ 调整30分钟</div>
        </div>

        <div>
          <h3 className="mb-2 font-medium">15分钟步长</h3>
          <TimeInput
            placeholder="每次调整15分钟"
            step={15}
            shiftStep={60}
            value={stepB}
            onChange={setStepB}
          />
          <div className="mt-1 text-sm text-gray-500">↑/↓ 键调整15分钟，Shift+↑/↓ 调整60分钟</div>
        </div>
      </div>
    )
  },
}

// 状态演示
export const States: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">正常</label>
        <TimeInput placeholder="输入时间..." />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">禁用</label>
        <TimeInput
          disabled
          value="14:30"
          placeholder="禁用状态"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">只读</label>
        <TimeInput
          readOnly
          value="14:30"
          placeholder="只读状态"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">无前缀图标</label>
        <TimeInput
          prefixElement={null}
          placeholder="无图标"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">自定义前缀</label>
        <TimeInput
          prefixElement={<Clock className="text-blue-500" />}
          placeholder="蓝色图标"
        />
      </div>
    </div>
  ),
}
