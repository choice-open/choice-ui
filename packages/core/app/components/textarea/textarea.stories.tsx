/**
 * `Textarea` is a flexible, accessible multi-line text input component with advanced features like auto-resizing and custom scrollbars.
 *
 * Features:
 * - Multiple resize modes: auto-sizing, manual resize with drag handle, or fixed size
 * - Custom scrollbars using ScrollArea component for consistent styling
 * - Height constraints with minRows and maxRows support
 * - Multiple visual variants (default, dark, reset)
 * - Full accessibility support with proper focus management
 * - Integration with react-textarea-autosize for dynamic height
 *
 * Usage:
 * - Use for multi-line text input in forms, comments, descriptions, or any text content
 * - Choose appropriate resize mode based on your layout requirements
 * - Set minRows/maxRows to control height boundaries
 *
 * Best Practices:
 * - Use `resize="auto"` for content that should grow with user input
 * - Use `resize="handle"` when users need manual control over height
 * - Use `resize={false}` with `rows` prop for fixed-height textareas
 * - Always provide meaningful placeholder text
 * - Consider character limits and validation for user guidance
 *
 * Accessibility:
 * - Supports keyboard navigation and screen readers
 * - Proper focus management with visual indicators
 * - ARIA attributes for enhanced accessibility
 * - High contrast support in all variants
 */

import type { Meta, StoryObj } from "@storybook/react"
import React, { useState } from "react"
import { Textarea } from "./index"
import { Switch } from "../switch"
import { Checkbox } from "../checkbox/checkbox"

const meta: Meta<typeof Textarea> = {
  title: "Forms/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs", "new"],
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default: Basic textarea with auto-resize behavior and default styling.
 *
 * Features:
 * - Auto-sizing based on content
 * - Default visual styling
 * - Basic placeholder text
 *
 * Usage:
 * ```tsx
 * <Textarea placeholder="Enter your text here..." />
 * ```
 */
export const Default: Story = {
  args: {
    placeholder: "Enter your text here...",
    className: "w-80",
  },
}

/**
 * Controlled: Demonstrates controlled textarea with state management.
 *
 * Features:
 * - Controlled input with React state
 * - Real-time value updates
 * - Programmatic value control
 *
 * Usage:
 * ```tsx
 * const [value, setValue] = useState("Initial text")
 *
 * return (
 *   <Textarea
 *     value={value}
 *     onChange={setValue}
 *     placeholder="Enter your text..."
 *   />
 * )
 * ```
 *
 * Best Practices:
 * - Use controlled mode when you need to validate, format, or sync with other components
 * - Always provide an onChange handler for controlled inputs
 */
export const WithValue: Story = {
  render: function WithValue() {
    const [value, setValue] = useState("This is a textarea with some initial text content.")
    return (
      <Textarea
        value={value}
        onChange={setValue}
        placeholder="Enter your text here..."
        className="w-80"
      />
    )
  },
}

/**
 * Variants: Demonstrates different visual variants of the textarea component.
 *
 * Features:
 * - default: Follows the page theme dynamically (light/dark mode)
 * - light: Fixed light appearance regardless of theme
 * - dark: Fixed dark appearance regardless of theme
 * - reset: Removes variant styling, no variant settings applied
 *
 * Usage:
 * ```tsx
 * <Textarea
 *   variant="default" // Adapts to current theme
 *   placeholder="Enter text..."
 * />
 * ```
 *
 * Best Practices:
 * - Use default variant for inputs that adapt to the current theme
 * - Use light/dark variants when you need fixed appearance
 * - Use reset variant to remove all variant-specific styling
 */
export const Variants: Story = {
  render: function Variants() {
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
          <div className="bg-default-background p-8">
            <Textarea
              disabled={disabled}
              placeholder="Default variant - follows theme..."
            />
          </div>
          <div className="bg-white p-8">
            <Textarea
              disabled={disabled}
              variant="light"
              placeholder="Light variant - fixed light..."
            />
          </div>
          <div className="bg-gray-800 p-8">
            <Textarea
              disabled={disabled}
              variant="dark"
              placeholder="Dark variant - fixed dark..."
            />
          </div>
        </div>
      </div>
    )
  },
}

/**
 * Selected State: Textarea in selected/focused state with visual emphasis.
 *
 * Features:
 * - Visual indication of selection/focus
 * - Enhanced border styling
 * - Clear state differentiation
 *
 * Usage:
 * ```tsx
 * <Textarea
 *   selected={true}
 *   value="Selected content"
 * />
 * ```
 *
 * Best Practices:
 * - Use to highlight important or active textareas in complex forms
 * - Combine with focus management for better UX
 */
