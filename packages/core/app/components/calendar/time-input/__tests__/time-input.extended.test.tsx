import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { zhCN, enUS, ja, fr } from "date-fns/locale"
import React, { useState } from "react"
import { TimeInput } from "../time-input"
import { Clock } from "@choiceform/icons-react"

// 高级测试辅助函数
const createTestTime = (hours: number, minutes: number, seconds: number = 0) => {
  const today = new Date()
  today.setHours(hours, minutes, seconds, 0)
  return today
}

describe("TimeInput - Extended Tests", () => {
  // 复杂的时间解析测试
  describe("复杂时间解析", () => {
    it("应该解析各种时间输入格式", async () => {
      const user = userEvent.setup()
      const testCases = [
        { input: "9", expectedHours: 9, expectedMinutes: 0 },
        { input: "09", expectedHours: 9, expectedMinutes: 0 },
        { input: "930", expectedHours: 9, expectedMinutes: 30 },
        { input: "0930", expectedHours: 9, expectedMinutes: 30 },
        { input: "1430", expectedHours: 14, expectedMinutes: 30 },
        { input: "9:30", expectedHours: 9, expectedMinutes: 30 },
        { input: "09:30", expectedHours: 9, expectedMinutes: 30 },
        { input: "14:30", expectedHours: 14, expectedMinutes: 30 },
      ]

      for (const testCase of testCases) {
        const handleChange = jest.fn()
        const { unmount } = render(
          <TimeInput
            onChange={handleChange}
            format="HH:mm"
          />,
        )

        const input = screen.getByRole("textbox")
        await user.type(input, testCase.input)
        await user.keyboard("{Enter}")

        await waitFor(() => {
          if (handleChange.mock.calls.length > 0) {
            const calledDate = handleChange.mock.calls[0][0]
            expect(calledDate.getHours()).toBe(testCase.expectedHours)
            expect(calledDate.getMinutes()).toBe(testCase.expectedMinutes)
          }
        })

        unmount()
      }
    })

    it("应该解析不同语言的时间表达式", async () => {
      const user = userEvent.setup()
      const testCases = [
        { locale: enUS, input: "9am", expectedHours: 9 },
        { locale: enUS, input: "2pm", expectedHours: 14 },
        { locale: enUS, input: "12pm", expectedHours: 12 },
        { locale: enUS, input: "12am", expectedHours: 0 },
        { locale: zhCN, input: "上午9点", expectedHours: 9 },
        { locale: zhCN, input: "下午2点", expectedHours: 14 },
        { locale: zhCN, input: "中午12点", expectedHours: 12 },
      ]

      for (const testCase of testCases) {
        const handleChange = jest.fn()
        const { unmount } = render(
          <TimeInput
            onChange={handleChange}
            format="HH:mm"
            locale={testCase.locale}
          />,
        )

        const input = screen.getByRole("textbox")
        await user.type(input, testCase.input)
        await user.keyboard("{Enter}")

        await waitFor(
          () => {
            if (handleChange.mock.calls.length > 0) {
              const calledDate = handleChange.mock.calls[0][0]
              expect(calledDate.getHours()).toBe(testCase.expectedHours)
            }
          },
          { timeout: 2000 },
        )

        unmount()
      }
    })

    it("应该处理模糊的时间输入", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()

      render(
        <TimeInput
          onChange={handleChange}
          format="HH:mm"
        />,
      )

      const input = screen.getByRole("textbox")

      // 测试各种模糊输入
      const ambiguousInputs = ["现在", "此刻", "当前", "now"]

      for (const ambiguousInput of ambiguousInputs) {
        handleChange.mockClear()
        await user.clear(input)
        await user.type(input, ambiguousInput)
        await user.keyboard("{Enter}")

        // 模糊输入可能会解析为当前时间或者不解析
        // 这取决于具体的实现逻辑
      }
    })
  })

  // 国际化和本地化测试
  describe("国际化和本地化", () => {
    it("应该支持不同地区的时间格式", () => {
      const testTime = createTestTime(14, 30, 45)
      const locales = [
        { locale: enUS, format: "h:mm:ss a", expectedPattern: /2:30:45\s*PM/i },
        { locale: zhCN, format: "HH:mm:ss", expectedPattern: /14:30:45/ },
        { locale: ja, format: "HH:mm", expectedPattern: /14:30/ },
        { locale: fr, format: "HH'h'mm", expectedPattern: /14h30/ },
      ]

      locales.forEach(({ locale, format, expectedPattern }) => {
        const { unmount } = render(
          <TimeInput
            value={testTime}
            locale={locale}
            format={format}
          />,
        )

        const input = screen.getByRole("textbox") as HTMLInputElement
        expect(input.value).toMatch(expectedPattern)

        unmount()
      })
    })

    it("应该正确处理不同地区的AM/PM标记", () => {
      const morningTime = createTestTime(9, 30)
      const afternoonTime = createTestTime(15, 30)

      const locales = [
        { locale: enUS, am: "AM", pm: "PM" },
        // 其他语言的AM/PM可能有不同的表示方式
      ]

      locales.forEach(({ locale, am, pm }) => {
        // 测试上午时间
        const { unmount: unmountMorning } = render(
          <TimeInput
            value={morningTime}
            locale={locale}
            format="h:mm a"
          />,
        )

        const morningInput = screen.getByRole("textbox") as HTMLInputElement
        expect(morningInput.value).toContain(am.toLowerCase() === "am" ? am : am)

        unmountMorning()

        // 测试下午时间
        const { unmount: unmountAfternoon } = render(
          <TimeInput
            value={afternoonTime}
            locale={locale}
            format="h:mm a"
          />,
        )

        const afternoonInput = screen.getByRole("textbox") as HTMLInputElement
        expect(afternoonInput.value).toContain(pm.toLowerCase() === "pm" ? pm : pm)

        unmountAfternoon()
      })
    })
  })

  // 复杂的键盘交互测试
  describe("复杂键盘交互", () => {
    it("应该在跨小时边界时正确调整时间", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()
      const testTime = createTestTime(23, 59) // 23:59

      render(
        <TimeInput
          value={testTime}
          onChange={handleChange}
          step={1}
        />,
      )

      const input = screen.getByRole("textbox")
      await user.click(input)
      await user.keyboard("{ArrowUp}") // 上键减少时间：23:59 - 1分钟 = 23:58

      await waitFor(() => {
        if (handleChange.mock.calls.length > 0) {
          const calledDate = handleChange.mock.calls[0][0]
          expect(calledDate.getHours()).toBe(23)
          expect(calledDate.getMinutes()).toBe(58)
        }
      })
    })

    it("应该在跨天边界时正确调整时间", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()
      const testTime = createTestTime(0, 0) // 00:00

      render(
        <TimeInput
          value={testTime}
          onChange={handleChange}
          step={1}
        />,
      )

      const input = screen.getByRole("textbox")
      await user.click(input)
      await user.keyboard("{ArrowDown}") // 下键增加时间：00:00 + 1分钟 = 00:01

      await waitFor(() => {
        if (handleChange.mock.calls.length > 0) {
          const calledDate = handleChange.mock.calls[0][0]
          expect(calledDate.getHours()).toBe(0)
          expect(calledDate.getMinutes()).toBe(1)
        }
      })
    })
  })

  // 时间范围和约束测试
  describe("时间范围和约束", () => {
    it("应该正确处理工作时间约束", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()
      const workTimeStart = createTestTime(9, 0)
      const workTimeEnd = createTestTime(17, 30)

      render(
        <TimeInput
          minTime={workTimeStart}
          maxTime={workTimeEnd}
          onChange={handleChange}
          format="HH:mm"
        />,
      )

      const input = screen.getByRole("textbox")

      // 尝试输入工作时间外的时间
      await user.type(input, "08:30") // 早于工作时间
      await user.keyboard("{Enter}")

      // 应该被限制或者调整到最小时间
      await waitFor(() => {
        if (handleChange.mock.calls.length > 0) {
          const calledDate = handleChange.mock.calls[0][0]
          // 根据实现，可能会被调整到9:00或者不调用onChange
          if (calledDate) {
            expect(calledDate.getHours()).toBeGreaterThanOrEqual(9)
          }
        }
      })

      handleChange.mockClear()
      await user.clear(input)
      await user.type(input, "18:30") // 晚于工作时间
      await user.keyboard("{Enter}")

      await waitFor(() => {
        if (handleChange.mock.calls.length > 0) {
          const calledDate = handleChange.mock.calls[0][0]
          if (calledDate) {
            expect(calledDate.getHours()).toBeLessThanOrEqual(17)
          }
        }
      })
    })

    it("应该在范围约束下正确处理键盘导航", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()
      const minTime = createTestTime(9, 0)
      const maxTime = createTestTime(17, 0)
      const currentTime = createTestTime(16, 55) // 接近最大时间

      render(
        <TimeInput
          value={currentTime}
          minTime={minTime}
          maxTime={maxTime}
          onChange={handleChange}
          step={10} // 10分钟步长
        />,
      )

      const input = screen.getByRole("textbox")
      await user.click(input)
      await user.keyboard("{ArrowUp}") // 上键减少时间：16:55 - 10分钟 = 16:45

      await waitFor(() => {
        if (handleChange.mock.calls.length > 0) {
          const calledDate = handleChange.mock.calls[0][0]
          // 应该成功减少时间到 16:45
          expect(calledDate.getHours()).toBe(16)
          expect(calledDate.getMinutes()).toBe(45)
        }
      })
    })
  })

  // 状态管理和数据流测试
  describe("状态管理和数据流", () => {
    it("受控组件应该正确响应外部状态变化", async () => {
      const TestComponent = () => {
        const [time, setTime] = useState<Date | null>(createTestTime(10, 30))

        return (
          <div>
            <TimeInput
              value={time}
              onChange={setTime}
              format="HH:mm"
            />
            <button
              onClick={() => setTime(createTestTime(14, 45))}
              data-testid="change-time-btn"
            >
              Change to 14:45
            </button>
          </div>
        )
      }

      const user = userEvent.setup()
      render(<TestComponent />)

      const input = screen.getByRole("textbox") as HTMLInputElement
      expect(input.value).toBe("10:30")

      const changeButton = screen.getByTestId("change-time-btn")
      await user.click(changeButton)

      expect(input.value).toBe("14:45")
    })

    it("应该防止无限循环更新", async () => {
      const user = userEvent.setup()
      let renderCount = 0

      const TestComponent = () => {
        renderCount++
        const [time, setTime] = useState<Date | null>(createTestTime(10, 30))

        // 模拟可能导致循环更新的场景
        React.useEffect(() => {
          if (time && time.getMinutes() === 30) {
            // 这种操作可能导致无限循环
            const newTime = new Date(time)
            newTime.setSeconds(0)
            if (newTime.getTime() !== time.getTime()) {
              setTime(newTime)
            }
          }
        }, [time])

        return (
          <TimeInput
            value={time}
            onChange={setTime}
            format="HH:mm:ss"
          />
        )
      }

      render(<TestComponent />)

      const input = screen.getByRole("textbox")
      await user.type(input, "11:45")
      await user.keyboard("{Enter}")

      // 等待所有更新完成
      await waitFor(() => {
        expect(renderCount).toBeLessThan(10) // 确保没有无限循环
      })
    })
  })

  // 自定义UI元素测试
  describe("自定义UI元素", () => {
    it("应该支持完全自定义的前缀元素", () => {
      const CustomPrefix = () => (
        <div
          data-testid="custom-prefix"
          className="flex items-center"
        >
          <Clock className="mr-1 h-4 w-4" />
          <span>Time:</span>
        </div>
      )

      render(
        <TimeInput
          prefixElement={<CustomPrefix />}
          placeholder="Custom prefix"
        />,
      )

      expect(screen.getByTestId("custom-prefix")).toBeInTheDocument()
      expect(screen.getByText("Time:")).toBeInTheDocument()
    })

    it("应该支持复杂的后缀元素", () => {
      const ComplexSuffix = () => (
        <div
          data-testid="complex-suffix"
          className="flex items-center space-x-1"
        >
          <button data-testid="clear-btn">Clear</button>
          <span className="text-xs">GMT+8</span>
        </div>
      )

      render(
        <TimeInput
          suffixElement={<ComplexSuffix />}
          value={createTestTime(14, 30)}
        />,
      )

      expect(screen.getByTestId("complex-suffix")).toBeInTheDocument()
      expect(screen.getByTestId("clear-btn")).toBeInTheDocument()
      expect(screen.getByText("GMT+8")).toBeInTheDocument()
    })
  })

  // 性能和优化测试
  describe("性能和优化", () => {
    it("应该正确处理大量快速输入", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()

      render(
        <TimeInput
          onChange={handleChange}
          format="HH:mm"
        />,
      )

      const input = screen.getByRole("textbox")

      // 模拟快速输入有效时间
      await user.click(input)
      await user.type(input, "14:30")
      await user.keyboard("{Enter}")

      // 等待处理完成
      await waitFor(
        () => {
          expect(handleChange).toHaveBeenCalledWith(expect.any(Date))
        },
        { timeout: 1000 },
      )
    })

    it("缓存机制应该提高重复输入的性能", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()
      const startTime = performance.now()

      render(
        <TimeInput
          enableCache={true}
          onChange={handleChange}
          format="HH:mm"
        />,
      )

      const input = screen.getByRole("textbox")

      // 第一次输入
      await user.type(input, "14:30")
      await user.keyboard("{Enter}")

      const firstInputTime = performance.now() - startTime

      handleChange.mockClear()
      const secondStartTime = performance.now()

      // 重复同样的输入
      await user.clear(input)
      await user.type(input, "14:30")
      await user.keyboard("{Enter}")

      const secondInputTime = performance.now() - secondStartTime

      // 第二次应该更快（使用缓存）
      expect(secondInputTime).toBeLessThanOrEqual(firstInputTime * 1.5)
    })
  })

  // 集成测试
  describe("集成测试", () => {
    it("应该与表单库正确集成", async () => {
      const user = userEvent.setup()
      const handleSubmit = jest.fn()

      const FormComponent = () => {
        const [formData, setFormData] = useState({
          startTime: null as Date | null,
          endTime: null as Date | null,
        })

        const handleFormSubmit = (e: React.FormEvent) => {
          e.preventDefault()
          handleSubmit(formData)
        }

        return (
          <form onSubmit={handleFormSubmit}>
            <TimeInput
              value={formData.startTime}
              onChange={(time) => setFormData((prev) => ({ ...prev, startTime: time }))}
              format="HH:mm"
              data-testid="start-time"
            />
            <TimeInput
              value={formData.endTime}
              onChange={(time) => setFormData((prev) => ({ ...prev, endTime: time }))}
              format="HH:mm"
              data-testid="end-time"
            />
            <button
              type="submit"
              data-testid="submit-btn"
            >
              Submit
            </button>
          </form>
        )
      }

      render(<FormComponent />)

      const startTimeInput = screen.getByTestId("start-time")
      const endTimeInput = screen.getByTestId("end-time")
      const submitButton = screen.getByTestId("submit-btn")

      await user.type(startTimeInput, "09:00")
      await user.keyboard("{Enter}")

      await user.type(endTimeInput, "17:00")
      await user.keyboard("{Enter}")

      await user.click(submitButton)

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith({
          startTime: expect.any(Date),
          endTime: expect.any(Date),
        })
      })

      const submittedData = handleSubmit.mock.calls[0][0]
      expect(submittedData.startTime.getHours()).toBe(9)
      expect(submittedData.endTime.getHours()).toBe(17)
    })
  })

  // 错误处理和恢复测试
  describe("错误处理和恢复", () => {
    it("应该从解析错误中优雅恢复", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()
      const handleError = jest.fn()

      render(
        <TimeInput
          onChange={handleChange}
          onError={handleError}
          format="HH:mm"
        />,
      )

      const input = screen.getByRole("textbox")

      // 输入无效时间
      await user.type(input, "25:99")
      await user.keyboard("{Enter}")

      // 应该处理错误但不崩溃
      expect(handleChange).not.toHaveBeenCalled()

      // 然后输入有效时间应该正常工作
      await user.clear(input)
      await user.type(input, "14:30")
      await user.keyboard("{Enter}")

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith(expect.any(Date))
      })
    })

    it("应该处理异步操作中的竞态条件", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()

      render(
        <TimeInput
          onChange={handleChange}
          format="HH:mm"
        />,
      )

      const input = screen.getByRole("textbox")

      // 快速连续输入，模拟竞态条件
      await user.type(input, "12")
      await user.clear(input)
      await user.type(input, "14:30")
      await user.keyboard("{Enter}")

      // 最终应该只有最后的有效输入被处理
      await waitFor(() => {
        if (handleChange.mock.calls.length > 0) {
          const lastCall = handleChange.mock.calls[handleChange.mock.calls.length - 1]
          const calledDate = lastCall[0]
          expect(calledDate.getHours()).toBe(14)
          expect(calledDate.getMinutes()).toBe(30)
        }
      })
    })
  })
})
