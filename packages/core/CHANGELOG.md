# @choice-ui/react

## 2.0.12

### Patch Changes

- Restore `openSubmenuOnArrowNavigation` forwarding in the published bundle.
- Make `onClick` the canonical Dropdown action path so pointer and keyboard activation behave
  consistently.
- Allow Menubar to forward the submenu arrow-navigation option.

## 2.0.11

### Patch Changes

- Fix nested Dropdown keyboard interaction, including arrow-navigation pre-opening,
  direction-aware submenu entry and closing, focus restoration, and nested-menu accessibility.

## 1.4.3

### Patch Changes

- Add transitionStylesProps support to Popover component for custom transition animations

## 1.4.2

### Patch Changes

- Fix type declarations: include shared utility types and convert internal imports to relative paths

## 1.4.1

### Patch Changes

- Fix shared utility types (tcx, tcv, etc.) not exported in type declarations

## 1.4.0

### Minor Changes

- Modernize package bundling
  - ESM-only output (remove CJS support)
  - Auto-externalize all dependencies
  - Fix TypeScript declaration file generation
  - Reduce bundle size from 14M to 7.4M
