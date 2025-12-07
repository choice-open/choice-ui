import { Avatar } from "@choiceform/avatar"
import { ScrollArea } from "@choiceform/scroll-area"
import { Tooltip } from "@choiceform/tooltip"
import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { useRef, useState } from "react"
import { useStickToBottom } from "use-stick-to-bottom"
import { MdRender } from "../src/md-render"
import type { MentionRenderProps } from "../src/types"

const meta: Meta<typeof MdRender> = {
  title: "Components/MdRender",
  component: MdRender,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A markdown renderer component with GitHub Flavored Markdown support, syntax-highlighted code blocks, and customizable mention rendering. Ideal for displaying formatted markdown content with rich interactivity.",
      },
    },
  },
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof MdRender>

/**
 * Basic markdown rendering with common formatting elements.
 * - Headings, paragraphs, lists
 * - Bold, italic, strikethrough text
 * - Links and inline code
 */
export const Basic: Story = {
  args: {
    content: `# Heading 1

## Heading 2

### Heading 3

This is a paragraph with **bold text**, *italic text*, and ~~strikethrough text~~.

You can also use \`inline code\` in your content.

- Unordered list item 1
- Unordered list item 2
- Unordered list item 3

1. Ordered list item 1
2. Ordered list item 2
3. Ordered list item 3

[Link to example](https://example.com)`,
  },
}

const GitHubFlavoredMarkdownContent = `# GitHub Flavored Markdown

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

---

## Blockquotes

> This is a blockquote.
> It can span multiple lines.

> Nested blockquotes
> > Are also supported

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

## Links and Images

[Link text](https://example.com)

<https://example.com>

![Image alt text](https://via.placeholder.com/150)

---

## Horizontal Rules

---

***

___`

/**
 * Comprehensive GitHub Flavored Markdown demonstration.
 * - All GFM features including tables, task lists, blockquotes
 * - Code blocks with syntax highlighting
 * - Complex nested structures
 */
export const GitHubFlavoredMarkdown: Story = {
  args: {
    content: GitHubFlavoredMarkdownContent,
  },
}

/**
 * GitHub Flavored Markdown with custom color.
 * - Demonstrates custom color options for the markdown renderer.
 */
export const CustomColor: Story = {
  render: function CustomColorRender() {
    const isDarkMode = useDarkMode()

    const customColor = {
      defaultBackground: isDarkMode ? "var(--color-pink-pale-700)" : "var(--color-pink-300)",
      defaultBoundary: isDarkMode ? "var(--color-pink-pale-500)" : "var(--color-pink-400)",
      secondaryBackground: isDarkMode ? "var(--color-pink-pale-600)" : "var(--color-pink-200)",
      secondaryForeground: isDarkMode ? "var(--color-pink-pale-900)" : "var(--color-pink-pale-500)",
      codeBackground: isDarkMode ? "var(--color-pink-pale-800)" : "var(--color-pink-100)",
    }
    return (
      <MdRender
        className="p-4"
        content={GitHubFlavoredMarkdownContent}
        customColor={customColor}
      />
    )
  },
}

/**
 * Code blocks with multiple programming languages.
 * - Syntax highlighting powered by Shiki
 * - Copy-to-clipboard functionality
 * - Support for JavaScript, TypeScript, Python, JSON, and more
 */
export const CodeBlocks: Story = {
  args: {
    content: `# Code Examples

## JavaScript

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));
\`\`\`

## TypeScript

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

## React/TSX

\`\`\`tsx
import React, { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count - 1)}>-</button>
      <span>{count}</span>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}
\`\`\`

## Python

\`\`\`python
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)
\`\`\`

## JSON

\`\`\`json
{
  "name": "@choiceform/design-system",
  "version": "1.0.3",
  "dependencies": {
    "react": "^18.3.1"
  }
}
\`\`\`

## Inline Code

Use \`const greeting = "Hello"\` for inline code examples.`,
  },
}

/**
 * Task lists for todo items and checklists.
 * - Interactive checkbox display
 * - Mixed checked/unchecked states
 * - Nested task lists support
 */
export const TaskLists: Story = {
  args: {
    content: `# Project Tasks

## Development Tasks

- [x] Set up project structure
- [x] Install dependencies
- [ ] Implement core features
  - [x] User authentication
  - [x] Data persistence
  - [ ] API integration
  - [ ] Error handling
- [ ] Write documentation
- [ ] Deploy to production

## Review Checklist

- [x] Code review completed
- [x] Tests passing
- [ ] Documentation updated
- [ ] Performance optimized
- [ ] Security audit done

## Shopping List

- [x] Milk
- [x] Bread
- [ ] Eggs
- [ ] Butter
- [ ] Cheese`,
  },
}

/**
 * Tables with different alignments and formatting.
 * - Left, center, and right alignment
 * - Complex table structures
 * - Tables with formatted content
 */
export const Tables: Story = {
  args: {
    content: `# Table Examples

## Basic Table

| Name | Age | Location |
|------|-----|----------|
| John Doe | 28 | New York |
| Jane Smith | 32 | San Francisco |
| Bob Johnson | 45 | Chicago |

## Aligned Columns

| Left Aligned | Center Aligned | Right Aligned |
|:-------------|:--------------:|--------------:|
| Text | Text | Text |
| More text | More text | More text |

## Table with Formatting

| Feature | Status | Description |
|---------|:------:|-------------|
| **Markdown** | ✅ | Full GFM support |
| *Syntax Highlighting* | ✅ | Via Shiki |
| ~~Old Feature~~ | ❌ | Deprecated |
| \`Code inline\` | ✅ | Supported |

## Comparison Table

| Framework | Language | Performance | Learning Curve |
|-----------|----------|:-----------:|:--------------:|
| React | JavaScript | ⭐⭐⭐⭐ | Medium |
| Vue | JavaScript | ⭐⭐⭐⭐⭐ | Easy |
| Angular | TypeScript | ⭐⭐⭐ | Hard |
| Svelte | JavaScript | ⭐⭐⭐⭐⭐ | Easy |`,
  },
}

