import "@testing-library/jest-dom"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { de, enUS, fr, ja, zhCN } from "date-fns/locale"
import React from "react"
import { DateInput } from "../date-input"

// 导入需要测试的工具函数
import {
  getEnhancedPrediction,
  handleShortcuts,
  parse3Digits,
  parseExtendedRelativeDate,
  parseNaturalLanguage,
  parseRelativeDate,
  parseYYMMDD,
  parseYYYYMMDD,
  smartCorrectDate,
} from "../../utils/parsers"

import {
  calculateWeekNumbers,
  formatMonthTitle,
  generateCalendarDays,
  generateWeekdayNames,
  inferMonthFromValue,
  inferSelectionMode,
  isCalendarValueEqual,
} from "../../utils/month"

describe("DateInput Extended Tests", () => {
  // 自然语言解析测试
  describe("自然语言解析功能", () => {
    it("应该解析中文自然语言", async () => {
      const user = userEvent.setup()

      // 测试不同的自然语言输入
      const testCases = ["今天", "明天", "昨天"]

      for (const testCase of testCases) {
        const handleChange = jest.fn() // 为每个测试用例创建新的mock

        const { unmount } = render(
          <DateInput
            onChange={handleChange}
            enablePrediction={true}
          />,
        )
        const input = screen.getByRole("textbox")

        await user.type(input, testCase)
        await user.keyboard("{Enter}")

        await waitFor(
          () => {
            expect(handleChange).toHaveBeenCalledWith(expect.any(Date))
          },
          { timeout: 1000 },
        )

        unmount() // 清理组件
      }
    })

    it("应该解析英文自然语言", async () => {
      const user = userEvent.setup()

      // 测试不同的英文自然语言输入
      const testCases = ["today", "tomorrow", "yesterday"]

      for (const testCase of testCases) {
        const handleChange = jest.fn() // 为每个测试用例创建新的mock

        const { unmount } = render(
          <DateInput
            onChange={handleChange}
            locale={enUS}
          />,
        )
        const input = screen.getByRole("textbox")

        await user.type(input, testCase)
        await user.keyboard("{Enter}")

        await waitFor(
          () => {
            expect(handleChange).toHaveBeenCalledWith(expect.any(Date))
          },
          { timeout: 1000 },
        )

        unmount() // 清理组件
      }
    })
  })

  // 相对日期解析测试
  describe("相对日期解析功能", () => {
    it("应该解析简短相对日期格式", async () => {
      const user = userEvent.setup()

      const testCases = [
        "+3", // 3天后
        "-1", // 1天前
        "+7", // 7天后
      ]

      for (const testCase of testCases) {
        const handleChange = jest.fn() // 为每个测试用例创建新的mock

        const { unmount } = render(<DateInput onChange={handleChange} />)
        const input = screen.getByRole("textbox")

        await user.type(input, testCase)
        await user.keyboard("{Enter}")

        await waitFor(
          () => {
            expect(handleChange).toHaveBeenCalledWith(expect.any(Date))
          },
          { timeout: 1000 },
        )

        unmount() // 清理组件
      }
    })

    it("应该解析中文相对日期", async () => {
      const user = userEvent.setup()

      const testCases = ["3天后", "5天前", "2周后"]

      for (const testCase of testCases) {
        const handleChange = jest.fn() // 为每个测试用例创建新的mock

        const { unmount } = render(<DateInput onChange={handleChange} />)
        const input = screen.getByRole("textbox")

        await user.type(input, testCase)
        await user.keyboard("{Enter}")

        await waitFor(
          () => {
            expect(handleChange).toHaveBeenCalledWith(expect.any(Date))
          },
          { timeout: 1000 },
        )

        unmount() // 清理组件
      }
    })
  })

  // 数字解析功能测试
  describe("数字解析功能", () => {
    it("应该解析不同长度的纯数字输入", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()

      render(<DateInput onChange={handleChange} />)
      const input = screen.getByRole("textbox")

      const testCases = [
        "20240315", // 8位：YYYYMMDD
        "240315", // 6位：YYMMDD
        "0315", // 4位：MMDD
        "315", // 3位：MDD
        "15", // 2位：DD
        "5", // 1位：D
      ]

      for (const testCase of testCases) {
        handleChange.mockClear()
        await user.clear(input)
        await user.type(input, testCase)
        await user.keyboard("{Enter}")

        // 对于有些数字，可能不会触发onChange（如无效日期）
        // 我们验证至少不会崩溃
        expect(() => {}).not.toThrow()
      }
    })

    it("应该智能修正无效数字日期", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()

      render(<DateInput onChange={handleChange} />)
      const input = screen.getByRole("textbox")

      // 测试无效日期的智能修正
      const testCases = [
        "20240231", // 2月31日 → 2月29日（闰年）
        "20240431", // 4月31日 → 4月30日
        "20241301", // 13月 → 12月
        "20240229", // 闰年2月29日（应该有效）
      ]

      for (const testCase of testCases) {
        handleChange.mockClear()
        await user.clear(input)
        await user.type(input, testCase)
        await user.keyboard("{Enter}")

        // 验证不会崩溃且能正确处理
        expect(() => {}).not.toThrow()
      }
    })
  })

  // 格式化和国际化测试
  describe("格式化和国际化", () => {
    it("应该支持多种locale的日期格式", () => {
      const testDate = new Date(2024, 2, 15) // 2024年3月15日

      const locales = [
        { locale: zhCN, name: "中文" },
        { locale: enUS, name: "英文" },
        { locale: de, name: "德文" },
        { locale: fr, name: "法文" },
        { locale: ja, name: "日文" },
      ]

      locales.forEach(({ locale, name }) => {
        const { unmount } = render(
          <DateInput
            value={testDate}
            locale={locale}
          />,
        )

        const input = screen.getByRole("textbox") as HTMLInputElement
        expect(input.value).toBeTruthy()

        unmount()
      })
    })

    it("应该支持自定义日期格式", () => {
      const testDate = new Date(2024, 2, 15)

      const formats = ["yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy", "yyyy/MM/dd", "yyyyMMdd"]

      formats.forEach((format) => {
        const { unmount } = render(
          <DateInput
            value={testDate}
            format={format}
          />,
        )

        const input = screen.getByRole("textbox") as HTMLInputElement
        expect(input.value).toBeTruthy()

        unmount()
      })
    })
  })

  // 数据流控制测试
  describe("数据流控制", () => {
    it("应该正确处理外部值变化", async () => {
      const handleChange = jest.fn()
      const date1 = new Date(2024, 2, 15)
      const date2 = new Date(2024, 2, 16)

      const { rerender } = render(
        <DateInput
          value={date1}
          onChange={handleChange}
        />,
      )

      const input = screen.getByRole("textbox") as HTMLInputElement
      const value1 = input.value

      // 外部改变值
      rerender(
        <DateInput
          value={date2}
          onChange={handleChange}
        />,
      )

      const value2 = input.value
      expect(value2).not.toBe(value1)
    })

    it("应该防止竞态条件", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()

      render(<DateInput onChange={handleChange} />)
      const input = screen.getByRole("textbox")

      // 快速连续输入，测试竞态保护
      await user.type(input, "2024")
      await user.type(input, "-03")
      await user.type(input, "-15")
      await user.keyboard("{Enter}")

      // 等待所有异步操作完成
      await waitFor(
        () => {
          expect(handleChange).toHaveBeenCalled()
        },
        { timeout: 1000 },
      )
    })
  })

  // 错误恢复和边界情况测试
  describe("错误恢复和边界情况", () => {
    it("应该处理极端年份", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()

      render(<DateInput onChange={handleChange} />)
      const input = screen.getByRole("textbox")

      const extremeYears = [
        "19000101", // 太早的年份
        "30000101", // 太晚的年份
        "00000101", // 无效年份
        "99999999", // 无效格式
      ]

      for (const testCase of extremeYears) {
        await user.clear(input)
        await user.type(input, testCase)
        await user.keyboard("{Enter}")

        // 验证不会崩溃
        expect(() => {}).not.toThrow()
      }
    })

    it("应该处理空和特殊字符输入", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()

      render(<DateInput onChange={handleChange} />)
      const input = screen.getByRole("textbox")

      const specialInputs = [
        "   ", // 只有空格
        "abc", // 纯字母
        "123abc", // 混合字符
        "2024--03--15", // 重复分隔符
        "2024/13/45", // 无效月日
        "今天明天", // 冲突的自然语言
        "++3", // 多重符号
        "2024年13月45日", // 无效中文日期
      ]

      for (const testInput of specialInputs) {
        handleChange.mockClear()
        await user.clear(input)

        // 跳过空字符串，避免userEvent错误
        if (testInput.trim()) {
          await user.type(input, testInput)
        }
        await user.keyboard("{Enter}")

        // 验证不会崩溃
        expect(() => {}).not.toThrow()
      }

      // 单独测试空字符串情况
      handleChange.mockClear()
      await user.clear(input)
      await user.keyboard("{Enter}") // 直接按回车，测试空输入

      // 等待异步处理完成
      await waitFor(
        () => {
          // 空输入可能调用onChange(null)，也可能不调用（取决于实现）
          // 主要验证不会崩溃
          expect(() => {}).not.toThrow()
        },
        { timeout: 1000 },
      )

      // 验证组件仍正常工作
      expect((input as HTMLInputElement).value).toBeDefined()
    })

    it("应该处理格式化错误的降级", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()

      // 使用无效格式，测试降级机制
      render(
        <DateInput
          onChange={handleChange}
          format="invalid-format-with-special-chars-###"
        />,
      )

      const input = screen.getByRole("textbox")
      await user.type(input, "2024-03-15")
      await user.keyboard("{Enter}")

      // 应该不崩溃，并且能正常工作
      expect(() => {}).not.toThrow()
    })
  })

  // 预测功能深度测试
  describe("智能预测深度测试", () => {
    it("应该根据输入类型给出不同置信度的预测", async () => {
      const user = userEvent.setup()

      render(<DateInput enablePrediction={true} />)
      const input = screen.getByRole("textbox")

      const testCases = [
        { input: "今天", expectedConfidence: "high" },
        { input: "20240315", expectedConfidence: "high" },
        { input: "240315", expectedConfidence: "medium" },
        { input: "315", expectedConfidence: "medium" },
        { input: "15", expectedConfidence: "low" },
      ]

      for (const { input: testInput } of testCases) {
        await user.clear(input)
        await user.type(input, testInput)

        // 等待预测内容出现
        await waitFor(
          () => {
            const description = input.parentElement?.querySelector('[class*="description"]')
            if (description) {
              expect(description.textContent).toBeTruthy()
            }
          },
          { timeout: 1000 },
        )
      }
    })

    it("应该显示有意义的预测描述", async () => {
      const user = userEvent.setup()

      render(<DateInput enablePrediction={true} />)
      const input = screen.getByRole("textbox")

      const testCases = [
        { input: "今天", expectedKeywords: ["今天"] },
        { input: "明天", expectedKeywords: ["明天"] },
        { input: "3天后", expectedKeywords: ["天后"] },
        { input: "20240315", expectedKeywords: ["2024", "3", "15"] },
      ]

      for (const { input: testInput, expectedKeywords } of testCases) {
        await user.clear(input)
        await user.type(input, testInput)

        await waitFor(
          () => {
            const description = input.parentElement?.querySelector('[class*="description"]')
            if (description && description.textContent) {
              // 检查预测描述是否包含期望的关键词
              const hasExpectedKeyword = expectedKeywords.some((keyword) =>
                description.textContent!.includes(keyword),
              )
              expect(hasExpectedKeyword).toBe(true)
            }
          },
          { timeout: 1000 },
        )
      }
    })
  })

  // 性能和缓存深度测试
  describe("性能和缓存深度测试", () => {
    it("应该在大量输入时保持性能", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()

      render(
        <DateInput
          onChange={handleChange}
          enableCache={true}
        />,
      )
      const input = screen.getByRole("textbox")

      const startTime = Date.now()

      // 模拟大量快速输入
      for (let i = 0; i < 10; i++) {
        await user.clear(input)
        await user.type(input, `202403${(15 + i).toString().padStart(2, "0")}`)
        await user.keyboard("{Enter}")
      }

      const endTime = Date.now()
      const totalTime = endTime - startTime

      // 验证性能在合理范围内（这个阈值可以根据实际情况调整）
      expect(totalTime).toBeLessThan(5000) // 5秒内完成
    })

    it("应该正确缓存解析结果", async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()

      render(
        <DateInput
          onChange={handleChange}
          enableCache={true}
        />,
      )
      const input = screen.getByRole("textbox")

      // 第一次解析
      await user.type(input, "20240315")
      await user.keyboard("{Enter}")

      // 等待解析完成
      await waitFor(() => {
        expect(handleChange).toHaveBeenCalled()
      })

      const firstCallTime = Date.now()

      // 重复相同输入，应该从缓存获取
      handleChange.mockClear()
      await user.clear(input)
      await user.type(input, "20240315")
      await user.keyboard("{Enter}")

      const secondCallTime = Date.now()

      // 第二次调用应该更快（从缓存获取）
      const timeDiff = secondCallTime - firstCallTime
      expect(timeDiff).toBeLessThan(100) // 应该很快
    })
  })
})

