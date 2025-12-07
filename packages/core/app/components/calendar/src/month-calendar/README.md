# MonthCalendar

A comprehensive calendar component for displaying and selecting dates within a month view. Features multiple selection modes, internationalization support, and flexible customization options for various use cases.

## Import

```tsx
import { MonthCalendar } from "@choiceform/design-system"
```

## Features

- Multiple selection modes: single, multiple, and range selection
- Comprehensive internationalization support with locale-aware formatting
- Flexible week start configuration (Sunday through Saturday)
- Week number display with ISO standard support
- Date highlighting and disabling capabilities
- Light and dark theme variants
- Dynamic or fixed grid layout options
- Outside day display control
- Today highlighting and navigation
- Keyboard navigation and accessibility support
- Customizable weekday names and formatting

## Usage

### Basic Calendar

```tsx
<MonthCalendar className="w-80 rounded-xl border" />
```

### Single Date Selection

```tsx
const [selectedDate, setSelectedDate] = useState<Date | null>(null)

<MonthCalendar
  value={selectedDate}
  onChange={setSelectedDate}
  selectionMode="single"
  className="w-80 rounded-xl border"
/>
```

### Multiple Date Selection

```tsx
const [selectedDates, setSelectedDates] = useState<Date[]>([])

<MonthCalendar
  value={selectedDates}
  onChange={setSelectedDates}
  selectionMode="multiple"
  className="w-80 rounded-xl border"
/>
```

### Date Range Selection

```tsx
const [dateRange, setDateRange] = useState<{start: Date, end: Date} | null>(null)

<MonthCalendar
  value={dateRange}
  onChange={setDateRange}
  selectionMode="range"
  className="w-80 rounded-xl border"
/>
```

### With Week Numbers

```tsx
<MonthCalendar
  showWeekNumbers={true}
  weekStartsOn={1} // Monday
  className="w-80 rounded-xl border"
/>
```

### Theme Variants

```tsx
<MonthCalendar
  variant="light"
  className="w-80 rounded-xl border"
/>

<MonthCalendar
  variant="dark"
  className="w-80 rounded-xl border"
/>
```

### Disabled Dates

```tsx
const today = new Date()
const disabledDates = [
  new Date(today.getTime() - 24 * 60 * 60 * 1000), // Yesterday
  new Date(today.getFullYear(), today.getMonth(), 15), // 15th of month
  new Date(today.getFullYear(), today.getMonth(), 25), // 25th of month
]

<MonthCalendar
  disabledDates={disabledDates}
  selectionMode="single"
  className="w-80 rounded-xl border"
/>
```

### Highlighted Dates

```tsx
const today = new Date()
const highlightDates = [
  new Date(today.getFullYear(), today.getMonth(), 1), // 1st of month
  new Date(today.getFullYear(), today.getMonth(), 10), // 10th of month
  new Date(today.getFullYear(), today.getMonth(), 20), // 20th of month
]

<MonthCalendar
  highlightDates={highlightDates}
  selectionMode="single"
  className="w-80 rounded-xl border"
/>
```

### Custom Weekday Names

```tsx
<MonthCalendar
  weekdayNames={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
  locale="en-US"
  className="w-80 rounded-xl border"
/>
```

### Different Week Start Days

```tsx
// Start on Sunday (0)
<MonthCalendar
  weekStartsOn={0}
  className="w-80 rounded-xl border"
/>

// Start on Monday (1)
<MonthCalendar
  weekStartsOn={1}
  className="w-80 rounded-xl border"
/>

// Start on Saturday (6)
<MonthCalendar
  weekStartsOn={6}
  className="w-80 rounded-xl border"
/>
```

### Dynamic Layout

```tsx
<MonthCalendar
  fixedGrid={false}
  showOutsideDays={false}
  className="w-80 rounded-xl border"
/>
```

## Props

