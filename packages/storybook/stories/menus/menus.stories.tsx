import { Avatar, KbdKey, Menus, NumericInput, tcx } from "@choice-ui/react"
import {
  Check,
  ChevronRightSmall,
  HugWidth,
  Search,
  ThemeMoonDark,
  ThemeSunBright,
  ThemeSystem,
} from "@choiceform/icons-react"
import { faker } from "@faker-js/faker"
import { Story } from "@storybook/addon-docs/blocks"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { ReactNode, useMemo, useState } from "react"

const meta: Meta<typeof Menus> = {
  title: "Collections/Menus",
  component: Menus,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof Menus>

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
    const [activeIndex, setActiveIndex] = useState<number | null>(null)

    return (
      <Menus>
        <Menus.Item
          active={activeIndex === 0}
          onMouseEnter={() => setActiveIndex(0)}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <Menus.Value>Item</Menus.Value>
        </Menus.Item>
      </Menus>
    )
  },
}

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
    const [activeIndex, setActiveIndex] = useState<number | null>(null)

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
    ]

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
            <Menus.Value>{option.label}</Menus.Value>
          </Menus.Item>
        ))}
      </Menus>
    )
  },
}

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
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
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
            <Menus.Value>Item</Menus.Value>
          </Menus.Item>
        ))}
      </Menus>
    )
  },
}

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
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
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
    ]
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
            <Menus.Value>{option.label}</Menus.Value>
          </Menus.Item>
        ))}
      </Menus>
    )
  },
}

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
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
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
            <Menus.Value>Item</Menus.Value>
          </Menus.Item>
        ))}
      </Menus>
    )
  },
}

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
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const [selectedIndex, setSelectedIndex] = useState<number[]>([])
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
                prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
              )
            }
          >
            <Menus.Value>Item</Menus.Value>
          </Menus.Item>
        ))}
      </Menus>
    )
  },
}

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
      [],
    )

    const [activeIndex, setActiveIndex] = useState<number | null>(null)

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
            <Menus.Value>{option.name}</Menus.Value>
          </Menus.Item>
        ))}
      </Menus>
    )
  },
}

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
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const [selectedIndex, setSelectedIndex] = useState<number[]>([])

    const Options = useMemo(
      () =>
        Array.from({ length: 4 }, (_, index) => ({
          label: faker.music.songName(),
        })),
      [],
    )

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
                prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
              )
            }
            prefixElement={selectedIndex.includes(index) ? <Check /> : <></>}
            suffixElement={
              <div
                className={tcx(
                  "ml-2 flex items-center justify-center rounded-md border px-1",
                  activeIndex === index && "bg-menu-background",
                  selectedIndex.includes(index) && activeIndex !== index
                    ? "border-white/20"
                    : "border-transparent",
                )}
              >
                Badge
              </div>
            }
          >
            <Menus.Value>{option.label}</Menus.Value>
          </Menus.Item>
        ))}
      </Menus>
    )
  },
}

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
    const [activeIndex, setActiveIndex] = useState<number | null>(null)

    const options = [
      { label: "Yesterday", value: "1" },
      { label: "Bohemian Rhapsody", value: "2" },
      { label: "Imagine", value: "3" },
      { label: "Hotel California", value: "4" },
      { label: "Stairway to Heaven", value: "5" },
      { label: "Hey Jude", value: "6" },
    ]

    return (
      <Menus className="w-64">
        {options.map((option, index) => (
          <Menus.Item
            key={option.value}
            active={activeIndex === index}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <Menus.Value>{option.label}</Menus.Value>
          </Menus.Item>
        ))}
      </Menus>
    )
  },
}

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
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const [search, setSearch] = useState("")

    const options = [
      { label: "Yesterday", value: "1" },
      { label: "Bohemian Rhapsody", value: "2" },
      { label: "Imagine", value: "3" },
      { label: "Hotel California", value: "4" },
      { label: "Stairway to Heaven", value: "5" },
      { label: "Hey Jude", value: "6" },
    ]
    const filteredOptions = useMemo(() => {
      return options.filter((option) => option.label.toLowerCase().includes(search.toLowerCase()))
    }, [search])

    return (
      <Menus className="w-64">
        <Menus.Search
          value={search}
          onChange={setSearch}
        />

        <Menus.Divider />

        {filteredOptions.map((option, index) => (
          <Menus.Item
            key={option.value}
            active={activeIndex === index}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <Menus.Value>{option.label}</Menus.Value>
          </Menus.Item>
        ))}

        {filteredOptions.length === 0 && (
          <Menus.SearchEmpty onClear={() => setSearch("")}>
            <Search
              className="text-secondary-foreground"
              width={32}
              height={32}
            />
          </Menus.SearchEmpty>
        )}
      </Menus>
    )
  },
}

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
    const [activeIndex, setActiveIndex] = useState<number | null>(null)

    const options = [
      { label: "Yesterday", value: "1" },
      { label: "Bohemian Rhapsody", value: "2" },
      { label: "Imagine", value: "3" },
      { label: "Hotel California", value: "4" },
      { label: "Stairway to Heaven", value: "5" },
      { label: "Hey Jude", value: "6" },
    ]

    return (
      <Menus className="w-64">
        <Menus.Input placeholder="Search..." />

        <Menus.Divider />

        {options.map((option, index) => (
          <Menus.Item
            key={option.value}
            active={activeIndex === index}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <Menus.Value>{option.label}</Menus.Value>
          </Menus.Item>
        ))}
      </Menus>
    )
  },
}

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
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const [selectedIndex, setSelectedIndex] = useState<number[]>([])

    const options = [
      { label: "Yesterday", value: "1" },
      { label: "Bohemian Rhapsody", value: "2" },
      { label: "Imagine", value: "3" },
      { label: "Hotel California", value: "4" },
      { label: "Stairway to Heaven", value: "5" },
      { label: "Hey Jude", value: "6" },
    ]

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
                prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
              )
            }
          >
            <Menus.Value>{option.label}</Menus.Value>
          </Menus.Item>
        ))}
        <Menus.Divider />
        <Menus.Button onClick={() => setSelectedIndex([])}>Clean</Menus.Button>
      </Menus>
    )
  },
}

