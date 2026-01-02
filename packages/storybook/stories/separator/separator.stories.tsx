import { Separator } from "@choice-ui/react"
import type { Meta, StoryObj } from "@storybook/react-vite"

const meta: Meta<typeof Separator> = {
  title: "Layouts/Separator",
  component: Separator,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof Separator>

/**
 * Separator is a visual divider used to separate content sections.
 *
 * Features:
 * - Supports horizontal (default) and vertical orientations
 * - Accessible to screen readers with proper ARIA attributes
 * - Decorative mode available for purely visual separators
 * - Minimal styling that integrates with design system
 *
 * Usage:
 * - Use between content sections to create visual hierarchy
 * - Horizontal separators work well between stacked content
 * - Vertical separators work well between inline or flex items
 * - Use `decorative` prop when separator is purely visual
 *
 * Accessibility:
 * - Uses `role="separator"` for semantic meaning
 * - Includes `aria-orientation` for screen readers
 * - Decorative separators use `role="none"` to be ignored by assistive technology
 */

/**
 * Basic: Default horizontal separator.
 *
 * The most common use case - a simple horizontal line that divides content vertically.
 */
export const Basic: Story = {
  render: function BasicStory() {
    return (
      <div className="w-80">
        <div className="py-4">Content above</div>
        <Separator />
        <div className="py-4">Content below</div>
      </div>
    )
  },
}

/**
 * Horizontal: Demonstrates horizontal separator usage in a list context.
 *
 * Horizontal separators are useful for dividing stacked items like
 * navigation links, menu items, or content sections.
 */
export const Horizontal: Story = {
  render: function HorizontalStory() {
    return (
      <div className="border-default-boundary w-64 rounded-lg border p-4">
        <div className="space-y-3">
          <a
            href="#"
            className="text-default-foreground hover:text-accent-foreground block"
          >
            Home
          </a>
          <a
            href="#"
            className="text-default-foreground hover:text-accent-foreground block"
          >
            Pricing
          </a>
          <a
            href="#"
            className="text-default-foreground hover:text-accent-foreground block"
          >
            Blog
          </a>
          <Separator className="my-3" />
          <a
            href="#"
            className="text-default-foreground hover:text-accent-foreground block"
          >
            Log in
          </a>
          <a
            href="#"
            className="text-default-foreground hover:text-accent-foreground block"
          >
            Sign up
          </a>
        </div>
      </div>
    )
  },
}

/**
 * Vertical: Demonstrates vertical separator in a navigation bar.
 *
 * Vertical separators are ideal for dividing inline content like
 * navigation links, toolbar buttons, or horizontal lists.
 */
export const Vertical: Story = {
  render: function VerticalStory() {
    return (
      <div className="border-default-boundary flex h-8 items-center gap-4 rounded-lg border px-4">
        <a
          href="#"
          className="text-default-foreground hover:text-accent-foreground"
        >
          Home
        </a>
        <a
          href="#"
          className="text-default-foreground hover:text-accent-foreground"
        >
          Pricing
        </a>
        <a
          href="#"
          className="text-default-foreground hover:text-accent-foreground"
        >
          Blog
        </a>
        <a
          href="#"
          className="text-default-foreground hover:text-accent-foreground"
        >
          Support
        </a>

        <Separator orientation="vertical" />

        <a
          href="#"
          className="text-default-foreground hover:text-accent-foreground"
        >
          Log in
        </a>
        <a
          href="#"
          className="text-default-foreground hover:text-accent-foreground"
        >
          Sign up
        </a>
      </div>
    )
  },
}

/**
 * Decorative: Separator that is ignored by screen readers.
 *
 * Use the `decorative` prop when the separator is purely visual and
 * doesn't convey any semantic meaning to users.
 */
export const Decorative: Story = {
  render: function DecorativeStory() {
    return (
      <div className="w-80">
        <p className="text-secondary-foreground">
          This separator is decorative and will be ignored by screen readers.
        </p>
        <Separator
          decorative
          className="my-4"
        />
        <p className="text-secondary-foreground">
          Use decorative separators when the visual break doesn&apos;t convey semantic meaning.
        </p>
      </div>
    )
  },
}

/**
 * CustomStyling: Demonstrates custom styling options.
 *
 * The separator accepts className for custom styling. You can modify
 * thickness, color, margins, and other CSS properties.
 */
export const CustomStyling: Story = {
  render: function CustomStylingStory() {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <p className="text-secondary-foreground mb-2">Default</p>
          <Separator />
        </div>

        <div>
          <p className="text-secondary-foreground mb-2">Custom color</p>
          <Separator className="bg-accent-background" />
        </div>

        <div>
          <p className="text-secondary-foreground mb-2">Thicker</p>
          <Separator className="h-0.5" />
        </div>

        <div>
          <p className="text-secondary-foreground mb-2">Dashed (via gradient)</p>
          <Separator className="h-px bg-[repeating-linear-gradient(90deg,var(--color-default-boundary)_0,var(--color-default-boundary)_4px,transparent_4px,transparent_8px)]" />
        </div>

        <div>
          <p className="text-secondary-foreground mb-2">With margin</p>
          <Separator className="my-4" />
        </div>
      </div>
    )
  },
}

/**
 * WithChildren: Separator with content in the middle.
 *
 * Use children to insert content (text, icons) between the separator lines.
 * Common patterns include "OR" dividers and section labels.
 */
export const WithChildren: Story = {
  render: function WithChildrenStory() {
    return (
      <div className="flex w-80 flex-col gap-8">
        <div className="flex flex-col gap-4">
          <button className="bg-accent-background text-on-accent-foreground w-full rounded-md py-2">
            Continue with Google
          </button>
          <Separator>or</Separator>
          <button className="border-default-boundary w-full rounded-md border py-2">
            Continue with Email
          </button>
        </div>

        <Separator>Section Title</Separator>

        <Separator>
          <span className="text-accent-foreground">New</span>
        </Separator>
      </div>
    )
  },
}

/**
 * InCard: Separator used within a card component.
 *
 * A common pattern is using separators to divide card sections
 * like header, body, and footer.
 */
export const InCard: Story = {
  render: function InCardStory() {
    return (
      <div className="border-default-boundary bg-default-background w-80 rounded-xl border shadow-sm">
        <div className="p-4">
          <h3 className="text-default-foreground font-semibold">Card Title</h3>
          <p className="text-secondary-foreground text-sm">Card subtitle or description</p>
        </div>
        <Separator />
        <div className="p-4">
          <p className="text-default-foreground">
            This is the main content area of the card. It can contain any content you need.
          </p>
        </div>
        <Separator />
        <div className="flex justify-end gap-2 p-4">
          <button className="text-secondary-foreground hover:bg-default-boundary rounded-md px-3 py-1.5 text-sm">
            Cancel
          </button>
          <button className="bg-accent-background text-on-accent-foreground rounded-md px-3 py-1.5 text-sm">
            Confirm
          </button>
        </div>
      </div>
    )
  },
}
