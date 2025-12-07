import { Range } from "@choiceform/range"
import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { Fragment, useState } from "react"
import { ProgressCircle } from "../src/progress-circle"

const meta: Meta<typeof ProgressCircle> = {
  title: "Feedback/ProgressCircle",
  component: ProgressCircle,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof ProgressCircle>

/**
 * `ProgressCircle` is a circular progress indicator with theme-aware variants and an optional
 * dynamic color mode that smoothly blends colors based on the current value.
 *
 * Features:
 * - Theme variants: accent, success, warning, danger, inverse
 * - Indeterminate state (spinning)
 * - Size controlled by diameter `size` (in px) and `strokeWidth`
 * - Insert `<ProgressCircle.Value />` as a child to display the percentage value
 * - Advanced color blending with `variant="based-on-value"` + `dynamicColors`
 *
 * Usage Guidelines:
 * - Use for visualizing a completion ratio or progress when space is constrained
 * - Prefer `indeterminate` when the duration is unknown
 * - Adjust `size` and `strokeWidth` for different visual densities
 * - For semantic meaning (success, warning, etc.), use theme variants
 * - For continuous color feedback, use `based-on-value` with `dynamicColors`
 *
 * Accessibility:
 * - Exposes proper ARIA attributes: role, aria-valuemin/max/now
 * - `indeterminate` omits value to screen readers as the progress is unknown
 */

/**
 * Basic: Shows a default circular progress with value text.
 * - Uses theme `accent` by default.
 * - `showValue` renders the percentage inside the circle.
 */
export const Basic: Story = {
  render: () => (
    <ProgressCircle value={72}>
      <ProgressCircle.Value />
    </ProgressCircle>
  ),
}

/**
 * Sizes: Demonstrates different diameters and stroke widths.
 * - `size` controls the diameter in pixels.
 * - `strokeWidth` defaults to `size / 16`, but can be customized.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="grid place-items-center gap-2">
        <span>Size 48</span>
        <ProgressCircle
          size={48}
          strokeWidth={4}
          value={64}
        >
          <ProgressCircle.Value />
        </ProgressCircle>
      </div>
      <div className="grid place-items-center gap-2">
        <span>Size 64</span>
        <ProgressCircle
          size={64}
          value={64}
        >
          <ProgressCircle.Value />
        </ProgressCircle>
      </div>
      <div className="grid place-items-center gap-2">
        <span>Size 96</span>
        <ProgressCircle
          size={96}
          strokeWidth={8}
          value={64}
        >
          <ProgressCircle.Value />
        </ProgressCircle>
      </div>
    </div>
  ),
}

/**
 * Variants: Shows theme-driven color variants.
 * - Choose a variant to convey semantic meaning.
 */
export const Variants: Story = {
  render: () => {
    const variants: Array<NonNullable<React.ComponentProps<typeof ProgressCircle>["variant"]>> = [
      "accent",
      "default",
    ]

    return (
      <div className="grid gap-4">
        {variants.map((variant) => (
          <Fragment key={variant}>
            <span className="capitalize">{variant}</span>
            <div className="flex items-center gap-4">
              <ProgressCircle
                variant={variant}
                value={40}
              />
              <ProgressCircle
                variant={variant}
                value={70}
              >
                <ProgressCircle.Value />
              </ProgressCircle>
            </div>
          </Fragment>
        ))}
      </div>
    )
  },
}

/**
 * Based-on-value: Demonstrates continuous color blending driven by `value`.
 * - Set `variant="based-on-value"` and provide `dynamicColors`.
 * - Accepts either an array of colors (evenly spaced) or stops with `{ at, color }`.
 * - Colors are smoothly mixed between stops using the current progress value.
 */
export const BasedOnValue: Story = {
  render: function BasedOnValueStory() {
    const [value, setValue] = useState(35)

    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="grid place-items-center gap-2">
          <span>Evenly spaced colors</span>
          <ProgressCircle
            value={value}
            variant="based-on-value"
            dynamicColors={["#ef4444", "#f59e0b", "#22c55e"]}
          >
            <ProgressCircle.Value />
          </ProgressCircle>
        </div>

        <div className="grid place-items-center gap-2">
          <span>Custom stops (at)</span>
          <ProgressCircle
            value={value}
            variant="based-on-value"
            dynamicColors={[
              { at: 0, color: "#ef4444" },
              { at: 0.5, color: "#f59e0b" },
              { at: 1, color: "#22c55e" },
            ]}
          >
            <ProgressCircle.Value />
          </ProgressCircle>
        </div>

        <div className="col-span-2 grid w-full">
          <Range
            min={0}
            max={100}
            value={value}
            onChange={(v) => setValue(v)}
            trackSize={{ width: "auto", height: 16 }}
          />
          <span>Value: {value}</span>
        </div>
      </div>
    )
  },
}