/**
 * NumberInputStory: Demonstrates using a numeric input within a menu.
 *
 * Features:
 * - Numeric input for integer values
 * - Visual separation between input and menu items
 * - Maintains consistent styling with the menu component
 *
 */
export const NumberInputStory: Story = {
  render: function NumberInputStory() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const [selectedIndex, setSelectedIndex] = useState<number[]>([])
    const [value, setValue] = useState(0)

    const options = [
      { label: "Yesterday", value: "1" },
      { label: "Bohemian Rhapsody", value: "2" },
      { label: "Imagine", value: "3" },
      { label: "Hotel California", value: "4" },
      { label: "Stairway to Heaven", value: "5" },
      { label: "Hey Jude", value: "6" },
    ]

    return (
      <Menus className="w-64">
        <NumericInput
          variant="dark"
          value={value}
          onChange={(newValue) => setValue(newValue as number)}
        >
          <NumericInput.Prefix>
            <HugWidth />
          </NumericInput.Prefix>
        </NumericInput>
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
                prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
              )
            }
          >
            <Menus.Value>{option.label}</Menus.Value>
          </Menus.Item>
        ))}
        <Menus.Divider />
        <Menus.Button onClick={() => setSelectedIndex([])}>Clean</Menus.Button>
      </Menus>
    )
  },
}

/**
 * variant: Demonstrates the different variants of the Menus component.
 * - default: Follows the page theme dynamically (light/dark mode)
 * - light: Fixed light appearance regardless of theme
 * - dark: Fixed dark appearance regardless of theme
 * - reset: Removes variant styling, no variant settings applied
 */
export const Variant: Story = {
  render: function VariantStory() {
    const [activeDefaultIndex, setActiveDefaultIndex] = useState<number | null>(null)
    const [activeLightIndex, setActiveLightIndex] = useState<number | null>(null)
    const [activeDarkIndex, setActiveDarkIndex] = useState<number | null>(null)
    return (
      <div className="grid grid-cols-3 gap-2">
        <Menus variant="default">
          <Menus.Label>Default</Menus.Label>
          <Menus.Item
            active={activeDefaultIndex === 0}
            onMouseEnter={() => setActiveDefaultIndex(0)}
            onMouseLeave={() => setActiveDefaultIndex(null)}
          >
            <Menus.Value>Default</Menus.Value>
          </Menus.Item>
          <Menus.Item
            variant="highlight"
            active={activeDefaultIndex === 1}
            onMouseEnter={() => setActiveDefaultIndex(1)}
            onMouseLeave={() => setActiveDefaultIndex(null)}
          >
            <Menus.Value>Highlight</Menus.Value>
          </Menus.Item>
          <Menus.Item
            variant="danger"
            active={activeDefaultIndex === 2}
            onMouseEnter={() => setActiveDefaultIndex(2)}
            onMouseLeave={() => setActiveDefaultIndex(null)}
          >
            <Menus.Value>Danger</Menus.Value>
          </Menus.Item>
          <Menus.Divider />
          <Menus.Item
            variant="reset"
            active={activeDefaultIndex === 3}
            onMouseEnter={() => setActiveDefaultIndex(3)}
            onMouseLeave={() => setActiveDefaultIndex(null)}
            disabled
          >
            <Menus.Value>Disabled</Menus.Value>
          </Menus.Item>
        </Menus>

        <Menus variant="light">
          <Menus.Label>Light</Menus.Label>
          <Menus.Item
            active={activeLightIndex === 0}
            onMouseEnter={() => setActiveLightIndex(0)}
            onMouseLeave={() => setActiveLightIndex(null)}
          >
            <Menus.Value>Default</Menus.Value>
          </Menus.Item>
          <Menus.Item
            variant="highlight"
            active={activeLightIndex === 1}
            onMouseEnter={() => setActiveLightIndex(1)}
            onMouseLeave={() => setActiveLightIndex(null)}
          >
            <Menus.Value>Highlight</Menus.Value>
          </Menus.Item>
          <Menus.Item
            variant="danger"
            active={activeLightIndex === 2}
            onMouseEnter={() => setActiveLightIndex(2)}
            onMouseLeave={() => setActiveLightIndex(null)}
          >
            <Menus.Value>Danger</Menus.Value>
          </Menus.Item>
          <Menus.Divider />
          <Menus.Item
            variant="reset"
            active={activeLightIndex === 3}
            onMouseEnter={() => setActiveLightIndex(3)}
            onMouseLeave={() => setActiveLightIndex(null)}
            disabled
          >
            <Menus.Value>Disabled</Menus.Value>
          </Menus.Item>
        </Menus>
      </div>
    )
  },
}
