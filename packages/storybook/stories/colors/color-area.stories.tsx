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
 * The ColorArea component is a 2D color selection surface that visualizes two color dimensions:
 *
 * - Horizontal axis: Usually represents saturation (0-100%)
 * - Vertical axis: Can represent either lightness or brightness (0-100%)
 *
 * This interactive example shows both modes side by side, with synchronized positions.
 */
export const Basic: Story = {
  render: function BasicStory() {
    const [position, setPosition] = useState({ x: 0.5, y: 0.5 })
    const [huePosition, setHuePosition] = useState(0.55) // ~200° in the hue wheel

    // Convert hue position (0-1) to degrees (0-360)
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
          <div className="flex flex-col gap-2">
            <h3 className="font-strong">Saturation-Lightness (HSL)</h3>
            <p className="text-secondary-foreground text-body-small">
              The HSL model is more intuitive for some color selections. Lightness represents the
              brightness relative to white (top) and black (bottom).
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-strong">Saturation-Brightness (HSB/HSV)</h3>
            <p className="text-secondary-foreground text-body-small">
              The HSB model (also called HSV) is useful for selecting vibrant colors. Brightness
              represents intensity from maximum (top) to black (bottom).
            </p>
          </div>

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

          <div className="flex flex-col gap-2">
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
          </div>

          <div className="text-secondary-foreground text-body-small">
            Position: x: {position.x.toFixed(2)}, y: {position.y.toFixed(2)}
          </div>

          <div className="text-secondary-foreground text-body-small">
            HEX: {tinycolor(brightness).toHexString()}
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
              trackSize={{ width: 200, height: 16 }}
            />
          </div>
        </div>

        <div className="rounded-md border p-4">
          <ul className="flex flex-col gap-2">
            <li>
              <b className="font-strong">Color Area</b>: A 2D surface for selecting saturation and
              lightness/brightness values
            </li>
            <li>
              <b className="font-strong">Position</b>: The x,y coordinates (0-1) that determine the
              selected color
            </li>
            <li>
              <b className="font-strong">Hue</b>: The base color (0-360) applied to the color area
            </li>
            <li>
              <b className="font-strong">Types</b>:
              <ul className="ml-6 mt-1">
                <li>
                  • saturation-lightness: X axis is saturation, Y axis is lightness (HSL model)
                </li>
                <li>
                  • saturation-brightness: X axis is saturation, Y axis is brightness (HSB/HSV
                  model)
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    )
  },
}

/**
 * This example demonstrates different size configurations and how ColorArea
 * can be used in color picker interfaces with varying dimensions.
 */
export const Sizes: Story = {
  render: function SizesStory() {
    const [position, setPosition] = useState({ x: 0.5, y: 0.5 })
    const [huePosition, setHuePosition] = useState(0.75) // ~270° Purple hue
    const hue = Math.round((huePosition * 360) % 360)

    const rgbColor = useMemo(() => {
      const { h, s, l } = positionToAreaColor(position, "saturation-lightness", hue) as HSL
      return tinycolor({ h, s, l }).toRgb()
    }, [position, hue])

    return (
      <div className="flex flex-col items-start gap-6">
        <div className="flex gap-6">
          <div className="flex flex-col items-center gap-2">
            <h3 className="font-strong">Small (150×150)</h3>
            <ColorArea
              position={position}
              onChange={setPosition}
              hue={hue}
              thumbColor={rgbColor}
              type="saturation-lightness"
              areaSize={{ width: 150, height: 150 }}
            />
            <span className="text-secondary-foreground text-body-small">Compact UI</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <h3 className="font-strong">Medium (220×220)</h3>
            <ColorArea
              position={position}
              onChange={setPosition}
              hue={hue}
              thumbColor={rgbColor}
              type="saturation-lightness"
              areaSize={{ width: 220, height: 220 }}
            />
            <span className="text-secondary-foreground text-body-small">Standard size</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <h3 className="font-strong">Large (300×200)</h3>
            <ColorArea
              position={position}
              onChange={setPosition}
              hue={hue}
              thumbColor={rgbColor}
              type="saturation-lightness"
              areaSize={{ width: 300, height: 200 }}
            />
            <span className="text-secondary-foreground text-body-small">Custom dimensions</span>
          </div>
        </div>

        <div className="flex max-w-md flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-strong">Adjust Hue</span>
            <span className="text-secondary-foreground text-body-small">{hue}°</span>
          </div>
          <ColorSlider
            type="hue"
            position={huePosition}
            onChange={setHuePosition}
          />
        </div>

        <div className="flex items-start justify-center gap-4">
          <ColorSwatch
            color={rgbColor}
            size={48}
            className="rounded-md"
          />
          <div>
            <div className="font-strong">Selected Color</div>
            <div className="text-secondary-foreground text-body-small">
              RGB: {rgbColor.r}, {rgbColor.g}, {rgbColor.b}
            </div>
            <div className="text-secondary-foreground text-body-small">
              HEX: {tinycolor(rgbColor).toHexString()}
            </div>
          </div>
        </div>

        <div className="rounded-md border p-4">
          <p>
            The ColorArea component can be configured with different sizes to fit various UI
            requirements. The{" "}
            <code className="bg-secondary-background rounded px-1 py-0.5 font-mono">areaSize</code>{" "}
            prop accepts width and height values in pixels.
          </p>
        </div>
      </div>
    )
  },
}
