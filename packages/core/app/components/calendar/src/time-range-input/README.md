# TimeRangeInput

A sophisticated component for selecting time ranges with intelligent synchronization, cross-midnight support, and comprehensive validation. Features dual time input fields with automatic range preservation and smart time adjustment for complex scheduling scenarios.

## Import

```tsx
import { TimeRangeInput } from "@choiceform/design-system"
```

## Features

- Dual time input fields with automatic range synchronization
- Smart range preservation when adjusting start times
- Cross-midnight time range support (e.g., 22:00 to 06:00)
- Boundary validation with automatic start time adjustment
- Multiple time format support (24-hour, 12-hour, with seconds)
- Comprehensive internationalization support
- Flexible sizing and theming variants
- Duration calculation and display
- Real-time range validation and feedback
- Keyboard navigation and accessibility support

## Usage

### Basic Time Range Selection

```tsx
const [startTime, setStartTime] = useState<Date | null>(null)
const [endTime, setEndTime] = useState<Date | null>(null)

<TimeRangeInput
  startValue={startTime}
  endValue={endTime}
  onStartChange={setStartTime}
  onEndChange={setEndTime}
  startPlaceholder="Start Time"
  endPlaceholder="End Time"
/>
```

### With Range Synchronization

```tsx
const [startTime, setStartTime] = useState(timeStringToDate("09:00"))
const [endTime, setEndTime] = useState(timeStringToDate("17:00"))

const handleStartChange = (newStart: Date | null) => {
  if (newStart) {
    // Calculate current range length in milliseconds
    const currentRange =
      startTime && endTime ? endTime.getTime() - startTime.getTime() : 8 * 60 * 60 * 1000 // Default 8 hours

    // Maintain range length
    const newEnd = new Date(newStart.getTime() + currentRange)
    setStartTime(newStart)
    setEndTime(newEnd)
  } else {
    setStartTime(newStart)
  }
}

const handleEndChange = (newEnd: Date | null) => {
  if (newEnd && startTime && newEnd <= startTime) {
    // Push start time when end <= start
    setStartTime(newEnd)
  }
  setEndTime(newEnd)
}

;<TimeRangeInput
  startValue={startTime}
  endValue={endTime}
  onStartChange={handleStartChange}
  onEndChange={handleEndChange}
/>
```

### Cross-Midnight Time Ranges

```tsx
// Night shift: 22:00 to 06:00 (next day)
<TimeRangeInput
  startValue={timeStringToDate("22:00")}
  endValue={timeStringToDate("06:00")}
  startPlaceholder="Start Time"
  endPlaceholder="End Time"
  format="HH:mm"
/>
```

### Different Time Formats

```tsx
// 24-hour format
<TimeRangeInput
  format="HH:mm"
  startPlaceholder="09:00"
  endPlaceholder="17:00"
/>

// 12-hour format with AM/PM
<TimeRangeInput
  format="h:mm a"
  locale={enUS}
  startPlaceholder="9:00 AM"
  endPlaceholder="5:00 PM"
/>

// With seconds
<TimeRangeInput
  format="HH:mm:ss"
  startPlaceholder="09:00:00"
  endPlaceholder="17:00:00"
/>
```

### Size Variants

```tsx
<TimeRangeInput size="default" />
<TimeRangeInput size="large" />
```

### Theme Variants

```tsx
<TimeRangeInput variant="default" />
<TimeRangeInput variant="dark" />
```

### With Localization

```tsx
import { zhCN, enUS, ja } from "date-fns/locale"

// Chinese locale
<TimeRangeInput
  locale={zhCN}
  startPlaceholder="开始时间"
  endPlaceholder="结束时间"
  format="HH:mm"
/>

// Japanese locale
<TimeRangeInput
  locale={ja}
  startPlaceholder="開始時間"
  endPlaceholder="終了時間"
  format="HH:mm"
/>
```

## Props

```ts
interface TimeRangeInputProps {
  /** Start time value */
  startValue?: Date | null

  /** End time value */
  endValue?: Date | null

  /** Start time change handler */
  onStartChange?: (time: Date | null) => void

  /** End time change handler */
  onEndChange?: (time: Date | null) => void

  /** Start input focus handler */
  onStartFocus?: () => void

  /** End input focus handler */
  onEndFocus?: () => void

  /** Enter key press handler */
  onEnterKeyDown?: () => void

  /** Start time placeholder text */
  startPlaceholder?: string

  /** End time placeholder text */
  endPlaceholder?: string

  /** Time format string (date-fns format) */
  format?: TimeFormat

  /** Locale for internationalization */
  locale?: Locale | string

  /** Component size variant */
  size?: "default" | "large"

  /** Visual theme variant */
  variant?: "default" | "dark"

  /** Step interval in minutes */
  step?: number

  /** Additional CSS class names */
  className?: string
}
```

