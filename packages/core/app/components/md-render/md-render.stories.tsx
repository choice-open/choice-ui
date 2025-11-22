import type { Meta, StoryObj } from "@storybook/react-vite"
import React from "react"
import { MdRender } from "./md-render"
import { Avatar } from "../avatar"
import { Tooltip } from "../tooltip"
import type { MentionRenderProps } from "./types"
import { useDarkMode } from "@vueless/storybook-dark-mode"

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
