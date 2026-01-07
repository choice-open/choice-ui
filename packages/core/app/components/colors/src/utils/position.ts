import type { HSB, HSL, PickerAreaType, PickerSliderType } from "../types/colors"
import { Vector } from "../types/base"

const MAX_HUE = 360
const MAX_PERCENTAGE = 100
const DEFAULT_LIGHTNESS = 50

/**
 * Convert position to color values based on color area type
 */
export function positionToAreaColor(position: Vector, type: PickerAreaType, hue = 0): HSB | HSL {
  const { x, y } = position

  switch (type) {
    case "saturation-lightness": {
      // 使用 HSL
      return {
        h: hue,
        s: x * MAX_PERCENTAGE,
        l: y * MAX_PERCENTAGE,
      }
    }
    case "saturation-brightness": {
      // 使用 HSB
      return {
        h: hue,
        s: x * MAX_PERCENTAGE,
        b: y * MAX_PERCENTAGE,
      }
    }
  }
}

/**
 * Convert color values to position based on color area type
 */
export function colorToAreaPosition(color: HSB | HSL, type: PickerAreaType): Vector {
  switch (type) {
    case "saturation-lightness": {
      const hsl = color as HSL
      return {
        x: hsl.s / MAX_PERCENTAGE,
        y: hsl.l / MAX_PERCENTAGE,
      }
    }
    case "saturation-brightness": {
      const hsb = color as HSB
      return {
        x: hsb.s / MAX_PERCENTAGE,
        y: hsb.b / MAX_PERCENTAGE,
      }
    }
  }
}

/**
 * Convert HSB to HSL
 */
export function hsbToHsl(hsb: HSB): HSL {
  const { h, s: s_hsb, b } = hsb
  // HSB to HSL conversion
  const l = (b * (200 - s_hsb)) / 200
  const s_hsl = b === 0 ? 0 : (s_hsb * b) / (l <= 50 ? l * 2 : 200 - l * 2)

  return {
    h,
    s: Math.min(Math.max(s_hsl, 0), 100),
    l: Math.min(Math.max(l, 0), 100),
  }
}

/**
 * Convert HSL to HSB
 */
export function hslToHsb(hsl: HSL): HSB {
  const { h, s: s_hsl, l } = hsl
  // HSL to HSB conversion
  const b = l + (s_hsl * Math.min(l, 100 - l)) / 100
  const s_hsb = l === 0 ? 0 : 200 * (1 - l / b)

  return {
    h,
    s: Math.min(Math.max(s_hsb, 0), 100),
    b: Math.min(Math.max(b, 0), 100),
  }
}

/**
 * Color value stabilizer for edge cases
 */
export class ColorStabilizer {
  private readonly EDGE_THRESHOLD = 2 // 边缘阈值2%
  private readonly BRIGHTNESS_THRESHOLD = 3 // 亮度阈值3%

  stabilizeHSB(hsb: HSB): HSB {
    // 在低亮度区域，保持饱和度值，只固定亮度为0
    if (hsb.b <= this.BRIGHTNESS_THRESHOLD) {
      return {
        h: hsb.h,
        s: hsb.s, // 保持原始饱和度
        b: 0,
      }
    }

    // 如果饱和度接近0，保持色相和亮度，设置饱和度为0
    if (hsb.s <= this.EDGE_THRESHOLD) {
      return {
        h: hsb.h,
        s: 0,
        b: hsb.b,
      }
    }

    // 如果饱和度和亮度都在有效范围内，保持原始值
    return hsb
  }

  stabilizeHSL(hsl: HSL): HSL {
    // 在极端亮度区域，保持饱和度值
    if (hsl.l <= this.BRIGHTNESS_THRESHOLD) {
      return {
        h: hsl.h,
        s: hsl.s, // 保持原始饱和度
        l: 0,
      }
    }
    if (hsl.l >= 100 - this.BRIGHTNESS_THRESHOLD) {
      return {
        h: hsl.h,
        s: hsl.s, // 保持原始饱和度
        l: 100,
      }
    }

    // 如果饱和度接近0，保持色相和亮度，设置饱和度为0
    if (hsl.s <= this.EDGE_THRESHOLD) {
      return {
        h: hsl.h,
        s: 0,
        l: hsl.l,
      }
    }

    // 如果饱和度和亮度都在有效范围内，保持原始值
    return hsl
  }
}

/**
 * Convert slider position to color value string
 */
export function positionToSliderValue(position: number, type: PickerSliderType, hue = 0): string {
  const value = position * MAX_PERCENTAGE

  switch (type) {
    case "hue":
      return `hsl(${(position * MAX_HUE) % MAX_HUE}, ${MAX_PERCENTAGE}%, ${DEFAULT_LIGHTNESS}%)`
    case "saturation":
      return `hsl(${hue}, ${Math.round(value)}%, ${DEFAULT_LIGHTNESS}%)`
    case "lightness":
      return `hsl(${hue}, ${MAX_PERCENTAGE}%, ${Math.round(value)}%)`
    case "alpha":
      return `hsla(${hue}, ${MAX_PERCENTAGE}%, ${DEFAULT_LIGHTNESS}%, ${position})`
  }
}

export const isEdgeValue = (value: number) => Math.abs(value) < 0.01 || Math.abs(value - 1) < 0.01

// 导出类型
export type { HSB, HSL, Vector }
