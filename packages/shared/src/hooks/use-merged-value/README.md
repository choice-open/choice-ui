# useMergedValue

A React hook that seamlessly handles both controlled and uncontrolled component states with proper TypeScript support.

## Import

```typescript
import { useMergedValue } from "@choiceform/design-system/hooks"
```

## Usage

```typescript
// Uncontrolled mode with default value
const [value, setValue] = useMergedValue({
  defaultValue: 'initial'
})

// Controlled mode with external value
const [value, setValue] = useMergedValue({
  value: externalValue,
  onChange: (newValue) => setExternalValue(newValue)
})

// Support both modes
function Input({ value, defaultValue, onChange }) {
  const [internalValue, setInternalValue] = useMergedValue({
    value,
    defaultValue,
    onChange
  })

  return (
    <input
      value={internalValue}
      onChange={(e) => setInternalValue(e.target.value)}
    />
  )
}
```

## API

### useMergedValue

```typescript
function useMergedValue<T>(
  options: Options<T>,
): [T, (value: SetStateAction<T>, forceTrigger?: boolean) => void]

interface Options<T> {
  value?: T // Controlled value
  defaultValue?: T // Initial value for uncontrolled mode
  defaultStateValue?: T | (() => T) // Fallback default value
  onChange?: (value: T) => void // Change handler
  onUnchange?: () => void // Called when setting same value
  allowEmpty?: boolean // Allow undefined values without warning
}
```

#### Parameters

- `options` - Configuration object with the following properties:
  - `value` - External controlled value
  - `defaultValue` - Initial value for uncontrolled mode
  - `defaultStateValue` - Fallback default (can be lazy)
  - `onChange` - Called when value changes
  - `onUnchange` - Called when attempting to set the same value
  - `allowEmpty` - Suppress warnings for undefined values

#### Returns

A tuple containing:

1. Current value (controlled or internal)
2. Setter function that handles both modes

## Features

- **Dual mode support**: Works as both controlled and uncontrolled component
- **Mode switching**: Smoothly transitions between controlled/uncontrolled
- **Change detection**: Properly handles NaN and uses Object.is for comparison
- **Lazy initialization**: Support for function-based default values
- **TypeScript ready**: Full type inference and safety
- **Performance optimized**: Stable setter reference, skips unnecessary updates

## Examples

### Basic Input Component

```typescript
interface InputProps {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
}

function TextInput({ value, defaultValue, onChange }: InputProps) {
  const [internalValue, setInternalValue] = useMergedValue({
    value,
    defaultValue: defaultValue || '',
    onChange
  })

  return (
    <input
      type="text"
      value={internalValue}
      onChange={(e) => setInternalValue(e.target.value)}
    />
  )
}

// Usage - Uncontrolled
<TextInput defaultValue="Hello" />

// Usage - Controlled
<TextInput value={state} onChange={setState} />
```

### Toggle Switch

```typescript
interface ToggleProps {
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
}

function Toggle({ checked, defaultChecked, onChange }: ToggleProps) {
  const [isChecked, setIsChecked] = useMergedValue({
    value: checked,
    defaultValue: defaultChecked,
    defaultStateValue: false,
    onChange
  })

  return (
    <button
      role="switch"
      aria-checked={isChecked}
      onClick={() => setIsChecked(!isChecked)}
      className={isChecked ? 'toggle-on' : 'toggle-off'}
    >
      {isChecked ? 'ON' : 'OFF'}
    </button>
  )
}
```

### Select Component

```typescript
interface SelectProps<T> {
  value?: T
  defaultValue?: T
  options: Array<{ label: string; value: T }>
  onChange?: (value: T) => void
}

function Select<T>({ value, defaultValue, options, onChange }: SelectProps<T>) {
  const [selectedValue, setSelectedValue] = useMergedValue({
    value,
    defaultValue,
    onChange
  })

  return (
    <select
      value={selectedValue}
      onChange={(e) => setSelectedValue(e.target.value as T)}
    >
      {options.map((option) => (
        <option key={String(option.value)} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
```

### Number Input with Validation

```typescript
function NumberInput({ value, defaultValue, min, max, onChange }) {
  const [internalValue, setInternalValue] = useMergedValue({
    value,
    defaultValue: defaultValue ?? 0,
    onChange,
    onUnchange: () => console.log('Same value attempted')
  })

  const handleChange = (newValue: number) => {
    // Clamp value between min and max
    const clampedValue = Math.min(Math.max(newValue, min), max)
    setInternalValue(clampedValue)
  }

  return (
    <div>
      <button onClick={() => handleChange(internalValue - 1)}>-</button>
      <input
        type="number"
        value={internalValue}
        onChange={(e) => handleChange(Number(e.target.value))}
      />
      <button onClick={() => handleChange(internalValue + 1)}>+</button>
    </div>
  )
}
```

