import {
  Avatar,
  KbdKey,
  MenuItem,
  Menus,
  tcx,
} from "@choiceform/design-system";
import {
  Check,
  ChevronRightSmall,
  ThemeMoonDark,
  ThemeSunBright,
  ThemeSystem,
} from "@choiceform/icons-react";
import { faker } from "@faker-js/faker";
import { Story } from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ReactNode, useMemo, useState } from "react";

const meta: Meta<typeof MenuItem> = {
  title: "Collections/MenuItem",
  component: MenuItem,
  tags: ["new"],
  decorators: [
    (Story) => (
      <div>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof MenuItem>;

/**
 * `MenuItem` is a flexible component for rendering individual options within menu structures.
 *
 * Features:
 * - Active (hover/focus) state visual feedback
 * - Support for prefix and suffix elements
 * - Selection indicators
 * - Keyboard shortcut display
 * - Custom content rendering
 * - Flexible layout with proper alignment
 *
 * Usage Guidelines:
 * - Use consistent patterns for selection indicators
 * - Provide clear hover/active states for user feedback
 * - Add keyboard shortcuts for frequently used actions
 * - Use prefix/suffix elements for additional context
 * - Ensure text properly truncates for long content
 *
 * Accessibility:
 * - Active states for keyboard navigation
 * - Proper ARIA attributes for menu item roles
 * - Selection indicators visible to screen readers
 * - Clear visual hierarchy for all states
 */

/**
 * Basic: Demonstrates the simplest usage of MenuItem.
 *
 * Features:
 * - Clean, minimal appearance
 * - Active state on hover/focus
 * - Standard padding and alignment
 *
 * This example provides the foundation for all other MenuItem variations.
 */
export const Basic: Story = {
  render: function BasicStory() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    return (
      <Menus>
        <Menus.Item
          active={activeIndex === 0}
          onMouseEnter={() => setActiveIndex(0)}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <span>Item</span>
        </Menus.Item>
      </Menus>
    );
  },
};

/**
 * WithPrefixStory: Demonstrates menu items with icons or elements before the text.
 *
 * Features:
 * - Icon alignment before text content
 * - Consistent spacing between icon and text
 * - Maintains proper vertical alignment
 * - Visual enhancement for option recognition
 *
 * This pattern is useful for:
 * - Adding visual cues to menu options
 * - Representing different item types or categories
 * - Improving recognition and scan-ability
 */
export const WithPrefixStory: Story = {
  render: function WithPrefixStory() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const Options = [
      {
        label: "Sun Bright",
        icon: <ThemeSunBright />,
      },
      {
        label: "Moon Dark",
        icon: <ThemeMoonDark />,
      },
      {
        label: "System",
        icon: <ThemeSystem />,
      },
    ];

    return (
      <Menus>
        {Options.map((option, index) => (
          <Menus.Item
            key={option.label}
            active={activeIndex === index}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            prefixElement={option.icon}
          >
            <span className="flex-1 truncate">{option.label}</span>
          </Menus.Item>
        ))}
      </Menus>
    );
  },
};

/**
 * WithSuffixStory: Demonstrates menu items with elements after the text.
 *
 * Features:
 * - Element alignment after text content
 * - Supports icons, indicators, or additional information
 * - Maintains proper spacing and alignment
 *
 * This pattern is useful for:
 * - Indicating submenu availability
 * - Showing status or additional information
 * - Displaying secondary actions or counts
 */
export const WithSuffixStory: Story = {
  render: function WithSuffixStory() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    return (
      <Menus>
        {Array.from({ length: 4 }).map((_, index) => (
          <Menus.Item
            key={index}
            active={activeIndex === index}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            suffixElement={<ChevronRightSmall />}
          >
            <span className="flex-1 truncate">Item</span>
          </Menus.Item>
        ))}
      </Menus>
    );
  },
};

/**
 * WithShortcutStory: Demonstrates menu items with keyboard shortcuts.
 *
 * Features:
 * - Display of keyboard shortcut combinations
 * - Proper alignment and spacing of shortcuts
 * - Support for modifier keys (Command, Ctrl, etc.)
 * - Maintains consistent layout with other menu items
 *
 * This pattern is useful for:
 * - Application command menus
 * - Educating users about available shortcuts
 * - Providing power user affordances
 */
export const WithShortcutStory: Story = {
  render: function WithShortcutStory() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const Options = [
      {
        label: "Option 1",
        shortcut: { modifier: "command", keys: "K" },
      },
      {
        label: "Option 2",
        shortcut: { modifier: "command", keys: "L" },
      },
      {
        label: "Option 3",
        shortcut: { modifier: "command", keys: "M" },
      },
      {
        label: "Option 4",
        shortcut: { modifier: "command", keys: "N" },
      },
    ];
    return (
      <Menus>
        {Options.map((option, index) => (
          <Menus.Item
            key={option.label}
            active={activeIndex === index}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            shortcut={option.shortcut as { keys: ReactNode; modifier: KbdKey }}
          >
            <span className="flex-1 truncate">{option.label}</span>
          </Menus.Item>
        ))}
      </Menus>
    );
  },
};