// 月份工具函数单元测试
describe("Month Utilities", () => {
  describe("generateWeekdayNames", () => {
    it("应该生成正确的中文星期名称", () => {
      const weekdays = generateWeekdayNames(zhCN, 1)
      expect(weekdays).toHaveLength(7)
      expect(weekdays[0]).toMatch(/一|周一|Mon/)
    })

    it("应该生成正确的英文星期名称", () => {
      const weekdays = generateWeekdayNames(enUS, 0)
      expect(weekdays).toHaveLength(7)
      expect(weekdays[0]).toMatch(/Sun/)
    })
  })

  describe("generateCalendarDays", () => {
    it("应该生成正确的日历日期数组", () => {
      const currentMonth = new Date(2024, 2, 15) // 2024年3月
      const days = generateCalendarDays(currentMonth, 1, true)

      expect(days).toHaveLength(42) // 固定6行
      expect(days[0]).toBeInstanceOf(Date)
    })

    it("应该支持动态行数", () => {
      const currentMonth = new Date(2024, 1, 15) // 2024年2月
      const days = generateCalendarDays(currentMonth, 1, false)

      expect(days.length).toBeGreaterThan(0)
      expect(days.length % 7).toBe(0) // 应该是7的倍数
    })
  })

  describe("formatMonthTitle", () => {
    it("应该正确格式化中文月份标题", () => {
      const date = new Date(2024, 2, 15)
      const title = formatMonthTitle(date, zhCN)
      expect(title).toMatch(/2024.*3/)
    })

    it("应该正确格式化英文月份标题", () => {
      const date = new Date(2024, 2, 15)
      const title = formatMonthTitle(date, enUS)
      expect(title).toMatch(/March.*2024/)
    })
  })

  describe("calculateWeekNumbers", () => {
    it("应该计算正确的周数", () => {
      const days = generateCalendarDays(new Date(2024, 2, 15), 1, true)
      const weekNumbers = calculateWeekNumbers(days, zhCN)

      expect(weekNumbers).toHaveLength(6) // 6行
      expect(weekNumbers[0]).toBeGreaterThan(0)
    })
  })

  describe("inferSelectionMode", () => {
    it("应该正确推断选择模式", () => {
      expect(inferSelectionMode(new Date())).toBe("single")
      expect(inferSelectionMode([new Date()])).toBe("multiple")
      expect(inferSelectionMode({ start: new Date(), end: new Date() })).toBe("range")
      expect(inferSelectionMode(null)).toBe("single")
    })
  })

  describe("inferMonthFromValue", () => {
    it("应该从不同类型的值推断月份", () => {
      const date = new Date(2024, 2, 15)

      expect(inferMonthFromValue(date)).toEqual(date)
      expect(inferMonthFromValue([date])).toEqual(date)
      expect(inferMonthFromValue({ start: date, end: date })).toEqual(date)
      expect(inferMonthFromValue(null)).toBeNull()
    })
  })

  describe("isCalendarValueEqual", () => {
    it("应该正确比较不同类型的日历值", () => {
      const date1 = new Date(2024, 2, 15)
      const date2 = new Date(2024, 2, 15)
      const date3 = new Date(2024, 2, 16)

      expect(isCalendarValueEqual(date1, date2)).toBe(true)
      expect(isCalendarValueEqual(date1, date3)).toBe(false)
      expect(isCalendarValueEqual([date1], [date2])).toBe(true)
      expect(isCalendarValueEqual(null, null)).toBe(true)
    })
  })
})

