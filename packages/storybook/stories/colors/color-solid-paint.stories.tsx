import type { ChannelFieldSpace, RGB, SolidPaintFeature } from "@choice-ui/react"
import { Checkbox, ColorSolidPaint, ColorSwatch, Popover, Segmented } from "@choice-ui/react"
import { faker } from "@faker-js/faker"
import { Meta, StoryObj } from "@storybook/react"
import { round } from "es-toolkit"
import React, { useState } from "react"
import { useEventCallback } from "usehooks-ts"

const meta: Meta<typeof ColorSolidPaint> = {
  title: "Colors/Paint/ColorSolidPaint",
  component: ColorSolidPaint,
}

export default meta

type Story = StoryObj<typeof ColorSolidPaint>

const PRESET_COLORS: { alpha: number; color: RGB }[] = Array.from({ length: 20 }, () => ({
  color: {
    r: faker.number.int({ min: 0, max: 255 }),
    g: faker.number.int({ min: 0, max: 255 }),
    b: faker.number.int({ min: 0, max: 255 }),
  },
  alpha: faker.number.float({ min: 0, max: 1, precision: 0.01 }),
}))

const SolidString = ({ color, alpha }: { alpha: number; color: RGB }) => {
  return (
    <div className="z-10 min-w-0 rounded-lg bg-white/50 p-3 text-center font-mono">
      rgba({color.r} {color.g} {color.b} / {round(alpha, 2)})
    </div>
  )
}

const SolidBackground = ({ color, alpha }: { alpha: number; color: RGB }) => {
  return (
    <ColorSwatch
      color={color}
      alpha={alpha}
      size={32}
      className="ignore size-full! absolute inset-0"
    />
  )
}

const PresetColors = ({
  handleSolidChange,
}: {
  handleSolidChange: (solid: RGB, alpha: number) => void
}) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(14px,1fr))] items-center gap-2 border-t px-3 pt-3">
      {PRESET_COLORS.map((mock, index) => (
        <ColorSwatch
          key={index}
          color={mock.color}
          alpha={mock.alpha}
          size={16}
          className="rounded-md"
          onClick={() => handleSolidChange(mock.color, mock.alpha)}
        />
      ))}
    </div>
  )
}

const SolidPopover = ({ children }: { children: React.ReactNode }) => {
  return (
    <Popover
      open={true}
      placement="left"
      draggable
      rememberPosition
      outsidePressIgnore="ignore"
    >
      <Popover.Trigger>
        <div className="right-1/10 pointer-events-none absolute" />
      </Popover.Trigger>
      <Popover.Header title="Solid Paint" />

      <Popover.Content className="pb-4 pt-0">{children}</Popover.Content>
    </Popover>
  )
}

const FeaturesController = ({
  features,
  setFeatures,
  handleSolidChange,
}: {
  features: SolidPaintFeature
  handleSolidChange: (solid: RGB, alpha: number) => void
  setFeatures: (features: SolidPaintFeature) => void
}) => {
  const [presets, setPresets] = useState("standard")

  return (
    <div className="bg-default-background z-10 flex flex-col rounded-xl shadow-lg">
      <div className="text-body-medium-strong flex h-10 items-center pl-4 pr-2">
        Features Controller
      </div>
      <div className="flex flex-col gap-2 px-3 pb-3">
        <Segmented
          value={presets}
          onChange={(value) => {
            setPresets(value)
            setFeatures({
              ...features,
              ...(value === "basic"
                ? {
                    presets: false,
                    spaceDropdown: false,
                    alpha: false,
                    nativePicker: false,
                  }
                : value === "standard"
                  ? {
                      presets: false,
                      spaceDropdown: true,
                      alpha: true,
                      nativePicker: true,
                    }
                  : {
                      presets: true,
                      spaceDropdown: true,
                      alpha: true,
                      nativePicker: true,
                    }),
            })
          }}
        >
          <Segmented.Item
            className="px-2"
            value="basic"
          >
            Basic
          </Segmented.Item>
          <Segmented.Item
            className="px-2"
            value="standard"
          >
            Standard
          </Segmented.Item>
          <Segmented.Item
            className="px-2"
            value="advanced"
          >
            Advanced
          </Segmented.Item>
        </Segmented>
        <Checkbox
          value={features.presets}
          onChange={(checked) => setFeatures({ ...features, presets: checked })}
        >
          <Checkbox.Label>Presets</Checkbox.Label>
        </Checkbox>
        <Checkbox
          value={features.nativePicker}
          onChange={(checked) => setFeatures({ ...features, nativePicker: checked })}
        >
          <Checkbox.Label>Native Picker</Checkbox.Label>
        </Checkbox>
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
              label="Hex"
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
    </div>
  )
}

