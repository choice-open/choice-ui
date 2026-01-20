# Range

A customizable slider component family that allows users to select numeric values within a specified range. Includes both single-value (`Range`) and dual-thumb range selection (`RangeTuple`) variants, with support for step intervals, default value indicators, compound component customization, and responsive sizing.

## Import

```tsx
import { Range, RangeTuple } from "@choice-ui/react"
```

## Features

- **Compound Component Pattern**: Flexible architecture with customizable subcomponents
  - `Range.Container` - Logical wrapper for track area and dots
  - `Range.Connects` - Connection bar with `data-connect-status` attribute
  - `Range.Thumb` - Draggable handle with `data-status` for default value styling
  - `Range.Dot` - Step markers with `data-status` for state-based styling
- Customizable minimum and maximum values
- Optional step intervals with visual tick marks (supports decimal steps like `0.0001`)
- Default value indicator with snap effect
- Configurable track and thumb sizes
- Support for negative value ranges
- Disabled and read-only state support
- Controlled and uncontrolled usage patterns
- Automatic and fixed width sizing options
- Smooth drag interaction with pointer capture
- Keyboard navigation support (arrow keys, Shift+arrow for 10x steps)
- Proper accessibility with ARIA attributes

## Usage

### Basic

```tsx
import { useState } from "react"

const [value, setValue] = useState(0)

<Range
  value={value}
  onChange={setValue}
/>
```

### With negative range

```tsx
const [value, setValue] = useState(0)

<Range
  value={value}
  onChange={setValue}
  min={-100}
  max={100}
  defaultValue={0}
/>
```

### With step marks

```tsx
const [value, setValue] = useState(0)

<Range
  value={value}
  onChange={setValue}
  min={0}
  max={100}
  step={10}
/>
```

### With default value indicator

```tsx
const [value, setValue] = useState(10)

<Range
  value={value}
  onChange={setValue}
  min={0}
  max={100}
  defaultValue={50}
/>
```

### Disabled

```tsx
const [value, setValue] = useState(50)

<Range
  value={value}
  onChange={setValue}
  min={0}
  max={100}
  disabled
/>
```

### Custom sizing

```tsx
const [value, setValue] = useState(50)

<Range
  value={value}
  onChange={setValue}
  min={0}
  max={100}
  trackSize={{
    width: 200,
    height: 10,
  }}
  thumbSize={10}
/>
```

### Auto width

```tsx
const [value, setValue] = useState(0)

<div className="w-40">
  <Range
    value={value}
    onChange={setValue}
    min={0}
    max={100}
    trackSize={{
      width: "auto",
      height: 6,
    }}
    thumbSize={10}
  />
</div>
```

## Compound Component Pattern

The Range component supports a flexible compound component architecture for advanced customization. When no children are provided, the component renders with default subcomponents (backward compatible).

### Available Subcomponents

| Component | Description |
|-----------|-------------|
| `Range.Container` | Logical wrapper containing connects, dots, and custom children |
| `Range.Connects` | The connection bar showing selected value range |
| `Range.Thumb` | The draggable handle |
| `Range.Dot` | Step markers and default value indicators |

### Custom Connects Styling

Use the compound pattern to apply custom styles to the connection bar:

```tsx
const [value, setValue] = useState(50)

<Range value={value} onChange={setValue} min={0} max={100} step={10}>
  <Range.Container>
    <Range.Connects className="bg-gradient-to-r from-blue-500 to-purple-500" />
  </Range.Container>
  <Range.Thumb />
</Range>
```

### Custom Dots

Override dot rendering with custom styles:

```tsx
const [value, setValue] = useState(50)

<Range value={value} onChange={setValue} min={0} max={100} step={10} defaultValue={50}>
  <Range.Container>
    <Range.Connects />
    <Range.Dot className="size-3 rounded-full border-2 border-blue-500" />
  </Range.Container>
  <Range.Thumb />
</Range>
```

### Data Attributes

The compound components expose data attributes for CSS-based styling:

**Range.Connects:**
- `data-connect-status="positive"` - Value is positive or zero
- `data-connect-status="negative"` - Value is negative
- `data-connect-status="disabled"` - Component is disabled

