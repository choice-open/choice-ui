import type { ChannelFieldSpace, GradientPaint } from "@choice-ui/react"
import { ColorGradientsPaint, ColorSwatch, getGradientString, Popover } from "@choice-ui/react"
import { faker } from "@faker-js/faker"
import type { Meta, StoryObj } from "@storybook/react"
import { nanoid } from "nanoid"
import React, { useState } from "react"
import { useEventCallback } from "usehooks-ts"

const meta: Meta<typeof ColorGradientsPaint> = {
  title: "Colors/ColorGradientsPaint",
  component: ColorGradientsPaint,
}

export default meta

type Story = StoryObj<typeof ColorGradientsPaint>

const PRESET_COLORS: GradientPaint[] = Array.from({ length: 20 }, () => ({
  gradientStops: [
    {
      id: nanoid(),
      position: 0,
      color: {
        r: faker.number.int({ min: 0, max: 255 }),
        g: faker.number.int({ min: 0, max: 255 }),
        b: faker.number.int({ min: 0, max: 255 }),
      },
      alpha: faker.number.float({ min: 0, max: 1 }),
    },
    {
      id: nanoid(),
      position: 1,
      color: {
        r: faker.number.int({ min: 0, max: 255 }),
        g: faker.number.int({ min: 0, max: 255 }),
        b: faker.number.int({ min: 0, max: 255 }),
      },
      alpha: 1,
    },
  ],
  type: faker.helpers.arrayElement(["GRADIENT_LINEAR", "GRADIENT_RADIAL", "GRADIENT_ANGULAR"]),
  gradientTransform: faker.helpers.arrayElement([
    [
      [1, 0, 0],
      [0, 1, 0],
    ],
    [
      [1, 0, 0],
      [0, 1, 0],
    ],
  ]),
}))

/**
 * The `PresetColors` component is a reusable UI element that displays a list of preset colors.
 * It allows users to select a color from a list of predefined options.
 *
 */
const PresetColors = ({
  handleGradientChange,
}: {
  handleGradientChange: (gradient: GradientPaint) => void
}) => {
  return (
    <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(14px,1fr))] items-center gap-2 border-t px-4 pt-4">
      {PRESET_COLORS.map((mock, index) => (
        <ColorSwatch
          key={index}
          gradient={mock}
          size={16}
          className="rounded-md"
          onClick={() => handleGradientChange(mock)}
        />
      ))}
    </div>
  )
}

/**
 * The `GradientString` component is a reusable UI element that displays a gradient string.
 * It allows users to copy the gradient string to the clipboard.
 *
 */
const GradientString = ({ gradient }: { gradient: GradientPaint }) => {
  return (
    <div className="z-10 min-w-0 rounded-lg bg-white/50 p-3 text-center font-mono">
      {getGradientString(gradient.gradientStops, gradient.type, gradient.gradientTransform)}
    </div>
  )
}

/**
 * The `GradientBackground` component is a reusable UI element that displays a gradient background.
 * It allows users to select a color from a list of predefined options.
 *
 */
const GradientBackground = ({ gradient }: { gradient: GradientPaint }) => {
  return (
    <ColorSwatch
      gradient={gradient}
      size={32}
      className="ignore size-full! absolute inset-0"
    />
  )
}

/**
 * The `GradientPopover` component is a reusable UI element that displays a gradient popover.
 * It allows users to select a color from a list of predefined options.
 *
 */
const GradientPopover = ({
  children,
  handleGradientChange,
}: {
  children: React.ReactNode
  handleGradientChange: (gradient: GradientPaint) => void
}) => {
  return (
    <Popover
      open={true}
      placement="left"
      draggable
      rememberPosition
      outsidePressIgnore="ignore"
    >
      <Popover.Trigger>
        <div className="pointer-events-none absolute right-1/2" />
      </Popover.Trigger>

      <Popover.Header title="Gradient Paint" />

      <Popover.Content className="pb-4 pt-0">
        {children}

        <PresetColors handleGradientChange={handleGradientChange} />
      </Popover.Content>
    </Popover>
  )
}

/**
 * The `ColorGradientsPaint` component is a professional gradient color editor designed for creating and editing complex gradient styles.
 * It provides a comprehensive set of controls for precise gradient manipulation, making it suitable for both basic and advanced gradient design needs.
 *
 * ### Component Structure
 * - **Gradient Type Selector**: Switch between linear, radial, and angular gradients
 * - **Gradient Control Bar**: Visual representation of the gradient with interactive color stops
 * - **Color Stop Controls**: Detailed controls for managing individual color stops
 * - **Transform Tools**: Rotation and flip controls for adjusting gradient orientation
 *
 * ### Usage Guidelines
 * 1. **Gradient Types**
 *    - Linear: Creates straight-line color transitions
 *    - Radial: Produces circular gradient patterns
 *    - Angular: Generates sweeping circular gradients
 *
 * 2. **Color Stop Management**
 *    - Click on the gradient bar to add new color stops
 *    - Drag stops to adjust their position
 *    - Click a stop to edit its color and opacity
 *    - Double-click to remove a stop
 *
 * 3. **Transform Controls**
 *    - Use rotation tool for 90-degree rotations
 *    - Flip tool reverses the gradient direction
 *
 * 4. **Variable Support**
 *    - Bind color stops to design system variables
 *    - Maintain consistency across your design system
 *
 * ### Best Practices
 * - Maintain at least two color stops for a valid gradient
 * - Use alpha channels thoughtfully for transparency effects
 * - Consider using preset gradients for consistency
 * - Leverage variables for reusable gradient patterns
 */
export const Basic: Story = {
  render: function BasicStory() {
    const [gradient, setGradient] = useState<GradientPaint>({
      gradientStops: [
        { id: "start", position: 0, color: { r: 0, g: 80, b: 255 }, alpha: 0.5 },
        { id: "end", position: 1, color: { r: 0, g: 80, b: 255 }, alpha: 1 },
      ],
      type: "GRADIENT_LINEAR",
      gradientTransform: [
        [1, 0, 0],
        [0, 1, 0],
      ],
    })

    const [colorSpace, setColorSpace] = useState<ChannelFieldSpace>("hex")

    const handleGradientChange = useEventCallback((gradient: GradientPaint) => {
      setGradient(gradient)
    })

    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <GradientBackground gradient={gradient} />

        <div className="bg-default-background z-10 flex flex-col rounded-xl pb-4 shadow-lg">
          <ColorGradientsPaint
            colorSpace={colorSpace}
            onColorSpaceChange={(newValue) => setColorSpace(newValue)}
            gradient={gradient}
            onGradientChange={handleGradientChange}
            features={{
              containerWidth: 240,
            }}
            onChangeStart={() => {
              console.log("change start")
            }}
            onChangeEnd={() => {
              console.log("change end")
            }}
          />
          <PresetColors handleGradientChange={handleGradientChange} />
        </div>

        <GradientString gradient={gradient} />
      </div>
    )
  },
}
