# BezierCurveEditor

An interactive Bézier curve editor for creating and editing CSS cubic-bezier timing functions. Features visual curve editing, preset easings, real-time preview animations, and performance optimization for smooth interactions.

## Import

```tsx
import { BezierCurveEditor } from "@choiceform/design-system"
```

## Features

- **Interactive Visual Editing**: Drag control points to shape curves visually
- **Two Operating Modes**: Basic (4-value) and Advanced (8-value with editable endpoints)
- **Preset Easings**: Built-in collection of common easing curves
- **Real-time Preview**: Live animation preview with customizable timing
- **Performance Optimized**: Efficient rendering and interaction handling
- **Speed Visualization**: Color-coded speed gradients showing animation velocity
- **Keyboard Accessible**: Full keyboard navigation and control
- **TypeScript Support**: Complete type definitions for all props and values
- **Responsive Design**: Works on various screen sizes and touch devices

## Usage

### Basic Mode (Standard CSS cubic-bezier)

```tsx
import { useState } from "react"

function BasicCurveEditor() {
  const [curve, setCurve] = useState([0.4, 0, 1, 0.6])

  return (
    <BezierCurveEditor
      size={96}
      value={curve}
      onChange={setCurve}
      allowNodeEditing={false} // Basic mode
    />
  )
}
```

### Advanced Mode (Full Control)

```tsx
function AdvancedCurveEditor() {
  const [curve, setCurve] = useState([0, 0, 0.5, 0.25, 0.5, 0.75, 1, 1])

  return (
    <BezierCurveEditor
      size={200}
      value={curve}
      onChange={setCurve}
      allowNodeEditing={true} // Advanced mode
      handleSize={12}
    />
  )
}
```

### With Animation Preview

```tsx
function CurveWithPreview() {
  const [curve, setCurve] = useState([0.4, 0, 1, 0.6])
  const [duration, setDuration] = useState(2)

  const previewStyle = useMemo(
    () => ({
      animationName: "bezier-preview-loop",
      animationIterationCount: "infinite",
      animationDirection: "alternate",
      animationDuration: `${duration}s`,
      animationTimingFunction: `cubic-bezier(${curve})`,
    }),
    [curve, duration],
  )

  return (
    <div>
      <style>{`
        @keyframes bezier-preview-loop {
          from { transform: translateX(0px); }
          to { transform: translateX(160px); }
        }
      `}</style>

      <BezierCurveEditor
        value={curve}
        onChange={setCurve}
        duration={duration}
      />

      {/* Preview animation */}
      <div className="relative h-8 w-40 rounded bg-gray-200">
        <div
          className="absolute left-1 top-1 h-6 w-6 rounded bg-white shadow"
          style={previewStyle}
        />
      </div>
    </div>
  )
}
```

### Speed Visualization

```tsx
function CurveWithSpeedGradient() {
  const [curve, setCurve] = useState([0.4, 0, 1, 0.6])

  // Generate speed gradient based on curve
  const generateSpeedGradient = (value) => {
    const [x1, y1, x2, y2] = value
    const colors = []

    for (let i = 0; i <= 20; i++) {
      const t = i / 20
      const dx = 3 * (1 - t) * (1 - t) * x1 + 6 * (1 - t) * t * (x2 - x1) + 3 * t * t * (1 - x2)
      const speed = Math.abs(dx)
      const normalizedSpeed = Math.min(Math.max(speed, 0), 2) / 2

      // Map speed to color (blue = slow, green = medium, red = fast)
      let color
      if (normalizedSpeed < 0.33) {
        color = `rgb(59, 130, 246)` // Blue
      } else if (normalizedSpeed < 0.66) {
        color = `rgb(34, 197, 94)` // Green
      } else {
        color = `rgb(239, 68, 68)` // Red
      }

      colors.push(`${color} ${t * 100}%`)
    }

    return `linear-gradient(to right, ${colors.join(", ")})`
  }

  return (
    <div>
      <BezierCurveEditor
        value={curve}
        onChange={setCurve}
      />

      {/* Speed visualization */}
      <div className="mt-4">
        <div className="mb-1 text-xs text-gray-600">Animation Speed:</div>
        <div
          className="h-2 w-full rounded"
          style={{ backgroundImage: generateSpeedGradient(curve) }}
        />
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>🐌 Slow</span>
          <span>🏃 Medium</span>
          <span>🚀 Fast</span>
        </div>
      </div>
    </div>
  )
}
```

