import { round } from "es-toolkit"
import type { ColorProfile, RGB, RGBA, Transform } from "../types/colors"
import type { GradientPaint } from "../types/paint"
import { profileConvertString } from "./colors-convert"
import { radToDeg, wrapAngle } from "./math"

// 获取颜色数组
export const getColorArr = (
  color: RGB | RGBA,
): {
  alpha: number
  color: RGB
} => {
  if ("a" in color) {
    return {
      color: {
        r: color.r,
        g: color.g,
        b: color.b,
      },
      alpha: color.a,
    }
  }
  return {
    color: {
      r: color.r,
      g: color.g,
      b: color.b,
    },
    alpha: 1,
  }
}

export const getRGBAString = (color: RGB | RGBA, alpha?: number) => {
  const opacity = alpha ?? ("a" in color ? color.a : 1)
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`
}

// 获取渐变字符串
export const getGradientString = (
  gradientStops: GradientPaint["gradientStops"],
  gradientType: GradientPaint["type"],
  gradientTransform: GradientPaint["gradientTransform"],
  colorProfile?: ColorProfile,
): string => {
  const getStopString = (stop: (typeof gradientStops)[0]) => {
    // 将 RGB 和 alpha 合并为 RGBA 对象
    const color: RGBA = {
      ...stop.color,
      a: round(stop.alpha, 2),
    }
    return `${profileConvertString(color, colorProfile ?? "srgb")} ${round(stop.position * 100, 2)}%`
  }

  const stops = gradientStops.map(getStopString).join(", ")
  const angle = gradientTransform[0][2]

  switch (gradientType) {
    case "GRADIENT_RADIAL":
      return `radial-gradient(circle, ${stops})`
    case "GRADIENT_ANGULAR":
      return `conic-gradient(from ${angle}deg, ${stops})`
    default:
      return `linear-gradient(${angle}deg, ${stops})`
  }
}

export const getLinearGradientAngle = (gradientTransform: Transform) => {
  const [[a11, _a12, _a13], [a21, _a22, _a23]] = gradientTransform
  const angleRad = Math.atan2(a21, a11)
  const angle = wrapAngle(radToDeg(angleRad))
  return angle
}

export const getRadialGradientPosition = (gradientTransform: Transform) => {
  const [[a11, a12, a13], [a21, a22, a23]] = gradientTransform

  const widthFactor = Math.sqrt(a11 * a11 + a12 * a12)
  const heightFactor = Math.sqrt(a21 * a21 + a22 * a22)

  const centerAnchorX = a13
  const centerAnchorY = a23

  return {
    widthFactor,
    heightFactor,
    centerAnchorX,
    centerAnchorY,
  }
}

export const getConicGradientPosition = (gradientTransform: Transform) => {
  const [[a11, _a12, a13], [a21, _a22, a23]] = gradientTransform

  const angleRad = Math.atan2(a21, a11)
  const angle = wrapAngle(radToDeg(angleRad))

  const centerAnchorX = a13
  const centerAnchorY = a23

  return {
    angle,
    centerAnchorX,
    centerAnchorY,
  }
}
