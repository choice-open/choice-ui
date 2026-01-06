# @choice-ui/grid-areas

A Tailwind CSS v4 plugin for CSS Grid named areas.

## Installation

```bash
npm install @choice-ui/grid-areas
# or
pnpm add @choice-ui/grid-areas
```

## Usage

In your `tailwind.css`:

```css
@import "tailwindcss";
@plugin "@choice-ui/grid-areas";
```

Then use in HTML:

```html
<!-- Define grid template areas (use _ for spaces, , for row separators) -->
<div class="grid-areas-[header_header,sidebar_main,footer_footer] grid-rows-[auto_1fr_auto] grid-cols-[200px_1fr]">
  <!-- Place elements in named areas -->
  <header class="grid-area-[header]">Header</header>
  <aside class="grid-area-[sidebar]">Sidebar</aside>
  <main class="grid-area-[main]">Main</main>
  <footer class="grid-area-[footer]">Footer</footer>
</div>
```

## Utilities

| Class | CSS Property | Description |
|-------|-------------|-------------|
| `grid-areas-[...]` | `grid-template-areas` | Define grid template areas |
| `grid-area-[...]` | `grid-area` | Place element in a named area |
| `row-start-[...]` | `grid-row-start` | Row start position |
| `row-end-[...]` | `grid-row-end` | Row end position |
| `col-start-[...]` | `grid-column-start` | Column start position |
| `col-end-[...]` | `grid-column-end` | Column end position |

## Syntax

- Use `_` (underscore) for spaces between area names
- Use `,` (comma) to separate rows
- Use `.` for empty cells

### Examples

```html
<!-- 3-column layout -->
<div class="grid-areas-[header_header_header,sidebar_main_main,footer_footer_footer]">

<!-- With empty cells -->
<div class="grid-areas-[a_._b,._c_.,d_._e]">

<!-- Responsive -->
<div class="grid-areas-[header,main,footer] md:grid-areas-[header_header,sidebar_main,footer_footer]">
```

## CSS Keywords

Built-in support for CSS keywords:

- `grid-areas-none`
- `grid-areas-inherit`
- `grid-areas-initial`
- `grid-areas-revert`
- `grid-areas-unset`
- `grid-area-auto`

## License

MIT
