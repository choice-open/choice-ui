import { format } from "date-fns"
import type { DateFormat } from "../../types"
import { parseDate } from "./parsers"

// 预测结果类型
export interface PredictionResult {
  /** 置信度 (0-1) */
  confidence: number
  /** 描述信息 */
  description: string
  /** 预测的日期字符串 */
  prediction: string
  /** 预测类型 */
  type: "numeric" | "shortcut" | "relative" | "parsed"
}

/**
 * 增强的智能预测功能
 * 直接使用 parseDate 函数，确保预测结果与实际格式化100%一致
 */
export function getEnhancedPrediction(
  input: string,
  targetFormat: DateFormat = "yyyy-MM-dd",
): PredictionResult | null {
  if (!input.trim()) return null

  const trimmedInput = input.trim()

  // 直接使用真实的解析器！
  try {
    const parsed = parseDate(trimmedInput, {
      format: targetFormat,
      enableSmartCorrection: true,
      enableNaturalLanguage: true,
      enableRelativeDate: true,
    })

    if (parsed && !isNaN(parsed.getTime())) {
      // 成功解析，生成预测结果
      const formatted = format(parsed, targetFormat)

      // 生成智能描述
      const description = generateDescription(trimmedInput, parsed)

      // 计算置信度
      const confidence = calculateConfidence(trimmedInput, parsed)

      // 确定预测类型
      const type = determineType(trimmedInput)

      return {
        prediction: formatted,
        description,
        confidence,
        type,
      }
    }
  } catch {
    // 解析失败，返回null
  }

  return null
}

/**
 * 生成智能描述
 */
function generateDescription(input: string, parsedDate: Date): string {
  const trimmedInput = input.trim().toLowerCase()
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const parsed = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate())

  // 快捷键描述
  const shortcuts: Record<string, string> = {
    t: "今天",
    today: "今天",
    今: "今天",
    今天: "今天",
    y: "昨天",
    yesterday: "昨天",
    昨: "昨天",
    tm: "明天",
    tomorrow: "明天",
    明: "明天",
  }

  if (shortcuts[trimmedInput]) {
    return shortcuts[trimmedInput]
  }

  // 计算日期差
  const dayDiff = Math.round((parsed.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  // 相对日期描述
  if (dayDiff === 0) {
    return "今天"
  } else if (dayDiff === 1) {
    return "明天"
  } else if (dayDiff === -1) {
    return "昨天"
  } else if (dayDiff > 0 && dayDiff <= 7) {
    return `${dayDiff}天后`
  } else if (dayDiff < 0 && dayDiff >= -7) {
    return `${Math.abs(dayDiff)}天前`
  }

  // 年月日描述
  const year = parsedDate.getFullYear()
  const month = parsedDate.getMonth() + 1
  const day = parsedDate.getDate()
  const currentYear = now.getFullYear()

  if (year === currentYear) {
    return `当年${month}月${day}日`
  } else {
    return `${year}年${month}月${day}日`
  }
}

/**
 * 计算置信度
 */
function calculateConfidence(input: string, parsedDate: Date): number {
  const trimmedInput = input.trim().toLowerCase()

  // 快捷键：最高置信度
  const shortcuts = ["t", "today", "今", "今天", "y", "yesterday", "昨", "tm", "tomorrow", "明"]
  if (shortcuts.includes(trimmedInput)) {
    return 1.0
  }

  // 纯数字：根据长度判断置信度
  if (/^\d+$/.test(trimmedInput)) {
    const length = trimmedInput.length
    if (length === 8) return 0.95 // YYYYMMDD：很可信
    if (length === 6) return 0.9 // YYMMDD：很可信
    if (length === 4) return 0.85 // MMDD或年份：比较可信
    if (length === 3) return 0.8 // 月日：中等可信
    if (length === 2) return 0.75 // 日期或年份：中等可信
    if (length === 1) return 0.6 // 年份个位：较低可信
    return 0.7 // 其他长度
  }

  // 包含文字的复杂输入
  if (trimmedInput.includes("年") || trimmedInput.includes("月") || trimmedInput.includes("日")) {
    return 0.85
  }

  if (trimmedInput.includes("-") || trimmedInput.includes("/")) {
    return 0.8
  }

  // 默认置信度
  return 0.7
}

/**
 * 确定预测类型
 */
function determineType(input: string): PredictionResult["type"] {
  const trimmedInput = input.trim().toLowerCase()

  // 快捷键
  const shortcuts = ["t", "today", "今", "今天", "y", "yesterday", "昨", "tm", "tomorrow", "明"]
  if (shortcuts.includes(trimmedInput)) {
    return "shortcut"
  }

  // 纯数字
  if (/^\d+$/.test(trimmedInput)) {
    return "numeric"
  }

  // 相对日期
  if (
    trimmedInput.includes("天前") ||
    trimmedInput.includes("天后") ||
    trimmedInput.includes("周") ||
    trimmedInput.includes("月") ||
    trimmedInput.includes("ago") ||
    trimmedInput.includes("later")
  ) {
    return "relative"
  }

  // 其他解析结果
  return "parsed"
}

/**
 * 向后兼容的 getPredictionInfo 函数
 */
export function getPredictionInfo(
  input: string,
  targetFormat: DateFormat,
): {
  description: string
  prediction: string
} | null {
  const result = getEnhancedPrediction(input, targetFormat)
  if (!result) return null

  return {
    prediction: result.prediction,
    description: result.description,
  }
}
