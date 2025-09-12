# Segmented

An accessible radio group component styled as a segmented control, providing a clean interface for selecting between multiple mutually exclusive options with keyboard navigation support.

## Import

```tsx
import { Segmented } from "@choiceform/design-system"
```

## Features

- **Accessible Radio Group**: Implements ARIA radio group pattern with full keyboard navigation
- **Flexible Content**: Supports text, icons, or mixed content in segments
- **Equal Width Distribution**: Automatically distributes segments evenly across container
- **Keyboard Navigation**: Arrow key navigation between options
- **Disabled Options**: Individual segment disable support with proper accessibility
- **Tooltip Support**: Built-in tooltip configuration for enhanced UX
- **Custom Styling**: Flexible styling options for individual segments
- **Theme Variants**: Multiple variants (default, light, dark, reset) for different contexts
- **Screen Reader Support**: Comprehensive ARIA labeling and descriptions

## Usage

### Basic Segmented Control

```tsx
function Example() {
  const [value, setValue] = useState("sun")

  return (
    <Segmented
      value={value}
      onChange={setValue}
    >
      <Segmented.Item
        value="sun"
        aria-label="Sun"
      >
        <SunIcon />
      </Segmented.Item>
      <Segmented.Item
        value="moon"
        aria-label="Moon"
      >
        <MoonIcon />
      </Segmented.Item>
      <Segmented.Item
        value="system"
        aria-label="System"
      >
        <SystemIcon />
      </Segmented.Item>
    </Segmented>
  )
}
```

### With Text Labels

```tsx
function TextExample() {
  const [value, setValue] = useState("left")

  return (
    <Segmented
      value={value}
      onChange={setValue}
    >
      <Segmented.Item
        value="left"
        className="px-2"
      >
        Left
      </Segmented.Item>
      <Segmented.Item
        value="center"
        className="px-2"
      >
        Center
      </Segmented.Item>
      <Segmented.Item
        value="right"
        className="px-2"
      >
        Right
      </Segmented.Item>
    </Segmented>
  )
}
```

### Disabled Options

```tsx
function DisabledExample() {
  const [value, setValue] = useState("right")

  return (
    <Segmented
      value={value}
      onChange={setValue}
    >
      <Segmented.Item
        value="left"
        disabled
        className="px-2"
      >
        Left
      </Segmented.Item>
      <Segmented.Item
        value="center"
        disabled
        className="px-2"
      >
        Center
      </Segmented.Item>
      <Segmented.Item
        value="right"
        className="px-2"
      >
        Right
      </Segmented.Item>
    </Segmented>
  )
}
```

### Mixed Content (Icons + Text)

```tsx
function MixedContentExample() {
  const [value, setValue] = useState("desktop")

  return (
    <Segmented
      value={value}
      onChange={setValue}
    >
      <Segmented.Item
        value="desktop"
        aria-label="Desktop"
        className="gap-1 px-2"
      >
        <>
          <DesktopIcon />
          Desktop
        </>
      </Segmented.Item>
      <Segmented.Item
        value="tablet"
        aria-label="Tablet"
        className="gap-1 px-2"
      >
        <>
          <TabletIcon />
          Tablet
        </>
      </Segmented.Item>
      <Segmented.Item
        value="mobile"
        aria-label="Mobile"
        className="gap-1 px-2"
      >
        <>
          <MobileIcon />
          Mobile
        </>
      </Segmented.Item>
    </Segmented>
  )
}
```

### With Tooltips

```tsx
function TooltipExample() {
  const [value, setValue] = useState("sun")

  return (
    <Segmented
      value={value}
      onChange={setValue}
    >
      <Segmented.Item
        value="sun"
        tooltip={{ content: "Light mode" }}
      >
        <SunIcon />
      </Segmented.Item>
      <Segmented.Item
        value="moon"
        tooltip={{ content: "Dark mode" }}
      >
        <MoonIcon />
      </Segmented.Item>
      <Segmented.Item
        value="system"
        tooltip={{ content: "System preference" }}
      >
        <SystemIcon />
      </Segmented.Item>
    </Segmented>
  )
}
```

### Variants

