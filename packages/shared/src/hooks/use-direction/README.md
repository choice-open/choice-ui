# useDirection

A React hook for managing text direction (LTR/RTL) in internationalized applications with context support.

## Import

```typescript
import { useDirection, DirectionContext } from "@choiceform/design-system/hooks"
```

## Usage

```typescript
// Basic usage
const direction = useDirection()  // Returns "ltr" by default

// With prop override
const direction = useDirection("rtl")  // Returns "rtl"

// With context provider
<DirectionContext.Provider value="rtl">
  <MyComponent />  // Will use "rtl" direction
</DirectionContext.Provider>

// Priority: prop > context > default ("ltr")
```

## API

### useDirection

```typescript
function useDirection(dirProp?: Direction): Direction

type Direction = "ltr" | "rtl"
```

#### Parameters

- `dirProp` - Optional direction value passed via props

#### Returns

The resolved text direction following this priority:

1. Prop value (if provided)
2. Context value (if available)
3. Default value ("ltr")

### DirectionContext

```typescript
const DirectionContext = React.createContext<Direction | undefined>(undefined)
```

A React context for providing direction values to child components.

## Features

- **Flexible direction control**: Override at any component level
- **Context-based inheritance**: Set direction once for entire subtrees
- **RTL support**: Full support for right-to-left languages
- **Priority system**: Clear precedence rules for direction resolution
- **TypeScript support**: Fully typed for "ltr" and "rtl" values

## Examples

### Basic Component with Direction

```typescript
function Button({ dir, children, ...props }) {
  const direction = useDirection(dir)

  return (
    <button
      dir={direction}
      className={direction === 'rtl' ? 'text-right' : 'text-left'}
      {...props}
    >
      {children}
    </button>
  )
}
```

### Internationalized App Layout

```typescript
function App({ locale }) {
  // Determine direction based on locale
  const appDirection = locale === 'ar' || locale === 'he' ? 'rtl' : 'ltr'

  return (
    <DirectionContext.Provider value={appDirection}>
      <html dir={appDirection}>
        <body>
          <Layout />  {/* All children inherit direction */}
        </body>
      </html>
    </DirectionContext.Provider>
  )
}
```

### Direction-Aware Component

```typescript
function NavigationMenu({ items }) {
  const direction = useDirection()

  return (
    <nav className={`flex ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
      {items.map(item => (
        <NavItem
          key={item.id}
          {...item}
          iconPosition={direction === 'rtl' ? 'right' : 'left'}
        />
      ))}
    </nav>
  )
}
```

### Mixed Direction Content

```typescript
function Article({ content, quotes }) {
  const mainDirection = useDirection()

  return (
    <article dir={mainDirection}>
      <p>{content}</p>

      {/* English quote in Arabic article */}
      <blockquote dir="ltr" lang="en">
        {quotes.english}
      </blockquote>

      {/* Arabic quote in English article */}
      <blockquote dir="rtl" lang="ar">
        {quotes.arabic}
      </blockquote>
    </article>
  )
}
```

### Direction-Based Styling

```typescript
function Card({ dir, children }) {
  const direction = useDirection(dir)

  const styles = {
    ltr: {
      paddingLeft: '20px',
      borderLeft: '4px solid blue',
      textAlign: 'left'
    },
    rtl: {
      paddingRight: '20px',
      borderRight: '4px solid blue',
      textAlign: 'right'
    }
  }

  return (
    <div dir={direction} style={styles[direction]}>
      {children}
    </div>
  )
}
```

### Form with Direction Support

```typescript
function Form({ onSubmit }) {
  const direction = useDirection()

  return (
    <form onSubmit={onSubmit} dir={direction}>
      <label>
        {direction === 'rtl' ? 'الاسم:' : 'Name:'}
        <input
          type="text"
          style={{ textAlign: direction === 'rtl' ? 'right' : 'left' }}
        />
      </label>

      <button type="submit">
        {direction === 'rtl' ? 'إرسال' : 'Submit'}
      </button>
    </form>
  )
}
```

### Nested Direction Contexts

```typescript
function Page() {
  return (
    <DirectionContext.Provider value="rtl">
      <Header />  {/* RTL */}

      <DirectionContext.Provider value="ltr">
        <CodeBlock />  {/* LTR for code */}
      </DirectionContext.Provider>

      <Footer />  {/* RTL */}
    </DirectionContext.Provider>
  )
}
```

## Best Practices

1. **Set direction at the root**: Provide direction context at the app level
2. **Use semantic HTML**: Always set the `dir` attribute on elements
3. **Consider mixed content**: Support different directions for quotes, code, etc.
4. **Test both directions**: Ensure UI works correctly in both LTR and RTL
5. **Use logical properties**: Prefer `start/end` over `left/right` in styles

## Common Patterns

### With Tailwind CSS

```typescript
function Component() {
  const direction = useDirection()

  return (
    <div className={tcx(
      "flex items-center gap-2",
      direction === 'rtl' ? "flex-row-reverse" : "flex-row"
    )}>
      <Icon />
      <Text />
    </div>
  )
}
```

### With CSS-in-JS

```typescript
const useStyles = () => {
  const direction = useDirection()

  return {
    container: {
      display: "flex",
      flexDirection: direction === "rtl" ? "row-reverse" : "row",
      paddingInlineStart: "1rem",
      paddingInlineEnd: "1rem",
    },
  }
}
```

## Notes

- The hook always returns a valid direction ("ltr" or "rtl")
- Context values propagate through React component trees
- Direction changes trigger re-renders for consuming components
- Consider performance when using in many components
- Works with SSR when context is properly provided
