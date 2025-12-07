# DateInput

A sophisticated date input component with intelligent parsing, prediction, and real-time validation. Features natural language support, keyboard navigation, and seamless integration with calendar components.

## Import

```tsx
import { DateInput } from "@choiceform/design-system"
```

## Features

- Intelligent date parsing with natural language support (today, tomorrow, yesterday)
- Multiple format support (ISO, localized, custom date-fns formats)
- Keyboard navigation (arrow keys, shortcuts) and mouse drag interaction
- Real-time prediction and validation with smart date correction
- Internationalization support with multiple locales
- English month name recognition (jan, feb, march, etc.)
- Flexible input modes with customizable prefix icons
- Seamless integration with calendar components

## Usage

### Basic

```tsx
<DateInput placeholder="Enter date..." />
```

### With Value

```tsx
const [date, setDate] = useState<Date | null>(null)

<DateInput
  value={date}
  onChange={setDate}
  placeholder="Select a date"
/>
```

### Different Formats

```tsx
<DateInput format="yyyy-MM-dd" placeholder="2025-01-15" />
<DateInput format="MM/dd/yyyy" placeholder="01/15/2025" />
<DateInput format="dd.MM.yyyy" placeholder="15.01.2025" />
<DateInput format="yyyy年MM月dd日" placeholder="2025年01月15日" />
```

### With Localization

```tsx
import { zhCN, enUS, de, fr } from "date-fns/locale"

<DateInput
  locale={zhCN}
  format="yyyy年MM月dd日"
  placeholder="输入中文日期..."
/>

<DateInput
  locale={enUS}
  format="MM/dd/yyyy"
  placeholder="Enter English date..."
/>
```

### States

```tsx
<DateInput disabled placeholder="Disabled state" />
<DateInput readOnly value={new Date()} placeholder="Readonly state" />
<DateInput size="large" placeholder="Large size" />
<DateInput variant="dark" placeholder="Dark theme" />
```

### Custom Prefix Icon

```tsx
import { FieldTypeDateAndTime } from "@choiceform/icons-react"

<DateInput
  prefixElement={<FieldTypeDateAndTime className="text-accent-foreground" />}
  placeholder="Custom prefix"
/>

<DateInput
  prefixElement={null}
  placeholder="No prefix icon"
/>
```

### With Prediction

```tsx
<DateInput
  enablePrediction={true}
  placeholder="Try intelligent prediction..."
  format="yyyy-MM-dd"
/>
```

## Props

```ts
interface DateInputProps {
  /** Current date value */
  value?: Date | null

  /** Change handler for date selection */
  onChange?: (date: Date | null) => void

  /** Date format string (date-fns format) */
  format?: DateFormat

  /** Locale for internationalization */
  locale?: Locale | string

  /** Placeholder text */
  placeholder?: string

  /** Input size variant */
  size?: "default" | "large"

  /** Visual theme variant */
  variant?: "default" | "dark"

  /** Disabled state */
  disabled?: boolean

  /** Read-only state */
  readOnly?: boolean

  /** Enable intelligent prediction */
  enablePrediction?: boolean

  /** Custom prefix icon element */
  prefixElement?: React.ReactNode | null

  /** Focus event handler */
  onFocus?: () => void

  /** Enter key press handler */
  onEnterKeyDown?: () => void

  /** Additional CSS class names */
  className?: string

  /** Children components (typically TextField.Label) */
  children?: React.ReactNode
}
```

- Defaults:
  - `format`: `"yyyy-MM-dd"`
  - `locale`: `"en-US"`
  - `size`: `"default"`
  - `variant`: `"default"`
  - `enablePrediction`: `true`
  - `prefixElement`: Default calendar icon

- Accessibility:
  - Full keyboard navigation with arrow keys
  - Screen reader friendly with proper ARIA labels
  - Focus management and error handling
  - Semantic HTML input elements

## Keyboard Navigation

- **↑/↓**: Adjust date by 1 day
- **Shift + ↑/↓**: Adjust date by 1 week
- **Ctrl/Cmd + ↑/↓**: Adjust date by 1 month
- **Enter**: Confirm input and trigger onChange
- **Escape**: Cancel current input

## Mouse Interaction

- **Click and drag** calendar icon to adjust date
- **Hold Shift** while dragging to adjust by weeks
- **Hold Ctrl/Cmd** while dragging to adjust by months

## Natural Language Support

### English Shortcuts

- `t` or `today` → Current date
- `y` or `yesterday` → Previous day
- `tm` or `tomorrow` → Next day
- `w` or `this week` → Start of current week
- `m` or `this month` → Start of current month

### Chinese Shortcuts (with zhCN locale)

- `今天` → Current date
- `昨天` → Previous day
- `明天` → Next day
- `本周` → Start of current week
- `本月` → Start of current month

### English Month Names

- Full names: `january`, `february`, `march`, etc.
- Abbreviations: `jan`, `feb`, `mar`, etc.
- With dots: `jan.`, `feb.`, `mar.`, etc.
- Flexible patterns: `may 15`, `15 may`, `may 15, 2024`

## Smart Date Correction

Invalid dates are automatically corrected:

- `2025-04-31` → `2025-04-30` (April has 30 days)
- `2025-02-30` → `2025-02-28` (February has 28 days)
- `2024-02-30` → `2024-02-29` (Leap year February)
- `2025-13-15` → `2025-12-15` (No 13th month)
- `2025-06-00` → `2025-06-01` (No 0th day)

## Format Examples

| Format           | Example Output   | Description         |
| ---------------- | ---------------- | ------------------- |
| `yyyy-MM-dd`     | 2025-01-15       | ISO format          |
| `MM/dd/yyyy`     | 01/15/2025       | US format           |
| `dd.MM.yyyy`     | 15.01.2025       | European format     |
| `yyyy年MM月dd日` | 2025年01月15日   | Chinese format      |
| `MMMM dd, yyyy`  | January 15, 2025 | Long English format |
| `MMM dd, yy`     | Jan 15, 25       | Short format        |
| `M/d/yy`         | 1/15/25          | Compact format      |

## Best Practices

- Choose appropriate date formats for your target audience
- Provide clear placeholder text to guide user input
- Use consistent date formats across your application
- Test with various locales if supporting international users
- Enable prediction for better user experience
- Consider combining with calendar popovers for enhanced functionality

## Integration Example

```tsx
import { MonthCalendar } from "@choiceform/design-system"
import { Popover } from "@choiceform/design-system"
import { useState } from "react"

function DateSelector() {
  const [date, setDate] = useState<Date | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <div ref={triggerRef}>
        <DateInput
          value={date}
          onChange={setDate}
          onFocus={() => setIsOpen(true)}
          placeholder="Select date"
        />
      </div>

      <Popover
        triggerRef={triggerRef}
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <Popover.Content>
          <MonthCalendar
            value={date}
            onChange={(newDate) => {
              setDate(newDate)
              setIsOpen(false)
            }}
          />
        </Popover.Content>
      </Popover>
    </>
  )
}
```

## Notes

- Built on TextField component for consistent styling
- Supports all date-fns format patterns for maximum flexibility
- Intelligent parsing handles various input formats automatically
- Prediction system provides real-time feedback and suggestions
- Drag interaction works on the prefix icon element
- Natural language support varies by locale configuration
- Smart correction ensures valid dates without error prompts
