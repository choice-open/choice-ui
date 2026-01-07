import { Select } from "@choice-ui/select"
import { tcx } from "@choice-ui/shared"
import { forwardRef, memo, useMemo } from "react"
import { useEventCallback } from "usehooks-ts"
import { COLOR_SPACE_OPTIONS, COLOR_SPACES, translation } from "../contents"
import { useChannelFieldFeatures } from "../hooks"
import type { ChannelFieldFeature, ChannelFieldSpace, HSB, HSL, RGB } from "../types/colors"
import type { ColorChannelLabels } from "../types/paint"
import { ColorChannelInput } from "./color-channel-input"
import { ColorChannelFieldTv } from "./tv"

export interface ColorChannelFieldProps {
  alpha?: number
  className?: string
  colorSpace?: ChannelFieldSpace
  defaultColorSpace?: ChannelFieldSpace
  disabled?: boolean
  features?: ChannelFieldFeature
  hsb?: HSB
  hsl?: HSL
  labels?: ColorChannelLabels
  onAlphaChange?: (alpha: number) => void
  onAlphaChangeEnd?: () => void
  onAlphaChangeStart?: () => void
  onChangeColorSpace?: (colorSpace: ChannelFieldSpace) => void
  onHsbChange?: (hsb: HSB) => void
  onHslChange?: (hsl: HSL) => void
  onRgbChange?: (rgb: RGB) => void
  rgb?: RGB
}

export const ColorChannelField = memo(
  forwardRef<HTMLDivElement, ColorChannelFieldProps>(function ColorChannelField(props, ref) {
    const {
      hsl,
      rgb,
      hsb,
      alpha,
      defaultColorSpace = COLOR_SPACES.HEX,
      colorSpace,
      onChangeColorSpace,
      onHslChange,
      onRgbChange,
      onHsbChange,
      onAlphaChange,
      onAlphaChangeEnd,
      onAlphaChangeStart,
      className,
      disabled,
      features: userFeatures = {},
      labels,
    } = props

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const features: ChannelFieldFeature = {
      alpha: true,
      spaceDropdown: true,
      hex: true,
      rgb: true,
      hsl: true,
      hsb: true,
      ...userFeatures,
    }

    const handleAlphaChange = useEventCallback((value: number) => {
      onAlphaChange?.(value)
    })

    const spacesAvailable = useChannelFieldFeatures({
      features,
      colorSpace,
      onChangeColorSpace,
      onAlphaChange,
    })

    const styles = ColorChannelFieldTv({
      spacesAvailable,
      spaceDropdown: features.spaceDropdown,
    })

    const spaceOptions = useMemo(() => {
      return COLOR_SPACE_OPTIONS.filter((option) => features[option.value])
    }, [features])

    return (
      <div
        ref={ref}
        className={tcx(styles.container(), className)}
      >
        {spacesAvailable ? (
          <>
            <ColorChannelInput
              colorSpace={colorSpace ?? defaultColorSpace}
              alpha={alpha}
              disabled={disabled}
              rgb={rgb}
              hsl={hsl}
              hsb={hsb}
              onAlphaChange={handleAlphaChange}
              onAlphaChangeEnd={onAlphaChangeEnd}
              onAlphaChangeStart={onAlphaChangeStart}
              onRgbChange={onRgbChange}
              onHslChange={onHslChange}
              onHsbChange={onHsbChange}
              features={features}
              labels={labels}
            />
            {features.spaceDropdown && (
              <Select
                value={colorSpace}
                onChange={(value) => onChangeColorSpace?.(value as ChannelFieldSpace)}
                disabled={disabled}
              >
                <Select.Trigger>
                  <span className="flex-1 truncate">
                    {COLOR_SPACE_OPTIONS.find((option) => option.value === colorSpace)?.label}
                  </span>
                </Select.Trigger>

                <Select.Content className="min-w-24">
                  {spaceOptions.map((option) => (
                    <Select.Item
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            )}
          </>
        ) : (
          translation.channelField.EMPTY
        )}
      </div>
    )
  }),
)

ColorChannelField.displayName = "ColorChannelField"
