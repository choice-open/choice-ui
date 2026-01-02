# Changelog

All notable changes to the Picture Preview component will be documented in this file.

## [2026-01-03]

### Added

- feat(picture-preview): add `control` prop for configurable control bar position and visibility
- feat(picture-preview): support trackpad two-finger pinch-to-zoom gesture
- feat(picture-preview): zoom centered at mouse/cursor position instead of center
- feat(picture-preview): display actual zoom percentage based on original image dimensions
- feat(picture-preview): double-click to fit image to screen
- feat(picture-preview): smooth blur and scale loading transition animation

### Changed

- refactor(picture-preview): use exponential zoom formula for more natural zoom feel
- refactor(picture-preview): calculate zoom limits (2%-1000%) based on actual image size
- refactor(picture-preview): improve image cleanup on unmount to prevent memory leaks

### Dependencies

- Added `framer-motion` as peer dependency

## [2025-11-24]

### Changed

- chore(core): bump version to 1.2.96 and add root prop to multiple components

## [2025-08-25]

### Changed

- Increase stdout maxBuffer to prevent state retrieval failures

## [2025-08-22]

### Changed

- Update component and hook READMEs; improve format-date utils

## [2025-08-13]

### Changed

- Add README docs for components and hooks; refactor hook structure

## [2025-07-10]

### Changed

- Remove Storybook addon-storysource and update component stories

## [2025-07-09]

### Changed

- Update TooltipProvider delay settings and refactor route imports

## [2025-05-12]

### Changed

- Update color package configuration and enhance translation support

## [2025-05-09]

### Changed

- Enhance component structure and update dependencies for improved usability

## [2025-05-08]

### Changed

- Refactor PicturePreview component to enhance zoom functionality and add keyboard shortcuts
- Add new configuration files and components for improved project structure
