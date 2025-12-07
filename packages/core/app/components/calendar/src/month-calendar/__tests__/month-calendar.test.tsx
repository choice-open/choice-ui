import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import { MonthCalendar } from "../month-calendar"

describe("MonthCalendar 组件业务逻辑测试", () => {
  describe("单选模式", () => {
    test("应该能够选择日期", () => {
      const handleChange = jest.fn()

      render(
        <MonthCalendar
          selectionMode="single"
          onChange={handleChange}
          currentMonth={new Date(2024, 0, 1)}
        />,
      )

      // 点击15号 - 用完整日期格式的testid
      const day15 = screen.getByTestId("2024-1-15")
      fireEvent.click(day15)

      expect(handleChange).toHaveBeenCalledWith(expect.any(Date))
      const calledDate = handleChange.mock.calls[0][0]
      expect(calledDate.getDate()).toBe(15)
    })

    test("应该能够更换选中的日期", () => {
      const handleChange = jest.fn()

      render(
        <MonthCalendar
          selectionMode="single"
          value={new Date(2024, 0, 10)}
          onChange={handleChange}
          currentMonth={new Date(2024, 0, 1)}
        />,
      )

      // 点击20号
      const day20 = screen.getByTestId("2024-1-20")
      fireEvent.click(day20)

      expect(handleChange).toHaveBeenCalledWith(expect.any(Date))
      const calledDate = handleChange.mock.calls[0][0]
      expect(calledDate.getDate()).toBe(20)
    })
  })

  describe("基础渲染", () => {
    test("应该正确显示当前月的日期", () => {
      render(<MonthCalendar currentMonth={new Date(2024, 0, 1)} />)

      // 检查是否显示了1月的特定日期
      expect(screen.getByTestId("2024-1-15")).toBeInTheDocument()
    })

    test("应该能够显示选中状态", () => {
      render(
        <MonthCalendar
          selectionMode="single"
          value={new Date(2024, 0, 15)}
          currentMonth={new Date(2024, 0, 1)}
        />,
      )

      // 检查15号是否被标记为选中
      const day15 = screen.getByTestId("2024-1-15")
      expect(day15).toHaveAttribute("data-selected", "true")
    })
  })

  describe("多选模式", () => {
    test("应该能够选择多个日期", () => {
      const handleChange = jest.fn()

      render(
        <MonthCalendar
          selectionMode="multiple"
          onChange={handleChange}
          currentMonth={new Date(2024, 0, 1)}
        />,
      )

      // 选择15号
      const day15 = screen.getByTestId("2024-1-15")
      fireEvent.click(day15)

      expect(handleChange).toHaveBeenCalledWith(expect.any(Array))
      expect(handleChange.mock.calls[0][0]).toHaveLength(1)

      // 再选择20号
      const day20 = screen.getByTestId("2024-1-20")
      fireEvent.click(day20)

      expect(handleChange).toHaveBeenCalledTimes(2)
    })

    test("应该能够取消选中的日期", () => {
      const handleChange = jest.fn()
      const initialValue = [new Date(2024, 0, 15)]

      render(
        <MonthCalendar
          selectionMode="multiple"
          value={initialValue}
          onChange={handleChange}
          currentMonth={new Date(2024, 0, 1)}
        />,
      )

      // 再次点击15号应该取消选中
      const day15 = screen.getByTestId("2024-1-15")
      fireEvent.click(day15)

      expect(handleChange).toHaveBeenCalledWith([])
    })
  })

  describe("范围选择模式", () => {
    test("应该能够选择日期范围", () => {
      const handleChange = jest.fn()

      render(
        <MonthCalendar
          selectionMode="range"
          onChange={handleChange}
          currentMonth={new Date(2024, 0, 1)}
        />,
      )

      // 选择开始日期
      const day10 = screen.getByTestId("2024-1-10")
      fireEvent.click(day10)

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          start: expect.any(Date),
          end: expect.any(Date),
        }),
      )

      // 选择结束日期
      const day20 = screen.getByTestId("2024-1-20")
      fireEvent.click(day20)

      expect(handleChange).toHaveBeenCalledTimes(2)
      const rangeValue = handleChange.mock.calls[1][0]
      expect(rangeValue.start.getDate()).toBe(10)
      expect(rangeValue.end.getDate()).toBe(20)
    })
  })

  describe("禁用日期", () => {
    test("应该不能选择被禁用的日期", () => {
      const handleChange = jest.fn()
      const disabledDates = [new Date(2024, 0, 15)]

      render(
        <MonthCalendar
          selectionMode="single"
          disabledDates={disabledDates}
          onChange={handleChange}
          currentMonth={new Date(2024, 0, 1)}
        />,
      )

      // 尝试点击被禁用的15号
      const day15 = screen.getByTestId("2024-1-15")
      fireEvent.click(day15)

      expect(handleChange).not.toHaveBeenCalled()
    })

    test("应该不能选择超出范围的日期", () => {
      const handleChange = jest.fn()
      const minDate = new Date(2024, 0, 10)
      const maxDate = new Date(2024, 0, 20)

      render(
        <MonthCalendar
          selectionMode="single"
          minDate={minDate}
          maxDate={maxDate}
          onChange={handleChange}
          currentMonth={new Date(2024, 0, 1)}
        />,
      )

      // 尝试点击5号（超出最小日期）
      const day5 = screen.getByTestId("2024-1-5")
      fireEvent.click(day5)

      expect(handleChange).not.toHaveBeenCalled()

      // 尝试点击25号（超出最大日期）
      const day25 = screen.getByTestId("2024-1-25")
      fireEvent.click(day25)

      expect(handleChange).not.toHaveBeenCalled()
    })
  })

  describe("受控/非受控模式", () => {
    test("受控模式应该使用外部value", () => {
      const controlledValue = new Date(2024, 0, 15)

      render(
        <MonthCalendar
          selectionMode="single"
          value={controlledValue}
          currentMonth={new Date(2024, 0, 1)}
        />,
      )

      // 检查15号是否被标记为选中
      const day15 = screen.getByTestId("2024-1-15")
      expect(day15).toHaveAttribute("data-selected", "true")
    })

    test("非受控模式应该使用内部状态", () => {
      const handleChange = jest.fn()
      const defaultValue = new Date(2024, 0, 10)

      render(
        <MonthCalendar
          selectionMode="single"
          defaultValue={defaultValue}
          onChange={handleChange}
          currentMonth={new Date(2024, 0, 1)}
        />,
      )

      // 检查10号是否被标记为选中
      const day10 = screen.getByTestId("2024-1-10")
      expect(day10).toHaveAttribute("data-selected", "true")
    })
  })

  describe("月份导航", () => {
    test("应该能够切换到上一个月", () => {
      const handleMonthChange = jest.fn()

      render(
        <MonthCalendar
          currentMonth={new Date(2024, 1, 1)} // 2月
          onMonthChange={handleMonthChange}
        />,
      )

      // 点击上一个月按钮
      const prevButton = screen.getByRole("button", { name: /previous|prev|上|前/i })
      fireEvent.click(prevButton)

      expect(handleMonthChange).toHaveBeenCalledWith(expect.any(Date))
      const newMonth = handleMonthChange.mock.calls[0][0]
      expect(newMonth.getMonth()).toBe(0) // 应该是1月
    })

    test("应该能够切换到下一个月", () => {
      const handleMonthChange = jest.fn()

      render(
        <MonthCalendar
          currentMonth={new Date(2024, 0, 1)} // 1月
          onMonthChange={handleMonthChange}
        />,
      )

      // 点击下一个月按钮
      const nextButton = screen.getByRole("button", { name: /next|下|后/i })
      fireEvent.click(nextButton)

      expect(handleMonthChange).toHaveBeenCalledWith(expect.any(Date))
      const newMonth = handleMonthChange.mock.calls[0][0]
      expect(newMonth.getMonth()).toBe(1) // 应该是2月
    })
  })

  describe("周数显示", () => {
    test("应该能够显示周数", () => {
      render(
        <MonthCalendar
          currentMonth={new Date(2024, 0, 1)}
          showWeekNumbers={true}
        />,
      )

      // 简单直接：检查是否有周数元素
      // 2024年1月包含的周数（ISO周数）
      const weekNumbers = screen.getAllByTestId(/^week-number-\d+$/)

      expect(weekNumbers.length).toBeGreaterThan(0)

      // 验证周数内容是数字
      weekNumbers.forEach((weekEl) => {
        expect(weekEl.textContent).toMatch(/^\d+$/)
      })
    })
  })

  describe("边界情况", () => {
    test("应该正确处理闰年2月", () => {
      render(
        <MonthCalendar
          currentMonth={new Date(2024, 1, 1)} // 2024年2月（闰年）
        />,
      )

      // 应该显示29号
      expect(screen.getByTestId("2024-2-29")).toBeInTheDocument()
    })

    test("应该正确处理平年2月", () => {
      render(
        <MonthCalendar
          currentMonth={new Date(2023, 1, 1)} // 2023年2月（平年）
        />,
      )

      // 平年2月不应该有29号，检查是否抛出错误
      expect(() => screen.getByTestId("2023-2-29")).toThrow()
    })
  })
})
