import { ColorSlider, ColorSwatch, hslToRgb, useColors } from "@choice-ui/react"
import { Meta, StoryObj } from "@storybook/react"
import { useMemo, useState } from "react"

const meta: Meta<typeof ColorSlider> = {
  title: "Colors/ColorSlider",
  component: ColorSlider,
}

export default meta

type Story = StoryObj<typeof ColorSlider>

export const Basic: Story = {
  render: function BasicStory() {
    const [huePosition, setHuePosition] = useState(0.5)
    const [saturationPosition, setSaturationPosition] = useState(0.5)
    const [lightnessPosition, setLightnessPosition] = useState(0.5)
    const [alphaPosition, setAlphaPosition] = useState(1)

    const { colorProfile } = useColors()

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
        <ul className="flex flex-col gap-2 rounded-md border p-4">
          <li>
            <b>Hue</b>: The hue property ranges from 0 to 360, representing the color wheel.
          </li>
          <li>
            <b>Saturation</b>: The saturation property ranges from 0 to 1, representing the
            intensity of the color.
          </li>
          <li>
            <b>Lightness</b>: The lightness property ranges from 0 to 1, representing lightness of
            the color.
          </li>
          <li>
            <b>Alpha</b>: The alpha property ranges from 0 to 1, representing the opacity of the
            color.
          </li>
        </ul>

        <div className="grid grid-cols-2 gap-4">
          {options.map((option) => (
            <div
              key={option.type}
              className="flex flex-col gap-2"
            >
              <span className="text-secondary-foreground font-strong capitalize">
                {option.type} / {option.position.toFixed(2)}
              </span>
              <div className="flex items-center gap-2">
                <ColorSlider
                  hue={option.hue}
                  position={option.position}
                  onChange={option.onChange}
                  type={option.type as "hue" | "saturation" | "lightness" | "alpha"}
                />
              </div>
            </div>
          ))}
          <ColorSwatch
            className="rounded-md"
            color={color}
            alpha={alphaPosition}
            size={32}
          />
        </div>
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
    )
  },
}
