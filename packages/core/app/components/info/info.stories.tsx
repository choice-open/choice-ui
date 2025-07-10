import { CircleInfoLargeSolid } from "@choiceform/icons-react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { Info } from "./index"

const meta: Meta<typeof Info> = {
  title: "Feedback/Info",
  component: Info,
  parameters: {
    layout: "centered",
  },
  tags: ["new"],
}

export default meta
type Story = StoryObj<typeof meta>

// Exact screenshot match
export const ScreenshotMatch: Story = {
  render: () => (
    <div className="max-w-md rounded-2xl border bg-white p-8 shadow-lg">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-900">Reason</span>
        <Info
          content="Optional reason"
          placement="right-start"
        />
      </div>
    </div>
  ),
}

export const CustomIcon: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-900">Reason</span>
      <Info
        icon={<CircleInfoLargeSolid />}
        content="Optional reason"
      />
    </div>
  ),
}
// Basic info example matching the screenshot
export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2 rounded-xl bg-gray-50 p-8">
      <span className="font-medium text-gray-900">Reason</span>
      <Info content="Optional reason" />
    </div>
  ),
}

// Different placements
export const Placements: Story = {
  render: () => (
    <div className="flex flex-col items-center justify-center gap-8 p-8">
      <div className="flex items-center gap-2">
        <Info
          content="Information tooltip displayed on the left"
          placement="left-start"
        />
        <span>Left placement</span>
      </div>

      <div className="flex items-center gap-2">
        <span>Right placement</span>
        <Info
          content="Information tooltip displayed on the right"
          placement="right-start"
        />
      </div>
    </div>
  ),
}

// Form field example like in screenshot
export const FormField: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label htmlFor="reason">Reason</label>
        <Info content="Optional reason" />
      </div>
      <select
        id="reason"
        className="w-full rounded border p-2"
      >
        <option>None</option>
      </select>

      <div className="flex items-center gap-2">
        <label htmlFor="feedback">Additional Feedback</label>
        <Info content="Provide any additional details" />
      </div>
      <textarea
        id="feedback"
        placeholder="Your feedback..."
        className="w-full rounded border p-2"
        rows={4}
      />
    </div>
  ),
}

// Long content
export const LongContent: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <span>Complex field</span>
      <Info
        content="This is a very long information tooltip content used to demonstrate the display effect when there is more content. The component will automatically wrap and maintain appropriate width to ensure content readability and aesthetics."
        placement="right-start"
      />
    </div>
  ),
}

// Disabled state
export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <span>Disabled field</span>
      <Info
        content="This information tooltip is disabled"
        disabled={true}
      />
    </div>
  ),
}
