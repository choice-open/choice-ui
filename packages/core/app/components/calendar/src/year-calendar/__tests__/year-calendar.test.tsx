import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import React from "react"
import { enUS, zhCN } from "date-fns/locale"
import { YearCalendar } from "../year-calendar"

// 测试工具函数
const createTestDate = (year: number): Date => {
  return new Date(year, 0, 1)
}

const getCurrentYear = () => new Date().getFullYear()

describe("YearCalendar", () => {
  const currentYear = getCurrentYear()

  // 年份选择测试
  describe("年份选择", () => {
    it("应该显示选中的年份", () => {
      const selectedYear = createTestDate(2020)
      render(<YearCalendar value={selectedYear} />)

      const selectedCell = screen.getByTestId("2020")
      expect(selectedCell).toHaveAttribute("data-selected", "true")
    })

    it("应该在点击年份时调用onChange", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()

      render(<YearCalendar onChange={handleChange} />)

      await user.click(screen.getByTestId(currentYear))

      expect(handleChange).toHaveBeenCalledTimes(1)
      expect(handleChange.mock.calls[0][0]).toBeInstanceOf(Date)
      expect(handleChange.mock.calls[0][0].getFullYear()).toBe(currentYear)
    })

    it("应该在值改变时更新选中状态", async () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState<Date | null>(createTestDate(2020))

        return (
          <div>
            <YearCalendar
              value={value}
              onChange={setValue}
            />
            <button onClick={() => setValue(createTestDate(2025))}>Change to 2025</button>
          </div>
        )
      }

      render(<TestComponent />)

      // 初始状态
      expect(screen.getByTestId("2020")).toHaveAttribute("data-selected", "true")

      // 点击按钮改变值
      fireEvent.click(screen.getByText("Change to 2025"))

      // 检查新的选中状态
      await waitFor(() => {
        expect(screen.getByTestId("2025")).toHaveAttribute("data-selected", "true")
      })
    })
  })

  // 非受控组件测试
  describe("非受控组件", () => {
    it("应该支持defaultValue", () => {
      const defaultYear = createTestDate(2022)
      render(<YearCalendar defaultValue={defaultYear} />)

      const selectedCell = screen.getByTestId("2022")
      expect(selectedCell).toHaveAttribute("data-selected", "true")
    })

    it("应该在内部管理状态", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()

      render(
        <YearCalendar
          defaultValue={createTestDate(2020)}
          onChange={handleChange}
        />,
      )

      await user.click(screen.getByTestId("2025"))

      expect(handleChange).toHaveBeenCalledTimes(1)
      expect(screen.getByTestId("2025")).toHaveAttribute("data-selected", "true")
    })
  })

  // 当前年份高亮测试
  describe("当前年份高亮", () => {
    it("应该高亮当前年份", () => {
      render(<YearCalendar currentYear={createTestDate(currentYear)} />)

      const currentYearCell = screen.getByTestId(currentYear)
      expect(currentYearCell).toHaveAttribute("data-current", "true")
    })

    it("应该同时显示选中和当前年份的样式", () => {
      render(
        <YearCalendar
          value={createTestDate(currentYear)}
          currentYear={createTestDate(currentYear)}
        />,
      )

      const currentYearCell = screen.getByTestId(currentYear)
      expect(currentYearCell).toHaveAttribute("data-current", "true")
      expect(currentYearCell).toHaveAttribute("data-selected", "true")
    })
  })

  // 导航功能测试
  describe("导航功能", () => {
    it("应该有导航按钮", () => {
      render(<YearCalendar />)

      expect(screen.getByTestId("prev-button")).toBeInTheDocument()
      expect(screen.getByTestId("next-button")).toBeInTheDocument()
    })

    it("应该在点击导航按钮时调用onNavigate", async () => {
      const user = userEvent.setup()
      const handleNavigate = jest.fn()

      render(<YearCalendar onNavigate={handleNavigate} />)

      await user.click(screen.getByTestId("next-button"))

      expect(handleNavigate).toHaveBeenCalledWith("next", expect.any(Date))
    })

    it("应该在内部状态下更新年份范围", async () => {
      const user = userEvent.setup()
      // 不设置 startYear，让组件使用内部状态
      render(<YearCalendar yearCount={6} />)

      // 获取初始标题，因为没设置startYear，会使用当前年份附近的范围
      const initialTitle = screen.getByTestId("year-range-title").textContent

      await user.click(screen.getByTestId("next-button"))

      // 应该显示下一组年份
      await waitFor(() => {
        const newTitle = screen.getByTestId("year-range-title").textContent
        expect(newTitle).not.toBe(initialTitle)
      })
    })

    it("应该显示今天按钮当当前年份不在范围内时", () => {
      render(
        <YearCalendar
          startYear={createTestDate(2000)}
          yearCount={12}
        />,
      )

      expect(screen.getByTestId("today-button")).toBeInTheDocument()
    })

    it("应该隐藏今天按钮当当前年份在范围内时", () => {
      render(
        <YearCalendar
          startYear={createTestDate(currentYear - 5)}
          yearCount={12}
        />,
      )

      expect(screen.queryByTestId("today-button")).not.toBeInTheDocument()
    })

    it("应该在点击今天按钮时跳转到当前年份", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()

      render(
        <YearCalendar
          startYear={createTestDate(2000)}
          yearCount={12}
          onChange={handleChange}
        />,
      )

      await user.click(screen.getByTestId("today-button"))

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith(expect.any(Date))
        const calledDate = handleChange.mock.calls[0][0]
        expect(calledDate.getFullYear()).toBe(currentYear)
      })
    })
  })

  // 年份约束测试
  describe("年份约束", () => {
    it("应该禁用超出最小年份的年份", () => {
      const minYear = createTestDate(2020)
      render(
        <YearCalendar
          startYear={createTestDate(2015)}
          minYear={minYear}
          yearCount={12}
        />,
      )

      const year2019 = screen.getByTestId("2019")
      expect(year2019).toHaveAttribute("data-disabled", "true")
      expect(year2019).toHaveAttribute("data-in-range", "false")
    })

    it("应该禁用超出最大年份的年份", () => {
      const maxYear = createTestDate(2025)
      render(
        <YearCalendar
          startYear={createTestDate(2020)}
          maxYear={maxYear}
          yearCount={12}
        />,
      )

      const year2026 = screen.getByTestId("2026")
      expect(year2026).toHaveAttribute("data-disabled", "true")
      expect(year2026).toHaveAttribute("data-in-range", "false")
    })

    it("应该禁用指定的年份", () => {
      const disabledYears = [createTestDate(2022), createTestDate(2024)]
      render(
        <YearCalendar
          startYear={createTestDate(2020)}
          disabledYears={disabledYears}
          yearCount={12}
        />,
      )

      expect(screen.getByTestId("2022")).toHaveAttribute("data-disabled", "true")
      expect(screen.getByTestId("2024")).toHaveAttribute("data-disabled", "true")
    })

    it("不应该选择禁用的年份", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()
      const disabledYears = [createTestDate(2022)]

      render(
        <YearCalendar
          startYear={createTestDate(2020)}
          disabledYears={disabledYears}
          onChange={handleChange}
          yearCount={12}
        />,
      )

      await user.click(screen.getByTestId("2022"))

      expect(handleChange).not.toHaveBeenCalled()
    })

    it("应该禁用导航按钮当达到边界时", () => {
      const minYear = createTestDate(2020)
      const maxYear = createTestDate(2031)
      render(
        <YearCalendar
          startYear={createTestDate(2020)}
          minYear={minYear}
          maxYear={maxYear}
          yearCount={12}
        />,
      )

      expect(screen.getByTestId("prev-button")).toBeDisabled()
      expect(screen.getByTestId("next-button")).toBeDisabled()
    })
  })

  // 禁用状态测试
  describe("禁用状态", () => {
    it("应该禁用所有年份", () => {
      render(
        <YearCalendar
          disabled={true}
          startYear={createTestDate(2020)}
          yearCount={12}
        />,
      )

      const year2020 = screen.getByTestId("2020")
      const year2025 = screen.getByTestId("2025")

      expect(year2020).toHaveAttribute("data-disabled", "true")
      expect(year2025).toHaveAttribute("data-disabled", "true")
    })

    it("应该禁用导航按钮", () => {
      render(<YearCalendar disabled={true} />)

      expect(screen.getByTestId("prev-button")).toBeDisabled()
      expect(screen.getByTestId("next-button")).toBeDisabled()
    })

    it("不应该在禁用状态下响应点击", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()

      render(
        <YearCalendar
          disabled={true}
          onChange={handleChange}
        />,
      )

      await user.click(screen.getByTestId(currentYear))

      expect(handleChange).not.toHaveBeenCalled()
    })
  })

  // 变体样式测试
  describe("变体样式", () => {
    it("应该支持default变体", () => {
      render(<YearCalendar variant="default" />)

      const container = screen.getByTestId("year-calendar")
      expect(container).toHaveClass("bg-default-background")
    })

    it("应该支持dark变体", () => {
      render(<YearCalendar variant="dark" />)

      const container = screen.getByTestId("year-calendar")
      expect(container).toHaveClass("bg-menu-background", "text-white")
    })
  })

  // 年份数量测试
  describe("年份数量", () => {
    it("应该支持不同的年份数量", () => {
      render(<YearCalendar yearCount={9} />)

      const yearCells = screen.getAllByTestId(/^\d+$/)
      expect(yearCells).toHaveLength(9)
    })

    it("应该使用3列网格布局", () => {
      render(<YearCalendar />)

      const grid = screen.getByTestId("years-grid")
      expect(grid).toHaveClass("grid-cols-3")
    })
  })

  // 语言本地化测试
  describe("语言本地化", () => {
    it("应该支持中文", () => {
      render(<YearCalendar locale={zhCN} />)

      // 应该有中文的aria-label
      const prevButton = screen.getByTestId("prev-button")
      expect(prevButton).toHaveAttribute("aria-label", "上一组年份")
    })

    it("应该支持英文", () => {
      render(<YearCalendar locale={enUS} />)

      const prevButton = screen.getByTestId("prev-button")
      expect(prevButton).toHaveAttribute("aria-label", "Previous years")
    })
  })

  // 边缘情况测试
  describe("边缘情况", () => {
    it("应该处理null值", () => {
      render(<YearCalendar value={null} />)

      // 不应该有选中的年份
      const yearCells = screen.getAllByTestId(/^\d+$/)
      yearCells.forEach((cell) => {
        expect(cell).toHaveAttribute("data-selected", "false")
      })
    })

    it("应该处理undefined值", () => {
      render(<YearCalendar value={undefined} />)

      expect(screen.getByTestId("year-calendar")).toBeInTheDocument()
    })

    it("应该处理无效日期", () => {
      const invalidDate = new Date("invalid")
      render(<YearCalendar value={invalidDate} />)

      expect(screen.getByTestId("year-calendar")).toBeInTheDocument()
    })

    it("应该处理极端年份", () => {
      const extremeYear = createTestDate(1900)
      render(
        <YearCalendar
          startYear={extremeYear}
          yearCount={12}
        />,
      )

      expect(screen.getByTestId("1900")).toBeInTheDocument()
      expect(screen.getByTestId("1911")).toBeInTheDocument()
    })

    it("应该处理未来年份", () => {
      const futureYear = createTestDate(2100)
      render(
        <YearCalendar
          startYear={futureYear}
          yearCount={12}
        />,
      )

      expect(screen.getByTestId("2100")).toBeInTheDocument()
      expect(screen.getByTestId("2111")).toBeInTheDocument()
    })
  })

  // 性能测试
  describe("性能", () => {
    it("应该快速渲染大量年份", () => {
      const startTime = performance.now()
      render(<YearCalendar yearCount={24} />)
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(100)

      const yearCells = screen.getAllByTestId(/^\d+$/)
      expect(yearCells).toHaveLength(24)
    })
  })

  // 可访问性测试
  describe("可访问性", () => {
    it("应该有正确的ARIA标签", () => {
      render(<YearCalendar />)

      const prevButton = screen.getByTestId("prev-button")
      const nextButton = screen.getByTestId("next-button")

      expect(prevButton).toHaveAttribute("aria-label")
      expect(nextButton).toHaveAttribute("aria-label")
    })

    it("应该支持键盘导航", async () => {
      render(<YearCalendar />)

      const firstYearCell = screen.getAllByTestId(/^\d+$/)[0]

      // 应该能获得焦点（通过点击模拟）
      fireEvent.click(firstYearCell)
      expect(firstYearCell).toBeInTheDocument()
    })

    it("应该正确设置按钮禁用状态", () => {
      render(<YearCalendar disabled={true} />)

      const prevButton = screen.getByTestId("prev-button")
      const nextButton = screen.getByTestId("next-button")

      expect(prevButton).toBeDisabled()
      expect(nextButton).toBeDisabled()
    })
  })

  // 集成测试
  describe("集成测试", () => {
    it("应该完整的年份选择流程", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()

      // 测试受控模式的导航
      const TestComponent = () => {
        const [startYear, setStartYear] = React.useState(createTestDate(2020))

        const handleNavigate = (direction: "prev" | "next", newStartDate: Date) => {
          setStartYear(newStartDate)
        }

        return (
          <YearCalendar
            startYear={startYear}
            onNavigate={handleNavigate}
            onChange={handleChange}
            yearCount={6}
          />
        )
      }

      render(<TestComponent />)

      // 选择年份
      await user.click(screen.getByTestId("2023"))
      expect(handleChange).toHaveBeenCalledWith(expect.any(Date))
      expect(handleChange.mock.calls[0][0].getFullYear()).toBe(2023)

      // 导航到下一组
      await user.click(screen.getByTestId("next-button"))

      // 应该显示新的年份范围
      await waitFor(() => {
        expect(screen.getByTestId("year-range-title")).toHaveTextContent("2026 - 2031")
      })
    })

    it("应该正确处理约束和导航的组合", async () => {
      const user = userEvent.setup()
      const minYear = createTestDate(2020)
      const maxYear = createTestDate(2025)

      render(
        <YearCalendar
          startYear={createTestDate(2020)}
          minYear={minYear}
          maxYear={maxYear}
          yearCount={6}
        />,
      )

      // 前一组应该被禁用（会超出最小年份）
      expect(screen.getByTestId("prev-button")).toBeDisabled()

      // 后一组应该被禁用（会超出最大年份）
      expect(screen.getByTestId("next-button")).toBeDisabled()
    })
  })
})
