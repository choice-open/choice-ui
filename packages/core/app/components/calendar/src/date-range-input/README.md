# DateRangeInput

A sophisticated component for selecting date ranges with intelligent synchronization, boundary validation, and comprehensive internationalization support. Features dual input fields with automatic range preservation and smart date adjustment.

## Import

```tsx
import { DateRangeInput } from "@choiceform/design-system"
```

## Features

- Dual date input fields with automatic range synchronization
- Smart range preservation when adjusting start dates
- Boundary validation with automatic start date adjustment
- Comprehensive internationalization support
- Multiple date format options and locale-aware formatting
- Flexible sizing and theming variants
- Disabled state support for individual inputs
- Real-time range calculation and display

## Usage

### Basic

```tsx
const [startValue, setStartValue] = useState<Date | null>(null)
const [endValue, setEndValue] = useState<Date | null>(null)

<DateRangeInput
  startValue={startValue}
  endValue={endValue}
  onStartChange={setStartValue}
  onEndChange={setEndValue}
  startPlaceholder="Start Date"
  endPlaceholder="End Date"
/>
```

### With Range Synchronization

```tsx
const [startValue, setStartValue] = useState<Date | null>(new Date())
const [endValue, setEndValue] = useState<Date | null>(addDays(new Date(), 7))

const handleStartChange = (newStart: Date | null) => {
  if (newStart) {
    // Calculate current range length in milliseconds
    const currentRange =
      startValue && endValue ? endValue.getTime() - startValue.getTime() : 7 * 24 * 60 * 60 * 1000 // Default 7 days

    // Maintain range length
    const newEnd = new Date(newStart.getTime() + currentRange)
    setStartValue(newStart)
    setEndValue(newEnd)
  } else {
    setStartValue(newStart)
  }
}

const handleEndChange = (newEnd: Date | null) => {
  if (newEnd && startValue && newEnd <= startValue) {
    // Push start date when end <= start
    setStartValue(newEnd)
  }
  setEndValue(newEnd)
}

;<DateRangeInput
  startValue={startValue}
  endValue={endValue}
  onStartChange={handleStartChange}
  onEndChange={handleEndChange}
/>
```

### Different Formats

```tsx
// ISO format
<DateRangeInput format="yyyy-MM-dd" />

// American format
<DateRangeInput format="MM/dd/yyyy" />

// Chinese format
<DateRangeInput format="yyyy年MM月dd日" />

// European format
<DateRangeInput format="dd.MM.yyyy" />
```

### With Localization

```tsx
import { zhCN, enUS, ja, ko } from "date-fns/locale"

<DateRangeInput
  locale={zhCN}
  format="yyyy年MM月dd日"
  startPlaceholder="开始日期"
  endPlaceholder="结束日期"
/>

<DateRangeInput
  locale={enUS}
  format="MM/dd/yyyy"
  startPlaceholder="Start Date"
  endPlaceholder="End Date"
/>
```

### Size Variants

```tsx
<DateRangeInput size="default" />
<DateRangeInput size="large" />
```

### Theme Variants

```tsx
<DateRangeInput variant="default" />
<DateRangeInput variant="dark" />
```

### Disabled States

```tsx
// Disable start input only
<DateRangeInput
  startDisabled={true}
  startValue={new Date()}
  endValue={addDays(new Date(), 7)}
/>

// Disable end input only
<DateRangeInput
  endDisabled={true}
  startValue={new Date()}
  endValue={addDays(new Date(), 7)}
/>

// Disable both inputs
<DateRangeInput
  startDisabled={true}
  endDisabled={true}
  startValue={new Date()}
  endValue={addDays(new Date(), 7)}
/>
```

## Props

```ts
interface DateRangeInputProps {
  /** Start date value */
  startValue?: Date | null

  /** End date value */
  endValue?: Date | null

  /** Start date change handler */
  onStartChange?: (date: Date | null) => void

  /** End date change handler */
  onEndChange?: (date: Date | null) => void

  /** Start input focus handler */
  onStartFocus?: () => void

  /** End input focus handler */
  onEndFocus?: () => void

  /** Enter key press handler */
  onEnterKeyDown?: () => void

  /** Start date placeholder text */
  startPlaceholder?: string

  /** End date placeholder text */
  endPlaceholder?: string

  /** Date format string (date-fns format) */
  format?: DateFormat

  /** Locale for internationalization */
  locale?: Locale | string

  /** Component size variant */
  size?: "default" | "large"

  /** Visual theme variant */
  variant?: "default" | "dark"

  /** Disable start date input */
  startDisabled?: boolean

  /** Disable end date input */
  endDisabled?: boolean

  /** Additional CSS class names */
  className?: string
}
```

- Defaults:
  - `format`: `"yyyy-MM-dd"`
  - `locale`: `"en-US"`
  - `size`: `"default"`
  - `variant`: `"default"`
  - `startPlaceholder`: `"Start Date"`
  - `endPlaceholder`: `"End Date"`
  - `startDisabled`, `endDisabled`: `false`

- Accessibility:
  - Full keyboard navigation between input fields
  - Screen reader friendly with proper ARIA labels
  - Semantic HTML structure for optimal accessibility
  - Clear focus indicators and validation feedback

## Range Synchronization Behavior

### Start Date Changes

When the start date is modified, the component automatically adjusts the end date to maintain the original range length:

- Calculate the current range length in milliseconds
- Apply the same range to the new start date
- Update both start and end dates simultaneously

### End Date Changes

When the end date is modified with boundary validation:

- If end date ≤ start date, push the start date to the end position
- This prevents invalid ranges and maintains logical date ordering
- End date changes normally when greater than start date

### Range Preservation

- First set your desired range by adjusting the end date
- Subsequent start date changes will maintain this range length
- Provides consistent user experience for date range selection

## Format Examples

| Format           | Example Output                   | Description     |
| ---------------- | -------------------------------- | --------------- |
| `yyyy-MM-dd`     | 2025-01-15 to 2025-01-22         | ISO format      |
| `MM/dd/yyyy`     | 01/15/2025 to 01/22/2025         | US format       |
| `dd.MM.yyyy`     | 15.01.2025 to 22.01.2025         | European format |
| `yyyy年MM月dd日` | 2025年01月15日 to 2025年01月22日 | Chinese format  |
| `yyyy/MM/dd`     | 2025/01/15 to 2025/01/22         | Japanese format |
| `yyyy.MM.dd`     | 2025.01.15 to 2025.01.22         | Korean format   |

## Common Use Cases

### Holiday Planning

```tsx
<DateRangeInput
  startValue={addDays(new Date(), 30)}
  endValue={addDays(new Date(), 37)}
  startPlaceholder="Holiday Start"
  endPlaceholder="Holiday End"
  format="yyyy年MM月dd日"
  locale={zhCN}
/>
```

### Data Analysis Period

```tsx
<DateRangeInput
  startValue={subDays(new Date(), 30)}
  endValue={new Date()}
  startPlaceholder="Start Period"
  endPlaceholder="End Period"
  format="yyyy-MM-dd"
  locale={enUS}
/>
```

### Event Scheduling

```tsx
<DateRangeInput
  startValue={addDays(new Date(), 15)}
  endValue={addDays(new Date(), 17)}
  startPlaceholder="活動開始"
  endPlaceholder="活動終了"
  format="yyyy/MM/dd"
  locale={ja}
/>
```

## Edge Cases

### Same Date Range

When both dates are the same, the component displays as "1 day":

```tsx
<DateRangeInput
  startValue={new Date()}
  endValue={new Date()}
/>
```

### Reverse Date Range

When end date is before start date, the component shows the absolute difference:

```tsx
<DateRangeInput
  startValue={addDays(new Date(), 5)}
  endValue={new Date()}
/>
```

### Cross-Year Range

Properly calculates ranges spanning multiple years:

```tsx
<DateRangeInput
  startValue={new Date("2024-12-25")}
  endValue={new Date("2025-01-05")}
  format="yyyy年MM月dd日"
/>
```

## Integration with Panel

```tsx
import { Panel } from "@choiceform/design-system"
;<Panel.Row type="two-input-two-icon">
  <DateRangeInput
    startValue={startValue}
    endValue={endValue}
    onStartChange={setStartValue}
    onEndChange={setEndValue}
    startPlaceholder="Start Date"
    endPlaceholder="End Date"
  />
</Panel.Row>
```

## Best Practices

- **Range Synchronization**: Use intelligent range synchronization for better user experience
- **Clear Placeholders**: Provide descriptive placeholder text for start and end dates
- **Consistent Formats**: Use the same date format across your application
- **Locale Support**: Test with various locales for international compatibility
- **Boundary Validation**: Let the component handle invalid range scenarios automatically
- **Panel Integration**: Use with Panel.Row for consistent layout and styling
- **State Management**: Handle both start and end date changes in your parent component
- **Accessibility**: Provide proper labels and ARIA attributes for screen readers

## Examples

### Complete Implementation

```tsx
import { DateRangeInput } from "@choiceform/design-system"
import { Panel } from "@choiceform/design-system"
import { addDays } from "date-fns"
import { zhCN } from "date-fns/locale"
import { useState } from "react"

function DateRangeSelector() {
  const [startValue, setStartValue] = useState<Date | null>(new Date())
  const [endValue, setEndValue] = useState<Date | null>(addDays(new Date(), 7))

  const handleStartChange = (newStart: Date | null) => {
    if (newStart && startValue && endValue) {
      // Maintain range length
      const currentRange = endValue.getTime() - startValue.getTime()
      const newEnd = new Date(newStart.getTime() + currentRange)
      setStartValue(newStart)
      setEndValue(newEnd)
    } else {
      setStartValue(newStart)
    }
  }

  const handleEndChange = (newEnd: Date | null) => {
    if (newEnd && startValue && newEnd <= startValue) {
      setStartValue(newEnd)
    }
    setEndValue(newEnd)
  }

  return (
    <Panel.Row type="two-input-two-icon">
      <DateRangeInput
        startValue={startValue}
        endValue={endValue}
        onStartChange={handleStartChange}
        onEndChange={handleEndChange}
        startPlaceholder="开始日期"
        endPlaceholder="结束日期"
        format="yyyy年MM月dd日"
        locale={zhCN}
      />
    </Panel.Row>
  )
}
```

## Notes

- Built on DateInput components for consistent behavior and styling
- Supports all DateInput features including natural language parsing
- Range synchronization is optional - implement based on your use case needs
- Component automatically handles invalid date ranges with smart correction
- Real-time range calculation provides immediate feedback to users
- Designed to work seamlessly with calendar popovers and date pickers
