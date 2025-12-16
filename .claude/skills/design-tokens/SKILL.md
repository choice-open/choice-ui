---
name: design-tokens
description: Work with Choice UI design tokens - create, modify, or understand color, spacing, typography tokens. Use when modifying design tokens, adding new theme variables, or understanding the design system foundations.
---

# Choice UI Design Tokens

## Token Location

Design tokens are in `packages/design-tokens/`:

```
packages/design-tokens/
├── tokens/           # Raw token definitions
├── config/           # Token configuration
├── scripts/          # Build scripts
├── dist/             # Generated outputs
│   ├── tailwind.css  # Tailwind CSS theme
│   ├── tokens.css    # CSS custom properties
│   ├── functions.scss # SCSS functions
│   ├── tokens.ts     # TypeScript exports
│   └── tokens.json   # JSON format
└── src/
```

## Token Categories

### Colors - Primitive

Primitive colors with scales (100-950):

```css
/* Color scales */
--color-blue-{100-950}
--color-violet-{100-950}
--color-purple-{100-950}
--color-pink-{100-950}
--color-teal-{100-950}
--color-red-{100-950}
--color-orange-{100-950}
--color-yellow-{100-950}
--color-green-{100-950}

/* Pale variants */
--color-blue-pale-{100-950}
--color-violet-pale-{100-950}
/* ...etc */

/* Grayscale */
--color-gray-{50-950}
--color-white
--color-black
```

### Colors - Semantic (Foreground/Text)

```css
--color-default-foreground      /* Primary text (0.9 alpha) */
--color-secondary-foreground    /* Secondary text (0.5 alpha) */
--color-tertiary-foreground     /* Tertiary text (0.3 alpha) */
--color-disabled-foreground     /* Disabled text (0.3 alpha) */
--color-accent-foreground       /* Accent colored text */
--color-success-foreground      /* Success text */
--color-warning-foreground      /* Warning text */
--color-danger-foreground       /* Danger/error text */
--color-assistive-foreground    /* Assistive text */
--color-component-foreground    /* Component text */
--color-inverse-foreground      /* Inverse theme text */
--color-on-accent-foreground    /* Text on accent background */
--color-on-accent-secondary-foreground
--color-on-accent-tertiary-foreground
```

### Colors - Semantic (Background)

```css
--color-default-background      /* Default surface */
--color-secondary-background    /* Secondary surface */
--color-tertiary-background     /* Tertiary surface */
--color-hover-background        /* Hover state */
--color-selected-background     /* Selected state */
--color-disabled-background     /* Disabled state */
--color-inverse-background      /* Inverse theme */
--color-menu-background         /* Menu/dropdown */
--color-toolbar-background      /* Toolbar */

/* Semantic backgrounds */
--color-accent-background
--color-accent-hover-background
--color-accent-secondary-background
--color-success-background
--color-success-hover-background
--color-success-secondary-background
--color-warning-background
--color-warning-hover-background
--color-warning-secondary-background
--color-danger-background
--color-danger-hover-background
--color-danger-secondary-background
--color-assistive-background
--color-assistive-hover-background
--color-assistive-secondary-background
--color-component-background
--color-component-hover-background
--color-component-secondary-background
```

### Colors - Semantic (Border)

```css
--color-default-boundary        /* Default border */
--color-strong-boundary         /* Strong/emphasized border */
--color-selected-boundary       /* Selected state border */
--color-selected-strong-boundary
--color-menu-boundary           /* Menu border */
--color-toolbar-boundary        /* Toolbar border */
```

### Colors - Semantic (Icon)

```css
--color-default-icon
--color-secondary-icon
--color-tertiary-icon
--color-disabled-icon
```

### Typography

