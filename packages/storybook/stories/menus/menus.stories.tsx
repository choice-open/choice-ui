import {
  Menus,
  MenuSearch,
  MenuSearchEmpty,
  NumericInput,
} from "@choiceform/design-system";
import { Check, Search } from "@choiceform/icons-react";
import { faker } from "@faker-js/faker";
import { Story } from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState } from "react";

const meta: Meta<typeof Menus> = {
  title: "Collections/Menus",
  component: Menus,
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

type Story = StoryObj<typeof Menus>;

const options = Array.from({ length: 6 }, () => ({
  label: faker.music.songName(),
  value: faker.string.uuid(),
}));

/**
 * `Menus` is a versatile component for displaying lists of options or actions in a consistent format.
 *
 * Features:
 * - Consistent styling for menu items with active states
 * - Support for prefix and suffix elements
 * - Dividers for separating groups of options
 * - Labels for categorizing menu sections
 * - Built-in search functionality
 * - Accessible keyboard navigation
 * - Input and button elements for enhanced interaction
 *
 * Usage Guidelines:
 * - Use for dropdown menus, context menus, or option lists
 * - Provide clear visual feedback for active/hover states
 * - Group related items and use dividers to separate logical sections
 * - Add selection indicators for multi-select or current selection
 *
 * Accessibility:
 * - Supports keyboard navigation
 * - Proper ARIA roles for menu structures
 * - Visual indicators for focus and active states
 * - Clear selection indicators for screen readers
 */

/**
 * Basic: Demonstrates the standard Menus component with simple items.
 *
 * Features:
 * - Active state on hover for visual feedback
 * - Clean, consistent styling for all items
 * - Truncation for long text with flexbox layout
 *
 * This example shows the fundamental usage pattern with dynamic content.
 */
export const Basic: Story = {
  render: function BasicStory() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
      <Menus className="w-64">
        {options.map((option, index) => (
          <Menus.Item
            key={option.value}
            active={activeIndex === index}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <span className="flex-1 truncate">{option.label}</span>
          </Menus.Item>
        ))}
      </Menus>
    );
  },
};

/**
 * SearchStory: Demonstrates integrating search functionality into menus.
 *
 * Features:
 * - Live filtering of menu items as you type
 * - Clear visual separation with dividers
 * - Empty state handling when no results match
 * - Option to clear search and reset results
 *
 * This pattern is useful for:
 * - Long lists where users need to quickly find options
 * - Command palettes or feature search
 * - Dropdown selects with many options
 */
export const SearchStory: Story = {
  render: function SearchStory() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [search, setSearch] = useState("");

    const filteredOptions = useMemo(() => {
      return options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase())
      );
    }, [search]);

    return (
      <Menus className="w-64">
        <MenuSearch value={search} onChange={setSearch} />

        <Menus.Divider />

        {filteredOptions.map((option, index) => (
          <Menus.Item
            key={option.value}
            active={activeIndex === index}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <span className="flex-1 truncate">{option.label}</span>
          </Menus.Item>
        ))}

        {filteredOptions.length === 0 && (
          <MenuSearchEmpty onClear={() => setSearch("")}>
            <Search
              className="text-secondary-foreground"
              width={32}
              height={32}
            />
          </MenuSearchEmpty>
        )}
      </Menus>
    );
  },
};

/**
 * InputStory: Demonstrates using an input field within a menu.
 *
 * Features:
 * - Input field for text entry directly in the menu
 * - Visual separation between input and menu items
 * - Maintains consistent styling with the menu component
 *
 * This pattern is useful for:
 * - Custom inputs within dropdown menus
 * - Creating new items in a select menu
 * - Filtering with more complex input requirements
 */
export const InputStory: Story = {
  render: function InputStory() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    return (
      <Menus className="w-64">
        <Menus.Input />

        <Menus.Divider />

        {options.map((option, index) => (
          <Menus.Item
            key={option.value}
            active={activeIndex === index}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <span className="flex-1 truncate">{option.label}</span>
          </Menus.Item>
        ))}
      </Menus>
    );
  },
};

/**
 * ButtonStory: Demonstrates incorporating action buttons and selection in menus.
 *
 * Features:
 * - Multi-selection with visual indicators
 * - Section labels for context
 * - Action button for bulk operations
 * - Dividers for logical separation
 * - Prefix elements showing selection state
 *
 * This pattern is useful for:
 * - Multi-select dropdown menus
 * - Lists with bulk actions
 * - Settings menus with toggleable options
 */
