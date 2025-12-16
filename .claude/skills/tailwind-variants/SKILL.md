---
name: tailwind-variants
description: Create and modify Tailwind Variants (tcv) styles for Choice UI components. Use when defining component variants, working with slots, or creating responsive/compound variants.
---

# Tailwind Variants in Choice UI

## Overview

Choice UI uses `tcv` (Tailwind Class Variants) from `@choice-ui/shared` - a wrapper around `tailwind-variants` with `tailwind-merge` integration.

- `tcv` - Creates variant definitions (tailwind-variants)
- `tcx` - Merges classNames (classnames + tailwind-merge)

## Basic Usage with Slots

```typescript
import { tcv } from "@choice-ui/shared"

export const buttonTv = tcv({
  slots: {
    button: [
      "flex items-center justify-center gap-1",
      "text-body-medium",
      "min-w-0 rounded-md px-2",
      "border border-solid border-transparent",
      "cursor-default select-none",
    ],
    spinner: ["pointer-events-none h-full", "absolute inset-0", "grid place-content-center"],
    content: "invisible",
  },
  variants: {
    size: {
      default: { button: "h-6" },
      large: { button: "h-8" },
    },
    variant: {
      primary: {
        button: "bg-accent-background text-on-accent-foreground",
      },
      secondary: {
        button: "text-default-foreground bg-default-background border-default-boundary",
      },
      solid: {
        button: "bg-secondary-background text-default-foreground",
      },
      destructive: {
        button: "bg-danger-background text-on-accent-foreground",
      },
      ghost: {
        button: "text-default-foreground hover:bg-secondary-background bg-transparent",
      },
      link: {
        button: "text-accent-foreground hover:bg-accent-background/10 bg-transparent",
      },
    },
    disabled: {
      true: "",
      false: "",
    },
    loading: {
      true: { button: "relative" },
      false: "",
    },
  },
  defaultVariants: {
    size: "default",
    variant: "primary",
    disabled: false,
    loading: false,
  },
})
```

## Compound Variants

Apply styles when multiple variant conditions are met:

```typescript
export const buttonTv = tcv({
  slots: { button: "..." },
  variants: {
    variant: {
      primary: { button: "bg-accent-background" },
      secondary: { button: "bg-default-background border-default-boundary" },
    },
    disabled: { true: "", false: "" },
    active: { true: "", false: "" },
  },
  compoundVariants: [
    // Focus styles for filled variants
    {
      variant: ["primary", "destructive", "success"],
      class: {
        button: "focus-visible:shadow-focus",
      },
    },
    // Focus styles for outlined variants
    {
      variant: ["secondary", "ghost", "link"],
      class: {
        button: "focus-visible:border-selected-boundary",
      },
    },
    // Disabled states
    {
      variant: ["primary", "solid", "destructive"],
      disabled: true,
      class: {
        button: "bg-disabled-background text-disabled-foreground pointer-events-none",
      },
    },
    {
      variant: ["secondary", "ghost"],
      disabled: true,
      class: {
        button: "border-default-boundary text-disabled-foreground pointer-events-none",
      },
    },
    // Active states
    {
      active: true,
      variant: "primary",
      class: { button: "bg-accent-hover-background" },
    },
    {
      active: true,
      variant: "secondary",
      class: { button: "bg-secondary-background" },
    },
  ],
})
```

## Using in Components

```typescript
import { forwardRef, type ComponentPropsWithoutRef } from "react"
import { tcx } from "@choice-ui/shared"
import { buttonTv } from "./tv"

export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: "primary" | "secondary" | "solid" | "destructive" | "ghost" | "link"
  size?: "default" | "large"
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, ref) {
    const {
      className,
      variant = "primary",
      size = "default",
      disabled,
      loading,
      children,
      ...rest
    } = props

    const tv = buttonTv({ variant, size, disabled, loading })

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={tcx(tv.button(), className)}
        {...rest}
      >
        {loading && (
          <span className={tv.spinner()}>
            <Spinner />
          </span>
        )}
        <span className={loading ? tv.content() : undefined}>
          {children}
        </span>
      </button>
    )
  }
)
```

