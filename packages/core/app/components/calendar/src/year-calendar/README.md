# YearCalendar

A specialized calendar component for year selection with flexible range and display options. Features grid-based year selection, range restrictions, and comprehensive customization for various year selection scenarios.

## Import

```tsx
import { YearCalendar } from "@choiceform/design-system"
```

## Features

- Grid-based year selection with customizable year count
- Year range restrictions with minimum and maximum year limits
- Selective year disabling for specific years
- Current year highlighting and navigation
- Light and dark theme variants
- Customizable starting year and display range
- Disabled state support for entire component
- Keyboard navigation and accessibility support
- Compact grid layout optimized for year selection
- Proper year boundary handling and validation

## Usage

### Basic Year Selection

```tsx
const [selectedYear, setSelectedYear] = useState<Date | null>(new Date())

<YearCalendar
  value={selectedYear}
  onChange={setSelectedYear}
  className="w-48 rounded-xl border"
/>
```

### With Year Range Limits

```tsx
const currentYear = new Date()
const fiveYearsAgo = new Date(currentYear.getFullYear() - 5, 0, 1)
const fiveYearsAhead = new Date(currentYear.getFullYear() + 5, 0, 1)

<YearCalendar
  value={selectedYear}
  onChange={setSelectedYear}
  minYear={fiveYearsAgo}
  maxYear={fiveYearsAhead}
  className="w-48 rounded-xl border"
/>
```

### With Disabled Years

```tsx
const disabledYears = [
  new Date(2020, 0, 1),
  new Date(2021, 0, 1),
  new Date(2023, 0, 1),
]

<YearCalendar
  value={selectedYear}
  onChange={setSelectedYear}
  disabledYears={disabledYears}
  className="w-48 rounded-xl border"
/>
```

### Custom Year Count

```tsx
// Show 9 years in a 3x3 grid
<YearCalendar
  value={selectedYear}
  onChange={setSelectedYear}
  yearCount={9}
  className="w-48 rounded-xl border"
/>

// Show 15 years in a larger grid
<YearCalendar
  value={selectedYear}
  onChange={setSelectedYear}
  yearCount={15}
  className="w-60 rounded-xl border"
/>
```

### Custom Starting Year

```tsx
const startFrom2020 = new Date(2020, 0, 1)

<YearCalendar
  value={selectedYear}
  onChange={setSelectedYear}
  startYear={startFrom2020}
  yearCount={15}
  className="w-48 rounded-xl border"
/>
```

### Theme Variants

```tsx
<YearCalendar
  variant="light"
  value={selectedYear}
  onChange={setSelectedYear}
  className="w-48 rounded-xl border"
/>

<YearCalendar
  variant="dark"
  value={selectedYear}
  onChange={setSelectedYear}
  className="w-48 rounded-xl border"
/>
```

### Disabled State

```tsx
<YearCalendar
  disabled={true}
  value={selectedYear}
  onChange={setSelectedYear}
  className="w-48 rounded-xl border"
/>
```

## Props

```ts
interface YearCalendarProps {
  /** Selected year value */
  value?: Date | null

  /** Default selected year */
  defaultValue?: Date | null

  /** Year selection change handler */
  onChange?: (year: Date | null) => void

  /** Current year for reference (highlights current year) */
  currentYear?: Date

  /** Starting year for the grid display */
  startYear?: Date

  /** Number of years to display in grid */
  yearCount?: number

  /** Minimum selectable year */
  minYear?: Date | null

  /** Maximum selectable year */
  maxYear?: Date | null

  /** Array of disabled years */
  disabledYears?: Date[]

  /** Disable entire component */
  disabled?: boolean

  /** Visual theme variant */
  variant?: "light" | "dark"

  /** Additional CSS class names */
  className?: string
}
```

- Defaults:
  - `currentYear`: `new Date()` (current year)
  - `yearCount`: `12` (3x4 grid)
  - `variant`: `"light"`
  - `disabled`: `false`
  - `disabledYears`: `[]`

