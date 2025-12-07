import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import React from "react"
import { TimeCalendar } from "../time-calendar"

// 测试工具函数
const createTestTime = (hours: number, minutes: number): Date => {
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return date
}

// Mock dependencies that might cause issues
jest.mock("@choiceform/icons-react", () => ({
  Check: () => <div data-testid="check-icon">✓</div>,
}))

// Mock scrollTo and scrollIntoView for JSDOM
const mockScrollTo = jest.fn()
const mockScrollIntoView = jest.fn()

Object.defineProperty(HTMLElement.prototype, "scrollTo", {
  writable: true,
  value: mockScrollTo,
})

Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
  writable: true,
  value: mockScrollIntoView,
})

beforeEach(() => {
  mockScrollTo.mockClear()
  mockScrollIntoView.mockClear()
})

describe("TimeCalendar", () => {
  // 基本渲染测试
  describe("基本渲染", () => {
    it("应该正确渲染", () => {
      render(<TimeCalendar />)

      // 应该显示时间选项列表
      expect(screen.getByTestId("time-calendar-menu")).toBeInTheDocument()
    })

    it("应该渲染默认的时间选项", () => {
      render(<TimeCalendar step={60} />)

      // 应该显示每小时的选项
      expect(screen.getByText("00:00")).toBeInTheDocument()
      expect(screen.getByText("01:00")).toBeInTheDocument()
      expect(screen.getAllByText(/12:00/)).toHaveLength(1)
      expect(screen.getByText("23:00")).toBeInTheDocument()
    })

    it("应该支持自定义类名", () => {
      render(<TimeCalendar className="custom-time-calendar" />)

      const container = screen.getByTestId("time-calendar-menu")
      expect(container).toHaveClass("custom-time-calendar")
    })
  })

  // 时间格式测试
  describe("时间格式", () => {
    it("应该支持24小时格式", () => {
      render(
        <TimeCalendar
          format="HH:mm"
          step={60}
        />,
      )

      expect(screen.getByText("00:00")).toBeInTheDocument()
      expect(screen.getByText("13:00")).toBeInTheDocument()
      expect(screen.getByText("23:00")).toBeInTheDocument()
    })

    it("应该支持12小时格式", () => {
      render(
        <TimeCalendar
          format="h:mm a"
          step={60}
        />,
      )

      // 应该有12:00的项（可能有AM和PM两个）
      const twelveOClockItems = screen.getAllByText(/12:00/)
      expect(twelveOClockItems.length).toBeGreaterThan(0)

      // 使用 data-testid 查找特定的时间项，因为 1:00 会出现两次（AM和PM）
      expect(screen.getByTestId("01:00")).toBeInTheDocument() // 1:00 AM
      expect(screen.getByTestId("13:00")).toBeInTheDocument() // 1:00 PM

      // 应该有AM/PM标识
      const ampmElements = screen.getAllByText(/AM|PM/)
      expect(ampmElements.length).toBeGreaterThan(0)
    })

    it("应该在12小时格式中显示AM/PM分隔线", () => {
      render(
        <TimeCalendar
          format="h:mm a"
          step={60}
        />,
      )

      // 使用 data-testid 查找AM/PM分隔线
      expect(screen.getByTestId("ampm-divider")).toBeInTheDocument()
    })
  })

  // 时间步长测试
  describe("时间步长", () => {
    it("应该支持15分钟步长（默认）", () => {
      render(<TimeCalendar />)

      expect(screen.getByText("00:00")).toBeInTheDocument()
      expect(screen.getByText("00:15")).toBeInTheDocument()
      expect(screen.getByText("00:30")).toBeInTheDocument()
      expect(screen.getByText("00:45")).toBeInTheDocument()
    })

    it("应该支持30分钟步长", () => {
      render(<TimeCalendar step={30} />)

      expect(screen.getByText("00:00")).toBeInTheDocument()
      expect(screen.getByText("00:30")).toBeInTheDocument()
      expect(screen.getByText("01:00")).toBeInTheDocument()

      // 15分钟不应该存在
      expect(screen.queryByText("00:15")).not.toBeInTheDocument()
    })

    it("应该支持5分钟步长", () => {
      render(<TimeCalendar step={5} />)

      expect(screen.getByText("00:00")).toBeInTheDocument()
      expect(screen.getByText("00:05")).toBeInTheDocument()
      expect(screen.getByText("00:10")).toBeInTheDocument()
      expect(screen.getByText("00:15")).toBeInTheDocument()
    })
  })

  // 受控组件测试
  describe("受控组件", () => {
    it("应该显示选中的时间", () => {
      const testTime = createTestTime(14, 30)
      render(<TimeCalendar value={testTime} />)

      // 使用 data-testid 查找选中的项
      const selectedItem = screen.getByTestId("14:30")
      expect(selectedItem).toHaveAttribute("aria-selected", "true")
    })

    it("应该在时间选择时调用onChange", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()

      render(<TimeCalendar onChange={handleChange} />)

      // 点击一个时间选项
      await user.click(screen.getByText("09:00"))

      expect(handleChange).toHaveBeenCalledTimes(1)
      expect(handleChange.mock.calls[0][0]).toBeInstanceOf(Date)
    })

    it("应该在值改变时更新选中状态", async () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState<Date | null>(createTestTime(10, 0))

        return (
          <div>
            <TimeCalendar
              value={value}
              onChange={setValue}
            />
            <button onClick={() => setValue(createTestTime(15, 30))}>Change to 15:30</button>
          </div>
        )
      }

      render(<TestComponent />)

      // 初始状态
      expect(screen.getByTestId("10:00")).toHaveAttribute("aria-selected", "true")

      // 点击按钮改变值
      fireEvent.click(screen.getByText("Change to 15:30"))

      // 等待状态更新
      await waitFor(() => {
        expect(screen.getByTestId("15:30")).toHaveAttribute("aria-selected", "true")
      })
    })
  })

  // 非受控组件测试
  describe("非受控组件", () => {
    it("应该支持defaultValue", () => {
      const testTime = createTestTime(16, 45)
      render(<TimeCalendar defaultValue={testTime} />)

      // 使用 data-testid 查找选中的项
      const selectedItem = screen.getByTestId("16:45")
      expect(selectedItem).toHaveAttribute("aria-selected", "true")
    })

    it("应该在内部管理状态", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()

      render(
        <TimeCalendar
          defaultValue={createTestTime(10, 0)}
          onChange={handleChange}
        />,
      )

      // 点击不同的时间
      await user.click(screen.getByText("14:00"))

      expect(handleChange).toHaveBeenCalledTimes(1)
      // 使用 data-testid 检查选中状态
      expect(screen.getByTestId("14:00")).toHaveAttribute("aria-selected", "true")
    })
  })

  // 自定义时间项测试
  describe("自定义时间项", () => {
    it("应该显示不在标准选项中的自定义时间", () => {
      // 14:37 不在15分钟步长中
      const customTime = createTestTime(14, 37)
      render(
        <TimeCalendar
          value={customTime}
          step={15}
        />,
      )

      // 使用 data-testid 查找自定义时间项
      const customItem = screen.getByTestId("custom-time-item")
      expect(customItem).toBeInTheDocument()
      expect(customItem).toHaveAttribute("aria-selected", "true")
      expect(customItem).toHaveTextContent("14:37")
    })

    it("应该在自定义时间项后显示分隔线", () => {
      const customTime = createTestTime(14, 37)
      render(
        <TimeCalendar
          value={customTime}
          step={15}
        />,
      )

      // 使用 data-testid 查找自定义时间分隔线
      expect(screen.getByTestId("custom-time-divider")).toBeInTheDocument()
    })

    it("不应该为标准时间显示自定义时间项", () => {
      const standardTime = createTestTime(14, 30) // 在15分钟步长中
      render(
        <TimeCalendar
          value={standardTime}
          step={15}
        />,
      )

      // 不应该有自定义时间项
      expect(screen.queryByTestId("custom-time-item")).not.toBeInTheDocument()

      // 应该只有一个14:30项
      const timeItems = screen.getAllByText("14:30")
      expect(timeItems).toHaveLength(1)
    })

    it("应该支持12小时格式的自定义时间", () => {
      const customTime = createTestTime(14, 37)
      render(
        <TimeCalendar
          value={customTime}
          step={15}
          format="h:mm a"
        />,
      )

      // 应该显示12小时格式的自定义时间
      const customItem = screen.getByTestId("custom-time-item")
      expect(customItem).toHaveTextContent("2:37")
    })
  })

  // 选中状态和图标测试
  describe("选中状态", () => {
    it("应该为选中项显示Check图标", () => {
      const testTime = createTestTime(10, 30)
      render(<TimeCalendar value={testTime} />)

      // 应该显示check图标
      expect(screen.getByTestId("check-icon")).toBeInTheDocument()
    })

    it("应该只为一个项显示Check图标", () => {
      const testTime = createTestTime(10, 30)
      render(<TimeCalendar value={testTime} />)

      // 应该只有一个check图标
      const checkIcons = screen.getAllByTestId("check-icon")
      expect(checkIcons).toHaveLength(1)
    })

    it("未选中时不应该显示Check图标", () => {
      render(<TimeCalendar />)

      // 没有选中值时不应该有check图标
      expect(screen.queryByTestId("check-icon")).not.toBeInTheDocument()
    })
  })

  // 鼠标交互测试
  describe("鼠标交互", () => {
    it("应该在鼠标悬停时响应", async () => {
      const user = userEvent.setup()
      render(<TimeCalendar />)

      const timeItem = screen.getByText("10:00")
      await user.hover(timeItem)

      // 这个测试主要确保鼠标事件不会出错
      expect(timeItem).toBeInTheDocument()
    })

    it("应该支持鼠标离开事件", async () => {
      const user = userEvent.setup()
      render(<TimeCalendar />)

      const timeItem = screen.getByText("10:00")
      const container = screen.getByTestId("time-calendar-menu")

      await user.hover(timeItem)
      await user.unhover(container)

      // 确保事件处理不会出错
      expect(timeItem).toBeInTheDocument()
    })
  })

  // 滚动行为测试
  describe("滚动行为", () => {
    it("应该支持滚动事件", () => {
      render(<TimeCalendar />)

      const container = screen.getByTestId("time-calendar-menu")

      // 模拟滚动事件
      fireEvent.scroll(container, { target: { scrollTop: 100 } })

      // 确保滚动事件不会出错
      expect(container).toBeInTheDocument()
    })

    it("应该在滚动时处理鼠标事件", async () => {
      const user = userEvent.setup()
      render(<TimeCalendar />)

      const container = screen.getByTestId("time-calendar-menu")

      // 模拟滚动
      fireEvent.scroll(container, { target: { scrollTop: 100 } })

      // 应该能正常处理后续的鼠标事件
      const timeItem = screen.getByText("10:00")
      await user.hover(timeItem)

      // 这个测试主要是确保滚动不会破坏事件处理
      expect(timeItem).toBeInTheDocument()
    })
  })

  // 边缘情况测试
  describe("边缘情况", () => {
    it("应该处理null值", () => {
      render(<TimeCalendar value={null} />)

      // 不应该有选中项
      expect(screen.queryByTestId("check-icon")).not.toBeInTheDocument()
    })

    it("应该处理未定义值", () => {
      render(<TimeCalendar value={undefined} />)

      // 不应该崩溃或出错
      expect(screen.getByTestId("time-calendar-menu")).toBeInTheDocument()
    })

    it("应该处理极端时间值", () => {
      const extremeTime = createTestTime(23, 59)
      render(
        <TimeCalendar
          value={extremeTime}
          step={15}
        />,
      )

      // 23:59 不在15分钟步长中，应该显示为自定义时间
      const customItem = screen.getByTestId("custom-time-item")
      expect(customItem).toHaveTextContent("23:59")
    })

    it("应该处理午夜时间", () => {
      const midnightTime = createTestTime(0, 0)
      render(<TimeCalendar value={midnightTime} />)

      // 使用 data-testid 检查选中状态
      const selectedItem = screen.getByTestId("00:00")
      expect(selectedItem).toHaveAttribute("aria-selected", "true")
    })
  })

  // 性能测试
  describe("性能", () => {
    it("应该能处理大量时间选项", () => {
      // 1分钟步长会生成1440个选项
      const startTime = performance.now()
      render(<TimeCalendar step={1} />)
      const endTime = performance.now()

      // 渲染时间应该在合理范围内（小于2000ms，考虑到大量选项）
      expect(endTime - startTime).toBeLessThan(2000)

      // 应该显示正确的选项数量
      expect(screen.getByText("00:00")).toBeInTheDocument()
      expect(screen.getByText("00:01")).toBeInTheDocument()
    })

    it("应该正确处理大步长", () => {
      render(<TimeCalendar step={120} />)

      // 2小时步长
      expect(screen.getByText("00:00")).toBeInTheDocument()
      expect(screen.getByText("02:00")).toBeInTheDocument()
      expect(screen.getByText("04:00")).toBeInTheDocument()

      // 不应该有1小时的选项
      expect(screen.queryByText("01:00")).not.toBeInTheDocument()
    })
  })

  // 可访问性测试
  describe("可访问性", () => {
    it("应该有正确的ARIA属性", () => {
      render(<TimeCalendar />)

      const menu = screen.getByTestId("time-calendar-menu")
      expect(menu).toHaveAttribute("role", "menu")

      // 应该有menu items
      const menuItems = screen.getAllByRole("menuitem")
      expect(menuItems.length).toBeGreaterThan(0)
    })

    it("应该支持键盘导航", async () => {
      const user = userEvent.setup()
      render(<TimeCalendar />)

      const firstItem = screen.getAllByRole("menuitem")[0]
      firstItem.focus()

      // 应该能获得焦点
      expect(firstItem).toHaveFocus()

      // 测试键盘事件
      await user.keyboard("{Enter}")

      // 这个测试确保键盘事件不会导致错误
      expect(firstItem).toBeInTheDocument()
    })
  })

  // 滚动自动定位测试
  describe("滚动自动定位", () => {
    it("应该在有选中值时调用滚动相关方法", () => {
      const testTime = createTestTime(12, 30)
      render(<TimeCalendar value={testTime} />)

      // 应该调用滚动相关的方法
      expect(mockScrollIntoView).toHaveBeenCalled()
    })

    it("应该在自定义时间项存在时调用滚动", () => {
      const customTime = createTestTime(14, 37)
      render(
        <TimeCalendar
          value={customTime}
          step={15}
        />,
      )

      // 应该调用滚动方法
      expect(mockScrollTo).toHaveBeenCalled()
    })
  })
})