**Range.Thumb:**
- `data-status="default"` - Thumb is at the default value position
- `data-status="normal"` - Thumb is not at default value

**Range.Dot:**
- `data-status="default"` - Dot represents default value, current value below
- `data-status="default-over"` - Dot represents default value, current value at/above
- `data-status="over"` - Current value is at or above this dot
- `data-status="under"` - Current value is below this dot

Example CSS styling with data attributes:

```css
/* Style connects based on value direction */
[data-connect-status="positive"] {
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
}
[data-connect-status="negative"] {
  background: linear-gradient(to left, #ef4444, #f97316);
}

/* Style thumb at default position */
[data-status="default"] {
  border-color: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3);
}

/* Style dots based on state */
[data-status="over"] {
  background-color: #3b82f6;
}
[data-status="default"] {
  border: 2px solid #10b981;
}
```

## Props

```ts
interface RangeProps {
  /** Additional CSS class names */
  className?: string

  /** Compound component children */
  children?: React.ReactNode

  /** Default value indicator position (not initial value) */
  defaultValue?: number

  /** Whether the range is disabled */
  disabled?: boolean

  /** Whether the range is read-only */
  readOnly?: boolean

  /** Maximum value */
  max?: number

  /** Minimum value */
  min?: number

  /** Callback fired when value changes during drag */
  onChange?: (value: number) => void

  /** Callback fired when drag ends */
  onChangeEnd?: () => void

  /** Callback fired when drag starts */
  onChangeStart?: () => void

  /** Step interval for discrete values (supports decimals like 0.0001) */
  step?: number

  /** Size of the thumb/handle */
  thumbSize?: number

  /** Track dimensions */
  trackSize?: {
    height?: number
    width?: number | "auto"
  }

  /** Current value */
  value?: number
}
```

### Defaults

| Prop | Default Value |
|------|---------------|
| `min` | `0` |
| `max` | `100` |
| `step` | `1` |
| `disabled` | `false` |
| `readOnly` | `false` |
| `trackSize` | `{ width: 256, height: 16 }` |
| `thumbSize` | `14` |

### Accessibility

- Keyboard navigation with arrow keys
- Shift+arrow for 10x step movement
- Focus management and visible focus states
- Proper ARIA attributes for screen readers
- Touch-friendly interaction

## Styling

- This component uses Tailwind CSS via `tailwind-variants` in `tv.ts` to create variants and slots.
- Customize using the `className` prop or compound component pattern.
- Slots available in `tv.ts`: `container`, `connect`, `thumb`, `dotContainer`, `dot`, `input`.
- Use data attributes for state-based CSS styling.

## Best Practices

- Use for selecting values from a continuous or stepped range
- Provide appropriate min, max, and step values for your use case
- Consider using step marks for discrete values or important intervals
- Display the current value for better usability (often alongside the slider)
- Use `defaultValue` to indicate recommended or factory settings
- Specify explicit width for consistent appearance, or use "auto" for responsive layouts
- Provide `onChangeStart` and `onChangeEnd` for expensive operations
- Use compound components when you need custom styling beyond className props
- Prefer data attributes for state-based styling over conditional className logic

## Examples

### Volume control

```tsx
const [volume, setVolume] = useState(50)

<div className="flex items-center gap-3">
  <span>🔉</span>
  <Range
    value={volume}
    onChange={setVolume}
    min={0}
    max={100}
    trackSize={{ width: 120, height: 6 }}
    thumbSize={12}
  />
  <span className="w-8 text-right text-body-small">{volume}</span>
</div>
```

### Custom gradient connects

```tsx
const [value, setValue] = useState(50)

<Range value={value} onChange={setValue} min={0} max={100}>
  <Range.Container>
    <Range.Connects className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600" />
  </Range.Container>
  <Range.Thumb />
</Range>
```

### Zoom level with steps

```tsx
const [zoom, setZoom] = useState(100)

<div className="space-y-2">
  <label>Zoom: {zoom}%</label>
  <Range
    value={zoom}
    onChange={setZoom}
    min={25}
    max={400}
    step={25}
    defaultValue={100}
  />
</div>
```

### Responsive width