### Preset Easings Gallery

```tsx
const PRESET_EASINGS = [
  { name: "linear", value: [0, 0, 1, 1] },
  { name: "ease", value: [0.25, 0.1, 0.25, 1] },
  { name: "ease-in", value: [0.42, 0, 1, 1] },
  { name: "ease-out", value: [0, 0, 0.58, 1] },
  { name: "ease-in-out", value: [0.42, 0, 0.58, 1] },
  // ... more presets
]

function PresetGallery() {
  const [selectedCurve, setSelectedCurve] = useState(PRESET_EASINGS[0])

  return (
    <div className="flex gap-8">
      {/* Main editor */}
      <div>
        <BezierCurveEditor
          size={128}
          value={selectedCurve.value}
          onChange={(value) => {
            setSelectedCurve({
              name: `cubic-bezier(${value.map((v) => v.toFixed(2)).join(", ")})`,
              value,
            })
          }}
        />
        <h3>{selectedCurve.name}</h3>
      </div>

      {/* Preset grid */}
      <div className="grid grid-cols-4 gap-4">
        {PRESET_EASINGS.map((preset) => (
          <div
            key={preset.name}
            className="cursor-pointer text-center"
            onClick={() => setSelectedCurve(preset)}
          >
            <BezierCurveEditor
              size={64}
              value={preset.value}
              allowNodeEditing={false}
              showPlane={false}
              className={selectedCurve.name === preset.name ? "border-blue-500" : "border-gray-300"}
            />
            <span className="text-xs">{preset.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Constrained Editing

```tsx
function ConstrainedEditor() {
  const [curve, setCurve] = useState([0, 0, 0.5, 0.25, 0.5, 0.75, 1, 1])

  return (
    <BezierCurveEditor
      size={200}
      value={curve}
      onChange={setCurve}
      allowNodeEditing={true}
      disabledPoints={[true, false]} // Disable first point, allow second
      outerAreaSize={32} // Limit how far points can move outside
    />
  )
}
```

### Integration with Forms

```tsx
function CurveInputForm() {
  const [curve, setCurve] = useState([0.4, 0, 1, 0.6])

  return (
    <div className="space-y-4">
      <BezierCurveEditor
        value={curve}
        onChange={setCurve}
        size={96}
      />

      <div className="flex items-center gap-2">
        <label>CSS Value:</label>
        <input
          value={`cubic-bezier(${curve.map((v) => v.toFixed(2)).join(", ")})`}
          onChange={(e) => {
            const match = e.target.value.match(/cubic-bezier\((.*)\)/)
            if (match) {
              const values = match[1].split(",").map((v) => parseFloat(v.trim()))
              if (values.length === 4 && values.every((v) => !isNaN(v))) {
                setCurve(values)
              }
            }
          }}
          className="text-body-small rounded border px-2 py-1 font-mono"
        />
      </div>
    </div>
  )
}
```

## Props

### BezierCurveEditor Props

```ts
interface BezierCurveEditorProps {
  /** Whether endpoints can be edited (enables 8-value mode) */
  allowNodeEditing?: boolean

  /** Additional CSS classes */
  className?: string

  /** Animation delay for preview (seconds) */
  delay?: number

  /** Which control points are disabled [start, end] */
  disabledPoints?: [boolean, boolean]

  /** Animation duration for preview (seconds) */
  duration?: number

  /** Whether to show preview animation */
  enablePreview?: boolean

  /** Size of draggable handles (pixels) */
  handleSize?: number

  /** Value change handler */
  onChange?: (value: BezierCurveValueType | BezierCurveExpandedValueType) => void

  /** Extended area outside main grid */
  outerAreaSize?: number

