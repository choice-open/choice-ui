# @choiceform/design-system

A Figma-inspired UI component library for professional desktop applications.

This library provides a set of high-quality, customizable React components designed for building modern, professional-grade desktop web applications. The design language is inspired by Figma, focusing on clarity, usability, and a clean aesthetic suitable for complex, data-rich interfaces.

## Features

- ✨ Figma-style design: Minimal, clear, and modern UI
- 🖥️ Optimized for professional desktop web apps
- 🧩 Rich set of reusable React components
- 🎨 Built-in theming and dark mode support
- ⚡️ Tailwind CSS for rapid styling
- 🛠️ TypeScript for type safety

## Installation

Add the packages to your project:

```bash
pnpm add @choiceform/design-system @choiceform/design-tokens
# or
npm install @choiceform/design-system @choiceform/design-tokens
```

## Setup

Import the design tokens in your main CSS file:

```css
/* In your main CSS file (e.g., app.css or index.css) */
@import "@choiceform/design-tokens/tokens.css";
@import "@choiceform/design-tokens/preflight.css";
@import "@choiceform/design-tokens/tailwind.css";
```

**Note:** The old `@import "@choiceform/design-system/styles/theme.css"` is no longer needed and should be removed.

Learn more about design tokens at [https://tokens.choiceform.app/](https://tokens.choiceform.app/)

## Usage

Import and use components in your React app:

```tsx
import { Button, Input } from "@choiceform/design-system"

export default function Example() {
  return (
    <div>
      <Button variant="primary">Click me</Button>
      <Input placeholder="Type here..." />
    </div>
  )
}
```

## Development

Run the development server:

```bash
pnpm dev
```

## Build

Build the library for production:

```bash
pnpm build
```

## Contributing

Contributions are welcome! Please open issues or pull requests for new components, bug fixes, or improvements.

---

© Choiceform. All rights reserved.