```ts
interface MonthCalendarProps {
  /** Current selected value (varies by selection mode) */
  value?: CalendarValue

  /** Selection change handler */
  onChange?: (value: CalendarValue) => void

  /** Selection mode */
  selectionMode?: "single" | "multiple" | "range"

  /** Locale for internationalization */
  locale?: string

  /** Visual theme variant */
  variant?: "light" | "dark"

  /** Week start day (0 = Sunday, 1 = Monday, ..., 6 = Saturday) */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6

  /** Show week numbers column */
  showWeekNumbers?: boolean

  /** Custom weekday names array */
  weekdayNames?: string[]

  /** Highlight today's date */
  highlightToday?: boolean

  /** Show outside days (previous/next month) */
  showOutsideDays?: boolean

  /** Use fixed 6-row grid */
  fixedGrid?: boolean

  /** Dates to disable */
  disabledDates?: Date[]

  /** Dates to highlight */
  highlightDates?: Date[]

  /** Additional CSS class names */
  className?: string
}

// CalendarValue type varies by selection mode:
type CalendarValue =
  | Date
  | null // single mode
  | Date[] // multiple mode
  | { start: Date; end: Date }
  | null // range mode
```

- Defaults:
  - `selectionMode`: `"single"`
  - `locale`: `"zh-CN"`
  - `variant`: `"light"`
  - `weekStartsOn`: `1` (Monday)
  - `showWeekNumbers`: `false`
  - `highlightToday`: `true`
  - `showOutsideDays`: `true`
  - `fixedGrid`: `true`
  - `disabledDates`, `highlightDates`: `[]`

- Accessibility:
  - Full keyboard navigation with arrow keys and space/enter selection
  - Screen reader friendly with proper ARIA labels and descriptions
  - High contrast support for all states and variants
  - Semantic HTML structure with proper date semantics

## Selection Modes

### Single Selection

- Select one date at a time
- Value type: `Date | null`
- Previous selection is replaced when selecting a new date

### Multiple Selection

- Select multiple individual dates
- Value type: `Date[]`
- Click to toggle selection on individual dates
- Selected dates are tracked in an array

### Range Selection

- Select a continuous date range
- Value type: `{start: Date, end: Date} | null`
- First click sets start date, second click sets end date
- Range is highlighted between start and end dates

## Internationalization

### Supported Locales

```tsx
// Chinese (Simplified)
<MonthCalendar locale="zh-CN" />

// English (US)
<MonthCalendar locale="en-US" />

// Japanese
<MonthCalendar locale="ja-JP" />

// Korean
<MonthCalendar locale="ko-KR" />
```

### Custom Weekday Names

Override automatic locale-generated weekday names:

```tsx
<MonthCalendar
  locale="en-US"
  weekdayNames={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
/>
```

## Week Configuration

### Week Start Days

Different cultures prefer different week start days:

```tsx
// Sunday start (US standard)
<MonthCalendar weekStartsOn={0} />

// Monday start (ISO standard, most of world)
<MonthCalendar weekStartsOn={1} />

// Saturday start (some Middle Eastern countries)
<MonthCalendar weekStartsOn={6} />
```

### Week Numbers

Display ISO standard week numbers:

```tsx
<MonthCalendar
  showWeekNumbers={true}
  weekStartsOn={1} // ISO standard uses Monday start
/>
```

## Layout Options

### Fixed Grid

Always shows 6 rows for consistent height:

```tsx
<MonthCalendar
  fixedGrid={true}
  showOutsideDays={true}
/>
```

### Dynamic Rows

Variable height based on month structure:

```tsx
<MonthCalendar
  fixedGrid={false}
  showOutsideDays={false}
/>
```

## Date Management

### Disabled Dates

Prevent selection of specific dates:

```tsx
const disabledDates = [
  new Date('2025-01-15'),
  new Date('2025-01-25'),
  // Can also disable date ranges or use functions
]

<MonthCalendar disabledDates={disabledDates} />
```

### Highlighted Dates

Draw attention to specific dates:

```tsx
const highlightDates = [
  new Date('2025-01-01'), // New Year
  new Date('2025-01-15'), // Holiday
  new Date('2025-01-31'), // Deadline
]

<MonthCalendar highlightDates={highlightDates} />
```

## Common Use Cases

### Event Calendar

```tsx
function EventCalendar() {
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const eventDates = [new Date("2025-01-15"), new Date("2025-01-22"), new Date("2025-01-29")]

  return (
    <MonthCalendar
      value={selectedDates}
      onChange={setSelectedDates}
      selectionMode="multiple"
      highlightDates={eventDates}
      className="w-80 rounded-xl border"
    />
  )
}
```

### Booking System

```tsx
function BookingCalendar() {
  const [dateRange, setDateRange] = useState(null)
  const unavailableDates = [new Date("2025-01-10"), new Date("2025-01-11"), new Date("2025-01-12")]

  return (
    <MonthCalendar
      value={dateRange}
      onChange={setDateRange}
      selectionMode="range"
      disabledDates={unavailableDates}
      className="w-80 rounded-xl border"
    />
  )
}
```

### Multi-Language Support

```tsx
function MultiLanguageCalendar() {
  const [locale, setLocale] = useState("en-US")
  const [selectedDate, setSelectedDate] = useState(null)

  return (
    <div>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value)}
      >
        <option value="zh-CN">中文</option>
        <option value="en-US">English</option>
        <option value="ja-JP">日本語</option>
        <option value="ko-KR">한국어</option>
      </select>

      <MonthCalendar
        locale={locale}
        value={selectedDate}
        onChange={setSelectedDate}
        selectionMode="single"
        className="w-80 rounded-xl border"
      />
    </div>
  )
}
```

## Keyboard Navigation

- **Arrow Keys**: Navigate between dates
- **Space/Enter**: Select current date
- **Home**: Go to first day of month
- **End**: Go to last day of month
- **Page Up**: Go to previous month
- **Page Down**: Go to next month
- **Tab**: Move focus in/out of calendar

## Best Practices

- **Selection Mode**: Choose appropriate selection mode based on user needs
- **Locale Awareness**: Consider cultural differences in week start preferences
- **Visual Feedback**: Use highlighting and disabling to guide user selection
- **Accessibility**: Ensure keyboard navigation works for all users
- **Performance**: Use disabled/highlighted date arrays efficiently for large datasets
- **Consistent Layout**: Use `fixedGrid={true}` for consistent component height
- **Clear States**: Provide clear visual feedback for selected, disabled, and highlighted dates
- **Week Numbers**: Enable for business applications requiring week-based scheduling

## Integration Examples

### With Date Input

```tsx
import { DateInput } from "@choiceform/design-system"
import { Popover } from "@choiceform/design-system"

function DatePicker() {
  const [date, setDate] = useState<Date | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <DateInput
        value={date}
        onChange={setDate}
        onFocus={() => setIsOpen(true)}
      />

      <Popover
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
            selectionMode="single"
            className="w-80"
          />
        </Popover.Content>
      </Popover>
    </>
  )
}
```

### With Date Range Input

```tsx
import { DateRangeInput } from "@choiceform/design-system"

function DateRangePicker() {
  const [range, setRange] = useState(null)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  return (
    <>
      <DateRangeInput
        startValue={startDate}
        endValue={endDate}
        onStartChange={setStartDate}
        onEndChange={setEndDate}
      />

      <MonthCalendar
        value={range}
        onChange={setRange}
        selectionMode="range"
        className="w-80 rounded-xl border"
      />
    </>
  )
}
```

## Notes

- Week numbers follow ISO 8601 standard regardless of `weekStartsOn` setting
- Selection modes are mutually exclusive - changing mode resets the value
- Disabled dates prevent selection but can still be visually highlighted
- Outside days (previous/next month dates) can be hidden for cleaner appearance
- Fixed grid layout ensures consistent component height across different months
- Calendar respects locale settings for month names, weekday names, and date formatting
- Component handles date validation and prevents invalid date selections automatically
