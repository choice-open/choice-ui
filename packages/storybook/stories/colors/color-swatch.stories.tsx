import { Button, ColorSwatch, GradientPaint } from "@choice-ui/react"
import { faker } from "@faker-js/faker"
import type { Meta, StoryObj } from "@storybook/react"
import { nanoid } from "nanoid"
import { useMemo, useState } from "react"

const meta: Meta<typeof ColorSwatch> = {
  title: "Colors/ColorSwatch",
  component: ColorSwatch,
  parameters: {
    docs: {
      description: {
        component: `
The ColorSwatch component is used to visually represent colors and gradients in the design system.
It supports solid colors, transparency, gradients, and various styling options to match your design needs.
        `,
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof ColorSwatch>

/**
 * The \`ColorSwatch\` component is used to display a color swatch.
 * It can be used to display a single color, a gradient, or a color with alpha.
 *
 * Basic usage requires only an RGB color object with values between 0-255.
 */
export const Basic: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">
        <ColorSwatch color={{ r: 0, g: 85, b: 255 }} />
        <ColorSwatch color={{ r: 255, g: 0, b: 85 }} />
        <ColorSwatch color={{ r: 85, g: 255, b: 0 }} />
      </div>
      <div className="rounded-md border p-4">
        <ul className="flex flex-col gap-2">
          <li>
            <b className="font-strong">Basic Usage</b>: Provide an RGB color object
            <code className="ml-2 rounded bg-slate-100 px-1 py-0.5 font-mono">
              {"{ r: 0-255, g: 0-255, b: 0-255 }"}
            </code>
          </li>
          <li>
            <b className="font-strong">Default Size</b>: 14px × 14px
          </li>
          <li>
            <b className="font-strong">Default Shape</b>: Square with slightly rounded corners
          </li>
        </ul>
      </div>
    </div>
  ),
}

/**
 * The ColorSwatch component can be customized with various options.
 *
 * - `alpha`: Transparency value (0-1)
 * - `size`: Size in pixels
 * - `className`: Custom CSS classes for styling
 * - `type`: Indicates if the swatch represents a variable or style
 */
export const CustomOptions: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-4">
        {/* Alpha variations */}
        <div className="flex flex-col items-center gap-2">
          <ColorSwatch
            color={{ r: 0, g: 85, b: 255 }}
            alpha={0.25}
            size={36}
          />
          <span className="text-body-small">Alpha: 0.25</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <ColorSwatch
            color={{ r: 0, g: 85, b: 255 }}
            alpha={0.5}
            size={36}
          />
          <span className="text-body-small">Alpha: 0.5</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <ColorSwatch
            color={{ r: 0, g: 85, b: 255 }}
            alpha={0.75}
            size={36}
          />
          <span className="text-body-small">Alpha: 0.75</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <ColorSwatch
            color={{ r: 0, g: 85, b: 255 }}
            alpha={1}
            size={36}
          />
          <span className="text-body-small">Alpha: 1.0</span>
        </div>

        {/* Size variations */}
        <div className="flex flex-col items-center gap-2">
          <ColorSwatch
            color={{ r: 255, g: 85, b: 0 }}
            size={16}
          />
          <span className="text-body-small">Size: 16px</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <ColorSwatch
            color={{ r: 255, g: 85, b: 0 }}
            size={32}
          />
          <span className="text-body-small">Size: 32px</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <ColorSwatch
            color={{ r: 255, g: 85, b: 0 }}
            size={48}
          />
          <span className="text-body-small">Size: 48px</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <ColorSwatch
            color={{ r: 255, g: 85, b: 0 }}
            size={64}
          />
          <span className="text-body-small">Size: 64px</span>
        </div>

        {/* Shape variations */}
        <div className="flex flex-col items-center gap-2">
          <ColorSwatch
            color={{ r: 85, g: 0, b: 255 }}
            size={36}
            className="rounded-none"
          />
          <span className="text-body-small">Sharp Square</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <ColorSwatch
            color={{ r: 85, g: 0, b: 255 }}
            size={36}
            className="rounded-md"
          />
          <span className="text-body-small">Rounded</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <ColorSwatch
            color={{ r: 85, g: 0, b: 255 }}
            size={36}
            className="rounded-full"
          />
          <span className="text-body-small">Circle</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <ColorSwatch
            color={{ r: 85, g: 0, b: 255 }}
            size={36}
            className="rounded-full outline outline-2 outline-offset-2 outline-blue-400"
          />
          <span className="text-body-small">Custom Style</span>
        </div>

        {/* Type variations */}
        <div className="flex flex-col items-center gap-2">
          <ColorSwatch
            color={{ r: 0, g: 180, b: 120 }}
            alpha={0.5}
            size={36}
            type="VARIABLE"
            className="rounded-md"
          />
          <span className="text-body-small">Variable Type</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <ColorSwatch
            color={{ r: 0, g: 180, b: 120 }}
            alpha={0.5}
            size={36}
            type="STYLE"
            className="rounded-full"
          />
          <span className="text-body-small">Style Type</span>
        </div>
      </div>
      <div className="rounded-md border p-4">
        <ul className="flex flex-col gap-2">
          <li>
            <b className="font-strong">Alpha</b>: Controls transparency (0-1)
          </li>
          <li>
            <b className="font-strong">Size</b>: Sets dimensions in pixels
          </li>
          <li>
            <b className="font-strong">Shape</b>: Customizable with className (rounded-md,
            rounded-full, etc.)
          </li>
          <li>
            <b className="font-strong">Type</b>: Indicates if the swatch represents a variable or
            style
            <ul className="ml-6 mt-1">
              <li>VARIABLE: Typically shown as rounded squares</li>
              <li>STYLE: Typically shown as circles</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  ),
}