export const Selected: Story = {
  args: {
    selected: true,
    value: "This textarea is in selected state",
    className: "w-80",
  },
}

/**
 * Disabled State: Non-interactive textarea for display-only content.
 *
 * Features:
 * - Visual disabled styling
 * - Prevents user interaction
 * - Maintains content visibility
 *
 * Usage:
 * ```tsx
 * <Textarea
 *   disabled={true}
 *   value="Read-only content"
 * />
 * ```
 *
 * Accessibility:
 * - Properly communicated to screen readers
 * - Skipped in keyboard navigation
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    value: "This textarea is disabled",
    className: "w-80",
  },
}

/**
 * Read-Only: Interactive but non-editable textarea for content display.
 *
 * Features:
 * - Focusable but not editable
 * - Supports text selection and copying
 * - Visual indication of read-only state
 *
 * Usage:
 * ```tsx
 * <Textarea
 *   readOnly={true}
 *   value="Display content"
 * />
 * ```
 *
 * Best Practices:
 * - Use when users need to view/copy content but not edit it
 * - Prefer over disabled when selection/copying is needed
 */
export const ReadOnly: Story = {
  args: {
    readOnly: true,
    value: "This textarea is read-only",
    className: "w-80",
  },
}

/**
 * Height Constraints: Textarea with minimum and maximum row limits.
 *
 * Features:
 * - Controlled height boundaries with minRows and maxRows
 * - Auto-sizing within defined limits
 * - Scrolling when content exceeds maxRows
 *
 * Usage:
 * ```tsx
 * <Textarea
 *   minRows={2}
 *   maxRows={8}
 *   placeholder="Constrained height textarea"
 * />
 * ```
 *
 * Best Practices:
 * - Set minRows to ensure adequate initial space
 * - Set maxRows to prevent excessive height in layouts
 * - Consider content length when setting limits
 */
export const WithMinMaxRows: Story = {
  args: {
    minRows: 2,
    maxRows: 8,
    placeholder: "This textarea has minRows=2 and maxRows=8",
    className: "w-80",
  },
}

/**
 * Fixed Size: Textarea with fixed height that doesn't auto-resize.
 *
 * Features:
 * - Fixed height based on rows prop
 * - No automatic resizing
 * - Scrollable content when overflow occurs
 *
 * Usage:
 * ```tsx
 * <Textarea
 *   resize={false}
 *   rows={4}
 *   placeholder="Fixed height textarea"
 * />
 * ```
 *
 * Best Practices:
 * - Use in grid layouts or when consistent height is required
 * - Ensure sufficient rows for expected content
 * - Consider UX impact of fixed sizing
 */
export const WithoutAutosize: Story = {
  args: {
    resize: false,
    rows: 4,
    placeholder: "This textarea does not auto-resize",
    className: "w-80",
  },
}

/**
 * Scrollable Content: Textarea with long content demonstrating scroll behavior.
 *
 * Features:
 * - Custom scrollbar styling via ScrollArea
 * - Smooth scrolling experience
 * - Height limits with maxRows causing overflow
 *
 * Usage:
 * ```tsx
 * const [longText, setLongText] = useState("Very long content...")
 *
 * return (
 *   <Textarea
 *     value={longText}
 *     onChange={setLongText}
 *     maxRows={6}
 *   />
 * )
 * ```
 *
 * Best Practices:
 * - Set appropriate maxRows for your layout
 * - Consider character limits for very long content
 * - Test scrolling behavior across different devices
 */
export const LongContent: Story = {
  render: function LongContent() {
    const longContent = `This is a textarea with a lot of content to demonstrate scrolling behavior.
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.`
    const [value, setValue] = useState(longContent)
    return (
      <Textarea
        value={value}
        onChange={setValue}
        placeholder="This textarea has a lot of content to demonstrate scrolling behavior."
        className="w-80"
        maxRows={6}
      />
    )
  },
}