- Accessibility:
  - Full keyboard navigation with arrow keys and enter/space selection
  - Screen reader friendly with proper ARIA labels and year announcements
  - High contrast support for all year states
  - Semantic HTML structure with proper year semantics

## Year Grid Layout

### Default Layout (12 years)

```
2020  2021  2022  2023
2024  2025  2026  2027
2028  2029  2030  2031
```

### 9 Years Layout (3x3)

```
2020  2021  2022
2023  2024  2025
2026  2027  2028
```

### 15 Years Layout (3x5)

```
2020  2021  2022  2023  2024
2025  2026  2027  2028  2029
2030  2031  2032  2033  2034
```

## Year Range Configuration

### Relative Ranges

```tsx
const currentYear = new Date()

// Last 10 years
<YearCalendar
  startYear={new Date(currentYear.getFullYear() - 9, 0, 1)}
  yearCount={10}
  maxYear={currentYear}
/>

// Next 5 years
<YearCalendar
  startYear={currentYear}
  yearCount={5}
  minYear={currentYear}
/>

// ±5 years from current
<YearCalendar
  minYear={new Date(currentYear.getFullYear() - 5, 0, 1)}
  maxYear={new Date(currentYear.getFullYear() + 5, 0, 1)}
  yearCount={11}
/>
```

### Fixed Ranges

```tsx
// Birth year selector (1950-2010)
<YearCalendar
  startYear={new Date(1950, 0, 1)}
  yearCount={24} // 4x6 grid for 60 years
  minYear={new Date(1950, 0, 1)}
  maxYear={new Date(2010, 0, 1)}
/>

// Historical documents (1900-2000)
<YearCalendar
  startYear={new Date(1900, 0, 1)}
  yearCount={20}
  minYear={new Date(1900, 0, 1)}
  maxYear={new Date(2000, 0, 1)}
/>
```

## Disabling Years

### Specific Years

```tsx
const unavailableYears = [
  new Date(2020, 0, 1), // 2020
  new Date(2021, 0, 1), // 2021
  new Date(2025, 0, 1), // 2025
]

<YearCalendar
  disabledYears={unavailableYears}
  value={selectedYear}
  onChange={setSelectedYear}
/>
```

### Range-based Disabling

```tsx
// Disable future years
const futureYears = Array.from(
  { length: 10 },
  (_, i) => new Date(new Date().getFullYear() + i + 1, 0, 1)
)

<YearCalendar
  disabledYears={futureYears}
  yearCount={15}
/>

// Disable specific decades
const twentyTwenties = Array.from(
  { length: 10 },
  (_, i) => new Date(2020 + i, 0, 1)
)

<YearCalendar
  disabledYears={twentyTwenties}
  yearCount={20}
/>
```

## Common Use Cases

### Birth Year Selector

```tsx
function BirthYearSelector() {
  const [birthYear, setBirthYear] = useState<Date | null>(null)
  const currentYear = new Date().getFullYear()

  return (
    <div>
      <label>Birth Year</label>
      <YearCalendar
        value={birthYear}
        onChange={setBirthYear}
        startYear={new Date(currentYear - 80, 0, 1)}
        yearCount={20} // 4x5 grid showing 80 years
        minYear={new Date(1940, 0, 1)}
        maxYear={new Date()}
        className="w-64 rounded-xl border"
      />
    </div>
  )
}
```

### Document Year Filter