/**
 * Nested and complex structures.
 * - Nested lists with multiple levels
 * - Blockquotes with formatted content
 * - Mixed content types
 */
export const NestedStructures: Story = {
  args: {
    content: `# Nested Content

## Nested Lists

1. First level item 1
   - Second level item 1.1
   - Second level item 1.2
     - Third level item 1.2.1
     - Third level item 1.2.2
2. First level item 2
   1. Second level ordered 2.1
   2. Second level ordered 2.2
3. First level item 3

## Nested Blockquotes

> First level quote
> > Second level quote
> > > Third level quote
> >
> > Back to second level

> Quote with **formatted text**
> - And a list
> - With multiple items
>
> \`And inline code\`

## Mixed Nesting

- List item with blockquote:
  > This is a quote inside a list
  > With multiple lines

- List item with code:
  \`\`\`javascript
  const nested = true;
  console.log(nested);
  \`\`\`

- List item with task list:
  - [x] Nested task 1
  - [ ] Nested task 2`,
  },
}

/**
 * Basic mention rendering in markdown content.
 * - Simple @mention syntax
 * - Mentions integrated with regular markdown
 * - Default mention styling
 */
export const WithMentions: Story = {
  args: {
    content: `# Team Discussion

Hey @John Doe and @Jane Smith, I wanted to update you on the project progress.

## Action Items

- @Bob Johnson will review the PR
- @Alice Williams will provide design feedback
- @Charlie Brown will handle the deployment

Thanks everyone for your collaboration!

cc: @Diana Prince @Edward Norton`,
    mentionItems: [
      { id: "1", label: "John Doe" },
      { id: "2", label: "Jane Smith" },
      { id: "3", label: "Bob Johnson" },
      { id: "4", label: "Alice Williams" },
      { id: "5", label: "Charlie Brown" },
      { id: "6", label: "Diana Prince" },
      { id: "7", label: "Edward Norton" },
    ],
  },
}

/**
 * Custom mention component with rich UI.
 * - Avatar display in mentions
 * - Tooltip with user details
 * - Interactive hover states
 * - Email link integration
 */
export const CustomMentionRendering: Story = {
  render: function CustomMentionRendering() {
    const content = `# Project Update

## Team Mentions

I'd like to mention @John Doe and @Jane Smith for their excellent work.

**Highlights:**
- @Bob Johnson completed the authentication feature
- @Alice Williams provided great design feedback
- @Charlie Brown handled the code review process

Thanks to @Diana Prince for project management!

## Task Assignment

- [ ] @John Doe - Implement user dashboard
- [ ] @Jane Smith - Design new components
- [x] @Bob Johnson - Set up CI/CD pipeline

cc: @Edward Norton @Fiona Apple`

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
      {
        id: "3",
        label: "Bob Johnson",
        email: "bob@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
      },
      {
        id: "4",
        label: "Alice Williams",
        email: "alice@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
      },
      {
        id: "5",
        label: "Charlie Brown",
        email: "charlie@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=5",
      },
      {
        id: "6",
        label: "Diana Prince",
        email: "diana@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=6",
      },
      {
        id: "7",
        label: "Edward Norton",
        email: "edward@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=7",
      },
      {
        id: "8",
        label: "Fiona Apple",
        email: "fiona@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=8",
      },
    ]

    const CustomMention = ({ mention }: MentionRenderProps) => {
      const user = mentionItems.find((item) => item.label === mention)
      if (!user) {
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
      <MdRender
        content={content}
        mentionItems={mentionItems}
        mentionRenderComponent={CustomMention}
        allowedPrefixes={["https://api.dicebear.com"]}
      />
    )
  },
}

/**
 * Mentions in various markdown contexts.
 * - Mentions in headings, lists, and tables
 * - Mentions with formatted text (bold, italic)
 * - Mentions in blockquotes and links
 */
export const MentionsInVariousContexts: Story = {
  render: function MentionsInVariousContexts() {
    const content = `# Mention @John Doe in Heading

## And @Jane Smith in Subheading

Paragraph with mention: @Bob Johnson

**Bold text with @Alice Williams mention**

*Italic text with @Charlie Brown mention*

### Lists with Mentions

- Item mentioning @John Doe
- Another item with @Jane Smith
- @Bob Johnson in list item

### Blockquote

> Quote mentioning @Alice Williams
> And @Charlie Brown

### Task List

- [x] @John Doe completed setup
- [ ] @Jane Smith reviewing code
- [ ] @Bob Johnson pending approval

### Table

| Name | Status |
|------|--------|
| @Jane Smith | Active |
| @Bob Johnson | Pending |

### Link with Mention

Check out @John Doe's [profile](https://example.com)`

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
      <MdRender
        content={content}
        mentionItems={mentionItems}
        mentionRenderComponent={CustomMention}
      />
    )
  },
}

/**
 * Complex real-world document example.
 * - Project README structure
 * - Mixed content types
 * - Technical documentation format
 */
