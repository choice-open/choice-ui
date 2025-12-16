---
name: create-component
description: Create new Choice UI components following project conventions. Use when creating new React components, adding component variants, or scaffolding component structure with proper TypeScript, Tailwind Variants, and accessibility patterns.
---

# Create Choice UI Component

## Component Structure

Each component follows this structure:

```
packages/core/app/components/{component-name}/
├── src/
│   ├── index.ts              # Exports
│   ├── {component-name}.tsx  # Main component
│   ├── tv.tsx                # Tailwind Variants styles
│   └── __tests__/            # Tests (optional)
├── package.json
├── tsup.config.ts
├── README.md
└── CHANGELOG.md
```

## Instructions

1. **Create the directory structure** in `packages/core/app/components/{component-name}/`

2. **Create package.json** following this template:

```json
{
  "name": "@choice-ui/{component-name}",
  "version": "0.0.0",
  "sideEffects": false,
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist", "src"],
  "scripts": {
    "build": "tsup"
  },
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  },
  "devDependencies": {
    "tsup": "^8.5.0"
  },
  "publishConfig": {
    "access": "public"
  }
}
```

3. **Create tsup.config.ts**:

```typescript
import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  treeshake: true,
  external: ["react", "react-dom", /^@choice-ui\//, /^@choiceform\//],
})
```

4. **Create tv.tsx** for Tailwind Variants:

```typescript
import { tcv } from "@choice-ui/shared"

export const {component}Tv = tcv({
  slots: {
    root: "",
    // Add more slots as needed
  },
  variants: {
    variant: {
      default: { root: "" },
      // Add variants
    },
    size: {
      sm: { root: "" },
      md: { root: "" },
      lg: { root: "" },
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
})

export type {Component}TvProps = Parameters<typeof {component}Tv>[0]
```

5. **Create the main component** following accessibility best practices:

```typescript
import { forwardRef, type ComponentPropsWithoutRef } from "react"
import { tcx } from "@choice-ui/shared"
import { {component}Tv, type {Component}TvProps } from "./tv"

export interface {Component}Props
  extends Omit<ComponentPropsWithoutRef<"div">, keyof {Component}TvProps>,
    {Component}TvProps {
  // Add custom props
}

export const {Component} = forwardRef<HTMLDivElement, {Component}Props>(
  function {Component}(props, ref) {
    const { className, variant, size, ...rest } = props
    const tv = {component}Tv({ variant, size })

    return (
      <div
        ref={ref}
        className={tcx(tv.root(), className)}
        {...rest}
      />
    )
  }
)
```

6. **Create index.ts** for exports:

```typescript
export * from "./{component-name}"
export * from "./tv"
```

7. **Register in main package** at `packages/core/app/index.ts`:

```typescript
export * from "./components/{component-name}"
```

8. **Update root package.json** dependencies if needed

## Styling Conventions

- Use `tcv()` from `@choice-ui/shared` for Tailwind Variants
- Use `tcx()` from `@choice-ui/shared` to merge classNames
- Follow existing color tokens: `bg-surface`, `text-content`, `border-default`, etc.
- Support `className` prop for customization

## Accessibility Requirements

- Add proper ARIA attributes (`aria-label`, `aria-describedby`, etc.)
- Support keyboard navigation where applicable
- Use semantic HTML elements
- Include `data-*` attributes for state indication

## Compound Component Pattern

For complex components, use the compound pattern:

```typescript
const {Component}Root = forwardRef(...)
const {Component}Item = forwardRef(...)

export const {Component} = Object.assign({Component}Root, {
  Item: {Component}Item,
})
```
