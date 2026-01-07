import { useMemo } from "react"
import tinycolor from "tinycolor2"
import { useEventCallback } from "usehooks-ts"
import { ColorChannelField, ColorChannelFieldProps } from "../color-channel-field"
import { COLOR_SPACES } from "../contents"
import type { ChannelFieldSpace, HSB, HSL, PaintState, RGB } from "../types/colors"
import type { ColorChannelLabels, ColorUpdateSource } from "../types/paint"
import { isEdgeValue } from "../utils/position"

type Props = {
  alpha: number
  className: string
  colorSpace?: ChannelFieldSpace
  labels?: ColorChannelLabels
  onAlphaChange?: (value: number) => void
  onAlphaChangeEnd?: () => void
  onAlphaChangeStart?: () => void
  onColorChange?: (color: RGB) => void
  paintState: PaintState
  rgb: RGB
  setColorSpace?: (colorSpace: ChannelFieldSpace) => void
  setPaintState: (state: PaintState) => void
  updateSourceRef: React.MutableRefObject<ColorUpdateSource>
} & Pick<ColorChannelFieldProps, "className" | "features">

export const SolidPaintChannelField = (props: Props) => {
  const {
    paintState,
    setPaintState,
    colorSpace,
    setColorSpace,
    rgb,
    onColorChange,
    alpha,
    onAlphaChange,
    onAlphaChangeEnd,
    onAlphaChangeStart,
    updateSourceRef,
    labels,
    ...rest
  } = props

  const { h, hsl_s, l, hsv_s, v } = paintState

  const { hsl, hsb } = useMemo(() => {
    const isHsl = colorSpace === COLOR_SPACES.HSL

    // 正常情况下的颜色转换
    const tc = isHsl ? tinycolor({ h, s: hsl_s, l }) : tinycolor({ h, s: hsv_s, v })

    const { r, g, b } = tc.toRgb()
    const rgb = { r, g, b }
    const { h: h_hsl, s: s_hsl_out, l: l_hsl } = tc.toHsl()
    const hsl = { h: h_hsl, s: s_hsl_out, l: l_hsl }
    const hsb = { h, s: hsv_s, b: v }

    // 在 HSL 模式下处理边缘值
    if (isHsl) {
      // 如果是亮度边缘值，保持原来的色相和饱和度
      if (isEdgeValue(l)) {
        return {
          hsl: {
            h,
            s: hsl_s,
            l: l < 0.5 ? 0 : 1,
          },
          hsb,
        }
      }

      // 如果是饱和度为 0，保持原来的色相
      if (isEdgeValue(hsl.s)) {
        return {
          hsl: {
            h,
            s: hsl.s,
            l: hsl.l,
          },
          hsb,
        }
      }
    }

    // 检查是否是灰度值
    const isGrayscale = rgb.r === rgb.g && rgb.g === rgb.b
    if (isGrayscale && !isEdgeValue(l)) {
      // 只在非边缘亮度值时处理灰度
      return {
        hsl: {
          h,
          s: hsl.s,
          l: hsl.l,
        },
        hsb,
      }
    }

    return {
      hsl,
      hsb,
    }
  }, [colorSpace, h, hsl_s, hsv_s, l, v])

  const handleHslChange = useEventCallback((hsl: HSL) => {
    const color = tinycolor(hsl)
    const prev = { ...paintState }
    const updates = { ...prev }

    updates.h = isEdgeValue(hsl.s) ? prev.h : hsl.h
    updates.hsl_s = hsl.s
    updates.l = hsl.l

    if (hsl.l === 0) {
      updates.v = 0
    } else if (hsl.l === 1 && hsl.s === 0) {
      updates.hsv_s = 0
      updates.v = 1
    } else {
      const hsv = color.toHsv()
      updates.hsv_s = hsv.s
      updates.v = hsv.v
    }

    setPaintState(updates)
    updateSourceRef.current = "internal"

    const rgbColor = color.toRgb()
    onColorChange?.(rgbColor)

    setTimeout(() => {
      updateSourceRef.current = "external"
    }, 0)
  })

  const handleHsbChange = useEventCallback((hsb: HSB) => {
    const color = tinycolor({
      h: hsb.h,
      s: hsb.s,
      v: hsb.b,
    })
    const prev = { ...paintState }
    const updates = { ...prev }

    updates.h = isEdgeValue(hsb.s) ? prev.h : hsb.h
    updates.hsv_s = hsb.s
    updates.v = hsb.b

    if (hsb.b === 0) {
      updates.l = 0
    } else if (hsb.b === 1 && hsb.s === 0) {
      updates.hsl_s = 0
      updates.l = 1
    } else {
      const hsl = color.toHsl()
      updates.hsl_s = hsl.s
      updates.l = hsl.l
    }

    setPaintState(updates)
    updateSourceRef.current = "internal"

    const rgbColor = color.toRgb()
    onColorChange?.(rgbColor)

    setTimeout(() => {
      updateSourceRef.current = "external"
    }, 0)
  })

  return (
    <ColorChannelField
      colorSpace={colorSpace}
      onChangeColorSpace={setColorSpace}
      hsl={hsl}
      hsb={hsb}
      rgb={rgb}
      alpha={alpha}
      onHslChange={handleHslChange}
      onRgbChange={onColorChange}
      onHsbChange={handleHsbChange}
      onAlphaChange={onAlphaChange}
      onAlphaChangeEnd={onAlphaChangeEnd}
      onAlphaChangeStart={onAlphaChangeStart}
      labels={labels}
      {...rest}
    />
  )
}
