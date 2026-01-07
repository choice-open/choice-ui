import { NumericInput, type NumericInputProps } from "@choice-ui/numeric-input"
import { round } from "es-toolkit"
import { memo } from "react"
import { COLOR_SPACES, translation } from "../contents"
import { AlphaInput } from "../fill-input/alpha-input"
import { HexInput } from "../hex-input"
import type { ChannelFieldFeature, ChannelFieldSpace, HSB, HSL, RGB } from "../types/colors"
import type { ColorChannelLabels } from "../types/paint"
import { ColorChannelInputTv } from "./tv"

interface ColorChannelInputProps {
  alpha?: number
  colorSpace: ChannelFieldSpace
  disabled?: boolean
  features?: ChannelFieldFeature
  hsb?: HSB
  hsl?: HSL
  labels?: ColorChannelLabels
  onAlphaChange?: (value: number) => void
  onAlphaChangeEnd?: () => void
  onAlphaChangeStart?: () => void
  onHsbChange?: (hsb: HSB) => void
  onHslChange?: (hsl: HSL) => void
  onRgbChange?: (rgb: RGB) => void
  rgb?: RGB
}

interface ChannelInputProps extends Omit<NumericInputProps, "onChange"> {
  onChange?: (value: number) => void
}

const ChannelInput = memo((props: ChannelInputProps) => {
  const { value, onChange, ...rest } = props

  const styles = ColorChannelInputTv({})

  return (
    <NumericInput
      classNames={{
        container: styles.numeric(),
        input: styles.numericInput(),
      }}
      variant="reset"
      value={value}
      onChange={(value) => onChange?.(value as number)}
      {...rest}
    />
  )
})

ChannelInput.displayName = "ChannelInput"

export const ColorChannelInput = (props: ColorChannelInputProps) => {
  const {
    colorSpace,
    disabled,
    rgb,
    hsl,
    hsb,
    alpha,
    onAlphaChange,
    onAlphaChangeEnd,
    onAlphaChangeStart,
    onRgbChange,
    onHslChange,
    onHsbChange,
    features = {
      alpha: true,
      hex: true,
      rgb: true,
      hsl: true,
      hsb: true,
    },
    labels = {
      alpha: translation.channels.ALPHA,
      red: translation.channels.RED,
      green: translation.channels.GREEN,
      blue: translation.channels.BLUE,
      hue: translation.channels.HUE,
      brightness: translation.channels.BRIGHTNESS,
      saturation: translation.channels.SATURATION,
      lightness: translation.channels.LIGHTNESS,
    },
  } = props

  const styles = ColorChannelInputTv({ alpha: features.alpha })

  switch (colorSpace) {
    case COLOR_SPACES.HEX:
      return features.hex ? (
        <div className={styles.container({ variant: "hex" })}>
          <HexInput
            className={styles.hexInput()}
            value={rgb}
            onChange={onRgbChange}
            disabled={disabled}
            onAlphaChange={onAlphaChange}
          />
          {features.alpha && (
            <AlphaInput
              className="[grid-area:input-2]"
              value={alpha ?? 1}
              onChange={(value) => onAlphaChange?.(value)}
              onPressEnd={onAlphaChangeEnd}
              onPressStart={onAlphaChangeStart}
              disabled={disabled}
              tooltipLabel={labels.alpha}
            />
          )}
        </div>
      ) : null
    case COLOR_SPACES.RGB:
      return features.rgb && rgb ? (
        <div className={styles.container({ variant: "default" })}>
          {Object.entries(rgb).map(([key, value], index) => {
            const channelLabels = {
              r: labels.red,
              g: labels.green,
              b: labels.blue,
            }
            return (
              <ChannelInput
                tooltip={{
                  content: channelLabels[key as keyof typeof channelLabels],
                }}
                className={`[grid-area:input-${index + 1}]`}
                key={key}
                value={value}
                onChange={(value) => onRgbChange?.({ ...rgb, [key]: value })}
                min={0}
                max={255}
                disabled={disabled}
              />
            )
          })}
          {features.alpha && (
            <AlphaInput
              className="[grid-area:input-4]"
              value={alpha ?? 1}
              onChange={(value) => onAlphaChange?.(value)}
              onPressEnd={onAlphaChangeEnd}
              onPressStart={onAlphaChangeStart}
              disabled={disabled}
              tooltipLabel={labels.alpha}
            />
          )}
        </div>
      ) : null
    case COLOR_SPACES.HSL:
      return features.hsl && hsl ? (
        <div className={styles.container({ variant: "default" })}>
          <ChannelInput
            tooltip={{
              content: labels.hue,
            }}
            className="[grid-area:input-1]"
            value={round(hsl.h, 0)}
            onChange={(value) => {
              onHslChange?.({
                ...hsl,
                h: value as number,
              })
            }}
            min={0}
            max={360}
            disabled={disabled}
          />
          <ChannelInput
            tooltip={{
              content: labels.saturation,
            }}
            className="[grid-area:input-2]"
            value={round(hsl.s * 100, 0)}
            onChange={(value) =>
              onHslChange?.({
                ...hsl,
                s: value / 100,
              })
            }
            min={0}
            max={100}
            disabled={disabled}
          />
          <ChannelInput
            tooltip={{
              content: labels.lightness,
            }}
            className="[grid-area:input-3]"
            value={round(hsl.l * 100, 0)}
            onChange={(value) =>
              onHslChange?.({
                ...hsl,
                l: value / 100,
              })
            }
            min={0}
            max={100}
            disabled={disabled}
          />
          {features.alpha && (
            <AlphaInput
              className="[grid-area:input-4]"
              value={alpha ?? 1}
              onChange={(value) => onAlphaChange?.(value)}
              onPressEnd={onAlphaChangeEnd}
              onPressStart={onAlphaChangeStart}
              disabled={disabled}
              tooltipLabel={labels.alpha}
            />
          )}
        </div>
      ) : null
    case COLOR_SPACES.HSB:
      return features.hsb && hsb ? (
        <div className={styles.container({ variant: "default" })}>
          <ChannelInput
            tooltip={{
              content: labels.hue,
            }}
            className="[grid-area:input-1]"
            value={round(hsb.h, 0)}
            onChange={(value) => {
              onHsbChange?.({ ...hsb, h: value as number })
            }}
            min={0}
            max={360}
            disabled={disabled}
          />
          <ChannelInput
            tooltip={{
              content: labels.saturation,
            }}
            className="[grid-area:input-2]"
            value={round(hsb.s * 100, 0)}
            onChange={(value) => {
              onHsbChange?.({ ...hsb, s: value / 100 })
            }}
            min={0}
            max={100}
            disabled={disabled}
          />
          <ChannelInput
            tooltip={{
              content: labels.brightness,
            }}
            className="[grid-area:input-3]"
            value={round(hsb.b * 100, 0)}
            onChange={(value) => {
              onHsbChange?.({ ...hsb, b: value / 100 })
            }}
            min={0}
            max={100}
            disabled={disabled}
          />
          {features.alpha && (
            <AlphaInput
              className="[grid-area:input-4]"
              value={alpha ?? 1}
              onChange={(value) => onAlphaChange?.(value)}
              onPressEnd={onAlphaChangeEnd}
              onPressStart={onAlphaChangeStart}
              disabled={disabled}
              tooltipLabel={labels.alpha}
            />
          )}
        </div>
      ) : null
    default:
      return null
  }
}
