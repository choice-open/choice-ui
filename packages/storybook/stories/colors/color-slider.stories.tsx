import { ColorSlider, ColorSwatch, hslToRgb } from "@choice-ui/react"
import { Meta, StoryObj } from "@storybook/react"
import { useMemo, useState } from "react"

const meta: Meta<typeof ColorSlider> = {
  title: "Colors/ColorSlider",
  component: ColorSlider,
}

export default meta

type Story = StoryObj<typeof ColorSlider>

/**
 * `ColorSlider` is a slider component for adjusting color properties.
 *
 * ### Slider Types
 *
 * - **Hue**: Ranges from 0 to 360, representing the color wheel
 * - **Saturation**: Ranges from 0 to 1, representing the intensity of the color
 * - **Lightness**: Ranges from 0 to 1, representing lightness of the color
 * - **Alpha**: Ranges from 0 to 1, representing the opacity of the color
 *
 * ### Key Properties
 *
 * - `type`: The type of slider ("hue" | "saturation" | "lightness" | "alpha")
 * - `position`: Current position value (0-1 for saturation/lightness/alpha, 0-360 mapped to 0-1 for hue)
 * - `onChange`: Callback when position changes
 * - `hue`: Hue value for saturation/lightness/alpha sliders to show correct gradient
 */
export const Basic: Story = {
  render: function BasicStory() {
    const [huePosition, setHuePosition] = useState(0.5)
    const [saturationPosition, setSaturationPosition] = useState(0.5)
    const [lightnessPosition, setLightnessPosition] = useState(0.5)
    const [alphaPosition, setAlphaPosition] = useState(1)

    const color = useMemo(() => {
      return hslToRgb({
        h: (huePosition * 360) % 360,
        s: saturationPosition * 100,
        l: lightnessPosition * 100,
      })
    }, [huePosition, saturationPosition, lightnessPosition, alphaPosition])

    const options = [
      {
        type: "hue",
        position: huePosition,
        onChange: setHuePosition,
      },
      {
        type: "saturation",
        hue: (huePosition * 360) % 360,
        position: saturationPosition,
        onChange: setSaturationPosition,
      },
      {
        type: "lightness",
        hue: (huePosition * 360) % 360,
        position: lightnessPosition,
        onChange: setLightnessPosition,
      },
      {
        type: "alpha",
        hue: (huePosition * 360) % 360,
        position: alphaPosition,
        onChange: setAlphaPosition,
      },
    ]

    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          {options.map((option) => (
            <div
              key={option.type}
              className="flex flex-col gap-2"
            >
              <span className="text-secondary-foreground font-strong capitalize">
                {option.type}
              </span>
              <ColorSlider
                hue={option.hue}
                position={option.position}
                onChange={option.onChange}
                type={option.type as "hue" | "saturation" | "lightness" | "alpha"}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <ColorSwatch
            className="rounded-md"
            color={color}
            alpha={alphaPosition}
            size={32}
          />
          <div className="text-secondary-foreground flex flex-col gap-1">
            <div>Position: {huePosition.toFixed(2)}</div>
            <div>rgb: {`rgb(${color.r}, ${color.g}, ${color.b}, ${alphaPosition.toFixed(2)})`}</div>
            <div>
              display-p3:{" "}
              {`color(display-p3 ${(color.r / 255).toFixed(2)} ${(color.g / 255).toFixed(
                2,
              )} ${(color.b / 255).toFixed(2)} / ${alphaPosition.toFixed(2)})`}
            </div>
          </div>
        </div>
      </div>
    )
  },
}
