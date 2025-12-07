# usePress & usePressMove

React hooks for handling press interactions with unified mouse, touch, and keyboard support, plus advanced press-and-move functionality.

## Import

```typescript
import { usePress, usePressMove } from "@choiceform/design-system/hooks"
```

## Usage

```typescript
// Basic press handling
function Button({ onPress }) {
  const { isPressed, pressProps } = usePress({
    onPress: (e) => console.log('Pressed!'),
    onPressStart: (e) => console.log('Press started'),
    onPressEnd: (e) => console.log('Press ended')
  })

  return (
    <button
      {...pressProps}
      className={isPressed ? 'pressed' : ''}
    >
      Click me
    </button>
  )
}

// Press and move (for sliders, drag operations)
function Slider({ onChange }) {
  const { isPressed, pressMoveProps } = usePressMove({
    onPressMoveLeft: (delta) => onChange(-delta),
    onPressMoveRight: (delta) => onChange(delta)
  })

  return (
    <div
      {...pressMoveProps}
      className={`slider ${isPressed ? 'dragging' : ''}`}
    />
  )
}
```

## API

### usePress

```typescript
function usePress(props: PressProps): UsePressResult

interface PressProps {
  disabled?: boolean
  onPress?: (event: PressEvent) => void
  onPressStart?: (event: PressEvent) => void
  onPressEnd?: (event: PressEvent) => void
}

interface UsePressResult {
  isPressed: boolean
  pressProps: {
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => void
    onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void
    onKeyUp: (e: React.KeyboardEvent<HTMLElement>) => void
  }
}

type PressEvent = React.PointerEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
```

### usePressMove

```typescript
function usePressMove(props: PressMoveProps): PressMoveResult

interface PressMoveProps extends PressProps {
  onPressMove?: (e: PointerEvent) => void
  onPressMoveLeft?: (delta: number) => void
  onPressMoveRight?: (delta: number) => void
  onPressMoveTop?: (delta: number) => void
  onPressMoveBottom?: (delta: number) => void
}

interface PressMoveResult {
  isPressed: boolean
  pressMoveProps: {
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => void
    ref: (el: HTMLElement | null) => void
    style?: React.CSSProperties
  }
}
```

## Features

### usePress

- **Unified events**: Handles mouse, touch, and keyboard (Space/Enter) consistently
- **Press states**: Tracks press start, end, and current state
- **Event delegation**: Proper event handling with pointer events
- **Accessibility**: Full keyboard support for Space and Enter keys
- **Performance**: Optimized event handling with minimal re-renders

### usePressMove

- **Directional movement**: Separate callbacks for left, right, up, down movement
- **Virtual cursor**: Shows cursor position during pointer lock
- **Movement tracking**: Delta-based movement calculations
- **Pointer lock**: Prevents cursor from leaving the area during drag
- **Overlay management**: Creates temporary overlay for enhanced UX

## Examples

### Basic Button

```typescript
function CustomButton({ children, onPress, disabled }) {
  const { isPressed, pressProps } = usePress({
    disabled,
    onPress,
    onPressStart: () => console.log('Button press started'),
    onPressEnd: () => console.log('Button press ended')
  })

  return (
    <button
      {...pressProps}
      disabled={disabled}
      className={`btn ${isPressed ? 'btn-pressed' : ''} ${disabled ? 'btn-disabled' : ''}`}
    >
      {children}
    </button>
  )
}
```

### Toggle Button

```typescript
function ToggleButton({ checked, onChange }) {
  const [isChecked, setIsChecked] = useState(checked)

  const { isPressed, pressProps } = usePress({
    onPress: () => {
      const newValue = !isChecked
      setIsChecked(newValue)
      onChange?.(newValue)
    }
  })

  return (
    <button
      {...pressProps}
      role="switch"
      aria-checked={isChecked}
      className={`toggle ${isChecked ? 'checked' : ''} ${isPressed ? 'pressed' : ''}`}
    >
      <div className="toggle-thumb" />
    </button>
  )
}
```

### Interactive Card

```typescript
function ClickableCard({ children, onSelect }) {
  const { isPressed, pressProps } = usePress({
    onPress: onSelect,
    onPressStart: () => console.log('Card selection started')
  })

  return (
    <div
      {...pressProps}
      className={`card ${isPressed ? 'card-pressed' : ''}`}
      tabIndex={0}
      role="button"
    >
      {children}
    </div>
  )
}
```

### Horizontal Slider (usePressMove)

```typescript
function HorizontalSlider({ value, onChange, min = 0, max = 100 }) {
  const [sliderValue, setSliderValue] = useState(value)

  const { isPressed, pressMoveProps } = usePressMove({
    onPressMoveLeft: (delta) => {
      const newValue = Math.max(min, sliderValue - delta)
      setSliderValue(newValue)
      onChange?.(newValue)
    },
    onPressMoveRight: (delta) => {
      const newValue = Math.min(max, sliderValue + delta)
      setSliderValue(newValue)
      onChange?.(newValue)
    }
  })

  return (
    <div className="slider-container">
      <div
        {...pressMoveProps}
        className={`slider-track ${isPressed ? 'dragging' : ''}`}
      >
        <div
          className="slider-thumb"
          style={{ left: `${(sliderValue / max) * 100}%` }}
        />
      </div>
      <span className="slider-value">{sliderValue}</span>
    </div>
  )
}
```