/**
 * `ColorSolidPaint` is a comprehensive color picker component that provides a rich set of features
 * for color selection and manipulation.
 *
 * ### Key Features
 * - Interactive color area for visual color selection
 * - Hue and alpha sliders for precise adjustments
 * - Multiple color space support (HEX, RGB, HSL, HSB)
 * - Native color picker integration
 * - Color variable library integration
 * - Responsive layout with three size presets
 *
 * ### Component Structure
 * The component is composed of several sub-components:
 * - `ColorArea`: Main color selection area with saturation/brightness or saturation/lightness
 * - `ColorSlider`: Sliders for hue and alpha adjustment
 * - `ColorChannelField`: Input fields for different color spaces
 * - `ColorNativePicker`: Integration with native color picker
 * - `LibraryColorSwatch`: Color variable library integration
 *
 * ### Props
 * - `color`: Current RGB color value
 * - `alpha`: Current opacity value (0-1)
 * - `onColorChange`: Callback when color changes
 * - `onAlphaChange`: Callback when opacity changes
 * - `onLibraryChange`: Callback when a library color is selected
 * - `category`: Current category in library view
 * - `onCategoryChange`: Callback when category changes
 * - `features`: Feature configuration object
 *
 * ### Features Configuration
 * ```typescript
 * {
 *   containerWidth?: number;    // Component width (220, 240, or 256)
 *   presets?: boolean;         // Show color presets
 *   spaceDropdown?: boolean;   // Enable color space switching
 *   alpha?: boolean;           // Show alpha slider
 *   hex?: boolean;            // Enable HEX color space
 *   rgb?: boolean;            // Enable RGB color space
 *   hsl?: boolean;            // Enable HSL color space
 *   hsb?: boolean;            // Enable HSB color space
 *   nativePicker?: boolean;   // Show native color picker
 * }
 * ```
 *
 */
export const Basic: Story = {
  render: function BasicStory() {
    const [color, setColor] = useState<RGB>({ r: 0, g: 85, b: 255 })
    const [alpha, setAlpha] = useState<number>(1)
    const [colorSpace, setColorSpace] = useState<ChannelFieldSpace>("hex")

    const [features, setFeatures] = useState<SolidPaintFeature>({
      alpha: true,
      spaceDropdown: true,
      hex: true,
      rgb: true,
      hsl: true,
      hsb: true,
      presets: true,
      nativePicker: true,
    })

    const handleSolidChange = useEventCallback((color: RGB, alpha: number) => {
      setColor(color)
      setAlpha(alpha)
    })

    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <SolidBackground
          color={color}
          alpha={alpha}
        />

        <div className="grid grid-cols-2 place-items-start gap-4">
          <div className="bg-default-background z-10 flex flex-col rounded-xl pb-4 shadow-lg">
            <div className="text-body-medium-strong flex h-10 items-center pl-4 pr-2">
              Color Solid Paint
            </div>
            <ColorSolidPaint
              colorSpace={colorSpace}
              onColorSpaceChange={(newColorSpace) => {
                setColorSpace(newColorSpace)
              }}
              color={color}
              alpha={alpha}
              onColorChange={setColor}
              onAlphaChange={setAlpha}
              features={features}
            />
            {features.presets && <PresetColors handleSolidChange={handleSolidChange} />}
          </div>
          <FeaturesController
            features={features}
            setFeatures={setFeatures}
            handleSolidChange={handleSolidChange}
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
