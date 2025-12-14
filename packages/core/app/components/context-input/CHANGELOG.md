# Changelog

All notable changes to the Context Input component will be documented in this file.

## [2025-12-13]

### Changed

- refactor(context-input): update mention types for improved clarity and consistency
  - Refactored mention-related types to use ContextMentionItemProps and ContextMentionTrigger for better type safety and clarity
  - Updated component implementations to reflect the new types, enhancing overall code consistency
  - Improved documentation and comments throughout the context-input components for better understanding and usability
  - Adjusted Storybook examples to demonstrate the updated mention handling and component structure

- feat(context-input): enhance mention handling and component structure
  - Updated ComboboxProps to use a more specific type for focusManagerProps, improving type safety
  - Removed lodash-es dependency from context-input package.json to streamline dependencies
  - Refactored mention-related types and components to use MentionItemProps for better clarity and consistency
  - Enhanced documentation and comments throughout the context-input components for improved understanding and usability
  - Updated Storybook examples to reflect changes in mention handling and component structure

## [2025-12-12]

### Changed

- feat: enhance mentions support in context input editor
  - Updated the withMentions function to support mentions in pasted text
  - Improved handling of pasted content by parsing mention tokens into Slate nodes
  - Refactored editor methods to use a custom editor type for better type safety
  - Adjusted documentation and examples to reflect the new mention functionality

## [2025-11-11]

### Changed

- Bump version to 1.2.70 and rename ContextInput props for clarity

## [2025-11-10]

### Changed

- Bump version to 1.2.69 and enhance ContextInput with before/after children props

## [2025-11-09]

### Changed

- Bump version to 1.2.68 and update ContextInput exports

## [2025-11-08]

### Changed

- Bump version to 1.2.67 and update ContextInput exports

## [2025-11-07]

### Changed

- Bump version to 1.2.66 and streamline ContextInput exports

## [2025-11-06]

### Changed

- Bump version to 1.2.65 and enhance ContextInput component with custom mention support

## [2025-09-03]

### Added

- Add suffixElement props to range inputs and skeleton animations
- Add mentionPrefix prop to inputs and skeleton animations
- Support custom mentionPrefix and flexible item prefixes

## [2025-08-25]

### Fixed

- Fix README formatting and standardize className ordering
- Increase stdout maxBuffer to prevent state retrieval failures

## [2025-08-22]

### Changed

- Update component and hook READMEs; improve format-date utils

## [2025-08-13]

### Added

- Add README docs for components and hooks; refactor hook structure

## [2025-07-13]

### Changed

- Refactor Storybook global styles and update component stories

## [2025-07-10]

### Changed

- Remove Storybook addon-storysource and update component stories

## [2025-07-09]

### Changed

- Refactor context-input and combobox components, update Storybook config

## [2025-05-09]

### Changed

- Enhance component structure and update dependencies for improved usability
- Update @choice-ui/react version to 0.9.997, add clear function test and optimize ContextInput component

## [2025-05-08]

### Added

- Add new configuration files and components for improved project structure
- Add `ContextInput` and `CoordinateMenu` components with related utilities and hooks
