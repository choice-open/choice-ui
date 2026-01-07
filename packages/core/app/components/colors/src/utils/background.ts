import tinycolor from "tinycolor2"
import type { PickerAreaType, PickerSliderType, ColorProfile } from "../types/colors"

/**
 * Generate background style for different types of color area
 */
export function getColorAreaBackground(
  type: PickerAreaType,
  hue = 0,
  colorSpace: ColorProfile,
): React.CSSProperties {
  const { r, g, b } = tinycolor({ h: hue, s: 1, l: 0.5 }).toRgb()
  const backgrounds = {
    "saturation-lightness": {
      background:
        colorSpace === "srgb"
          ? `
        linear-gradient(to top,
          rgb(0, 0, 0) 0%,
          rgba(0, 0, 0, 0) 50%,
          rgba(255, 255, 255, 0) 50%,
          rgb(255, 255, 255) 100%),
        linear-gradient(to right,
          rgb(128, 128, 128),
          rgba(128, 128, 128, 0)),
          rgb(${r}, ${g}, ${b})
      `
          : `
        linear-gradient(to top,
          color(display-p3 0 0 0) 0%,
          color(display-p3 0 0 0/0) 50%,
          color(display-p3 1 1 1/0) 50%,
          color(display-p3 1 1 1) 100%),
        linear-gradient(to right,
          color(display-p3 0.5 0.5 0.5),
          color(display-p3 0.5 0.5 0.5/0)),
          color(display-p3 ${r / 255} ${g / 255} ${b / 255})
      `,
    },
    "saturation-brightness": {
      background:
        colorSpace === "srgb"
          ? `
        linear-gradient(
          rgba(0, 0, 0, 0) 0%,
          rgb(0, 0, 0) 100%),
        linear-gradient(
          to right, rgb(255, 255, 255) 0%,
          rgb(${r}, ${g}, ${b}) 100%)
      `
          : `
        linear-gradient(
          color(display-p3 0 0 0 / 0) 0%,
          color(display-p3 0 0 0) 100%),
        linear-gradient(
          to right, color(display-p3 1 1 1) 0%,
          color(display-p3 ${r / 255} ${g / 255} ${b / 255}) 100%)
      `,
    },
    "hue-saturation": {
      background:
        colorSpace === "srgb"
          ? `
        linear-gradient(to top,
          rgb(128, 128, 128), transparent),
        linear-gradient(to right,
          rgb(255, 0, 0),
          rgb(255, 255, 0),
          rgb(0, 255, 0),
          rgb(0, 255, 255),
          rgb(0, 0, 255),
          rgb(255, 0, 255),
          rgb(255, 0, 0))
      `
          : `
        linear-gradient(to top,
          color(display-p3 0.5 0.5 0.5), transparent),
        linear-gradient(to right,
          color(display-p3 1 0 0),
          color(display-p3 1 1 0),
          color(display-p3 0 1 0),
          color(display-p3 0 1 1),
          color(display-p3 0 0 1),
          color(display-p3 1 0 1),
          color(display-p3 1 0 0))
      `,
    },
    "hue-lightness": {
      background:
        colorSpace === "srgb"
          ? `
        linear-gradient(to top,
          rgba(255, 255, 255, 0.93),
          rgba(255, 255, 255, 0)),
        linear-gradient(to right,
          rgba(255, 0, 0, 0.93),
          rgba(255, 255, 0, 0.93),
          rgba(0, 255, 0, 0.93),
          rgba(0, 255, 255, 0.93),
          rgba(0, 0, 255, 0.93),
          rgba(255, 0, 255, 0.93),
          rgba(255, 0, 4, 0.93)),
          rgb(0, 0, 0)
      `
          : `
        linear-gradient(to top,
          color(display-p3 1 1 1 / 0.93),
          color(display-p3 1 1 1 / 0)),
        linear-gradient(to right,
          color(display-p3 1 0 0 / 0.93),
          color(display-p3 1 1 0 / 0.93),
          color(display-p3 0 1 0 / 0.93),
          color(display-p3 0 1 1 / 0.93),
          color(display-p3 0 0 1 / 0.93),
          color(display-p3 1 0 1 / 0.93),
          color(display-p3 1 0 0.0157 / 0.93)),
          color(display-p3 0 0 0)
      `,
    },
  }

  return backgrounds[type]
}

