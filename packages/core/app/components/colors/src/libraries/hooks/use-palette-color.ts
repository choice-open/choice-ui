import { CSSProperties, useMemo } from "react"
import tinycolor from "tinycolor2"
import type { PaintStyle, RGB, RGBA, Style, Variable } from "../../types"
import { getColorArr } from "../../utils"
import type { LibrariesType } from "../../types"

interface PaletteColor {
  alpha: number
  color: RGB
}

interface PaletteStyle extends CSSProperties {
  "--color": string
}

interface UsePaletteColorOptions {
  item: Variable | Style
  libraryType: LibrariesType
}

interface UsePaletteColorResult {
  paletteColor: PaletteColor
  paletteStyle: PaletteStyle
}

export function usePaletteColor({
  item,
  libraryType,
}: UsePaletteColorOptions): UsePaletteColorResult {
  // 计算调色板颜色
  const paletteColor = useMemo<PaletteColor>(() => {
    try {
      let color: RGB | RGBA = { r: 0, g: 0, b: 0 }
      if (libraryType === "VARIABLE") {
        color = (item as Variable).value as RGB
      } else {
        const firstFill = (item as PaintStyle).fills[0]
        if (firstFill.type === "SOLID") {
          color = firstFill.color as RGB
        }
      }

      return getColorArr(color as RGB | RGBA) || { color: { r: 0, g: 0, b: 0 }, alpha: 1 }
    } catch {
      return { color: { r: 0, g: 0, b: 0 }, alpha: 1 }
    }
  }, [libraryType, item])

  // 计算调色板样式
  const paletteStyle = useMemo<PaletteStyle>(() => {
    return {
      "--color": tinycolor({
        r: paletteColor.color.r,
        g: paletteColor.color.g,
        b: paletteColor.color.b,
        a: 0.5,
      }).toRgbString(),
    } as PaletteStyle
  }, [paletteColor])

  return {
    paletteColor,
    paletteStyle,
  }
}
