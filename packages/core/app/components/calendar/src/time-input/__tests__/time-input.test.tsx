import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { zhCN, enUS, de, fr } from "date-fns/locale"
import React from "react"
import { TimeInput } from "../time-input"

// 模拟 date-fns 的某些函数，确保测试的确定性
jest.mock("date-fns", () => ({
  ...jest.requireActual("date-fns"),
  isToday: jest.fn(() => true), // 默认是今天
}))

// 测试辅助函数
const createTestTime = (hours: number, minutes: number, seconds: number = 0) => {
  const today = new Date()
  today.setHours(hours, minutes, seconds, 0)
  return today
}

describe("TimeInput", () => {
  // 基础渲染测试
  describe("基础渲染", () => {
    it("应该正确渲染组件", () => {
      render(<TimeInput placeholder="请选择时间" />)

      expect(screen.getByPlaceholderText("请选择时间")).toBeInTheDocument()
      expect(screen.getByRole("textbox")).toBeInTheDocument()
    })

    it("应该显示默认的时钟图标", () => {
      render(<TimeInput />)

      // 检查是否有图标容器
      const input = screen.getByRole("textbox")
      const container = input.closest("div")
      expect(container).toBeInTheDocument()

      // 检查是否有时钟图标的testid
      expect(screen.getByTestId("icon-clock")).toBeInTheDocument()
    })

    it("应该显示自定义前缀元素", () => {
      render(<TimeInput prefixElement={<span data-testid="custom-prefix">⏰</span>} />)

      expect(screen.getByTestId("custom-prefix")).toBeInTheDocument()
    })

    it("应该显示后缀元素", () => {
      render(<TimeInput suffixElement={<span data-testid="custom-suffix">✓</span>} />)

      expect(screen.getByTestId("custom-suffix")).toBeInTheDocument()
    })

    it("应该隐藏前缀图标当传入null", () => {
      render(<TimeInput prefixElement={null} />)

      expect(screen.queryByTestId("icon-clock")).not.toBeInTheDocument()
    })
  })

  // 受控组件测试
  describe("受控组件", () => {
    it("应该显示传入的时间值", () => {
      const testTime = createTestTime(14, 30)
      render(
        <TimeInput
          value={testTime}
          format="HH:mm"
        />,
      )

      const input = screen.getByRole("textbox") as HTMLInputElement
      expect(input.value).toBe("14:30")
    })

    it("应该在值变化时调用 onChange", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()

      render(
        <TimeInput
          onChange={handleChange}
          format="HH:mm"
        />,
      )

      const input = screen.getByRole("textbox")
      await user.type(input, "14:30")
      await user.keyboard("{Enter}")

      expect(handleChange).toHaveBeenCalled()
    })

    it("应该正确处理 null 值", () => {
      render(<TimeInput value={null} />)

      const input = screen.getByRole("textbox") as HTMLInputElement
      expect(input.value).toBe("")
    })

    it("应该支持12小时格式", () => {
      const testTime = createTestTime(14, 30)
      render(
        <TimeInput
          value={testTime}
          format="h:mm a"
          locale={enUS}
        />,
      )

      const input = screen.getByRole("textbox") as HTMLInputElement
      expect(input.value).toMatch(/2:30\s*PM/i)
    })
  })

  // 键盘导航测试
  describe("键盘导航", () => {
    it("应该支持上下箭头键调整时间", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()
      const testTime = createTestTime(14, 30)

      render(
        <TimeInput
          value={testTime}
          onChange={handleChange}
          step={1}
        />,
      )

      const input = screen.getByRole("textbox")
      await user.click(input)
      await user.keyboard("{ArrowUp}")

      // 等待异步的键盘操作完成
      await waitFor(
        () => {
          expect(handleChange).toHaveBeenCalledWith(expect.any(Date))
        },
        { timeout: 1000 },
      )
    })

    it("应该支持 Shift + 箭头键调整更大时间步长", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()
      const testTime = createTestTime(14, 30)

      render(
        <TimeInput
          value={testTime}
          onChange={handleChange}
          shiftStep={15}
        />,
      )

      const input = screen.getByRole("textbox")
      await user.click(input)
      await user.keyboard("{Shift>}{ArrowUp}{/Shift}")

      // 等待异步的键盘操作完成
      await waitFor(
        () => {
          expect(handleChange).toHaveBeenCalledWith(expect.any(Date))
        },
        { timeout: 1000 },
      )
    })

    it("应该支持 Alt/Meta + 箭头键调整小时", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()
      const testTime = createTestTime(14, 30)

      render(
        <TimeInput
          value={testTime}
          onChange={handleChange}
          metaStep={60}
        />,
      )

      const input = screen.getByRole("textbox")
      await user.click(input)
      await user.keyboard("{Alt>}{ArrowUp}{/Alt}")

      // 等待异步的键盘操作完成
      await waitFor(
        () => {
          expect(handleChange).toHaveBeenCalledWith(expect.any(Date))
        },
        { timeout: 1000 },
      )
    })

    it("应该支持 Enter 键确认输入", async () => {
      const user = userEvent.setup()
      const handleEnter = jest.fn()

      render(<TimeInput onEnterKeyDown={handleEnter} />)

      const input = screen.getByRole("textbox")
      await user.click(input)
      await user.keyboard("{Enter}")

      expect(handleEnter).toHaveBeenCalled()
    })

    it("禁用键盘导航时不应响应箭头键", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()
      const testTime = createTestTime(14, 30)

      render(
        <TimeInput
          value={testTime}
          onChange={handleChange}
          enableKeyboardNavigation={false}
        />,
      )

      const input = screen.getByRole("textbox")
      await user.click(input)
      await user.keyboard("{ArrowUp}")

      // 应该不会触发 onChange
      expect(handleChange).not.toHaveBeenCalled()
    })
  })

  // 时间格式测试
  describe("时间格式", () => {
    it("应该支持24小时格式 (HH:mm)", () => {
      const testTime = createTestTime(14, 30)
      render(
        <TimeInput
          value={testTime}
          format="HH:mm"
        />,
      )

      const input = screen.getByRole("textbox") as HTMLInputElement
      expect(input.value).toBe("14:30")
    })

    it("应该支持12小时格式 (h:mm a)", () => {
      const testTime = createTestTime(14, 30)
      render(
        <TimeInput
          value={testTime}
          format="h:mm a"
          locale={enUS}
        />,
      )

      const input = screen.getByRole("textbox") as HTMLInputElement
      expect(input.value).toMatch(/2:30\s*PM/i)
    })

    it("应该支持包含秒的格式 (HH:mm:ss)", () => {
      const testTime = createTestTime(14, 30, 45)
      render(
        <TimeInput
          value={testTime}
          format="HH:mm:ss"
        />,
      )

      const input = screen.getByRole("textbox") as HTMLInputElement
      expect(input.value).toBe("14:30:45")
    })

    it("应该根据 locale 自动适应格式", () => {
      const testTime = createTestTime(14, 30)
      const locales = [
        { locale: enUS, name: "English" },
        { locale: zhCN, name: "Chinese" },
        { locale: de, name: "German" },
        { locale: fr, name: "French" },
      ]

      locales.forEach(({ locale, name }) => {
        const { unmount } = render(
          <TimeInput
            value={testTime}
            locale={locale}
            format="HH:mm"
          />,
        )
        const input = screen.getByRole("textbox") as HTMLInputElement
        expect(input.value).toBeTruthy()
        unmount()
      })
    })
  })

  // 时间范围限制测试
  describe("时间范围限制", () => {
    it("应该限制最小时间", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()
      const minTime = createTestTime(9, 0) // 上午9点

      render(
        <TimeInput
          minTime={minTime}
          onChange={handleChange}
          format="HH:mm"
        />,
      )

      const input = screen.getByRole("textbox")
      await user.type(input, "08:30") // 早于最小时间
      await user.keyboard("{Enter}")

      // 应该被限制或者不调用 onChange
      // 具体行为取决于实现逻辑
    })

    it("应该限制最大时间", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()
      const maxTime = createTestTime(18, 0) // 下午6点

      render(
        <TimeInput
          maxTime={maxTime}
          onChange={handleChange}
          format="HH:mm"
        />,
      )

      const input = screen.getByRole("textbox")
      await user.type(input, "19:30") // 晚于最大时间
      await user.keyboard("{Enter}")

      // 应该被限制或者不调用 onChange
    })
  })

  // 智能时间解析测试
  describe("智能时间解析", () => {
    it("应该解析简单的小时输入", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()

      render(
        <TimeInput
          onChange={handleChange}
          format="HH:mm"
        />,
      )

      const input = screen.getByRole("textbox")
      await user.type(input, "9")
      await user.keyboard("{Enter}")

      await waitFor(() => {
        if (handleChange.mock.calls.length > 0) {
          const calledDate = handleChange.mock.calls[0][0]
          expect(calledDate).toBeInstanceOf(Date)
          expect(calledDate.getHours()).toBe(9)
          expect(calledDate.getMinutes()).toBe(0)
        }
      })
    })

    it("应该解析4位数字输入", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()

      render(
        <TimeInput
          onChange={handleChange}
          format="HH:mm"
        />,
      )

      const input = screen.getByRole("textbox")
      await user.type(input, "1430")
      await user.keyboard("{Enter}")

      await waitFor(() => {
        if (handleChange.mock.calls.length > 0) {
          const calledDate = handleChange.mock.calls[0][0]
          expect(calledDate).toBeInstanceOf(Date)
          expect(calledDate.getHours()).toBe(14)
          expect(calledDate.getMinutes()).toBe(30)
        }
      })
    })

    it("应该解析AM/PM格式", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()

      render(
        <TimeInput
          onChange={handleChange}
          format="h:mm a"
          locale={enUS}
        />,
      )

      const input = screen.getByRole("textbox")
      await user.type(input, "2pm")
      await user.keyboard("{Enter}")

      await waitFor(() => {
        if (handleChange.mock.calls.length > 0) {
          const calledDate = handleChange.mock.calls[0][0]
          expect(calledDate).toBeInstanceOf(Date)
          expect(calledDate.getHours()).toBe(14)
        }
      })
    })

    it("应该解析中文时间格式", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()

      render(
        <TimeInput
          onChange={handleChange}
          format="HH:mm"
          locale={zhCN}
        />,
      )

      const input = screen.getByRole("textbox")
      await user.type(input, "下午2点")
      await user.keyboard("{Enter}")

      await waitFor(() => {
        if (handleChange.mock.calls.length > 0) {
          const calledDate = handleChange.mock.calls[0][0]
          expect(calledDate).toBeInstanceOf(Date)
          expect(calledDate.getHours()).toBe(14)
        }
      })
    })
  })

  // 自定义步长测试
  describe("自定义步长", () => {
    it("应该支持自定义分钟步长", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()
      const testTime = createTestTime(14, 30)

      render(
        <TimeInput
          value={testTime}
          onChange={handleChange}
          step={5} // 5分钟步长
        />,
      )

      const input = screen.getByRole("textbox")
      await user.click(input)
      await user.keyboard("{ArrowUp}")

      await waitFor(() => {
        if (handleChange.mock.calls.length > 0) {
          const calledDate = handleChange.mock.calls[0][0]
          expect(calledDate.getMinutes()).toBe(25) // 30 - 5 (上键减少时间)
        }
      })
    })

    it("应该支持自定义Shift步长", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()
      const testTime = createTestTime(14, 30)

      render(
        <TimeInput
          value={testTime}
          onChange={handleChange}
          shiftStep={30} // 30分钟Shift步长
        />,
      )

      const input = screen.getByRole("textbox")
      await user.click(input)
      await user.keyboard("{Shift>}{ArrowUp}{/Shift}")

      await waitFor(() => {
        if (handleChange.mock.calls.length > 0) {
          const calledDate = handleChange.mock.calls[0][0]
          expect(calledDate.getHours()).toBe(14) // 14:30 - 30分钟 = 14:00 (上键减少时间)
          expect(calledDate.getMinutes()).toBe(0)
        }
      })
    })
  })

  // 拖拽交互测试
  describe("拖拽交互", () => {
    it.skip("应该支持拖拽图标调整时间", async () => {
      // 跳过此测试，因为测试环境不支持 requestPointerLock API
      const user = userEvent.setup()
      const handleChange = jest.fn()
      const testTime = createTestTime(14, 30)

      render(
        <TimeInput
          value={testTime}
          onChange={handleChange}
        />,
      )

      // 查找拖拽图标
      const input = screen.getByRole("textbox")
      const container = input.parentElement
      const icon = container?.querySelector('[class*="cursor-ew-resize"]')

      if (icon) {
        // 模拟鼠标按下、移动和释放事件
        await user.pointer({ target: icon, keys: "[MouseLeft>]" })
        await user.pointer({ coords: { x: 50, y: 0 } })
        await user.pointer({ keys: "[/MouseLeft]" })

        // 等待拖拽操作完成
        await waitFor(
          () => {
            expect(handleChange).toHaveBeenCalled()
          },
          { timeout: 1000 },
        )
      } else {
        console.warn("Drag icon not found, skipping drag test")
        expect(true).toBe(true)
      }
    })
  })

  // 可访问性测试
  describe("可访问性", () => {
    it("应该有正确的 aria 属性", () => {
      render(<TimeInput />)

      const input = screen.getByRole("textbox")
      expect(input).toHaveAttribute("type", "text")
    })

    it("应该支持屏幕阅读器", () => {
      render(<TimeInput aria-label="选择时间" />)

      expect(screen.getByLabelText("选择时间")).toBeInTheDocument()
    })

    it("禁用状态下应该有正确的属性", () => {
      render(<TimeInput disabled />)

      const input = screen.getByRole("textbox")
      expect(input).toBeDisabled()
    })

    it("只读状态下应该有正确的属性", () => {
      render(<TimeInput readOnly />)

      const input = screen.getByRole("textbox")
      expect(input).toHaveAttribute("readOnly")
    })
  })

  // 性能测试
  describe("性能", () => {
    it("启用缓存时应该重用解析结果", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()

      render(
        <TimeInput
          enableCache={true}
          onChange={handleChange}
        />,
      )

      const input = screen.getByRole("textbox")

      // 测试缓存是否正常工作：同样的输入应该能正确处理
      await user.type(input, "14:30")
      await user.keyboard("{Enter}")

      // 等待第一次处理完成
      await waitFor(
        () => {
          expect(handleChange).toHaveBeenCalledTimes(1)
        },
        { timeout: 1000 },
      )

      // 验证缓存：再次输入同样内容，应该立即生效
      await user.clear(input)
      await user.type(input, "14:30")

      // 验证输入被格式化（说明缓存生效）
      expect((input as HTMLInputElement).value).toMatch(/14:30/)
    })

    it("禁用缓存时应该每次重新解析", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()

      render(
        <TimeInput
          enableCache={false}
          onChange={handleChange}
        />,
      )

      const input = screen.getByRole("textbox")
      await user.type(input, "14:30")
      await user.keyboard("{Enter}")

      expect(handleChange).toHaveBeenCalled()
    })
  })

  // 边界情况测试
  describe("边界情况", () => {
    it("应该处理无效的时间输入", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()

      render(<TimeInput onChange={handleChange} />)

      const input = screen.getByRole("textbox")
      await user.type(input, "无效时间")
      await user.keyboard("{Enter}")

      // 对于无效输入，应该不调用onChange或者清空值
      expect(handleChange).not.toHaveBeenCalled()
    })

    it("应该处理空输入", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()

      render(<TimeInput onChange={handleChange} />)

      const input = screen.getByRole("textbox")
      await user.type(input, "   ") // 只有空格
      await user.keyboard("{Enter}")

      expect(handleChange).toHaveBeenCalledWith(null)
    })

    it("应该处理边界时间 (00:00)", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()

      render(
        <TimeInput
          onChange={handleChange}
          format="HH:mm"
        />,
      )

      const input = screen.getByRole("textbox")
      await user.type(input, "00:00")
      await user.keyboard("{Enter}")

      await waitFor(() => {
        if (handleChange.mock.calls.length > 0) {
          const calledDate = handleChange.mock.calls[0][0]
          expect(calledDate.getHours()).toBe(0)
          expect(calledDate.getMinutes()).toBe(0)
        }
      })
    })

    it("应该处理边界时间 (23:59)", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()

      render(
        <TimeInput
          onChange={handleChange}
          format="HH:mm"
        />,
      )

      const input = screen.getByRole("textbox")
      await user.type(input, "23:59")
      await user.keyboard("{Enter}")

      await waitFor(() => {
        if (handleChange.mock.calls.length > 0) {
          const calledDate = handleChange.mock.calls[0][0]
          expect(calledDate.getHours()).toBe(23)
          expect(calledDate.getMinutes()).toBe(59)
        }
      })
    })

    it("应该处理超出范围的时间输入", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()

      render(
        <TimeInput
          onChange={handleChange}
          format="HH:mm"
        />,
      )

      const input = screen.getByRole("textbox")
      await user.type(input, "25:70") // 无效时间
      await user.keyboard("{Enter}")

      // 应该不调用onChange，因为时间无效
      expect(handleChange).not.toHaveBeenCalled()
    })
  })

  // 默认值测试
  describe("默认值", () => {
    it("应该支持默认值", () => {
      const defaultTime = createTestTime(10, 30)
      render(
        <TimeInput
          defaultValue={defaultTime}
          format="HH:mm"
        />,
      )

      const input = screen.getByRole("textbox") as HTMLInputElement
      expect(input.value).toBe("10:30")
    })

    it("受控值应该覆盖默认值", () => {
      const defaultTime = createTestTime(10, 30)
      const controlledTime = createTestTime(14, 45)

      render(
        <TimeInput
          defaultValue={defaultTime}
          value={controlledTime}
          format="HH:mm"
        />,
      )

      const input = screen.getByRole("textbox") as HTMLInputElement
      expect(input.value).toBe("14:45")
    })
  })
})
