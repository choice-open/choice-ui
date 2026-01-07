//#endregion

import type { PaletteType, RGB, RGBA, Transform } from "../types/colors"

//#region  <--  Colors  -->

export const PAGE_BACKGROUND_LIGHT: RGBA = {
  r: 245,
  g: 245,
  b: 245,
  a: 1,
}
export const PAGE_BACKGROUND_DARK: RGBA = {
  r: 26,
  g: 26,
  b: 26,
  a: 1,
}

export const PRIMARY: RGB = {
  r: 0,
  g: 87,
  b: 255,
}

export const PRIMARY_RGBA: RGBA = {
  r: 0,
  g: 87,
  b: 255,
  a: 1,
}

export const COLOR_SWATCH_INNER_SIZE = 14
export const COLOR_SWATCH_SIZE = 16

export const SELECTION_COLORS_PREVIEW_ITEMS = 3

export const PRIMARY_COLOR = "#0d99ff"
export const COMPONENT_COLOR = "#8638e5"
export const AI_COLOR = "#14ae5c"
export const MAGENTA_COLOR = "#ff00ff"
export const GRAY_COLOR = "#a3a3a3"

export const SNAP_COLOR = "#ff3100"

export const DEFAULT_COLOR: RGB = { r: 0, g: 85, b: 255 }
export const DEFAULT_ALPHA = 1

export const DEFAULT_GRADIENT_TRANSFORM: Transform = [
  [1, 0, 0],
  [0, 1, 0],
]

export const WHITE: RGB = {
  r: 255,
  g: 255,
  b: 255,
}

export const WHITE_RGBA: RGBA = {
  r: 255,
  g: 255,
  b: 255,
  a: 1,
}

export const GRAY: RGB = {
  r: 217,
  g: 217,
  b: 217,
}

export const GRAY_RGBA: RGBA = {
  r: 217,
  g: 217,
  b: 217,
  a: 1,
}

export const BLACK_RGBA: RGBA = {
  r: 0,
  g: 0,
  b: 0,
  a: 1,
}

export const BLACK: RGB = {
  r: 0,
  g: 0,
  b: 0,
}

export const SEMI_TRANSPARENT_BLACK: RGBA = {
  r: 0,
  g: 0,
  b: 0,
  a: 0.2,
}

//#region 新建节点的颜色数组

export const SLATE_COLORS: RGB[] = [
  { r: 249, g: 249, b: 251 },
  { r: 232, g: 232, b: 236 },
  { r: 217, g: 217, b: 224 },
  { r: 185, g: 187, b: 198 },
  { r: 128, g: 131, b: 141 },
  { r: 28, g: 32, b: 36 },
]

export const RED_COLORS: RGB[] = [
  { r: 255, g: 247, b: 247 },
  { r: 255, g: 219, b: 220 },
  { r: 253, g: 189, b: 190 },
  { r: 235, g: 142, b: 144 },
  { r: 220, g: 62, b: 66 },
  { r: 100, g: 23, b: 35 },
]

export const PINK_COLORS: RGB[] = [
  { r: 254, g: 247, b: 251 },
  { r: 251, g: 220, b: 239 },
  { r: 239, g: 191, b: 221 },
  { r: 221, g: 147, b: 194 },
  { r: 207, g: 56, b: 151 },
  { r: 101, g: 18, b: 73 },
]

export const PURPLE_COLORS: RGB[] = [
  { r: 251, g: 247, b: 254 },
  { r: 242, g: 226, b: 252 },
  { r: 224, g: 196, b: 244 },
  { r: 190, g: 147, b: 228 },
  { r: 131, g: 71, b: 185 },
  { r: 64, g: 32, b: 96 },
]

export const BLUE_COLORS: RGB[] = [
  { r: 244, g: 250, b: 255 },
  { r: 213, g: 239, b: 255 },
  { r: 172, g: 216, b: 252 },
  { r: 94, g: 177, b: 239 },
  { r: 5, g: 136, b: 240 },
  { r: 17, g: 50, b: 100 },
]

export const GREEN_COLORS: RGB[] = [
  { r: 244, g: 251, b: 246 },
  { r: 214, g: 241, b: 223 },
  { r: 173, g: 221, b: 192 },
  { r: 91, g: 185, b: 139 },
  { r: 43, g: 154, b: 102 },
  { r: 25, g: 59, b: 45 },
]

export const BROWN_COLORS: RGB[] = [
  { r: 252, g: 249, b: 246 },
  { r: 240, g: 228, b: 217 },
  { r: 228, g: 205, b: 183 },
  { r: 206, g: 163, b: 126 },
  { r: 160, g: 117, b: 83 },
  { r: 62, g: 51, b: 46 },
]

export const ORANGE_COLORS: RGB[] = [
  { r: 255, g: 247, b: 237 },
  { r: 255, g: 223, b: 181 },
  { r: 255, g: 193, b: 130 },
  { r: 236, g: 148, b: 85 },
  { r: 239, g: 95, b: 0 },
  { r: 88, g: 45, b: 29 },
]

export const YELLOW_COLORS: RGB[] = [
  { r: 254, g: 252, b: 233 },
  { r: 255, g: 243, b: 148 },
  { r: 243, g: 215, b: 104 },
  { r: 213, g: 174, b: 57 },
  { r: 255, g: 220, b: 0 },
  { r: 71, g: 59, b: 31 },
]

export const SKY_COLORS: RGB[] = [
  { r: 241, g: 250, b: 253 },
  { r: 209, g: 240, b: 250 },
  { r: 169, g: 218, b: 237 },
  { r: 96, g: 179, b: 215 },
  { r: 116, g: 218, b: 248 },
  { r: 29, g: 62, b: 86 },
]

export const DEFAULT_COLORS: Array<{
  colors: RGB[]
  id: PaletteType
}> = [
  { id: "Slate", colors: SLATE_COLORS },
  { id: "Red", colors: RED_COLORS },
  { id: "Pink", colors: PINK_COLORS },
  { id: "Purple", colors: PURPLE_COLORS },
  { id: "Blue", colors: BLUE_COLORS },
  { id: "Green", colors: GREEN_COLORS },
  { id: "Brown", colors: BROWN_COLORS },
  { id: "Orange", colors: ORANGE_COLORS },
  { id: "Yellow", colors: YELLOW_COLORS },
  { id: "Sky", colors: SKY_COLORS },
]

//#endregion

/** 网格颜色 */
export const GRID_COLOR = "hsla(0, 0%, 0%, 0.1)"

/** 默认的边框颜色 */
export const DEFAULT_BORDER_COLOR: RGB = {
  r: 0,
  g: 0,
  b: 0,
}
