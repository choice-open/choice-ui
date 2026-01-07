import type { ChannelFieldFeature, ChannelFieldSpace, RGB } from "@choice-ui/react"
import {
  Checkbox,
  COLOR_SPACES,
  ColorChannelField,
  ColorSwatch,
  hsbToRgb,
  hslToRgb,
  Popover,
  rgbToHsb,
  rgbToHsl,
} from "@choice-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import { round } from "es-toolkit"
import React, { useState } from "react"
import tinycolor from "tinycolor2"

const meta: Meta<typeof ColorChannelField> = {
  title: "Colors/ColorChannelField",
  component: ColorChannelField,
}

export default meta

type Story = StoryObj<typeof ColorChannelField>

/**
 * The `SolidString` component is a string representation of the color and its alpha value.
 */
const SolidString = ({ color, alpha }: { alpha: number; color: RGB }) => {
  const hex = tinycolor(color).toHexString()
  const hsl = tinycolor(color).toHsl()
  const hsb = tinycolor(color).toHsv()
  return (
    <div className="z-10 min-w-0 rounded-lg bg-white/50 p-3 text-center font-mono">
      <span>{hex}</span>
      <span> / </span>
      <span>
        rgba({color.r} {color.g} {color.b} / {round(alpha, 2)})
      </span>
      <span> / </span>
      <span>
        hsla({round(hsl.h, 0)} {round(hsl.s * 100, 0)}% {round(hsl.l * 100, 0)}% / {round(alpha, 2)}
        )
      </span>
      <span> / </span>
      <span>
        hsb({round(hsb.h, 0)} {round(hsb.s * 100, 0)}% {round(hsb.v * 100, 0)}% / {round(alpha, 2)})
      </span>
    </div>
  )
}

const SolidBackground = ({ color, alpha }: { alpha: number; color: RGB }) => {
  return (
    <ColorSwatch
      color={color}
      alpha={alpha}
      size={32}
      className="size-full! absolute inset-0"
    />
  )
}

/**
 * The `FeaturesController` component is a controller for the `ColorChannelField` component.
 */
const FeaturesController = ({
  features,
  setFeatures,
}: {
  features: ChannelFieldFeature
  setFeatures: (features: ChannelFieldFeature) => void
}) => {
  return (
    <div className="mt-4 flex flex-col gap-2">
      <Checkbox
        value={features.spaceDropdown}
        onChange={(checked) => setFeatures({ ...features, spaceDropdown: checked })}
      >
        <Checkbox.Label>Space Dropdown</Checkbox.Label>
      </Checkbox>
      <Checkbox
        value={features.alpha}
        onChange={(checked) => setFeatures({ ...features, alpha: checked })}
      >
        <Checkbox.Label>Alpha</Checkbox.Label>
      </Checkbox>
      {features.spaceDropdown && (
        <>
          <Checkbox
            value={features.hex}
            onChange={(checked) => setFeatures({ ...features, hex: checked })}
          >
            <Checkbox.Label>Hex</Checkbox.Label>
          </Checkbox>
          <Checkbox
            value={features.rgb}
            onChange={(checked) => setFeatures({ ...features, rgb: checked })}
          >
            <Checkbox.Label>RGB</Checkbox.Label>
          </Checkbox>
          <Checkbox
            value={features.hsl}
            onChange={(checked) => setFeatures({ ...features, hsl: checked })}
          >
            <Checkbox.Label>HSL</Checkbox.Label>
          </Checkbox>
          <Checkbox
            value={features.hsb}
            onChange={(checked) => setFeatures({ ...features, hsb: checked })}
          >
            <Checkbox.Label>HSB</Checkbox.Label>
          </Checkbox>
        </>
      )}
    </div>
  )
}

/**
 * The `ChannelFieldPopover` component is a popover that contains the `ColorChannelField` component.
 */
const ChannelFieldPopover = ({ children }: { children: React.ReactNode }) => {
  return (
    <Popover
      open={true}
      placement="left"
      draggable
      rememberPosition
    >
      <Popover.Trigger>
        <div className="pointer-events-none absolute right-1/2" />
      </Popover.Trigger>

      <Popover.Header title="Channel Field" />

      <Popover.Content className="w-60 p-4">{children}</Popover.Content>
    </Popover>
  )
}

/**
 * The `ColorChannelField` component is a versatile color input field that supports multiple color space formats
 * and provides precise control over color values through individual channel inputs.
 *
 * ### Features
 * - Multiple color space support: HEX, RGB, HSL, HSB
 * - Alpha channel control
 * - Color space switching via dropdown
 * - Individual channel value inputs
 * - Configurable feature toggles
 *
 * ### Usage Guidelines
 * 1. **Color Space Management**
 *    - Use `colorSpace` prop to control the active color format
 *    - Set `defaultColorSpace` for initial format
 *    - Handle format changes via `onChangeColorSpace`
 *
 * 2. **Color Value Control**
 *    - Provide color values in multiple formats (rgb, hsl, hsb)
 *    - Use corresponding change handlers (onRgbChange, onHslChange, onHsbChange)
 *    - Control alpha transparency with `alpha` prop and `onAlphaChange`
 *
 * 3. **Feature Configuration**
 *    - Toggle available features through the `features` prop:
 *      ```ts
 *      {
 *        alpha: boolean        // Enable alpha channel input
 *        spaceDropdown: boolean // Show color space dropdown
 *        hex: boolean         // Enable HEX format
 *        rgb: boolean         // Enable RGB format
 *        hsl: boolean         // Enable HSL format
 *        hsb: boolean         // Enable HSB format
 *      }
 *      ```
 *
 * ### Best Practices
 * - Always provide all color format values to ensure smooth format switching
 * - Implement all change handlers to maintain color synchronization
 * - Consider user needs when configuring available features
 * - Use with color conversion utilities for accurate color representation
 */

/**
 * Basic
 */
export const Basic: Story = {
  render: function BasicStory() {
    const [color, setColor] = useState<RGB>({ r: 0, g: 85, b: 255 })
    const [alpha, setAlpha] = useState<number>(1)
    const [colorSpace, setColorSpace] = useState<ChannelFieldSpace>(COLOR_SPACES.HEX)

    const [features, setFeatures] = useState<ChannelFieldFeature>({
      alpha: true,
      spaceDropdown: true,
      hex: true,
      rgb: true,
      hsl: true,
      hsb: true,
    })

    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <SolidBackground
          color={color}
          alpha={alpha}
        />

        <div className="bg-default-background z-10 flex w-80 flex-col rounded-xl p-4 shadow-lg">
          <ColorChannelField
            features={features}
            rgb={color}
            hsl={rgbToHsl(color)}
            hsb={rgbToHsb(color)}
            alpha={alpha}
            onRgbChange={setColor}
            onHslChange={(hsl) => setColor(hslToRgb(hsl))}
            onHsbChange={(hsb) => setColor(hsbToRgb(hsb))}
            onAlphaChange={setAlpha}
            colorSpace={colorSpace}
            onChangeColorSpace={setColorSpace}
          />

          <FeaturesController
            features={features}
            setFeatures={setFeatures}
          />
        </div>

        <SolidString
          color={color}
          alpha={alpha}
        />
      </div>
    )
  },
}
