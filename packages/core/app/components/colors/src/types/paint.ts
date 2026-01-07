import { Vector } from "./base"
import type { ColorStop, RGB, Transform } from "./colors"

export interface SolidPaint {
  readonly color: RGB
  readonly opacity: number
  readonly type: "SOLID"
  readonly visible?: boolean
}

export interface GradientPaint {
  readonly gradientStops: Array<ColorStop>
  readonly gradientTransform: Transform
  readonly opacity?: number
  readonly type: GradientPaintType
  readonly visible?: boolean
}

export interface ImagePaint {
  readonly filters?: ImageFilters
  readonly imageHash: string | null
  readonly imageSizes: ImageSizes
  readonly imageTransform?: Transform
  readonly opacity?: number
  readonly rotation?: number
  readonly scaleMode: ImageScaleMode
  readonly scalingFactor?: number
  readonly type: "IMAGE"
  readonly visible?: boolean
}

export interface ImageFilters {
  readonly contrast?: number
  readonly exposure?: number
  readonly saturation?: number
  readonly temperature?: number
  readonly tint?: number
  // readonly highlights?: number
  // readonly shadows?: number
}

export interface PatternPaint {
  readonly horizontalAlignment: "START" | "CENTER" | "END"
  readonly scalingFactor: number
  readonly sourceNodeId: string
  readonly spacing: Vector
  readonly tileType: "RECTANGULAR" | "HORIZONTAL_HEXAGONAL" | "VERTICAL_HEXAGONAL"
  readonly type: "PATTERN"
}

export interface ImageSizes {
  // 长边 3840px
  raw: string
  // 长边 512px
  regular: string
  // 长边 64px
  small: string
  // 原始图片
  sourceSize: {
    height: number
    width: number
  }
  thumb: string
}

export type ImageScaleMode = "FILL" | "FIT" | "CROP" | "TILE"

export type Paint = SolidPaint | GradientPaint | ImagePaint | PatternPaint

export type PaintType = Paint["type"]

export type GradientPaintType = "GRADIENT_LINEAR" | "GRADIENT_RADIAL" | "GRADIENT_ANGULAR"

export type TextPaint = SolidPaint

export type ColorUpdateSource = "external" | "internal"

export interface SolidPaintLabels {
  alpha: string
  blue: string
  brightness: string
  custom?: string
  green: string
  hue: string
  lightness: string
  pickerColor?: string
  red: string
  saturation: string
}

export interface ColorChannelLabels {
  alpha: string
  blue: string
  brightness: string
  green: string
  hue: string
  lightness: string
  red: string
  saturation: string
}

export interface GradientLabels {
  addStopLabel: string
  alpha: string
  conic: string
  delete: string
  flipGradient: string
  linear: string
  position: string
  radial: string
  rotateGradient: string
  stopsTitle: string
  title: string
}

export interface GradientControlLabels {
  addStopLabel: string
  alpha: string
  delete: string
  position: string
  title: string
}

export interface GradientListLabels {
  alpha: string
  delete: string
  position: string
}

export interface GradientToolbarLabels {
  conic: string
  flipGradient: string
  linear: string
  radial: string
  rotateGradient: string
}

export interface PaintTypeLabels {
  colorContrast?: string
  gradient?: string
  image?: string
  pattern?: string
  solid?: string
}

export interface ColorPickerLabels {
  custom?: string
  gradient?: string
  image?: string
  pattern?: string
  solid?: string
}

export interface ColorContrastLabels {
  contrastSettings?: string
  notMeetStandard?: string
  viewColorValues?: string
}

export interface FillItemLabels {
  alpha: string
}

export interface GradientFillLabels extends FillItemLabels {
  conic: string
  linear: string
  radial: string
}
