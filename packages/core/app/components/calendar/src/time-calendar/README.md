# TimeCalendar

A specialized calendar component for time selection with customizable time steps and formats. Features scrollable time list interface, intelligent handling of custom time values, and support for both 12-hour and 24-hour formats.

## Import

```tsx
import { TimeCalendar } from "@choiceform/design-system"
```

## Features

- Scrollable time list with configurable step intervals (1, 5, 15, 30 minutes)
- Support for both 12-hour and 24-hour time formats
- Intelligent handling of values outside step ranges
- Smooth scrolling and keyboard navigation
- Controlled and uncontrolled modes
- Customizable time format strings
- Compact vertical layout optimized for popovers
- Accessibility support with proper ARIA labels
- Today's current time highlighting

## Usage

### Basic Time Selection

```tsx
const [selectedTime, setSelectedTime] = useState<Date | null>(null)

<TimeCalendar
  value={selectedTime}
  onChange={setSelectedTime}
  className="h-64"
/>
```

### 24-Hour Format (Default)

```tsx
<TimeCalendar
  format="HH:mm"
  step={15}
  value={selectedTime}
  onChange={setSelectedTime}
  className="h-64"
/>
```

### 12-Hour Format with AM/PM

```tsx
<TimeCalendar
  format="h:mm a"
  step={15}
  value={selectedTime}
  onChange={setSelectedTime}
  className="h-64"
/>
```

### Custom Step Intervals

```tsx
// 5-minute intervals
<TimeCalendar
  format="HH:mm"
  step={5}
  value={selectedTime}
  onChange={setSelectedTime}
  className="h-64"
/>

// 30-minute intervals
<TimeCalendar
  format="HH:mm"
  step={30}
  value={selectedTime}
  onChange={setSelectedTime}
  className="h-64"
/>

// 1-minute intervals
<TimeCalendar
  format="HH:mm"
  step={1}
  value={selectedTime}
  onChange={setSelectedTime}
  className="h-64"
/>
```

### With Default Value

```tsx
import { createTimeToday } from "@choiceform/design-system"

const defaultTime = createTimeToday(10, 30) // 10:30 AM

<TimeCalendar
  defaultValue={defaultTime}
  format="HH:mm"
  step={15}
  className="h-64"
/>
```

### Uncontrolled Mode

```tsx
<TimeCalendar
  defaultValue={createTimeToday(14, 45)}
  format="h:mm a"
  step={15}
  onChange={(time) => console.log("Selected:", time)}
  className="h-64"
/>
```

## Props

```ts
interface TimeCalendarProps {
  /** Selected time value */
  value?: Date | null

  /** Default time value (uncontrolled mode) */
  defaultValue?: Date | null

  /** Time selection change handler */
  onChange?: (time: Date | null) => void

  /** Time format string (using date-fns format tokens) */
  format?: string

  /** Step interval in minutes */
  step?: number

  /** Hour step (for advanced use cases) */
  hourStep?: number

  /** Minute step (for advanced use cases) */
  minuteStep?: number

  /** Additional CSS class names */
  className?: string
}
```

- Defaults:
  - `format`: `"HH:mm"` (24-hour format)
  - `step`: `15` (15-minute intervals)
  - `hourStep`: `1`
  - `minuteStep`: Derived from `step` parameter

- Accessibility:
  - Full keyboard navigation with arrow keys and page up/down
  - Screen reader friendly with proper time announcements
  - Focus management and proper ARIA roles
  - High contrast support for all time entries

## Time Formats

### 24-Hour Formats

```tsx
// Standard 24-hour
<TimeCalendar format="HH:mm" />        // 14:30
<TimeCalendar format="H:mm" />         // 14:30 (no leading zero)

// With seconds
<TimeCalendar format="HH:mm:ss" />     // 14:30:45
```

### 12-Hour Formats

```tsx
// Standard 12-hour with AM/PM
<TimeCalendar format="h:mm a" />       // 2:30 PM
<TimeCalendar format="hh:mm a" />      // 02:30 PM (leading zero)

// Lowercase am/pm
<TimeCalendar format="h:mm aa" />      // 2:30 pm

// Different AM/PM placement
<TimeCalendar format="a h:mm" />       // PM 2:30
```

## Step Intervals

### Common Step Values

```tsx
// 1-minute precision
<TimeCalendar step={1} />    // 00:00, 00:01, 00:02, ...

// 5-minute intervals
<TimeCalendar step={5} />    // 00:00, 00:05, 00:10, ...

// 15-minute intervals (default)
<TimeCalendar step={15} />   // 00:00, 00:15, 00:30, 00:45, ...

// 30-minute intervals
<TimeCalendar step={30} />   // 00:00, 00:30, 01:00, ...

// Hour intervals
<TimeCalendar step={60} />   // 00:00, 01:00, 02:00, ...
```

## Handling Custom Time Values

The component intelligently handles time values that don't align with the configured step intervals:

```tsx
// If step is 15 minutes but value is 14:37
const customTime = createTimeToday(14, 37) // 14:37 (not in 15-min steps)

<TimeCalendar
  value={customTime}
  onChange={setCustomTime}
  step={15}
  className="h-64"
/>
// The component will display 14:37 at the top of the list as a special item
```

### Custom Time Features:

- Custom times appear at the top of the list with highlighting
- Separated from standard times by a visual divider
- Marked as "selected" when active
- Can be replaced by selecting a standard time

## Scroll Behavior

### Automatic Scrolling

- Initial scroll centers the selected time
- External value changes scroll smoothly to new selection
- Custom times scroll to top of list

