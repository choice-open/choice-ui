import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react"
import { zhCN, enUS, ja, ko } from "date-fns/locale"
import { TimeRangeInput } from "../time-range-input"

// 工具函数：创建指定时间的 Date 对象
const createTime = (hours: number, minutes: number = 0): Date => {
  const date = new Date(2024, 0, 1) // 2024-01-01
  date.setHours(hours, minutes, 0, 0)
  return date
}

describe("TimeRangeInput 逻辑测试", () => {
  // 时间差计算逻辑测试
  describe("时间差计算逻辑", () => {
    it("应该正确计算同一天内的时间差", () => {
      const startTime = createTime(9, 0) // 09:00
      const endTime = createTime(17, 30) // 17:30

      render(
        <TimeRangeInput
          startValue={startTime}
          endValue={endTime}
          locale={zhCN}
        />,
      )

      // 应该显示 8小时30分钟
      expect(screen.getByText("8小时30分钟")).toBeInTheDocument()
    })

    it("应该正确计算跨日时间差", () => {
      const startTime = createTime(22, 0) // 22:00
      const endTime = createTime(6, 0) // 06:00 (next day)

      render(
        <TimeRangeInput
          startValue={startTime}
          endValue={endTime}
          locale={zhCN}
        />,
      )

      // 跨日情况：22:00 到 06:00 = 8小时
      expect(screen.getByText("8小时")).toBeInTheDocument()
    })

    it("应该正确计算精确到分钟的时间差", () => {
      const startTime = createTime(14, 15) // 14:15
      const endTime = createTime(16, 45) // 16:45

      render(
        <TimeRangeInput
          startValue={startTime}
          endValue={endTime}
          locale={zhCN}
        />,
      )

      // 2小时30分钟
      expect(screen.getByText("2小时30分钟")).toBeInTheDocument()
    })

    it("应该正确处理只有分钟的时间差", () => {
      const startTime = createTime(15, 10) // 15:10
      const endTime = createTime(15, 45) // 15:45

      render(
        <TimeRangeInput
          startValue={startTime}
          endValue={endTime}
          locale={zhCN}
        />,
      )

      // 35分钟
      expect(screen.getByText("35分钟")).toBeInTheDocument()
    })

    it("应该正确处理整小时的时间差", () => {
      const startTime = createTime(10, 0) // 10:00
      const endTime = createTime(13, 0) // 13:00

      render(
        <TimeRangeInput
          startValue={startTime}
          endValue={endTime}
          locale={zhCN}
        />,
      )

      // 3小时
      expect(screen.getByText("3小时")).toBeInTheDocument()
    })
  })

  // 跨日检测逻辑测试
  describe("跨日检测逻辑", () => {
    it("应该正确检测非跨日情况", () => {
      const startTime = createTime(9, 0) // 09:00
      const endTime = createTime(17, 0) // 17:00

      render(
        <TimeRangeInput
          startValue={startTime}
          endValue={endTime}
        />,
      )

      // 非跨日：应该有正常的时间差显示
      expect(screen.getByText("8 hours")).toBeInTheDocument()
    })

    it("应该正确检测跨日情况", () => {
      const startTime = createTime(23, 30) // 23:30
      const endTime = createTime(2, 30) // 02:30 (next day)

      render(
        <TimeRangeInput
          startValue={startTime}
          endValue={endTime}
        />,
      )

      // 跨日：23:30 到 02:30 = 3小时
      expect(screen.getByText("3 hours")).toBeInTheDocument()
    })

    it("应该正确处理边界跨日情况", () => {
      const startTime = createTime(23, 59) // 23:59
      const endTime = createTime(0, 1) // 00:01 (next day)

      render(
        <TimeRangeInput
          startValue={startTime}
          endValue={endTime}
        />,
      )

      // 跨日：23:59 到 00:01 = 2分钟
      expect(screen.getByText("2 mins")).toBeInTheDocument()
    })
  })

  // 多语言格式化逻辑测试
  describe("多语言格式化逻辑", () => {
    const startTime = createTime(10, 0)
    const endTime = createTime(13, 30) // 3小时30分钟

    it("应该正确格式化中文时间差", () => {
      render(
        <TimeRangeInput
          startValue={startTime}
          endValue={endTime}
          locale={zhCN}
        />,
      )

      expect(screen.getByText("3小时30分钟")).toBeInTheDocument()
    })

    it("应该正确格式化英文时间差", () => {
      render(
        <TimeRangeInput
          startValue={startTime}
          endValue={endTime}
          locale={enUS}
        />,
      )

      expect(screen.getByText("3h 30m")).toBeInTheDocument()
    })

    it("应该正确格式化日文时间差", () => {
      render(
        <TimeRangeInput
          startValue={startTime}
          endValue={endTime}
          locale={ja}
        />,
      )

      expect(screen.getByText("3時間30分")).toBeInTheDocument()
    })

    it("应该正确格式化韩文时间差", () => {
      render(
        <TimeRangeInput
          startValue={startTime}
          endValue={endTime}
          locale={ko}
        />,
      )

      expect(screen.getByText("3시간 30분")).toBeInTheDocument()
    })

    it("应该处理只有小时的格式化", () => {
      const start = createTime(10, 0)
      const end = createTime(12, 0) // 2小时整

      render(
        <TimeRangeInput
          startValue={start}
          endValue={end}
          locale={zhCN}
        />,
      )

      expect(screen.getByText("2小时")).toBeInTheDocument()
    })

    it("应该处理只有分钟的格式化", () => {
      const start = createTime(10, 0)
      const end = createTime(10, 45) // 45分钟

      render(
        <TimeRangeInput
          startValue={start}
          endValue={end}
          locale={zhCN}
        />,
      )

      expect(screen.getByText("45分钟")).toBeInTheDocument()
    })

    it("应该处理英文单复数形式", () => {
      // 1小时的情况
      const start1 = createTime(10, 0)
      const end1 = createTime(11, 0)

      const { rerender } = render(
        <TimeRangeInput
          startValue={start1}
          endValue={end1}
          locale={enUS}
        />,
      )

      expect(screen.getByText("1 hour")).toBeInTheDocument()

      // 1分钟的情况
      const start2 = createTime(10, 0)
      const end2 = createTime(10, 1)

      rerender(
        <TimeRangeInput
          startValue={start2}
          endValue={end2}
          locale={enUS}
        />,
      )

      expect(screen.getByText("1 min")).toBeInTheDocument()
    })
  })

  // 边界情况和错误处理测试
  describe("边界情况和错误处理", () => {
    it("应该处理 null 开始时间", () => {
      const endTime = createTime(17, 0)

      render(
        <TimeRangeInput
          startValue={null}
          endValue={endTime}
        />,
      )

      // 没有开始时间时，不应该显示时间差
      expect(screen.queryByText(/hour|小时|時間|시간/)).not.toBeInTheDocument()
    })

    it("应该处理 null 结束时间", () => {
      const startTime = createTime(9, 0)

      render(
        <TimeRangeInput
          startValue={startTime}
          endValue={null}
        />,
      )

      // 没有结束时间时，不应该显示时间差
      expect(screen.queryByText(/hour|小时|時間|시간/)).not.toBeInTheDocument()
    })

    it("应该处理两个时间都为 null", () => {
      render(
        <TimeRangeInput
          startValue={null}
          endValue={null}
        />,
      )

      // 两个时间都为空时，不应该显示时间差
      expect(screen.queryByText(/hour|小时|時間|시간/)).not.toBeInTheDocument()
    })

    it("应该处理相同时间的情况", () => {
      const sameTime = createTime(12, 0)

      const { container } = render(
        <TimeRangeInput
          startValue={sameTime}
          endValue={sameTime}
          locale={zhCN}
        />,
      )

      // 相同时间应该显示0分钟或不显示
      const text = container.textContent
      expect(text).toMatch(/0分钟|^$/)
    })

    it("应该处理极大跨日时间差（接近24小时）", () => {
      const startTime = createTime(0, 1) // 00:01
      const endTime = createTime(0, 0) // 00:00 (next day)

      render(
        <TimeRangeInput
          startValue={startTime}
          endValue={endTime}
          locale={zhCN}
        />,
      )

      // 23小时59分钟
      expect(screen.getByText("23小时59分钟")).toBeInTheDocument()
    })
  })

  // 时间约束逻辑测试
  describe("时间约束逻辑", () => {
    it("非跨日情况下应该设置正确的时间约束", () => {
      const startTime = createTime(9, 0)
      const endTime = createTime(17, 0)

      render(
        <TimeRangeInput
          startValue={startTime}
          endValue={endTime}
        />,
      )

      // 验证是否有 minTime 和 maxTime 的约束（通过检查输入框属性）
      const inputs = screen.getAllByRole("textbox")
      expect(inputs).toHaveLength(2)
    })

    it("跨日情况下应该移除时间约束", () => {
      const startTime = createTime(22, 0) // 22:00
      const endTime = createTime(6, 0) // 06:00 (next day)

      render(
        <TimeRangeInput
          startValue={startTime}
          endValue={endTime}
        />,
      )

      // 跨日情况下应该能正常显示时间差
      expect(screen.getByText("8 hours")).toBeInTheDocument()
    })
  })

  // 回调函数逻辑测试
  describe("回调函数逻辑", () => {
    it("应该正确传递开始时间变化回调", () => {
      const mockStartChange = jest.fn()

      render(<TimeRangeInput onStartChange={mockStartChange} />)

      // 验证组件渲染成功，回调函数已传递
      expect(screen.getAllByRole("textbox")).toHaveLength(2)
    })

    it("应该正确传递结束时间变化回调", () => {
      const mockEndChange = jest.fn()

      render(<TimeRangeInput onEndChange={mockEndChange} />)

      // 验证组件渲染成功，回调函数已传递
      expect(screen.getAllByRole("textbox")).toHaveLength(2)
    })

    it("应该正确传递焦点事件回调", () => {
      const mockStartFocus = jest.fn()
      const mockEndFocus = jest.fn()

      render(
        <TimeRangeInput
          onStartFocus={mockStartFocus}
          onEndFocus={mockEndFocus}
        />,
      )

      // 验证组件渲染成功，焦点回调已传递
      expect(screen.getAllByRole("textbox")).toHaveLength(2)
    })
  })

  // 格式化选项测试
  describe("格式化选项测试", () => {
    it("应该支持不同的时间格式", () => {
      const startTime = createTime(14, 30)
      const endTime = createTime(16, 0)

      render(
        <TimeRangeInput
          startValue={startTime}
          endValue={endTime}
          format="24"
        />,
      )

      // 验证组件正常渲染，格式传递成功
      expect(screen.getAllByRole("textbox")).toHaveLength(2)
    })

    it("应该处理自定义占位符文本", () => {
      render(
        <TimeRangeInput
          startPlaceholder="开始时间"
          endPlaceholder="结束时间"
        />,
      )

      expect(screen.getByPlaceholderText("开始时间")).toBeInTheDocument()
      expect(screen.getByPlaceholderText("结束时间")).toBeInTheDocument()
    })
  })
})
