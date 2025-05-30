import { format, setHours, setMinutes, isAfter, isBefore, startOfDay } from "date-fns"
import type { Time, TimeFormat, TimeOptionItem } from "./types"

// 创建时间对象
export function createTime(hour: number, minute: number): Time {
  return { hour: Math.max(0, Math.min(23, hour)), minute: Math.max(0, Math.min(59, minute)) }
}

// 时间转换为Date对象（基于今天）
export function timeToDate(time: Time): Date {
  const today = startOfDay(new Date())
  return setMinutes(setHours(today, time.hour), time.minute)
}

// Date对象转换为时间
export function dateToTime(date: Date): Time {
  return {
    hour: date.getHours(),
    minute: date.getMinutes(),
  }
}

// 格式化时间显示
export function formatTime(time: Time, timeFormat: TimeFormat = "24h"): string {
  const date = timeToDate(time)

  if (timeFormat === "12h") {
    return format(date, "h:mm a")
  }

  return format(date, "HH:mm")
}

// 格式化小时显示
export function formatHour(hour: number, timeFormat: TimeFormat = "24h"): string {
  const date = setHours(startOfDay(new Date()), hour)

  if (timeFormat === "12h") {
    return format(date, "h a")
  }

  return hour.toString().padStart(2, "0")
}

// 格式化分钟显示
export function formatMinute(minute: number): string {
  return minute.toString().padStart(2, "0")
}

// 生成时间选项列表（单列模式）
export function generateTimeOptions(
  minuteStep: number = 15,
  hourStep: number = 1,
  timeFormat: TimeFormat = "24h",
  minTime?: Time,
  maxTime?: Time,
): TimeOptionItem[] {
  const options: TimeOptionItem[] = []

  for (let hour = 0; hour < 24; hour += hourStep) {
    for (let minute = 0; minute < 60; minute += minuteStep) {
      const time = createTime(hour, minute)
      const label = formatTime(time, timeFormat)

      // 检查时间范围限制
      let disabled = false
      if (minTime || maxTime) {
        const timeDate = timeToDate(time)
        if (minTime && isBefore(timeDate, timeToDate(minTime))) {
          disabled = true
        }
        if (maxTime && isAfter(timeDate, timeToDate(maxTime))) {
          disabled = true
        }
      }

      options.push({
        value: time,
        label,
        disabled,
      })
    }
  }

  return options
}

// 生成小时选项列表（双列模式）
export function generateHourOptions(
  hourStep: number = 1,
  timeFormat: TimeFormat = "24h",
): Array<{ label: string; value: number }> {
  const options: Array<{ label: string; value: number }> = []

  for (let hour = 0; hour < 24; hour += hourStep) {
    options.push({
      value: hour,
      label: formatHour(hour, timeFormat),
    })
  }

  return options
}

// 生成分钟选项列表（双列模式）
export function generateMinuteOptions(
  minuteStep: number = 15,
): Array<{ label: string; value: number }> {
  const options: Array<{ label: string; value: number }> = []

  for (let minute = 0; minute < 60; minute += minuteStep) {
    options.push({
      value: minute,
      label: formatMinute(minute),
    })
  }

  return options
}

// 检查两个时间是否相等
export function isTimeEqual(time1: Time, time2: Time): boolean {
  return time1.hour === time2.hour && time1.minute === time2.minute
}

// 查找最接近的有效时间
export function findClosestValidTime(
  time: Time,
  minuteStep: number = 15,
  hourStep: number = 1,
): Time {
  // 找到最接近的有效分钟
  const closestMinute = Math.round(time.minute / minuteStep) * minuteStep

  // 找到最接近的有效小时
  const closestHour = Math.round(time.hour / hourStep) * hourStep

  return createTime(closestHour, closestMinute % 60)
}
