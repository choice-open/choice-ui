import type { ChannelFieldSpace, RGB } from "@choice-ui/react"
import { COLOR_SPACES, SimpleColorPicker } from "@choice-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"

const meta = {
  title: "Colors/SimpleColorPicker",
  component: SimpleColorPicker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    colorSpace: {
      control: { type: "select" },
      options: Object.values(COLOR_SPACES),
      description: "Color space format for display (optional)",
    },
    alpha: {
      control: { type: "range", min: 0, max: 1, step: 0.01 },
      description: "Alpha/opacity value",
    },
    color: {
      control: { type: "object" },
      description: "RGB color object",
    },
    onColorSpaceChange: {
      action: "colorSpaceChanged",
      description: "Color space change handler (optional)",
    },
  },
} satisfies Meta<typeof SimpleColorPicker>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default simple color picker with basic RGB color and full controls
 */
export const Default: Story = {
  render: function DefaultStory(args) {
    const [color, setColor] = useState<RGB>(args.color || { r: 250, g: 100, b: 50 })
    const [alpha, setAlpha] = useState(args.alpha || 1)

    return (
      <SimpleColorPicker
        color={color}
        alpha={alpha}
        onColorChange={setColor}
        onAlphaChange={setAlpha}
      />
    )
  },
}

/**
 * Simple color picker with color space
 */
export const WithColorSpace: Story = {
  render: function WithColorSpaceStory(args) {
    const [color, setColor] = useState<RGB>(args.color || { r: 250, g: 100, b: 50 })
    const [alpha, setAlpha] = useState(args.alpha || 1)
    const [colorSpace, setColorSpace] = useState<ChannelFieldSpace | undefined>(
      args.colorSpace || COLOR_SPACES.RGB,
    )

    return (
      <SimpleColorPicker
        color={color}
        alpha={alpha}
        onColorChange={setColor}
        onAlphaChange={setAlpha}
        onColorSpaceChange={setColorSpace}
        colorSpace={colorSpace}
      />
    )
  },
}

export const RoundedArea: Story = {
  render: function WithColorSpaceStory(args) {
    const [color, setColor] = useState<RGB>(args.color || { r: 250, g: 100, b: 50 })
    const [alpha, setAlpha] = useState(args.alpha || 1)
    const [colorSpace, setColorSpace] = useState<ChannelFieldSpace | undefined>(
      args.colorSpace || COLOR_SPACES.RGB,
    )

    return (
      <SimpleColorPicker
        color={color}
        alpha={alpha}
        onColorChange={setColor}
        onAlphaChange={setAlpha}
        onColorSpaceChange={setColorSpace}
        colorSpace={colorSpace}
        colorAreaClassName="rounded-[4px]"
      />
    )
  },
}
