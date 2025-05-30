import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getWeek,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns"
import { de, enUS, es, fr, ja, ko, zhCN } from "date-fns/locale"

// date-fns 语言映射
const LOCALE_MAP = {
  "zh-CN": zhCN,
  "en-US": enUS,
  "ja-JP": ja,
  "ko-KR": ko,
  "fr-FR": fr,
  "de-DE": de,
  "es-ES": es,
}

// 使用 date-fns 的日期工具函数
export const dateUtils = {
  now: () => new Date(),
  isSameDay,
  isSameMonth,
  addMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
}

// 生成星期名称（使用 date-fns 多语言）
export function generateWeekdayNames(locale: string = "zh-CN", weekStartsOn: number = 1): string[] {
  const dateFnsLocale = LOCALE_MAP[locale as keyof typeof LOCALE_MAP] || zhCN

  // 使用一个已知的周日作为基准（2024年1月7日是周日）
  const baseSunday = new Date(2024, 0, 7)

  const weekdays: string[] = []
  for (let i = 0; i < 7; i++) {
    // 计算从weekStartsOn开始的每一天
    const dayIndex = (weekStartsOn + i) % 7
    const day = addDays(baseSunday, dayIndex)

    // 根据语言选择格式
    const formatPattern = locale === "zh-CN" ? "EEEEE" : "EEE"
    const dayName = format(day, formatPattern, { locale: dateFnsLocale })
    weekdays.push(dayName)
  }

  return weekdays
}

// 生成日历日期数组（使用 date-fns）
export function generateCalendarDays(
  currentMonth: Date,
  weekStartsOn: number = 0,
  fixedGrid: boolean = true,
): Date[] {
  const start = startOfWeek(startOfMonth(currentMonth), {
    weekStartsOn: weekStartsOn as 0 | 1 | 2 | 3 | 4 | 5 | 6,
  })

  if (fixedGrid) {
    // 固定返回42天（6行），确保高度一致
    const end = addDays(start, 41) // 0-41 = 42天
    return eachDayOfInterval({ start, end })
  } else {
    // 根据实际需要动态调整行数
    const end = endOfWeek(endOfMonth(currentMonth), {
      weekStartsOn: weekStartsOn as 0 | 1 | 2 | 3 | 4 | 5 | 6,
    })
    return eachDayOfInterval({ start, end })
  }
}

// 格式化月份标题（使用 date-fns）
export function formatMonthTitle(date: Date, locale: string = "zh-CN"): string {
  const dateFnsLocale = LOCALE_MAP[locale as keyof typeof LOCALE_MAP] || zhCN
  return format(date, "yyyy年M月", { locale: dateFnsLocale })
}

// 计算周数数组
export function calculateWeekNumbers(calendarDays: Date[], locale: string = "zh-CN"): number[] {
  const dateFnsLocale = LOCALE_MAP[locale as keyof typeof LOCALE_MAP] || zhCN
  const weekNumbers: number[] = []

  // 每7天计算一次周数（取每周的第一天）
  for (let i = 0; i < calendarDays.length; i += 7) {
    const weekFirstDay = calendarDays[i]
    const weekNumber = getWeek(weekFirstDay, {
      locale: dateFnsLocale,
      weekStartsOn: 1, // ISO周数标准，周一开始
    })
    weekNumbers.push(weekNumber)
  }

  return weekNumbers
}