export function getSliderBackground(type: PickerSliderType, hue = 0, colorSpace: ColorProfile) {
  const {
    r: saturation_1_r,
    g: saturation_1_g,
    b: saturation_1_b,
  } = tinycolor({ h: hue, s: 0, l: 0.5 }).toRgb()
  const {
    r: saturation_2_r,
    g: saturation_2_g,
    b: saturation_2_b,
  } = tinycolor({ h: hue, s: 1, l: 0.5 }).toRgb()
  const {
    r: lightness_1_r,
    g: lightness_1_g,
    b: lightness_1_b,
  } = tinycolor({ h: hue, s: 1, l: 0 }).toRgb()
  const {
    r: lightness_2_r,
    g: lightness_2_g,
    b: lightness_2_b,
  } = tinycolor({ h: hue, s: 1, l: 0.5 }).toRgb()
  const {
    r: lightness_3_r,
    g: lightness_3_g,
    b: lightness_3_b,
  } = tinycolor({ h: hue, s: 1, l: 1 }).toRgb()

  const { r: alpha_r, g: alpha_g, b: alpha_b } = tinycolor({ h: hue, s: 1, l: 0.5 }).toRgb()

  switch (type) {
    case "hue":
      return {
        background:
          colorSpace === "srgb"
            ? `
              linear-gradient(to right,
                rgb(255, 0, 0),
                rgb(255, 255, 0),
                rgb(0, 255, 0),
                rgb(0, 255, 255),
                rgb(0, 0, 255),
                rgb(255, 0, 255),
                rgb(255, 0, 0))
              `
            : `
              linear-gradient(to right,
                color(display-p3 1 0 0),
                color(display-p3 1 1 0),
                color(display-p3 0 1 0),
                color(display-p3 0 1 1),
                color(display-p3 0 0 1),
                color(display-p3 1 0 1),
                color(display-p3 1 0 0))
        `,
      }
    case "saturation":
      return {
        background:
          colorSpace === "srgb"
            ? `
              linear-gradient(to right,
                rgb(${saturation_1_r}, ${saturation_1_g}, ${saturation_1_b}),
                rgb(${saturation_2_r}, ${saturation_2_g}, ${saturation_2_b}))
              `
            : `
              linear-gradient(to right,
                color(display-p3 ${saturation_1_r / 255} ${saturation_1_g / 255} ${saturation_1_b / 255}),
                color(display-p3 ${saturation_2_r / 255} ${saturation_2_g / 255} ${saturation_2_b / 255}))
              `,
      }
    case "lightness":
      return {
        background:
          colorSpace === "srgb"
            ? `
              linear-gradient(to right,
                rgb(${lightness_1_r}, ${lightness_1_g}, ${lightness_1_b}),
                rgb(${lightness_2_r}, ${lightness_2_g}, ${lightness_2_b}),
                rgb(${lightness_3_r}, ${lightness_3_g}, ${lightness_3_b}))
              `
            : `
              linear-gradient(to right,
                color(display-p3 ${lightness_1_r / 255} ${lightness_1_g / 255} ${lightness_1_b / 255}),
                color(display-p3 ${lightness_2_r / 255} ${lightness_2_g / 255} ${lightness_2_b / 255}),
                color(display-p3 ${lightness_3_r / 255} ${lightness_3_g / 255} ${lightness_3_b / 255}))
              `,
      }
    case "alpha":
      return {
        background:
          colorSpace === "srgb"
            ? `
              linear-gradient(to right,
                rgba(${alpha_r}, ${alpha_g}, ${alpha_b}, 0),
                rgba(${alpha_r}, ${alpha_g}, ${alpha_b}, 1)),
              repeating-conic-gradient(
                rgb(204, 204, 204) 0%,
                rgb(204, 204, 204) 25%,
                rgb(255, 255, 255) 0%,
                rgb(255, 255, 255) 50%
              ) left top / 11px 11px
            `
            : `
              linear-gradient(to right,
                color(display-p3 ${alpha_r / 255} ${alpha_g / 255} ${alpha_b / 255} / 0),
                color(display-p3 ${alpha_r / 255} ${alpha_g / 255} ${alpha_b / 255} / 1)),
              repeating-conic-gradient(
                color(display-p3 0.8 0.8 0.8) 0%,
                color(display-p3 0.8 0.8 0.8) 25%,
                color(display-p3 1 1 1) 0%,
                color(display-p3 1 1 1) 50%
              ) left top / 11px 11px
            `,
      }
  }
}

export function getColorSwatchBackground(
  size: number,
  scale: number = 3,
  colors?: {
    background: string
    foreground: string
  },
) {
  return `repeating-conic-gradient(
    ${colors?.background ?? "rgb(204, 204, 204)"} 0%,
    ${colors?.background ?? "rgb(204, 204, 204)"} 25%,
    ${colors?.foreground ?? "white"} 0%,
    ${colors?.foreground ?? "white"} 50%
  ) left top / ${size / scale}px ${size / scale}px`
}