export const ComplexDocument: Story = {
  args: {
    content: `# Project Documentation

> **Note**: This is a comprehensive example of markdown rendering capabilities.

## Overview

This project demonstrates the **MdRender** component with full GitHub Flavored Markdown support.

### Features

- [x] Full GFM support
- [x] Syntax highlighting via Shiki
- [x] Custom mention rendering
- [x] Table support
- [x] Task lists
- [ ] Additional features coming soon

---

## Installation

\`\`\`bash
npm install @choiceform/design-system
\`\`\`

## Quick Start

\`\`\`typescript
import { Render } from '@choiceform/design-system';

function App() {
  const content = "# Hello World\\n\\nThis is **markdown**!";
  
  return <Render content={content} />;
}
\`\`\`

## API Reference

### Props

| Prop | Type | Required | Description |
|------|------|:--------:|-------------|
| \`content\` | \`string\` | ✅ | Markdown content to render |
| \`mentionItems\` | \`array\` | ❌ | Array of mention items |
| \`mentionRenderComponent\` | \`component\` | ❌ | Custom mention renderer |
| \`allowedPrefixes\` | \`string[]\` | ❌ | Allowed URL prefixes |

## Examples

### Basic Usage

\`\`\`jsx
<Render content="**Hello World**" />
\`\`\`

### With Mentions

\`\`\`jsx
<Render
  content="Hello @JohnDoe"
  mentionItems={users}
  mentionRenderComponent={CustomMention}
/>
\`\`\`

---

## Performance

> The component uses React.memo for optimized rendering and supports large documents efficiently.

### Benchmarks

| Document Size | Render Time | Memory Usage |
|--------------|:-----------:|:------------:|
| Small (< 1KB) | < 10ms | ~2MB |
| Medium (< 10KB) | < 50ms | ~5MB |
| Large (< 100KB) | < 200ms | ~15MB |

---

## License

MIT License - see [LICENSE](LICENSE) for details.

**Made with ❤️ by the ChoiceForm team**`,
  },
}

/**
 * Empty content handling.
 * - Shows how component behaves with empty string
 * - Graceful handling of no content
 */
export const EmptyContent: Story = {
  args: {
    content: "",
  },
}

/**
 * URL Whitelist Security: Demonstrates URL prefix whitelisting for links and images.
 * - Only URLs matching allowedPrefixes are rendered
 * - Protects against malicious external links
 * - Applies to both links and images
 * - Essential for user-generated content
 */
export const URLWhitelist: Story = {
  render: function URLWhitelistRender() {
    const content = `# URL Security Demo

## Allowed URLs (Whitelisted)

These URLs are in the allowedPrefixes list and will work normally:

### Links
- [ChoiceForm Official](https://choiceform.com)
- [ChoiceForm Docs](https://ui.choiceform.app)
- [GitHub Repository](https://github.com/choiceform/design-system)

### Images
![Placeholder from allowed domain](https://via.placeholder.com/150)

## Blocked URLs (Not Whitelisted)

These URLs are NOT in the allowedPrefixes and will be filtered out:

### Blocked Links
- [Malicious Site](https://malicious-site.com) ← This link will be removed
- [Unknown Domain](https://random-domain.xyz) ← This link will be removed

### Blocked Images
![Blocked Image](https://unsafe-domain.com/image.jpg) ← This image will not load

## Security Benefits

> **Important**: The allowedPrefixes feature protects your application from:
> - Phishing links
> - Malicious redirects  
> - Tracking pixels
> - XSS attacks via images
> - Unwanted external resources

## Configuration

Current allowed prefixes:
- \`https://choiceform.com\`
- \`https://ui.choiceform.app\`
- \`https://github.com/choiceform\`
- \`https://via.placeholder.com\`

Any URL not starting with these prefixes will be automatically filtered out for security.`

    return (
      <div className="max-w-3xl">
        <MdRender
          content={content}
          allowedPrefixes={[
            "https://choiceform.com",
            "https://ui.choiceform.app",
            "https://github.com/choiceform",
            "https://via.placeholder.com",
          ]}
        />
      </div>
    )
  },
}

/**
 * URL Whitelist with Mentions: Shows URL whitelisting combined with custom mentions.
 * - Demonstrates mention avatars from whitelisted domains
 * - Shows how allowedPrefixes applies to both markdown and mention components
 * - Essential for user mentions with external avatar URLs
 */
export const URLWhitelistWithMentions: Story = {
  render: function URLWhitelistWithMentionsRender() {
    const content = `# Team Collaboration

## Team Members

Hey @John Doe and @Jane Smith, please review this document.

### Allowed Avatar Sources

These avatars use whitelisted domains (api.dicebear.com) and will display:

- @Bob Johnson
- @Alice Williams
- @Charlie Brown

### Task Assignments

- [x] @John Doe - Complete authentication (uses allowed avatar)
- [ ] @Jane Smith - Design review (uses allowed avatar)
- [ ] @Bob Johnson - Testing phase (uses allowed avatar)

## External Resources

### Whitelisted Images

![Team Photo](https://api.dicebear.com/7.x/avataaars/svg?seed=1)

### Blocked Resources

![External Image](https://unknown-domain.com/image.jpg) ← This image is blocked

[Suspicious Link](https://phishing-site.com) ← This link is removed

## Security Note

> All avatars and external resources are validated against the allowedPrefixes list, ensuring only trusted domains can load content.`

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
      {
        id: "3",
        label: "Bob Johnson",
        email: "bob@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
      },
      {
        id: "4",
        label: "Alice Williams",
        email: "alice@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
      },
      {
        id: "5",
        label: "Charlie Brown",
        email: "charlie@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=5",
      },
    ]

    const CustomMention = ({ mention }: MentionRenderProps) => {
      const user = mentionItems.find((item) => item.label === mention)
      if (!user) {
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
      <div className="max-w-3xl">
        <MdRender
          content={content}
          mentionItems={mentionItems}
          mentionRenderComponent={CustomMention}
          allowedPrefixes={["https://api.dicebear.com"]}
        />
      </div>
    )
  },
}