### Volume Control

```typescript
function VolumeControl({ volume, onVolumeChange }) {
  const { isPressed, pressMoveProps } = usePressMove({
    onPressMoveLeft: (delta) => {
      const newVolume = Math.max(0, volume - delta * 2)
      onVolumeChange(newVolume)
    },
    onPressMoveRight: (delta) => {
      const newVolume = Math.min(100, volume + delta * 2)
      onVolumeChange(newVolume)
    }
  })

  return (
    <div className="volume-control">
      <VolumeIcon />
      <div
        {...pressMoveProps}
        className={`volume-slider ${isPressed ? 'adjusting' : ''}`}
      >
        <div
          className="volume-fill"
          style={{ width: `${volume}%` }}
        />
      </div>
      <span>{Math.round(volume)}%</span>
    </div>
  )
}
```

### 2D Position Controller

```typescript
function PositionController({ x, y, onChange }) {
  const { isPressed, pressMoveProps } = usePressMove({
    onPressMoveLeft: (delta) => onChange(Math.max(0, x - delta), y),
    onPressMoveRight: (delta) => onChange(Math.min(100, x + delta), y),
    onPressMoveTop: (delta) => onChange(x, Math.max(0, y - delta)),
    onPressMoveBottom: (delta) => onChange(x, Math.min(100, y + delta))
  })

  return (
    <div className="position-controller">
      <div
        {...pressMoveProps}
        className={`control-area ${isPressed ? 'controlling' : ''}`}
      >
        <div
          className="position-indicator"
          style={{
            left: `${x}%`,
            top: `${y}%`
          }}
        />
      </div>
      <div className="coordinates">
        X: {Math.round(x)}, Y: {Math.round(y)}
      </div>
    </div>
  )
}
```

### Color Picker Saturation

```typescript
function SaturationPicker({ hue, saturation, lightness, onChange }) {
  const { isPressed, pressMoveProps } = usePressMove({
    onPressMoveLeft: (delta) => {
      const newSaturation = Math.max(0, saturation - delta)
      onChange(hue, newSaturation, lightness)
    },
    onPressMoveRight: (delta) => {
      const newSaturation = Math.min(100, saturation + delta)
      onChange(hue, newSaturation, lightness)
    },
    onPressMoveTop: (delta) => {
      const newLightness = Math.min(100, lightness + delta)
      onChange(hue, saturation, newLightness)
    },
    onPressMoveBottom: (delta) => {
      const newLightness = Math.max(0, lightness - delta)
      onChange(hue, saturation, newLightness)
    }
  })

  return (
    <div
      {...pressMoveProps}
      className={`saturation-picker ${isPressed ? 'picking' : ''}`}
      style={{ backgroundColor: `hsl(${hue}, 100%, 50%)` }}
    >
      <div
        className="picker-cursor"
        style={{
          left: `${saturation}%`,
          top: `${100 - lightness}%`
        }}
      />
    </div>
  )
}
```

### Image Pan and Zoom

```typescript
function ImageViewer({ src }) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  const { isPressed, pressMoveProps } = usePressMove({
    onPressMoveLeft: (delta) => {
      setPosition(prev => ({ ...prev, x: prev.x - delta }))
    },
    onPressMoveRight: (delta) => {
      setPosition(prev => ({ ...prev, x: prev.x + delta }))
    },
    onPressMoveTop: (delta) => {
      setPosition(prev => ({ ...prev, y: prev.y - delta }))
    },
    onPressMoveBottom: (delta) => {
      setPosition(prev => ({ ...prev, y: prev.y + delta }))
    }
  })

  return (
    <div className="image-viewer">
      <div
        {...pressMoveProps}
        className={`image-container ${isPressed ? 'panning' : ''}`}
      >
        <img
          src={src}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            cursor: isPressed ? 'grabbing' : 'grab'
          }}
        />
      </div>
    </div>
  )
}
```

## Use Cases

### usePress

1. **Custom buttons**: Enhanced button components with press states
2. **Interactive cards**: Clickable cards and tiles
3. **Menu items**: Context menu and dropdown items
4. **Toggle controls**: Switches, checkboxes, radio buttons
5. **Action triggers**: Any clickable/tappable interface element

### usePressMove

1. **Sliders**: Value adjustment with drag gestures
2. **Color pickers**: Saturation and hue adjustment
3. **Image manipulation**: Pan, zoom, rotate operations
4. **Game controls**: Joystick-like position controllers
5. **Data visualization**: Interactive chart manipulation

## Accessibility Features

- **Keyboard support**: Space and Enter keys work like mouse/touch
- **Focus management**: Proper focus handling for keyboard users
- **Event targeting**: Only responds to events on the target element
- **Screen reader friendly**: Works with assistive technologies

## Performance Notes

- Uses modern pointer events for optimal performance
- Minimal re-renders with stable event handlers
- Efficient cleanup of global event listeners
- Optimized movement calculations for smooth interactions

## Browser Support

- Modern browsers with pointer events support
- Graceful fallback for older browsers
- Touch device optimized
- Desktop and mobile compatible

## Best Practices

1. **Provide visual feedback**: Use the `isPressed` state for styling
2. **Handle disabled state**: Disable interactions when appropriate
3. **Consider accessibility**: Ensure keyboard navigation works
4. **Optimize for touch**: Larger touch targets on mobile devices
5. **Clean event handling**: The hooks handle cleanup automatically
