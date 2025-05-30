// 英文月份映射（支持全称、缩写和常见变体）
export const englishMonths: Record<string, number> = {
  // 全称
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,

  // 标准缩写
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,

  // 常见变体和带点缩写
  sept: 9,
  "sept.": 9,
  "sep.": 9,
  "jan.": 1,
  "feb.": 2,
  "mar.": 3,
  "apr.": 4,
  "jun.": 6,
  "jul.": 7,
  "aug.": 8,
  "oct.": 10,
  "nov.": 11,
  "dec.": 12,
}

// 中文月份映射
export const chineseMonths: Record<string, number> = {
  一月: 1,
  二月: 2,
  三月: 3,
  四月: 4,
  五月: 5,
  六月: 6,
  七月: 7,
  八月: 8,
  九月: 9,
  十月: 10,
  十一月: 11,
  十二月: 12,
  "1月": 1,
  "2月": 2,
  "3月": 3,
  "4月": 4,
  "5月": 5,
  "6月": 6,
  "7月": 7,
  "8月": 8,
  "9月": 9,
  "10月": 10,
  "11月": 11,
  "12月": 12,
}

// 智能月份识别
export function parseMonthName(input: string): number | null {
  const normalized = input.toLowerCase().trim()

  // 直接查找英文月份
  if (englishMonths[normalized]) {
    return englishMonths[normalized]
  }

  // 查找中文月份
  if (chineseMonths[input.trim()]) {
    return chineseMonths[input.trim()]
  }

  // 模糊匹配英文月份（至少2个字符）
  if (normalized.length >= 2) {
    for (const [monthName, monthNum] of Object.entries(englishMonths)) {
      if (monthName.startsWith(normalized) && monthName.length >= normalized.length) {
        return monthNum
      }
    }
  }

  return null
}
