# TimeInput

A sophisticated time input component with intelligent parsing, smart completion, and keyboard navigation. Features multiple time formats, time range validation, and seamless integration with time picker components.

## Import

```tsx
import { TimeInput } from "@choiceform/design-system"
```

## Features

- Intelligent time parsing with smart completion (9 → 09:00, 930 → 09:30)
- Support for both 12-hour and 24-hour time formats
- Time range validation with min/max time constraints
- Keyboard navigation (arrow keys, shortcuts) and mouse drag interaction
- Customizable step intervals for different precision levels
- Natural language support (2pm, 9am, 下午2点)
- Comprehensive internationalization support
- Flexible input modes with customizable prefix icons
- Seamless integration with TimeCalendar component

## Usage

### Basic Time Input

```tsx
const [selectedTime, setSelectedTime] = useState<Date | null>(null)

<TimeInput
  value={selectedTime}
  onChange={setSelectedTime}
  placeholder="Enter time"
/>
```

### Time Formats

```tsx
// 24-hour format (default)
<TimeInput
  format="HH:mm"
  placeholder="14:30"
/>

// 12-hour format with AM/PM
<TimeInput
  format="h:mm a"
  placeholder="2:30 PM"
  locale={enUS}
/>

// With seconds
<TimeInput
  format="HH:mm:ss"
  placeholder="14:30:45"
/>
```

### Time Range Validation

```tsx
import { createTimeToday } from "@choiceform/design-system"
;<TimeInput
  value={workTime}
  onChange={setWorkTime}
  minTime={createTimeToday(9, 0)} // 09:00
  maxTime={createTimeToday(18, 0)} // 18:00
  placeholder="Work hours only"
/>
```

### Custom Step Intervals

```tsx
<TimeInput
  step={5} // 5-minute increments for arrow keys
  shiftStep={30} // 30-minute increments for Shift+arrow keys
  altStep={60} // 60-minute increments for Alt+arrow keys
  value={selectedTime}
  onChange={setSelectedTime}
/>
```

### Different Sizes

```tsx
<TimeInput size="default" />
<TimeInput size="large" />
```

### Theme Variants

```tsx
<TimeInput variant="default" />
<TimeInput variant="dark" />
```

### States

```tsx
<TimeInput disabled value={createTimeToday(14, 30)} />
<TimeInput readOnly value={createTimeToday(14, 30)} />
```

### Custom Prefix Icon

```tsx
import { ActionWaitForSomeTime } from "@choiceform/icons-react"

<TimeInput
  prefixElement={<ActionWaitForSomeTime className="text-accent-foreground" />}
  placeholder="Custom prefix"
/>

<TimeInput
  prefixElement={null}
  placeholder="No prefix icon"
/>
```

## Props

```ts
interface TimeInputProps {
  /** Current time value */
  value?: Date | null

  /** Default time value (uncontrolled mode) */
  defaultValue?: Date | null

  /** Change handler for time selection */
  onChange?: (time: Date | null) => void

  /** Time format string (date-fns format) */
  format?: TimeFormat

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

  /** Minimum selectable time */
  minTime?: Date | null

  /** Maximum selectable time */
  maxTime?: Date | null

  /** Step interval in minutes for arrow keys */
  step?: number

  /** Step interval for Shift+arrow keys */
  shiftStep?: number

  /** Step interval for Alt+arrow keys */
  altStep?: number

  /** Custom prefix icon element */
  prefixElement?: React.ReactNode | null

  /** Focus event handler */
  onFocus?: () => void

  /** Blur event handler */
  onBlur?: () => void

  /** Enter key press handler */
  onEnterKeyDown?: () => void

  /** Additional CSS class names */
  className?: string

  /** Children components (typically TextField.Label) */
  children?: React.ReactNode
}
```

- Defaults:
  - `format`: `"HH:mm"`
  - `locale`: `"en-US"`
  - `size`: `"default"`
  - `variant`: `"default"`
  - `step`: `1` (1 minute)
  - `shiftStep`: `15` (15 minutes)
  - `altStep`: `60` (60 minutes)
  - `prefixElement`: Default clock icon

- Accessibility:
  - Full keyboard navigation with arrow keys
  - Screen reader friendly with proper ARIA labels
  - Focus management and error handling
  - Semantic HTML input elements

## Keyboard Navigation

- **↑/↓**: Adjust time by `step` minutes (default: 1 minute)
- **Shift + ↑/↓**: Adjust time by `shiftStep` minutes (default: 15 minutes)
- **Alt + ↑/↓**: Adjust time by `altStep` minutes (default: 60 minutes)
- **Enter**: Confirm input and trigger onChange
- **Escape**: Cancel current input

## Mouse Interaction

