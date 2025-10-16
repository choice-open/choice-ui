# Range

A customizable slider component family that allows users to select numeric values within a specified range. Includes both single-value (`Range`) and dual-thumb range selection (`RangeTuple`) variants, with support for step intervals, default value indicators, and responsive sizing.

## Import

```tsx
import { Range, RangeTuple } from "@choiceform/design-system"
```

## Features

- Customizable minimum and maximum values
- Optional step intervals with visual tick marks
- Default value indicator with snap effect
- Configurable track and thumb sizes
- Support for negative value ranges
- Disabled state support
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

### Combined step marks and default value

```tsx
const [value, setValue] = useState(10)

<Range
  value={value}
  onChange={setValue}
  min={0}
  max={100}
  defaultValue={50}
  step={10}
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

### In a popover

```tsx
import { Popover, Button } from "@choiceform/design-system"

const [value, setValue] = useState(0)

<Popover draggable>
  <Popover.Trigger>
    <Button>Settings</Button>
  </Popover.Trigger>
  <Popover.Header title="Adjust Value" />
  <Popover.Content className="grid w-64 grid-cols-[180px_auto] gap-2 p-3">
    <Range
      className="flex-1"
      value={value}
      onChange={setValue}
      min={0}
      max={100}
      defaultValue={50}
      trackSize={{
        width: 180,
        height: 16,
      }}
    />
    <div className="w-10 flex-1 text-right">{value}%</div>
  </Popover.Content>
</Popover>
```

### With numeric input

```tsx
import { NumericInput } from "@choiceform/design-system"

const [value, setValue] = useState(0)

<div className="grid w-40 grid-cols-[1fr_2.5rem] gap-px">
  <div className="bg-secondary-background flex items-center rounded-l-md px-2">
    <Range
      className="bg-default-boundary flex-1"
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
  <NumericInput
    className="before:rounded-l-none"
    expression="{value}%"
    value={value}
    onChange={(value) => setValue(value as number)}
    min={0}
    max={100}
  >
    <NumericInput.Prefix className="w-2 rounded-l-none" />
  </NumericInput>
</div>
```

## Props

```ts
interface RangeProps {
  /** Additional CSS class names */
  className?: string

  /** Custom styling for positive and negative value connections */
  connectsClassName?: {
    negative?: string
    positive?: string
  }

  /** Default value indicator position (not initial value) */
  defaultValue?: number

  /** Whether the range is disabled */
  disabled?: boolean

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