```tsx
function VariantExamples() {
  const [value, setValue] = useState("sun")

  return (
    <>
      {/* Default - follows page theme */}
      <Segmented
        value={value}
        onChange={setValue}
        variant="default"
      >
        <Segmented.Item value="sun" className="px-2">Sun</Segmented.Item>
        <Segmented.Item value="moon" className="px-2">Moon</Segmented.Item>
        <Segmented.Item value="system" className="px-2">System</Segmented.Item>
      </Segmented>

      {/* Light - fixed light appearance */}
      <Segmented
        value={value}
        onChange={setValue}
        variant="light"
      >
        <Segmented.Item value="sun" className="px-2">Sun</Segmented.Item>
        <Segmented.Item value="moon" className="px-2">Moon</Segmented.Item>
        <Segmented.Item value="system" className="px-2">System</Segmented.Item>
      </Segmented>

      {/* Dark - fixed dark appearance */}
      <Segmented
        value={value}
        onChange={setValue}
        variant="dark"
      >
        <Segmented.Item value="sun" className="px-2">Sun</Segmented.Item>
        <Segmented.Item value="moon" className="px-2">Moon</Segmented.Item>
        <Segmented.Item value="system" className="px-2">System</Segmented.Item>
      </Segmented>

      {/* Reset - no variant styling */}
      <Segmented
        value={value}
        onChange={setValue}
        variant="reset"
      >
        <Segmented.Item value="sun" className="px-2">Sun</Segmented.Item>
        <Segmented.Item value="moon" className="px-2">Moon</Segmented.Item>
        <Segmented.Item value="system" className="px-2">System</Segmented.Item>
      </Segmented>
    </>
  )
}
```

## Props

### Segmented Props

```ts
interface SegmentedProps extends Omit<HTMLProps<HTMLDivElement>, "onChange"> {
  /** Child Segmented.Item components */
  children?: ReactNode

  /** Additional CSS class names */
  className?: string

  /** Whether the entire segmented control is disabled */
  disabled?: boolean

  /** Callback fired when selection changes */
  onChange?: (value: string) => void

  /** Global tooltip configuration applied to all segments */
  tooltip?: TooltipProps

  /** Currently selected value */
  value?: string

  /** Visual theme variant */
  variant?: "default" | "light" | "dark" | "reset"
}
```

### Segmented.Item Props

```ts
interface SegmentedItemProps {
  /** Content to display in the segment */
  children?: ReactNode

  /** Additional CSS class names */
  className?: string

  /** Whether this segment is disabled */
  disabled?: boolean

  /** Tooltip configuration for this specific segment */
  tooltip?: TooltipProps

  /** The value this segment represents */
  value: string

  /** Accessible label for the segment */
  "aria-label"?: string
}
```

- Defaults:
  - `variant`: "default" (follows page theme)
  - `disabled`: false

- Variant options:
  - `default`: Follows the page theme dynamically (light/dark mode)
  - `light`: Fixed light appearance regardless of theme
  - `dark`: Fixed dark appearance regardless of theme
  - `reset`: Removes variant styling, no variant settings applied

## Styling

- Uses Tailwind CSS via `tailwind-variants` in `tv.ts`
- Automatically applies CSS Grid with equal-width columns
- Customize individual segments using the `className` prop
- Available styling patterns:
  - `px-{size}`: Horizontal padding for text content
  - `gap-{size}`: Spacing between icon and text
  - `flex items-center`: Alignment for mixed content

## Styling Guidelines

### Content Spacing

```tsx
{
  /* Text content */
}
;<Segmented.Item
  value="option"
  className="px-2"
>
  Text Option
</Segmented.Item>

{
  /* Icon + text */
}
;<Segmented.Item
  value="option"
  className="gap-1 px-2"
>
  <>
    <Icon />
    Text
  </>
</Segmented.Item>

{
  /* Icon only */
}
;<Segmented.Item
  value="option"
  aria-label="Description"
>
  <Icon />
</Segmented.Item>
```

### Custom Styling

```tsx
{
  /* Custom colors and effects */
}
;<Segmented.Item
  value="option"
  className="px-3 py-1 text-blue-600 hover:bg-blue-50"
>
  Custom Option
</Segmented.Item>
```

## Accessibility

The component implements the ARIA radio group pattern with comprehensive accessibility support:

- **Radio Group Role**: Root element uses `role="radiogroup"`
- **Arrow Key Navigation**: Left/Right arrows navigate between options
- **Selection State**: `aria-checked` indicates current selection
- **Disabled State**: `aria-disabled` for unavailable options
- **Screen Reader Guidance**: Hidden instructions for keyboard navigation
- **Accessible Labels**: Priority system for segment labeling:
  1. Explicit `aria-label` if provided
  2. `tooltip.content` if available
  3. String content if segment children is a string

### Label Priority System

```tsx
{
  /* Priority 1: Explicit aria-label */
}
;<Segmented.Item
  value="option"
  aria-label="Custom Label"
>
  <Icon />
</Segmented.Item>

{
  /* Priority 2: Tooltip content */
}
;<Segmented.Item
  value="option"
  tooltip={{ content: "Tooltip Label" }}
>
  <Icon />
</Segmented.Item>

{
  /* Priority 3: String content */
}
;<Segmented.Item value="option">String Label</Segmented.Item>
```

## Keyboard Navigation

- **Arrow Keys**: Navigate between enabled segments
- **Home/End**: Jump to first/last segment
- **Tab**: Enter/exit the segmented control
- **Space/Enter**: Select focused segment
- **Disabled segments**: Skipped during navigation

## Best Practices

### Content Guidelines

- Keep segment labels concise and descriptive
- Use consistent content types across all segments
- Provide `aria-label` for icon-only segments
- Use logical groupings that are mutually exclusive

### Visual Design

- Maintain consistent padding across segments
- Use appropriate icon sizes (typically 16px or 20px)
- Ensure adequate color contrast in all states
- Test with keyboard navigation and screen readers

### Usage Patterns

- Use for 2-5 related options (avoid overcrowding)
- Reserve for mutually exclusive choices
- Consider radio buttons for more than 5 options
- Use consistent segment sizing for visual balance

## Examples

### Theme Selector

```tsx
function ThemeSelector() {
  const [theme, setTheme] = useState("system")

  return (
    <Segmented
      value={theme}
      onChange={setTheme}
    >
      <Segmented.Item
        value="light"
        tooltip={{ content: "Light theme" }}
        className="px-2"
      >
        <>
          <SunIcon />
          Light
        </>
      </Segmented.Item>
      <Segmented.Item
        value="dark"
        tooltip={{ content: "Dark theme" }}
        className="px-2"
      >
        <>
          <MoonIcon />
          Dark
        </>
      </Segmented.Item>
      <Segmented.Item
        value="system"
        tooltip={{ content: "Follow system setting" }}
        className="px-2"
      >
        <>
          <SystemIcon />
          System
        </>
      </Segmented.Item>
    </Segmented>
  )
}
```

### Text Alignment Control

```tsx
function TextAlignmentControl() {
  const [alignment, setAlignment] = useState("left")

  return (
    <Segmented
      value={alignment}
      onChange={setAlignment}
    >
      <Segmented.Item
        value="left"
        aria-label="Align left"
      >
        <AlignLeftIcon />
      </Segmented.Item>
      <Segmented.Item
        value="center"
        aria-label="Align center"
      >
        <AlignCenterIcon />
      </Segmented.Item>
      <Segmented.Item
        value="right"
        aria-label="Align right"
      >
        <AlignRightIcon />
      </Segmented.Item>
      <Segmented.Item
        value="justify"
        aria-label="Justify"
      >
        <AlignJustifyIcon />
      </Segmented.Item>
    </Segmented>
  )
}
```

### Settings Panel

```tsx
function SettingsPanel() {
  const [view, setView] = useState("grid")

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3>View Mode</h3>
        <Segmented
          value={view}
          onChange={setView}
        >
          <Segmented.Item
            value="list"
            aria-label="List view"
            className="px-1"
          >
            <ListIcon />
          </Segmented.Item>
          <Segmented.Item
            value="grid"
            aria-label="Grid view"
            className="px-1"
          >
            <GridIcon />
          </Segmented.Item>
          <Segmented.Item
            value="card"
            aria-label="Card view"
            className="px-1"
          >
            <CardIcon />
          </Segmented.Item>
        </Segmented>
      </div>
    </div>
  )
}
```

## Notes

- Segments are automatically sized using CSS Grid with equal columns
- The component manages focus and selection state internally
- Disabled segments are excluded from keyboard navigation
- Tooltip integration works seamlessly with the accessibility system
- The component supports both controlled and uncontrolled usage patterns
