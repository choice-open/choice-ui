# Separator

A visual divider component used to separate content sections. Supports horizontal and vertical orientations, accessible to screen readers, and can display content in the middle.

## Import

```tsx
import { Separator } from "@choice-ui/react"
```

## Features

- **Orientation**: Horizontal (default) and vertical directions
- **Content Support**: Optional children to display text or elements between lines
- **Accessible**: Uses `role="separator"` with proper ARIA attributes
- **Decorative Mode**: Option to hide from screen readers for purely visual separators
- **Variants**: Multiple color variants (default, light, dark, reset)
- **Customizable**: Easily styled via className

## Usage

### Basic Usage

```tsx
<div className="w-80">
  <div className="py-4">Content above</div>
  <Separator />
  <div className="py-4">Content below</div>
</div>
```

### Vertical Separator

```tsx
<div className="flex h-8 items-center gap-4">
  <a href="#">Home</a>
  <a href="#">Pricing</a>
  <Separator orientation="vertical" />
  <a href="#">Log in</a>
  <a href="#">Sign up</a>
</div>
```

### With Content (Children)

Insert text or elements between the separator lines:

```tsx
// "OR" divider pattern
<Separator>or</Separator>

// Section title
<Separator>Section Title</Separator>

// Custom styled content
<Separator>
  <span className="text-accent-foreground">New</span>
</Separator>
```

### Decorative Mode

Use `decorative` prop when the separator is purely visual:

```tsx
<Separator decorative />
```

### Variants

```tsx
// Default (uses design system boundary color)
<Separator variant="default" />

// Light
<Separator variant="light" />

// Dark
<Separator variant="dark" />

// Reset (no styling, for custom colors)
<Separator variant="reset" className="bg-accent-background" />
```

## Props

```tsx
interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Separator orientation
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical"

  /**
   * Whether the separator is purely decorative (hidden from screen readers)
   * @default false
   */
  decorative?: boolean

  /**
   * Color variant
   * @default "default"
   */
  variant?: "default" | "light" | "dark" | "reset"

  /**
   * Content to display between the separator lines
   * When provided, renders two separator lines with content in between
   */
  children?: React.ReactNode
}
```

## Accessibility

- **Semantic**: Uses `role="separator"` for assistive technology
- **Orientation**: Includes `aria-orientation` attribute
- **Decorative**: Uses `role="none"` when `decorative={true}` to be ignored by screen readers

## Examples

### Navigation Menu

```tsx
<nav className="flex h-8 items-center gap-4">
  <a href="#">Home</a>
  <a href="#">Pricing</a>
  <a href="#">Blog</a>
  <Separator orientation="vertical" />
  <a href="#">Log in</a>
  <a href="#">Sign up</a>
</nav>
```

### Card Sections

```tsx
<div className="rounded-xl border">
  <div className="p-4">
    <h3>Card Title</h3>
  </div>
  <Separator />
  <div className="p-4">
    <p>Card content...</p>
  </div>
  <Separator />
  <div className="p-4">
    <button>Action</button>
  </div>
</div>
```

### Auth Form Divider

```tsx
<div className="flex flex-col gap-4">
  <button>Continue with Google</button>
  <Separator>or</Separator>
  <button>Continue with Email</button>
</div>
```

### Custom Styling

```tsx
// Custom color
<Separator className="bg-accent-background" />

// Thicker line
<Separator className="h-0.5" />

// With margin
<Separator className="my-4" />

// Dashed style
<Separator className="h-px bg-[repeating-linear-gradient(90deg,var(--color-default-boundary)_0,var(--color-default-boundary)_4px,transparent_4px,transparent_8px)]" />
```

## Notes

- When `children` is provided, the component renders a flex container with two separator lines and the content in between
- Horizontal separators have `height: 1px` and `width: 100%`
- Vertical separators have `width: 1px` and `height: 100%`
- Uses Tailwind Variants for styling