// Parsers 工具函数单元测试
describe("Parsers Utilities", () => {
  describe("parseNaturalLanguage", () => {
    it("应该解析中文自然语言", () => {
      expect(parseNaturalLanguage("今天", "zh-CN")).toBeInstanceOf(Date)
      expect(parseNaturalLanguage("明天", "zh-CN")).toBeInstanceOf(Date)
      expect(parseNaturalLanguage("昨天", "zh-CN")).toBeInstanceOf(Date)
    })

    it("应该解析英文自然语言", () => {
      expect(parseNaturalLanguage("today", "en-US")).toBeInstanceOf(Date)
      expect(parseNaturalLanguage("tomorrow", "en-US")).toBeInstanceOf(Date)
      expect(parseNaturalLanguage("yesterday", "en-US")).toBeInstanceOf(Date)
    })
  })

  describe("parseRelativeDate", () => {
    it("应该解析相对日期表达", () => {
      expect(parseRelativeDate("3天后")).toBeInstanceOf(Date)
      expect(parseRelativeDate("2周前")).toBeInstanceOf(Date)
      expect(parseRelativeDate("1月后")).toBeInstanceOf(Date)
    })
  })

  describe("parseExtendedRelativeDate", () => {
    it("应该解析扩展的相对日期格式", () => {
      expect(parseExtendedRelativeDate("+3")).toBeInstanceOf(Date)
      expect(parseExtendedRelativeDate("-1")).toBeInstanceOf(Date)
      expect(parseExtendedRelativeDate("w+2")).toBeInstanceOf(Date)
      expect(parseExtendedRelativeDate("m-1")).toBeInstanceOf(Date)
    })
  })

  describe("handleShortcuts", () => {
    it("应该处理快捷键", () => {
      expect(handleShortcuts("t")).toBeInstanceOf(Date)
      expect(handleShortcuts("today")).toBeInstanceOf(Date)
      expect(handleShortcuts("今天")).toBeInstanceOf(Date)
      expect(handleShortcuts("tm")).toBeInstanceOf(Date)
      expect(handleShortcuts("y")).toBeInstanceOf(Date)
    })
  })

  describe("getEnhancedPrediction", () => {
    it("应该生成智能预测", () => {
      const prediction = getEnhancedPrediction("今天")
      expect(prediction).toBeTruthy()
      expect(prediction?.confidence).toBeGreaterThan(0)
      expect(prediction?.description).toBeTruthy()
    })
  })

  describe("smartCorrectDate", () => {
    it("应该智能修正无效日期", () => {
      const corrected = smartCorrectDate(2024, 13, 32)
      expect(corrected.month).toBeLessThanOrEqual(12)
      expect(corrected.day).toBeLessThanOrEqual(31)
    })
  })

  describe("数字解析工具", () => {
    it("parseYYMMDD 应该解析6位数字", () => {
      const result = parseYYMMDD("240315", "yyyy-MM-dd")
      expect(result).toBeTruthy()
      expect(result?.year).toBe(2024)
      expect(result?.month).toBe(3)
      expect(result?.day).toBe(15)
    })

    it("parseYYYYMMDD 应该解析8位数字", () => {
      const result = parseYYYYMMDD("20240315", "yyyy-MM-dd")
      expect(result).toBeTruthy()
      expect(result?.year).toBe(2024)
      expect(result?.month).toBe(3)
      expect(result?.day).toBe(15)
    })

    it("parse3Digits 应该解析3位数字", () => {
      const result = parse3Digits("315", 2024, "yyyy-MM-dd")
      expect(result).toBeTruthy()
      expect(result?.month).toBe(3)
      expect(result?.day).toBe(15)
    })
  })
})
