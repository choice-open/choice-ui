import { ProgressBar, Range } from "@choiceform/design-system";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { Fragment, useState } from "react";

const meta: Meta<typeof ProgressBar> = {
  title: "Feedback/ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ProgressBar>;

/**
 * Basic: Shows the default ProgressBar with label and value.
 * - Demonstrates composite API usage with `ProgressBar.Label`, `ProgressBar.Track`, and `ProgressBar.Connects`.
 * - Displays current progress value via `showValue`.
 * - Use for simple linear progress indications.
 */
export const Basic: Story = {
  render: () => (
    <ProgressBar value={45} showValue>
      <ProgressBar.Track>
        <ProgressBar.Connects />
      </ProgressBar.Track>
    </ProgressBar>
  ),
};

/**
 * Sizes: Demonstrates the two size options available.
 * - `size="small"` for compact contexts.
 * - `size="default"` (default) for compact contexts.
 * - `size="large"` for more prominent progress indicators.
 */
export const Sizes: Story = {
  render: () => (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <span>Small</span>
        <ProgressBar size="small" value={60} showValue>
          <ProgressBar.Label>Processing</ProgressBar.Label>
          <ProgressBar.Track>
            <ProgressBar.Connects />
          </ProgressBar.Track>
        </ProgressBar>
      </div>
      <div className="grid gap-2">
        <span>Default</span>
        <ProgressBar size="default" value={60} showValue>
          <ProgressBar.Label>Processing</ProgressBar.Label>
          <ProgressBar.Track>
            <ProgressBar.Connects />
          </ProgressBar.Track>
        </ProgressBar>
      </div>
      <div className="grid gap-2">
        <span>Large</span>
        <ProgressBar size="large" value={60} showValue>
          <ProgressBar.Label>Processing</ProgressBar.Label>
          <ProgressBar.Track>
            <ProgressBar.Connects />
          </ProgressBar.Track>
        </ProgressBar>
      </div>
    </div>
  ),
};

/**
 * Variants: Demonstrates theme-driven color variants.
 * - Uses theme tokens for `accent`, `success`, `warning`, `danger`, and `inverse`.
 * - Choose the variant that matches the semantic meaning of the progress.
 */
export const Variants: Story = {
  render: () => {
    const variants: Array<
      NonNullable<React.ComponentProps<typeof ProgressBar>["variant"]>
    > = ["accent", "default"];

    return (
      <div className="grid gap-4">
        {variants.map((variant) => (
          <Fragment key={variant}>
            <span className="capitalize">{variant}</span>
            <ProgressBar variant={variant} value={72} showValue>
              <ProgressBar.Label>Uploading</ProgressBar.Label>
              <ProgressBar.Track>
                <ProgressBar.Connects />
              </ProgressBar.Track>
            </ProgressBar>
          </Fragment>
        ))}
      </div>
    );
  },
};

/**
 * Striped & Indeterminate: Shows a striped progress and an indeterminate state.
 * - `striped` adds a subtle moving texture for ongoing processes.
 * - `indeterminate` renders without a known value; useful for unknown durations.
 */
export const StripedAndIndeterminate: Story = {
  render: () => (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <span>Striped</span>
        <ProgressBar value={65} striped>
          <ProgressBar.Label>Transferring</ProgressBar.Label>
          <ProgressBar.Track>
            <ProgressBar.Connects />
          </ProgressBar.Track>
        </ProgressBar>
      </div>

      <div className="grid gap-2">
        <span>Indeterminate</span>
        <ProgressBar indeterminate>
          <ProgressBar.Label>Loading</ProgressBar.Label>
          <ProgressBar.Track>
            <ProgressBar.Connects />
          </ProgressBar.Track>
        </ProgressBar>
      </div>
    </div>
  ),
};

/**
 * Based-on-value: Demonstrates continuous color blending driven by `value`.
 * - Set `variant="based-on-value"` and provide `dynamicColors`.
 * - Accepts either an array of colors (evenly spaced) or stops with `{ at, color }`.
 * - Colors are smoothly mixed between stops using the current progress value.
 */
export const BasedOnValue: Story = {
  render: function BasedOnValue() {
    const [value, setValue] = useState(35);

    return (
      <div className="grid gap-4">
        <div className="grid gap-2">
          <span>Evenly spaced colors</span>
          <ProgressBar
            value={value}
            variant="based-on-value"
            dynamicColors={["#ef4444", "#f59e0b", "#22c55e"]}
          >
            <ProgressBar.Label showValue>Score</ProgressBar.Label>
            <ProgressBar.Track>
              <ProgressBar.Connects />
            </ProgressBar.Track>
          </ProgressBar>
        </div>

        <div className="grid gap-2">
          <span>Custom stops (at)</span>
          <ProgressBar
            value={value}
            variant="based-on-value"
            dynamicColors={[
              { at: 0, color: "#ef4444" },
              { at: 0.5, color: "#f59e0b" },
              { at: 1, color: "#22c55e" },
            ]}
          >
            <ProgressBar.Label showValue>Health</ProgressBar.Label>
            <ProgressBar.Track>
              <ProgressBar.Connects />
            </ProgressBar.Track>
          </ProgressBar>
        </div>

        <div className="grid gap-2">
          <Range
            min={0}
            max={100}
            value={value}
            onChange={(v) => setValue(v)}
            trackSize={{
              width: "auto",
              height: 16,
            }}
          />
          <span>Value: {value}</span>
        </div>
      </div>
    );
  },
};