  /** Step interval for discrete values */
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

- Defaults:
  - `min`: 0
  - `max`: 100
  - `step`: 1
  - `disabled`: false
  - `connectsClassName`: `{ positive: "bg-accent-background", negative: "bg-accent-background" }`
  - `trackSize`: `{ width: 256, height: 16 }`
  - `thumbSize`: 14

- Accessibility:
  - Keyboard navigation with arrow keys
  - Shift+arrow for 10x step movement
  - Focus management and visible focus states
  - Proper ARIA attributes for screen readers
  - Touch-friendly interaction

## Styling

- This component uses Tailwind CSS via `tailwind-variants` in `tv.ts` to create variants and slots.
- Customize using the `className` prop and `connectsClassName` for the fill area.
- Slots available in `tv.ts`: `container`, `connect`, `thumb`, `dotContainer`, `dot`, `input`.

## Best practices

- Use for selecting values from a continuous or stepped range
- Provide appropriate min, max, and step values for your use case
- Consider using step marks for discrete values or important intervals
- Display the current value for better usability (often alongside the slider)
- Use `defaultValue` to indicate recommended or factory settings
- Specify explicit width for consistent appearance, or use "auto" for responsive layouts
- Provide `onChangeStart` and `onChangeEnd` for expensive operations
- Consider snap behavior with `defaultValue` for important reference points

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

### Color opacity

```tsx
const [opacity, setOpacity] = useState(100)

<div className="space-y-2">
  <label>Opacity: {opacity}%</label>
  <Range
    value={opacity}
    onChange={setOpacity}
    min={0}
    max={100}
    step={5}
    defaultValue={100}
  />
</div>
```

### Temperature range

```tsx
const [temp, setTemp] = useState(20)

<div className="space-y-2">
  <label>Temperature: {temp}°C</label>
  <Range
    value={temp}
    onChange={setTemp}
    min={-10}
    max={40}
    defaultValue={20}
    connectsClassName={{
      negative: "bg-blue-400",
      positive: "bg-red-400"
    }}
  />
</div>
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
- Loading states and validation can be handled in the `onChange` callback
- The component is optimized for performance with proper memoization of expensive calculations

---

# RangeTuple

A dual-thumb range slider component that allows users to select a range of values (minimum and maximum) within a specified range. Perfect for filtering, selecting intervals, or defining bounds.

## Features

- Dual independent thumbs for min and max value selection
- Visual highlight of the selected range between thumbs
- All features from the single Range component:
  - Customizable minimum and maximum bounds
  - Optional step intervals with visual tick marks
  - Default value indicators with snap effect
  - Configurable track and thumb sizes
  - Support for negative value ranges
  - Disabled state support
  - Controlled usage patterns
  - Automatic and fixed width sizing options
  - Smooth drag interaction with pointer capture
  - Keyboard navigation support (arrow keys for both thumbs)
  - Proper accessibility with ARIA attributes
- Smart thumb selection: clicking the track moves the nearest thumb
- Thumbs change color when at default positions
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

### Custom sizing

```tsx
const [value, setValue] = useState<[number, number]>([20, 80])

<RangeTuple
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

### In a popover

```tsx
import { Popover, Button } from "@choiceform/design-system"

const [value, setValue] = useState<[number, number]>([25, 75])

<Popover draggable>
  <Popover.Trigger>
    <Button>Open Range Filter</Button>
  </Popover.Trigger>
  <Popover.Header title="Select Range" />
  <Popover.Content className="grid w-64 grid-cols-[180px_auto] gap-2 p-3">
    <RangeTuple
      className="flex-1"
      value={value}
      onChange={setValue}
      min={0}
      max={100}
      defaultValue={[25, 75]}
      trackSize={{
        width: 180,
        height: 16,
      }}
    />
    <div className="text-body-medium w-14 flex-1 text-right">
      {value[0]}-{value[1]}%
    </div>
  </Popover.Content>
</Popover>
```

## Props

```ts
interface RangeTupleProps {
  /** Additional CSS class names */
  className?: string

  /** Custom styling for positive and negative value connections */
  connectsClassName?: {
    negative?: string
    positive?: string
  }

  /** Default value indicator positions (not initial values) */
  defaultValue?: [number, number]

  /** Whether the range is disabled */
  disabled?: boolean

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

  /** Step interval for discrete values */
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

- Defaults:
  - `min`: 0
  - `max`: 100
  - `step`: 1
  - `disabled`: false
  - `connectsClassName`: `{ positive: "bg-accent-background", negative: "bg-accent-background" }`
  - `trackSize`: `{ width: 256, height: 16 }`
  - `thumbSize`: 14

- Accessibility:
  - Keyboard navigation with arrow keys for both thumbs
  - Shift+arrow for 10x step movement
  - Focus management for both thumbs
  - Visible focus states
  - Proper ARIA attributes for screen readers
  - Touch-friendly interaction for both thumbs

## Styling

- This component uses the same Tailwind CSS variants as `Range` via `tailwind-variants` in `tv.ts`.
- Customize using the `className` prop and `connectsClassName` for the highlighted range area.
- Slots available in `tv.ts`: `container`, `connect`, `thumb`, `dotContainer`, `dot`, `input`.
- Thumbs automatically change visual styling when at default value positions.

## Best practices

- Use for selecting a range or interval (e.g., price range, date range, time slots)
- Display the current range values for better usability (e.g., "25 - 75" or "$25 - $75")
- Use `defaultValue` to indicate recommended or typical ranges
- Specify explicit width for consistent appearance, or use "auto" for responsive layouts
- Provide appropriate min, max, and step values for your use case
- Consider using step marks for discrete intervals
- Provide `onChangeStart` and `onChangeEnd` for expensive operations like API calls
- Ensure the selected range is visually distinct from unselected areas
- Consider showing the range span (e.g., "Range: 50 units") when useful

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

### Age range filter

```tsx
const [ageRange, setAgeRange] = useState<[number, number]>([18, 65])

<div className="space-y-2">
  <label>Age Range: {ageRange[0]} - {ageRange[1]} years</label>
  <RangeTuple
    value={ageRange}
    onChange={setAgeRange}
    min={0}
    max={100}
    step={5}
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
    connectsClassName={{
      positive: "bg-green-400"
    }}
  />
</div>
```

### Date range (days)

```tsx
const [dayRange, setDayRange] = useState<[number, number]>([1, 30])

<div className="space-y-2">
  <label>Select Days: Day {dayRange[0]} to Day {dayRange[1]}</label>
  <RangeTuple
    value={dayRange}
    onChange={setDayRange}
    min={1}
    max={365}
    step={1}
  />
  <span className="text-body-small text-secondary-text">
    Duration: {dayRange[1] - dayRange[0] + 1} days
  </span>
</div>
```

### Percentage range with display

```tsx
const [percentRange, setPercentRange] = useState<[number, number]>([25, 75])

<div className="flex items-center gap-4">
  <RangeTuple
    value={percentRange}
    onChange={setPercentRange}
    min={0}
    max={100}
    step={5}
    defaultValue={[0, 100]}
  />
  <div className="text-body-medium w-24 text-right">
    {percentRange[0]}% - {percentRange[1]}%
  </div>
</div>
```

## RangeTuple Notes

- The value is always a tuple `[min, max]` where `min <= max`
- Clicking the track automatically selects and moves the nearest thumb
- When dragging, thumbs cannot pass each other - they stop at the other thumb's position
- With `defaultValue` tuple, both thumbs show visual indicators when at default positions
- Step behavior applies to both thumbs independently
- Both thumbs can be controlled via keyboard navigation when focused
- The highlighted area between thumbs can be styled via `connectsClassName.positive`
- For negative ranges, the component intelligently handles the visual styling
- The component automatically normalizes the tuple to ensure min <= max