/**
 * Long document with extensive content.
 * - Tests performance with large content
 * - Multiple sections and subsections
 * - Various content types mixed together
 */
export const LongDocument: Story = {
  args: {
    content: `# Comprehensive Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Features](#features)
4. [API Documentation](#api-documentation)
5. [Examples](#examples)

---

## Introduction

This is a comprehensive guide to using the MdRender component. It demonstrates handling of long-form content with various markdown features.

### What is MdRender?

MdRender is a powerful markdown rendering component built with:

- **React** for component architecture
- **react-markdown** for parsing
- **Shiki** for syntax highlighting
- **Tailwind CSS** for styling

### Why Use MdRender?

> MdRender provides a complete solution for rendering markdown content with GitHub Flavored Markdown support, custom mention rendering, and beautiful syntax highlighting.

Key benefits:

- ✅ Zero configuration required
- ✅ Fully typed with TypeScript
- ✅ Customizable styling
- ✅ Excellent performance
- ✅ Accessible by default

---

## Getting Started

### Installation

\`\`\`bash
# Using npm
npm install @choiceform/design-system

# Using pnpm
pnpm add @choiceform/design-system

# Using yarn
yarn add @choiceform/design-system
\`\`\`

### Basic Example

\`\`\`typescript
import { Render } from '@choiceform/design-system';

export function MyComponent() {
  const markdown = \`
# Hello World

This is **markdown** content!
  \`;

  return <Render content={markdown} />;
}
\`\`\`

---

## Features

### Text Formatting

- **Bold text** with double asterisks
- *Italic text* with single asterisks
- ~~Strikethrough~~ with tildes
- \`Inline code\` with backticks

### Lists

#### Unordered Lists

- Item 1
- Item 2
  - Nested 2.1
  - Nested 2.2
- Item 3

#### Ordered Lists

1. First
2. Second
3. Third

#### Task Lists

- [x] Completed
- [ ] In Progress
- [ ] Todo

### Code Blocks

\`\`\`javascript
// JavaScript example
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
\`\`\`

\`\`\`python
# Python example
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))
\`\`\`

### Tables

| Feature | Supported | Notes |
|---------|:---------:|-------|
| Headers | ✅ | H1-H6 |
| Lists | ✅ | All types |
| Code | ✅ | Inline & blocks |
| Tables | ✅ | With alignment |

---

## API Documentation

### Component Props

\`\`\`typescript
interface RenderProps {
  content: string;
  mentionItems?: MentionItemProps[];
  mentionRenderComponent?: React.ComponentType<MentionRenderProps>;
  allowedPrefixes?: string[];
  className?: string;
}
\`\`\`

### Mention Props

\`\`\`typescript
interface MentionItemProps {
  id: string;
  label: string;
  [key: string]: unknown;
}
\`\`\`

---

## Examples

### Example 1: Basic

\`\`\`jsx
<Render content="# Title\\n\\nParagraph text" />
\`\`\`

### Example 2: With Styling

\`\`\`jsx
<Render 
  content={markdown}
  className="custom-class"
/>
\`\`\`

### Example 3: With Mentions

\`\`\`jsx
const users = [
  { id: '1', label: 'John Doe' }
];

<Render
  content="Hello @John Doe"
  mentionItems={users}
/>
\`\`\`

---

## Conclusion

MdRender provides a complete solution for rendering markdown content in React applications. With its extensive feature set and customization options, it's perfect for documentation, blogs, comments, and any content that needs rich formatting.

For more information, visit our [documentation](https://ui.choiceform.app/) or check out the [GitHub repository](https://github.com/choiceform/design-system).`,
  },
}

const typographyScaleContent = `
# Typography Scale

This document demonstrates the typography scale and sizing system used in the Markdown component.

## Normal Mode (14px base)

The normal mode uses a 14px base font size with the following heading scales:

# H1 Heading - 26.24px (1.875em)
## H2 Heading - 20.8px (1.5em)
### H3 Heading - 17.6px (1.25em)
#### H4 Heading - 15.4px (1.1em)
##### H5 Heading - 14px (1em)
###### H6 Heading - 12.3px (0.875em)

Body text uses 14px with a line-height of 1.7 for optimal readability. The spacing system is based on rem units:
- Small spacing: 3.52px (0.22rem)
- Medium spacing: 7.04px (0.44rem)
- Large spacing: 10.56px (0.66rem)
- Extra large spacing: 14px (0.875rem)

## Compact Mode (13px base)

In compact mode, all sizes are proportionally reduced:

### Typography Sizes
- Base text: 13px
- H1: 20.8px
- H2: 17.6px
- H3: 15px
- H4: 13px
- H5: 12.3px
- H6: 11.4px

### Spacing Adjustments
All spacing values are multiplied by 0.8 for a more condensed layout while maintaining visual hierarchy.
`

export const TypographyScale: Story = {
  render: function TypographyScaleRender() {
    return (
      <div className="max-w-4xl p-6">
        <div className="mb-8">
          <h2 className="text-body-large-strong mb-4">Normal Mode</h2>
          <MdRender content={typographyScaleContent} />
        </div>
        <hr className="my-8" />
        <div>
          <h2 className="text-body-large-strong mb-4">Compact Mode</h2>
          <MdRender
            content={typographyScaleContent}
            size="small"
          />
        </div>
      </div>
    )
  },
}