- **Click and drag** clock icon to adjust time
- **Hold Shift** while dragging to adjust by `shiftStep` minutes
- **Hold Ctrl/Cmd** while dragging to adjust by `altStep` minutes

## Smart Completion

The component intelligently parses various time input formats:

### Numeric Patterns

- `9` → `09:00`
- `930` → `09:30`
- `1430` → `14:30`
- `2359` → `23:59`

### 12-Hour Format with AM/PM

- `2pm` → `14:00`
- `9am` → `09:00`
- `11:30 pm` → `23:30`
- `12 am` → `00:00`

### Natural Language (with locale support)

- `下午2点` → `14:00` (Chinese)
- `午後2時` → `14:00` (Japanese)

### Flexible Separators

- `14:30` → `14:30`
- `14.30` → `14:30`
- `14 30` → `14:30`

## Time Range Validation

### Setting Time Ranges

```tsx
import { createTimeToday } from "@choiceform/design-system"

// Work hours: 9 AM to 6 PM
<TimeInput
  minTime={createTimeToday(9, 0)}
  maxTime={createTimeToday(18, 0)}
  value={workTime}
  onChange={setWorkTime}
/>

// Afternoon only: 12 PM to 11:59 PM
<TimeInput
  minTime={createTimeToday(12, 0)}
  maxTime={createTimeToday(23, 59)}
  value={afternoonTime}
  onChange={setAfternoonTime}
/>
```

### Validation Behavior

- Times outside the range are automatically adjusted to the nearest valid time
- Visual feedback indicates when input is adjusted
- Keyboard navigation respects the time range boundaries

## Format Examples

| Format      | Example Output | Description                  |
| ----------- | -------------- | ---------------------------- |
| `HH:mm`     | 14:30          | 24-hour format               |
| `H:mm`      | 14:30          | 24-hour without leading zero |
| `h:mm a`    | 2:30 PM        | 12-hour with AM/PM           |
| `hh:mm a`   | 02:30 PM       | 12-hour with leading zero    |
| `HH:mm:ss`  | 14:30:45       | 24-hour with seconds         |
| `h:mm:ss a` | 2:30:45 PM     | 12-hour with seconds         |

## Custom Step Configuration

### Basic Steps

```tsx
// Fine-grained control (1-minute steps)
<TimeInput
  step={1}
  shiftStep={15}
  altStep={60}
/>

// Coarse control (15-minute steps)
<TimeInput
  step={15}
  shiftStep={30}
  altStep={60}
/>
```

### Use Case Examples

```tsx
// Appointment scheduling (15-minute increments)
<TimeInput
  step={15}
  shiftStep={60}
  placeholder="Schedule appointment"
/>

// Precise timing (5-minute increments)
<TimeInput
  step={5}
  shiftStep={30}
  placeholder="Precise timing"
/>
```

## Integration with TimeCalendar

```tsx
import { TimeCalendar } from "@choiceform/design-system"
import { Popover } from "@choiceform/design-system"
import { useState, useRef } from "react"

function TimePicker() {
  const [selectedTime, setSelectedTime] = useState<Date | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <div ref={triggerRef}>
        <TimeInput
          value={selectedTime}
          onChange={setSelectedTime}
          onFocus={() => setIsOpen(true)}
          placeholder="Select time"
        />
      </div>

      <Popover
        triggerRef={triggerRef}
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <Popover.Content>
          <TimeCalendar
            value={selectedTime}
            onChange={(time) => {
              setSelectedTime(time)
              setIsOpen(false)
            }}
            format="HH:mm"
            step={15}
            className="h-64"
          />
        </Popover.Content>
      </Popover>
    </>
  )
}
```

## Common Use Cases

### Business Hours Form

```tsx
function BusinessHoursForm() {
  const [openTime, setOpenTime] = useState(createTimeToday(9, 0))
  const [closeTime, setCloseTime] = useState(createTimeToday(17, 0))

  return (
    <form className="space-y-4">
      <div>
        <label>Opening Time</label>
        <TimeInput
          value={openTime}
          onChange={setOpenTime}
          format="h:mm a"
          step={30}
          maxTime={closeTime} // Can't open after closing time
        />
      </div>

      <div>
        <label>Closing Time</label>
        <TimeInput
          value={closeTime}
          onChange={setCloseTime}
          format="h:mm a"
          step={30}
          minTime={openTime} // Can't close before opening time
        />
      </div>
    </form>
  )
}
```

### Appointment Scheduler

```tsx
function AppointmentScheduler() {
  const [appointmentTime, setAppointmentTime] = useState<Date | null>(null)

  return (
    <div>
      <label>Appointment Time</label>
      <TimeInput
        value={appointmentTime}
        onChange={setAppointmentTime}
        format="h:mm a"
        step={15} // 15-minute slots
        minTime={createTimeToday(8, 0)} // 8 AM earliest
        maxTime={createTimeToday(18, 0)} // 6 PM latest
        placeholder="Select appointment time"
      />
    </div>
  )
}
```

