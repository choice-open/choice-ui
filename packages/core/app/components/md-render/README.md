# MdRender Component

A powerful markdown renderer component with GitHub Flavored Markdown (GFM) support, syntax-highlighted code blocks, and customizable mention rendering.

## Features

- 📝 **GitHub Flavored Markdown**: Full GFM support including tables, task lists, and strikethrough
- 🎨 **Syntax Highlighting**: Code blocks powered by Shiki with automatic theme detection
- 👤 **Custom Mentions**: Flexible @mention rendering with custom components
- 🔒 **URL Whitelisting**: Security through allowed URL prefixes
- 🎯 **Lightweight**: Minimal dependencies, optimized performance
- ♿ **Accessible**: Semantic HTML with proper ARIA attributes
- 🌓 **Theme Support**: Automatic light/dark mode adaptation

## Installation

The MdRender component is part of the `@choiceform/design-system` package.

```bash
pnpm add @choiceform/design-system
```

## Basic Usage

### Simple Rendering

```tsx
import { MdRender } from "@choiceform/design-system"

function App() {
  const markdown = `# Hello World

This is **bold text** and *italic text*.

- List item 1
- List item 2`

  return <MdRender content={markdown} />
}
```

### With Different Sizes

```tsx
// Small size (13px base) - for compact UIs
<MdRender 
  content={markdown}
  size="small"
/>

// Default size (14px base) - standard
<MdRender content={markdown} />

// Large size (16px base) - for documentation
<MdRender 
  content={markdown}
  size="large"
/>
```

### With Custom Styling

```tsx
<MdRender 
  content={markdown}
  className="my-custom-class"
/>
```

## Component API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `string` | **required** | Markdown content to render |
| `size` | `"small"` \| `"default"` \| `"large"` | `"default"` | Typography size mode |
| `mentionItems` | `MentionItemProps[]` | `undefined` | Array of mentionable items |
| `mentionRenderComponent` | `React.ComponentType<MentionRenderProps>` | `undefined` | Custom mention renderer component |
| `allowedPrefixes` | `string[]` | `undefined` | Allowed URL prefixes for links and images |
| `className` | `string` | `undefined` | Additional CSS classes |

### Type Definitions

```typescript
interface MentionItemProps {
  id: string
  label: string
  [key: string]: unknown  // Additional custom properties
}

interface MentionRenderProps {
  mention: string
  mentionItems?: MentionItemProps[]
}
```

## Supported Markdown Features

### Text Formatting

```markdown
**Bold text**
*Italic text*
***Bold and italic***
~~Strikethrough~~
`Inline code`
```

### Headings

```markdown
# H1
## H2
### H3
#### H4
##### H5
###### H6
```

### Lists

#### Unordered Lists

```markdown
- Item 1
- Item 2
  - Nested item
  - Another nested item
```

#### Ordered Lists

```markdown
1. First item
2. Second item
   1. Nested item
   2. Another nested item
```

#### Task Lists

```markdown
- [x] Completed task
- [ ] Incomplete task
- [x] Another completed task
```

### Code Blocks

````markdown
```javascript
function hello() {
  console.log("Hello, World!");
}
```
````

Supported languages include: JavaScript, TypeScript, Python, JSON, HTML, CSS, Bash, SQL, and many more through Shiki.

### Tables

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|:--------:|---------:|
| Left     | Center   | Right    |
| Aligned  | Aligned  | Aligned  |
```

### Blockquotes

```markdown
> This is a blockquote
> 
> With multiple lines

