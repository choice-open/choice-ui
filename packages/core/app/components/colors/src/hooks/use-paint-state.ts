import { useEffect, useRef, useState } from "react"
import tinycolor from "tinycolor2"
import type { PaintState, RGB } from "../types/colors"
import type { ColorUpdateSource } from "../types/paint"

interface UsePaintStateOptions {
  color: RGB
}

interface UsePaintStateReturn {
  paintState: PaintState
  setPaintState: (state: PaintState) => void
  updateSourceRef: React.MutableRefObject<ColorUpdateSource>
}

/**
 * 管理颜色的绘制状态，包括 HSL、HSV 等颜色空间的值
 * 当外部颜色变化时，自动同步内部状态
 */
export function usePaintState(options: UsePaintStateOptions): UsePaintStateReturn {
  const { color } = options

  const updateSourceRef = useRef<ColorUpdateSource>("external")

  const [paintState, setPaintState] = useState<PaintState>({
    h: 0,
    hsl_s: 0,
    l: 0,
    hsv_s: 0,
    v: 0,
  })

  useEffect(() => {
    if (updateSourceRef.current !== "external") return

    const tc = tinycolor(color)
    const hsl = tc.toHsl()
    const hsv = tc.toHsv()

    setPaintState((prev) => {
      // 如果新的 hue 与旧的 hue 非常接近（差异 < 1），保持旧的 hue 值不变
      // 这是为了避免 RGB<->HSL 转换精度问题导致 hue 微小变化，进而触发边界曲线重新计算
      const newHue = Math.abs(hsl.h - prev.h) < 1 ? prev.h : hsl.h

      return {
        h: newHue,
        hsl_s: hsl.s,
        l: hsl.l,
        hsv_s: hsv.s,
        v: hsv.v,
      }
    })
  }, [color])

  return {
    paintState,
    setPaintState,
    updateSourceRef,
  }
}
