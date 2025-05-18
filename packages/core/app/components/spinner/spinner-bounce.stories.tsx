import type { Meta, StoryObj } from "@storybook/react"
import React from "react"
import { SpinnerBounce } from "./spinner-bounce"

const meta: Meta<typeof SpinnerBounce> = {
  title: "Status/Spinner/SpinnerBounce",
  component: SpinnerBounce,
  parameters: {
    layout: "centered",
  },
}
export default meta

type Story = StoryObj<typeof SpinnerBounce>

export const Basic: Story = {
  args: {},
}

export const SetSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <SpinnerBounce size="small" />
      <SpinnerBounce size="medium" />
      <SpinnerBounce size="large" />
    </div>
  ),
}

/** Spinner has 5 variants: `primary`, `success`, `warning`, `danger`, and `default`. */
export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <SpinnerBounce variant="default" />
      <SpinnerBounce variant="primary" />
    </div>
  ),
}

export const Label: Story = {
  args: {
    label: "Loading...",
  },
}