- Defaults:
  - `format`: `"HH:mm"`
  - `locale`: `"en-US"`
  - `size`: `"default"`
  - `variant`: `"default"`
  - `step`: `15`
  - `startPlaceholder`: `"Start Time"`
  - `endPlaceholder`: `"End Time"`

- Accessibility:
  - Full keyboard navigation between input fields
  - Screen reader friendly with proper ARIA labels
  - Clear focus indicators and validation feedback
  - Semantic HTML structure for optimal time input

## Range Synchronization Behavior

### Start Time Changes

When the start time is modified, the component can automatically adjust the end time to maintain the original range length:

- Calculate the current range duration in milliseconds
- Apply the same duration to the new start time
- Update both start and end times simultaneously

### End Time Changes

When the end time is modified with boundary validation:

- If end time ≤ start time, push the start time to the end position
- This prevents invalid ranges and maintains logical time ordering
- End time changes normally when greater than start time

### Cross-Midnight Handling

- Supports time ranges that span across midnight (e.g., 22:00 to 06:00)
- Properly calculates duration for overnight shifts
- Handles date boundaries seamlessly

## Format Examples

| Format      | Example Output           | Description                  |
| ----------- | ------------------------ | ---------------------------- |
| `HH:mm`     | 09:00 to 17:00           | 24-hour format               |
| `H:mm`      | 9:00 to 17:00            | 24-hour without leading zero |
| `h:mm a`    | 9:00 AM to 5:00 PM       | 12-hour with AM/PM           |
| `hh:mm a`   | 09:00 AM to 05:00 PM     | 12-hour with leading zero    |
| `HH:mm:ss`  | 09:00:00 to 17:00:00     | 24-hour with seconds         |
| `h:mm:ss a` | 9:00:00 AM to 5:00:00 PM | 12-hour with seconds         |

## Common Use Cases

### Work Schedule

```tsx
function WorkScheduleForm() {
  const [workStart, setWorkStart] = useState(timeStringToDate("09:00"))
  const [workEnd, setWorkEnd] = useState(timeStringToDate("18:00"))

  return (
    <div>
      <label>Work Hours</label>
      <TimeRangeInput
        startValue={workStart}
        endValue={workEnd}
        onStartChange={setWorkStart}
        onEndChange={setWorkEnd}
        format="HH:mm"
        startPlaceholder="Start Time"
        endPlaceholder="End Time"
      />
    </div>
  )
}
```

### Shift Management

```tsx
function ShiftScheduler() {
  const [shifts, setShifts] = useState([
    {
      name: "Morning Shift",
      start: timeStringToDate("06:00"),
      end: timeStringToDate("14:00"),
    },
    {
      name: "Evening Shift",
      start: timeStringToDate("14:00"),
      end: timeStringToDate("22:00"),
    },
    {
      name: "Night Shift",
      start: timeStringToDate("22:00"),
      end: timeStringToDate("06:00"), // Next day
    },
  ])

  return (
    <div className="space-y-4">
      {shifts.map((shift, index) => (
        <div key={shift.name}>
          <label>{shift.name}</label>
          <TimeRangeInput
            startValue={shift.start}
            endValue={shift.end}
            onStartChange={(start) => {
              const newShifts = [...shifts]
              newShifts[index].start = start
              setShifts(newShifts)
            }}
            onEndChange={(end) => {
              const newShifts = [...shifts]
              newShifts[index].end = end
              setShifts(newShifts)
            }}
            format="HH:mm"
          />
        </div>
      ))}
    </div>
  )
}
```

### Business Hours

