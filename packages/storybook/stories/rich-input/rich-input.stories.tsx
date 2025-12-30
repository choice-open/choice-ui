import type { CustomElement, CustomText } from "@choice-ui/react"
import { Button, CodeBlock, MdInput, RichInput, slateToMarkdown, Tabs } from "@choice-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { Descendant } from "slate"

/**
 * RichInput is a powerful WYSIWYG rich text editor built on Slate.js, designed for creating
 * structured content with inline formatting and block-level elements.
 *
 * ## Use Cases
 * - **Content Management**: Blog posts, articles, documentation editing
 * - **Form Fields**: Rich text descriptions, comments with formatting
 * - **Messaging**: Compose formatted messages with links and styling
 * - **Note Taking**: Create structured notes with headings and lists
 *
 * ## Core Features
 * - **Inline Formatting**: Bold, italic, underline, strikethrough, inline code
 * - **Block Elements**: Headings (H1-H6), paragraphs, blockquotes, code blocks
 * - **Lists**: Bulleted lists, numbered lists, task/check lists
 * - **Links**: Add and edit hyperlinks within text
 * - **Keyboard Shortcuts**: Full keyboard shortcut support for power users
 * - **Markdown Export**: Convert content to Markdown format
 * - **Compound Components**: Flexible API with RichInput.Viewport and RichInput.Editable
 * - **i18n Support**: Customizable UI text for internationalization
 *
 * ## Data Structure
 * RichInput uses Slate.js Descendant[] as its value format, enabling:
 * - Nested block structures
 * - Mixed inline formatting
 * - Custom element types
 * - Bidirectional data binding
 */
export default {
  component: RichInput,
  title: "Forms/RichInput",
  tags: ["autodocs", "new"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    value: {
      description: "The Slate.js Descendant[] value representing the editor content",
    },
    onChange: {
      description: "Callback fired when content changes, receives new Descendant[]",
    },
    enterFormatting: {
      control: "boolean",
      description: "Enable floating formatting toolbar on text selection",
    },
    readOnly: {
      control: "boolean",
      description: "Make the editor read-only, disabling all editing",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text shown when editor is empty",
    },
    minHeight: {
      control: "number",
      description: "Minimum height of the editor in pixels",
    },
    autoFocus: {
      control: "boolean",
      description: "Auto-focus the editor on mount and value changes",
    },
    autoMoveToEnd: {
      control: "boolean",
      description: "Move cursor to end when value changes externally",
    },
    disableTabFocus: {
      control: "boolean",
      description: "Disable Tab key focus navigation within editor",
    },
    i18n: {
      control: "object",
      description: "Internationalization config for UI text (url.placeholder, url.doneButton)",
    },
  },
} as Meta<typeof RichInput>

/**
 * Basic usage of RichInput with essential props. This demonstrates the simplest way to integrate
 * a rich text editor into your application.
 *
 * ## Key Points
 * - **Controlled Component**: Pass `value` and `onChange` for full state control
 * - **Formatting Toolbar**: Enable with `enterFormatting={true}` to show floating toolbar on text selection
 * - **Styling**: Use `className` for container styling, `minHeight` for editor area
 *
 * ## Getting Started
 * ```tsx
 * const [value, setValue] = useState<Descendant[]>([
 *   { type: "paragraph", children: [{ text: "" }] }
 * ])
 *
 * <RichInput
 *   value={value}
 *   onChange={setValue}
 *   enterFormatting={true}
 *   placeholder="Start typing..."
 * />
 * ```
 *
 * ## Tips
 * - Always initialize with at least one paragraph element
 * - Use `enterFormatting` to enable the floating formatting toolbar
 * - Combine with ScrollArea (built-in) for long content handling
 */
export const Basic: StoryObj<typeof RichInput> = {
  args: {},
  render: function BasicTemplate() {
    const [value, setValue] = useState<Descendant[]>([
      {
        type: "paragraph",
        children: [{ text: "A line of text in a paragraph." }],
      } as CustomElement,
    ])
    return (
      <RichInput
        value={value}
        onChange={setValue}
        enterFormatting={true}
        minHeight={120}
        className="max-h-96 w-96 rounded-lg border"
      />
    )
  },
}

