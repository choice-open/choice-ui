# ContextInput Component

A rich text input component with mention support, context awareness, and extensible formatting capabilities. Perfect for chat interfaces, collaborative editing, and any application requiring intelligent text input with user mentions and contextual suggestions.

## Overview

ContextInput provides an advanced text input experience with support for @mentions, rich text formatting, context-aware suggestions, and extensible plugin architecture. It combines the simplicity of a text input with the power of a rich text editor.

## Key Features

- **@Mentions**: Support for user, channel, and custom mention types
- **Rich Text**: Basic text formatting capabilities
- **Context Awareness**: Intelligent suggestions based on input context
- **Extensible**: Plugin architecture for custom functionality
- **Performance**: Optimized for large mention datasets
- **Accessibility**: Full keyboard navigation and screen reader support
- **Mobile Friendly**: Touch-optimized interface

## Usage

### Basic Usage

```tsx
import { ContextInput } from "~/components/context-input"
import type { ContextInputValue, MentionItem } from "~/components/context-input/types"

const users: MentionItem[] = [
  {
    id: "1",
    type: "user",
    label: "John Doe",
    avatar: "https://example.com/avatar1.jpg",
    description: "Product Manager",
  },
  {
    id: "2",
    type: "user",
    label: "Jane Smith",
    avatar: "https://example.com/avatar2.jpg",
    description: "Senior Developer",
  },
]

export function BasicExample() {
  const [value, setValue] = useState<ContextInputValue>({
    text: "",
    mentions: [],
  })

  return (
    <ContextInput
      value={value}
      onChange={setValue}
      placeholder="Type @ to mention someone..."
      mentions={users}
    />
  )
}
```

### With Multiple Mention Types

```tsx
export function MultipleMentionTypesExample() {
  const [value, setValue] = useState<ContextInputValue>({
    text: "",
    mentions: [],
  })

  const users: MentionItem[] = [
    {
      id: "user-1",
      type: "user",
      label: "Alice Johnson",
      avatar: "https://example.com/alice.jpg",
      description: "Designer",
    },
  ]

  const channels: MentionItem[] = [
    {
      id: "channel-1",
      type: "channel",
      label: "general",
      description: "General discussion channel",
    },
    {
      id: "channel-2",
      type: "channel",
      label: "development",
      description: "Development team discussions",
    },
  ]

  const allMentions = [...users, ...channels]

  return (
    <div className="space-y-4">
      <ContextInput
        value={value}
        onChange={setValue}
        placeholder="Type @ to mention users or #channels..."
        mentions={allMentions}
        mentionTriggers={{
          "@": "user",
          "#": "channel",
        }}
      />

      <div className="text-body-small text-gray-600">
        <p>Use @ for users, # for channels</p>
        <p>Current mentions: {value.mentions.length}</p>
      </div>
    </div>
  )
}
```

### Chat Interface

```tsx
import { useState, useRef } from "react"

export function ChatInterfaceExample() {
  const [messages, setMessages] = useState<
    Array<{
      id: string
      text: string
      mentions: any[]
      timestamp: Date
      author: string
    }>
  >([])

  const [currentInput, setCurrentInput] = useState<ContextInputValue>({
    text: "",
    mentions: [],
  })

  const inputRef = useRef<HTMLDivElement>(null)

  const users: MentionItem[] = [
    {
      id: "1",
      type: "user",
      label: "Team Lead",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=teamlead",
    },
    {
      id: "2",
      type: "user",
      label: "Developer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dev",
    },
  ]

  const handleSend = () => {
    if (!currentInput.text.trim()) return

    const newMessage = {
      id: Date.now().toString(),
      text: currentInput.text,
      mentions: currentInput.mentions,
      timestamp: new Date(),
      author: "You",
    }

    setMessages((prev) => [...prev, newMessage])
    setCurrentInput({ text: "", mentions: [] })
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-96 flex-col rounded-lg border">
      {/* Message History */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className="flex gap-3"
          >
            <div className="text-body-small flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white">
              {message.author[0]}
            </div>
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-body-small-strong">{message.author}</span>
                <span className="text-xs text-gray-500">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <p className="text-body-small">{message.text}</p>
              {message.mentions.length > 0 && (
                <div className="mt-1 text-xs text-blue-600">
                  Mentioned: {message.mentions.map((m) => m.label).join(", ")}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t p-3">
        <div className="flex gap-2">
          <div className="flex-1">
            <ContextInput
              ref={inputRef}
              value={currentInput}
              onChange={setCurrentInput}
              placeholder="Type a message... Use @ to mention"
              mentions={users}
              onKeyDown={handleKeyDown}
              className="min-h-[38px]"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!currentInput.text.trim()}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-300"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
```

