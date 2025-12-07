# QuarterCalendar

A specialized calendar component for selecting quarters (Q1, Q2, Q3, Q4) within a year. Features intuitive quarter selection, year navigation, and comprehensive internationalization support for business applications.

## Import

```tsx
import { QuarterCalendar } from "@choiceform/design-system"
```

## Features

- Intuitive quarter selection with visual quarter representation
- Year navigation with customizable year range limits
- Comprehensive internationalization support with locale-specific formatting
- Disabled state support for entire component or specific quarters
- Light and dark theme variants
- Accessible keyboard navigation and screen reader support
- Current quarter highlighting and selection state management
- Flexible styling and customization options

## Usage

### Basic Quarter Selection

```tsx
const [selectedQuarter, setSelectedQuarter] = useState<Quarter | null>(null)

<QuarterCalendar
  value={selectedQuarter}
  onChange={setSelectedQuarter}
  className="w-48 rounded-xl border"
/>
```

### With Specific Year

```tsx
<QuarterCalendar
  currentYear={2025}
  value={selectedQuarter}
  onChange={setSelectedQuarter}
  className="w-48 rounded-xl border"
/>
```

### With Year Range Limits

```tsx
const currentYear = new Date().getFullYear()

<QuarterCalendar
  currentYear={currentYear}
  minYear={currentYear - 2}
  maxYear={currentYear + 2}
  value={selectedQuarter}
  onChange={setSelectedQuarter}
  className="w-48 rounded-xl border"
/>
```

### With Disabled Quarters

```tsx
const currentYear = new Date().getFullYear()
const disabledQuarters = [
  { quarter: 1, year: currentYear }, // Q1
  { quarter: 3, year: currentYear }, // Q3
]

<QuarterCalendar
  currentYear={currentYear}
  disabledQuarters={disabledQuarters}
  value={selectedQuarter}
  onChange={setSelectedQuarter}
  className="w-48 rounded-xl border"
/>
```

### Completely Disabled

```tsx
<QuarterCalendar
  disabled={true}
  value={selectedQuarter}
  onChange={setSelectedQuarter}
  className="w-48 rounded-xl border"
/>
```

### Dark Theme

```tsx
<QuarterCalendar
  variant="dark"
  value={selectedQuarter}
  onChange={setSelectedQuarter}
  className="w-48 rounded-xl border"
/>
```

### With Localization

```tsx
import { zhCN, enUS, ja } from "date-fns/locale"

// Chinese locale
<QuarterCalendar
  locale="zh-CN"
  value={selectedQuarter}
  onChange={setSelectedQuarter}
  className="w-48 rounded-xl border"
/>

// English locale
<QuarterCalendar
  locale="en-US"
  value={selectedQuarter}
  onChange={setSelectedQuarter}
  className="w-48 rounded-xl border"
/>
```

### With Pre-selected Quarter

```tsx
const preselectedQuarter = {
  quarter: 2,
  year: 2025,
  label: "Q2 2025",
  months: ["April", "May", "June"],
}

<QuarterCalendar
  value={preselectedQuarter}
  onChange={setSelectedQuarter}
  className="w-48 rounded-xl border"
/>
```

## Props

```ts
interface QuarterCalendarProps {
  /** Selected quarter value */
  value?: Quarter | null

  /** Default selected quarter */
  defaultValue?: Quarter | null

  /** Quarter selection change handler */
  onChange?: (quarter: Quarter | null) => void

  /** Current year to display */
  currentYear?: number

  /** Starting year for display (controlled mode) */
  startYear?: number

  /** Minimum selectable year */
  minYear?: number

  /** Maximum selectable year */
  maxYear?: number

  /** Array of disabled quarters */
  disabledQuarters?: Array<{ quarter: number; year: number }>

  /** Disable entire component */
  disabled?: boolean

  /** Locale for internationalization */
  locale?: string | Locale

  /** Visual theme variant */
  variant?: "default" | "dark"

  /** Year navigation handler */
  onNavigate?: (direction: "prev" | "next", year: number) => void

  /** Additional CSS class names */
  className?: string
}

// Quarter type definition
interface Quarter {
  /** Quarter number (1-4) */
  quarter: number

  /** Year */
  year: number

  /** Localized quarter label */
  label: string

  /** Array of month names in the quarter */
  months: string[]
}
```

- Defaults:
  - `currentYear`: Current year from `new Date()`
  - `locale`: `enUS` (English, US)
  - `variant`: `"default"`
  - `disabled`: `false`
  - `disabledQuarters`: `[]`