/**
 * Demonstrates the `minHeight` prop for controlling editor dimensions. Essential for creating
 * consistent form layouts where the editor needs a predictable size.
 *
 * ## Use Cases
 * - **Form Fields**: Ensure editors have consistent height across forms
 * - **Card Layouts**: Maintain uniform card heights with embedded editors
 * - **Modal Dialogs**: Control editor size within constrained spaces
 *
 * ## Height Control
 * - `minHeight`: Sets minimum editor height in pixels (default: 80)
 * - `className` with `max-h-*`: Limits maximum height with built-in ScrollArea
 *
 * ## ScrollArea Integration
 * RichInput includes ScrollArea by default, automatically enabling:
 * - Smooth scrolling for overflow content
 * - Scrollbar visibility control
 * - Touch-friendly scroll behavior
 *
 * ```tsx
 * <RichInput
 *   minHeight={200}
 *   className="max-h-96" // Limit max height, enable scrolling
 * />
 * ```
 */
export const MinHeight: StoryObj<typeof RichInput> = {
  render: function MinHeightTemplate() {
    const [value, setValue] = useState<Descendant[]>([
      {
        type: "paragraph",
        children: [
          { text: "Type here to see scrolling behavior when content exceeds max height." },
        ],
      } as CustomElement,
    ])
    return (
      <RichInput
        value={value}
        onChange={setValue}
        enterFormatting={true}
        minHeight={200}
        className="max-h-96 w-80 rounded-lg border"
      />
    )
  },
}

/**
 * Demonstrates the `i18n` prop for localizing UI text. Essential for multi-language applications
 * that need to adapt editor UI to user's locale.
 *
 * ## Customizable Text
 * The `i18n` prop accepts an object with the following structure:
 * ```ts
 * interface RichInputI18n {
 *   url?: {
 *     placeholder?: string  // Link input placeholder
 *     doneButton?: string   // Confirm button text
 *   }
 * }
 * ```
 *
 * ## Example: Chinese Localization
 * ```tsx
 * <RichInput
 *   i18n={{
 *     url: {
 *       placeholder: "请输入链接地址",
 *       doneButton: "完成",
 *     },
 *   }}
 * />
 * ```
 *
 * ## Default Values
 * - `url.placeholder`: "Enter link url"
 * - `url.doneButton`: "Done"
 *
 * ## Testing Localization
 * 1. Select some text in the editor below
 * 2. Click the link icon in the formatting toolbar
 * 3. Observe the localized placeholder and button text
 */
export const WithInternationalization: StoryObj<typeof RichInput> = {
  render: function InternationalizationTemplate() {
    const [value, setValue] = useState<Descendant[]>([
      {
        type: "paragraph",
        children: [{ text: "Select text and click the link icon to see localized UI." }],
      } as CustomElement,
    ])

    const chineseI18n = {
      url: {
        placeholder: "请输入链接地址",
        doneButton: "完成",
      },
    }

    return (
      <RichInput
        value={value}
        onChange={setValue}
        enterFormatting={true}
        i18n={chineseI18n}
        minHeight={200}
        className="max-h-96 w-80 rounded-lg border"
      />
    )
  },
}

/**
 * Demonstrates programmatic value control for advanced use cases like form integration,
 * template insertion, and external state management.
 *
 * ## Use Cases
 * - **Form Integration**: Sync editor content with form state (React Hook Form, Formik)
 * - **Template Systems**: Insert pre-defined content templates
 * - **AI Integration**: Programmatically insert AI-generated content
 * - **Collaboration**: Sync content across multiple users
 *
 * ## Key Props
 * - `value`: Slate.js Descendant[] - the controlled content
 * - `onChange`: Callback receiving updated Descendant[]
 * - `autoFocus`: Auto-focus editor when value changes externally
 * - `autoMoveToEnd`: Move cursor to end after external value changes
 *
 * ## Programmatic Value Updates
 * ```tsx
 * // Set simple text
 * setValue([{ type: "paragraph", children: [{ text: "Hello!" }] }])
 *
 * // Set formatted text
 * setValue([{
 *   type: "paragraph",
 *   children: [
 *     { text: "Normal " },
 *     { text: "bold", bold: true },
 *     { text: " text" }
 *   ]
 * }])
 *
 * // Append to existing content
 * setValue(prev => [...prev, { type: "paragraph", children: [{ text: "New paragraph" }] }])
 * ```
 *
 * ## Features Demonstrated
 * - External buttons controlling rich text content
 * - Programmatic formatting insertion (bold, italic, links)
 * - Real-time character, word, and formatting statistics
 * - Preset content templates with various formatting
 * - Auto-focus and cursor positioning after value changes
 * - Multi-paragraph content structure support
 */