> Nested blockquotes
> > Are also supported
```

### Links and Images

```markdown
[Link text](https://example.com)

![Image alt text](https://example.com/image.jpg)

<https://auto-linked-url.com>
```

### Horizontal Rules

```markdown
---
***
___
```

## Sizing Modes

The component supports three sizing modes optimized for different use cases:

### Small Mode (13px base)

Ideal for space-constrained interfaces:

```tsx
<MdRender content={markdown} size="small" />
```

**Use cases:**
- Sidebar panels
- Compact widgets
- Mobile interfaces
- Quick previews

**Characteristics:**
- Base font: 13px
- H1: 20.8px (1.6em)
- Reduced spacing (80% of default)
- Maintains readability while saving space

### Default Mode (14px base)

Standard mode for most content:

```tsx
<MdRender content={markdown} />
```

**Use cases:**
- Chat messages
- Comments
- General content
- UI components

**Characteristics:**
- Base font: 14px
- H1: 26.24px (1.875em)
- Standard spacing
- Balanced readability and space usage

### Large Mode (16px base)

Enhanced readability for long-form content:

```tsx
<MdRender content={markdown} size="large" />
```

**Use cases:**
- Documentation pages
- Blog articles
- Technical guides
- Reading-focused content

**Characteristics:**
- Base font: 16px
- H1: 32px (2em)
- Increased spacing (125% of default)
- Maximum readability and visual hierarchy

## Advanced Usage

### Custom Mention Rendering

```tsx
import { MdRender } from "@choiceform/design-system"
import { Avatar } from "@choiceform/design-system"

const mentionItems = [
  { 
    id: "1", 
    label: "John Doe",
    email: "john@example.com",
    avatar: "https://example.com/avatar.jpg"
  }
]

const CustomMention = ({ mention, mentionItems }: MentionRenderProps) => {
  const user = mentionItems?.find(item => item.label === mention)
  
  if (!user) {
    return <span>@{mention}</span>
  }
  
  return (
    <a 
      href={`mailto:${user.email}`}
      className="inline-flex items-center gap-1"
    >
      <Avatar photo={user.avatar} name={user.label} size="small" />
      {mention}
    </a>
  )
}

function App() {
  const content = "Hey @John Doe, check this out!"
  
  return (
    <MdRender
      content={content}
      mentionItems={mentionItems}
      mentionRenderComponent={CustomMention}
    />
  )
}
```

### URL Whitelisting

For security, you can whitelist allowed URL prefixes for links and images:

```tsx
<MdRender
  content={markdown}
  allowedPrefixes={[
    "https://example.com",
    "https://cdn.example.com",
    "https://api.dicebear.com"
  ]}
/>
```

URLs not matching the allowed prefixes will be filtered out.

### Mentions with Rich Tooltips

```tsx
import { MdRender } from "@choiceform/design-system"
import { Avatar, Tooltip } from "@choiceform/design-system"

const CustomMention = ({ mention, mentionItems }: MentionRenderProps) => {
  const user = mentionItems?.find(item => item.label === mention)
  
  if (!user) return <span>@{mention}</span>
  
  return (
    <Tooltip
      content={
        <div className="flex items-center gap-2">
          <Avatar photo={user.avatar} name={user.label} size="large" />
          <div>
            <div className="font-bold">{user.label}</div>
            <div className="text-sm">{user.email}</div>
          </div>
        </div>
      }
    >
      <a href={`mailto:${user.email}`}>
        <Avatar photo={user.avatar} name={user.label} size="small" />
        {mention}
      </a>
    </Tooltip>
  )
}
```

## Examples

### Technical Documentation

```tsx
const documentation = `# API Reference

## Installation

\`\`\`bash
npm install @example/package
\`\`\`

## Usage

\`\`\`typescript
import { Client } from '@example/package';

const client = new Client({
  apiKey: process.env.API_KEY
});
\`\`\`

## Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| \`get()\` | \`id: string\` | \`Promise<Data>\` | Fetches data |
| \`create()\` | \`data: Data\` | \`Promise<Data>\` | Creates data |
`

// Use large size for better readability
<MdRender 
  content={documentation}
  size="large"
/>
```

### Task Management

```tsx
const tasks = `# Sprint Tasks

## In Progress

- [x] @JohnDoe Design mockups
- [x] @JaneSmith API implementation
- [ ] @BobJohnson Testing

## Pending Review

- [x] Feature A - Ready for QA
- [ ] Feature B - In development
`

// Use default size for task lists
<MdRender 
  content={tasks}
  mentionItems={teamMembers}
  mentionRenderComponent={CustomMention}
/>
```

### Blog Post

```tsx
const blogPost = `# Introducing Our New Feature

> Published on January 1, 2024 by @JohnDoe

We're excited to announce...

## Key Highlights

- **Performance**: 50% faster
- **UX**: Redesigned interface
- **Accessibility**: WCAG 2.1 AA compliant

\`\`\`typescript
// Try it out
import { newFeature } from '@example/lib';

newFeature.init();
\`\`\`

![Feature Screenshot](https://example.com/screenshot.png)

[Read more →](https://example.com/blog/new-feature)
`

// Use large size for blog articles
<MdRender 
  content={blogPost}
  size="large"
/>
```

## Sizing Modes

The component offers three distinct sizing modes, each optimized for specific use cases:

### Size Mode Comparison

| Mode | Base Size | H1 Size | H2 Size | Spacing | Use Case |
|------|-----------|---------|---------|---------|----------|
| `small` | 13px | 20.8px | 17.6px | 80% | Compact UIs, sidebars |
| `default` | 14px | 26.24px | 20.8px | 100% | General content, messages |
| `large` | 16px | 32px | 24px | 125% | Documentation, articles |

### When to Use Each Size

**Small (`size="small"`)**
- Compact panels and sidebars
- Mobile interfaces with limited space
- Quick preview windows
- Widget displays

**Default (no size prop or `size="default"`)**
- Chat messages and comments
- General UI content
- Form descriptions
- Tooltips and hints

**Large (`size="large"`)**
- Technical documentation
- Blog articles and long-form content
- Knowledge base articles
- Tutorial pages
- Reading-focused interfaces

### Example

```tsx
// Small for sidebar
<div className="sidebar w-64">
  <MdRender content={summary} size="small" />
</div>

// Default for messages
<div className="message">
  <MdRender content={comment} />
</div>

// Large for articles
<article className="prose max-w-4xl">
  <MdRender content={article} size="large" />
</article>
```

## Styling

The component uses Tailwind CSS classes through tailwind-variants. You can customize the appearance by:

1. **Using className prop**: Add custom classes to the root container
2. **CSS variables**: Override design tokens for colors and spacing
3. **Tailwind config**: Extend your Tailwind configuration
4. **Size modes**: Choose appropriate size for your use case

### Custom Styling Example

```tsx
<MdRender 
  content={markdown}
  size="large"
  className="custom-class"
/>
```

## Performance

- **Memoization**: Component uses `React.memo` for optimized re-renders
- **Syntax Highlighting**: Cached by Shiki for repeated languages
- **Large Documents**: Efficiently handles documents up to 100KB
- **Lazy Loading**: Code blocks load syntax highlighting on demand

### Performance Tips

1. Memoize the `content` prop to avoid unnecessary re-renders
2. Use `mentionRenderComponent` consistently (don't recreate on every render)
3. Keep `allowedPrefixes` array stable across renders

```tsx
const mentionItems = useMemo(() => users, [users])
const CustomMention = useCallback((props) => <Mention {...props} />, [])

<Render
  content={markdown}
  mentionItems={mentionItems}
  mentionRenderComponent={CustomMention}
/>
```

## Accessibility

The component follows accessibility best practices:

- ✅ Semantic HTML elements (h1-h6, ul, ol, table, etc.)
- ✅ Proper heading hierarchy
- ✅ Accessible links with target="_blank" and rel="noopener noreferrer"
- ✅ Alt text support for images
- ✅ Keyboard navigation for interactive elements
- ✅ Screen reader friendly table markup

## Security

### URL Filtering

Use `allowedPrefixes` to whitelist safe domains:

```tsx
<Render
  content={userGeneratedContent}
  allowedPrefixes={["https://yourdomain.com"]}
/>
```

### Content Sanitization

- The component automatically sanitizes HTML
- Dangerous protocols (javascript:, data:) are filtered
- XSS protection through react-markdown

### Best Practices

1. Always use `allowedPrefixes` for user-generated content
2. Validate markdown content on the server side
3. Escape special characters in mentions
4. Use CSP headers for additional protection

## Integration with MdInput

MdRender is designed to work seamlessly with MdInput for a complete editing experience:

```tsx
import { MdInput } from "@choiceform/design-system"

function Editor() {
  const [value, setValue] = useState("")
  
  return (
    <MdInput value={value} onChange={setValue}>
      <MdInput.Header>
        <MdInput.Tabs />
        <MdInput.Toolbar />
      </MdInput.Header>
      <MdInput.Container>
        <MdInput.Editor />
        {/* MdRender is used internally in MdInput.Render */}
        <MdInput.Render />
      </MdInput.Container>
    </MdInput>
  )
}
```

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 12+, Chrome Android

## Dependencies

- `react-markdown`: Markdown parsing
- `remark-gfm`: GitHub Flavored Markdown support
- `shiki`: Syntax highlighting (via CodeBlock component)
- `tailwind-variants`: Styling utilities

## Related Components

- [CodeBlock](../code-block/README.md): Syntax-highlighted code display
- [MdInput](../md-input/README.md): Markdown editor with preview
- [Avatar](../avatar/README.md): User avatar display
- [Tooltip](../tooltip/README.md): Contextual tooltips

## Examples

See the [Storybook stories](./md-render.stories.tsx) for comprehensive examples including:

- Basic markdown rendering
- GitHub Flavored Markdown features
- Code blocks with syntax highlighting
- Task lists and tables
- Custom mention rendering
- Complex document structures
- URL whitelisting

## Contributing

When adding new markdown features:

1. Update the component implementation
2. Add corresponding stories
3. Update this README
4. Add tests if applicable

## License

Part of the ChoiceForm Design System.

