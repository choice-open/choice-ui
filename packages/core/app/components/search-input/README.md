# SearchInput

A specialized search input component built on top of TextField, featuring a search icon prefix and clear button suffix. It provides an intuitive search experience with proper internationalization support and accessible interactions.

## Import

```tsx
import { SearchInput } from "@choiceform/design-system"
```

## Features

- Built on TextField for consistent behavior and styling
- Search icon prefix for clear visual indication
- Clear button that appears when input has content
- Internationalization support for labels and tooltips
- Multiple visual variants (default, light, dark, reset)
- All TextField features: sizes, states, and accessibility
- Automatic focus management and keyboard navigation
- Tooltip support on clear button

## Usage

### Basic

```tsx
<SearchInput
  value={searchQuery}
  onChange={setSearchQuery}
/>
```

### With custom placeholder

```tsx
<SearchInput
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="Search products..."
/>
```

### Variants

```tsx
// Default - follows page theme
<SearchInput variant="default" value={query} onChange={setQuery} />

// Light - fixed light appearance
<SearchInput variant="light" value={query} onChange={setQuery} />

// Dark - fixed dark appearance
<SearchInput variant="dark" value={query} onChange={setQuery} />

// Reset - no variant styling
<SearchInput variant="reset" value={query} onChange={setQuery} />
```

### With internationalization

```tsx
<SearchInput
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="Search..."
  i18n={{
    clear: "Clear search",
    placeholder: "Search for anything...",
  }}
/>
```

### Disabled state

```tsx
<SearchInput
  disabled
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="Search disabled..."
/>
```

### Large size

```tsx
<SearchInput
  size="large"
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="Large search input..."
/>
```

## Props

```ts
interface SearchInputProps extends TextFieldProps {
  /** Internationalization configuration */
  i18n?: {
    clear: string
    placeholder: string
  }
}
```

Inherits all props from `TextFieldProps`, including:

- `value?: string` - Current search value
- `onChange?: (value: string) => void` - Callback when value changes
- `placeholder?: string` - Placeholder text (defaults to "Search...")
- `variant?: "default" | "light" | "dark" | "reset"` - Visual style variant
- `size?: "default" | "large"` - Input size
- `disabled?: boolean` - Whether the input is disabled
- All other standard HTML input attributes

- Defaults:
  - `placeholder`: "Search..."
  - `variant`: "default" (follows page theme)
  - `i18n.clear`: "Clear"

- Variant options:
  - `default`: Follows the page theme dynamically (light/dark mode)
  - `light`: Fixed light appearance regardless of theme
  - `dark`: Fixed dark appearance regardless of theme
  - `reset`: Removes variant styling, no variant settings applied

- Behavior:
  - Search icon is always visible in the prefix position
  - Clear button appears only when there's content to clear
  - Clear button includes tooltip for accessibility
  - All TextField behaviors are inherited (focus selection, editing states, etc.)

## Styling

- This component uses Tailwind CSS via `tailwind-variants` in `tv.ts` with slots.
- Built on TextField, so inherits all TextField styling capabilities
- Slots available: `icon`, `action`
- Search icon color adapts based on variant and interaction states
- Clear button integrates seamlessly with the input design

## Accessibility

- Search icon provides visual context for screen readers
- Clear button includes tooltip with descriptive text
- Supports all TextField accessibility features
- Keyboard navigation works seamlessly (Tab to clear button)
- Clear button is focusable and clickable
- Proper ARIA attributes inherited from TextField

## Internationalization

The component supports customizing text through the `i18n` prop:

```tsx
<SearchInput
  value={query}
  onChange={setQuery}
  i18n={{
    clear: "Effacer", // French
    placeholder: "Rechercher...",
  }}
/>
```

## Best practices

- Use clear, descriptive placeholder text that matches your search context
- Provide appropriate internationalization for multi-language applications
- Consider debouncing the onChange callback for performance with large datasets
- Use the appropriate variant to match your application's theme
- Ensure the clear functionality provides immediate visual feedback

## Examples

### Product search with debouncing

```tsx
import { useDebouncedCallback } from 'use-debounce'

const [query, setQuery] = useState("")
const [results, setResults] = useState([])

const debouncedSearch = useDebouncedCallback(
  async (searchQuery: string) => {
    if (searchQuery.trim()) {
      const results = await searchProducts(searchQuery)
      setResults(results)
    } else {
      setResults([])
    }
  },
  300
)

<SearchInput
  value={query}
  onChange={(value) => {
    setQuery(value)
    debouncedSearch(value)
  }}
  placeholder="Search products..."
/>
```

### Search in dark theme with custom clear text

```tsx
<SearchInput
  variant="dark"
  size="large"
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="Search documentation..."
  i18n={{
    clear: "Clear search query",
  }}
/>
```

### Search with external clear control

```tsx
const [query, setQuery] = useState("")

<div className="flex items-center gap-2">
  <SearchInput
    value={query}
    onChange={setQuery}
    placeholder="Search files..."
  />
  <Button
    variant="secondary"
    onClick={() => setQuery("")}
    disabled={!query}
  >
    Clear All
  </Button>
</div>
```

### Controlled search with validation

```tsx
const [query, setQuery] = useState("")
const [isValid, setIsValid] = useState(true)

<SearchInput
  value={query}
  onChange={(value) => {
    setQuery(value)
    setIsValid(value.length === 0 || value.length >= 3)
  }}
  selected={!isValid}
  placeholder="Search (minimum 3 characters)..."
/>
```

## Integration with TextField

Since SearchInput is built on TextField, you can use it with all TextField features:

```tsx
<SearchInput
  value={query}
  onChange={setQuery}
>
  <SearchInput.Label>Search Query</SearchInput.Label>
  <SearchInput.Description>Enter keywords to find relevant content</SearchInput.Description>
</SearchInput>
```

## Notes

- The clear button uses IconButton with ghost variant for consistent styling
- Search icon color automatically adapts to hover and focus states
- Component is fully controlled - always provide both `value` and `onChange`
- Clear functionality calls `onChange` with an empty string
- The component maintains all TextField's advanced features like editing state tracking
