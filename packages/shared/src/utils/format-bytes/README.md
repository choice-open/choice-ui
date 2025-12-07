# formatBytes

A utility function for converting byte values into human-readable file size strings.

## Import

```typescript
import { formatBytes } from "@choiceform/design-system/utils"
```

## Usage

```typescript
// Basic usage
formatBytes(1024) // "1 KB"
formatBytes(1048576) // "1 MB"
formatBytes(1073741824) // "1 GB"

// Edge cases
formatBytes(0) // "0 B"
formatBytes(512) // "512 B"
formatBytes(1536) // "1.5 KB"
formatBytes(10485760) // "10.0 MB"
```

## API

### formatBytes

```typescript
function formatBytes(bytes: number): string
```

#### Parameters

- `bytes` - The number of bytes to format

#### Returns

A formatted string representing the file size with appropriate unit (B, KB, MB, GB, TB).

## Features

- **Automatic unit selection**: Chooses the most appropriate unit based on file size
- **Precise formatting**: Shows decimal places for values above 1 KB
- **Human-readable output**: Returns clean, easy-to-read file size strings
- **Handles edge cases**: Properly formats zero bytes and very large files
- **Supports up to TB**: Handles file sizes from bytes to terabytes

## Examples

### File Upload Display

```typescript
function FileUpload({ file }) {
  return (
    <div className="file-info">
      <span>{file.name}</span>
      <span className="file-size">{formatBytes(file.size)}</span>
    </div>
  )
}
```

### Download Progress

```typescript
function DownloadProgress({ downloaded, total }) {
  return (
    <div className="progress">
      <span>{formatBytes(downloaded)} / {formatBytes(total)}</span>
      <progress value={downloaded} max={total} />
    </div>
  )
}
```

### Storage Usage

```typescript
function StorageIndicator({ used, total }) {
  const percentage = (used / total) * 100

  return (
    <div className="storage">
      <div className="storage-bar" style={{ width: `${percentage}%` }} />
      <span>{formatBytes(used)} of {formatBytes(total)} used</span>
    </div>
  )
}
```

## Implementation Details

The function uses a logarithmic calculation to determine the appropriate unit:

- Divides by 1024 for each unit level (B → KB → MB → GB → TB)
- Uses `toFixed()` for formatting decimal places
- Returns whole numbers for byte values, one decimal place for larger units

## Notes

- The function uses binary units (1 KB = 1024 bytes) rather than decimal units
- Maximum supported unit is TB (terabytes)
- Always returns a string with unit suffix
- Does not support negative byte values
