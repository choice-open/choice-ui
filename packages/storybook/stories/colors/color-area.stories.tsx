import {
  ColorArea,
  ColorSlider,
  ColorSwatch,
  HSB,
  HSL,
  positionToAreaColor,
} from "@choice-ui/react"
import { Meta, StoryObj } from "@storybook/react"
import { useMemo, useState } from "react"
import tinycolor from "tinycolor2"

const meta: Meta<typeof ColorArea> = {
  title: "Colors/ColorArea",
  component: ColorArea,
  parameters: {
    docs: {
      description: {
        component: `
The ColorArea component provides a 2D color selection surface that allows users to select colors
by specifying saturation and lightness/brightness values in a visual interface. It is a key
building block for creating color pickers and color selection tools in design applications.
        `,
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof ColorArea>

/**
 * `ColorArea` is a 2D color selection surface that visualizes two color dimensions.
 *
 * ### Axes
 *
 * - **Horizontal (X)**: Saturation (0-100%)
 * - **Vertical (Y)**: Lightness or Brightness (0-100%)
 *
 * ### Types
 *
 * - `saturation-lightness`: HSL model - Lightness from white (top) to black (bottom)
 * - `saturation-brightness`: HSB/HSV model - Brightness from maximum (top) to black (bottom)
 *
 * ### Key Properties
 *
 * - `position`: x,y coordinates (0-1) that determine the selected color
 * - `hue`: Base color (0-360) applied to the color area
 * - `thumbColor`: RGB color for the selection thumb
 * - `areaSize`: Width and height in pixels
 */
export const Basic: Story = {
  render: function BasicStory() {
    const [position, setPosition] = useState({ x: 0.5, y: 0.5 })
    const [huePosition, setHuePosition] = useState(0.55)

    const hue = useMemo(() => Math.round((huePosition * 360) % 360), [huePosition])

    const lightness = useMemo(() => {
      const { h, s, l } = positionToAreaColor(position, "saturation-lightness", hue) as HSL
      return tinycolor({ h, s, l }).toRgb()
    }, [position, hue])

    const brightness = useMemo(() => {
      const { h, s, b } = positionToAreaColor(position, "saturation-brightness", hue) as HSB
      return tinycolor({ h, s, v: b }).toRgb()
    }, [position, hue])

    return (
      <div className="w-md flex flex-col gap-6">
        <div className="grid grid-cols-[repeat(2,200px)] gap-x-8 gap-y-4">
          <h3 className="font-strong">Saturation-Lightness (HSL)</h3>
          <h3 className="font-strong">Saturation-Brightness (HSB/HSV)</h3>

          <ColorArea
            position={position}
            onChange={setPosition}
            hue={hue}
            thumbColor={lightness}
            type="saturation-lightness"
            areaSize={{ width: 200, height: 200 }}
          />
          <ColorArea
            position={position}
            onChange={setPosition}
            hue={hue}
            thumbColor={brightness}
            type="saturation-brightness"
            areaSize={{ width: 200, height: 200 }}
          />

          <div className="flex items-center gap-2">
            <ColorSwatch
              color={lightness}
              size={24}
              className="rounded-md"
            />
            <div className="bg-secondary-background text-body-small grid grid-cols-3 items-center gap-2 rounded-md px-2 py-1">
              <span>R: {lightness.r}</span>
              <span>G: {lightness.g}</span>
              <span>B: {lightness.b}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ColorSwatch
              color={brightness}
              size={24}
              className="rounded-md"
            />
            <div className="bg-secondary-background text-body-small grid grid-cols-3 items-center gap-2 rounded-md px-2 py-1">
              <span>R: {brightness.r}</span>
              <span>G: {brightness.g}</span>
              <span>B: {brightness.b}</span>
            </div>
          </div>

          <div className="flex max-w-md flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="font-strong">Hue: {hue}°</label>
              <ColorSwatch
                color={tinycolor({ h: hue, s: 100, l: 50 }).toRgb()}
                size={20}
                className="rounded-sm"
              />
            </div>
            <ColorSlider
              type="hue"
              position={huePosition}
              onChange={setHuePosition}
              width={200}
            />
          </div>
        </div>
      </div>
    )
  },
}

/**
 * The `areaSize` prop accepts width and height values in pixels to configure different dimensions.
 */
export const Sizes: Story = {
  render: function SizesStory() {
    const [position, setPosition] = useState({ x: 0.5, y: 0.5 })
    const [huePosition, setHuePosition] = useState(0.75)
    const hue = Math.round((huePosition * 360) % 360)

    const rgbColor = useMemo(() => {
      const { h, s, l } = positionToAreaColor(position, "saturation-lightness", hue) as HSL
      return tinycolor({ h, s, l }).toRgb()
    }, [position, hue])

    return (
      <div className="flex flex-col items-start gap-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col items-center gap-2">
            <h3 className="font-strong">150×150</h3>
            <ColorArea
              position={position}
              onChange={setPosition}
              hue={hue}
              thumbColor={rgbColor}
              type="saturation-lightness"
              areaSize={{ width: 150, height: 150 }}
            />
          </div>

          <div className="flex flex-col items-center gap-2">
            <h3 className="font-strong">220×220</h3>
            <ColorArea
              position={position}
              onChange={setPosition}
              hue={hue}
              thumbColor={rgbColor}
              type="saturation-lightness"
              areaSize={{ width: 220, height: 220 }}
            />
          </div>

          <div className="flex flex-col items-center gap-2">
            <h3 className="font-strong">300×200</h3>
            <ColorArea
              position={position}
              onChange={setPosition}
              hue={hue}
              thumbColor={rgbColor}
              type="saturation-lightness"
              areaSize={{ width: 300, height: 200 }}
            />
          </div>
        </div>

        <div className="flex max-w-md flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-strong">Hue: {hue}°</span>
          </div>
          <ColorSlider
            type="hue"
            position={huePosition}
            onChange={setHuePosition}
          />
        </div>

        <div className="flex items-center gap-4">
          <ColorSwatch
            color={rgbColor}
            size={48}
            className="rounded-md"
          />
          <div className="text-secondary-foreground text-body-small">
            RGB: {rgbColor.r}, {rgbColor.g}, {rgbColor.b} | HEX: {tinycolor(rgbColor).toHexString()}
          </div>
        </div>
      </div>
    )
  },
}