### Date Picker

```typescript
function DatePicker({ value, defaultValue, onChange, format = 'YYYY-MM-DD' }) {
  const [date, setDate] = useMergedValue({
    value,
    defaultValue: defaultValue || new Date(),
    onChange
  })

  const formattedDate = useMemo(() => {
    return formatDate(date, format)
  }, [date, format])

  return (
    <div className="date-picker">
      <input
        type="text"
        value={formattedDate}
        readOnly
      />
      <Calendar
        value={date}
        onChange={setDate}
      />
    </div>
  )
}
```

### Color Picker

```typescript
interface ColorPickerProps {
  color?: string
  defaultColor?: string
  onChange?: (color: string) => void
}

function ColorPicker({ color, defaultColor, onChange }: ColorPickerProps) {
  const [currentColor, setCurrentColor] = useMergedValue({
    value: color,
    defaultValue: defaultColor,
    defaultStateValue: '#000000',
    onChange
  })

  return (
    <div className="color-picker">
      <input
        type="color"
        value={currentColor}
        onChange={(e) => setCurrentColor(e.target.value)}
      />
      <input
        type="text"
        value={currentColor}
        onChange={(e) => setCurrentColor(e.target.value)}
        pattern="^#[0-9A-Fa-f]{6}$"
      />
    </div>
  )
}
```

### Tabs Component

```typescript
function Tabs({ activeTab, defaultActiveTab, tabs, onChange }) {
  const [currentTab, setCurrentTab] = useMergedValue({
    value: activeTab,
    defaultValue: defaultActiveTab,
    defaultStateValue: () => tabs[0]?.id,
    onChange
  })

  return (
    <div className="tabs">
      <div className="tab-list">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={currentTab === tab.id ? 'active' : ''}
            onClick={() => setCurrentTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {tabs.find(tab => tab.id === currentTab)?.content}
      </div>
    </div>
  )
}
```

## Advanced Usage

### Force Trigger Updates

```typescript
function ForceUpdateExample() {
  const [value, setValue] = useMergedValue({
    defaultValue: 0,
    onChange: (v) => console.log('Changed to:', v),
    onUnchange: () => console.log('Attempted to set same value')
  })

  return (
    <div>
      <p>Value: {value}</p>
      <button onClick={() => setValue(value)}>
        Set Same Value (No Update)
      </button>
      <button onClick={() => setValue(value, true)}>
        Force Update with Same Value
      </button>
    </div>
  )
}
```

### Mode Switching

```typescript
function ModeSwitchingInput() {
  const [isControlled, setIsControlled] = useState(false)
  const [controlledValue, setControlledValue] = useState('')

  const [value, setValue] = useMergedValue({
    value: isControlled ? controlledValue : undefined,
    defaultValue: 'uncontrolled default',
    onChange: isControlled ? setControlledValue : undefined
  })

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={isControlled}
          onChange={(e) => setIsControlled(e.target.checked)}
        />
        Controlled Mode
      </label>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <p>Mode: {isControlled ? 'Controlled' : 'Uncontrolled'}</p>
      <p>Value: {value}</p>
    </div>
  )
}
```

## Best Practices

1. **Provide defaults**: Always provide either `defaultValue` or `defaultStateValue`
2. **Handle both modes**: Design components to work in both controlled and uncontrolled modes
3. **Forward onChange**: Always pass through the onChange handler
4. **Type your values**: Use TypeScript generics for type safety
5. **Avoid mode switching**: Try not to switch between controlled/uncontrolled after mount

## Common Patterns

### With Form Libraries

```typescript
// React Hook Form
function FormInput({ name, control, ...props }) {
  const { field } = useController({ name, control })

  const [value, setValue] = useMergedValue({
    value: field.value,
    onChange: field.onChange,
    ...props
  })

  return <input {...field} value={value} onChange={(e) => setValue(e.target.value)} />
}
```

### With State Management

```typescript
// With Redux
function ReduxConnectedInput({ inputValue, updateValue }) {
  const [value, setValue] = useMergedValue({
    value: inputValue,
    onChange: updateValue
  })

  return <input value={value} onChange={(e) => setValue(e.target.value)} />
}
```

## Notes

- The hook uses `Object.is` for value comparison, properly handling NaN
- Mode detection is based on whether `value` is undefined
- The setter function reference is stable across renders
- Changes in controlled mode only trigger onChange, not internal updates
- Perfect for building reusable form components