```tsx
function DocumentYearFilter() {
  const [filterYear, setFilterYear] = useState<Date | null>(null)
  const [availableYears] = useState([
    new Date(2020, 0, 1),
    new Date(2021, 0, 1),
    new Date(2022, 0, 1),
    new Date(2024, 0, 1),
    // 2023 is missing (no documents)
  ])

  const disabledYears = Array.from({ length: 10 }, (_, i) => new Date(2020 + i, 0, 1)).filter(
    (year) => !availableYears.some((available) => available.getFullYear() === year.getFullYear()),
  )

  return (
    <YearCalendar
      value={filterYear}
      onChange={setFilterYear}
      startYear={new Date(2020, 0, 1)}
      yearCount={12}
      disabledYears={disabledYears}
      className="w-48 rounded-xl border"
    />
  )
}
```

### Financial Year Selector

```tsx
function FinancialYearSelector() {
  const [fiscalYear, setFiscalYear] = useState<Date | null>(null)
  const currentYear = new Date().getFullYear()

  return (
    <div>
      <label>Fiscal Year</label>
      <YearCalendar
        value={fiscalYear}
        onChange={setFiscalYear}
        startYear={new Date(currentYear - 5, 0, 1)}
        yearCount={10}
        minYear={new Date(currentYear - 10, 0, 1)}
        maxYear={new Date(currentYear + 2, 0, 1)}
        className="w-48 rounded-xl border"
      />

      {fiscalYear && (
        <p className="text-body-small mt-2 text-gray-600">
          FY {fiscalYear.getFullYear()}-{fiscalYear.getFullYear() + 1}
        </p>
      )}
    </div>
  )
}
```

### Academic Year Selector

```tsx
function AcademicYearSelector() {
  const [academicYear, setAcademicYear] = useState<Date | null>(null)
  const currentYear = new Date().getFullYear()

  // Only show past and current academic years
  const maxYear = new Date()
  const minYear = new Date(currentYear - 20, 0, 1)

  return (
    <div>
      <label>Academic Year</label>
      <YearCalendar
        value={academicYear}
        onChange={setAcademicYear}
        startYear={minYear}
        yearCount={15}
        minYear={minYear}
        maxYear={maxYear}
        className="w-60 rounded-xl border"
      />

      {academicYear && (
        <div className="text-body-small mt-2 text-gray-600">
          Academic Year: {academicYear.getFullYear()}-{academicYear.getFullYear() + 1}
        </div>
      )}
    </div>
  )
}
```

### Multi-Year Data Range

```tsx
function DataRangeSelector() {
  const [startYear, setStartYear] = useState<Date | null>(null)
  const [endYear, setEndYear] = useState<Date | null>(null)

  return (
    <div className="space-y-4">
      <div>
        <label>Start Year</label>
        <YearCalendar
          value={startYear}
          onChange={setStartYear}
          yearCount={12}
          maxYear={endYear || new Date()}
          className="w-48 rounded-xl border"
        />
      </div>

      <div>
        <label>End Year</label>
        <YearCalendar
          value={endYear}
          onChange={setEndYear}
          yearCount={12}
          minYear={startYear || new Date(2000, 0, 1)}
          className="w-48 rounded-xl border"
        />
      </div>

      {startYear && endYear && (
        <div className="text-body-small text-gray-600">
          Range: {startYear.getFullYear()} - {endYear.getFullYear()}(
          {endYear.getFullYear() - startYear.getFullYear() + 1} years)
        </div>
      )}
    </div>
  )
}
```

## Year Navigation

### Programmatic Navigation

```tsx
function YearNavigator() {
  const [selectedYear, setSelectedYear] = useState<Date | null>(new Date())

  const navigateToYear = (year: number) => {
    setSelectedYear(new Date(year, 0, 1))
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => navigateToYear(2020)}>2020</button>
        <button onClick={() => navigateToYear(2025)}>2025</button>
        <button onClick={() => navigateToYear(2030)}>2030</button>
      </div>

      <YearCalendar
        value={selectedYear}
        onChange={setSelectedYear}
        yearCount={12}
        className="w-48 rounded-xl border"
      />
    </div>
  )
}
```

### Dynamic Range Updates

