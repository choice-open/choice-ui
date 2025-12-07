# Switch

A toggle control for binary states like on/off or enabled/disabled. Provides immediate feedback for state changes with smooth animations and comprehensive accessibility support.

## Import

```tsx
import { Switch } from "@choiceform/design-system"
```

## Features

- Multiple visual variants (default, accent, outline)
- Two sizes (small, medium)
- Support for disabled and focused states
- Two label approaches: simple string children or explicit `<Switch.Label>` for complex content
- Smooth animations with Framer Motion
- Full keyboard and screen reader accessibility
- Controlled component with required `value` and `onChange` props

## Usage

### Basic Switch

```tsx
const [enabled, setEnabled] = useState(false)

return (
  <Switch
    value={enabled}
    onChange={setEnabled}
  >
    Enable notifications
  </Switch>
)
```

### Sizes

```tsx
const [small, setSmall] = useState(false)
const [medium, setMedium] = useState(false)

return (
  <div className="flex flex-col gap-4">
    <Switch
      value={small}
      onChange={setSmall}
      size="small"
    >
      Small size (16px height)
    </Switch>

    <Switch
      value={medium}
      onChange={setMedium}
      size="medium"
    >
      Medium size (24px height)
    </Switch>
  </div>
)
```

### Variants

```tsx
const [defaultVariant, setDefaultVariant] = useState(false)
const [accentVariant, setAccentVariant] = useState(false)
const [outlineVariant, setOutlineVariant] = useState(false)

return (
  <div className="flex flex-col gap-4">
    <Switch
      value={defaultVariant}
      onChange={setDefaultVariant}
      variant="default"
    >
      Default variant
    </Switch>

    <Switch
      value={accentVariant}
      onChange={setAccentVariant}
      variant="accent"
    >
      Accent variant
    </Switch>

    <Switch
      value={outlineVariant}
      onChange={setOutlineVariant}
      variant="outline"
    >
      Outline variant
    </Switch>
  </div>
)
```

### Disabled State

```tsx
const [disabled, setDisabled] = useState(false)
const [disabledChecked, setDisabledChecked] = useState(true)

return (
  <div className="flex flex-col gap-4">
    <Switch
      value={disabled}
      onChange={setDisabled}
      disabled
    >
      Disabled unchecked
    </Switch>

    <Switch
      value={disabledChecked}
      onChange={setDisabledChecked}
      disabled
    >
      Disabled checked
    </Switch>
  </div>
)
```

### Label Usage Patterns

```tsx
const [simple, setSimple] = useState(false)
const [explicit, setExplicit] = useState(false)

return (
  <div className="flex flex-col gap-4">
    {/* Simple string label (auto-wrapped) */}
    <Switch
      value={simple}
      onChange={setSimple}
    >
      Simple text label
    </Switch>

    {/* Explicit Switch.Label for complex content */}
    <Switch
      value={explicit}
      onChange={setExplicit}
    >
      <Switch.Label>
        <span className="text-accent-foreground">Complex</span> label with{" "}
        <strong>formatting</strong>
      </Switch.Label>
    </Switch>
  </div>
)
```

### Legacy Label Prop (Backward Compatibility)

```tsx
const [value, setValue] = useState(false)

return (
  <Switch
    value={value}
    onChange={setValue}
    label="Switch with legacy label prop"
  />
)
```

### With Tooltip

```tsx
import { Tooltip } from "@choiceform/design-system"

const [tooltip, setTooltip] = useState(false)

return (
  <Tooltip content="This setting affects all notifications">
    <Switch
      value={tooltip}
      onChange={setTooltip}
    >
      Enable notifications
    </Switch>
  </Tooltip>
)
```

### All Variants and States

```tsx
// Comprehensive example showing all combinations
const variants = ["default", "accent", "outline"] as const
const sizes = ["small", "medium"] as const
const states = ["enabled", "disabled", "focused"] as const

return (
  <div className="space-y-8">
    {sizes.map((size) => (
      <div
        key={size}
        className="space-y-4"
      >
        <h3 className="font-strong capitalize">{size} Size</h3>

        <div className="grid grid-cols-3 gap-8">
          {variants.map((variant) => (
            <div
              key={variant}
              className="space-y-2"
            >
              <h4 className="text-body-small-strong text-pink-500 capitalize">{variant}</h4>

              <div className="space-y-2">
                {states.map((state) => (
                  <div
                    key={state}
                    className="flex gap-2"
                  >
                    <Switch
                      value={false}
                      onChange={() => {}}
                      variant={variant}
                      size={size}
                      disabled={state === "disabled"}
                      focused={state === "focused"}
                    />
                    <Switch
                      value={true}
                      onChange={() => {}}
                      variant={variant}
                      size={size}
                      disabled={state === "disabled"}
                      focused={state === "focused"}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
)
```

## Props

### Switch

```tsx
interface SwitchProps
  extends Omit<HTMLProps<HTMLInputElement>, "size" | "value" | "onChange" | "children"> {
  /** Child content (label text or Switch.Label component) */
  children?: ReactNode

  /** Additional CSS classes */
  className?: string

  /** Force focused appearance */
  focused?: boolean

  /** @deprecated Use children instead */
  label?: string

  /** State change handler */
  onChange: (value: boolean) => void

  /** Switch size */
  size?: "small" | "medium"

  /** Current state */
  value: boolean

  /** Visual variant */
  variant?: "default" | "accent" | "outline"
}
```

- Required props: `value`, `onChange`
- Defaults:
  - `size`: `"medium"`
  - `variant`: `"default"`
  - `focused`: `false`

