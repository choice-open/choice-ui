---
name: component-docs
description: Generate and update Choice UI component documentation, README files, and Storybook stories. Use when writing component documentation, creating usage examples, or adding Storybook stories.
---

# Choice UI Component Documentation

## Documentation Locations

1. **Component README** - `packages/core/app/components/{name}/README.md`
2. **Storybook Stories** - `packages/storybook/stories/{name}.stories.tsx`
3. **Generated Docs** - Auto-generated from stories to `packages/docs/`

## README Template

```markdown
# @choice-ui/{component-name}

Brief description of the component.

## Features

- Feature 1
- Feature 2
- Accessibility support

## Installation

\`\`\`bash
pnpm add @choice-ui/{component-name}
\`\`\`

## Usage

\`\`\`tsx
import { {Component} } from "@choice-ui/{component-name}"

function Example() {
  return <{Component} variant="default">Content</{Component}>
}
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | "default" \| "primary" | "default" | Visual variant |
| size | "sm" \| "md" \| "lg" | "md" | Component size |
| className | string | - | Additional CSS classes |

## Variants

### Default
\`\`\`tsx
<{Component} variant="default">Default</{Component}>
\`\`\`

### Primary
\`\`\`tsx
<{Component} variant="primary">Primary</{Component}>
\`\`\`

## Accessibility

- Keyboard navigation: Describe keyboard interactions
- Screen readers: Describe ARIA support
- Focus management: Describe focus behavior

## Related Components

- [RelatedComponent1](/docs/components/related1)
- [RelatedComponent2](/docs/components/related2)
```

## Storybook Story Template

```tsx
import type { Meta, StoryObj } from "@storybook/react"
import { {Component} } from "@choice-ui/react"

const meta: Meta<typeof {Component}> = {
  title: "Components/{Component}",
  component: {Component},
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: "Default {Component}",
  },
}

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary {Component}",
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <{Component} size="sm">Small</{Component}>
      <{Component} size="md">Medium</{Component}>
      <{Component} size="lg">Large</{Component}>
    </div>
  ),
}

export const WithCustomClass: Story = {
  args: {
    className: "custom-class",
    children: "Custom styled",
  },
}
```

## Instructions

1. **Read the component source** to understand props and variants
2. **Check existing documentation** in similar components for patterns
3. **Create README.md** with all props documented
4. **Create Storybook story** with examples for all variants
5. **Run docs generation** with `pnpm docs:dev` to verify

## Best Practices

- Include real-world usage examples
- Document all props with types and defaults
- Show variant combinations
- Include accessibility information
- Add related component links
- Keep examples concise and copy-pasteable
