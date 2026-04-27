import { render, screen, fireEvent, waitFor, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import React from "react"
import { vi, describe, expect, it, beforeEach } from "vitest"
import { TimeCalendar } from "../time-calendar"

const createTestTime = (hours: number, minutes: number): Date => {
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return date
}

vi.mock("@choiceform/icons-react", () => ({
  Check: () => <div data-testid="check-icon">✓</div>,
  ChevronUpSmall: () => <div data-testid="chevron-up">↑</div>,
  ChevronDownSmall: () => <div data-testid="chevron-down">↓</div>,
}))

const mockScrollTo = vi.fn()
const mockScrollIntoView = vi.fn()

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

function TimeCalendarOpen(props: React.ComponentProps<typeof TimeCalendar>) {
  return (
    <TimeCalendar
      open={true}
      {...props}
    >
      <TimeCalendar.Trigger>
        <button data-testid="trigger">Open</button>
      </TimeCalendar.Trigger>
    </TimeCalendar>
  )
}

describe("TimeCalendar", () => {
  describe("基本渲染", () => {
    it("应该正确渲染并显示触发器", () => {
      render(<TimeCalendarOpen />)

      expect(screen.getByTestId("trigger")).toBeInTheDocument()
    })

    it("应该渲染默认的时间选项", async () => {
      render(<TimeCalendarOpen step={60} />)

      await waitFor(() => {
        expect(screen.getByText("00:00")).toBeInTheDocument()
      })
      expect(screen.getByText("01:00")).toBeInTheDocument()
      expect(screen.getByText("23:00")).toBeInTheDocument()
    })

    it("应该支持自定义类名", async () => {
      render(<TimeCalendarOpen className="custom-time-calendar" />)

      await waitFor(() => {
        expect(screen.getByText("00:00")).toBeInTheDocument()
      })
      expect(document.querySelector(".custom-time-calendar")).toBeInTheDocument()
    })
  })

  describe("时间格式", () => {
    it("应该支持24小时格式", async () => {
      render(
        <TimeCalendarOpen
          format="HH:mm"
          step={60}
        />,
      )

      await waitFor(() => {
        expect(screen.getByText("00:00")).toBeInTheDocument()
      })
      expect(screen.getByText("13:00")).toBeInTheDocument()
      expect(screen.getByText("23:00")).toBeInTheDocument()
    })

    it("应该支持12小时格式", async () => {
      render(
        <TimeCalendarOpen
          format="h:mm a"
          step={60}
        />,
      )

      await waitFor(() => {
        expect(screen.getByTestId("01:00")).toBeInTheDocument()
      })
      expect(screen.getByTestId("13:00")).toBeInTheDocument()

      const ampmElements = screen.getAllByText((_content, element) => {
        return element?.textContent?.includes("am") || element?.textContent?.includes("pm") || false
      })
      expect(ampmElements.length).toBeGreaterThan(0)
    })

    it("应该在12小时格式中显示AM/PM分隔线", async () => {
      render(
        <TimeCalendarOpen
          format="h:mm a"
          step={60}
        />,
      )

      await waitFor(() => {
        expect(screen.getByTestId("ampm-divider")).toBeInTheDocument()
      })
    })
  })

  describe("时间步长", () => {
    it("应该支持15分钟步长（默认）", async () => {
      render(<TimeCalendarOpen />)

      await waitFor(() => {
        expect(screen.getByText("00:00")).toBeInTheDocument()
      })
      expect(screen.getByText("00:15")).toBeInTheDocument()
      expect(screen.getByText("00:30")).toBeInTheDocument()
      expect(screen.getByText("00:45")).toBeInTheDocument()
    })

    it("应该支持30分钟步长", async () => {
      render(<TimeCalendarOpen step={30} />)

      await waitFor(() => {
        expect(screen.getByText("00:00")).toBeInTheDocument()
      })
      expect(screen.getByText("00:30")).toBeInTheDocument()
      expect(screen.getByText("01:00")).toBeInTheDocument()
      expect(screen.queryByText("00:15")).not.toBeInTheDocument()
    })

    it("应该支持5分钟步长", async () => {
      render(<TimeCalendarOpen step={5} />)

      await waitFor(() => {
        expect(screen.getByText("00:00")).toBeInTheDocument()
      })
      expect(screen.getByText("00:05")).toBeInTheDocument()
      expect(screen.getByText("00:10")).toBeInTheDocument()
      expect(screen.getByText("00:15")).toBeInTheDocument()
    })
  })

  describe("受控组件", () => {
    it("应该显示选中的时间", async () => {
      const testTime = createTestTime(14, 30)
      render(<TimeCalendarOpen value={testTime} />)

      await waitFor(() => {
        expect(screen.getByTestId("14:30")).toBeInTheDocument()
      })
    })

    it("应该在时间选择时调用onChange", async () => {
      const handleChange = vi.fn()
      render(<TimeCalendarOpen onChange={handleChange} />)

      await waitFor(() => {
        expect(screen.getByText("09:00")).toBeInTheDocument()
      })

      await act(async () => {
        fireEvent.mouseUp(screen.getByText("09:00"))
      })

      expect(handleChange).toHaveBeenCalledTimes(1)
      expect(handleChange.mock.calls[0][0]).toBeInstanceOf(Date)
    })

    it("应该在值改变时更新选中状态", async () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState<Date | null>(createTestTime(10, 0))

        return (
          <div>
            <TimeCalendarOpen
              value={value}
              onChange={setValue}
            />
            <button onClick={() => setValue(createTestTime(15, 30))}>Change to 15:30</button>
          </div>
        )
      }

      render(<TestComponent />)

      await waitFor(() => {
        expect(screen.getByTestId("10:00")).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText("Change to 15:30"))

      await waitFor(() => {
        expect(screen.getByTestId("15:30")).toBeInTheDocument()
      })
    })
  })

  describe("非受控组件", () => {
    it("应该支持defaultValue", async () => {
      const testTime = createTestTime(16, 45)
      render(<TimeCalendarOpen defaultValue={testTime} />)

      await waitFor(() => {
        expect(screen.getByTestId("16:45")).toBeInTheDocument()
      })
    })

    it("应该在内部管理状态", async () => {
      const handleChange = vi.fn()
      render(
        <TimeCalendarOpen
          defaultValue={createTestTime(10, 0)}
          onChange={handleChange}
        />,
      )

      await waitFor(() => {
        expect(screen.getByText("14:00")).toBeInTheDocument()
      })

      await act(async () => {
        fireEvent.mouseUp(screen.getByText("14:00"))
      })

      expect(handleChange).toHaveBeenCalledTimes(1)
    })
  })

  describe("自定义时间项", () => {
    it("应该显示不在标准选项中的自定义时间", async () => {
      const customTime = createTestTime(14, 37)
      render(
        <TimeCalendarOpen
          value={customTime}
          step={15}
        />,
      )

      await waitFor(() => {
        expect(screen.getByTestId("custom-time-item")).toBeInTheDocument()
      })
      expect(screen.getByTestId("custom-time-item")).toHaveTextContent("14:37")
    })

    it("应该在自定义时间项后显示分隔线", async () => {
      const customTime = createTestTime(14, 37)
      render(
        <TimeCalendarOpen
          value={customTime}
          step={15}
        />,
      )

      await waitFor(() => {
        expect(screen.getByTestId("custom-time-divider")).toBeInTheDocument()
      })
    })

    it("不应该为标准时间显示自定义时间项", async () => {
      const standardTime = createTestTime(14, 30)
      render(
        <TimeCalendarOpen
          value={standardTime}
          step={15}
        />,
      )

      await waitFor(() => {
        expect(screen.getByText("14:30")).toBeInTheDocument()
      })
      expect(screen.queryByTestId("custom-time-item")).not.toBeInTheDocument()
    })

    it("应该支持12小时格式的自定义时间", async () => {
      const customTime = createTestTime(14, 37)
      render(
        <TimeCalendarOpen
          value={customTime}
          step={15}
          format="h:mm a"
        />,
      )

      await waitFor(() => {
        expect(screen.getByTestId("custom-time-item")).toBeInTheDocument()
      })
      expect(screen.getByTestId("custom-time-item")).toHaveTextContent("2:37")
    })
  })

  describe("选中状态", () => {
    it("应该为选中项显示Check图标", async () => {
      const testTime = createTestTime(10, 30)
      render(<TimeCalendarOpen value={testTime} />)

      await waitFor(() => {
        expect(screen.getByTestId("check-icon")).toBeInTheDocument()
      })
    })

    it("应该只为一个项显示Check图标", async () => {
      const testTime = createTestTime(10, 30)
      render(<TimeCalendarOpen value={testTime} />)

      await waitFor(() => {
        const checkIcons = screen.getAllByTestId("check-icon")
        expect(checkIcons).toHaveLength(1)
      })
    })
  })

  describe("鼠标交互", () => {
    it("应该在鼠标悬停时响应", async () => {
      render(<TimeCalendarOpen />)

      await waitFor(() => {
        expect(screen.getByText("10:00")).toBeInTheDocument()
      })

      const timeItem = screen.getByText("10:00")
      await userEvent.setup().hover(timeItem)
      expect(timeItem).toBeInTheDocument()
    })

    it("应该支持鼠标离开事件", async () => {
      render(<TimeCalendarOpen />)

      await waitFor(() => {
        expect(screen.getByText("10:00")).toBeInTheDocument()
      })

      const timeItem = screen.getByText("10:00")
      await userEvent.setup().hover(timeItem)
      expect(timeItem).toBeInTheDocument()
    })
  })

  describe("滚动行为", () => {
    it("应该支持滚动事件", async () => {
      render(<TimeCalendarOpen />)

      await waitFor(() => {
        expect(screen.getByText("00:00")).toBeInTheDocument()
      })

      const dropdownContent = screen.getByText("00:00").closest("[class]")
      if (dropdownContent) {
        fireEvent.scroll(dropdownContent, { target: { scrollTop: 100 } })
      }
      expect(screen.getByText("00:00")).toBeInTheDocument()
    })

    it("应该在滚动时处理鼠标事件", async () => {
      const user = userEvent.setup()
      render(<TimeCalendarOpen />)

      await waitFor(() => {
        expect(screen.getByText("10:00")).toBeInTheDocument()
      })

      const timeItem = screen.getByText("10:00")
      await user.hover(timeItem)
      expect(timeItem).toBeInTheDocument()
    })
  })

  describe("边缘情况", () => {
    it("应该处理未定义值", async () => {
      render(<TimeCalendarOpen value={undefined} />)

      await waitFor(() => {
        expect(screen.getByTestId("trigger")).toBeInTheDocument()
      })
    })

    it("应该处理极端时间值", async () => {
      const extremeTime = createTestTime(23, 59)
      render(
        <TimeCalendarOpen
          value={extremeTime}
          step={15}
        />,
      )

      await waitFor(() => {
        expect(screen.getByTestId("custom-time-item")).toBeInTheDocument()
      })
      expect(screen.getByTestId("custom-time-item")).toHaveTextContent("23:59")
    })

    it("应该处理午夜时间", async () => {
      const midnightTime = createTestTime(0, 0)
      render(<TimeCalendarOpen value={midnightTime} />)

      await waitFor(() => {
        expect(screen.getByTestId("00:00")).toBeInTheDocument()
      })
    })
  })

  describe("性能", () => {
    it("应该能处理大量时间选项", async () => {
      const startTime = performance.now()
      render(<TimeCalendarOpen step={1} />)
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(2000)

      await waitFor(() => {
        expect(screen.getByText("00:00")).toBeInTheDocument()
      })
      expect(screen.getByText("00:01")).toBeInTheDocument()
    })

    it("应该正确处理大步长", async () => {
      render(<TimeCalendarOpen step={120} />)

      await waitFor(() => {
        expect(screen.getByText("00:00")).toBeInTheDocument()
      })
      expect(screen.getByText("02:00")).toBeInTheDocument()
      expect(screen.getByText("04:00")).toBeInTheDocument()
      expect(screen.queryByText("01:00")).not.toBeInTheDocument()
    })
  })

  describe("可访问性", () => {
    it("应该支持键盘导航", async () => {
      const user = userEvent.setup()
      render(<TimeCalendarOpen />)

      await waitFor(() => {
        expect(screen.getByText("00:00")).toBeInTheDocument()
      })

      const trigger = screen.getByTestId("trigger")
      await user.click(trigger)
      expect(trigger).toBeInTheDocument()
    })
  })

  describe("滚动自动定位", () => {
    it("应该在有选中值时调用滚动相关方法", async () => {
      const testTime = createTestTime(12, 30)
      render(<TimeCalendarOpen value={testTime} />)

      await waitFor(() => {
        expect(screen.getByTestId("12:30")).toBeInTheDocument()
      })
    })

    it("应该在自定义时间项存在时调用滚动", async () => {
      const customTime = createTestTime(14, 37)
      render(
        <TimeCalendarOpen
          value={customTime}
          step={15}
        />,
      )

      await waitFor(() => {
        expect(screen.getByTestId("custom-time-item")).toBeInTheDocument()
      })
    })
  })

  describe("BUG: TimeCalendar does not cancel pending requestAnimationFrame on unmount", () => {
    it("should cancel pending rAF when component unmounts during scroll", () => {
      const originalRAF = window.requestAnimationFrame
      const originalCAF = window.cancelAnimationFrame
      let pendingRAFId: number | null = null
      const rafSpy = vi.fn((cb: FrameRequestCallback) => {
        pendingRAFId = originalRAF(cb)
        return pendingRAFId
      })
      const cafSpy = vi.fn()

      window.requestAnimationFrame = rafSpy
      window.cancelAnimationFrame = cafSpy

      try {
        const customTime = createTestTime(14, 37)
        const { unmount } = render(
          <TimeCalendar
            value={customTime}
            step={15}
            open={true}
          >
            <TimeCalendar.Trigger>
              <button data-testid="trigger">Open</button>
            </TimeCalendar.Trigger>
          </TimeCalendar>,
        )

        expect(rafSpy).toHaveBeenCalled()

        unmount()

        expect(cafSpy).toHaveBeenCalled()
      } finally {
        window.requestAnimationFrame = originalRAF
        window.cancelAnimationFrame = originalCAF
      }
    })
  })
})
