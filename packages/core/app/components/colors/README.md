# @choice-ui/colors

Color picker and color manipulation components for Choice UI.

## Components

### ColorSlider

A slider component for adjusting color properties (hue, saturation, lightness, alpha).

#### Basic Usage

```tsx
import { ColorSlider } from "@choice-ui/react"

function Example() {
  const [position, setPosition] = useState(0.5)

  return (
    <ColorSlider
      type="hue"
      position={position}
      onChange={setPosition}
    />
  )
}
```

#### Compound Component Pattern

ColorSlider supports a compound component pattern for advanced customization:

```tsx
<ColorSlider type="hue" position={position} onChange={setPosition}>
  <ColorSlider.Track height={24} />
  <ColorSlider.Thumb size={20} className="custom-thumb" />
</ColorSlider>
```

#### Subcomponents

- `ColorSlider.Track` - The track background
  - `height?: number` - Track height in pixels (default: 16)
  - `className?: string` - Custom CSS class

- `ColorSlider.Thumb` - The draggable thumb handle
  - `size?: number` - Thumb size in pixels (defaults to track height)
  - `className?: string` - Custom CSS class

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `"hue" \| "saturation" \| "lightness" \| "alpha"` | required | Slider type |
| `position` | `number` | required | Current position (0-1) |
| `onChange` | `(position: number) => void` | - | Position change callback |
| `onChangeStart` | `() => void` | - | Called when drag starts |
| `onChangeEnd` | `() => void` | - | Called when drag ends |
| `hue` | `number` | 0 | Hue value for saturation/lightness/alpha sliders |
| `width` | `number \| boolean` | 256 | Track width. Use `false` for auto-width |
| `disabled` | `boolean` | false | Disable interaction |
| `className` | `string` | - | Custom CSS class |

#### Auto Width

Set `width={false}` to automatically fill the container width:

```tsx
<div className="w-full">
  <ColorSlider type="hue" position={position} onChange={setPosition} width={false} />
</div>
```
