import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { useState } from "react"
import { MdInput } from "./md-input"
import { useDarkMode } from "@vueless/storybook-dark-mode"
import {
  FontBoldSmall,
  ParagraphCode,
  ParagraphHeading,
  ParagraphItalic,
  ParagraphStrikethrough,
  ParagraphUnderline,
} from "@choiceform/icons-react"
import type { MentionRenderProps } from "../md-render/types"
import { Avatar } from "../avatar"
import { Tooltip } from "../tooltip"
import { ToolbarAction } from "./types"

const meta: Meta<typeof MdInput> = {
  title: "Forms/MdInput",
  component: MdInput,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof MdInput>

/**
 * Basic: Shows the default markdown input usage.
 * - Demonstrates a simple markdown editor with toolbar and preview.
 * - Use for basic markdown editing needs.
 */
export const Basic: Story = {
  render: function Basic() {
    const [value, setValue] = useState(
      "### Heading\n\n**Bold text** and *italic text*\n\n- List item 1\n- List item 2",
    )
    return (
      <MdInput
        value={value}
        onChange={setValue}
      >
        <MdInput.Header>
          <MdInput.Tabs />
          <MdInput.Toolbar />
        </MdInput.Header>
        <MdInput.Container>
          <MdInput.Editor placeholder="Enter markdown..." />
          <MdInput.Render />
        </MdInput.Container>
      </MdInput>
    )
  },
}

/**
 * Without Preview: Shows markdown input without preview tab.
 * - Only shows the write mode with toolbar.
 * - Useful when preview is not needed.
 */
export const WithoutPreview: Story = {
  render: function WithoutPreview() {
    const [value, setValue] = useState("### Heading\n\n**Bold text**")
    return (
      <MdInput
        value={value}
        onChange={setValue}
      >
        <MdInput.Header>
          <MdInput.Toolbar />
        </MdInput.Header>
        <MdInput.Container>
          <MdInput.Editor />
        </MdInput.Container>
      </MdInput>
    )
  },
}

/**
 * Only Preview: Shows markdown input with only preview tab.
 * - Only shows the preview tab.
 * - Useful when users prefer to see the preview of the markdown content.
 */
export const OnlyPreview: Story = {
  render: function OnlyPreview() {
    const [value, setValue] = useState("### Heading\n\n**Bold text**")
    return (
      <div className="flex flex-col gap-4">
        <p>With ScrollArea</p>
        <MdInput value={value}>
          <MdInput.Render />
        </MdInput>

        <p>Without ScrollArea</p>
        <MdInput value={value}>
          <MdInput.Render
            withScrollArea={false}
            className="p-4"
          />
        </MdInput>
      </div>
    )
  },
}

/**
 * Without Toolbar: Shows markdown input without toolbar.
 * - Only shows the textarea and preview tabs.
 * - Useful when users prefer keyboard shortcuts.
 */
export const WithoutToolbar: Story = {
  render: function WithoutToolbar() {
    const [value, setValue] = useState("### Heading\n\n**Bold text**")
    return (
      <MdInput
        value={value}
        onChange={setValue}
      >
        <MdInput.Header>
          <MdInput.Tabs />
        </MdInput.Header>
        <MdInput.Container>
          <MdInput.Editor />
          <MdInput.Render />
        </MdInput.Container>
      </MdInput>
    )
  },
}

/**
 * Read Only: Shows markdown input in read-only mode.
 * - Displays content but prevents editing.
 * - Useful for displaying formatted content.
 */
export const ReadOnly: Story = {
  render: function ReadOnly() {
    const value = "### Heading\n\n**Bold text** and *italic text*\n\n- List item 1\n- List item 2"
    return (
      <MdInput
        value={value}
        readOnly
      >
        <MdInput.Header>
          <MdInput.Tabs />
        </MdInput.Header>
        <MdInput.Container>
          <MdInput.Editor />
          <MdInput.Render />
        </MdInput.Container>
      </MdInput>
    )
  },
}

/**
 * Disabled: Shows markdown input in disabled state.
 * - Prevents all interactions.
 * - Useful for disabled form states.
 */
export const Disabled: Story = {
  render: function Disabled() {
    const value = "### Heading\n\n**Bold text**"
    return (
      <MdInput
        value={value}
        disabled
      >
        <MdInput.Header>
          <MdInput.Tabs />
          <MdInput.Toolbar />
        </MdInput.Header>
        <MdInput.Container>
          <MdInput.Editor />
          <MdInput.Render />
        </MdInput.Container>
      </MdInput>
    )
  },
}

/**
 * Custom Height: Shows markdown input with custom minimum height.
 * - Allows customizing the editor height.
 * - Useful for different layout requirements.
 */
export const CustomHeight: Story = {
  render: function CustomHeight() {
    const [value, setValue] = useState("### Heading\n\n**Bold text**")
    return (
      <MdInput
        value={value}
        onChange={setValue}
      >
        <MdInput.Header>
          <MdInput.Tabs />
          <MdInput.Toolbar />
        </MdInput.Header>
        <MdInput.Container>
          <MdInput.Editor
            maxRows={36}
            minRows={12}
          />
          <MdInput.Render />
        </MdInput.Container>
      </MdInput>
    )
  },
}

/**
 * Empty: Shows markdown input with empty initial value.
 * - Demonstrates the placeholder functionality.
 * - Useful for new content creation.
 */
export const Empty: Story = {
  render: function Empty() {
    const [value, setValue] = useState("")
    return (
      <MdInput
        value={value}
        onChange={setValue}
      >
        <MdInput.Header>
          <MdInput.Tabs />
          <MdInput.Toolbar />
        </MdInput.Header>
        <MdInput.Container>
          <MdInput.Editor placeholder="Start writing markdown..." />
          <MdInput.Render />
        </MdInput.Container>
      </MdInput>
    )
  },
}

/**
 * Custom Toolbar Actions: Shows markdown input with only specific toolbar actions.
 * - Demonstrates filtering toolbar actions using visibleActions prop on MdInput.Toolbar.
 * - Only shows bold, italic, and code actions.
 * - Useful when you want to limit available formatting options.
 */
export const CustomToolbarActions: Story = {
  render: function CustomToolbarActions() {
    const [value, setValue] = useState("### Heading\n\n**Bold text** and *italic text*\n\n`code`")
    return (
      <MdInput
        value={value}
        onChange={setValue}
      >
        <MdInput.Header>
          <MdInput.Tabs />
          <MdInput.Toolbar visibleActions={["bold", "italic", "code"]} />
        </MdInput.Header>
        <MdInput.Container>
          <MdInput.Editor />
          <MdInput.Render />
        </MdInput.Container>
      </MdInput>
    )
  },
}

/**
 * Lists Only: Shows markdown input with only list-related actions.
 * - Demonstrates toolbar with only list actions.
 * - Hides text formatting actions.
 * - Useful for structured content creation.
 */
export const ListsOnly: Story = {
  render: function ListsOnly() {
    const [value, setValue] = useState(
      "- Unordered item 1\n- Unordered item 2\n\n1. Ordered item 1\n2. Ordered item 2\n\n- [ ] Task 1\n- [x] Task 2",
    )
    return (
      <MdInput
        value={value}
        onChange={setValue}
      >
        <MdInput.Header>
          <MdInput.Tabs />
          <MdInput.Toolbar visibleActions={["unordered-list", "ordered-list", "task-list"]} />
        </MdInput.Header>
        <MdInput.Container>
          <MdInput.Editor />
          <MdInput.Render />
        </MdInput.Container>
      </MdInput>
    )
  },
}

/**
 * GitHub Flavored Markdown: Comprehensive test of all GitHub-supported Markdown formats.
 * - Headings (H1-H6)
 * - Text formatting (bold, italic, strikethrough, inline code)
 * - Lists (ordered, unordered, task lists)
 * - Code blocks with syntax highlighting
 * - Tables
 * - Blockquotes
 * - Links and images
 * - Horizontal rules
 * - Auto-links
 * - Mentions and issue references
 * - And more GitHub-specific features
 */
export const GitHubFlavoredMarkdown: Story = {
  render: function GitHubFlavoredMarkdown() {
    const [value, setValue] = useState(`# Heading 1

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

---

## Text Formatting

**Bold text** and *italic text* and ***bold italic text***

~~Strikethrough text~~

\`Inline code\` and \`\`\`code block\`\`\`

---

## Lists

### Unordered List

- Item 1
- Item 2
  - Nested item 2.1
  - Nested item 2.2
- Item 3

### Ordered List

1. First item
2. Second item
3. Third item
   1. Nested ordered 3.1
   2. Nested ordered 3.2

### Task List

- [x] Completed task
- [ ] Incomplete task
- [x] Another completed task
- [ ] Another incomplete task

---

## Code Blocks

### JavaScript

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));
\`\`\`

### TypeScript

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: "John Doe",
  email: "john@example.com"
};
\`\`\`

### JSON

\`\`\`json
{
  "name": "package.json",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.0.0"
  }
}
\`\`\`

---

## Tables

| Feature | Status | Notes |
|---------|--------|-------|
| Tables | ✅ | Fully supported |
| Alignment | ✅ | Left, center, right |
| Styling | ✅ | Customizable |

| Left Aligned | Center Aligned | Right Aligned |
|:-------------|:--------------:|--------------:|
| Left | Center | Right |
| Text | Text | Text |

---

## Blockquotes

> This is a blockquote.
> It can span multiple lines.

> Nested blockquotes
> > Are also supported
> > > With multiple levels

---

## Links and Images

[Link text](https://example.com)

[Link with title](https://example.com "Link title")

<https://example.com>

<user@example.com>

![Image alt text](https://via.placeholder.com/150 "Image title")

---

## Mentions and References

@username

#123

#issue-123

---

## Horizontal Rules

---

***

___

---

## Mixed Content

Here's a paragraph with **bold**, *italic*, \`code\`, and a [link](https://example.com).

1. First item with **bold text**
2. Second item with *italic text*
3. Third item with \`inline code\`

> Blockquote with **bold** and *italic* text
> 
> And a list:
> - Item 1
> - Item 2

---

## Special Characters

Escaped characters: \\* \\_ \\\` \\# \\[ \\]

Math expressions: $E = mc^2$ and $\\sum_{i=1}^{n} x_i$

---

## Complex Example

### Project README

This is a **sample project** demonstrating various Markdown features.

#### Features

- [x] Feature 1
- [x] Feature 2
- [ ] Feature 3 (in progress)

#### Installation

\`\`\`bash
npm install
npm run dev
\`\`\`

#### Usage

\`\`\`typescript
import { Component } from './component';

const app = new Component();
app.init();
\`\`\`

#### Contributing

> Please read our [contributing guidelines](CONTRIBUTING.md) before submitting a PR.

#### License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Note**: This example demonstrates all GitHub Flavored Markdown features supported by the component.`)

    const isDarkMode = useDarkMode()
    const customColor = {
      defaultBackground: isDarkMode ? "var(--color-pink-pale-700)" : "var(--color-pink-300)",
      defaultBoundary: isDarkMode ? "var(--color-pink-pale-500)" : "var(--color-pink-400)",
      secondaryBackground: isDarkMode ? "var(--color-pink-pale-600)" : "var(--color-pink-200)",
      secondaryForeground: isDarkMode ? "var(--color-pink-pale-900)" : "var(--color-pink-pale-500)",
      codeBackground: isDarkMode ? "var(--color-pink-pale-800)" : "var(--color-pink-100)",
    }
    return (
      <MdInput
        value={value}
        onChange={setValue}
      >
        <MdInput.Header>
          <MdInput.Tabs />
          <MdInput.Toolbar />
        </MdInput.Header>
        <MdInput.Container>
          <MdInput.Editor
            minRows={48}
            maxRows={72}
          />
          <MdInput.Render customColor={customColor} />
        </MdInput.Container>
      </MdInput>
    )
  },
}

/**
 * Custom Layout: Shows markdown input with custom layout using compound components.
 * - Demonstrates reordering components and custom styling.
 * - Use for unique design requirements.
 */
export const CustomLayout: Story = {
  render: function CustomLayout() {
    const [value, setValue] = useState("### Heading\n\n**Bold text**")
    return (
      <MdInput
        value={value}
        onChange={setValue}
      >
        <MdInput.Header>
          <MdInput.Toolbar />
          <MdInput.Tabs />
        </MdInput.Header>
        <MdInput.Container>
          <MdInput.Editor />
          <MdInput.Render />
        </MdInput.Container>
        <MdInput.Footer>
          <div className="text-muted-foreground text-xs">Markdown supported</div>
        </MdInput.Footer>
      </MdInput>
    )
  },
}

/**
 * Custom Toolbar: Shows markdown input with custom toolbar groups.
 * - Demonstrates how to create custom toolbar groups with different actions.
 * - Groups are automatically separated by dividers.
 * - Useful for creating specialized editing experiences.
 */
export const CustomToolbar: Story = {
  render: function CustomToolbar() {
    const [value, setValue] = useState("### Custom Toolbar\n\n**Bold** and *italic* text")

    const customGroups: ToolbarAction[][] = [
      [
        { id: "heading", label: "Heading", icon: "H" },
        { id: "bold", label: "Bold", icon: "B" },
        { id: "italic", label: "Italic", icon: "I" },
      ],
    ]

    return (
      <MdInput
        value={value}
        onChange={setValue}
      >
        <MdInput.Header>
          <MdInput.Tabs />
          <MdInput.Toolbar groups={customGroups} />
        </MdInput.Header>
        <MdInput.Container>
          <MdInput.Editor />
          <MdInput.Render />
        </MdInput.Container>
      </MdInput>
    )
  },
}

/**
 * Toolbar in Footer: Shows markdown input with toolbar placed in the footer.
 * - Demonstrates flexible component composition by moving toolbar to footer.
 * - Useful for alternative layout designs where toolbar is at the bottom.
 */
export const ToolbarInFooter: Story = {
  render: function ToolbarInFooter() {
    const [value, setValue] = useState(
      "### Toolbar in Footer\n\n**Bold text** and *italic text*\n\n- List item 1\n- List item 2",
    )

    return (
      <MdInput
        value={value}
        onChange={setValue}
      >
        <MdInput.Header>
          <MdInput.Tabs />
        </MdInput.Header>
        <MdInput.Container>
          <MdInput.Editor />
          <MdInput.Render />
        </MdInput.Container>
        <MdInput.Footer>
          <MdInput.Toolbar />
        </MdInput.Footer>
      </MdInput>
    )
  },
}

/**
 * Toolbar in Footer with Custom Actions: Shows markdown input with custom toolbar in footer.
 * - Demonstrates custom toolbar groups placed in the footer.
 * - Useful for creating unique editing experiences with bottom-aligned controls.
 */
export const CustomToolbarInFooter: Story = {
  render: function CustomToolbarInFooter() {
    const [value, setValue] = useState("### Custom Footer Toolbar\n\n**Bold** and *italic* text")

    const footerGroups: ToolbarAction[][] = [
      [
        { id: "bold", label: "Bold", icon: <FontBoldSmall /> },
        { id: "italic", label: "Italic", icon: <ParagraphItalic /> },
      ],
      [{ id: "code", label: "Code", icon: <ParagraphCode /> }],
    ]

    return (
      <MdInput
        value={value}
        onChange={setValue}
      >
        <MdInput.Header>
          <MdInput.Tabs />
        </MdInput.Header>
        <MdInput.Container>
          <MdInput.Editor />
          <MdInput.Render />
        </MdInput.Container>
        <MdInput.Footer>
          <div className="flex items-center justify-between">
            <MdInput.Toolbar groups={footerGroups} />
            <div className="text-muted-foreground text-xs">Markdown supported</div>
          </div>
        </MdInput.Footer>
      </MdInput>
    )
  },
}

/**
 * With Mentions: Shows markdown input with @mention functionality.
 * - Type @ to trigger mention menu.
 * - Filter mentions by typing after @.
 * - Select mention to insert into editor.
 * - Useful for user mentions, tags, or any autocomplete needs.
 */
export const WithMentions: Story = {
  render: function WithMentions() {
    const [value, setValue] = useState("Type @ to mention someone:\n\n")

    const mentionItems = [
      { id: "1", label: "John Doe", email: "john@example.com" },
      { id: "2", label: "Jane Smith", email: "jane@example.com" },
      { id: "3", label: "Bob Johnson", email: "bob@example.com" },
      { id: "4", label: "Alice Williams", email: "alice@example.com" },
      { id: "5", label: "Charlie Brown", email: "charlie@example.com" },
      { id: "6", label: "Diana Prince", email: "diana@example.com" },
      { id: "7", label: "Edward Norton", email: "edward@example.com" },
      { id: "8", label: "Fiona Apple", email: "fiona@example.com" },
    ]

    return (
      <MdInput
        value={value}
        onChange={setValue}
        mentionItems={mentionItems}
      >
        <MdInput.Header>
          <MdInput.Tabs />
          <MdInput.Toolbar />
        </MdInput.Header>
        <MdInput.Container>
          <MdInput.Editor placeholder="Type @ to mention someone..." />
          <MdInput.Render />
        </MdInput.Container>
      </MdInput>
    )
  },
}

/**
 * Custom Mention Format: Shows markdown input with custom mention insertion format.
 * - Demonstrates custom onSelect callback to format inserted text.
 * - Inserts mentions with custom format including email.
 * - Useful for custom mention syntax or formatting requirements.
 */
export const CustomMentionFormat: Story = {
  render: function CustomMentionFormat() {
    const [value, setValue] = useState("Mention team members:\n\n")

    const mentionItems = [
      { id: "1", label: "John Doe", email: "john@example.com", role: "Developer" },
      { id: "2", label: "Jane Smith", email: "jane@example.com", role: "Designer" },
      { id: "3", label: "Bob Johnson", email: "bob@example.com", role: "Manager" },
      { id: "4", label: "Alice Williams", email: "alice@example.com", role: "Developer" },
    ]

    const handleMentionSelect = (
      item: { email?: string; id: string; label: string; role?: string },
      query: string,
    ) => {
      return `[@${item.label}](mailto:${item.email || ""}) `
    }

    return (
      <MdInput
        value={value}
        onChange={setValue}
        mentionItems={mentionItems}
        mentionOnSelect={handleMentionSelect}
      >
        <MdInput.Header>
          <MdInput.Tabs />
          <MdInput.Toolbar />
        </MdInput.Header>
        <MdInput.Container>
          <MdInput.Editor placeholder="Type @ to mention someone..." />
          <MdInput.Render />
        </MdInput.Container>
      </MdInput>
    )
  },
}

/**
 * Mentions with Filtering: Shows markdown input with mention filtering.
 * - Type @ followed by characters to filter mentions.
 * - Menu updates in real-time as you type.
 * - Useful for large lists of mentionable items.
 */
export const MentionsWithFiltering: Story = {
  render: function MentionsWithFiltering() {
    const [value, setValue] = useState("Search for a team member:\n\n")

    const mentionItems = [
      { id: "1", label: "Alex Anderson", department: "Engineering" },
      { id: "2", label: "Alexandra Brown", department: "Design" },
      { id: "3", label: "Alice Cooper", department: "Marketing" },
      { id: "4", label: "Bob Builder", department: "Engineering" },
      { id: "5", label: "Barbara Walters", department: "Sales" },
      { id: "6", label: "Charlie Chaplin", department: "Engineering" },
      { id: "7", label: "Carol King", department: "Design" },
      { id: "8", label: "David Bowie", department: "Marketing" },
      { id: "9", label: "Diana Ross", department: "Sales" },
      { id: "10", label: "Edward Scissorhands", department: "Engineering" },
    ]

    return (
      <MdInput
        value={value}
        onChange={setValue}
        mentionItems={mentionItems}
      >
        <MdInput.Header>
          <MdInput.Tabs />
          <MdInput.Toolbar />
        </MdInput.Header>
        <MdInput.Container>
          <MdInput.Editor placeholder="Type @ and start typing to filter..." />
          <MdInput.Render />
        </MdInput.Container>
      </MdInput>
    )
  },
}

/**
 * Mentions in Existing Content: Shows markdown input with mentions in existing content.
 * - Demonstrates mention functionality with pre-filled content.
 * - Shows how mentions work alongside markdown formatting.
 * - Useful for editing existing content with mentions.
 */
export const MentionsInExistingContent: Story = {
  render: function MentionsInExistingContent() {
    const [value, setValue] = useState(
      "### Team Update\n\nHey team, I wanted to mention @John Doe and @Jane Smith about the project.\n\n**Action items:**\n- [ ] Review PR from @Bob Johnson\n- [ ] Design feedback from @Alice Williams\n\nLet me know if you have questions!",
    )

    const mentionItems = [
      { id: "1", label: "John Doe" },
      { id: "2", label: "Jane Smith" },
      { id: "3", label: "Bob Johnson" },
      { id: "4", label: "Alice Williams" },
      { id: "5", label: "Charlie Brown" },
    ]

    return (
      <MdInput
        value={value}
        onChange={setValue}
        mentionItems={mentionItems}
      >
        <MdInput.Header>
          <MdInput.Tabs />
          <MdInput.Toolbar />
        </MdInput.Header>
        <MdInput.Container>
          <MdInput.Editor />
          <MdInput.Render />
        </MdInput.Container>
      </MdInput>
    )
  },
}

/**
 * Custom Mention Rendering: Shows markdown input with custom mention rendering component.
 * - Demonstrates how to customize the appearance of @mentions in preview mode.
 * - Mentions are rendered using a custom component passed via mentionRenderComponent prop.
 * - Useful for styling mentions or adding interactive features.
 */
export const CustomMentionRendering: Story = {
  render: function CustomMentionRendering() {
    const [value, setValue] = useState(
      "### Team Collaboration\n\nI'd like to mention @John Doe and @Jane Smith in this discussion.\n\n**Highlights:**\n- @Bob Johnson completed the feature\n- @Alice Williams provided great feedback\n\nThanks @Charlie Brown for the review!",
    )

    const mentionItems = [
      {
        id: "1",
        label: "John Doe",
        email: "john@example.com",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=1`,
      },
      {
        id: "2",
        label: "Jane Smith",
        email: "jane@example.com",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=2`,
      },
      {
        id: "3",
        label: "Bob Johnson",
        email: "bob@example.com",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=3`,
      },
      {
        id: "4",
        label: "Alice Williams",
        email: "alice@example.com",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=4`,
      },
      {
        id: "5",
        label: "Charlie Brown",
        email: "charlie@example.com",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=5`,
      },
    ]

    const CustomMention = ({ mention }: MentionRenderProps) => {
      const user = mentionItems.find((item) => item.label === mention)
      const isInvalid = !user
      if (isInvalid) {
        return (
          <span className="bg-secondary-background inline-flex items-center gap-1 rounded-md px-1 align-middle">
            @{mention}
          </span>
        )
      }
      return (
        <Tooltip
          withArrow={false}
          className="grid grid-cols-[auto_1fr] items-center gap-2 border-none p-2 shadow-lg"
          variant="light"
          content={
            <>
              <Avatar
                as="span"
                photo={user?.avatar}
                name={user?.label}
                size="large"
              />
              <div className="flex flex-col">
                <span className="text-body-medium-strong">{user?.label}</span>
                <span className="text-secondary-foreground">{user?.email}</span>
              </div>
            </>
          }
        >
          <a
            href={`mailto:${user?.email}`}
            className="bg-secondary-background text-accent-foreground inline-flex cursor-default items-center gap-1 rounded-md px-1 align-middle"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Avatar
              as="span"
              photo={user?.avatar}
              name={user?.label}
              size="small"
            />
            {mention}
          </a>
        </Tooltip>
      )
    }

    return (
      <MdInput
        value={value}
        onChange={setValue}
        mentionItems={mentionItems}
      >
        <MdInput.Header>
          <MdInput.Tabs />
          <MdInput.Toolbar />
        </MdInput.Header>
        <MdInput.Container>
          <MdInput.Editor />
          <MdInput.Render mentionRenderComponent={CustomMention} />
        </MdInput.Container>
      </MdInput>
    )
  },
}

/**
 * Mention Rendering in Various Formats: Shows how mentions are rendered in different markdown contexts.
 * - Mentions in headings, paragraphs, lists, blockquotes, and links.
 * - Demonstrates that mentions work consistently across all markdown elements.
 * - Useful for testing mention rendering in various content structures.
 */
export const MentionRenderingInVariousFormats: Story = {
  render: function MentionRenderingInVariousFormats() {
    const [value, setValue] = useState(
      "# Mention @John Doe in Heading\n\n## And @Jane Smith in Subheading\n\nParagraph with mention: @Bob Johnson\n\n**Bold text with @Alice Williams mention**\n\n*Italic text with @Charlie Brown mention*\n\n### Lists with Mentions\n\n- Item mentioning @John Doe\n- Another item with @Jane Smith\n- @Bob Johnson in list item\n\n### Blockquote\n\n> Quote mentioning @Alice Williams\n> And @Charlie Brown\n\n### Link with Mention\n\n[Check @John Doe's work](https://example.com)\n\n### Table\n\n| Name | Status |\n|------|--------|\n| @Jane Smith | Active |\n| @Bob Johnson | Pending |",
    )

    const mentionItems = [
      { id: "1", label: "John Doe" },
      { id: "2", label: "Jane Smith" },
      { id: "3", label: "Bob Johnson" },
      { id: "4", label: "Alice Williams" },
      { id: "5", label: "Charlie Brown" },
    ]

    const CustomMention = ({ mention }: MentionRenderProps) => {
      return (
        <span className="bg-accent text-accent-foreground inline-flex items-center rounded px-1.5 py-0.5">
          @{mention}
        </span>
      )
    }

    return (
      <MdInput
        value={value}
        onChange={setValue}
        mentionItems={mentionItems}
      >
        <MdInput.Header>
          <MdInput.Tabs />
          <MdInput.Toolbar />
        </MdInput.Header>
        <MdInput.Container>
          <MdInput.Editor />
          <MdInput.Render mentionRenderComponent={CustomMention} />
        </MdInput.Container>
      </MdInput>
    )
  },
}

/**
 * Mention with Allowed Domains: Shows markdown input with allowed URL prefixes for mention images and links.
 * - Demonstrates how to configure allowedPrefixes to whitelist specific URL prefixes.
 * - The same prefix list applies to both links and images in markdown.
 * - Useful when mention components use external URLs that need to be whitelisted.
 */
export const MentionWithAllowedDomains: Story = {
  render: function MentionWithAllowedDomains() {
    const [value, setValue] = useState(
      "### Team with Avatars\n\nMention @John Doe and @Jane Smith.\n\nYou can also use markdown images:\n![Avatar](https://api.dicebear.com/7.x/avataaars/svg?seed=test)\n\nAnd links:\n[Visit Dicebear](https://api.dicebear.com)",
    )

    const mentionItems = [
      {
        id: "1",
        label: "John Doe",
        email: "john@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
      },
      {
        id: "2",
        label: "Jane Smith",
        email: "jane@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
      },
    ]

    const CustomMention = ({ mention }: MentionRenderProps) => {
      const user = mentionItems.find((item) => item.label === mention)
      return (
        <a
          href={`mailto:${user?.email}`}
          className="bg-secondary-background inline-flex items-center gap-1 rounded-md px-1 align-middle"
          title={user?.email}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={user?.avatar}
            alt={user?.label}
            className="h-4 w-4 rounded-full"
          />
          {mention}
        </a>
      )
    }

    return (
      <MdInput
        value={value}
        onChange={setValue}
        mentionItems={mentionItems}
      >
        <MdInput.Header>
          <MdInput.Tabs />
          <MdInput.Toolbar />
        </MdInput.Header>
        <MdInput.Container>
          <MdInput.Editor />
          <MdInput.Render
            mentionRenderComponent={CustomMention}
            allowedPrefixes={["https://api.dicebear.com"]}
          />
        </MdInput.Container>
      </MdInput>
    )
  },
}

/**
 * Code Display: Comprehensive demonstration of inline code and code blocks with syntax highlighting.
 * - Shows inline code with backticks.
 * - Demonstrates multi-line code blocks with language-specific syntax highlighting.
 * - Supports JavaScript, TypeScript, Python, JSON, HTML, CSS, Bash, and more.
 * - Code blocks powered by Shiki with automatic theme detection.
 * - Includes copy-to-clipboard functionality.
 * - Useful for technical documentation, tutorials, and API references.
 */
export const CodeDisplay: Story = {
  render: function CodeDisplay() {
    const [value, setValue] = useState(`# Code Examples

## Inline Code

Use backticks for inline code: \`const greeting = "Hello World"\`

You can also use inline code in sentences, like \`Array.map()\` or \`useState()\`.

## Code Blocks

### JavaScript

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55
\`\`\`

### TypeScript

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

function createUser(data: Omit<User, 'id' | 'createdAt'>): User {
  return {
    ...data,
    id: Date.now(),
    createdAt: new Date(),
  };
}

const user = createUser({
  name: "John Doe",
  email: "john@example.com"
});
\`\`\`

### React Component (TSX)

\`\`\`tsx
import React, { useState } from 'react';
import { Button } from '@choiceform/design-system';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex items-center gap-4">
      <Button onClick={() => setCount(count - 1)}>-</Button>
      <span className="text-xl font-bold">{count}</span>
      <Button onClick={() => setCount(count + 1)}>+</Button>
    </div>
  );
}
\`\`\`

### Python

\`\`\`python
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

numbers = [3, 6, 8, 10, 1, 2, 1]
print(quicksort(numbers))
\`\`\`

### JSON

\`\`\`json
{
  "name": "@choiceform/design-system",
  "version": "1.0.3",
  "description": "Figma-inspired UI component library",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
\`\`\`

### HTML

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App</title>
</head>
<body>
  <div id="root"></div>
  <script src="/main.js"></script>
</body>
</html>
\`\`\`

### CSS

\`\`\`css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.button:hover {
  transform: translateY(-2px);
}
\`\`\`

### Bash/Shell

\`\`\`bash
#!/bin/bash

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
\`\`\`

### SQL

\`\`\`sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email) 
VALUES ('John Doe', 'john@example.com');

SELECT * FROM users WHERE email LIKE '%@example.com';
\`\`\`

### Diff

\`\`\`diff
  function calculate(a, b) {
-   return a + b
+   return a * b
  }

- const result = calculate(2, 3) // 5
+ const result = calculate(2, 3) // 6
\`\`\`

## Code with Comments

\`\`\`javascript
// This is a comment
const API_URL = 'https://api.example.com';

/**
 * Fetches user data from the API
 * @param {string} userId - The user ID to fetch
 * @returns {Promise<User>} The user data
 */
async function fetchUser(userId) {
  const response = await fetch(\`\${API_URL}/users/\${userId}\`);
  return response.json();
}

// Call the function
fetchUser('123').then(user => console.log(user));
\`\`\`

## Mixed Content

You can mix inline code \`like this\` with regular text, and also include code blocks:

\`\`\`typescript
// Example of a utility function
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
\`\`\`

And continue with more text after the code block.

---

**Note**: All code blocks support syntax highlighting and copy-to-clipboard functionality!`)

    return (
      <MdInput
        value={value}
        onChange={setValue}
      >
        <MdInput.Header>
          <MdInput.Tabs />
          <MdInput.Toolbar />
        </MdInput.Header>
        <MdInput.Container>
          <MdInput.Editor
            placeholder="Write code examples..."
            minRows={24}
            maxRows={48}
          />
          <MdInput.Render />
        </MdInput.Container>
      </MdInput>
    )
  },
}