/**
 * WithSelectionIconStory: Demonstrates menu items with selection indicators.
 *
 * Features:
 * - Visual indicator (checkmark) for selected state
 * - Dynamic toggling of selection state
 * - Proper alignment of selection icon
 * - Maintains clean layout in both selected and unselected states
 *
 * This pattern is useful for:
 * - Single-select menus
 * - Indicating current active option
 * - Selection menus for settings or preferences
 */
export const WithSelectionIconStory: Story = {
  render: function WithSelectionIconStory() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    return (
      <Menus>
        {Array.from({ length: 4 }).map((_, index) => (
          <Menus.Item
            key={index}
            active={activeIndex === index}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            prefixElement={selectedIndex === index ? <Check /> : <></>}
            onMouseDown={() => setSelectedIndex(index)}
          >
            <span className="flex-1 truncate">Item</span>
          </Menus.Item>
        ))}
      </Menus>
    );
  },
};

/**
 * WithRightSelectionIconStory: Demonstrates menu items with selection checkboxes at the right.
 *
 * Features:
 * - Checkbox-style selection indicators at the end of items
 * - Support for multi-selection
 * - Visual feedback for both active and selected states
 * - Toggle behavior for selection
 *
 * This pattern is useful for:
 * - Multi-select menus
 * - Filter selection UI
 * - Setting multiple options simultaneously
 */
export const WithRightSelectionIconStory: Story = {
  render: function WithRightSelectionIconStory() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number[]>([]);
    return (
      <Menus>
        {Array.from({ length: 4 }).map((_, index) => (
          <Menus.Item
            key={index}
            active={activeIndex === index}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            suffixElement={
              <Menus.Checkbox
                active={activeIndex === index}
                selected={selectedIndex.includes(index)}
              />
            }
            onMouseDown={() =>
              setSelectedIndex((prev) =>
                prev.includes(index)
                  ? prev.filter((i) => i !== index)
                  : [...prev, index]
              )
            }
          >
            <span className="flex-1 truncate">Item</span>
          </Menus.Item>
        ))}
      </Menus>
    );
  },
};

/**
 * WithAvatarStory: Demonstrates menu items with avatars.
 *
 * Features:
 * - Avatar integration with menu items
 * - Proper alignment and spacing for avatars
 * - Support for user imagery in menus
 * - Consistent layout with other menu item patterns
 *
 * This pattern is useful for:
 * - User selection menus
 * - Account switchers
 * - Member lists or participant selectors
 * - Contact or people pickers
 */
export const WithAvatarStory: Story = {
  render: function WithAvatarStory() {
    const Options = useMemo(
      () =>
        Array.from({ length: 4 }, (_, index) => ({
          color: faker.color.rgb(),
          name: faker.person.fullName(),
          picture: faker.image.avatar(),
        })),
      []
    );

    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
      <Menus>
        {Options.map((option, index) => (
          <Menus.Item
            key={option.name}
            active={activeIndex === index}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <Avatar
              size="small"
              color={option.color}
              photo={option.picture}
              name={option.name}
            />
            <span className="flex-1 truncate">{option.name}</span>
          </Menus.Item>
        ))}
      </Menus>
    );
  },
};

/**
 * WithBadgeStory: Demonstrates menu items with badges or status indicators.
 *
 * Features:
 * - Badge/tag/pill support in menu items
 * - Visual indicators for both selection and active states
 * - Responsive styling based on item state
 * - Integration of multiple elements (prefix, content, suffix)
 *
 * This pattern is useful for:
 * - Indicating status, quantity, or category
 * - Showing additional metadata for menu items
 * - Feature flags or option state indicators
 * - Creating rich, informative menu experiences
 */
export const WithBadgeStory: Story = {
  render: function WithBadgeStory() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number[]>([]);

    const Options = useMemo(
      () =>
        Array.from({ length: 4 }, (_, index) => ({
          label: faker.music.songName(),
        })),
      []
    );

    return (
      <Menus>
        {Options.map((option, index) => (
          <Menus.Item
            key={index}
            active={activeIndex === index}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            onMouseDown={() =>
              setSelectedIndex((prev) =>
                prev.includes(index)
                  ? prev.filter((i) => i !== index)
                  : [...prev, index]
              )
            }
            prefixElement={selectedIndex.includes(index) ? <Check /> : <></>}
            suffixElement={
              <div
                className={tcx(
                  "mr-1 ml-2 flex items-center justify-center rounded-md border px-1",
                  activeIndex === index && "bg-menu-background",
                  selectedIndex.includes(index) && activeIndex !== index
                    ? "border-white/20"
                    : "border-transparent"
                )}
              >
                Badge
              </div>
            }
          >
            <span className="flex-1 truncate">{option.label}</span>
          </Menus.Item>
        ))}
      </Menus>
    );
  },
};

export const Variant: Story = {
  render: function VariantStory() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    return (
      <Menus>
        <Menus.Item
          variant="highlight"
          active={activeIndex === 0}
          onMouseEnter={() => setActiveIndex(0)}
          onMouseLeave={() => setActiveIndex(null)}
        >
          Highlight
        </Menus.Item>
        <Menus.Item
          variant="danger"
          active={activeIndex === 1}
          onMouseEnter={() => setActiveIndex(1)}
          onMouseLeave={() => setActiveIndex(null)}
        >
          Danger
        </Menus.Item>
      </Menus>
    );
  },
};
