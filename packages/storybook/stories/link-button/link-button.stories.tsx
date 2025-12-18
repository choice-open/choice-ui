import { LinkButton } from "@choice-ui/react"
import { Settings } from "@choiceform/icons-react"
import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "buttons/LinkButton",
  component: LinkButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof LinkButton>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Basic button usage without href prop.
 * Renders as a <button> element with click handler.
 */
export const Basic: Story = {
  render: () => <LinkButton onClick={() => alert("Button clicked!")}>Click me</LinkButton>,
}

/**
 * Basic link usage with href prop.
 * Renders as an <a> element for internal navigation.
 */
export const AsInternalLink: Story = {
  render: () => <LinkButton href="/dashboard">Go to Dashboard</LinkButton>,
}

/**
 * External link usage with automatic security handling.
 *
 * Component automatically detects external links (href starting with "http" or "//")
 * and applies security attributes:
 * - If target is not specified, automatically sets target="_blank" to open in new tab
 * - Automatically adds rel="noopener noreferrer" to prevent security vulnerabilities
 *   (if rel already exists, appends "noopener noreferrer" to existing value)
 *
 * This prevents window.opener attacks and ensures safe external navigation.
 */
export const AsExternalLink: Story = {
  render: () => <LinkButton href="https://github.com">Visit GitHub</LinkButton>,
}

/**
 * Disabled state prevents interaction and shows visual feedback.
 * Works for both links and buttons.
 */
export const Disabled: Story = {
  render: () => (
    <div className="flex gap-4">
      <LinkButton
        disabled
        href="/example"
      >
        Disabled Link
      </LinkButton>
      <LinkButton
        disabled
        onClick={() => alert("Won't fire")}
      >
        Disabled Button
      </LinkButton>
    </div>
  ),
}

/**
 * Links with icons for better visual hierarchy.
 */
export const WithIcons: Story = {
  render: () => (
    <div className="flex gap-4">
      <LinkButton
        href="/home"
        className="gap-1"
      >
        <Settings
          width={16}
          height={16}
        />
        Home
      </LinkButton>
      <LinkButton
        href="/settings"
        variant="subtle"
        className="gap-1"
      >
        <Settings
          width={16}
          height={16}
        />
        Settings
      </LinkButton>
    </div>
  ),
}

/**
 * Variants side by side for comparison.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex gap-4">
      <LinkButton
        href="/example"
        variant="default"
      >
        Default
      </LinkButton>
      <LinkButton
        href="/example"
        variant="subtle"
      >
        Subtle
      </LinkButton>
    </div>
  ),
}