## Props

### ContextInput Props

| Prop              | Type                                        | Default           | Description                                              |
| ----------------- | ------------------------------------------- | ----------------- | -------------------------------------------------------- |
| `value`           | `ContextInputValue`                         | -                 | **Required.** Current input value with text and mentions |
| `onChange`        | `(value: ContextInputValue) => void`        | -                 | **Required.** Callback when value changes                |
| `mentions`        | `MentionItem[]`                             | `[]`              | Available items for mentions                             |
| `placeholder`     | `string`                                    | -                 | Placeholder text                                         |
| `mentionTriggers` | `Record<string, string>`                    | `{ "@": "user" }` | Trigger characters mapped to mention types               |
| `disabled`        | `boolean`                                   | `false`           | Whether the input is disabled                            |
| `autoFocus`       | `boolean`                                   | `false`           | Whether to auto-focus on mount                           |
| `maxLength`       | `number`                                    | -                 | Maximum text length                                      |
| `onKeyDown`       | `function`                                  | -                 | Keyboard event handler                                   |
| `onSubmit`        | `function`                                  | -                 | Submit handler (called on Enter)                         |
| `className`       | `string`                                    | -                 | Additional CSS classes                                   |
| `variant`         | `"default" \| "light" \| "dark" \| "reset"` | `"default"`       | Visual variant of the input                              |
| `size`            | `"default" \| "large"`                      | `"default"`       | Size variant of the input                                |

### Type Definitions

```tsx
interface ContextInputValue {
  text: string
  mentions: MentionReference[]
}

interface MentionItem {
  id: string
  type: string
  label: string
  avatar?: string
  description?: string
  data?: any
}

interface MentionReference {
  id: string
  type: string
  label: string
  index: number
  length: number
}
```

## Advanced Examples

### Custom Mention Types

```tsx
export function CustomMentionTypesExample() {
  const [value, setValue] = useState<ContextInputValue>({
    text: "",
    mentions: [],
  })

  const customMentions: MentionItem[] = [
    {
      id: "task-1",
      type: "task",
      label: "Setup deployment pipeline",
      description: "DevOps task - High priority",
      data: { status: "in_progress", priority: "high" },
    },
    {
      id: "doc-1",
      type: "document",
      label: "API Documentation",
      description: "Technical documentation",
      data: { lastModified: "2024-01-15" },
    },
  ]

  return (
    <div>
      <ContextInput
        value={value}
        onChange={setValue}
        placeholder="Type ! for tasks, & for documents..."
        mentions={customMentions}
        mentionTriggers={{
          "!": "task",
          "&": "document",
        }}
        renderMention={(mention) => (
          <span
            className={`text-body-small inline-flex items-center gap-1 rounded px-2 py-1 ${mention.type === "task" ? "bg-orange-100 text-orange-800" : ""} ${mention.type === "document" ? "bg-purple-100 text-purple-800" : ""} `}
          >
            {mention.type === "task" && "📋"}
            {mention.type === "document" && "📄"}
            {mention.label}
          </span>
        )}
      />

      <div className="text-body-small mt-4">
        <h4 className="font-strong">Usage:</h4>
        <ul className="list-inside list-disc text-gray-600">
          <li>Type ! to mention tasks</li>
          <li>Type & to mention documents</li>
        </ul>
      </div>
    </div>
  )
}
```

### Rich Text Formatting

```tsx
export function RichTextExample() {
  const [value, setValue] = useState<ContextInputValue>({
    text: "",
    mentions: [],
  })

  const [showPreview, setShowPreview] = useState(false)

  const formatText = (text: string) => {
    // Simple markdown-like formatting
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code>$1</code>")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-body-small-strong">Rich Text Input:</span>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="text-body-small text-blue-600 hover:text-blue-800"
        >
          {showPreview ? "Hide" : "Show"} Preview
        </button>
      </div>

      <ContextInput
        value={value}
        onChange={setValue}
        placeholder="Use **bold**, *italic*, `code` formatting..."
        mentions={users}
        className="font-mono"
      />

      {showPreview && (
        <div className="rounded border bg-gray-50 p-3">
          <div className="text-body-small-strong mb-2">Preview:</div>
          <div
            className="prose prose-sm"
            dangerouslySetInnerHTML={{
              __html: formatText(value.text),
            }}
          />
        </div>
      )}

      <div className="text-xs text-gray-500">
        <p>Formatting help:</p>
        <ul className="list-inside list-disc">
          <li>**bold text** for bold</li>
          <li>*italic text* for italic</li>
          <li>`code text` for code</li>
        </ul>
      </div>
    </div>
  )
}
```

