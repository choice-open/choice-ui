import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { useState } from "react"
import { SearchInput } from "./search-input"
import { Checkbox } from "../checkbox/checkbox"

const meta: Meta<typeof SearchInput> = {
  title: "Forms/SearchInput",
  component: SearchInput,
  tags: ["new"],
}

export default meta

type Story = StoryObj<typeof SearchInput>

/**
 * `SearchInput` is a specialized input component designed for search functionality with built-in
 * search icon and optional clear button.
 *
 * Features:
 * - Search icon prefix for visual identification
 * - Optional clear button that appears when text is entered
 * - Support for different sizes and variants
 * - Built on top of the core TextField component
 * - Dark mode support
 * - Disabled state styling
 *
 * Usage Guidelines:
 * - Use for search functionality within applications
 * - Provide clear placeholder text to indicate searchable content
 * - Handle the onChange callback to process search queries
 * - Consider debouncing search requests for performance
 * - Place in navigation bars, toolbars, or filter sections
 * - Use `clearable={false}` to hide the clear button when not needed
 *
 * Accessibility:
 * - Includes proper ARIA labels for the search and clear functions
 * - Maintains keyboard navigation support
 * - Provides visual indication of focus states
 * - Clear button has tooltip for screen reader support
 * - Supports standard input accessibility patterns
 */

/**
 * Basic: Demonstrates the default SearchInput with standard styling.
 *
 * This example shows the fundamental implementation with controlled input
 * handling. The component displays a search icon and automatically shows
 * a clear button when text is entered.
 */
export const Basic: Story = {
  render: function BasicStory() {
    const [value, setValue] = useState("")

    return (
      <SearchInput
        value={value}
        onChange={setValue}
      />
    )
  },
}

/**
 * Size: Demonstrates the SearchInput with larger sizing.
 *
 * The "large" size provides increased visibility and touch target size,
 * making it more suitable for:
 * - Primary search interfaces
 * - Touch-optimized interfaces
 * - Applications with emphasis on search functionality
 */
export const Size: Story = {
  render: function SizeStory() {
    const [value, setValue] = useState("")

    return (
      <SearchInput
        value={value}
        onChange={setValue}
        size="large"
      />
    )
  },
}

/**
 * Disabled: Shows the SearchInput in its disabled state.
 *
 * The disabled state visually indicates that the search functionality
 * is currently unavailable. Use this state when:
 * - Search is not applicable in the current context
 * - The user doesn't have permission to search
 * - Search functionality is temporarily unavailable
 */
export const Disabled: Story = {
  render: function DisabledStory() {
    return <SearchInput disabled />
  },
}

/**
 * NotClearable: Demonstrates SearchInput without the clear button.
 *
 * Setting `clearable={false}` hides the clear button even when there is text.
 * This is useful when:
 * - You want a simpler UI without the clear action
 * - The search is meant to be persistent
 * - You're implementing custom clearing logic elsewhere
 * - The use case doesn't require quick clearing
 */
export const NotClearable: Story = {
  render: function NotClearableStory() {
    const [value, setValue] = useState("Search text without clear button")

    return (
      <SearchInput
        value={value}
        onChange={setValue}
        clearable={false}
      />
    )
  },
}

/**
 * Variants: Demonstrates different visual variants of the numeric input component.
 * - default: Follows the page theme dynamically (light/dark mode)
 * - light: Fixed light appearance regardless of theme
 * - dark: Fixed dark appearance regardless of theme
 * - reset: Removes variant styling, no variant settings applied
 */
export const Variants: Story = {
  render: function VariantsStory() {
    const [value, setValue] = useState("")
    const [disabled, setDisabled] = useState(false)

    return (
      <div className="flex flex-col gap-2">
        <Checkbox
          value={disabled}
          onChange={(value) => setDisabled(value)}
        >
          Disabled
        </Checkbox>
        <div className="grid grid-cols-3 overflow-hidden rounded-xl border">
          <div className="bg-default-background flex aspect-square items-center justify-center p-8">
            <SearchInput
              disabled={disabled}
              value={value}
              onChange={setValue}
            />
          </div>
          <div className="flex aspect-square items-center justify-center bg-white p-8">
            <SearchInput
              disabled={disabled}
              value={value}
              onChange={setValue}
              variant="light"
            />
          </div>
          <div className="flex aspect-square items-center justify-center bg-gray-800 p-8">
            <SearchInput
              disabled={disabled}
              value={value}
              onChange={setValue}
              variant="dark"
            />
          </div>
        </div>
      </div>
    )
  },
}
