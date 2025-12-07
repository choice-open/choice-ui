import { Chip } from "@choiceform/design-system";
import { SearchSmall } from "@choiceform/icons-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta = {
  title: "Feedback/Chip",
  component: Chip,
  tags: ["beta", "autodocs"],
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `Chip` is a compact, interactive component used for displaying information, selections, or actions.
 *
 * Features:
 * - Can be selected, deselected, or removed
 * - Supports prefix and suffix elements (icons, avatars, etc.)
 * - Clickable for toggling selection or triggering actions
 * - Can be used in groups for multi-select scenarios
 *
 * Usage:
 * - Use chips for tags, filters, selections, or compact actions
 * - Combine with prefix/suffix elements for richer context
 * - Use the `onRemove` prop to make chips removable
 *
 * Best Practices:
 * - Keep chip labels concise
 * - Use icons or color indicators for additional meaning
 * - Ensure sufficient contrast and accessible focus indicators
 *
 * Accessibility:
 * - Fully accessible to screen readers and keyboard users
 * - Removable chips provide accessible remove buttons
 * - Prefix and suffix elements should be decorative or have accessible labels if meaningful
 */

/**
 * Basic: Shows a simple, static Chip.
 * - Use for displaying a single tag or label.
 */
export const Basic: Story = {
  render: function BasicStory() {
    return <Chip>Chip</Chip>;
  },
};

/**
 * Selected: Demonstrates a selectable Chip.
 * - Click to toggle selection state.
 * - Useful for filter chips or multi-select scenarios.
 */
export const Selected: Story = {
  render: function SelectedStory() {
    const [selected, setSelected] = useState(false);

    return (
      <Chip selected={selected} onClick={() => setSelected(!selected)}>
        Chip
      </Chip>
    );
  },
};

/**
 * OnRemove: Demonstrates removable Chips with selection.
 * - Chips can be selected/deselected and removed from the group.
 * - Useful for tag input, filter lists, or dynamic chip groups.
 */
export const OnRemove: Story = {
  render: function OnRemoveStory() {
    const [chips, setChips] = useState<string[]>([
      "Chip 1",
      "Chip 2",
      "Chip 3",
    ]);
    const [selected, setSelected] = useState<string[]>([]);

    return (
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <Chip
            key={chip}
            selected={selected.includes(chip)}
            onClick={() => {
              setSelected(
                selected.includes(chip)
                  ? selected.filter((c) => c !== chip)
                  : [...selected, chip]
              );
            }}
            onRemove={() => {
              setChips(chips.filter((c) => c !== chip));
            }}
          >
            {chip}
          </Chip>
        ))}
      </div>
    );
  },
};

/**
 * Prefix: Demonstrates a Chip with a prefix element (e.g., icon, color dot).
 * - Use for status indicators, avatars, or icons before the label.
 */
export const Prefix: Story = {
  render: function PrefixStory() {
    return (
      <Chip prefixElement={<div className="h-2 w-2 rounded-full bg-red-500" />}>
        Chip
      </Chip>
    );
  },
};

/**
 * Suffix: Demonstrates a Chip with a suffix element (e.g., icon).
 * - Use for actions, status, or icons after the label.
 */
export const Suffix: Story = {
  render: function SuffixStory() {
    return <Chip suffixElement={<SearchSmall />}>Chip</Chip>;
  },
};
