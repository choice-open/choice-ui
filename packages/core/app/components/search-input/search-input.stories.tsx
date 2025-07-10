import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { useState } from "react"
import { SearchInput } from "./search-input"

const meta: Meta<typeof SearchInput> = {
  title: "Forms/SearchInput",
  component: SearchInput,
  tags: ["new"],
}

export default meta

type Story = StoryObj<typeof SearchInput>

/**
 * `SearchInput` is a specialized input component designed for search functionality with built-in
 * search icon and clear button.
 *
 * Features:
 * - Search icon prefix for visual identification
 * - Clear button that appears when text is entered
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
 * Dark: Demonstrates the SearchInput with dark mode styling.
 *
 * The dark variant is designed for use on dark backgrounds and inverts
 * the color scheme appropriately. This example shows the component
 * in a dark container with proper contrast and visibility.
 */
export const Dark: Story = {
  render: function DarkStory() {
    const [value, setValue] = useState("")

    return (
      <div className="flex aspect-square items-center justify-center bg-gray-800 p-8">
        <SearchInput
          value={value}
          onChange={setValue}
          variant="dark"
        />
      </div>
    )
  },
}

/**
 * DarkWithDisabled: Shows the SearchInput in dark mode with disabled state.
 *
 * This example demonstrates how the disabled state appears when using
 * the dark variant. The component maintains appropriate visual indication
 * of the disabled state while adapting to the dark background.
 */
export const DarkWithDisabled: Story = {
  render: function DarkWithDisabledStory() {
    const [value, setValue] = useState("")

    return (
      <div className="flex aspect-square items-center justify-center bg-gray-800 p-8">
        <SearchInput
          value={value}
          onChange={setValue}
          variant="dark"
          disabled
        />
      </div>
    )
  },
}
