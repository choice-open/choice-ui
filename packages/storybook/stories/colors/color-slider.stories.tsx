import { ColorSlider, ColorsProvider, ColorSwatch, hslToRgb } from "@choice-ui/react"
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
    }, [huePosition, saturationPosition, lightnessPosition])

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

/**
 * The ColorSlider supports a compound component pattern for advanced customization.
 *
 * ### Available Subcomponents
 *
 * - `ColorSlider.Thumb` - The draggable thumb handle
 * - `ColorSlider.Track` - The track background (optional, for custom height or styling)
 *
 * ### Custom Styling
 *
 * Use `className` on subcomponents to customize their appearance:
 *
 * ```tsx
 * <ColorSlider type="hue" position={position} onChange={setPosition}>
 *   <ColorSlider.Thumb className="!bg-white !shadow-xs" />
 * </ColorSlider>
 * ```
 */
export const Compound: Story = {
  render: function CompoundStory() {
    const [huePosition, setHuePosition] = useState(0.5)
    const [alphaPosition, setAlphaPosition] = useState(0.8)

    return (
      <ColorsProvider>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-secondary-foreground font-strong">
              Solid White Thumb
            </span>
            <ColorSlider
              type="hue"
              position={huePosition}
              onChange={setHuePosition}
            >
              <ColorSlider.Thumb className="!shadow-xs !bg-white" />
            </ColorSlider>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-secondary-foreground font-strong">
              Border Style Thumb
            </span>
            <ColorSlider
              type="alpha"
              hue={huePosition * 360}
              position={alphaPosition}
              onChange={setAlphaPosition}
            >
              <ColorSlider.Thumb className="border-2 border-white !shadow-none" />
            </ColorSlider>
          </div>

          <div className="text-secondary-foreground text-sm">
            <div>Hue: {Math.round(huePosition * 360)}°</div>
            <div>Alpha: {Math.round(alphaPosition * 100)}%</div>
          </div>
        </div>
      </ColorsProvider>
    )
  },
}

/**
 * Custom sized slider using the compound component pattern.
 *
 * ### Size Customization
 *
 * - `ColorSlider.Track` - Use `height` prop to set track height
 * - `ColorSlider.Thumb` - Use `size` prop to set thumb size (defaults to track height)
 * - Additional styling can be applied via `className`
 *
 * Note: When `ColorSlider.Thumb` size is not specified, it defaults to the track height.
 */
export const CustomSize: Story = {
  render: function CustomSizeStory() {
    const [position1, setPosition1] = useState(0.3)
    const [position2, setPosition2] = useState(0.6)
    const [position3, setPosition3] = useState(0.9)

    return (
      <ColorsProvider>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-secondary-foreground font-strong">
              Slim Style (Track: 4px, Thumb: 10px)
            </span>
            <ColorSlider
              type="hue"
              position={position1}
              onChange={setPosition1}
              width={200}
            >
              <ColorSlider.Track
                height={4}
                className="!shadow-none"
              />
              <ColorSlider.Thumb
                size={10}
                className="!shadow-xs h-2 w-3.5 rounded-sm !bg-white"
              />
            </ColorSlider>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-secondary-foreground font-strong">
              Default (Track: 16px, Thumb: 16px)
            </span>
            <ColorSlider
              type="hue"
              position={position2}
              onChange={setPosition2}
            >
              <ColorSlider.Thumb />
            </ColorSlider>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-secondary-foreground font-strong">
              Large (Track: 24px, Thumb: 24px)
            </span>
            <ColorSlider
              type="hue"
              position={position3}
              onChange={setPosition3}
              width={300}
            >
              <ColorSlider.Track height={24} />
              <ColorSlider.Thumb />
            </ColorSlider>
          </div>
        </div>
      </ColorsProvider>
    )
  },
}

/**
 * Auto width using container width.
 *
 * When `width` is not provided or set to `false`, the slider will
 * automatically calculate its width from the container.
 */
export const AutoWidth: Story = {
  render: function AutoWidthStory() {
    const [position, setPosition] = useState(0.5)

    return (
      <ColorsProvider>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-secondary-foreground font-strong">
              Auto Width (fills container)
            </span>
            <div className="w-64">
              <ColorSlider
                type="hue"
                position={position}
                onChange={setPosition}
                width={false}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-secondary-foreground font-strong">Responsive Width</span>
            <div className="w-full max-w-md">
              <ColorSlider
                type="saturation"
                hue={position * 360}
                position={0.7}
                onChange={() => {}}
                width={false}
              />
            </div>
          </div>
        </div>
      </ColorsProvider>
    )
  },
}
