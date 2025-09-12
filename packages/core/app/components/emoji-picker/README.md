# EmojiPicker

A comprehensive emoji selection component with virtual scrolling, category browsing, search functionality, and frequently used tracking. Built with performance optimization for handling 1700+ emojis smoothly.

## Import

```tsx
import { EmojiPicker } from "@choiceform/design-system"
```

## Features

- **Virtual Scrolling** - High-performance rendering with @tanstack/react-virtual
- **Smart Categories** - 8 main categories automatically organized by emoji ID ranges
- **Powerful Search** - Search by name, emoji character, or URL-friendly names
- **Category Navigation** - Quick browse and scroll to specific categories
- **Frequently Used** - Intelligent tracking of user preferences with localStorage
- **Theme Support** - Multiple variants (default, light, dark) for different contexts
- **High Performance** - Smooth scrolling for 1700+ emojis
- **Responsive Layout** - Adaptive grid with customizable columns
- **Local Data** - No network dependencies, fast loading
- **Controlled Component** - External state management support
- **Modular Design** - Independent footer component

## Usage

### Basic

```tsx
import { useState } from "react"
import { EmojiPicker, type EmojiData } from "@choiceform/design-system"

function MyComponent() {
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiData | null>(null)

  return (
    <div>
      <div>
        Selected: {selectedEmoji ? `${selectedEmoji.emoji} (${selectedEmoji.name})` : "None"}
      </div>

      <EmojiPicker
        value={selectedEmoji}
        onChange={setSelectedEmoji}
        height={400}
      />
    </div>
  )
}
```

### Variants

```tsx
// Default - follows page theme
<EmojiPicker
  value={selectedEmoji}
  onChange={setSelectedEmoji}
  variant="default"
/>

// Light - fixed light appearance
<EmojiPicker
  value={selectedEmoji}
  onChange={setSelectedEmoji}
  variant="light"
/>

// Dark - fixed dark appearance
<EmojiPicker
  value={selectedEmoji}
  onChange={setSelectedEmoji}
  variant="dark"
/>
```

### Custom Configuration

```tsx
<EmojiPicker
  value={selectedEmoji}
  onChange={setSelectedEmoji}
  height={350}
  columns={10}
  searchPlaceholder="Search emojis..."
  showCategories={true}
  showSearch={true}
  showFrequentlyUsed={true}
/>
```

### Without Frequently Used

```tsx
<EmojiPicker
  value={selectedEmoji}
  onChange={setSelectedEmoji}
  showFrequentlyUsed={false}
  variant="light"
/>
```

### In a Popover

```tsx
import { Popover } from "@choiceform/design-system"

function PopoverEmojiPicker() {
  const [open, setOpen] = useState(false)
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiData | null>(null)

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <Popover.Trigger>
        <Button active={open}>{selectedEmoji?.emoji || "😀"} Choose Emoji</Button>
      </Popover.Trigger>

      <Popover.Header title="Choose Emoji" />

      <Popover.Content className="p-0">
        <EmojiPicker
          value={selectedEmoji}
          onChange={(emoji) => {
            setSelectedEmoji(emoji)
            setOpen(false)
          }}
          height={400}
        />
      </Popover.Content>
    </Popover>
  )
}
```

## Props

```ts
interface EmojiPickerProps {
  /** Currently selected emoji (controlled) */
  value?: EmojiData | null

  /** Callback when emoji selection changes */
  onChange?: (emoji: EmojiData) => void

  /** Additional CSS class names */
  className?: string

  /** Search input placeholder text */
  searchPlaceholder?: string

  /** Picker height in pixels */
  height?: number

  /** Number of emojis per row */
  columns?: number

  /** Show category navigation */
  showCategories?: boolean

  /** Show search input */
  showSearch?: boolean

  /** Enable frequently used emojis tracking */
  showFrequentlyUsed?: boolean

  /** Theme variant */
  variant?: "default" | "light" | "dark"

  /** Additional child elements */
  children?: React.ReactNode
}
```

- Defaults:
  - `height`: 384
  - `columns`: 8
  - `searchPlaceholder`: "Search emoji..."
  - `showCategories`: true
  - `showSearch`: true
  - `showFrequentlyUsed`: true
  - `variant`: "dark"

- Variant options:
  - `default`: Follows the page theme dynamically (light/dark mode)
  - `light`: Fixed light appearance regardless of theme
  - `dark`: Fixed dark appearance regardless of theme

## Data Structure

Each emoji follows this structure:

