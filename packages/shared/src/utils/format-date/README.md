# formatDate

A comprehensive date formatting utility with internationalization support and intelligent relative time display.

## Import

```typescript
import { formatRelativeTime } from "@choiceform/design-system/utils"
```

## Usage

```typescript
// Basic usage
formatRelativeTime(new Date()) // "a few seconds ago"
formatRelativeTime(yesterday) // "Yesterday"
formatRelativeTime(lastWeek) // "5 days ago"

// With Chinese locale
formatRelativeTime(new Date(), { language: "cn" }) // "几秒前"
formatRelativeTime(yesterday, { language: "cn" }) // "昨天"

// Show specific time
formatRelativeTime(new Date(), {
  showSpecificTime: true,
  language: "en",
}) // "Today at 2:30 PM"

// Custom thresholds
formatRelativeTime(oldDate, {
  daysThreshold: 30, // Show relative time up to 30 days
  yearThreshold: 2, // Show year for dates older than 2 years
})
```

## API

### formatRelativeTime

```typescript
function formatRelativeTime(date: Date, options?: FormatRelativeTimeOptions): string
```

#### Parameters

- `date` - The date to format
- `options` - Optional configuration object

#### Options

```typescript
interface FormatRelativeTimeOptions {
  language?: "en" | "cn" // Language for formatting (default: "en")
  showSpecificTime?: boolean // Show time for today/yesterday (default: false)
  daysThreshold?: number // Days before showing date format (default: 7)
  yearThreshold?: number // Years before showing year (default: 1)
  customLocale?: Locale // Custom date-fns locale object
}
```

#### Returns

A formatted string representing the date in relative or absolute format.

## Features

- **Intelligent formatting**: Automatically chooses the best format based on time distance
- **Internationalization**: Built-in support for English and Chinese with extensible locale system
- **Relative time**: Shows human-friendly relative times (e.g., "2 hours ago", "Yesterday")
- **Smart thresholds**: Configurable breakpoints for when to switch formatting styles
- **Time display options**: Optional time display for recent dates
- **Locale customization**: Support for custom date-fns locales

## Formatting Rules

The utility follows these intelligent formatting rules:

### Today

- Without time: "Today" / "今天"
- With time: "Today at 2:30 PM" / "今天 下午2:30"

### Yesterday

- Without time: "Yesterday" / "昨天"
- With time: "Yesterday at 3:45 PM" / "昨天 下午3:45"

### This Week (within daysThreshold)

- Shows relative time: "2 days ago" / "2天前"
- Or with time: "Monday at 10:00 AM" / "周一 上午10:00"

### Within Current Year

- Shows month and day: "March 15" / "3月15日"
- With time: "March 15 at 2:00 PM" / "3月15日 下午2:00"

### Beyond yearThreshold

- Shows full date: "2022/03/15" / "2022年3月15日"

## Examples

### Comment Timestamps

```typescript
function Comment({ createdAt }) {
  return (
    <div className="comment">
      <time dateTime={createdAt.toISOString()}>
        {formatRelativeTime(createdAt, { language: "en" })}
      </time>
    </div>
  )
}
```

### Activity Feed

```typescript
function ActivityItem({ activity, locale }) {
  return (
    <div className="activity-item">
      <span>{activity.description}</span>
      <span className="timestamp">
        {formatRelativeTime(activity.date, {
          language: locale,
          showSpecificTime: true
        })}
      </span>
    </div>
  )
}
```

### File Modified Date

```typescript
function FileInfo({ file }) {
  return (
    <div className="file-info">
      <span>{file.name}</span>
      <span className="modified">
        Modified {formatRelativeTime(file.modifiedDate, {
          daysThreshold: 30,
          yearThreshold: 2
        })}
      </span>
    </div>
  )
}
```

### Multi-language Support

```typescript
function InternationalDate({ date, userLanguage }) {
  // Auto-detect language preference
  const language = userLanguage === 'zh-CN' ? 'cn' : 'en'

  return (
    <time dateTime={date.toISOString()}>
      {formatRelativeTime(date, { language })}
    </time>
  )
}
```

## Internationalization

The utility includes built-in language configurations:

### English (en)

- Natural language relative times
- 12-hour time format with AM/PM
- Month names in English

### Chinese (cn)

- Chinese relative time indicators
- 24-hour time format by default
- Chinese month and weekday names

### Custom Locales

You can provide custom date-fns locales:

```typescript
import { fr } from "date-fns/locale"

formatRelativeTime(date, {
  customLocale: fr,
  language: "en", // Fallback for relative terms
})
```

## Notes

- Invalid dates return "Invalid Date" with a console warning
- The function uses date-fns internally for reliable date operations
- Relative times update dynamically (e.g., "1 minute ago" → "2 minutes ago")
- Time zones are handled according to the user's local time
- The utility is optimized for display in user interfaces, not for data storage