export const ButtonStory: Story = {
  render: function ButtonStory() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number[]>([]);
    return (
      <Menus className="w-64">
        <Menus.Label>Menu</Menus.Label>
        {options.map((option, index) => (
          <Menus.Item
            key={option.value}
            active={activeIndex === index}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            selected={selectedIndex.includes(index)}
            prefixElement={selectedIndex.includes(index) ? <Check /> : <></>}
            onMouseDown={() =>
              setSelectedIndex((prev) =>
                prev.includes(index)
                  ? prev.filter((i) => i !== index)
                  : [...prev, index]
              )
            }
          >
            <span className="flex-1 truncate">{option.label}</span>
          </Menus.Item>
        ))}
        <Menus.Divider />
        <Menus.Button onClick={() => setSelectedIndex([])}>Button</Menus.Button>
      </Menus>
    );
  },
};

export const NumberInputStory: Story = {
  render: function NumberInputStory() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number[]>([]);
    const [value, setValue] = useState(0);
    return (
      <Menus className="w-64">
        <NumericInput
          variant="dark"
          value={value}
          onChange={(newValue) => setValue(newValue as number)}
        />
        <Menus.Divider />
        {options.map((option, index) => (
          <Menus.Item
            key={option.value}
            active={activeIndex === index}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            selected={selectedIndex.includes(index)}
            prefixElement={selectedIndex.includes(index) ? <Check /> : <></>}
            onMouseDown={() =>
              setSelectedIndex((prev) =>
                prev.includes(index)
                  ? prev.filter((i) => i !== index)
                  : [...prev, index]
              )
            }
          >
            <span className="flex-1 truncate">{option.label}</span>
          </Menus.Item>
        ))}
        <Menus.Divider />
        <Menus.Button onClick={() => setSelectedIndex([])}>Button</Menus.Button>
      </Menus>
    );
  },
};

/**
 * variant: Demonstrates the different variants of the Menus component.
 * - default: Follows the page theme dynamically (light/dark mode)
 * - light: Fixed light appearance regardless of theme
 * - dark: Fixed dark appearance regardless of theme
 * - reset: Removes variant styling, no variant settings applied
 */
export const Variant: Story = {
  render: function VariantStory() {
    const [activeDefaultIndex, setActiveDefaultIndex] = useState<number | null>(
      null
    );
    const [activeLightIndex, setActiveLightIndex] = useState<number | null>(
      null
    );
    const [activeDarkIndex, setActiveDarkIndex] = useState<number | null>(null);
    return (
      <div className="grid grid-cols-3 gap-2">
        <Menus variant="default">
          <Menus.Label>Default</Menus.Label>
          <Menus.Item
            active={activeDefaultIndex === 0}
            onMouseEnter={() => setActiveDefaultIndex(0)}
            onMouseLeave={() => setActiveDefaultIndex(null)}
          >
            Default
          </Menus.Item>
          <Menus.Item
            variant="highlight"
            active={activeDefaultIndex === 1}
            onMouseEnter={() => setActiveDefaultIndex(1)}
            onMouseLeave={() => setActiveDefaultIndex(null)}
          >
            Highlight
          </Menus.Item>
          <Menus.Item
            variant="danger"
            active={activeDefaultIndex === 2}
            onMouseEnter={() => setActiveDefaultIndex(2)}
            onMouseLeave={() => setActiveDefaultIndex(null)}
          >
            Danger
          </Menus.Item>
          <Menus.Divider />
          <Menus.Item
            variant="reset"
            active={activeDefaultIndex === 3}
            onMouseEnter={() => setActiveDefaultIndex(3)}
            onMouseLeave={() => setActiveDefaultIndex(null)}
            disabled
          >
            Disabled
          </Menus.Item>
        </Menus>

        <Menus variant="light">
          <Menus.Label>Light</Menus.Label>
          <Menus.Item
            active={activeLightIndex === 0}
            onMouseEnter={() => setActiveLightIndex(0)}
            onMouseLeave={() => setActiveLightIndex(null)}
          >
            Default
          </Menus.Item>
          <Menus.Item
            variant="highlight"
            active={activeLightIndex === 1}
            onMouseEnter={() => setActiveLightIndex(1)}
            onMouseLeave={() => setActiveLightIndex(null)}
          >
            Highlight
          </Menus.Item>
          <Menus.Item
            variant="danger"
            active={activeLightIndex === 2}
            onMouseEnter={() => setActiveLightIndex(2)}
            onMouseLeave={() => setActiveLightIndex(null)}
          >
            Danger
          </Menus.Item>
          <Menus.Divider />
          <Menus.Item
            variant="reset"
            active={activeLightIndex === 3}
            onMouseEnter={() => setActiveLightIndex(3)}
            onMouseLeave={() => setActiveLightIndex(null)}
            disabled
          >
            Disabled
          </Menus.Item>
        </Menus>
      </div>
    );
  },
};