### Manual Scrolling

- Smooth scrolling with mouse wheel
- Active state temporarily hidden during scrolling
- Hover states resume after scroll completion

### Keyboard Navigation

- **Arrow Up/Down**: Navigate between time options
- **Page Up/Down**: Navigate by larger increments
- **Home**: Go to first time option
- **End**: Go to last time option
- **Enter/Space**: Select current time

## Utility Functions

### Creating Time Values

```tsx
import { createTimeToday } from "@choiceform/design-system"

// Create time for today
const morning = createTimeToday(9, 30) // 9:30 AM today
const afternoon = createTimeToday(14, 45) // 2:45 PM today
const evening = createTimeToday(20, 0) // 8:00 PM today
```

### Time String Conversion

```tsx
import { timeStringToDate, normalizeTimeValue } from "@choiceform/design-system"

// Convert time string to Date object
const timeDate = timeStringToDate("14:30")

// Get normalized time string from Date
const timeString = normalizeTimeValue(new Date())
```

## Common Use Cases

### Time Picker in Popover

```tsx
import { Popover } from "@choiceform/design-system"
import { TimeInput } from "@choiceform/design-system"

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
            format="h:mm a"
            step={15}
            className="h-64 w-32"
          />
        </Popover.Content>
      </Popover>
    </>
  )
}
```

### Appointment Scheduling

```tsx
function AppointmentScheduler() {
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [endTime, setEndTime] = useState<Date | null>(null)

  return (
    <div className="flex gap-4">
      <div>
        <label>Start Time</label>
        <TimeCalendar
          value={startTime}
          onChange={setStartTime}
          format="h:mm a"
          step={30}
          className="h-64 w-32"
        />
      </div>

      <div>
        <label>End Time</label>
        <TimeCalendar
          value={endTime}
          onChange={setEndTime}
          format="h:mm a"
          step={30}
          className="h-64 w-32"
        />
      </div>
    </div>
  )
}
```

### Business Hours Selector

```tsx
function BusinessHoursSelector() {
  const [openTime, setOpenTime] = useState(createTimeToday(9, 0))
  const [closeTime, setCloseTime] = useState(createTimeToday(17, 0))

  return (
    <div className="space-y-4">
      <div>
        <h3>Store Hours</h3>
        <div className="flex gap-4">
          <div>
            <label>Open</label>
            <TimeCalendar
              value={openTime}
              onChange={setOpenTime}
              format="h:mm a"
              step={30}
              className="h-48 w-28"
            />
          </div>

          <div>
            <label>Close</label>
            <TimeCalendar
              value={closeTime}
              onChange={setCloseTime}
              format="h:mm a"
              step={30}
              className="h-48 w-28"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
```

### Multiple Time Zones

```tsx
function WorldClockSelector() {
  const [selectedTime, setSelectedTime] = useState<Date | null>(null)
  const [timeZone, setTimeZone] = useState("America/New_York")

  const displayTime = selectedTime
    ? selectedTime.toLocaleTimeString("en-US", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
      })
    : null

  return (
    <div className="space-y-4">
      <select
        value={timeZone}
        onChange={(e) => setTimeZone(e.target.value)}
      >
        <option value="America/New_York">New York</option>
        <option value="Europe/London">London</option>
        <option value="Asia/Tokyo">Tokyo</option>
      </select>

      <TimeCalendar
        value={selectedTime}
        onChange={setSelectedTime}
        format="HH:mm"
        step={15}
        className="h-64 w-32"
      />

      <div>Local Time: {displayTime}</div>
    </div>
  )
}
```

## Visual States

### Selection States

- **Selected**: Time has check mark and highlighted background
- **Active**: Time has hover state when mouse is over it
- **Custom**: Special highlighting for non-standard times

### 12-Hour Format Display

In 12-hour format, AM/PM indicators are:

- Right-aligned in a subdued color
- Separated by visual dividers between AM and PM sections
- Properly formatted with appropriate spacing

### Scrolling States

- Active states are hidden during scrolling for better performance
- Smooth restoration of hover states when scrolling stops
- Automatic scroll position adjustment for accessibility

## Performance Considerations

- Uses `memo` for preventing unnecessary re-renders
- Efficient scroll handling with debounced state updates
- Minimal DOM updates during scrolling
- Smart reference management for DOM elements
- Optimized time option generation with memoization

## Best Practices

- **Step Selection**: Choose appropriate step intervals based on use case precision
- **Format Consistency**: Use consistent time formats throughout your application
- **Default Values**: Provide reasonable default values for better user experience
- **Container Height**: Set appropriate height with `className="h-64"` or similar
- **Accessibility**: Ensure proper labeling for screen readers
- **Mobile Consideration**: Consider touch-friendly sizing for mobile devices
- **Time Zones**: Handle time zone conversions carefully when needed
- **Validation**: Implement time range validation for business rules

## Styling

The component integrates with the design system's Menu components:

- Uses consistent hover and selection states
- Supports theme variants through Menu system
- Maintains proper spacing and typography
- Includes visual separators for better organization

### Custom Styling

```tsx
<TimeCalendar
  className="h-80 w-40 rounded-lg border shadow-lg"
  // Internal styling handled by Menu components
/>
```

## Notes

- Built on the Menu component system for consistent interaction patterns
- Time values are always `Date` objects representing today's date with selected time
- Custom times are preserved and displayed prominently when outside step intervals
- Smooth scrolling behavior adapts to user interaction patterns
- Component handles both controlled and uncontrolled usage patterns seamlessly
- All time calculations respect the configured step intervals and format settings