## Design Token Classes

Use these semantic Tailwind classes from Choice UI design tokens:

### Text/Foreground Colors

```
text-default-foreground      /* Primary text */
text-secondary-foreground    /* Secondary text */
text-tertiary-foreground     /* Tertiary text */
text-disabled-foreground     /* Disabled text */
text-accent-foreground       /* Accent text */
text-success-foreground      /* Success text */
text-warning-foreground      /* Warning text */
text-danger-foreground       /* Danger text */
text-on-accent-foreground    /* Text on accent bg */
text-inverse-foreground      /* Inverse theme */
```

### Background Colors

```
bg-default-background        /* Default surface */
bg-secondary-background      /* Secondary surface */
bg-tertiary-background       /* Tertiary surface */
bg-hover-background          /* Hover state */
bg-selected-background       /* Selected state */
bg-disabled-background       /* Disabled state */
bg-accent-background         /* Accent surface */
bg-accent-hover-background   /* Accent hover */
bg-danger-background         /* Danger surface */
bg-danger-hover-background   /* Danger hover */
bg-success-background        /* Success surface */
bg-success-hover-background  /* Success hover */
bg-inverse-background        /* Inverse theme */
bg-menu-background           /* Menu/dropdown */
```

### Border Colors

```
border-default-boundary      /* Default border */
border-strong-boundary       /* Strong border */
border-selected-boundary     /* Selected state */
border-menu-boundary         /* Menu border */
```

### Typography (Presets)

```
text-body-large              /* 14px body */
text-body-large-strong       /* 14px bold */
text-body-medium             /* 13px body */
text-body-medium-strong      /* 13px bold */
text-body-small              /* 12px body */
text-body-small-strong       /* 12px bold */
text-heading-display         /* Display heading */
text-heading-large           /* Large heading */
text-heading-medium          /* Medium heading */
text-heading-small           /* Small heading */
```

### Shadows

```
shadow-xxs / shadow-xs / shadow-sm / shadow-md / shadow-lg / shadow-xl
shadow-focus                 /* Focus ring */
shadow-border-default        /* Border-like shadow */
```

### Radii

```
rounded-sm / rounded-md / rounded-lg / rounded-xl
```

## Using tcx for Class Merging

```typescript
import { tcx } from "@choice-ui/shared"

// tcx = classnames + tailwind-merge
const className = tcx(
  "base-class",
  isActive && "bg-selected-background",
  disabled ? "text-disabled-foreground" : "text-default-foreground",
  userClassName // Props className - always wins in merge
)
```

## Type Extraction

```typescript
import type { VariantProps } from "@choice-ui/shared"

export const buttonTv = tcv({...})

// Extract variant props type
export type ButtonTvProps = VariantProps<typeof buttonTv>

// Use in component props
export interface ButtonProps
  extends Omit<ComponentPropsWithoutRef<"button">, keyof ButtonTvProps>,
    ButtonTvProps {
  // Additional props
}
```

## Best Practices

1. **Use slots** for multi-element components
2. **Use semantic tokens** (`bg-accent-background`) over primitives (`bg-blue-500`)
3. **Define all states** as variants (disabled, loading, active, focused)
4. **Use compound variants** for complex state combinations
5. **Keep styles in tv.tsx** separate from component logic
6. **Use tcx** to merge user className with internal classes

## Common Patterns

### Interactive States

```typescript
variants: {
  disabled: { true: "", false: "" },
  active: { true: "", false: "" },
  focused: { true: "", false: "" },
},
compoundVariants: [
  {
    disabled: false,
    class: { button: "active:bg-secondary-background" },
  },
]
```

### Data Attributes

```tsx
// In component
<button
  data-state={isOpen ? "open" : "closed"}
  data-disabled={disabled || undefined}
  className={tv.button()}
/>

// In tv.tsx - use data attributes
slots: {
  button: "data-[state=open]:bg-selected-background data-[disabled]:opacity-50"
}
```
