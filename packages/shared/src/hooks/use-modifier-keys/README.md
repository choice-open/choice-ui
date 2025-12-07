# useModifierKeys

A React hook for tracking the state of keyboard modifier keys (Shift, Ctrl, Meta/Alt) globally across the application.

## Import

```typescript
import { useModifierKeys } from "@choiceform/design-system/hooks"
```

## Usage

```typescript
// Basic usage
function Component() {
  const { shiftPressed, metaPressed, ctrlPressed } = useModifierKeys()

  return (
    <div>
      <p>Shift: {shiftPressed ? 'Pressed' : 'Released'}</p>
      <p>Meta/Alt: {metaPressed ? 'Pressed' : 'Released'}</p>
      <p>Ctrl: {ctrlPressed ? 'Pressed' : 'Released'}</p>
    </div>
  )
}

// With conditional logic
function InteractiveElement() {
  const { shiftPressed, ctrlPressed } = useModifierKeys()

  const handleClick = () => {
    if (shiftPressed) {
      console.log('Shift+Click: Multi-select')
    } else if (ctrlPressed) {
      console.log('Ctrl+Click: Open in new tab')
    } else {
      console.log('Regular click')
    }
  }

  return <button onClick={handleClick}>Click me</button>
}

// Disable when not needed
const { shiftPressed } = useModifierKeys(disabled)
```

## API

### useModifierKeys

```typescript
function useModifierKeys(disabled?: boolean): ModifierKeyState

interface ModifierKeyState {
  shiftPressed: boolean // Shift key state
  metaPressed: boolean // Meta (Cmd) or Alt key state
  ctrlPressed: boolean // Ctrl key state
}
```

#### Parameters

- `disabled` - Optional boolean to disable event listeners (default: `false`)

#### Returns

An object containing the state of all modifier keys:

- `shiftPressed` - Whether Shift key is currently pressed
- `metaPressed` - Whether Meta (⌘) or Alt key is currently pressed
- `ctrlPressed` - Whether Ctrl key is currently pressed

## Features

- **Global tracking**: Monitors modifier keys across the entire application
- **Real-time updates**: State updates immediately on key press/release
- **Cross-platform**: Handles Meta (Mac) and Alt keys uniformly
- **Performance optimized**: Can be disabled when not needed
- **Clean up**: Automatically removes event listeners on unmount

## Examples

### Multi-Selection List

```typescript
function SelectableList({ items }) {
  const { shiftPressed, ctrlPressed } = useModifierKeys()
  const [selectedItems, setSelectedItems] = useState(new Set())
  const [lastSelectedIndex, setLastSelectedIndex] = useState(-1)

  const handleItemClick = (index: number, item: any) => {
    if (shiftPressed && lastSelectedIndex !== -1) {
      // Range selection
      const start = Math.min(lastSelectedIndex, index)
      const end = Math.max(lastSelectedIndex, index)
      const newSelection = new Set(selectedItems)

      for (let i = start; i <= end; i++) {
        newSelection.add(items[i].id)
      }
      setSelectedItems(newSelection)
    } else if (ctrlPressed) {
      // Toggle individual item
      const newSelection = new Set(selectedItems)
      if (newSelection.has(item.id)) {
        newSelection.delete(item.id)
      } else {
        newSelection.add(item.id)
      }
      setSelectedItems(newSelection)
    } else {
      // Single selection
      setSelectedItems(new Set([item.id]))
    }

    setLastSelectedIndex(index)
  }

  return (
    <div className="list">
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`item ${selectedItems.has(item.id) ? 'selected' : ''}`}
          onClick={() => handleItemClick(index, item)}
        >
          {item.name}
        </div>
      ))}
    </div>
  )
}
```

### Enhanced Button Interactions

```typescript
function SmartButton({ onPrimaryAction, onSecondaryAction, onSpecialAction }) {
  const { shiftPressed, ctrlPressed } = useModifierKeys()

  const handleClick = () => {
    if (shiftPressed && ctrlPressed) {
      onSpecialAction?.()
    } else if (shiftPressed) {
      onSecondaryAction?.()
    } else {
      onPrimaryAction()
    }
  }

  const getActionText = () => {
    if (shiftPressed && ctrlPressed) return 'Special Action'
    if (shiftPressed) return 'Secondary Action'
    return 'Primary Action'
  }

  return (
    <button onClick={handleClick} title={getActionText()}>
      {getActionText()}
    </button>
  )
}
```

### Context Menu with Modifiers

```typescript
function ContextMenuItem({ onAction, item }) {
  const { shiftPressed, ctrlPressed } = useModifierKeys()

  const handleAction = () => {
    const modifiers = {
      shift: shiftPressed,
      ctrl: ctrlPressed
    }
    onAction(item, modifiers)
  }

  return (
    <div className="context-menu-item" onClick={handleAction}>
      {item.label}
      {shiftPressed && <span className="modifier-hint">+Shift</span>}
      {ctrlPressed && <span className="modifier-hint">+Ctrl</span>}
    </div>
  )
}
```

### Drawing Canvas