```tsx
const [value, setValue] = useState(75)

<div className="w-full max-w-md">
  <div className="mb-2 flex justify-between">
    <span>Progress</span>
    <span>{value}%</span>
  </div>
  <Range
    value={value}
    onChange={setValue}
    trackSize={{ width: "auto", height: 8 }}
    thumbSize={16}
  />
</div>
```

## Notes

- When `defaultValue` is provided without steps, it shows as a visual indicator and provides snap behavior
- With steps, `defaultValue` is rounded to the nearest step value
- The component uses pointer capture for smooth dragging across the entire screen
- Auto-width calculation uses ResizeObserver for responsive behavior
- Negative ranges show different visual styling for values below zero
- Decimal step values (like `0.0001`) are fully supported
- The component is optimized for performance with proper memoization of expensive calculations

---

# RangeTuple

A dual-thumb range slider component that allows users to select a range of values (minimum and maximum) within a specified range. Perfect for filtering, selecting intervals, or defining bounds.

## Features

- Dual independent thumbs for min and max value selection
- Visual highlight of the selected range between thumbs
- **Compound Component Pattern**: Same flexible architecture as Range
  - `RangeTuple.Container` - Logical wrapper for track area and dots
  - `RangeTuple.Connects` - Connection bar showing selected range
  - `RangeTuple.Thumb` - Draggable handles (renders both thumbs)
  - `RangeTuple.Dot` - Step markers with range-aware styling
- All features from the single Range component
- Smart thumb selection: clicking the track moves the nearest thumb
- Thumbs change styling when at default positions
- Proper handling of thumb ordering (min cannot exceed max)

## Usage

### Basic

```tsx
import { useState } from "react"

const [value, setValue] = useState<[number, number]>([25, 75])

<RangeTuple
  value={value}
  onChange={setValue}
/>
```

### With step marks

```tsx
const [value, setValue] = useState<[number, number]>([20, 80])

<RangeTuple
  value={value}
  onChange={setValue}
  min={0}
  max={100}
  step={10}
/>
```

### With default value indicators

```tsx
const [value, setValue] = useState<[number, number]>([10, 90])

<RangeTuple
  value={value}
  onChange={setValue}
  min={0}
  max={100}
  defaultValue={[25, 75]}
/>
```

### Negative range

```tsx
const [value, setValue] = useState<[number, number]>([-50, 50])

<RangeTuple
  value={value}
  onChange={setValue}
  min={-100}
  max={100}
  defaultValue={[0, 0]}
/>
```

### Disabled

```tsx
const [value, setValue] = useState<[number, number]>([30, 70])

<RangeTuple
  value={value}
  onChange={setValue}
  min={0}
  max={100}
  disabled
/>
```

## Compound Component Pattern

RangeTuple supports the same compound component pattern as Range for advanced customization.

### Available Subcomponents

| Component | Description |
|-----------|-------------|
| `RangeTuple.Container` | Logical wrapper containing connects, dots, and custom children |
| `RangeTuple.Connects` | The connection bar showing selected range |
| `RangeTuple.Thumb` | Both draggable handles |
| `RangeTuple.Dot` | Step markers with range-aware state |

### Custom Connects Styling

```tsx
const [value, setValue] = useState<[number, number]>([25, 75])

<RangeTuple value={value} onChange={setValue} min={0} max={100} step={10}>
  <RangeTuple.Container>
    <RangeTuple.Connects className="bg-gradient-to-r from-green-400 to-emerald-600" />
  </RangeTuple.Container>
  <RangeTuple.Thumb />
</RangeTuple>
```

### Custom Dots

```tsx
const [value, setValue] = useState<[number, number]>([25, 75])

<RangeTuple value={value} onChange={setValue} min={0} max={100} step={10} defaultValue={[25, 75]}>
  <RangeTuple.Container>
    <RangeTuple.Connects />
    <RangeTuple.Dot className="size-2.5 rounded-full border-2 border-emerald-500" />
  </RangeTuple.Container>
  <RangeTuple.Thumb />
</RangeTuple>
```

### Data Attributes

**RangeTuple.Thumb:**
- `data-status="default"` - Thumb is at its default value position
- `data-status="normal"` - Thumb is not at default value
- `data-position="left"` - Left (min) thumb
- `data-position="right"` - Right (max) thumb