- Accessibility:
  - Full keyboard navigation with arrow keys and enter/space selection
  - Screen reader friendly with proper ARIA labels and descriptions
  - High contrast support for disabled and selected states
  - Semantic HTML structure for optimal accessibility

## Quarter Data Structure

The `Quarter` object contains:

- **quarter**: Number from 1-4 representing Q1, Q2, Q3, Q4
- **year**: The year of the quarter
- **label**: Localized quarter label (e.g., "Q1 2025", "第一季度")
- **months**: Array of localized month names in the quarter

### Example Quarter Objects

```tsx
// English locale
const q1English = {
  quarter: 1,
  year: 2025,
  label: "Q1 2025",
  months: ["January", "February", "March"],
}

// Chinese locale
const q1Chinese = {
  quarter: 1,
  year: 2025,
  label: "第一季度",
  months: ["一月", "二月", "三月"],
}
```

## Year Navigation

### Automatic Navigation

- Click previous/next buttons in header to navigate years
- Navigation respects `minYear` and `maxYear` boundaries
- Disabled state prevents navigation

### Controlled Navigation

```tsx
const [currentYear, setCurrentYear] = useState(2025)

<QuarterCalendar
  startYear={currentYear}
  onNavigate={(direction, newYear) => {
    setCurrentYear(newYear)
  }}
/>
```

### Today Button

- "Today" button navigates to current year and selects current quarter
- Automatically determines current quarter based on current date
- Respects locale settings for quarter formatting

## Internationalization

### Supported Locales

```tsx
// Chinese (Simplified)
<QuarterCalendar locale="zh-CN" />

// English (US)
<QuarterCalendar locale="en-US" />

// Japanese
<QuarterCalendar locale="ja-JP" />

// Korean
<QuarterCalendar locale="ko-KR" />

// French
<QuarterCalendar locale="fr-FR" />

// German
<QuarterCalendar locale="de-DE" />
```

### Locale-Specific Formatting

Each locale provides:

- Quarter labels (Q1/Q2/Q3/Q4 vs 第一季度/第二季度/第三季度/第四季度)
- Month names within quarters
- Navigation button text
- Current quarter highlighting

## Disabling Quarters

### Specific Quarters

Disable individual quarters by specifying quarter number and year:

```tsx
const disabledQuarters = [
  { quarter: 1, year: 2025 }, // Q1 2025
  { quarter: 3, year: 2025 }, // Q3 2025
  { quarter: 2, year: 2024 }, // Q2 2024
]

<QuarterCalendar
  disabledQuarters={disabledQuarters}
  currentYear={2025}
/>
```

### Entire Component

Disable all interaction with the component:

```tsx
<QuarterCalendar disabled={true} />
```

## Common Use Cases

### Financial Reporting

```tsx
function QuarterlyReportSelector() {
  const [selectedQuarter, setSelectedQuarter] = useState<Quarter | null>(null)
  const currentYear = new Date().getFullYear()

  return (
    <div>
      <label>Select Reporting Quarter:</label>
      <QuarterCalendar
        value={selectedQuarter}
        onChange={setSelectedQuarter}
        currentYear={currentYear}
        minYear={currentYear - 5}
        maxYear={currentYear}
        className="w-48 rounded-xl border"
      />

      {selectedQuarter && (
        <p>
          Selected: {selectedQuarter.label} ({selectedQuarter.months.join(", ")})
        </p>
      )}
    </div>
  )
}
```

### Seasonal Planning

```tsx
function SeasonalPlanner() {
  const [planningQuarter, setPlanningQuarter] = useState<Quarter | null>(null)
  const currentYear = new Date().getFullYear()

  // Disable past quarters for planning
  const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3)
  const disabledQuarters = []
  for (let q = 1; q < currentQuarter; q++) {
    disabledQuarters.push({ quarter: q, year: currentYear })
  }

  return (
    <QuarterCalendar
      value={planningQuarter}
      onChange={setPlanningQuarter}
      currentYear={currentYear}
      maxYear={currentYear + 2}
      disabledQuarters={disabledQuarters}
      className="w-48 rounded-xl border"
    />
  )
}
```

### Business Quarter Filter