```tsx
function DynamicYearRange() {
  const [selectedYear, setSelectedYear] = useState<Date | null>(new Date())
  const [decade, setDecade] = useState(2020)

  return (
    <div className="space-y-4">
      <select
        value={decade}
        onChange={(e) => setDecade(Number(e.target.value))}
      >
        <option value={2000}>2000s</option>
        <option value={2010}>2010s</option>
        <option value={2020}>2020s</option>
        <option value={2030}>2030s</option>
      </select>

      <YearCalendar
        value={selectedYear}
        onChange={setSelectedYear}
        startYear={new Date(decade, 0, 1)}
        yearCount={10}
        className="w-48 rounded-xl border"
      />
    </div>
  )
}
```

## Keyboard Navigation

- **Arrow Keys**: Navigate between years in the grid
- **Enter/Space**: Select current year
- **Home**: Go to first year in grid
- **End**: Go to last year in grid
- **Page Up**: Navigate to previous page of years
- **Page Down**: Navigate to next page of years
- **Tab**: Move focus in/out of calendar

## Visual States

### Year States

- **Selected**: Year has highlighted background and border
- **Current**: Current year has special indication
- **Disabled**: Disabled years have reduced opacity and no interaction
- **Hover**: Years have subtle highlight on hover

### Grid Layout

- Years are arranged in a responsive grid
- Grid adapts to the specified `yearCount`
- Maintains consistent spacing and alignment
- Optimized for both mouse and touch interaction

## Best Practices

- **Year Range**: Set appropriate year ranges based on your data requirements
- **Year Count**: Choose year counts that create balanced grid layouts (9, 12, 15, 20)
- **Disabled Years**: Use disabled years to prevent selection of irrelevant years
- **Current Year**: Highlight current year for temporal context
- **Accessibility**: Ensure proper labeling for screen readers
- **Performance**: Use reasonable year counts to maintain good performance
- **Visual Feedback**: Provide clear indication of selected and current years

## Styling

The component uses a grid-based layout with:

- Responsive year cells that adapt to container size
- Consistent hover and selection states
- Proper disabled state styling
- Theme variant support for light and dark modes

### Custom Styling

```tsx
<YearCalendar
  className="w-64 rounded-2xl border-2 border-blue-200 shadow-lg"
  // Component handles internal grid styling automatically
/>
```

## Integration Examples

### With Date Picker

```tsx
import { DateInput } from "@choiceform/design-system"
import { Popover } from "@choiceform/design-system"

function YearDatePicker() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showYearPicker, setShowYearPicker] = useState(false)

  return (
    <>
      <DateInput
        value={selectedDate}
        onChange={setSelectedDate}
        onYearClick={() => setShowYearPicker(true)}
      />

      {showYearPicker && (
        <Popover>
          <YearCalendar
            value={selectedDate}
            onChange={(year) => {
              if (year) {
                const newDate = new Date(selectedDate || new Date())
                newDate.setFullYear(year.getFullYear())
                setSelectedDate(newDate)
              }
              setShowYearPicker(false)
            }}
            yearCount={12}
          />
        </Popover>
      )}
    </>
  )
}
```

### With Form Validation

```tsx
import { useForm } from "react-hook-form"

function YearSelectionForm() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm()
  const selectedYear = watch("year")

  return (
    <form>
      <YearCalendar
        value={selectedYear}
        onChange={(year) => setValue("year", year)}
        minYear={new Date(1900, 0, 1)}
        maxYear={new Date()}
        yearCount={16}
      />
      {errors.year && <p className="text-red-500">Please select a valid year</p>}
    </form>
  )
}
```

## Notes

- Year values are always `Date` objects representing January 1st of the selected year
- Grid layout automatically adapts to the specified year count
- Component handles year boundary validation automatically
- Disabled years are preserved in the grid but prevent selection
- Current year highlighting helps users maintain temporal context
- Keyboard navigation follows standard grid navigation patterns
- Component is optimized for both desktop and mobile interaction patterns
