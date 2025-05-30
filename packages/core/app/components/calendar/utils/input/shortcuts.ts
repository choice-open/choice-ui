import { startOfDay, startOfWeek, startOfMonth, addDays, subDays } from "date-fns"

// 快捷键处理
export function handleShortcuts(input: string): Date | null {
  const lower = input.toLowerCase().trim()
  const now = new Date()

  // 中英文快捷键
  const shortcuts: Record<string, () => Date> = {
    t: () => startOfDay(now),
    today: () => startOfDay(now),
    今: () => startOfDay(now),
    今天: () => startOfDay(now),

    y: () => startOfDay(subDays(now, 1)),
    yesterday: () => startOfDay(subDays(now, 1)),
    昨: () => startOfDay(subDays(now, 1)),
    昨天: () => startOfDay(subDays(now, 1)),

    tm: () => startOfDay(addDays(now, 1)),
    tomorrow: () => startOfDay(addDays(now, 1)),
    明: () => startOfDay(addDays(now, 1)),
    明天: () => startOfDay(addDays(now, 1)),

    w: () => startOfWeek(now),
    week: () => startOfWeek(now),
    周: () => startOfWeek(now),
    本周: () => startOfWeek(now),

    m: () => startOfMonth(now),
    month: () => startOfMonth(now),
    月: () => startOfMonth(now),
    本月: () => startOfMonth(now),
  }

  const handler = shortcuts[lower]
  return handler ? handler() : null
}
