import { COLOR_SPACES } from "../contents"

export interface RGB {
  readonly b: number
  readonly g: number
  readonly r: number
}

export interface RGBA {
  readonly a: number
  readonly b: number
  readonly g: number
  readonly r: number
}

export interface HSL {
  readonly h: number
  readonly l: number
  readonly s: number
}

export interface HSV {
  readonly h: number
  readonly s: number
  readonly v: number
}

export interface HSLA {
  readonly a: number
  readonly h: number
  readonly l: number
  readonly s: number
}

export interface HSB {
  readonly b: number
  readonly h: number
  readonly s: number
}

export interface HSBA {
  readonly a: number
  readonly b: number
  readonly h: number
  readonly s: number
}

export declare type Transform = [[number, number, number], [number, number, number]]

export interface PaintState {
  h: number // 0-360

  hsl_s: number
  // 0-1
  hsv_s: number

  l: number // 0-1
  v: number // 0-1
}

export interface ColorStop {
  readonly alpha: number
  readonly color: RGB
  readonly id: string
  readonly position: number
}

export type ColorProfile = "srgb" | "display-p3"

export type CheckColorContrastCategory = "auto" | "large-text" | "normal-text" | "graphics"
export type CheckColorContrastLevel = "AA" | "AAA"

export type PickerType = string

export type PickerAreaType = "saturation-lightness" | "saturation-brightness"

export type PickerSliderType = "hue" | "saturation" | "lightness" | "alpha"
export type PickerGradientType = "linear" | "radial" | "conic"

export type ChannelFieldSpace = (typeof COLOR_SPACES)[keyof typeof COLOR_SPACES]

export type ChannelFieldFeature = {
  alpha?: boolean
  hex?: boolean
  hsb?: boolean
  hsl?: boolean
  rgb?: boolean
  spaceDropdown?: boolean
}

export interface SolidPaintFeature extends ChannelFieldFeature {
  checkColorContrast?: boolean
  containerWidth?: number
  nativePicker?: boolean
  presets?: boolean
}

export interface ImagePaintFeature extends SolidPaintFeature {
  containerWidth?: number
  labels?: {
    contrast?: string
    crop?: string
    exposure?: string
    fill?: string
    fit?: string
    processing?: string
    rotate?: string
    saturation?: string
    temperature?: string
    tile?: string
    tint?: string
    upload?: string
  }
}

export interface PickerFeatures extends SolidPaintFeature {
  custom?: boolean
  gradient?: boolean
  image?: boolean
  paintsType?: boolean
  pattern?: boolean
  pickerType?: boolean
  solid?: boolean
}

export interface ColorContrast {
  backgroundColor?: RGB
  category?: CheckColorContrastCategory
  contrastInfo?: number
  foregroundAlpha?: number
  foregroundColor?: RGB
  handleApplyRecommendedPoint?: () => void
  handleCategoryChange?: (category: CheckColorContrastCategory) => void
  handleLevelChange?: (level: CheckColorContrastLevel) => void
  handleShowColorContrast?: () => void
  level?: CheckColorContrastLevel
  selectedElementType?: "text" | "graphics"
  showColorContrast?: boolean
  standard?: boolean
}

export interface RecommendedPoint {
  slX: number
  // 饱和度 (0-1)
  slY: number
  x: number
  y: number // 亮度/明度 (0-1)
}

export interface BezierCurveSegment {
  // 起点
  cp1: [number, number]
  // 控制点1
  cp2: [number, number]
  // 控制点2
  end: [number, number]
  start: [number, number] // 终点
}

export interface BoundaryInfo {
  // 简化/自适应后的点
  bezierSegments: BezierCurveSegment[]
  points: [number, number][]
  // 原始采样点
  simplifiedPoints: [number, number][] // 拟合的贝塞尔曲线段
}

export interface BoundaryCalculationResult {
  lowerBoundary: BoundaryInfo | null
  // 上边界（可能没有）
  threshold: number
  // 下边界（可能没有）
  upperBoundary: BoundaryInfo | null // 当前使用的对比度阈值
}

export type PaletteType =
  | "Slate"
  | "Red"
  | "Pink"
  | "Purple"
  | "Blue"
  | "Green"
  | "Brown"
  | "Orange"
  | "Yellow"
  | "Sky"