  /** Whether to show the grid plane */
  showPlane?: boolean

  /** Main editor size (pixels) */
  size?: number

  /** Stroke width for curve line */
  strokeWidth?: number

  /** Current curve value */
  value?: BezierCurveValueType | BezierCurveExpandedValueType
}
```

### Value Types

```ts
// Basic mode: [x1, y1, x2, y2] - standard CSS cubic-bezier values
type BezierCurveValueType = [number, number, number, number]

// Advanced mode: [startX, startY, x1, y1, x2, y2, endX, endY]
type BezierCurveExpandedValueType = [number, number, number, number, number, number, number, number]
```

## Default Values

- `allowNodeEditing`: `false` (basic mode)
- `delay`: `0`
- `disabledPoints`: `[false, false]`
- `duration`: `2`
- `enablePreview`: `false`
- `handleSize`: `8`
- `outerAreaSize`: `64`
- `showPlane`: `true`
- `size`: `192`
- `strokeWidth`: `1`
- `value`: `[0.4, 0, 1, 0.6]` (ease-in-out-like curve)

## Operating Modes

### Basic Mode (`allowNodeEditing: false`)

- Uses standard 4-value CSS cubic-bezier format
- Start point fixed at (0,0), end point fixed at (1,1)
- Only control handles are draggable
- Perfect for CSS animations and transitions

### Advanced Mode (`allowNodeEditing: true`)

- Uses 8-value format with editable endpoints
- All points can be moved and customized
- Useful for complex animations or non-standard curves
- Provides maximum flexibility

## Keyboard Navigation

- **Tab**: Move focus between control points
- **Arrow Keys**: Fine-tune point positions
- **Enter/Space**: Activate point for keyboard editing
- **Escape**: Cancel current operation

## Accessibility

- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard support
- **Focus Indicators**: Clear visual focus states
- **Value Announcements**: Changes announced to assistive technology

## Performance Considerations

### Optimization Features

- **Memoized Calculations**: Expensive coordinate calculations cached
- **Event Callback Optimization**: useEventCallback prevents unnecessary re-renders
- **Efficient Rendering**: Only affected components re-render on changes
- **Touch Optimization**: Optimized for touch devices and mobile

### Best Practices

- Use `useMemo` for expensive calculations in parent components
- Debounce onChange handlers for performance-critical applications
- Consider limiting the number of simultaneous editors on screen
- Cache preset values to avoid recalculation

## Styling

The component uses Tailwind Variants for consistent styling:

- **Grid Background**: Subtle grid for visual reference
- **Curve Styling**: Smooth anti-aliased curve rendering
- **Handle Appearance**: Interactive control points with hover states
- **Focus States**: Clear keyboard focus indicators
- **Theme Support**: Adapts to light/dark themes

## Browser Support

- **Modern Browsers**: Full support in Chrome, Firefox, Safari, Edge
- **Touch Devices**: Optimized touch interactions
- **High DPI**: Sharp rendering on retina displays
- **Performance**: Hardware-accelerated rendering where available

## Common Use Cases

### CSS Animation Timing

```tsx
// For CSS transitions and animations
<BezierCurveEditor
  value={[0.4, 0, 0.2, 1]}
  onChange={(curve) => {
    element.style.transitionTimingFunction = `cubic-bezier(${curve})`
  }}
/>
```

### Game Animation Easing

```tsx
// For game or complex animations
<BezierCurveEditor
  allowNodeEditing={true}
  value={customGameCurve}
  onChange={setGameEasingCurve}
/>
```

### Design Tool Integration

```tsx
// For design tools and editors
<BezierCurveEditor
  size={200}
  handleSize={10}
  outerAreaSize={40}
  showPlane={true}
  enablePreview={true}
/>
```

## Notes

- Values are automatically clamped to valid ranges
- TypeScript users should set `allowNodeEditing` explicitly for proper typing
- The component is fully controlled - you must handle state management
- Preview animations require custom CSS keyframes to be defined
- For performance, avoid creating new curve editors frequently
- Consider using preset curves for common easing patterns
