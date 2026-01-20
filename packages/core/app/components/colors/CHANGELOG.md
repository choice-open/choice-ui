# @choice-ui/colors

## 0.3.35

### Features

- **ColorSlider**: Introduce compound component pattern with `ColorSlider.Track` and `ColorSlider.Thumb` subcomponents
  - `ColorSlider.Track` - Customize track height via `height` prop
  - `ColorSlider.Thumb` - Customize thumb size via `size` prop (defaults to track height)
- **ColorSlider**: Add `width` prop to replace deprecated `trackSize` prop
  - Use `width={false}` for auto-width based on container
  - Use `width={number}` for fixed width

### Breaking Changes

- **ColorSlider**: Removed `trackSize` prop. Use `width` prop instead for width, and `ColorSlider.Track height` prop for height
- **ColorSlider**: Removed `thumbSize` prop. Use `ColorSlider.Thumb size` prop instead

### Migration

Before:
```tsx
<ColorSlider trackSize={{ width: 200, height: 20 }} thumbSize={16} />
```

After:
```tsx
<ColorSlider width={200}>
  <ColorSlider.Track height={20} />
  <ColorSlider.Thumb size={16} />
</ColorSlider>
```