```tsx
function BusinessHoursSettings() {
  const [businessHours, setBusinessHours] = useState({
    monday: { start: timeStringToDate("09:00"), end: timeStringToDate("17:00") },
    tuesday: { start: timeStringToDate("09:00"), end: timeStringToDate("17:00") },
    // ... other days
  })

  return (
    <div className="space-y-4">
      {Object.entries(businessHours).map(([day, hours]) => (
        <div
          key={day}
          className="flex items-center gap-4"
        >
          <label className="w-20 capitalize">{day}</label>
          <TimeRangeInput
            startValue={hours.start}
            endValue={hours.end}
            onStartChange={(start) =>
              setBusinessHours((prev) => ({
                ...prev,
                [day]: { ...prev[day], start },
              }))
            }
            onEndChange={(end) =>
              setBusinessHours((prev) => ({
                ...prev,
                [day]: { ...prev[day], end },
              }))
            }
            format="h:mm a"
            size="default"
          />
        </div>
      ))}
    </div>
  )
}
```

### Event Planning

```tsx
function EventTimeSelector() {
  const [eventStart, setEventStart] = useState<Date | null>(null)
  const [eventEnd, setEventEnd] = useState<Date | null>(null)

  // Auto-adjust end time to be at least 1 hour after start
  const handleStartChange = (newStart: Date | null) => {
    if (newStart && (!eventEnd || newStart >= eventEnd)) {
      const newEnd = new Date(newStart.getTime() + 60 * 60 * 1000) // +1 hour
      setEventEnd(newEnd)
    }
    setEventStart(newStart)
  }

  return (
    <div>
      <label>Event Time</label>
      <TimeRangeInput
        startValue={eventStart}
        endValue={eventEnd}
        onStartChange={handleStartChange}
        onEndChange={setEventEnd}
        format="h:mm a"
        startPlaceholder="Start Time"
        endPlaceholder="End Time"
      />

      {eventStart && eventEnd && (
        <div className="text-body-small mt-2 text-gray-600">
          Duration:{" "}
          {Math.round(((eventEnd.getTime() - eventStart.getTime()) / (60 * 60 * 1000)) * 10) / 10}{" "}
          hours
        </div>
      )}
    </div>
  )
}
```

### Appointment Booking

```tsx
function AppointmentSlots() {
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null)

  const availableSlots = [
    { start: timeStringToDate("09:00"), end: timeStringToDate("10:00") },
    { start: timeStringToDate("10:30"), end: timeStringToDate("11:30") },
    { start: timeStringToDate("14:00"), end: timeStringToDate("15:00") },
    { start: timeStringToDate("15:30"), end: timeStringToDate("16:30") },
  ]

  return (
    <div className="space-y-4">
      <h3>Available Appointment Slots</h3>
      {availableSlots.map((slot, index) => (
        <div
          key={index}
          className="cursor-pointer rounded border p-2 hover:bg-gray-50"
          onClick={() => setSelectedSlot(slot)}
        >
          <TimeRangeInput
            startValue={slot.start}
            endValue={slot.end}
            onStartChange={() => {}} // Read-only
            onEndChange={() => {}} // Read-only
            format="h:mm a"
            readOnly
          />
        </div>
      ))}
    </div>
  )
}
```

## Duration Calculation

The component can calculate and display duration between start and end times:

```tsx
function calculateDuration(start: Date | null, end: Date | null): string {
  if (!start || !end) return ""

  let durationMs = end.getTime() - start.getTime()

  // Handle cross-midnight cases
  if (durationMs < 0) {
    durationMs += 24 * 60 * 60 * 1000 // Add 24 hours
  }

  const hours = Math.floor(durationMs / (60 * 60 * 1000))
  const minutes = Math.floor((durationMs % (60 * 60 * 1000)) / (60 * 1000))

  return `${hours}h ${minutes}m`
}

// Usage in component
const duration = calculateDuration(startTime, endTime)
```

## Cross-Midnight Time Ranges

### Overnight Shifts

```tsx
// Night shift: 10 PM to 6 AM (next day)
<TimeRangeInput
  startValue={timeStringToDate("22:00")}
  endValue={timeStringToDate("06:00")}
  format="HH:mm"
/>
// Duration: 8 hours (crossing midnight)
```

### 24-Hour Operations

