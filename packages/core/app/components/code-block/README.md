# CodeBlock Component

A flexible and feature-rich code block component with syntax highlighting, copy functionality, expand/collapse features, and comprehensive language support.

## Features

- 🎨 **Syntax Highlighting**: Powered by [Shiki](https://shiki.matsu.io/) for accurate, VS Code-quality highlighting
- 🌓 **Auto Theme Detection**: Automatically adapts to system/app theme (light/dark)
- 📋 **Copy to Clipboard**: One-click code copying with visual feedback
- 📂 **Expand/Collapse**: Smart truncation for long code with expand controls
- 🗂️ **Language Icons**: Automatic language detection with custom icons
- 🌍 **i18n Support**: Customizable labels and tooltips
- 📊 **Line Count Display**: Shows total lines in header
- 🎯 **Compound Component**: Flexible composition with Header, Content, and Footer

## Installation

The CodeBlock component is part of the `@choiceform/design-system` package.

```bash
pnpm add @choiceform/design-system
```

## Basic Usage

### Simple Code Block

```tsx
import { CodeBlock } from "@choiceform/design-system"

function App() {
  const code = `function hello() {
  console.log('Hello, World!')
}`

  return (
    <CodeBlock language="javascript">
      <CodeBlock.Content code={code} />
    </CodeBlock>
  )
}
```

### With Header and Footer

```tsx
<CodeBlock
  language="tsx"
  filename="App.tsx"
>
  <CodeBlock.Header />
  <CodeBlock.Content code={code} />
  <CodeBlock.Footer />
</CodeBlock>
```

## Component API

### CodeBlock

Main container component that provides context to child components.

#### Props

| Prop                  | Type                          | Default  | Description                                  |
| --------------------- | ----------------------------- | -------- | -------------------------------------------- |
| `language`            | `string`                      | `"code"` | Programming language for syntax highlighting |
| `filename`            | `string`                      | -        | Filename to display in header                |
| `lineThreshold`       | `number`                      | `20`     | Line count threshold for showing footer      |
| `expandable`          | `boolean`                     | `true`   | Enable expand/collapse functionality         |
| `defaultExpanded`     | `boolean`                     | `true`   | Initial expanded state                       |
| `defaultCodeExpanded` | `boolean`                     | `false`  | Initial code expansion state (for long code) |
| `onExpandChange`      | `(expanded: boolean) => void` | -        | Callback when expand state changes           |
| `onCodeExpandChange`  | `(expanded: boolean) => void` | -        | Callback when code expansion changes         |
| `className`           | `string`                      | -        | Additional CSS classes                       |

### CodeBlock.Header

Displays filename, language icon, line count, and action buttons.

#### Props

| Prop            | Type      | Default | Description                                    |
| --------------- | --------- | ------- | ---------------------------------------------- |
| `showLineCount` | `boolean` | `true`  | Show line count indicator                      |
| `i18n`          | `object`  | -       | Custom labels (copy, copied, expand, collapse) |
| `className`     | `string`  | -       | Additional CSS classes                         |

#### i18n Object

```tsx
{
  copy: "Copy",
  copied: "Copied",
  expand: "Expand",
  collapse: "Collapse"
}
```

### CodeBlock.Content

Renders the syntax-highlighted code content.

#### Props

| Prop             | Type      | Default      | Description                  |
| ---------------- | --------- | ------------ | ---------------------------- |
| `code`           | `string`  | **required** | Code content to display      |
| `withScrollArea` | `boolean` | `true`       | Enable scroll area container |
| `className`      | `string`  | -            | Additional CSS classes       |

### CodeBlock.Footer

Shows expand/collapse controls when code exceeds line threshold.

#### Props

| Prop        | Type     | Default | Description            |
| ----------- | -------- | ------- | ---------------------- |
| `className` | `string` | -       | Additional CSS classes |

## Supported Languages

The component automatically detects and applies syntax highlighting for numerous languages:

### Web Technologies

- JavaScript (js, jsx)
- TypeScript (ts, tsx, d.ts)
- HTML
- CSS, SCSS, Sass, Less
- JSON
- XML

### Programming Languages

- Python
- Java
- C, C++
- Go
- Rust
- PHP
- Ruby
- Node.js

### Markup & Config

- Markdown (md, mdx)
- YAML (yaml, yml)
- Shell (bash, sh, zsh)
- Plain text (text, txt)

And many more through Shiki's comprehensive language support.

## Language Icons

The component displays language-specific icons in the header. Icons are automatically selected based on:

1. **Filename extension**: `filename="App.tsx"` → TypeScript icon
2. **Language prop**: `language="python"` → Python icon
3. **Fallback**: Default code icon for unsupported languages

Currently supported icons:

- JavaScript/JSX
- TypeScript/TSX
- And more (extensible icon system)

## Advanced Usage

### Collapsed by Default

```tsx
<CodeBlock
  language="python"
  filename="example.py"
  defaultExpanded={false}
>
  <CodeBlock.Header />
  <CodeBlock.Content code={code} />
</CodeBlock>
```

### Custom Line Threshold

```tsx
<CodeBlock
  language="javascript"
  lineThreshold={10} // Show footer after 10 lines
>
  <CodeBlock.Header />
  <CodeBlock.Content code={code} />
  <CodeBlock.Footer />
</CodeBlock>
```

### Without Scroll Container

```tsx
<CodeBlock language="js">
  <CodeBlock.Content
    code={code}
    withScrollArea={false}
  />
</CodeBlock>
```

### Custom i18n

```tsx
<CodeBlock
  language="tsx"
  filename="App.tsx"
>
  <CodeBlock.Header
    i18n={{
      copy: "复制",
      copied: "已复制",
      expand: "展开",
      collapse: "折叠",
    }}
  />
  <CodeBlock.Content code={code} />
</CodeBlock>
```

### Non-expandable

```tsx
<CodeBlock
  language="json"
  expandable={false}
>
  <CodeBlock.Header />
  <CodeBlock.Content code={code} />
</CodeBlock>
```

## Theme Integration

The component automatically detects theme changes from:

- `.dark` class on `<html>` element
- `data-theme="dark"` attribute on `<html>` element

Theme switching is handled automatically using `MutationObserver`, providing seamless dark/light mode transitions.

## Performance

- **Syntax Highlighting Cache**: Highlighted code is cached to improve performance
- **Lazy Rendering**: Uses React's memo for optimized re-renders
- **Efficient Updates**: Only re-highlights when code, language, or theme changes

## Accessibility

- Semantic HTML structure
- Keyboard navigation support
- Copy button with visual feedback
- Expand/collapse controls with proper ARIA labels

## Best Practices

1. **Always specify language**: Provides better syntax highlighting

   ```tsx
   <CodeBlock language="typescript">
   ```

2. **Use filename for context**: Helps users understand the code context

   ```tsx
   <CodeBlock language="tsx" filename="App.tsx">
   ```

3. **Set appropriate line threshold**: Balance between space and usability

   ```tsx
   <CodeBlock lineThreshold={15}>
   ```

4. **Provide i18n labels**: For non-English applications
   ```tsx
   <CodeBlock.Header i18n={{ copy: "コピー", ... }}>
   ```

## Examples

See the [Storybook stories](./code-block.stories.tsx) for comprehensive examples including:

- Different programming languages
- Long code with scrolling
- Expand/collapse functionality
- Custom themes and i18n
- Language-specific icons

## Technical Details

### Dependencies

- **Shiki**: Syntax highlighting engine
- **React**: UI framework
- **Tailwind CSS**: Styling via tailwind-variants

### Component Structure

```
code-block/
├── code-block.tsx              # Main container component
├── index.ts                    # Public exports
├── types.ts                    # TypeScript definitions
├── hooks/
│   ├── use-code-block.ts      # Main logic hook
│   ├── use-theme.ts           # Theme detection hook
│   ├── use-line-count.ts      # Line counting hook
│   └── use-scroll-detection.ts # Scroll state hook
├── components/
│   ├── code-block-header.tsx  # Header subcomponent
│   ├── code-block-content.tsx # Content subcomponent
│   ├── code-block-footer.tsx  # Footer subcomponent
│   └── code-block-code.tsx    # Code renderer
└── utils/
    ├── language-icon-map.tsx  # Icon mappings
    └── extract-code.ts        # Code extraction utilities
```

## Contributing

When adding new language icons:

1. Add SVG to `utils/language-icon-map.tsx`
2. Map language identifiers in `languageIconMap`
3. Update this README with the new language

## License

Part of the ChoiceForm Design System.
