import type { Meta, StoryObj } from "@storybook/react"
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

// 演示组件
const TimeDemo = (args: React.ComponentProps<typeof TimeInput>) => {
  const [value, setValue] = useState<string | null>(args.value || null)

  return (
    <div className="w-80 space-y-4">
      <TimeInput
        {...args}
        value={value}
        onChange={setValue}
      />
      <div className="text-sm text-gray-600">选中时间: {value || "未选择"}</div>
    </div>
  )
}

// 基础用法
export const Default: Story = {
  args: {
    placeholder: "输入任何时间格式...",
    format: "HH:mm",
  },
  render: (args) => <TimeDemo {...args} />,
}

// 智能补全演示
export const SmartCompletion: Story = {
  args: {
    placeholder: "试试输入: 9, 930, 2pm, 下午2点...",
    format: "HH:mm",
  },
  render: (args) => (
    <div className="space-y-4">
      <TimeDemo {...args} />
      <div className="space-y-2 text-sm text-gray-600">
        <div className="font-medium">💡 智能补全示例（永远不报错）：</div>
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
        <div>
          • <code>9:3</code> → 09:30
        </div>
        <div>
          • <code>asdfgh</code> → 当前时间（兜底）
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
        <TimeDemo
          format="HH:mm"
          placeholder="14:30"
        />
      </div>

      <div>
        <h3 className="mb-2 font-medium">12小时格式 (h:mm a)</h3>
        <TimeDemo
          format="h:mm a"
          placeholder="2:30 PM"
        />
      </div>

      <div>
        <h3 className="mb-2 font-medium">带秒 (HH:mm:ss)</h3>
        <TimeDemo
          format="HH:mm:ss"
          placeholder="14:30:45"
        />
      </div>
    </div>
  ),
}

// 状态演示
export const States: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">正常</label>
        <TimeDemo placeholder="输入时间..." />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">禁用</label>
        <TimeDemo
          disabled
          value="14:30"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">只读</label>
        <TimeDemo
          readOnly
          value="14:30"
        />
      </div>
    </div>
  ),
}
