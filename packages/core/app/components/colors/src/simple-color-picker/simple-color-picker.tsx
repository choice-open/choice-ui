import { forwardRef, useMemo } from "react"
import { SolidPaintAlphaSlider } from "../color-solid-paint/solid-paint-alpha-slider"
import { SolidPaintHueSlider } from "../color-solid-paint/solid-paint-hue-slider"
import { ChannelFieldSpace, ColorChannelLabels, PaintState, RGB, SolidPaintFeature } from "../types"
import { SolidPaintChannelField } from "../color-solid-paint/solid-paint-channel-field"
import { SolidPaintArea } from "../color-solid-paint/solid-paint-area"
import { COLOR_SPACES } from "../contents"
import { ColorSolidPaintTv } from "../color-solid-paint/tv"
import { usePaintState, useRgbColorHandler } from "../hooks"

type SimpleColorPickerProps = {
  alpha?: number
  className?: string
  color?: RGB
  colorAreaClassName?: string
  colorSpace?: ChannelFieldSpace
  features?: SolidPaintFeature
  labels?: ColorChannelLabels
  onAlphaChange?: (alpha: number) => void
  onChangeEnd?: () => void
  onChangeStart?: () => void
  onColorChange?: (color: RGB) => void
  onColorSpaceChange?: (colorSpace: ChannelFieldSpace) => void
}

export const SimpleColorPicker = forwardRef<HTMLDivElement, SimpleColorPickerProps>(
  function ColorSolidPaint(props, ref) {
    const {
      className,
      colorAreaClassName,
      color = { r: 250, g: 250, b: 250 },
      alpha: opacity = 1,
      onColorChange,
      onAlphaChange,
      onChangeStart,
      onChangeEnd,
      colorSpace = COLOR_SPACES.RGB,
      onColorSpaceChange,
      features: featureProps = {},
    } = props

    const isColorSpaceControlled = onColorSpaceChange !== undefined

    // 使用自定义 hooks 管理颜色状态
    const { paintState, setPaintState, updateSourceRef } = usePaintState({ color })
    const { handleRgbChange } = useRgbColorHandler({
      paintState,
      setPaintState,
      updateSourceRef,
      colorSpace,
      onColorChange,
    })

    const features: SolidPaintFeature = {
      containerWidth: 240,
      presets: true,
      spaceDropdown: isColorSpaceControlled,
      alpha: true,
      hex: true,
      rgb: true,
      hsl: true,
      hsb: true,
      ...featureProps,
    }

    const sliderTrackSize = useMemo(() => {
      const getPadding = () => {
        let padding = 0
        padding += 32
        return padding
      }
      return {
        width: 240 - getPadding(),
        height: 16,
      }
    }, [])

    const styles = ColorSolidPaintTv({
      alpha: true,
      nativePicker: false,
      presets: false,
    })

    const containerWidth = features?.containerWidth ?? 240

    return (
      <div
        ref={ref}
        className={className}
        style={{ width: containerWidth }}
      >
        <SolidPaintArea
          paintState={paintState}
          setPaintState={(newState: PaintState) => {
            setPaintState(newState)
          }}
          colorSpace={colorSpace}
          rgbColor={color}
          onColorChange={onColorChange}
          containerWidth={containerWidth}
          updateSourceRef={updateSourceRef}
          onChangeStart={onChangeStart}
          onChangeEnd={onChangeEnd}
          className={colorAreaClassName}
        />

        <div
          className={styles.sliderContainer()}
          style={{ width: containerWidth }}
        >
          <SolidPaintHueSlider
            hue={paintState.h}
            setHue={(newHue) => {
              const newPaintState = { ...paintState, h: newHue }
              setPaintState(newPaintState)
            }}
            color={color}
            onColorChange={onColorChange}
            onChangeStart={onChangeStart}
            onChangeEnd={onChangeEnd}
            onChange={onChangeEnd}
            type="hue"
            trackSize={sliderTrackSize}
            updateSourceRef={updateSourceRef}
          />

          <SolidPaintAlphaSlider
            hue={paintState.h}
            alpha={opacity}
            onAlphaChange={onAlphaChange}
            type="alpha"
            trackSize={sliderTrackSize}
            onChangeStart={onChangeStart}
            onChangeEnd={onChangeEnd}
          />
        </div>

        <SolidPaintChannelField
          paintState={paintState}
          setPaintState={(newState) => {
            setPaintState(newState)
          }}
          colorSpace={colorSpace}
          setColorSpace={onColorSpaceChange}
          updateSourceRef={updateSourceRef}
          rgb={color}
          alpha={opacity}
          onAlphaChange={onAlphaChange}
          onAlphaChangeEnd={onChangeEnd}
          onAlphaChangeStart={onChangeStart}
          onColorChange={handleRgbChange}
          className={styles.channelField()}
          features={features}
        />
      </div>
    )
  },
)
