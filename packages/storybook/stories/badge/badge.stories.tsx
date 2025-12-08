import { Badge } from "@choice-ui/react"
import { Dot } from "@choiceform/icons-react"
import { Story } from "@storybook/addon-docs/blocks"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Fragment } from "react"

const meta: Meta<typeof Badge> = {
  title: "Feedback/Badge",
  component: Badge,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof Badge>

/**
 * Badges are used to call attention to status, and come in a strong "filled" and light "outline" form.
 *
 * Features:
 * - Supports multiple variants: "default", "brand", "inverted", "component", "success", "warning", and "error" for different semantic meanings.
 * - The `strong` prop toggles between a filled (strong) and outlined (subtle) appearance.
 * - Can display icons (e.g., status dots) alongside text for richer context.
 * - Designed to be compact and easily embeddable in lists, cards, or next to headings.
 *
 * Usage:
 * - Use badges to highlight new or beta features, status changes (e.g., "Added", "Removed"), or user roles (e.g., "Admin").
 * - Combine with icons to visually reinforce meaning (e.g., a dot for status).
 * - Place badges near the content they annotate, such as next to feature names or user names.
 *
 * Best Practices:
 * - Avoid overusing badges, as too many can reduce their impact.
 * - Choose variant colors that align with your application's semantic color system.
 * - Use concise, clear text within badges for quick recognition.
 * - Ensure badges have sufficient contrast for accessibility.
 *
 * Accessibility:
 * - Badges should have accessible text and sufficient color contrast.
 * - When used with icons, ensure the icon is decorative or has an accessible label if it conveys meaning.
 */

export const Basic: Story = {
  render: function BasicStory() {
    enum Variant {
      Brand = "brand",
      Component = "component",
      Default = "default",
      Error = "error",
      Inverted = "inverted",
      Success = "success",
      Warning = "warning",
    }

    enum Strong {
      False = "false",
      True = "true",
    }

    return (
      <div className="flex flex-col items-start gap-4">
        <div className="grid grid-cols-4 place-items-start gap-4 capitalize">
          {Object.values(Variant).map((variant) => (
            <Fragment key={variant}>
              {Object.values(Strong).map((strong) => (
                <Fragment key={strong}>
                  <Badge
                    variant={variant}
                    strong={strong === Strong.True}
                  >
                    {variant}
                  </Badge>
                  <Badge
                    variant={variant}
                    strong={strong === Strong.True}
                  >
                    <Dot />
                    {variant}
                  </Badge>
                </Fragment>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    )
  },
}