```ts
interface EmojiData {
  id: number // Unique identifier
  code: string // Unicode code point
  emoji: string // Emoji character
  name: string // Human-readable name
  nameUrl: string // URL-friendly name
}
```

## Categories

Emojis are automatically categorized by ID ranges:

- 😀 **Smileys & People** (ID: 1-460) - Expressions, gestures, people
- 🐶 **Animals & Nature** (ID: 465-591) - Animals, plants, nature
- 🍎 **Food & Drink** (ID: 592-712) - Fruits, vegetables, food
- 🚗 **Travel & Places** (ID: 713-922) - Transportation, buildings, places
- ⚽ **Activities** (ID: 923-1001) - Sports, games, entertainment
- 💡 **Objects** (ID: 1002-1234) - Daily items, tools, objects
- ❤️ **Symbols** (ID: 1235-1451) - Various symbols, icons, signs
- 🏁 **Flags** (ID: 1452-1719) - Country flags

## Search Functionality

Supports multiple search methods:

- **Name Search** - Type "smile" to find "smiling face"
- **Emoji Search** - Directly type "😀"
- **URL Name Search** - Type "grinning-face"

Search is case-insensitive and supports partial matching.

## Frequently Used Feature

- **Automatic Tracking** - Selected emojis are automatically recorded
- **Smart Sorting** - Frequently used emojis sorted by usage frequency
- **Limited Storage** - Maximum of 24 frequently used emojis
- **Controllable** - Can be disabled via `showFrequentlyUsed` prop
- **Privacy Friendly** - Can be completely disabled

## Footer Component

The footer displays emoji information with smart priority:

1. **Hover Priority** - Shows hovered emoji when available
2. **Selection Fallback** - Shows selected emoji when no hover
3. **Default Message** - Shows "Pick an emoji..." when empty

```tsx
import { EmojiFooter } from "@choiceform/design-system"
;<EmojiFooter
  hoveredEmoji={hoveredEmoji}
  selectedEmoji={selectedEmoji}
  variant="dark"
/>
```

## Styling

- Uses Tailwind Variants for consistent theming
- Supports dark and light variants
- Customizable through className prop
- Footer and search components automatically match theme

## Best Practices

- Always provide controlled state via `value` and `onChange`
- Use appropriate height for your layout context
- Consider disabling frequently used in privacy-sensitive contexts
- Provide meaningful search placeholders
- Test with both theme variants
- Use real emoji data from the provided `emojis` array

## Examples

### Chat Input Enhancement

```tsx
function ChatInput() {
  const [message, setMessage] = useState("")
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiData | null>(null)
  const [showPicker, setShowPicker] = useState(false)

  const handleEmojiSelect = (emoji: EmojiData) => {
    setMessage((prev) => prev + emoji.emoji)
    setSelectedEmoji(emoji)
    setShowPicker(false)
  }

  return (
    <div className="relative">
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={() => setShowPicker(!showPicker)}>😀</button>

      {showPicker && (
        <div className="absolute right-0 bottom-full z-10">
          <EmojiPicker
            value={selectedEmoji}
            onChange={handleEmojiSelect}
            height={350}
          />
        </div>
      )}
    </div>
  )
}
```

### Form Integration

```tsx
function CommentForm() {
  const [comment, setComment] = useState("")
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiData | null>(null)

  const handleEmojiSelect = (emoji: EmojiData) => {
    setComment((prev) => prev + emoji.emoji)
    setSelectedEmoji(emoji)
  }

  return (
    <div className="space-y-4">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
        className="w-full rounded border p-3"
      />

      <EmojiPicker
        value={selectedEmoji}
        onChange={handleEmojiSelect}
        height={300}
        columns={10}
        searchPlaceholder="Add emotion to your comment..."
        variant="light"
      />
    </div>
  )
}
```

## Performance

- **Virtual Scrolling** - Only renders visible emojis for smooth performance
- **Local Data** - No network requests, fast initial load
- **Smart Categories** - ID-based filtering avoids complex computations
- **Responsive** - Adapts to different screen sizes
- **Event Optimization** - Uses useEventCallback to prevent unnecessary re-renders

## Accessibility

- Proper ARIA labels for category navigation
- Keyboard navigation support
- Screen reader friendly emoji descriptions
- Focus management for search and selection
- Semantic HTML structure

## Notes

- Component is controlled and requires `value` and `onChange` props
- Uses real emoji data from the `emojis` array - avoid constructing fake data
- Category organization is based on emoji ID ranges
- Virtual scrolling ensures smooth performance with large datasets
- Frequently used feature depends on localStorage availability
- Compatible with modern browsers that support emoji rendering