**RangeTuple.Dot:**
- `data-status="default-over"` - Default value dot within selected range
- `data-status="over"` - Dot within selected range
- `data-status="default"` - Default value dot outside selected range
- `data-status="under"` - Dot outside selected range
- `data-status="left-over"` - Left default dot, left thumb at/past position
- `data-status="right-over"` - Right default dot, right thumb at/past position
- `data-position="left"` / `data-position="right"` - Position indicator

## Props

```ts
interface RangeTupleProps {
  /** Additional CSS class names */
  className?: string

  /** Compound component children */
  children?: React.ReactNode

  /** Default value indicator positions (not initial values) */
  defaultValue?: [number, number]

  /** Whether the range is disabled */
  disabled?: boolean

  /** Whether the range is read-only */
  readOnly?: boolean

  /** Maximum value */
  max?: number

  /** Minimum value */
  min?: number

  /** Callback fired when value changes during drag */
  onChange?: (value: [number, number]) => void

  /** Callback fired when drag ends */
  onChangeEnd?: () => void

  /** Callback fired when drag starts */
  onChangeStart?: () => void

  /** Step interval for discrete values (supports decimals) */
  step?: number

  /** Size of the thumbs/handles */
  thumbSize?: number

  /** Track dimensions */
  trackSize?: {
    height?: number
    width?: number | "auto"
  }

  /** Current value tuple [min, max] */
  value?: [number, number]
}
```

### Defaults

| Prop | Default Value |
|------|---------------|
| `min` | `0` |
| `max` | `100` |
| `step` | `1` |
| `disabled` | `false` |
| `readOnly` | `false` |
| `trackSize` | `{ width: 256, height: 16 }` |
| `thumbSize` | `14` |

### Accessibility

- Keyboard navigation with arrow keys for both thumbs
- Shift+arrow for 10x step movement
- Focus management for both thumbs
- Visible focus states
- Proper ARIA attributes for screen readers
- Touch-friendly interaction for both thumbs

## Examples

### Price range filter

```tsx
const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])

<div className="space-y-2">
  <div className="flex justify-between">
    <label>Price Range</label>
    <span className="text-body-small">${priceRange[0]} - ${priceRange[1]}</span>
  </div>
  <RangeTuple
    value={priceRange}
    onChange={setPriceRange}
    min={0}
    max={2000}
    step={50}
  />
</div>
```

### Custom gradient range

```tsx
const [range, setRange] = useState<[number, number]>([20, 80])

<RangeTuple value={range} onChange={setRange} min={0} max={100}>
  <RangeTuple.Container>
    <RangeTuple.Connects className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500" />
  </RangeTuple.Container>
  <RangeTuple.Thumb />
</RangeTuple>
```

### Time slot selection

```tsx
const [timeSlot, setTimeSlot] = useState<[number, number]>([9, 17])

<div className="space-y-2">
  <label>Working Hours: {timeSlot[0]}:00 - {timeSlot[1]}:00</label>
  <RangeTuple
    value={timeSlot}
    onChange={setTimeSlot}
    min={0}
    max={24}
    step={1}
    defaultValue={[9, 17]}
  />
</div>
```

### Temperature comfort zone

```tsx
const [comfortZone, setComfortZone] = useState<[number, number]>([18, 24])

<div className="space-y-2">
  <label>Comfort Zone: {comfortZone[0]}°C - {comfortZone[1]}°C</label>
  <RangeTuple
    value={comfortZone}
    onChange={setComfortZone}
    min={-10}
    max={40}
    defaultValue={[18, 24]}
  />
</div>
```

## RangeTuple Notes

- The value is always a tuple `[min, max]` where `min <= max`
- Clicking the track automatically selects and moves the nearest thumb
- When dragging, thumbs cannot pass each other - they stop at the other thumb's position
- With `defaultValue` tuple, both thumbs show visual indicators when at default positions
- Step behavior applies to both thumbs independently
- Both thumbs can be controlled via keyboard navigation when focused
- The highlighted area between thumbs can be styled via compound components or data attributes
- The component automatically normalizes the tuple to ensure min <= max