```tsx
function BusinessQuarterFilter() {
  const [filterQuarter, setFilterQuarter] = useState<Quarter | null>(null)
  const [filterYear, setFilterYear] = useState(new Date().getFullYear())

  return (
    <div className="space-y-4">
      <QuarterCalendar
        startYear={filterYear}
        value={filterQuarter}
        onChange={setFilterQuarter}
        onNavigate={(direction, year) => setFilterYear(year)}
        minYear={2020}
        maxYear={new Date().getFullYear() + 1}
        locale="zh-CN"
        className="w-48 rounded-xl border"
      />

      {filterQuarter && (
        <div>
          <h3>Filter Applied:</h3>
          <p>{filterQuarter.label}</p>
          <p>Months: {filterQuarter.months.join(", ")}</p>
        </div>
      )}
    </div>
  )
}
```

### Multi-Language Quarter Selector

```tsx
function MultiLanguageQuarterSelector() {
  const [locale, setLocale] = useState("en-US")
  const [selectedQuarter, setSelectedQuarter] = useState<Quarter | null>(null)

  const localeOptions = [
    { code: "zh-CN", name: "中文" },
    { code: "en-US", name: "English" },
    { code: "ja-JP", name: "日本語" },
    { code: "ko-KR", name: "한국어" },
  ]

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

      <QuarterCalendar
        locale={locale}
        value={selectedQuarter}
        onChange={setSelectedQuarter}
        className="w-48 rounded-xl border"
      />
    </div>
  )
}
```

## Utility Functions

The component provides utility functions for working with quarters:

```tsx
import { getCurrentQuarter, getYearQuarters, isQuarterEqual } from "@choiceform/design-system"

// Get current quarter
const currentQuarter = getCurrentQuarter(2025, "en-US")

// Get all quarters for a year
const quartersIn2025 = getYearQuarters(2025, "zh-CN")

// Compare quarters
const isSelected = isQuarterEqual(selectedQuarter, currentQuarter)
```

## Keyboard Navigation

- **Arrow Keys**: Navigate between quarters
- **Enter/Space**: Select current quarter
- **Home**: Go to Q1 of current year
- **End**: Go to Q4 of current year
- **Page Up**: Navigate to previous year
- **Page Down**: Navigate to next year
- **Tab**: Move focus in/out of component

## Styling

The component uses Tailwind CSS variants for different states:

- **Selected**: Highlighted background and border
- **Current**: Special indication for current quarter
- **Disabled**: Reduced opacity and no interaction
- **Hover**: Subtle highlight on hover
- **Focus**: Clear focus indicators for accessibility

### Custom Styling

```tsx
<QuarterCalendar
  className="w-64 rounded-2xl border-2 border-blue-200 shadow-lg"
  // Component handles internal styling automatically
/>
```

## Best Practices

- **Business Context**: Use appropriate year ranges based on business requirements
- **Clear Selection**: Provide clear visual feedback for selected quarters
- **Consistent Labeling**: Use consistent quarter labeling across your application
- **International Support**: Test with multiple locales for international applications
- **Accessibility**: Ensure keyboard navigation works for all users
- **Disabled States**: Use disabled quarters to enforce business rules
- **Performance**: Component handles state efficiently with minimal re-renders

## Integration Examples

### With Form Validation

```tsx
import { useForm } from "react-hook-form"

function QuarterForm() {
  const { register, watch, setValue } = useForm()
  const selectedQuarter = watch("quarter")

  return (
    <form>
      <QuarterCalendar
        value={selectedQuarter}
        onChange={(quarter) => setValue("quarter", quarter)}
        className="w-48 rounded-xl border"
      />
      {!selectedQuarter && <p className="text-red-500">Please select a quarter</p>}
    </form>
  )
}
```

### With Data Filtering

```tsx
function DataDashboard() {
  const [selectedQuarter, setSelectedQuarter] = useState<Quarter | null>(null)
  const [data, setData] = useState([])

  useEffect(() => {
    if (selectedQuarter) {
      // Filter data by selected quarter
      const filteredData = fetchQuarterlyData(selectedQuarter)
      setData(filteredData)
    }
  }, [selectedQuarter])

  return (
    <div>
      <QuarterCalendar
        value={selectedQuarter}
        onChange={setSelectedQuarter}
      />
      <DataTable data={data} />
    </div>
  )
}
```

## Notes

- Component automatically highlights the current quarter based on today's date
- Year navigation boundaries are enforced automatically
- Disabled quarters cannot be selected but remain visible for context
- Quarter objects contain both numeric and localized string representations
- Component state is managed efficiently to prevent unnecessary re-renders
- Supports both controlled and uncontrolled usage patterns
- All date calculations respect locale and timezone settings