export const ControlledValue: StoryObj<typeof RichInput> = {
  render: function ControlledValue() {
    const [value, setValue] = useState<Descendant[]>([
      { type: "paragraph", children: [{ text: "" }] } as CustomElement,
    ])

    const presetValues = [
      {
        label: "Empty",
        value: [
          {
            type: "paragraph",
            children: [{ text: "" } as CustomText],
          } as CustomElement,
        ],
      },
      {
        label: "Simple Text",
        value: [
          {
            type: "paragraph",
            children: [
              {
                text: "Hello, this is a simple rich text message!",
              } as CustomText,
            ],
          } as CustomElement,
        ],
      },
      {
        label: "Bold Text",
        value: [
          {
            type: "paragraph",
            children: [
              { text: "This text contains " } as CustomText,
              { text: "bold formatting", bold: true } as CustomText,
              { text: " for emphasis." } as CustomText,
            ],
          } as CustomElement,
        ],
      },
      {
        label: "Multiple Formats",
        value: [
          {
            type: "paragraph",
            children: [
              { text: "Rich text with " } as CustomText,
              { text: "bold", bold: true } as CustomText,
              { text: ", " } as CustomText,
              { text: "italic", italic: true } as CustomText,
              { text: ", and " } as CustomText,
              { text: "underlined", underlined: true } as CustomText,
              { text: " formatting." } as CustomText,
            ],
          } as CustomElement,
        ],
      },
      {
        label: "With Link",
        value: [
          {
            type: "paragraph",
            children: [
              { text: "Check out this " } as CustomText,
              {
                text: "example link",
                link: "https://example.com",
              } as CustomText,
              { text: " in the text." } as CustomText,
            ],
          } as CustomElement,
        ],
      },
      {
        label: "Multi-paragraph",
        value: [
          {
            type: "paragraph",
            children: [{ text: "First paragraph with some content." } as CustomText],
          } as CustomElement,
          {
            type: "paragraph",
            children: [
              { text: "Second paragraph with " } as CustomText,
              { text: "bold", bold: true } as CustomText,
              { text: " and " } as CustomText,
              { text: "italic", italic: true } as CustomText,
              { text: " text." } as CustomText,
            ],
          } as CustomElement,
          {
            type: "paragraph",
            children: [{ text: "Third paragraph to finish." } as CustomText],
          } as CustomElement,
        ],
      },
    ]

    const appendText = (text: string, formatting?: Record<string, boolean | string>) => {
      setValue((prev) => {
        const lastNode = prev[prev.length - 1] as CustomElement
        if (lastNode && lastNode.type === "paragraph") {
          const currentText = lastNode.children
            ?.map((child) => (child as CustomText).text || "")
            .join("")

          return [
            ...prev.slice(0, -1),
            {
              ...lastNode,
              children: [
                ...(lastNode.children || []),
                {
                  text: currentText ? ` ${text}` : text,
                  ...formatting,
                } as CustomText,
              ],
            } as CustomElement,
          ]
        }
        return [
          ...prev,
          {
            type: "paragraph",
            children: [{ text, ...formatting } as CustomText],
          } as CustomElement,
        ]
      })
    }

    const getWordCount = (value: Descendant[]) => {
      const text = value
        .map(
          (node) =>
            (node as CustomElement).children
              ?.map((child) => (child as CustomText).text || "")
              .join("") || "",
        )
        .join(" ")
        .trim()
      return text ? text.split(/\s+/).length : 0
    }

    const getCharacterCount = (value: Descendant[]) => {
      return value
        .map(
          (node) =>
            (node as CustomElement).children
              ?.map((child) => (child as CustomText).text || "")
              .join("") || "",
        )
        .join("").length
    }

    const getFormattingCount = (value: Descendant[]) => {
      let count = 0
      value.forEach((node) => {
        const element = node as CustomElement
        if (element.children) {
          element.children.forEach((child) => {
            const text = child as CustomText
            if (text.bold || text.italic || text.underline || text.strikethrough) {
              count++
            }
          })
        }
      })
      return count
    }

    return (
      <div className="w-80 space-y-4">
        <div className="space-y-2">
          <h4 className="font-strong">Value Control Buttons</h4>
          <div className="flex flex-wrap gap-2">
            {presetValues.map((preset) => (
              <Button
                key={preset.label}
                variant="secondary"
                size="default"
                onClick={() => setValue(preset.value as Descendant[])}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-strong">Dynamic Actions</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="default"
              onClick={() => appendText("Great job!")}
            >
              Add &quot;Great job!&quot;
            </Button>
            <Button
              variant="secondary"
              size="default"
              onClick={() => appendText("👍")}
            >
              Add 👍
            </Button>
            <Button
              variant="secondary"
              size="default"
              onClick={() => appendText("Bold text", { bold: true })}
            >
              Add Bold
            </Button>
            <Button
              variant="secondary"
              size="default"
              onClick={() => appendText("Italic text", { italic: true })}
            >
              Add Italic
            </Button>
            <Button
              variant="secondary"
              size="default"
              onClick={() => appendText("Link text", { link: "https://example.com" })}
            >
              Add Link
            </Button>
            <Button
              variant="secondary"
              size="default"
              onClick={() =>
                setValue([
                  {
                    type: "paragraph",
                    children: [{ text: "Random text..." } as CustomText],
                  } as CustomElement,
                ])
              }
            >
              Random Text
            </Button>
          </div>
        </div>

        <RichInput
          value={value}
          autoFocus
          autoMoveToEnd
          placeholder="Content is controlled externally..."
          className="max-h-96 w-80 rounded-lg border"
          enterFormatting={true}
          minHeight={120}
          onChange={setValue}
        />

        <div className="bg-secondary-background rounded-xl p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-strong">Statistics</span>
            <Button
              variant="secondary"
              size="default"
              onClick={() =>
                setValue([
                  {
                    type: "paragraph",
                    children: [{ text: "" } as CustomText],
                  } as CustomElement,
                ])
              }
            >
              Clear All
            </Button>
          </div>
          <div className="text-body-small flex items-center gap-4">
            <span className="text-secondary-foreground">
              Characters: {getCharacterCount(value)}
            </span>
            <span className="text-secondary-foreground">Words: {getWordCount(value)}</span>
            <span className="text-secondary-foreground">
              Formatted: {getFormattingCount(value)}
            </span>
          </div>
        </div>

        <CodeBlock language="json">
          <CodeBlock.Content>{JSON.stringify(value, null, 2)}</CodeBlock.Content>
        </CodeBlock>
      </div>
    )
  },
}

/**
 * Demonstrates the compound component API for advanced layout customization. Use this pattern
 * when you need fine-grained control over editor structure and styling.
 *
 * ## Compound Component Structure
 * ```tsx
 * <RichInput value={value} onChange={setValue}>
 *   <RichInput.Viewport className="custom-viewport">
 *     <RichInput.Editable className="custom-editable" />
 *   </RichInput.Viewport>
 * </RichInput>
 * ```
 *
 * ## Components
 * - **RichInput**: Root component, provides context and state management
 * - **RichInput.Viewport**: Scroll container, wraps the editable area
 * - **RichInput.Editable**: Core editing surface, handles text input and rendering
 *
 * ## Use Cases
 * - **Custom Toolbars**: Add toolbars between Viewport and Editable
 * - **Split Layouts**: Place editor alongside preview panels
 * - **Custom Scroll Behavior**: Override default ScrollArea styling
 * - **Theming**: Apply different styles to viewport and editable areas
 *
 * ## Benefits
 * - Greater flexibility in component composition
 * - Independent styling of Viewport and Editable
 * - Full feature parity with simple usage
 * - Backwards compatible - simple usage still works
 * - Context-based state sharing between parts
 * - Easier integration with complex layouts
 *
 * ## Backwards Compatibility
 * Simple usage without children still works:
 * ```tsx
 * <RichInput value={value} onChange={setValue} /> // Uses default structure
 * ```
 */
export const CompositeUsage: StoryObj<typeof RichInput> = {
  render: function CompositeUsage() {
    const [value, setValue] = useState<Descendant[]>([
      {
        type: "paragraph",
        children: [{ text: "Edit this text using the compound component API!" } as CustomText],
      } as CustomElement,
    ])

    return (
      <div className="w-80 space-y-4">
        <RichInput
          value={value}
          onChange={setValue}
          enterFormatting={true}
          minHeight={120}
          autoFocus
          className="rounded-lg border"
        >
          <RichInput.Viewport className="custom-viewport">
            <RichInput.Editable className="custom-editable" />
          </RichInput.Viewport>
        </RichInput>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="default"
            onClick={() =>
              setValue([
                {
                  type: "paragraph",
                  children: [
                    { text: "Welcome to the " } as CustomText,
                    { text: "compound API", bold: true } as CustomText,
                    { text: "!" } as CustomText,
                  ],
                } as CustomElement,
              ])
            }
          >
            Set Welcome Text
          </Button>
          <Button
            variant="secondary"
            size="default"
            onClick={() =>
              setValue([
                { type: "paragraph", children: [{ text: "" } as CustomText] } as CustomElement,
              ])
            }
          >
            Clear
          </Button>
        </div>
      </div>
    )
  },
}

/**
 * Comprehensive keyboard shortcuts reference for power users. RichInput supports standard
 * text editor shortcuts for efficient content creation without leaving the keyboard.
 *
 * ## Text Formatting Shortcuts
 * | Shortcut | Action |
 * |----------|--------|
 * | ⌘/Ctrl + B | **Bold** |
 * | ⌘/Ctrl + I | *Italic* |
 * | ⌘/Ctrl + U | Underline |
 * | ⌘/Ctrl + Shift + S | ~~Strikethrough~~ |
 *
 * ## Block Formatting Shortcuts
 * | Shortcut | Action |
 * |----------|--------|
 * | ⌘/Ctrl + / | Code Block |
 * | ⌘/Ctrl + 1-6 | Heading 1-6 |
 * | ⌘/Ctrl + Shift + > | Block Quote |
 *
 * ## Navigation Shortcuts
 * | Shortcut | Action |
 * |----------|--------|
 * | ESC | Close expanded paragraph menu |
 * | Tab | Focus navigation (can be disabled) |
 *
 * ## Usage Tips
 * - Select text first, then apply formatting shortcuts
 * - Block shortcuts toggle the current block type
 * - ESC is useful when the paragraph menu obscures content
 * - Disable Tab focus with `disableTabFocus` prop for embedded editors
 *
 * ## Customizing Shortcuts
 * Shortcuts are handled by the `useKeyboardShortcuts` hook internally.
 * For custom shortcuts, extend the editor with Slate.js plugins.
 */
export const KeyboardShortcuts: StoryObj<typeof RichInput> = {
  render: function KeyboardShortcutsStory() {
    const [value, setValue] = useState<Descendant[]>([
      { type: "h1", children: [{ text: "Keyboard Shortcuts Demo" }] } as unknown as CustomElement,
      { type: "paragraph", children: [{ text: "" }] } as CustomElement,
      { type: "h2", children: [{ text: "Text Formatting" }] } as unknown as CustomElement,
      {
        type: "paragraph",
        children: [{ text: "• " }, { text: "Bold", bold: true }, { text: ": ⌘/Ctrl + B" }],
      } as CustomElement,
      {
        type: "paragraph",
        children: [{ text: "• " }, { text: "Italic", italic: true }, { text: ": ⌘/Ctrl + I" }],
      } as CustomElement,
      {
        type: "paragraph",
        children: [
          { text: "• " },
          { text: "Underline", underlined: true },
          { text: ": ⌘/Ctrl + U" },
        ],
      } as CustomElement,
      {
        type: "paragraph",
        children: [
          { text: "• " },
          { text: "Strikethrough", strikethrough: true },
          { text: ": ⌘/Ctrl + Shift + S" },
        ],
      } as CustomElement,
      { type: "paragraph", children: [{ text: "" }] } as CustomElement,
      { type: "h2", children: [{ text: "Block Formatting" }] } as unknown as CustomElement,
      { type: "paragraph", children: [{ text: "• Code Block: ⌘/Ctrl + /" }] } as CustomElement,
      { type: "paragraph", children: [{ text: "• Heading 1-6: ⌘/Ctrl + 1-6" }] } as CustomElement,
      {
        type: "paragraph",
        children: [{ text: "• Block Quote: ⌘/Ctrl + Shift + >" }],
      } as CustomElement,
      { type: "paragraph", children: [{ text: "" }] } as CustomElement,
      {
        type: "paragraph",
        children: [{ text: "Try selecting text and using shortcuts!" }],
      } as CustomElement,
    ])

    return (
      <RichInput
        value={value}
        onChange={setValue}
        enterFormatting={true}
        className="min-h-96 w-80 rounded-lg border"
      />
    )
  },
}

/**
 * Demonstrates the `slateToMarkdown` utility for converting rich text content to Markdown format.
 * Essential for exporting content to Markdown-based systems, documentation, or APIs.
 *
 * ## Use Cases
 * - **CMS Integration**: Export content to Markdown-based CMS platforms
 * - **Documentation**: Generate Markdown documentation from rich text
 * - **API Export**: Send Markdown to APIs that expect text format
 * - **Clipboard**: Copy content as Markdown for pasting elsewhere
 *
 * ## Supported Conversions
 * | Slate Element | Markdown Output |
 * |---------------|-----------------|
 * | Bold | `**text**` |
 * | Italic | `*text*` |
 * | Underline | `<u>text</u>` |
 * | Strikethrough | `~~text~~` |
 * | Inline Code | `` `code` `` |
 * | Links | `[text](url)` |
 * | Headings | `# H1` to `###### H6` |
 * | Block Quote | `> quoted text` |
 * | Code Block | ``` fenced code ``` |
 * | Bulleted List | `- item` |
 * | Numbered List | `1. item` |
 * | Task List | `- [x] checked` / `- [ ] unchecked` |
 *
 * ## Usage
 * ```tsx
 * import { slateToMarkdown } from "@choice-ui/react"
 *
 * const markdown = slateToMarkdown(value)
 * // Returns Markdown string
 * ```
 *
 * ## Bidirectional Conversion
 * Use `markdownToSlate` for the reverse conversion:
 * ```tsx
 * import { markdownToSlate } from "@choice-ui/react"
 *
 * const slateValue = markdownToSlate(markdownString)
 * ```
 *
 * ## Demo
 * Edit content in the Editor tab, then switch to Markdown Output to see the conversion.
 * The MdInput component shows both raw Markdown and rendered preview.
 */
export const MarkdownExport: StoryObj<typeof RichInput> = {
  render: function MarkdownExportStory() {
    const [value, setValue] = useState<Descendant[]>([
      { type: "h1", children: [{ text: "Markdown Export Demo" }] } as unknown as CustomElement,
      {
        type: "paragraph",
        children: [
          { text: "This demonstrates " },
          { text: "Slate to Markdown", bold: true },
          { text: " conversion." },
        ],
      } as CustomElement,
      { type: "h2", children: [{ text: "Formatting Examples" }] } as unknown as CustomElement,
      {
        type: "bulleted_list",
        children: [
          {
            type: "list_item",
            children: [
              { text: "Text with " },
              { text: "bold", bold: true },
              { text: ", " },
              { text: "italic", italic: true },
              { text: ", " },
              { text: "code", code: true },
            ],
          } as unknown as CustomElement,
          {
            type: "list_item",
            children: [{ text: "Links like ", link: "https://example.com" }],
          } as unknown as CustomElement,
        ],
      } as unknown as CustomElement,
      {
        type: "block_quote",
        children: [{ type: "paragraph", children: [{ text: "A blockquote" }] }],
      } as unknown as CustomElement,
      {
        type: "check_list",
        children: [
          {
            type: "check_item",
            checked: true,
            children: [{ text: "Completed task" }],
          } as unknown as CustomElement,
          {
            type: "check_item",
            checked: false,
            children: [{ text: "Pending task" }],
          } as unknown as CustomElement,
        ],
      } as unknown as CustomElement,
    ])
    const [showMarkdown, setShowMarkdown] = useState(false)

    const markdown = slateToMarkdown(value)

    return (
      <div className="w-[400px] space-y-4">
        <Tabs
          value={showMarkdown ? "markdown" : "editor"}
          onChange={(v) => setShowMarkdown(v === "markdown")}
        >
          <Tabs.Item value="editor">Editor</Tabs.Item>
          <Tabs.Item value="markdown">Markdown Output</Tabs.Item>
        </Tabs>

        {!showMarkdown ? (
          <RichInput
            value={value}
            onChange={setValue}
            enterFormatting={true}
            className="min-h-[300px] rounded-lg border"
          />
        ) : (
          <MdInput value={markdown}>
            <MdInput.Header>
              <MdInput.Tabs />
            </MdInput.Header>
            <MdInput.Container>
              <MdInput.Editor />
              <MdInput.Render />
            </MdInput.Container>
          </MdInput>
        )}
      </div>
    )
  },
}
