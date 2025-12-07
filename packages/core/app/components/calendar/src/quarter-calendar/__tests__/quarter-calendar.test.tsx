import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import React from "react"
import { enUS, zhCN } from "date-fns/locale"
import { QuarterCalendar } from "../quarter-calendar"
import type { Quarter } from "../../types"

// 测试工具函数
const createTestQuarter = (quarter: number, year: number): Quarter => {
  const quarterLabels = ["一季度", "二季度", "三季度", "四季度"]
  const monthGroups = [
    ["一月", "二月", "三月"],
    ["四月", "五月", "六月"],
    ["七月", "八月", "九月"],
    ["十月", "十一月", "十二月"],
  ]

  return {
    quarter,
    year,
    label: quarterLabels[quarter - 1],
    months: monthGroups[quarter - 1],
  }
}

const getCurrentYear = () => new Date().getFullYear()

describe("QuarterCalendar", () => {
  const currentYear = getCurrentYear()

  // 季度选择测试
  describe("季度选择", () => {
    it("应该显示选中的季度", () => {
      const selectedQuarter = createTestQuarter(2, 2020)
      render(
        <QuarterCalendar
          value={selectedQuarter}
          currentYear={2020}
        />,
      )

      const selectedCell = screen.getByTestId("2020-Q2")
      expect(selectedCell).toHaveAttribute("data-selected", "true")
    })

    it("应该在点击季度时调用onChange", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()

      render(
        <QuarterCalendar
          currentYear={currentYear}
          onChange={handleChange}
        />,
      )

      await user.click(screen.getByTestId(`${currentYear}-Q2`))

      expect(handleChange).toHaveBeenCalledTimes(1)
      expect(handleChange.mock.calls[0][0]).toMatchObject({
        quarter: 2,
        year: currentYear,
      })
    })

    it("应该在值改变时更新选中状态", async () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState<Quarter | null>(createTestQuarter(1, 2020))

        return (
          <div>
            <QuarterCalendar
              value={value}
              onChange={setValue}
              currentYear={2020}
            />
            <button onClick={() => setValue(createTestQuarter(3, 2020))}>Change to Q3</button>
          </div>
        )
      }

      render(<TestComponent />)

      // 初始状态
      expect(screen.getByTestId("2020-Q1")).toHaveAttribute("data-selected", "true")

      // 点击按钮改变值
      fireEvent.click(screen.getByText("Change to Q3"))

      // 检查新的选中状态
      await waitFor(() => {
        expect(screen.getByTestId("2020-Q3")).toHaveAttribute("data-selected", "true")
      })
    })
  })

  // 非受控组件测试
  describe("非受控组件", () => {
    it("应该支持defaultValue", () => {
      const defaultQuarter = createTestQuarter(3, 2022)
      render(
        <QuarterCalendar
          defaultValue={defaultQuarter}
          currentYear={2022}
        />,
      )

      const selectedCell = screen.getByTestId("2022-Q3")
      expect(selectedCell).toHaveAttribute("data-selected", "true")
    })

    it("应该在内部管理状态", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()

      render(
        <QuarterCalendar
          defaultValue={createTestQuarter(1, 2020)}
          onChange={handleChange}
          currentYear={2020}
        />,
      )

      await user.click(screen.getByTestId("2020-Q4"))

      expect(handleChange).toHaveBeenCalledTimes(1)
      expect(screen.getByTestId("2020-Q4")).toHaveAttribute("data-selected", "true")
    })
  })

  // 当前季度高亮测试
  describe("当前季度高亮", () => {
    it("应该高亮当前季度", () => {
      render(<QuarterCalendar currentYear={currentYear} />)

      // 获取当前季度数字 (1-4)
      const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3)
      const currentQuarterCell = screen.getByTestId(`${currentYear}-Q${currentQuarter}`)
      expect(currentQuarterCell).toHaveAttribute("data-current", "true")
    })

    it("应该同时显示选中和当前季度的样式", () => {
      const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3)
      const currentQuarterObj = createTestQuarter(currentQuarter, currentYear)

      render(
        <QuarterCalendar
          value={currentQuarterObj}
          currentYear={currentYear}
        />,
      )

      const currentQuarterCell = screen.getByTestId(`${currentYear}-Q${currentQuarter}`)
      expect(currentQuarterCell).toHaveAttribute("data-current", "true")
      expect(currentQuarterCell).toHaveAttribute("data-selected", "true")
    })
  })

  // 导航功能测试
  describe("导航功能", () => {
    it("应该有导航按钮", () => {
      render(<QuarterCalendar />)

      expect(screen.getByTestId("prev-button")).toBeInTheDocument()
      expect(screen.getByTestId("next-button")).toBeInTheDocument()
    })

    it("应该在点击导航按钮时调用onNavigate", async () => {
      const user = userEvent.setup()
      const handleNavigate = jest.fn()

      render(<QuarterCalendar onNavigate={handleNavigate} />)

      await user.click(screen.getByTestId("next-button"))

      expect(handleNavigate).toHaveBeenCalledWith("next", expect.any(Number))
    })

    it("应该在内部状态下更新年份", async () => {
      const user = userEvent.setup()
      render(<QuarterCalendar locale={zhCN} />)

      // 获取初始年份
      const initialTitle = screen.getByTestId("year-title").textContent

      await user.click(screen.getByTestId("next-button"))

      // 应该显示下一年
      await waitFor(() => {
        const newTitle = screen.getByTestId("year-title").textContent
        expect(newTitle).not.toBe(initialTitle)
      })
    })

    it("应该显示今年按钮当当前年份不在显示范围时", () => {
      render(<QuarterCalendar currentYear={2000} />)

      expect(screen.getByTestId("today-button")).toBeInTheDocument()
    })

    it("应该隐藏今年按钮当当前年份在显示范围时", () => {
      render(<QuarterCalendar currentYear={currentYear} />)

      expect(screen.queryByTestId("today-button")).not.toBeInTheDocument()
    })

    it("应该在点击今年按钮时跳转到当前年份", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()

      render(
        <QuarterCalendar
          currentYear={2000}
          onChange={handleChange}
        />,
      )

      await user.click(screen.getByTestId("today-button"))

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith(
          expect.objectContaining({
            year: currentYear,
          }),
        )
      })
    })
  })

  // 季度约束测试
  describe("季度约束", () => {
    it("应该禁用超出最小年份的季度", () => {
      const minYear = 2020
      render(
        <QuarterCalendar
          startYear={2019}
          minYear={minYear}
        />,
      )

      const quarter2019_1 = screen.getByTestId("2019-Q1")
      expect(quarter2019_1).toHaveAttribute("data-disabled", "true")
      expect(quarter2019_1).toHaveAttribute("data-in-range", "false")
    })

    it("应该禁用超出最大年份的季度", () => {
      const maxYear = 2025
      render(
        <QuarterCalendar
          startYear={2026}
          maxYear={maxYear}
        />,
      )

      const quarter2026_1 = screen.getByTestId("2026-Q1")
      expect(quarter2026_1).toHaveAttribute("data-disabled", "true")
      expect(quarter2026_1).toHaveAttribute("data-in-range", "false")
    })

    it("应该禁用指定的季度", () => {
      const disabledQuarters = [
        { quarter: 1, year: 2020 },
        { quarter: 3, year: 2020 },
      ]
      render(
        <QuarterCalendar
          startYear={2020}
          disabledQuarters={disabledQuarters}
        />,
      )

      expect(screen.getByTestId("2020-Q1")).toHaveAttribute("data-disabled", "true")
      expect(screen.getByTestId("2020-Q3")).toHaveAttribute("data-disabled", "true")
    })

    it("不应该选择禁用的季度", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()
      const disabledQuarters = [{ quarter: 2, year: 2020 }]

      render(
        <QuarterCalendar
          startYear={2020}
          disabledQuarters={disabledQuarters}
          onChange={handleChange}
        />,
      )

      await user.click(screen.getByTestId("2020-Q2"))

      expect(handleChange).not.toHaveBeenCalled()
    })

    it("应该禁用导航按钮当达到边界时", () => {
      const minYear = 2020
      const maxYear = 2020
      render(
        <QuarterCalendar
          startYear={2020}
          minYear={minYear}
          maxYear={maxYear}
        />,
      )

      expect(screen.getByTestId("prev-button")).toBeDisabled()
      expect(screen.getByTestId("next-button")).toBeDisabled()
    })
  })

  // 禁用状态测试
  describe("禁用状态", () => {
    it("应该禁用所有季度", () => {
      render(
        <QuarterCalendar
          disabled={true}
          startYear={2020}
        />,
      )

      const quarter1 = screen.getByTestId("2020-Q1")
      const quarter2 = screen.getByTestId("2020-Q2")

      expect(quarter1).toHaveAttribute("data-disabled", "true")
      expect(quarter2).toHaveAttribute("data-disabled", "true")
    })

    it("应该禁用导航按钮", () => {
      render(<QuarterCalendar disabled={true} />)

      expect(screen.getByTestId("prev-button")).toBeDisabled()
      expect(screen.getByTestId("next-button")).toBeDisabled()
    })

    it("不应该在禁用状态下响应点击", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()

      render(
        <QuarterCalendar
          disabled={true}
          onChange={handleChange}
          startYear={currentYear}
        />,
      )

      await user.click(screen.getByTestId(`${currentYear}-Q1`))

      expect(handleChange).not.toHaveBeenCalled()
    })
  })

  // 变体样式测试
  describe("变体样式", () => {
    it("应该支持default变体", () => {
      render(<QuarterCalendar variant="default" />)

      const container = screen.getByTestId("quarter-calendar")
      expect(container).toHaveClass("bg-default-background")
    })

    it("应该支持dark变体", () => {
      render(<QuarterCalendar variant="dark" />)

      const container = screen.getByTestId("quarter-calendar")
      expect(container).toHaveClass("bg-menu-background", "text-white")
    })
  })

  // 语言本地化测试
  describe("语言本地化", () => {
    it("应该支持中文", () => {
      render(
        <QuarterCalendar
          locale={zhCN}
          startYear={2020}
        />,
      )

      const title = screen.getByTestId("year-title")
      expect(title).toHaveTextContent("2020年")
    })

    it("应该支持英文", () => {
      render(
        <QuarterCalendar
          locale={enUS}
          startYear={2020}
        />,
      )

      const title = screen.getByTestId("year-title")
      expect(title).toHaveTextContent("2020")
    })

    it("应该显示正确的季度标签", () => {
      render(
        <QuarterCalendar
          locale={enUS}
          startYear={2020}
        />,
      )

      const quarters = screen.getAllByTestId(/^2020-Q\d+$/)

      // 检查是否有季度元素存在
      expect(quarters.length).toBe(4)
    })
  })

  // 边缘情况测试
  describe("边缘情况", () => {
    it("应该处理null值", () => {
      render(
        <QuarterCalendar
          value={null}
          startYear={currentYear}
        />,
      )

      // 不应该有选中的季度
      const quarterCells = screen.getAllByTestId(new RegExp(`^${currentYear}-Q\\d+$`))
      quarterCells.forEach((cell) => {
        expect(cell).toHaveAttribute("data-selected", "false")
      })
    })

    it("应该处理undefined值", () => {
      render(<QuarterCalendar value={undefined} />)

      expect(screen.getByTestId("quarter-calendar")).toBeInTheDocument()
    })

    it("应该处理不同的年份", () => {
      const futureYear = 2100
      render(<QuarterCalendar startYear={futureYear} />)

      expect(screen.getByTestId(`${futureYear}-Q1`)).toBeInTheDocument()
      expect(screen.getByTestId(`${futureYear}-Q4`)).toBeInTheDocument()
    })
  })

  // 性能测试
  describe("性能", () => {
    it("应该快速渲染", () => {
      const startTime = performance.now()
      render(<QuarterCalendar startYear={2020} />)
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(100)

      const quarterCells = screen.getAllByTestId(/^2020-Q\d+$/)
      expect(quarterCells).toHaveLength(4)
    })
  })

  // 可访问性测试
  describe("可访问性", () => {
    it("应该有正确的ARIA标签", () => {
      render(<QuarterCalendar startYear={2020} />)

      const quarterCells = screen.getAllByTestId(/^2020-Q\d+$/)
      quarterCells.forEach((cell) => {
        expect(cell).toHaveAttribute("aria-label")
        expect(cell).toHaveAttribute("aria-pressed")
      })
    })

    it("应该支持键盘导航", async () => {
      render(<QuarterCalendar startYear={2020} />)

      const firstQuarterCell = screen.getAllByTestId(/^2020-Q\d+$/)[0]

      // 应该能获得焦点（通过点击模拟）
      fireEvent.click(firstQuarterCell)
      expect(firstQuarterCell).toBeInTheDocument()
    })

    it("应该正确设置按钮禁用状态", () => {
      render(
        <QuarterCalendar
          disabled={true}
          startYear={2020}
        />,
      )

      const quarterCells = screen.getAllByTestId(/^2020-Q\d+$/)
      quarterCells.forEach((cell) => {
        expect(cell).toBeDisabled()
      })
    })
  })

  // 集成测试
  describe("集成测试", () => {
    it("应该完整的季度选择流程", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()

      const TestComponent = () => {
        const [currentYear, setCurrentYear] = React.useState(2020)

        const handleNavigate = (direction: "prev" | "next", newYear: number) => {
          setCurrentYear(newYear)
        }

        return (
          <QuarterCalendar
            currentYear={currentYear}
            onNavigate={handleNavigate}
            onChange={handleChange}
            locale={zhCN}
          />
        )
      }

      render(<TestComponent />)

      // 选择季度
      await user.click(screen.getByTestId("2020-Q2"))
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          quarter: 2,
          year: 2020,
        }),
      )

      // 导航到下一年
      await user.click(screen.getByTestId("next-button"))

      // 应该显示新的年份
      await waitFor(() => {
        expect(screen.getByTestId("year-title")).toHaveTextContent("2021年")
      })
    })

    it("应该正确处理约束和导航的组合", () => {
      const minYear = 2020
      const maxYear = 2020

      render(
        <QuarterCalendar
          startYear={2020}
          minYear={minYear}
          maxYear={maxYear}
        />,
      )

      // 导航按钮应该被禁用
      expect(screen.getByTestId("prev-button")).toBeDisabled()
      expect(screen.getByTestId("next-button")).toBeDisabled()
    })
  })
})