const sizingContent = `
# Sizing Mode Comparison

This example demonstrates the different sizing modes available for the markdown renderer.

## Typography Sizes

The component supports three sizing modes to accommodate different use cases:

### Small Mode (Compact)
- **Base Size**: 13px
- **Use Case**: Sidebars, panels, compact UI
- **Spacing**: 80% of default
- **Best For**: Space-constrained interfaces

### Default Mode
- **Base Size**: 14px
- **Use Case**: General content, messages, comments
- **Spacing**: Standard spacing
- **Best For**: Most UI scenarios

### Large Mode
- **Base Size**: 16px
- **Use Case**: Documentation, articles, reading-focused content
- **Spacing**: 120-130% of default
- **Best For**: Long-form content, improved readability

## Code Examples

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
\`\`\`

## Lists and Content

- Enhanced readability with larger text
- Improved spacing between elements
- Better visual hierarchy
- Optimized for long reading sessions

| Feature | Small | Default | Large |
|---------|-------|---------|-------|
| Base Size | 13px | 14px | 16px |
| H1 Size | 20.8px | 26.24px | 32px |
| H2 Size | 17.6px | 20.8px | 24px |
| Spacing | 80% | 100% | 125% |

> **Note:** Choose the size that best fits your content type and available space.
`

/**
 * Size Comparison: Shows all three sizing modes side by side.
 * - Small (13px): Compact mode for space-constrained UIs
 * - Default (14px): Standard mode for general content
 * - Large (16px): Enhanced readability for long-form content
 * - Demonstrates proportional scaling of headings and spacing
 */
export const SizeComparison: Story = {
  render: function SizeComparisonRender() {
    return (
      <div className="flex gap-6 p-6">
        <div className="w-80 rounded-xl border bg-white p-4 dark:bg-gray-900">
          <h3 className="text-body-small font-strong mb-4 text-gray-500 uppercase">Small (13px)</h3>
          <MdRender
            content={sizingContent}
            size="small"
          />
        </div>
        <div className="w-80 rounded-xl border bg-white p-4 dark:bg-gray-900">
          <h3 className="text-body-small font-strong mb-4 text-gray-500 uppercase">
            Default (14px)
          </h3>
          <MdRender content={sizingContent} />
        </div>
        <div className="w-80 rounded-xl border bg-white p-4 dark:bg-gray-900">
          <h3 className="text-body-small font-strong mb-4 text-gray-500 uppercase">Large (16px)</h3>
          <MdRender
            content={sizingContent}
            size="large"
          />
        </div>
      </div>
    )
  },
}

/**
 * Large Mode for Documentation: Shows large mode with extensive documentation content.
 * - 16px base font size for enhanced readability
 * - Increased spacing between sections
 * - Ideal for technical documentation and articles
 * - Better visual hierarchy with larger headings
 */
export const LargeModeDocumentation: Story = {
  args: {
    size: "large",
    content: `# API Documentation

Welcome to the comprehensive API documentation. This large format is optimized for reading detailed technical content.

## Getting Started

Before you begin, make sure you have the following prerequisites:

- Node.js 18 or higher
- npm, pnpm, or yarn package manager
- Basic knowledge of React and TypeScript

### Installation

\`\`\`bash
npm install @choiceform/design-system
\`\`\`

### Quick Start

\`\`\`typescript
import { MdRender } from '@choiceform/design-system';

export function App() {
  const content = "# Hello World";
  return <MdRender content={content} />;
}
\`\`\`

## Core Concepts

### Component Architecture

The markdown renderer is built with a modular architecture:

1. **Parser**: Processes markdown syntax using react-markdown
2. **Renderer**: Converts parsed content to React components
3. **Highlighter**: Syntax highlighting via Shiki
4. **Mention System**: Custom @mention rendering

### Supported Features

- ✅ GitHub Flavored Markdown (GFM)
- ✅ Syntax highlighting for 100+ languages
- ✅ Custom mention rendering
- ✅ Tables with alignment support
- ✅ Task lists and checkboxes
- ✅ URL whitelisting for security

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`content\` | \`string\` | **required** | Markdown content |
| \`size\` | \`"small"\` \\| \`"default"\` \\| \`"large"\` | \`"default"\` | Typography size |
| \`mentionItems\` | \`MentionItemProps[]\` | \`undefined\` | Mention items |

### Methods

> **Note:** This component is a pure renderer with no imperative methods.

## Advanced Usage

### Custom Mention Rendering

\`\`\`typescript
const CustomMention = ({ mention }: MentionRenderProps) => {
  return (
    <span className="custom-mention">
      @{mention}
    </span>
  );
};

<MdRender
  content={markdown}
  mentionRenderComponent={CustomMention}
  mentionItems={users}
/>
\`\`\`

### URL Whitelisting

For security, you can restrict which URLs are allowed:

\`\`\`typescript
<MdRender
  content={userContent}
  allowedPrefixes={[
    "https://yourdomain.com",
    "https://cdn.yourdomain.com"
  ]}
/>
\`\`\`

## Best Practices

1. **Choose the right size**: Use \`large\` for documentation, \`default\` for general content, \`small\` for compact UIs
2. **Sanitize user input**: Always validate markdown from untrusted sources
3. **Use allowedPrefixes**: Whitelist safe domains for user-generated content
4. **Optimize performance**: Memoize props to prevent unnecessary re-renders

---

**That's it!** You're now ready to use the markdown renderer in your application.`,
  },
}

