# @choice-ui/token-editor

Visual editor for Choice UI design tokens. Loads the W3C JSON sources from
`@choice-ui/design-tokens`, lets you edit them through a visual UI built on
`@choice-ui/react`, and re-runs the Terrazzo pipeline in the browser to
preview and export `tokens.css` / `tokens.scss` / `tokens.js`.

## Develop

```bash
pnpm --filter @choice-ui/design-tokens build   # generate output/*-w3c.json
pnpm --filter @choice-ui/token-editor dev      # http://localhost:5180
```

## Status

Scaffold only. Panels (colors, typography, spacing, shadows, radius,
breakpoints, z-index) are being added incrementally; colors lands first.