```tsx
function TwentyFourHourSchedule() {
  const [shifts, setShifts] = useState([
    // Day shift: 6 AM - 2 PM
    { start: timeStringToDate("06:00"), end: timeStringToDate("14:00") },
    // Evening shift: 2 PM - 10 PM
    { start: timeStringToDate("14:00"), end: timeStringToDate("22:00") },
    // Night shift: 10 PM - 6 AM (next day)
    { start: timeStringToDate("22:00"), end: timeStringToDate("06:00") },
  ])

  return (
    <div className="space-y-4">
      {shifts.map((shift, index) => (
        <TimeRangeInput
          key={index}
          startValue={shift.start}
          endValue={shift.end}
          onStartChange={(start) => {
            const newShifts = [...shifts]
            newShifts[index].start = start
            setShifts(newShifts)
          }}
          onEndChange={(end) => {
            const newShifts = [...shifts]
            newShifts[index].end = end
            setShifts(newShifts)
          }}
          format="HH:mm"
        />
      ))}
    </div>
  )
}
```

## Integration with Panel

```tsx
import { Panel } from "@choiceform/design-system"
;<Panel.Row type="two-input-two-icon">
  <TimeRangeInput
    startValue={startTime}
    endValue={endTime}
    onStartChange={setStartTime}
    onEndChange={setEndTime}
    startPlaceholder="Start Time"
    endPlaceholder="End Time"
  />
</Panel.Row>
```

## Utility Functions

### Time String Conversion

```tsx
import { timeStringToDate } from "@choiceform/design-system"

// Convert time strings to Date objects
const startTime = timeStringToDate("09:00")
const endTime = timeStringToDate("17:30")
```

### Range Validation

```tsx
function validateTimeRange(start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false

  // Handle cross-midnight ranges
  if (end < start) {
    // Cross-midnight: valid if end + 24 hours > start
    const nextDayEnd = new Date(end.getTime() + 24 * 60 * 60 * 1000)
    return nextDayEnd > start
  }

  return end > start
}
```

## Best Practices

- **Range Synchronization**: Use intelligent range synchronization for better user experience
- **Clear Placeholders**: Provide descriptive placeholder text for start and end times
- **Format Consistency**: Use the same time format across your application
- **Cross-Midnight Support**: Consider overnight shifts and 24-hour operations
- **Duration Display**: Show calculated duration for user feedback
- **Validation**: Handle invalid ranges gracefully with automatic correction
- **Accessibility**: Provide proper labels and ARIA attributes for screen readers
- **Panel Integration**: Use with Panel.Row for consistent layout and styling

## Keyboard Navigation

- **Tab**: Move between start and end time inputs
- **Arrow Keys**: Adjust time values within each input (following TimeInput behavior)
- **Enter**: Confirm current input and move to next field
- **Escape**: Cancel current input changes

## Error Handling

### Invalid Time Ranges

- End time before start time triggers automatic adjustment
- Cross-midnight ranges are properly validated and handled
- Visual feedback indicates when ranges are corrected

### Boundary Conditions

- Empty time values are handled gracefully
- Invalid time formats are automatically corrected
- Range length preservation works with partial inputs

## Performance Considerations

- Efficient time calculation algorithms for cross-midnight ranges
- Optimized state management to prevent unnecessary re-renders
- Smart synchronization only when needed
- Minimal DOM updates during time adjustments

## Integration Examples

### With Form Validation

```tsx
import { useForm } from "react-hook-form"

function TimeRangeForm() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm()
  const startTime = watch("startTime")
  const endTime = watch("endTime")

  return (
    <form>
      <TimeRangeInput
        startValue={startTime}
        endValue={endTime}
        onStartChange={(time) => setValue("startTime", time)}
        onEndChange={(time) => setValue("endTime", time)}
        format="HH:mm"
      />
      {errors.timeRange && <p className="text-red-500">Invalid time range</p>}
    </form>
  )
}
```

### With State Management

```tsx
import { useContext } from "react"

function ScheduleManager() {
  const { schedules, updateSchedule } = useScheduleContext()

  return (
    <div>
      {schedules.map((schedule) => (
        <TimeRangeInput
          key={schedule.id}
          startValue={schedule.startTime}
          endValue={schedule.endTime}
          onStartChange={(start) => updateSchedule(schedule.id, { startTime: start })}
          onEndChange={(end) => updateSchedule(schedule.id, { endTime: end })}
        />
      ))}
    </div>
  )
}
```

## Notes

- Built on TimeInput components for consistent behavior and styling
- Supports all TimeInput features including smart completion and natural language parsing
- Range synchronization is optional - implement based on your use case needs
- Component automatically handles cross-midnight scenarios without additional configuration
- Duration calculation accounts for overnight shifts and date boundaries
- Real-time validation provides immediate feedback to users
- Designed to work seamlessly with time picker popovers and calendar components