/**
 * The ColorSwatch component can display gradients by providing a gradient object.
 *
 * Supported gradient types:
 * - `GRADIENT_LINEAR`: Linear gradient
 * - `GRADIENT_RADIAL`: Radial gradient
 * - `GRADIENT_ANGULAR`: Angular gradient
 *
 * Each gradient requires stop points defining colors and positions.
 */
export const Gradients: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <div className="grid grid-cols-3 gap-4">
        {/* Linear gradient */}
        <div className="flex flex-col items-center gap-2">
          <ColorSwatch
            gradient={{
              type: "GRADIENT_LINEAR",
              gradientTransform: [
                [1, 0, 0],
                [0, 1, 0],
              ],
              gradientStops: [
                {
                  id: nanoid(),
                  color: { r: 0, g: 85, b: 255 },
                  position: 0,
                  alpha: 1,
                },
                {
                  id: nanoid(),
                  color: { r: 255, g: 0, b: 85 },
                  position: 1,
                  alpha: 1,
                },
              ],
            }}
            size={48}
            className="rounded-md"
          />
          <span className="text-body-small">Linear Gradient</span>
        </div>

        {/* Radial gradient */}
        <div className="flex flex-col items-center gap-2">
          <ColorSwatch
            gradient={{
              type: "GRADIENT_RADIAL",
              gradientTransform: [
                [1, 0, 0],
                [0, 1, 0],
              ],
              gradientStops: [
                {
                  id: nanoid(),
                  color: { r: 255, g: 85, b: 0 },
                  position: 0,
                  alpha: 1,
                },
                {
                  id: nanoid(),
                  color: { r: 85, g: 0, b: 255 },
                  position: 1,
                  alpha: 1,
                },
              ],
            }}
            size={48}
            className="rounded-md"
          />
          <span className="text-body-small">Radial Gradient</span>
        </div>

        {/* Angular gradient */}
        <div className="flex flex-col items-center gap-2">
          <ColorSwatch
            gradient={{
              type: "GRADIENT_ANGULAR",
              gradientTransform: [
                [1, 0, 0],
                [0, 1, 0],
              ],
              gradientStops: [
                {
                  id: nanoid(),
                  color: { r: 85, g: 255, b: 0 },
                  position: 0,
                  alpha: 1,
                },
                {
                  id: nanoid(),
                  color: { r: 0, g: 85, b: 255 },
                  position: 0.5,
                  alpha: 1,
                },
                {
                  id: nanoid(),
                  color: { r: 255, g: 0, b: 85 },
                  position: 1,
                  alpha: 1,
                },
              ],
            }}
            size={48}
            className="rounded-md"
          />
          <span className="text-body-small">Angular Gradient</span>
        </div>

        {/* Gradient with transparency */}
        <div className="flex flex-col items-center gap-2">
          <ColorSwatch
            gradient={{
              type: "GRADIENT_LINEAR",
              gradientTransform: [
                [1, 0, 0],
                [0, 1, 0],
              ],
              gradientStops: [
                {
                  id: nanoid(),
                  color: { r: 0, g: 85, b: 255 },
                  position: 0,
                  alpha: 0,
                },
                {
                  id: nanoid(),
                  color: { r: 0, g: 85, b: 255 },
                  position: 1,
                  alpha: 1,
                },
              ],
            }}
            size={48}
            className="rounded-md"
          />
          <span className="text-body-small">Transparency Gradient</span>
        </div>

        {/* Multi-stop gradient */}
        <div className="flex flex-col items-center gap-2">
          <ColorSwatch
            gradient={{
              type: "GRADIENT_LINEAR",
              gradientTransform: [
                [1, 0, 0],
                [0, 1, 0],
              ],
              gradientStops: [
                {
                  id: nanoid(),
                  color: { r: 255, g: 0, b: 0 },
                  position: 0,
                  alpha: 1,
                },
                {
                  id: nanoid(),
                  color: { r: 255, g: 255, b: 0 },
                  position: 0.25,
                  alpha: 1,
                },
                {
                  id: nanoid(),
                  color: { r: 0, g: 255, b: 0 },
                  position: 0.5,
                  alpha: 1,
                },
                {
                  id: nanoid(),
                  color: { r: 0, g: 0, b: 255 },
                  position: 0.75,
                  alpha: 1,
                },
                {
                  id: nanoid(),
                  color: { r: 128, g: 0, b: 128 },
                  position: 1,
                  alpha: 1,
                },
              ],
            }}
            size={48}
            className="rounded-md"
          />
          <span className="text-body-small">Multi-stop Gradient</span>
        </div>
      </div>
      <div className="rounded-md border p-4">
        <ul className="flex flex-col gap-2">
          <li>
            <b className="font-strong">Gradient Types</b>: Linear, Radial, and Angular
          </li>
          <li>
            <b className="font-strong">Gradient Stops</b>: Each stop defines a color, position
            (0-1), and alpha
          </li>
          <li>
            <b className="font-strong">Transform</b>: Controls the direction and orientation of the
            gradient
          </li>
          <li>
            <b className="font-strong">Applications</b>: Useful for representing gradient styles,
            transitions, and multi-color elements
          </li>
        </ul>
      </div>
    </div>
  ),
}

