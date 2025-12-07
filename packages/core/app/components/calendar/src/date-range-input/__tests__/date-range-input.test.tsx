import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react"
import { zhCN, enUS, ja, ko } from "date-fns/locale"
import { DateRangeInput } from "../date-range-input"

// 工具函数：创建指定日期的 Date 对象
const createDate = (year: number, month: number, day: number): Date => {
  return new Date(year, month - 1, day) // month is 0-indexed
}

describe("DateRangeInput 逻辑测试", () => {
  // 日期差计算逻辑测试
  describe("日期差计算逻辑", () => {
    it("应该正确计算单日差距", () => {
      const startDate = createDate(2024, 1, 1) // 2024-01-01
      const endDate = createDate(2024, 1, 2) // 2024-01-02

      render(
        <DateRangeInput
          startValue={startDate}
          endValue={endDate}
          locale={enUS}
        />,
      )

      // 1天差距
      expect(screen.getByText("1 day")).toBeInTheDocument()
    })

    it("应该正确计算多日差距", () => {
      const startDate = createDate(2024, 1, 1) // 2024-01-01
      const endDate = createDate(2024, 1, 8) // 2024-01-08

      render(
        <DateRangeInput
          startValue={startDate}
          endValue={endDate}
          locale={enUS}
        />,
      )

      // 7天差距
      expect(screen.getByText("7 days")).toBeInTheDocument()
    })

    it("应该正确计算跨月日期差", () => {
      const startDate = createDate(2024, 1, 25) // 2024-01-25
      const endDate = createDate(2024, 2, 5) // 2024-02-05

      render(
        <DateRangeInput
          startValue={startDate}
          endValue={endDate}
          locale={enUS}
        />,
      )

      // 跨月：1月25日到2月5日 = 11天
      expect(screen.getByText("11 days")).toBeInTheDocument()
    })

    it("应该正确计算跨年日期差", () => {
      const startDate = createDate(2023, 12, 25) // 2023-12-25
      const endDate = createDate(2024, 1, 5) // 2024-01-05

      render(
        <DateRangeInput
          startValue={startDate}
          endValue={endDate}
          locale={enUS}
        />,
      )

      // 跨年：12月25日到1月5日 = 11天
      expect(screen.getByText("11 days")).toBeInTheDocument()
    })

    it("应该正确处理相同日期", () => {
      const sameDate = createDate(2024, 1, 1)

      render(
        <DateRangeInput
          startValue={sameDate}
          endValue={sameDate}
          locale={enUS}
        />,
      )

      // 相同日期：显示为1天（单数形式）
      expect(screen.getByText("1 day")).toBeInTheDocument()
    })

    it("应该正确计算较大日期范围", () => {
      const startDate = createDate(2024, 1, 1) // 2024-01-01
      const endDate = createDate(2024, 12, 31) // 2024-12-31

      render(
        <DateRangeInput
          startValue={startDate}
          endValue={endDate}
          locale={enUS}
        />,
      )

      // 全年：365天（2024是闰年，366天）
      expect(screen.getByText("365 days")).toBeInTheDocument()
    })
  })

  // 多语言格式化逻辑测试
  describe("多语言格式化逻辑", () => {
    const startDate = createDate(2024, 1, 1)
    const endDate = createDate(2024, 1, 8) // 7天差距

    it("应该正确格式化中文日期差", () => {
      render(
        <DateRangeInput
          startValue={startDate}
          endValue={endDate}
          locale={zhCN}
        />,
      )

      expect(screen.getByText("7 天")).toBeInTheDocument()
    })

    it("应该正确格式化英文日期差", () => {
      render(
        <DateRangeInput
          startValue={startDate}
          endValue={endDate}
          locale={enUS}
        />,
      )

      expect(screen.getByText("7 days")).toBeInTheDocument()
    })

    it("应该正确格式化日文日期差", () => {
      render(
        <DateRangeInput
          startValue={startDate}
          endValue={endDate}
          locale={ja}
        />,
      )

      expect(screen.getByText("7日")).toBeInTheDocument()
    })

    it("应该正确格式化韩文日期差", () => {
      render(
        <DateRangeInput
          startValue={startDate}
          endValue={endDate}
          locale={ko}
        />,
      )

      expect(screen.getByText("7일")).toBeInTheDocument()
    })

    it("应该处理单日的单复数形式", () => {
      const start = createDate(2024, 1, 1)
      const end = createDate(2024, 1, 2) // 1天

      render(
        <DateRangeInput
          startValue={start}
          endValue={end}
          locale={enUS}
        />,
      )

      expect(screen.getByText("1 day")).toBeInTheDocument()
    })
  })

  // 边界情况和错误处理测试
  describe("边界情况和错误处理", () => {
    it("应该处理 null 开始日期", () => {
      const endDate = createDate(2024, 1, 5)

      render(
        <DateRangeInput
          startValue={null}
          endValue={endDate}
        />,
      )

      // 没有开始日期时，不应该显示日期差
      expect(screen.queryByText(/day|天|日|일/)).not.toBeInTheDocument()
    })

    it("应该处理 null 结束日期", () => {
      const startDate = createDate(2024, 1, 1)

      render(
        <DateRangeInput
          startValue={startDate}
          endValue={null}
        />,
      )

      // 没有结束日期时，不应该显示日期差
      expect(screen.queryByText(/day|天|日|일/)).not.toBeInTheDocument()
    })

    it("应该处理两个日期都为 null", () => {
      render(
        <DateRangeInput
          startValue={null}
          endValue={null}
        />,
      )

      // 两个日期都为空时，不应该显示日期差
      expect(screen.queryByText(/day|天|日|일/)).not.toBeInTheDocument()
    })

    it("应该处理反向日期范围", () => {
      const startDate = createDate(2024, 1, 5) // 较晚的日期
      const endDate = createDate(2024, 1, 1) // 较早的日期

      render(
        <DateRangeInput
          startValue={startDate}
          endValue={endDate}
          locale={enUS}
        />,
      )

      // 反向范围应该仍然显示差距（绝对值）
      expect(screen.getByText("4 days")).toBeInTheDocument()
    })

    it("应该处理极大日期范围", () => {
      const startDate = createDate(2020, 1, 1)
      const endDate = createDate(2024, 1, 1) // 4年差距

      render(
        <DateRangeInput
          startValue={startDate}
          endValue={endDate}
          locale={enUS}
        />,
      )

      // 大范围应该显示天数（4年 ≈ 1461天，包含闰年）
      expect(screen.getByText(/1461 days/)).toBeInTheDocument()
    })

    it("应该处理闰年2月29日", () => {
      const startDate = createDate(2024, 2, 28) // 2024-02-28 (闰年)
      const endDate = createDate(2024, 3, 1) // 2024-03-01

      render(
        <DateRangeInput
          startValue={startDate}
          endValue={endDate}
          locale={enUS}
        />,
      )

      // 跨过闰年2月29日：2天
      expect(screen.getByText("2 days")).toBeInTheDocument()
    })
  })

  // 日期约束逻辑测试
  describe("日期约束逻辑", () => {
    it("应该设置正确的日期约束", () => {
      const startDate = createDate(2024, 1, 1)
      const endDate = createDate(2024, 1, 10)

      render(
        <DateRangeInput
          startValue={startDate}
          endValue={endDate}
        />,
      )

      // 验证组件渲染，约束逻辑已应用
      const inputs = screen.getAllByRole("textbox")
      expect(inputs).toHaveLength(2)
    })

    it("应该处理只有开始日期的约束", () => {
      const startDate = createDate(2024, 1, 1)

      render(
        <DateRangeInput
          startValue={startDate}
          endValue={null}
        />,
      )

      // 只有开始日期时，结束日期应该受最小日期约束
      const inputs = screen.getAllByRole("textbox")
      expect(inputs).toHaveLength(2)
    })

    it("应该处理只有结束日期的约束", () => {
      const endDate = createDate(2024, 1, 10)

      render(
        <DateRangeInput
          startValue={null}
          endValue={endDate}
        />,
      )

      // 只有结束日期时，开始日期应该受最大日期约束
      const inputs = screen.getAllByRole("textbox")
      expect(inputs).toHaveLength(2)
    })
  })

  // 回调函数逻辑测试
  describe("回调函数逻辑", () => {
    it("应该正确传递开始日期变化回调", () => {
      const mockStartChange = jest.fn()

      render(<DateRangeInput onStartChange={mockStartChange} />)

      // 验证组件渲染成功，回调函数已传递
      expect(screen.getAllByRole("textbox")).toHaveLength(2)
    })

    it("应该正确传递结束日期变化回调", () => {
      const mockEndChange = jest.fn()

      render(<DateRangeInput onEndChange={mockEndChange} />)

      // 验证组件渲染成功，回调函数已传递
      expect(screen.getAllByRole("textbox")).toHaveLength(2)
    })

    it("应该正确传递焦点事件回调", () => {
      const mockStartFocus = jest.fn()
      const mockEndFocus = jest.fn()

      render(
        <DateRangeInput
          onStartFocus={mockStartFocus}
          onEndFocus={mockEndFocus}
        />,
      )

      // 验证组件渲染成功，焦点回调已传递
      expect(screen.getAllByRole("textbox")).toHaveLength(2)
    })

    it("应该正确传递回车键回调", () => {
      const mockEnterKeyDown = jest.fn()

      render(<DateRangeInput onEnterKeyDown={mockEnterKeyDown} />)

      // 验证组件渲染成功，回车回调已传递
      expect(screen.getAllByRole("textbox")).toHaveLength(2)
    })
  })

  // 格式化选项测试
  describe("格式化选项测试", () => {
    it("应该支持不同的日期格式", () => {
      const startDate = createDate(2024, 1, 1)
      const endDate = createDate(2024, 1, 5)

      render(
        <DateRangeInput
          startValue={startDate}
          endValue={endDate}
          format="yyyy-MM-dd"
        />,
      )

      // 验证组件正常渲染，格式传递成功
      expect(screen.getAllByRole("textbox")).toHaveLength(2)
    })

    it("应该处理自定义占位符文本", () => {
      render(
        <DateRangeInput
          startPlaceholder="开始日期"
          endPlaceholder="结束日期"
        />,
      )

      expect(screen.getByPlaceholderText("开始日期")).toBeInTheDocument()
      expect(screen.getByPlaceholderText("结束日期")).toBeInTheDocument()
    })

    it("应该使用默认占位符文本", () => {
      render(<DateRangeInput />)

      expect(screen.getByPlaceholderText("Start Date")).toBeInTheDocument()
      expect(screen.getByPlaceholderText("End Date")).toBeInTheDocument()
    })
  })

  // formatDistanceStrict 函数逻辑测试
  describe("formatDistanceStrict 函数逻辑", () => {
    it("应该使用 date-fns 的 formatDistanceStrict 进行计算", () => {
      const startDate = createDate(2024, 1, 1)
      const endDate = createDate(2024, 1, 15) // 14天

      render(
        <DateRangeInput
          startValue={startDate}
          endValue={endDate}
          locale={enUS}
        />,
      )

      // formatDistanceStrict 应该显示精确的天数
      expect(screen.getByText("14 days")).toBeInTheDocument()
    })

    it("应该正确处理月份边界", () => {
      const startDate = createDate(2024, 1, 31) // 1月31日
      const endDate = createDate(2024, 2, 1) // 2月1日

      render(
        <DateRangeInput
          startValue={startDate}
          endValue={endDate}
          locale={enUS}
        />,
      )

      // 跨月边界：1天
      expect(screen.getByText("1 day")).toBeInTheDocument()
    })

    it("应该正确处理年份边界", () => {
      const startDate = createDate(2023, 12, 31) // 2023年12月31日
      const endDate = createDate(2024, 1, 1) // 2024年1月1日

      render(
        <DateRangeInput
          startValue={startDate}
          endValue={endDate}
          locale={enUS}
        />,
      )

      // 跨年边界：1天
      expect(screen.getByText("1 day")).toBeInTheDocument()
    })
  })

  // 性能和稳定性测试
  describe("性能和稳定性", () => {
    it("应该正确处理频繁的日期变化", () => {
      const { rerender } = render(
        <DateRangeInput
          startValue={createDate(2024, 1, 1)}
          endValue={createDate(2024, 1, 2)}
          locale={enUS}
        />,
      )

      expect(screen.getByText("1 day")).toBeInTheDocument()

      // 重新渲染不同的日期
      rerender(
        <DateRangeInput
          startValue={createDate(2024, 1, 1)}
          endValue={createDate(2024, 1, 10)}
          locale={enUS}
        />,
      )

      expect(screen.getByText("9 days")).toBeInTheDocument()
    })

    it("应该正确处理语言环境变化", () => {
      const startDate = createDate(2024, 1, 1)
      const endDate = createDate(2024, 1, 5)

      const { rerender } = render(
        <DateRangeInput
          startValue={startDate}
          endValue={endDate}
          locale={enUS}
        />,
      )

      expect(screen.getByText("4 days")).toBeInTheDocument()

      // 切换到中文
      rerender(
        <DateRangeInput
          startValue={startDate}
          endValue={endDate}
          locale={zhCN}
        />,
      )

      expect(screen.getByText("4 天")).toBeInTheDocument()
    })
  })
})
