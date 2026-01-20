# Changelog

All notable changes to the Range component will be documented in this file.

## [2026-01-20]

### Added

- **Compound Component Pattern**: Introduced a flexible compound component architecture
  - `Range.Container` - Logical wrapper for track area and dots
  - `Range.Connects` - Customizable connection bar with `data-connect-status` attribute
  - `Range.Thumb` - Draggable handle with `data-status` for default value styling
  - `Range.Dot` - Step markers with `data-status` for state-based styling
  - Same pattern available for `RangeTuple` with corresponding subcomponents

### Changed

- **Breaking**: Removed unused `connectsClassName` prop from both `Range` and `RangeTuple`
- Refactored `RangeContainer` and `RangeTupleContainer` from `forwardRef` to regular functions (they render Fragments, so ref forwarding was not applicable)
- Improved decimal step support: Changed `safeStep` calculation from `Math.max(step, 1)` to `step > 0 ? step : 1` to allow steps like `0.0001`
- Fixed snap-to-default behavior: Updated condition from `safeStep === 1` to `safeStep <= 1` to work with decimal steps

### Fixed

- Fixed React Hooks violation in `RangeDot` and `RangeTupleDot` where `useMemo` was incorrectly called inside `map` loops
- Extracted `getDotStatus` helper function outside component to avoid recreation on each render

### Performance

- Moved `transforms` destructuring outside `map` loops in dot rendering to reduce redundant operations
- Removed unnecessary intermediate variables (`hasChildConnects`)

## [2025-11-27]

### Changed

- feat(router-test): add initial setup for router test application

## [2025-11-26]

### Changed

- chore(core): update component readonly prop to readOnly

## [2025-11-21]

### Changed

- chore(core): bump version to 1.2.92 and add readonly state to RangeTuple component
- chore(core): bump version to 1.2.91 and add readonly state to multiple components

## [2025-10-20]

### Changed

- chore(core): bump version to 1.2.62 and enhance RangeTuple component

## [2025-10-16]

### Changed

- feat(range): introduce RangeTuple component for dual-thumb range selection

## [2025-08-25]

### Changed

- Increase stdout maxBuffer to prevent state retrieval failures

## [2025-08-22]

### Changed

- Update component and hook READMEs; improve format-date utils

## [2025-08-13]

### Changed

- Add README docs for components and hooks; refactor hook structure

## [2025-07-21]

### Changed

- Add auto width support and documentation to Range component

## [2025-07-18]

### Changed

- Add form adapters and textarea component with resize functionality

## [2025-07-10]

### Changed

- Remove Storybook addon-storysource and update component stories

## [2025-05-21]

### Changed

- Update package version to 0.6.1 and improve Range component default value handling
- Update package version to 0.6.0, enhance Range component with negative value support, and improve styling

## [2025-05-09]

### Changed

- Enhance component structure and update dependencies for improved usability

## [2025-05-08]

### Changed

- Add CheckboxLabel component and refactor Checkbox and Radio components for improved structure
- Add new configuration files and components for improved project structure