/**
 * Github Variant: Shows the github variant of the markdown renderer.
 */

export const GithubVariant: Story = {
  render: function GithubVariantRender() {
    return (
      <div className="grid grid-cols-2 gap-6 p-6">
        <div className="w-full rounded-xl border bg-white p-4 dark:bg-gray-900">
          <h3 className="text-body-small font-strong mb-4 text-gray-500 uppercase">Default</h3>
          <MdRender
            content={sizingContent}
            variant="default"
          />
        </div>

        <div className="w-full rounded-xl border bg-white p-4 dark:bg-gray-900">
          <h3 className="text-body-small font-strong mb-4 text-gray-500 uppercase">Github</h3>
          <MdRender
            content={sizingContent}
            variant="github"
          />
        </div>
      </div>
    )
  },
}

const streamingMarkdownChunks = [
  `# Getting Started

Welcome to our documentation! Let's begin with the basics.`,

  `

## Installation

First, install the package using your preferred package manager:

\`\`\`bash
npm install @choiceform/design-system
\`\`\``,

  `

## Quick Start

Here's a simple example to get you started:

\`\`\`typescript
import { Button } from '@choiceform/design-system'

export function App() {
  return <Button>Click me</Button>
}
\`\`\``,

  `

## Features

Our design system includes:

- ✅ 50+ components
- ✅ Full TypeScript support
- ✅ Dark mode built-in
- ✅ Accessible by default`,

  `

## Component Overview

| Component | Status | Description |
|-----------|--------|-------------|
| Button | Stable | Primary action component |
| Input | Stable | Text input field |
| Modal | Beta | Dialog overlay |
| Table | Alpha | Data display |`,

  `

## Code Examples

### React Component

\`\`\`tsx
import React, { useState } from 'react'
import { Button, Input } from '@choiceform/design-system'

export function LoginForm() {
  const [email, setEmail] = useState('')
  
  return (
    <form>
      <Input
        label="Email"
        value={email}
        onChange={setEmail}
      />
      <Button type="submit">
        Login
      </Button>
    </form>
  )
}
\`\`\``,

  `

### Styling with Tailwind

\`\`\`css
.custom-button {
  @apply px-4 py-2 rounded-lg;
  @apply bg-blue-500 text-white;
  @apply hover:bg-blue-600;
  @apply transition-colors;
}
\`\`\``,

  `

## Best Practices

> **Note:** Always follow accessibility guidelines when building your UI.

1. Use semantic HTML elements
2. Provide proper ARIA labels
3. Ensure keyboard navigation
4. Test with screen readers`,

  `

## Conclusion

That's it! You're now ready to build amazing user interfaces.

**Happy coding!** 🚀`,
]

/**
 * Streaming Markdown: Simulates AI-generated markdown content with auto-scroll.
 * - Uses useStickToBottom hook to keep scroll at bottom
 * - Content appears chunk by chunk like streaming responses
 * - Demonstrates how markdown renders progressively
 */
export const StreamingMarkdown: Story = {
  render: function StreamingMarkdownRender() {
    const [content, setContent] = useState("")
    const [isStreaming, setIsStreaming] = useState(false)
    const chunkIndexRef = useRef(0)

    const { scrollRef, contentRef, isAtBottom, scrollToBottom } = useStickToBottom({
      resize: "smooth",
      initial: "instant",
    })

    const addChunk = () => {
      if (chunkIndexRef.current < streamingMarkdownChunks.length) {
        setContent((prev) => prev + streamingMarkdownChunks[chunkIndexRef.current])
        chunkIndexRef.current++
      }
    }

    const startStreaming = () => {
      if (isStreaming) return
      setIsStreaming(true)

      const interval = setInterval(() => {
        if (chunkIndexRef.current < streamingMarkdownChunks.length) {
          addChunk()
        } else {
          clearInterval(interval)
          setIsStreaming(false)
        }
      }, 800)
    }

    const reset = () => {
      setContent("")
      chunkIndexRef.current = 0
      setIsStreaming(false)
    }

    return (
      <div className="flex h-[600px] w-[700px] flex-col gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={addChunk}
            disabled={isStreaming || chunkIndexRef.current >= streamingMarkdownChunks.length}
            className="rounded bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600 disabled:opacity-50"
          >
            Add Chunk
          </button>
          <button
            onClick={startStreaming}
            disabled={isStreaming || chunkIndexRef.current >= streamingMarkdownChunks.length}
            className="rounded bg-green-500 px-3 py-1.5 text-sm text-white hover:bg-green-600 disabled:opacity-50"
          >
            {isStreaming ? "Streaming..." : "Auto Stream"}
          </button>
          <button
            onClick={reset}
            className="rounded bg-gray-500 px-3 py-1.5 text-sm text-white hover:bg-gray-600"
          >
            Reset
          </button>
          {!isAtBottom && (
            <button
              onClick={() => scrollToBottom()}
              className="rounded bg-orange-500 px-3 py-1.5 text-sm text-white hover:bg-orange-600"
            >
              Scroll to Bottom
            </button>
          )}
        </div>

        <div className="text-body-small text-fg-subtle">
          Chunks: {chunkIndexRef.current}/{streamingMarkdownChunks.length} | At bottom:{" "}
          {isAtBottom ? "Yes" : "No"}
        </div>

        <ScrollArea className="flex-1 rounded-lg border">
          <ScrollArea.Viewport ref={scrollRef}>
            <ScrollArea.Content
              ref={contentRef}
              className="w-full min-w-0 p-4"
            >
              {content ? (
                <MdRender content={content} />
              ) : (
                <div className="text-body-small text-fg-subtle py-8 text-center">
                  Click &quot;Add Chunk&quot; or &quot;Auto Stream&quot; to start
                </div>
              )}
            </ScrollArea.Content>
          </ScrollArea.Viewport>
        </ScrollArea>
      </div>
    )
  },
}