/**
 * Interactive Example: Textarea with real-time feedback and editing state tracking.
 *
 * Features:
 * - Real-time character counting
 * - Editing state detection
 * - Live feedback display
 *
 * Usage:
 * ```tsx
 * const [value, setValue] = useState("")
 * const [isEditing, setIsEditing] = useState(false)
 *
 * return (
 *   <>
 *     <Textarea
 *       value={value}
 *       onChange={setValue}
 *       onIsEditingChange={setIsEditing}
 *     />
 *     <div>Characters: {value.length}</div>
 *   </>
 * )
 * ```
 *
 * Best Practices:
 * - Use onIsEditingChange for form validation timing
 * - Display character counts for limited-length fields
 * - Provide immediate feedback to users
 */
export const Interactive: Story = {
  render: function Interactive() {
    const [value, setValue] = useState("")
    const [isEditing, setIsEditing] = useState(false)

    return (
      <div className="flex flex-col gap-4">
        <Textarea
          value={value}
          onChange={setValue}
          onIsEditingChange={setIsEditing}
          placeholder="Type something..."
          className="w-80"
        />
        <div className="text-secondary-foreground text-body-small">
          <p>Character count: {value.length}</p>
          <p>Is editing: {isEditing ? "Yes" : "No"}</p>
        </div>
      </div>
    )
  },
}

/**
 * Manual Resize: Textarea with drag handle for manual height adjustment.
 *
 * Features:
 * - Draggable resize handle in bottom-right corner
 * - Manual height control with mouse/touch
 * - Height constraints respected during resize
 * - Visual feedback during drag operation
 *
 * Usage:
 * ```tsx
 * <Textarea
 *   resize="handle"
 *   minRows={3}
 *   maxRows={10}
 *   placeholder="Drag to resize..."
 * />
 * ```
 *
 * Best Practices:
 * - Set appropriate minRows/maxRows for your layout
 * - Use when users need precise control over textarea height
 * - Consider mobile accessibility for touch interactions
 * - Provide visual cues for the resize functionality
 *
 * Accessibility:
 * - Resize handle is keyboard accessible
 * - Clear visual indication of resize capability
 * - Maintains focus during resize operations
 */
export const ResizeHandle: Story = {
  render: function ResizeHandle() {
    const [value, setValue] = useState(
      "This textarea can be resized by dragging the handle in the bottom right corner. The height is constrained by minRows and maxRows.",
    )

    return (
      <Textarea
        className="w-80"
        resize="handle"
        minRows={3}
        maxRows={10}
        value={value}
        onChange={setValue}
        placeholder="Drag the resize handle to adjust height..."
      />
    )
  },
}

/**
 * Simple Usage: Demonstrates the default simple usage pattern.
 *
 * Features:
 * - Direct value and onChange props
 * - Auto-sizing with maxRows constraint
 * - Clean, minimal API
 *
 * Usage:
 * ```tsx
 * <Textarea
 *   value={value}
 *   onChange={setValue}
 *   placeholder="Enter text..."
 *   maxRows={6}
 * />
 * ```
 */
export const SimpleUsage: Story = {
  render: function SimpleUsage() {
    const [value, setValue] = useState("")

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-body-small mb-2">Simple Usage Pattern</h3>
          <Textarea
            value={value}
            onChange={setValue}
            placeholder="This textarea has a lot of content to demonstrate scrolling behavior."
            className="w-80"
            maxRows={6}
          />
        </div>
        <div className="text-body-small text-text-tertiary">Character count: {value.length}</div>
      </div>
    )
  },
}

/**
 * Compound Usage: Demonstrates the compound component pattern with Textarea.Content.
 *
 * Features:
 * - Custom content component
 * - Additional className on content
 * - Full control over TextareaAutosize props
 *
 * Usage:
 * ```tsx
 * <Textarea
 *   value={value}
 *   onChange={setValue}
 *   maxRows={6}
 * >
 *   <Textarea.Content className="custom-class" />
 * </Textarea>
 * ```
 */
export const CompoundUsage: Story = {
  render: function CompoundUsage() {
    const [value, setValue] = useState("")

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-body-small mb-2">Compound Component Pattern</h3>
          <Textarea
            value={value}
            onChange={setValue}
            placeholder="This textarea has a lot of content to demonstrate scrolling behavior."
            className="w-80"
            maxRows={6}
          >
            <Textarea.Content className="font-mono" />
          </Textarea>
        </div>
        <div className="text-body-small text-text-tertiary">
          Using Textarea.Content with custom font-mono class
        </div>
      </div>
    )
  },
}

/**
 * Focus Selection Modes: Demonstrates different focus selection behaviors.
 *
 * Features:
 * - "all": Selects all text on focus (default)
 * - "end": Moves cursor to end of text
 * - "none": No selection change
 *
 * Usage:
 * ```tsx
 * <Textarea
 *   focusSelection="end"
 *   value={value}
 *   onChange={setValue}
 * />
 * ```
 */
