import tinycolor from "tinycolor2"
import type { CheckColorContrastCategory, CheckColorContrastLevel, RGB } from "../types/colors"
import { getContrastThreshold } from "./colors-convert"

/**
 * Calculate contrast ratio between two colors accounting for alpha blending
 * @param backgroundColor Background color as RGB object or color string
 * @param foregroundColor Foreground color as RGB object or color string
 * @param foregroundAlpha Alpha value of the foreground color (0-1)
 * @returns Contrast ratio as a number
 */
export const calculateContrastRatio = (
  backgroundColor: RGB,
  foregroundColor: RGB,
  foregroundAlpha = 1,
): number => {
  const bgColor = tinycolor(backgroundColor)
  const fgColor = tinycolor(foregroundColor)
  fgColor.setAlpha(foregroundAlpha)

  let actualFgColor = fgColor
  if (foregroundAlpha < 1) {
    actualFgColor = tinycolor.mix(
      bgColor.toRgbString(),
      fgColor.toRgbString(),
      foregroundAlpha * 100,
    )
  }

  return tinycolor.readability(bgColor, actualFgColor)
}

/**
 * Determine if a color combination meets the specified contrast standard
 * @param backgroundColor Background color
 * @param foregroundColor Foreground color
 * @param foregroundAlpha Alpha value of foreground color
 * @param level Accessibility level (AA or AAA)
 * @param category Type of content
 * @param elementType Type of element (text or graphics)
 * @returns Boolean indicating if the contrast meets the standard
 */
export const meetsContrastStandard = (
  backgroundColor: RGB,
  foregroundColor: RGB,
  foregroundAlpha = 1,
  level: CheckColorContrastLevel = "AA",
  category: CheckColorContrastCategory = "auto",
  elementType: "text" | "graphics" = "graphics",
): boolean => {
  const ratio = calculateContrastRatio(backgroundColor, foregroundColor, foregroundAlpha)
  const threshold = getContrastThreshold(level, category, elementType)
  return ratio >= threshold
}

/**
 * Get the effective element type based on category and selected element type
 * @param category Content category
 * @param selectedElementType Selected element type
 * @returns Effective element type (text or graphics)
 */
export const getEffectiveElementType = (
  category?: CheckColorContrastCategory,
  selectedElementType?: "text" | "graphics",
): "text" | "graphics" => {
  if (category === "large-text" || category === "normal-text") {
    return "text"
  }
  return selectedElementType ?? "graphics"
}