/**
 * Character-by-character streaming markdown simulation.
 * - Content appears gradually like typing effect
 * - Auto-scroll follows the content
 * - Demonstrates real-time markdown parsing
 */
export const CharacterStreamingMarkdown: Story = {
  render: function CharacterStreamingMarkdownRender() {
    const [streamedContent, setStreamedContent] = useState("")
    const [isStreaming, setIsStreaming] = useState(false)

    const fullContent = `# Welcome to the Design System

This is a **streaming demonstration** that shows how markdown content can be rendered progressively with multiple long code blocks.

## React Hook Example

Here's a comprehensive custom hook implementation:

\`\`\`typescript
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'

interface FetchState<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

interface FetchOptions<T> {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: Record<string, unknown>
  headers?: Record<string, string>
  transform?: (data: unknown) => T
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  enabled?: boolean
  refetchInterval?: number
  retryCount?: number
  retryDelay?: number
}

export function useFetch<T>(options: FetchOptions<T>): FetchState<T> {
  const {
    url,
    method = 'GET',
    body,
    headers = {},
    transform,
    onSuccess,
    onError,
    enabled = true,
    refetchInterval,
    retryCount = 3,
    retryDelay = 1000,
  } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const retryCountRef = useRef(0)
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchData = useCallback(async () => {
    if (!enabled) return

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`)
      }

      const rawData = await response.json()
      const transformedData = transform ? transform(rawData) : rawData as T

      setData(transformedData)
      onSuccess?.(transformedData)
      retryCountRef.current = 0
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return // Ignore abort errors
      }

      const error = err instanceof Error ? err : new Error('Unknown error')

      if (retryCountRef.current < retryCount) {
        retryCountRef.current++
        setTimeout(fetchData, retryDelay * retryCountRef.current)
        return
      }

      setError(error)
      onError?.(error)
    } finally {
      setLoading(false)
    }
  }, [url, method, body, headers, transform, onSuccess, onError, enabled, retryCount, retryDelay])

  useEffect(() => {
    fetchData()

    return () => {
      abortControllerRef.current?.abort()
    }
  }, [fetchData])

  useEffect(() => {
    if (!refetchInterval || !enabled) return

    const intervalId = setInterval(fetchData, refetchInterval)
    return () => clearInterval(intervalId)
  }, [fetchData, refetchInterval, enabled])

  const memoizedState = useMemo(() => ({
    data,
    loading,
    error,
    refetch: fetchData,
  }), [data, loading, error, fetchData])

  return memoizedState
}
\`\`\`

## React Component Example

A complex form component with validation:

\`\`\`tsx
import React, { useState, useCallback, useEffect, FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FormField {
  name: string
  type: 'text' | 'email' | 'password' | 'number' | 'textarea'
  label: string
  placeholder?: string
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  errorMessage?: string
}

interface DynamicFormProps {
  fields: FormField[]
  onSubmit: (data: Record<string, string>) => Promise<void>
  submitText?: string
  className?: string
}

export function DynamicForm({
  fields,
  onSubmit,
  submitText = 'Submit',
  className,
}: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Initialize form data
  useEffect(() => {
    const initialData: Record<string, string> = {}
    fields.forEach(field => {
      initialData[field.name] = ''
    })
    setFormData(initialData)
  }, [fields])

  const validateField = useCallback((field: FormField, value: string): string | null => {
    if (field.required && !value.trim()) {
      return field.errorMessage || \`\${field.label} is required\`
    }

    if (field.minLength && value.length < field.minLength) {
      return \`\${field.label} must be at least \${field.minLength} characters\`
    }

    if (field.maxLength && value.length > field.maxLength) {
      return \`\${field.label} must be no more than \${field.maxLength} characters\`
    }

    if (field.pattern && !field.pattern.test(value)) {
      return field.errorMessage || \`\${field.label} format is invalid\`
    }

    if (field.type === 'email' && value) {
      const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address'
      }
    }

    return null
  }, [])

  const handleChange = useCallback((name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))

    const field = fields.find(f => f.name === name)
    if (field && touched[name]) {
      const error = validateField(field, value)
      setErrors(prev => ({ ...prev, [name]: error || '' }))
    }
  }, [fields, touched, validateField])

  const handleBlur = useCallback((name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }))

    const field = fields.find(f => f.name === name)
    if (field) {
      const value = formData[name] || ''
      const error = validateField(field, value)
      setErrors(prev => ({ ...prev, [name]: error || '' }))
    }
  }, [fields, formData, validateField])

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setSubmitSuccess(false)

    // Validate all fields
    const newErrors: Record<string, string> = {}
    let hasErrors = false

    fields.forEach(field => {
      const error = validateField(field, formData[field.name] || '')
      if (error) {
        newErrors[field.name] = error
        hasErrors = true
      }
    })

    setErrors(newErrors)
    setTouched(Object.fromEntries(fields.map(f => [f.name, true])))

    if (hasErrors) return

    setIsSubmitting(true)

    try {
      await onSubmit(formData)
      setSubmitSuccess(true)
      // Reset form
      const resetData: Record<string, string> = {}
      fields.forEach(field => {
        resetData[field.name] = ''
      })
      setFormData(resetData)
      setTouched({})
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Submission failed')
    } finally {
      setIsSubmitting(false)
    }
  }, [fields, formData, onSubmit, validateField])

  return (
    <form onSubmit={handleSubmit} className={className}>
      <AnimatePresence>
        {fields.map((field, index) => (
          <motion.div
            key={field.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="mb-4"
          >
            <label className="block text-sm font-medium mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                name={field.name}
                value={formData[field.name] || ''}
                onChange={e => handleChange(field.name, e.target.value)}
                onBlur={() => handleBlur(field.name)}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border rounded-md"
                rows={4}
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={e => handleChange(field.name, e.target.value)}
                onBlur={() => handleBlur(field.name)}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border rounded-md"
              />
            )}
            {touched[field.name] && errors[field.name] && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors[field.name]}
              </motion.p>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {submitError && (
        <div className="text-red-500 mb-4">{submitError}</div>
      )}

      {submitSuccess && (
        <div className="text-green-500 mb-4">Form submitted successfully!</div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-4 bg-blue-500 text-white rounded-md"
      >
        {isSubmitting ? 'Submitting...' : submitText}
      </button>
    </form>
  )
}
\`\`\`

## Python Backend Example

A FastAPI server implementation:

\`\`\`python
from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import asyncio
import logging
import uuid

# Database setup
DATABASE_URL = "postgresql://user:password@localhost/dbname"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Models
class UserModel(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Pydantic schemas
class UserCreate(BaseModel):
    email: str
    username: str
    password: str

    @validator('email')
    def validate_email(cls, v):
        if '@' not in v:
            raise ValueError('Invalid email format')
        return v.lower()

    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        return v

class UserResponse(BaseModel):
    id: str
    email: str
    username: str
    is_active: bool
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None

# App setup
app = FastAPI(
    title="User Management API",
    description="A comprehensive user management system",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependencies
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Background tasks
async def send_verification_email(email: str, token: str):
    logger.info(f"Sending verification email to {email}")
    await asyncio.sleep(2)  # Simulate email sending
    logger.info(f"Verification email sent to {email}")

async def log_user_activity(user_id: str, action: str):
    logger.info(f"User {user_id} performed action: {action}")

# Routes
@app.post("/users/", response_model=UserResponse, status_code=201)
async def create_user(
    user: UserCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    # Check if user exists
    existing_user = db.query(UserModel).filter(
        (UserModel.email == user.email) | (UserModel.username == user.username)
    ).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    # Create user
    db_user = UserModel(
        email=user.email,
        username=user.username,
        hashed_password=hash_password(user.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Send verification email in background
    verification_token = generate_token()
    background_tasks.add_task(send_verification_email, user.email, verification_token)
    background_tasks.add_task(log_user_activity, db_user.id, "account_created")

    return db_user

@app.get("/users/", response_model=List[UserResponse])
async def list_users(
    skip: int = 0,
    limit: int = 100,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(UserModel)

    if is_active is not None:
        query = query.filter(UserModel.is_active == is_active)

    users = query.offset(skip).limit(limit).all()
    return users

@app.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

@app.put("/users/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    user_update: UserUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    user = db.query(UserModel).filter(UserModel.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = user_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)

    background_tasks.add_task(log_user_activity, user_id, "profile_updated")

    return user

@app.delete("/users/{user_id}", status_code=204)
async def delete_user(
    user_id: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    user = db.query(UserModel).filter(UserModel.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()

    background_tasks.add_task(log_user_activity, user_id, "account_deleted")

def hash_password(password: str) -> str:
    import hashlib
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token() -> str:
    return str(uuid.uuid4())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
\`\`\`

## Summary

> This demonstrates how the MdRender component handles streaming content with multiple long code blocks.

| Feature | Status |
|---------|--------|
| Streaming | ✅ |
| Auto-scroll | ✅ |
| Multiple code blocks | ✅ |
| Syntax highlighting | ✅ |
| Long content | ✅ |

**Testing complete!**`

    const { scrollRef, contentRef } = useStickToBottom({
      resize: "smooth",
      initial: "instant",
    })

    const startCharacterStream = () => {
      if (isStreaming) return
      setIsStreaming(true)
      setStreamedContent("")

      let index = 0
      const interval = setInterval(() => {
        if (index < fullContent.length) {
          const chunkSize = Math.floor(Math.random() * 8) + 2
          setStreamedContent(fullContent.slice(0, index + chunkSize))
          index += chunkSize
        } else {
          clearInterval(interval)
          setIsStreaming(false)
        }
      }, 15)
    }

    const reset = () => {
      setStreamedContent("")
      setIsStreaming(false)
    }

    return (
      <div className="flex h-[500px] w-[600px] flex-col gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={startCharacterStream}
            disabled={isStreaming}
            className="rounded bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {isStreaming ? "Streaming..." : "Start Stream"}
          </button>
          <button
            onClick={reset}
            className="rounded bg-gray-500 px-3 py-1.5 text-sm text-white hover:bg-gray-600"
          >
            Reset
          </button>
        </div>

        <ScrollArea className="flex-1 rounded-lg border">
          <ScrollArea.Viewport ref={scrollRef}>
            <ScrollArea.Content
              ref={contentRef}
              className="w-full min-w-0 p-4"
            >
              {streamedContent ? (
                <MdRender content={streamedContent} />
              ) : (
                <div className="text-body-small text-fg-subtle py-8 text-center">
                  Click &quot;Start Stream&quot; to begin character-by-character streaming
                </div>
              )}
            </ScrollArea.Content>
          </ScrollArea.Viewport>
        </ScrollArea>
      </div>
    )
  },
}
