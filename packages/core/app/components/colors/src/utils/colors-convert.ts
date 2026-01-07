import { round } from "es-toolkit"
import tinycolor from "tinycolor2"
import type {
  HSB,
  HSL,
  RGB,
  RGBA,
  ColorProfile,
  CheckColorContrastLevel,
  CheckColorContrastCategory,
} from "../types/colors"

// RGB 转 HSL，保持原有色相
export function rgbToHsl({ r, g, b }: RGB, prevHue?: number): HSL {
  try {
    const color = tinycolor({ r, g, b })
    const hsl = color.toHsl()
    return {
      h: isNaN(hsl.h) ? (prevHue ?? 0) : hsl.h,
      s: round(hsl.s, 2),
      l: round(hsl.l, 2),
    }
  } catch {
    return { h: prevHue ?? 0, s: 0, l: 0 }
  }
}

// HSL 转 RGB
export function hslToRgb({ h, s, l }: HSL): RGB {
  try {
    const color = tinycolor({ h, s, l })
    const rgb = color.toRgb()
    return {
      r: round(rgb.r),
      g: round(rgb.g),
      b: round(rgb.b),
    }
  } catch {
    return { r: 0, g: 0, b: 0 }
  }
}

export function rgbToHsb({ r, g, b }: RGB): HSB {
  const color = tinycolor({ r, g, b })
  const hsb = color.toHsv()
  return {
    h: hsb.h,
    s: hsb.s,
    b: hsb.v,
  }
}

export function hsbToRgb({ h, s, b }: HSB): RGB {
  const color = tinycolor({ h, s, v: b })
  const rgb = color.toRgb()
  return {
    r: rgb.r,
    g: rgb.g,
    b: rgb.b,
  }
}

// RGB 转 P3
export function rgbToP3({ r, g, b, a }: RGBA): RGBA {
  return {
    r: r / 255,
    g: g / 255,
    b: b / 255,
    a,
  }
}

// P3 转 RGB
export function p3ToRgb({ r, g, b, a }: RGBA): RGBA {
  return {
    r: r * 255,
    g: g * 255,
    b: b * 255,
    a,
  }
}

// P3 字符串转 RGB 字符串
export function p3StringToRgbString(color: string): string {
  const matches = color.match(/\d+/g) || ["0", "0", "0"]
  const [r, g, b] = matches.map(Number)
  return `rgb(${r * 255}, ${g * 255}, ${b * 255})`
}

// 根据颜色空间转换颜色值
export const profileConvertString = (value: RGB | RGBA, colorProfile: ColorProfile) => {
  try {
    return typeof value === "object" && "a" in value
      ? colorProfile === "srgb"
        ? `rgba(${value.r} ${value.g} ${value.b} / ${value.a})`
        : `color(display-p3 ${round(value.r / 255, 3)} ${round(value.g / 255, 3)} ${round(value.b / 255, 3)} / ${round(value.a, 3)})`
      : colorProfile === "srgb"
        ? `rgb(${value.r} ${value.g} ${value.b})`
        : `color(display-p3 ${round(value.r / 255, 3)} ${round(value.g / 255, 3)} ${round(value.b / 255, 3)})`
  } catch {
    return value
  }
}

export const rgbaToRgb = (rgba: RGBA): RGB => {
  return {
    r: rgba.r,
    g: rgba.g,
    b: rgba.b,
  }
}

export const stringToRgba = (color: string): RGBA => {
  const rgbaRegex = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+))?\s*\)$/i
  const match = color.match(rgbaRegex)

  if (!match) {
    throw new Error("Invalid color format")
  }

  const [, r, g, b, a] = match
  return {
    r: parseInt(r, 10),
    g: parseInt(g, 10),
    b: parseInt(b, 10),
    a: a ? parseFloat(a) : 1, // Default alpha to 1 if not provided
  }
}

// --- Added Contrast Threshold Function ---

/**
 * 根据 WCAG 标准计算对比度阈值
 * @param level 对比度级别 (AA / AAA)
 * @param category 内容类别 (文本/图形)
 * @returns 对比度阈值
 */
export function getContrastThreshold(
  level: CheckColorContrastLevel = "AA",
  category: CheckColorContrastCategory = "auto",
  selectedElementType: "text" | "graphics" = "graphics",
): number {
  if (level === "AAA") {
    switch (category) {
      case "large-text":
        return 4.5 // AAA Large text
      case "normal-text":
        return 7.0 // AAA Normal text
      // WCAG doesn't define AAA for graphics, use AA standard (3.0)
      case "graphics":
        return 3.0
      case "auto":
        return selectedElementType === "text" ? 7.0 : 3.0 // Use 7.0 for text, 3.0 for graphics
      default:
        return selectedElementType === "text" ? 7.0 : 3.0
    }
  } else {
    // AA Level
    switch (category) {
      case "large-text":
        return 3.0 // AA Large text
      case "normal-text":
        return 4.5 // AA Normal text
      case "graphics":
        return 3.0 // AA Graphics
      case "auto":
        return selectedElementType === "text" ? 4.5 : 3.0 // Use 4.5 for text, 3.0 for graphics
      default:
        return selectedElementType === "text" ? 4.5 : 3.0
    }
  }
}