### Time Range Selector

```tsx
function MeetingTimeSelector() {
  const [startTime, setStartTime] = useState(createTimeToday(10, 0))
  const [endTime, setEndTime] = useState(createTimeToday(11, 0))

  const handleStartTimeChange = (newStart: Date | null) => {
    if (newStart && endTime && newStart >= endTime) {
      // Auto-adjust end time to be 1 hour after start
      const newEnd = new Date(newStart.getTime() + 60 * 60 * 1000)
      setEndTime(newEnd)
    }
    setStartTime(newStart)
  }

  return (
    <div className="flex gap-4">
      <div>
        <label>Start Time</label>
        <TimeInput
          value={startTime}
          onChange={handleStartTimeChange}
          format="HH:mm"
          step={15}
          maxTime={endTime}
        />
      </div>

      <div>
        <label>End Time</label>
        <TimeInput
          value={endTime}
          onChange={setEndTime}
          format="HH:mm"
          step={15}
          minTime={startTime}
        />
      </div>
    </div>
  )
}
```

### Multi-Language Time Input

```tsx
function MultiLanguageTimeInput() {
  const [locale, setLocale] = useState("en-US")
  const [time, setTime] = useState<Date | null>(null)

  const localeOptions = [
    { code: "en-US", name: "English", format: "h:mm a" },
    { code: "zh-CN", name: "中文", format: "HH:mm" },
    { code: "ja-JP", name: "日本語", format: "HH:mm" },
  ]

  const currentLocale = localeOptions.find((opt) => opt.code === locale)

  return (
    <div className="space-y-4">
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value)}
      >
        {localeOptions.map((option) => (
          <option
            key={option.code}
            value={option.code}
          >
            {option.name}
          </option>
        ))}
      </select>

      <TimeInput
        value={time}
        onChange={setTime}
        locale={locale}
        format={currentLocale?.format}
        placeholder="Enter time"
      />
    </div>
  )
}
```

## Utility Functions

### Creating Time Values

```tsx
import { createTimeToday } from "@choiceform/design-system"

// Create specific times for today
const morning = createTimeToday(9, 30) // 9:30 AM today
const afternoon = createTimeToday(14, 45) // 2:45 PM today
const evening = createTimeToday(20, 0) // 8:00 PM today
```

### Time Validation

```tsx
import { isTimeInRange } from "@choiceform/design-system"

const isValidWorkTime = isTimeInRange(
  selectedTime,
  createTimeToday(9, 0), // min
  createTimeToday(17, 0), // max
)
```

## Best Practices

- **Format Consistency**: Use consistent time formats throughout your application
- **Step Intervals**: Choose appropriate step intervals based on use case precision
- **Range Validation**: Implement time range validation for business rules
- **Smart Completion**: Let users enter times in their preferred format
- **Accessibility**: Ensure proper labeling and keyboard navigation
- **Locale Support**: Test with different locales for international applications
- **Default Values**: Provide reasonable default times for better user experience
- **Integration**: Combine with TimeCalendar for comprehensive time selection

## Error Handling

### Invalid Time Input

- Automatically corrects invalid times (e.g., 25:70 → 23:59)
- Provides visual feedback for corrections
- Maintains cursor position when possible

### Range Violations

- Adjusts times that exceed min/max boundaries
- Shows validation feedback
- Prevents submission of invalid ranges

## Performance Considerations

- Efficient parsing algorithms for various input formats
- Debounced input processing for smooth typing experience
- Minimal re-renders with optimized state management
- Smart completion without blocking user input

## Integration Examples

### With Form Libraries

```tsx
import { useForm } from "react-hook-form"

function TimeForm() {
  const { register, watch, setValue } = useForm()
  const selectedTime = watch("meetingTime")

  return (
    <form>
      <TimeInput
        {...register("meetingTime")}
        value={selectedTime}
        onChange={(time) => setValue("meetingTime", time)}
        format="h:mm a"
        step={15}
      />
    </form>
  )
}
```

### With Validation Libraries

```tsx
import { z } from "zod"

const timeSchema = z
  .object({
    startTime: z.date().nullable(),
    endTime: z.date().nullable(),
  })
  .refine((data) => !data.startTime || !data.endTime || data.startTime < data.endTime, {
    message: "End time must be after start time",
  })
```

## Notes

- Built on TextField component for consistent styling and behavior
- Time values are always `Date` objects representing today's date with selected time
- Smart completion works with various input formats and locales
- Drag interaction provides alternative input method for users
- Component handles both controlled and uncontrolled usage patterns
- Range validation prevents invalid time selections automatically
- All keyboard shortcuts respect the configured step intervals
