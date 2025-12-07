import { LinkButton } from "@choiceform/design-system";
import { Settings } from "@choiceform/icons-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta = {
  title: "buttons/LinkButton",
  component: LinkButton,
  parameters: {
    layout: "centered",
  },
  tags: ["new"],
} satisfies Meta<typeof LinkButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic button usage without href prop.
 * Renders as a <button> element with click handler.
 */
export const AsButton: Story = {
  render: () => (
    <LinkButton onClick={() => alert("Button clicked!")}>Click me</LinkButton>
  ),
};

/**
 * Basic link usage with href prop.
 * Renders as an <a> element for internal navigation.
 */
export const AsInternalLink: Story = {
  render: () => <LinkButton href="/dashboard">Go to Dashboard</LinkButton>,
};

/**
 * External link automatically gets security attributes.
 * target="_blank" and rel="noopener noreferrer" are added automatically.
 */
export const AsExternalLink: Story = {
  render: () => <LinkButton href="https://github.com">Visit GitHub</LinkButton>,
};

/**
 * Default variant with standard accent color styling.
 */
export const Default: Story = {
  render: () => (
    <LinkButton href="/example" variant="default">
      Default Style
    </LinkButton>
  ),
};

/**
 * Subtle variant with muted styling.
 */
export const Subtle: Story = {
  render: () => (
    <LinkButton href="/example" variant="subtle">
      Subtle Style
    </LinkButton>
  ),
};

/**
 * Disabled state prevents interaction and shows visual feedback.
 * Works for both links and buttons.
 */
export const Disabled: Story = {
  render: () => (
    <div className="flex gap-4">
      <LinkButton disabled href="/example">
        Disabled Link
      </LinkButton>
      <LinkButton disabled onClick={() => alert("Won't fire")}>
        Disabled Button
      </LinkButton>
    </div>
  ),
};

/**
 * Links with icons for better visual hierarchy.
 */
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      <LinkButton href="/home" className="gap-1">
        <Settings width={16} height={16} />
        Home
      </LinkButton>
      <LinkButton href="/settings" variant="subtle" className="gap-1">
        <Settings width={16} height={16} />
        Settings
      </LinkButton>
    </div>
  ),
};

/**
 * All variants side by side for comparison.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <LinkButton href="/example" variant="default">
        Default
      </LinkButton>
      <LinkButton href="/example" variant="subtle">
        Subtle
      </LinkButton>
    </div>
  ),
};

/**
 * Security features demonstration.
 * External links automatically get safety attributes.
 */
export const SecurityFeatures: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-body-small-strong mb-2">Internal Link (safe)</h3>
        <LinkButton href="/internal-page">Internal Navigation</LinkButton>
        <p className="mt-1 text-xs text-gray-600">
          No additional attributes needed
        </p>
      </div>

      <div>
        <h3 className="text-body-small-strong mb-2">
          External Link (auto-secured)
        </h3>
        <LinkButton href="https://external-site.com">External Site</LinkButton>
        <p className="mt-1 text-xs text-gray-600">
          Automatically gets target=&quot;_blank&quot; and rel=&quot;noopener
          noreferrer&quot;
        </p>
      </div>

      <div>
        <h3 className="text-body-small-strong mb-2">
          Protocol-relative Link (auto-secured)
        </h3>
        <LinkButton href="//cdn.example.com">CDN Resource</LinkButton>
        <p className="mt-1 text-xs text-gray-600">
          Also gets security attributes
        </p>
      </div>
    </div>
  ),
};

/**
 * Accessibility features demonstration.
 * Proper ARIA attributes and keyboard navigation.
 */
export const AccessibilityFeatures: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-body-small-strong mb-2">Normal States</h3>
        <div className="flex gap-2">
          <LinkButton href="/example">Focusable Link</LinkButton>
          <LinkButton onClick={() => {}}>Focusable Button</LinkButton>
        </div>
        <p className="mt-1 text-xs text-gray-600">
          Tab through these elements to see focus rings
        </p>
      </div>

      <div>
        <h3 className="text-body-small-strong mb-2">Disabled States</h3>
        <div className="flex gap-2">
          <LinkButton disabled href="/example">
            Disabled Link
          </LinkButton>
          <LinkButton disabled onClick={() => {}}>
            Disabled Button
          </LinkButton>
        </div>
        <p className="mt-1 text-xs text-gray-600">
          These are not focusable and have aria-disabled attributes
        </p>
      </div>
    </div>
  ),
};

/**
 * Real-world usage examples in different contexts.
 */
export const RealWorldExamples: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-body-small-strong mb-3">Navigation Menu</h3>
        <nav className="flex gap-4">
          <LinkButton href="/dashboard" variant="default">
            Dashboard
          </LinkButton>
          <LinkButton href="/projects" variant="subtle">
            Projects
          </LinkButton>
          <LinkButton href="/settings" variant="subtle">
            Settings
          </LinkButton>
        </nav>
      </div>

      <div>
        <h3 className="text-body-small-strong mb-3">Call-to-Action</h3>
        <div className="flex gap-3">
          <LinkButton href="/learn-more" variant="subtle">
            Learn More
          </LinkButton>
        </div>
      </div>

      <div>
        <h3 className="text-body-small-strong mb-3">Footer Links</h3>
        <footer className="text-body-small flex flex-wrap gap-4">
          <LinkButton href="/privacy" variant="subtle">
            Privacy Policy
          </LinkButton>
          <LinkButton href="/terms" variant="subtle">
            Terms of Service
          </LinkButton>
          <LinkButton href="https://support.example.com" variant="subtle">
            Support
          </LinkButton>
        </footer>
      </div>
    </div>
  ),
};

/**
 * LinkButton component in readOnly state.
 *
 * In readOnly mode:
 * - Link buttons do not respond to click events
 * - Links will not navigate (href is removed)
 * - Useful for displaying link buttons without allowing interactions
 */
export const Readonly: Story = {
  render: function ReadonlyStory() {
    const [clickCount, setClickCount] = useState(0);

    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border bg-stone-50 p-4">
          <div className="text-body-small-strong mb-2 text-stone-700">
            Click Count:
          </div>
          <div className="text-body-small font-mono text-stone-600">
            {clickCount}
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <LinkButton
            readOnly
            href="https://example.com"
            onClick={() => setClickCount((prev) => prev + 1)}
          >
            Readonly Link
          </LinkButton>
          <LinkButton
            readOnly
            variant="subtle"
            onClick={() => setClickCount((prev) => prev + 1)}
          >
            Readonly Button
          </LinkButton>
          <LinkButton onClick={() => setClickCount((prev) => prev + 1)}>
            Normal Link (for comparison)
          </LinkButton>
        </div>

        <div className="text-body-small text-stone-600">
          💡 Try clicking on the readonly link buttons - the click count should
          not change and links will not navigate. Only the normal button will
          increment the count.
        </div>
      </div>
    );
  },
};
