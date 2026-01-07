import { useMemo } from "react"
import tinycolor from "tinycolor2"
import { useEventCallback } from "usehooks-ts"
import { ColorArea } from "../color-area"
import { COLOR_SPACES } from "../contents"
import { Vector } from "../types/base"
import type { ChannelFieldSpace, PaintState, RGB } from "../types/colors"
import type { ColorUpdateSource } from "../types/paint"
import { rgbaToRgb } from "../utils/colors-convert"
import { isEdgeValue } from "../utils/position"

type Props = {
  children?: React.ReactNode
  className?: string
  colorSpace: ChannelFieldSpace
  containerWidth?: number
  onChangeEnd?: () => void
  onChangeStart?: () => void
  onColorChange?: (rgb: RGB) => void
  paintState: PaintState
  rgbColor: RGB
  setPaintState: (state: PaintState) => void

  updateSourceRef: React.MutableRefObject<ColorUpdateSource>
}

export const SolidPaintArea = (props: Props) => {
  const {
    paintState,
    setPaintState,
    colorSpace,
    rgbColor,
    containerWidth = 240,
    className,
    onColorChange,
    onChangeEnd,
    onChangeStart,
    children,
    updateSourceRef,
  } = props

  const { h, hsl_s, l, hsv_s, v } = paintState

  const type = useMemo(() => {
    if (colorSpace === COLOR_SPACES.HSL) {
      return "saturation-lightness"
    } else {
      return "saturation-brightness"
    }
  }, [colorSpace])

  const areaSize = useMemo(
    () => ({
      width: containerWidth,
      height: containerWidth,
    }),
    [containerWidth],
  )

  const position = useMemo(() => {
    if (colorSpace === COLOR_SPACES.HSL) {
      return {
        x: hsl_s,
        y: l,
      }
    } else {
      return {
        x: hsv_s,
        y: v,
      }
    }
  }, [colorSpace, hsl_s, hsv_s, l, v])

  const handleAreaChange = useEventCallback((position: Vector) => {
    const { x, y } = position

    const isHsl = colorSpace === COLOR_SPACES.HSL

    const prevState = { ...paintState }
    const updates = { ...prevState }

    let newColor: tinycolor.Instance | null = null
    if (isHsl) {
      updates.hsl_s = x

      if (isEdgeValue(y)) {
        const isBlack = y < 0.5

        const l = isBlack ? 0 : 1

        updates.l = l
        updates.v = isBlack ? 0 : 1
        updates.hsv_s = x

        newColor = tinycolor({
          h,
          s: x,
          l,
        })
      } else {
        updates.l = y

        newColor = tinycolor({
          h,
          s: x,
          l: y,
        })
        const hsv = newColor.toHsv()
        updates.hsv_s = hsv.s
        updates.v = hsv.v
      }
    } else {
      updates.hsv_s = x

      if (isEdgeValue(y)) {
        const isBlack = y < 0.5
        const v = isBlack ? 0 : 1

        updates.v = v
        updates.l = isBlack ? 0 : 1

        newColor = tinycolor({
          h,
          s: x,
          v,
        })
      } else {
        updates.v = y
        newColor = tinycolor({
          h,
          s: x,
          v: y,
        })
        const hsl = newColor.toHsl()
        updates.hsl_s = hsl.s
        updates.l = hsl.l
      }
    }

    setPaintState(updates)
    updateSourceRef.current = "internal"

    const rgbColor = rgbaToRgb(newColor.toRgb())
    onColorChange?.(rgbColor)
  })

  return (
    <ColorArea
      position={position}
      onChange={handleAreaChange}
      type={type}
      hue={h}
      thumbColor={rgbColor}
      areaSize={areaSize}
      className={className}
      onChangeStart={onChangeStart}
      onChangeEnd={() => {
        onChangeEnd?.()
        updateSourceRef.current = "external"
      }}
    >
      {children}
    </ColorArea>
  )
}
