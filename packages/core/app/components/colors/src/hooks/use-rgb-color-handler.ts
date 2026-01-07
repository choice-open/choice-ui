import tinycolor from "tinycolor2"
import { useEventCallback } from "usehooks-ts"
import { COLOR_SPACES } from "../contents"
import type { ChannelFieldSpace, PaintState, RGB } from "../types/colors"
import type { ColorUpdateSource } from "../types/paint"
import { isEdgeValue } from "../utils/position"

interface UseRgbColorHandlerOptions {
  paintState: PaintState
  setPaintState: (state: PaintState) => void
  updateSourceRef: React.MutableRefObject<ColorUpdateSource>
  colorSpace: ChannelFieldSpace
  onColorChange?: (color: RGB) => void
}

interface UseRgbColorHandlerReturn {
  handleRgbChange: (rgb: RGB) => void
}

/**
 * 处理 RGB 颜色变化的逻辑，包括：
 * - 验证 RGB 值
 * - 根据颜色空间更新绘制状态
 * - 处理灰度和边界值的特殊情况
 * - 触发颜色变化回调
 */
export function useRgbColorHandler(options: UseRgbColorHandlerOptions): UseRgbColorHandlerReturn {
  const { paintState, setPaintState, updateSourceRef, colorSpace, onColorChange } = options

  const handleRgbChange = useEventCallback((rgb: RGB) => {
    if (isNaN(rgb.r) || isNaN(rgb.g) || isNaN(rgb.b)) return

    const isHsl = colorSpace === COLOR_SPACES.HSL
    const colorInstance = tinycolor(rgb)
    const hsl = colorInstance.toHsl()
    const hsv = colorInstance.toHsv()
    const prev = { ...paintState }
    const isGrayscale = rgb.r === rgb.g && rgb.g === rgb.b
    const updates: PaintState = { ...prev }

    if (isHsl) {
      if (isGrayscale || isEdgeValue(hsl.s)) {
        if (isEdgeValue(hsl.l)) {
          updates.h = prev.h
          updates.hsl_s = prev.hsl_s
          updates.l = hsl.l
          updates.hsv_s = hsv.s
          updates.v = hsv.v
        } else {
          updates.h = prev.h
          updates.hsl_s = hsl.s
          updates.l = hsl.l
          updates.hsv_s = hsv.s
          updates.v = hsv.v
        }
      } else {
        updates.h = hsl.h
        updates.hsl_s = hsl.s
        updates.l = hsl.l
        updates.hsv_s = hsv.s
        updates.v = hsv.v
      }
    } else {
      updates.h = isGrayscale || isEdgeValue(hsv.s) ? prev.h : hsv.h
      updates.hsv_s = hsv.s
      updates.v = hsv.v
      updates.hsl_s = hsl.s
      updates.l = hsl.l
    }

    setPaintState(updates)
    updateSourceRef.current = "internal"

    onColorChange?.(rgb)

    setTimeout(() => {
      updateSourceRef.current = "external"
    }, 0)
  })

  return {
    handleRgbChange,
  }
}