### Validation and Limits

```tsx
export function ValidationExample() {
  const [value, setValue] = useState<ContextInputValue>({
    text: "",
    mentions: [],
  })

  const [errors, setErrors] = useState<string[]>([])
  const maxLength = 280
  const maxMentions = 5

  const handleChange = (newValue: ContextInputValue) => {
    const newErrors: string[] = []

    if (newValue.text.length > maxLength) {
      newErrors.push(`Text too long (${newValue.text.length}/${maxLength})`)
    }

    if (newValue.mentions.length > maxMentions) {
      newErrors.push(`Too many mentions (${newValue.mentions.length}/${maxMentions})`)
    }

    setErrors(newErrors)
    setValue(newValue)
  }

  const canSubmit = errors.length === 0 && value.text.trim().length > 0

  return (
    <div className="space-y-3">
      <ContextInput
        value={value}
        onChange={handleChange}
        placeholder="Share your thoughts..."
        mentions={users}
        maxLength={maxLength}
        className={errors.length > 0 ? "border-red-500" : ""}
      />

      <div className="text-body-small flex items-center justify-between">
        <div>
          {errors.length > 0 && (
            <div className="text-red-600">
              {errors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          )}
        </div>

        <div className="text-gray-500">
          {value.text.length}/{maxLength} characters
        </div>
      </div>

      <div className="flex gap-2">
        <button
          disabled={!canSubmit}
          className="rounded bg-blue-500 px-4 py-2 text-white disabled:bg-gray-300"
        >
          Post
        </button>
        <button
          onClick={() => setValue({ text: "", mentions: [] })}
          className="rounded bg-gray-500 px-4 py-2 text-white"
        >
          Clear
        </button>
      </div>
    </div>
  )
}
```

### Async Mention Loading

```tsx
export function AsyncMentionExample() {
  const [value, setValue] = useState<ContextInputValue>({
    text: "",
    mentions: [],
  })
  const [mentions, setMentions] = useState<MentionItem[]>([])
  const [loading, setLoading] = useState(false)

  const searchMentions = async (query: string, type: string) => {
    if (query.length < 2) return

    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))

      const results = await mockAPI.searchUsers(query, type)
      setMentions(results)
    } catch (error) {
      console.error("Failed to load mentions:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <ContextInput
        value={value}
        onChange={setValue}
        placeholder="Start typing to search users..."
        mentions={mentions}
        onMentionSearch={searchMentions}
        loadingMentions={loading}
      />

      {loading && <div className="text-body-small mt-2 text-gray-500">Searching users...</div>}
    </div>
  )
}
```

## Features

### Mention System

- Multiple mention types (users, channels, custom)
- Customizable trigger characters
- Async mention loading
- Rich mention rendering
- Keyboard navigation in mention dropdown

### Rich Text Support

- Basic text formatting
- Custom rendering pipeline
- Extensible formatting rules
- Preview capabilities

### Accessibility

- Full keyboard navigation
- Screen reader support
- ARIA attributes
- Focus management
- High contrast support

### Performance

- Efficient text processing
- Optimized re-rendering
- Large mention dataset support
- Debounced search
- Virtual scrolling for mention lists

## Styling

The component supports extensive customization:

- CSS classes via `className` prop
- Custom mention rendering
- Theming through CSS variables
- Responsive design
- Dark mode support

### Variants

- **default**: Follows the page theme dynamically (light/dark mode)
- **light**: Fixed light appearance regardless of theme
- **dark**: Fixed dark appearance regardless of theme
- **reset**: Removes variant styling, no variant settings applied

### Size Options

- **default**: Standard size for general use
- **large**: Increased padding and font size for prominent inputs

## Best Practices

### State Management

1. **Controlled component**: Always use controlled state
2. **Debounce searches**: Avoid excessive API calls
3. **Cache mentions**: Store frequently used mentions
4. **Validate input**: Implement proper validation

### UX Guidelines

1. **Clear triggers**: Make mention triggers obvious
2. **Visual feedback**: Show loading states
3. **Error handling**: Graceful error messaging
4. **Mobile optimization**: Touch-friendly interactions

### Performance Tips

1. **Memoize mentions**: Use useMemo for mention arrays
2. **Lazy loading**: Load mentions on demand
3. **Virtual scrolling**: For large mention lists
4. **Optimize re-renders**: Use React.memo strategically

## Browser Compatibility

- Modern browsers with ES2015+ support
- Mobile Safari and Chrome
- Proper fallbacks for older browsers
- Touch device optimization