```css
/* Font Families */
--font-default                  /* System default */
--font-display                  /* Display/heading */
--font-mono                     /* Monospace */

/* Font Sizes */
--text-xs / --text-sm / --text-md / --text-lg / --text-xl / --text-2xl

/* Font Weights */
--font-weight-light / --font-weight-default / --font-weight-medium
--font-weight-semibold / --font-weight-strong / --font-weight-heavy

/* Line Heights */
--leading-tight / --leading-snug / --leading-normal
--leading-relaxed / --leading-loose / --leading-extra-loose

/* Letter Spacing */
--tracking-body-large / --tracking-body-medium / --tracking-body-small
--tracking-heading-large / --tracking-heading-medium / --tracking-heading-small
--tracking-display

/* Typography Presets */
--text-body-large / --text-body-large-strong
--text-body-medium / --text-body-medium-strong
--text-body-small / --text-body-small-strong
--text-heading-display / --text-heading-large
--text-heading-medium / --text-heading-small
```

### Spacing

```css
--spacing                       /* Base spacing unit (4px) */
/* Usage: calc(var(--spacing) * N) */
```

### Radii

```css
--radius-sm / --radius-md / --radius-lg / --radius-xl
```

### Shadows

```css
--shadow-xxs / --shadow-xs / --shadow-sm
--shadow-md / --shadow-lg / --shadow-xl
--shadow-focus                  /* Focus ring */
--shadow-line                   /* Line separator */
--shadow-border-default         /* Border-like shadow */
--shadow-border-default-inset   /* Inset border shadow */
```

### Z-Index

```css
--z-index-sticky / --z-index-fixed / --z-index-backdrop
--z-index-modals / --z-index-popover / --z-index-menu
--z-index-alert / --z-index-tooltip / --z-index-notification
--z-index-scroll-bar
```

### Breakpoints

```css
--breakpoints-xs / --breakpoints-sm / --breakpoints-md
--breakpoints-lg / --breakpoints-xl / --breakpoints-2xl
```

## Using Tokens in Tailwind

Tokens are mapped to Tailwind utilities in `tailwind.css`:

```tsx
// Foreground (text color)
<p className="text-default-foreground">Primary text</p>
<p className="text-secondary-foreground">Secondary text</p>
<p className="text-accent-foreground">Accent text</p>

// Background
<div className="bg-default-background">Default surface</div>
<div className="bg-accent-background">Accent surface</div>
<div className="bg-hover-background">Hover state</div>

// Border
<div className="border border-default-boundary">Default border</div>
<div className="border border-strong-boundary">Strong border</div>

// Primitive colors
<div className="bg-blue-500 text-white">Blue</div>
<div className="bg-gray-100">Light gray</div>

// Typography
<h1 className="font-display text-2xl font-heavy">Heading</h1>
<p className="font-default text-sm leading-normal">Body text</p>

// Shadows
<div className="shadow-md">Medium shadow</div>
<div className="shadow-focus">Focus ring</div>

// Radius
<div className="rounded-md">Medium radius</div>
```

## Using SCSS Functions

```scss
@use "@choice-ui/design-tokens/dist/functions" as tokens;

.element {
  // Colors - use dot notation path
  color: tokens.color("text.default");
  background: tokens.color("background.accent");
  border-color: tokens.color("border.default");

  // With custom alpha
  background: tokens.color("blue.500", 0.5);

  // Spacing
  padding: tokens.spacing(4);      // calc(var(--cdt-spacing) * 4)
  margin: tokens.spacing("1/2");   // 50%

  // Typography
  font-family: tokens.font-family("display");
  font-size: tokens.font-size("lg");
  font-weight: tokens.font-weight("strong");
  line-height: tokens.line-height("relaxed");
  letter-spacing: tokens.letter-spacing("body-large");

  // Others
  border-radius: tokens.radius("md");
  box-shadow: tokens.shadow("md");
  z-index: tokens.z-index("modal");
}
```

## Instructions

1. **Explore existing tokens** in `packages/design-tokens/dist/tailwind.css`
2. **Use semantic tokens** (foreground, background, boundary) over primitives
3. **Build after changes**: `pnpm --filter design-tokens build`
4. **Test dark mode** - tokens support light/dark themes

## Best Practices

- Prefer semantic tokens (`text-default-foreground`) over primitives (`text-gray-900`)
- Use `*-foreground` for text, `*-background` for surfaces, `*-boundary` for borders
- Follow naming: `{semantic}-{variant}-{role}` (e.g., `accent-hover-background`)
- Keep alpha values in token definitions, not inline