export const FocusSelectionModes: Story = {
  render: function FocusSelectionModes() {
    const [value1, setValue1] = useState("This text will be fully selected on focus")
    const [value2, setValue2] = useState("Cursor will move to the end on focus")
    const [value3, setValue3] = useState("No selection change on focus")

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-body-small mb-2">Select All (Default)</h3>
          <Textarea
            value={value1}
            onChange={setValue1}
            focusSelection="all"
            placeholder="Click to select all text..."
            className="w-80"
            minRows={2}
            maxRows={4}
          />
          <p className="text-body-small text-text-tertiary mt-1">
            focusSelection=&quot;all&quot; - Selects all text when focused
          </p>
        </div>

        <div>
          <h3 className="text-body-small mb-2">Move to End</h3>
          <Textarea
            value={value2}
            onChange={setValue2}
            focusSelection="end"
            placeholder="Click to move cursor to end..."
            className="w-80"
            minRows={2}
            maxRows={4}
          />
          <p className="text-body-small text-text-tertiary mt-1">
            focusSelection=&quot;end&quot; - Moves cursor to end of text
          </p>
        </div>

        <div>
          <h3 className="text-body-small mb-2">No Selection</h3>
          <Textarea
            value={value3}
            onChange={setValue3}
            focusSelection="none"
            placeholder="Click anywhere to focus..."
            className="w-80"
            minRows={2}
            maxRows={4}
          />
          <p className="text-body-small text-text-tertiary mt-1">
            focusSelection=&quot;none&quot; - Maintains cursor position
          </p>
        </div>
      </div>
    )
  },
}

/**
 * No Newline Mode: Demonstrates textarea that prevents newline on Enter.
 *
 * Features:
 * - Prevents Enter key from creating new lines
 * - Useful for single-line input scenarios
 * - Still allows text wrapping visually
 *
 * Usage:
 * ```tsx
 * <Textarea
 *   allowNewline={false}
 *   value={value}
 *   onChange={setValue}
 * />
 * ```
 */
export const NoNewlineMode: Story = {
  render: function NoNewlineMode() {
    const [value, setValue] = useState("")

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-body-small mb-2">No Newline Allowed</h3>
          <Textarea
            value={value}
            onChange={setValue}
            allowNewline={false}
            placeholder="Press Enter - it won't create a new line..."
            className="w-80"
            minRows={2}
            maxRows={4}
          />
          <p className="text-body-small text-text-tertiary mt-1">
            allowNewline=false - Enter key is disabled
          </p>
        </div>

        <div>
          <h3 className="text-body-small mb-2">Normal Mode (for comparison)</h3>
          <Textarea
            value={value}
            onChange={setValue}
            allowNewline={true}
            placeholder="Press Enter to create new lines..."
            className="w-80"
            minRows={2}
            maxRows={4}
          />
          <p className="text-body-small text-text-tertiary mt-1">
            allowNewline=true (default) - Enter key works normally
          </p>
        </div>
      </div>
    )
  },
}

/**
 * Custom Line Height: Demonstrates the customizable lineHeight prop.
 *
 * Features:
 * - Adjustable line height for different text densities
 * - Automatic height calculation based on custom line height
 * - Works with minRows and maxRows
 *
 * Usage:
 * ```tsx
 * <Textarea
 *   lineHeight={24}
 *   minRows={3}
 *   value={value}
 *   onChange={setValue}
 * />
 * ```
 */
export const CustomLineHeight: Story = {
  render: function CustomLineHeight() {
    const [value, setValue] = useState(
      "Default line height (16px)\nThis is line 2\nThis is line 3\nThis is line 4",
    )
    const [size, setSize] = useState<"default" | "large">("default")

    return (
      <div className="space-y-6">
        <Switch
          value={size === "large"}
          onChange={() => setSize(size === "large" ? "default" : "large")}
        >
          <Switch.Label>Size</Switch.Label>
        </Switch>

        <Textarea
          value={value}
          onChange={setValue}
          minRows={3}
          maxRows={5}
          className="w-80"
          placeholder="Default line height..."
          lineHeight={size === "large" ? 22 : 16}
        >
          <Textarea.Content className={size === "large" ? "text-body-large" : "text-body-medium"} />
        </Textarea>
      </div>
    )
  },
}
