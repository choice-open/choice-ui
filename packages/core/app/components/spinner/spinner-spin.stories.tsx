import type { Meta, StoryObj } from "@storybook/react"
import React from "react"
import { tcx } from "../../utils"
import { SpinnerSpin } from "./spinner-spin"

const meta: Meta<typeof SpinnerSpin> = {
  title: "Status/Spinner/SpinnerSpin",
  component: SpinnerSpin,
  parameters: {
    layout: "centered",
  },
}

export default meta

type Story = StoryObj<typeof SpinnerSpin>

export const Basic: Story = {
  args: {},
}

export const Size: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <SpinnerSpin size="small" />
      <SpinnerSpin size="medium" />
      <SpinnerSpin size="large" />
    </div>
  ),
}

/** The shapeOpacity slots will not append classes, but instead replace the original classes as a whole. */
export const Opacity: StoryObj<typeof SpinnerSpin> = {
  args: {
    classNames: {
      shape: tcx(
        "[&:nth-of-type(1)]:opacity-100",
        "[&:nth-of-type(2)]:opacity-10",
        "[&:nth-of-type(3)]:opacity-10",
        "[&:nth-of-type(4)]:opacity-100",
      ),
    },
  },
}

/** Spinner has 5 variants: `primary`, `success`, `warning`, `danger`, and `default`. */
export const Variants: StoryObj<typeof SpinnerSpin> = {
  render: () => (
    <div className="flex items-center gap-4">
      <SpinnerSpin />
      <SpinnerSpin variant="primary" />
    </div>
  ),
}

export const CustomColor: StoryObj<typeof SpinnerSpin> = {
  args: {
    classNames: {
      shape: tcx(
        "!opacity-100",
        "[&:nth-of-type(1)]:bg-warning-background",
        "[&:nth-of-type(2)]:bg-success-background",
        "[&:nth-of-type(3)]:bg-accent-background",
        "[&:nth-of-type(4)]:bg-danger-background",
      ),
    },
  },
}

export const Label: StoryObj<typeof SpinnerSpin> = {
  args: {
    label: "Loading...",
  },
}