```typescript
function DrawingCanvas() {
  const { shiftPressed, ctrlPressed } = useModifierKeys()
  const [isDrawing, setIsDrawing] = useState(false)
  const [tool, setTool] = useState('pen')

  const getCurrentTool = () => {
    if (shiftPressed) return 'line'      // Straight line mode
    if (ctrlPressed) return 'erase'      // Erase mode
    return tool
  }

  const handleMouseDown = (e) => {
    setIsDrawing(true)
    const currentTool = getCurrentTool()
    console.log(`Started drawing with: ${currentTool}`)
  }

  const handleMouseMove = (e) => {
    if (!isDrawing) return

    const currentTool = getCurrentTool()
    // Drawing logic based on current tool
  }

  return (
    <div>
      <div className="toolbar">
        <span>Tool: {getCurrentTool()}</span>
        <span className="hint">
          Hold Shift for line, Ctrl for erase
        </span>
      </div>
      <canvas
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setIsDrawing(false)}
      />
    </div>
  )
}
```

### Keyboard Shortcuts Display

```typescript
function ShortcutDisplay() {
  const { shiftPressed, metaPressed, ctrlPressed } = useModifierKeys()

  const activeModifiers = [
    shiftPressed && 'Shift',
    metaPressed && (navigator.platform.includes('Mac') ? 'Cmd' : 'Alt'),
    ctrlPressed && 'Ctrl'
  ].filter(Boolean)

  return (
    <div className="shortcuts">
      <h3>Active Modifiers:</h3>
      <div className="modifier-display">
        {activeModifiers.length > 0 ? (
          activeModifiers.map(mod => (
            <kbd key={mod} className="active-key">{mod}</kbd>
          ))
        ) : (
          <span>No modifiers pressed</span>
        )}
      </div>

      <div className="available-shortcuts">
        <p>Available shortcuts:</p>
        <ul>
          <li><kbd>Ctrl</kbd> + <kbd>C</kbd> Copy</li>
          <li><kbd>Ctrl</kbd> + <kbd>V</kbd> Paste</li>
          <li><kbd>Shift</kbd> + Click: Multi-select</li>
        </ul>
      </div>
    </div>
  )
}
```

### File Manager Actions

```typescript
function FileManager({ files }) {
  const { shiftPressed, ctrlPressed } = useModifierKeys()

  const handleFileDoubleClick = (file) => {
    if (ctrlPressed) {
      // Open in new window
      window.open(`/file/${file.id}`, '_blank')
    } else if (shiftPressed) {
      // Open with different application
      openWith(file)
    } else {
      // Default open
      openFile(file)
    }
  }

  const handleFileDrop = (files, targetFolder) => {
    if (shiftPressed) {
      // Move files
      moveFiles(files, targetFolder)
    } else if (ctrlPressed) {
      // Copy files
      copyFiles(files, targetFolder)
    } else {
      // Ask user
      showMoveOrCopyDialog(files, targetFolder)
    }
  }

  return (
    <div className="file-manager">
      <div className="status-bar">
        {shiftPressed && <span>Move mode active</span>}
        {ctrlPressed && <span>Copy mode active</span>}
      </div>
      {/* File list */}
    </div>
  )
}
```

### Conditional Rendering

```typescript
function DevTools() {
  const { shiftPressed, ctrlPressed } = useModifierKeys()
  const [isDevMode] = useState(process.env.NODE_ENV === 'development')

  // Show debug info only when both Shift+Ctrl are pressed in dev mode
  const showDebugInfo = isDevMode && shiftPressed && ctrlPressed

  return (
    <div>
      <YourComponent />
      {showDebugInfo && (
        <div className="debug-overlay">
          <h3>Debug Information</h3>
          <pre>{JSON.stringify(debugData, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
```

## Use Cases

1. **Multi-selection interfaces**: Lists, tables, file managers
2. **Enhanced button actions**: Different actions based on modifiers
3. **Drawing applications**: Tool switching with modifier keys
4. **Context menus**: Modified actions based on key state
5. **Keyboard shortcuts**: Visual feedback for active modifiers
6. **Development tools**: Debug modes triggered by key combinations

## Platform Differences

The hook handles platform differences automatically:

- **Windows/Linux**: Uses `altKey` for Meta state
- **macOS**: Uses `metaKey` for Meta state (⌘ Command key)
- Both are tracked under the `metaPressed` state

## Performance Considerations

- The hook attaches global event listeners to `window` with capture phase for comprehensive coverage
- Use the `disabled` parameter when the component doesn't need modifier tracking
- Event listeners are automatically cleaned up on component unmount

## Best Practices

1. **Use sparingly**: Only enable when actually needed
2. **Provide visual feedback**: Show users which modifiers are active
3. **Document shortcuts**: Make modifier behavior clear to users
4. **Handle combinations**: Consider multiple modifier combinations
5. **Test across platforms**: Verify behavior on different operating systems

## Notes

- Event listeners are attached to `window` with capture phase for global coverage, including when inputs are focused
- The hook uses `useCallback` to prevent unnecessary re-renders
- State updates are immediate and synchronous
- Works with both synthetic and native keyboard events
- Meta key includes both Command (Mac) and Alt keys for cross-platform compatibility
- **Fixed**: Now properly tracks modifier keys even when input elements are focused
- **Enhanced**: Includes mouse event handling for more reliable state tracking
- **Robust**: Handles window focus/blur events to reset states appropriately