/**
 * Test various random colors and gradients to ensure the component handles diverse inputs.
 *
 * This story uses memoization to control re-rendering and only regenerates colors
 * when the regenerate button is clicked.
 */
export const Randomly: Story = {
  render: function RandomlyStory() {
    const [key, setKey] = useState(0)

    // Memoize the random colors and gradients to prevent
    // unnecessary re-renders when the component updates
    const randomColors = useMemo(() => {
      return Array.from({ length: 25 }).map((_, index) => ({
        key: index,
        color: {
          r: faker.number.int({ min: 0, max: 255 }),
          g: faker.number.int({ min: 0, max: 255 }),
          b: faker.number.int({ min: 0, max: 255 }),
        },
        alpha: faker.number.float({ min: 0, max: 1, multipleOf: 0.1 }),
      }))
    }, [key])

    const randomGradients = useMemo(() => {
      return Array.from({ length: 25 }).map((_, index) => ({
        key: index,
        gradient: {
          type: faker.helpers.arrayElement([
            "GRADIENT_LINEAR",
            "GRADIENT_RADIAL",
            "GRADIENT_ANGULAR",
          ]) as GradientPaint["type"],
          gradientTransform: faker.helpers.arrayElement([
            [
              [1, 0, 0],
              [0, 1, 0],
            ],
            [
              [0, 1, 0],
              [1, 0, 0],
            ],
          ]),
          gradientStops: Array.from({ length: faker.number.int({ min: 2, max: 5 }) }).map(() => ({
            id: faker.string.uuid(),
            color: {
              r: faker.number.int({ min: 0, max: 255 }),
              g: faker.number.int({ min: 0, max: 255 }),
              b: faker.number.int({ min: 0, max: 255 }),
            },
            position: faker.number.float({ min: 0, max: 1, multipleOf: 0.1 }),
            alpha: faker.helpers.arrayElement([0.25, 0.5, 1]),
          })),
          visible: true,
          opacity: 1,
        },
      }))
    }, [key])

    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-start">
          <Button onClick={() => setKey((k) => k + 1)}>Regenerate Colors</Button>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-strong mb-2">Solid Colors</h3>
            <div className="grid grid-cols-5 gap-4">
              {randomColors.map(({ key, color, alpha }) => (
                <ColorSwatch
                  key={key}
                  color={color}
                  alpha={alpha}
                  size={32}
                  className="rounded-md"
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-strong mb-2">Gradients</h3>
            <div className="grid grid-cols-5 gap-4">
              {randomGradients.map(({ key, gradient }) => (
                <ColorSwatch
                  key={key}
                  gradient={gradient as GradientPaint}
                  className="rounded-md"
                  size={32}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-md border p-4">
          <p>
            This example demonstrates how the ColorSwatch component handles a wide variety of colors
            and gradients. Click \`Regenerate Colors\` to create a new set of random colors.
          </p>
        </div>
      </div>
    )
  },
}