### Switch.Label

```tsx
interface SwitchLabelProps {
  /** Label content */
  children: ReactNode

  /** Additional CSS classes */
  className?: string
}
```

## Components

### Switch

The main switch component that renders as a label containing the input and visual elements.

### Switch.Label

A subcomponent for complex label content with formatting or multiple elements.

## Styling

- Uses Tailwind CSS via `tailwind-variants`
- Smooth thumb animations with Framer Motion
- CSS custom properties for size variants:
  - Small: 20px width, 12px height, 8px thumb
  - Medium: 28px width, 16px height, 12px thumb
- Visual feedback for all interactive states
- Customizable with `className` prop

## Best Practices

### Usage Guidelines

- Use for immediate toggle actions (unlike checkboxes in forms)
- Provide clear labels that describe the state being toggled
- Consider using tooltips for additional context when needed
- Choose appropriate size and variant based on context
- Simple labels: use string children
- Complex labels: use `<Switch.Label>` component

### Label Guidelines

- Always provide a visible label (string or `<Switch.Label>`)
- Make the toggle action and its effect immediately apparent
- Use simple string children for basic labels
- Use `<Switch.Label>` for labels with formatting or complex content
- Write labels that work for both on and off states

### Accessibility

- Proper semantic structure with `<label>` and `<input type="checkbox">`
- Screen reader support with `aria-checked` and appropriate labels
- Keyboard support (Space to toggle, Tab to focus)
- Focus indicators for keyboard navigation
- State announcements ("Enabled"/"Disabled") for screen readers
- Support for `aria-label` and `aria-describedby`

### Performance

- Memoized components to prevent unnecessary re-renders
- Efficient animation with Framer Motion
- Minimal DOM updates during state changes
- CSS custom properties for size calculations

## Examples

### Settings Panel

```tsx
const [settings, setSettings] = useState({
  notifications: true,
  darkMode: false,
  autoSave: true,
  analytics: false,
})

const updateSetting = (key: string) => (value: boolean) => {
  setSettings((prev) => ({ ...prev, [key]: value }))
}

return (
  <div className="space-y-4">
    <Switch
      value={settings.notifications}
      onChange={updateSetting("notifications")}
    >
      Push notifications
    </Switch>

    <Switch
      value={settings.darkMode}
      onChange={updateSetting("darkMode")}
      variant="accent"
    >
      Dark mode
    </Switch>

    <Switch
      value={settings.autoSave}
      onChange={updateSetting("autoSave")}
      size="small"
    >
      Auto-save documents
    </Switch>

    <Switch
      value={settings.analytics}
      onChange={updateSetting("analytics")}
      disabled
    >
      <Switch.Label>
        <span>Share analytics</span>
        <span className="ml-1 text-gray-500">(Premium only)</span>
      </Switch.Label>
    </Switch>
  </div>
)
```

### Feature Toggle

```tsx
const [feature, setFeature] = useState(false)

return (
  <div className="flex items-center justify-between rounded-lg border p-4">
    <div>
      <h3 className="font-strong">Beta Features</h3>
      <p className="text-body-small text-gray-600">Enable experimental features and improvements</p>
    </div>

    <Switch
      value={feature}
      onChange={setFeature}
      variant="accent"
    >
      Enable beta features
    </Switch>
  </div>
)
```

### Form Integration

```tsx
const [formData, setFormData] = useState({
  subscribe: false,
  terms: false,
  marketing: false,
})

return (
  <form className="space-y-6">
    <div className="space-y-4">
      <Switch
        value={formData.subscribe}
        onChange={(value) => setFormData((prev) => ({ ...prev, subscribe: value }))}
        size="small"
      >
        Subscribe to newsletter
      </Switch>

      <Switch
        value={formData.terms}
        onChange={(value) => setFormData((prev) => ({ ...prev, terms: value }))}
        variant="outline"
      >
        <Switch.Label>
          I agree to the{" "}
          <a
            href="/terms"
            className="text-blue-600 underline"
          >
            Terms of Service
          </a>
        </Switch.Label>
      </Switch>

      <Switch
        value={formData.marketing}
        onChange={(value) => setFormData((prev) => ({ ...prev, marketing: value }))}
      >
        Receive marketing communications
      </Switch>
    </div>

    <button
      type="submit"
      disabled={!formData.terms}
      className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
    >
      Submit
    </button>
  </form>
)
```

### Conditional Content

```tsx
const [showAdvanced, setShowAdvanced] = useState(false)

return (
  <div className="space-y-4">
    <Switch
      value={showAdvanced}
      onChange={setShowAdvanced}
    >
      Show advanced options
    </Switch>

    {showAdvanced && (
      <div className="ml-6 space-y-2 border-l-2 border-gray-200 p-4">
        <Switch
          value={false}
          onChange={() => {}}
        >
          Debug mode
        </Switch>
        <Switch
          value={false}
          onChange={() => {}}
        >
          Verbose logging
        </Switch>
        <Switch
          value={false}
          onChange={() => {}}
        >
          Developer tools
        </Switch>
      </div>
    )}
  </div>
)
```

## Notes

- This is a controlled component requiring both `value` and `onChange` props
- String children are automatically wrapped with `Switch.Label` for consistency
- The `label` prop is maintained for backward compatibility but `children` is preferred
- Animation duration is optimized at 0.1s for responsive feel
- All size calculations use CSS custom properties for maintainability
- Focus management works with both mouse and keyboard interactions
- The component announces state changes to screen readers for accessibility
