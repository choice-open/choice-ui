# Tabs

A controlled tab navigation component for organizing content into multiple panels. Supports text, icons, mixed content, and different visual variants.

## Import

```tsx
import { Tabs } from "@choiceform/design-system"
```

## Features

- Controlled component with required `value` and `onChange` props
- Support for text, icon-only, and mixed content tabs
- Multiple visual variants (default and dark)
- Keyboard navigation support (arrow keys, Home, End)
- Individual tab disable functionality
- Flexible content rendering through compound components
- Proper accessibility with ARIA roles and attributes

## Usage

### Basic Tabs

```tsx
const [selectedTab, setSelectedTab] = useState("tab1")

return (
  <Tabs
    value={selectedTab}
    onChange={(value) => setSelectedTab(value)}
  >
    <Tabs.Item value="tab1">Tab 1</Tabs.Item>
    <Tabs.Item value="tab2">Tab 2</Tabs.Item>
    <Tabs.Item value="tab3">Tab 3</Tabs.Item>
  </Tabs>
)
```

### Default Value (Initial State)

Since this is a controlled component, set the default value through initial state:

```tsx
const [selectedTab, setSelectedTab] = useState("analytics")

return (
  <Tabs
    value={selectedTab}
    onChange={(value) => setSelectedTab(value)}
  >
    <Tabs.Item value="overview">Overview</Tabs.Item>
    <Tabs.Item value="settings">Settings</Tabs.Item>
    <Tabs.Item value="analytics">Analytics</Tabs.Item>
  </Tabs>
)
```

### Disabled Tabs

```tsx
const [selectedTab, setSelectedTab] = useState("settings")

return (
  <Tabs
    value={selectedTab}
    onChange={(value) => setSelectedTab(value)}
  >
    <Tabs.Item
      value="overview"
      disabled
    >
      Overview
    </Tabs.Item>
    <Tabs.Item
      value="settings"
      disabled
    >
      Settings
    </Tabs.Item>
    <Tabs.Item
      value="analytics"
      disabled
    >
      Analytics
    </Tabs.Item>
  </Tabs>
)
```

### Icon Tabs

```tsx
import { ThemeSunBright, ThemeMoonDark, ThemeSystem } from "@choiceform/icons-react"

const [selectedTab, setSelectedTab] = useState("sun")

return (
  <Tabs
    value={selectedTab}
    onChange={(value) => setSelectedTab(value)}
  >
    <Tabs.Item
      value="sun"
      aria-label="Sun"
    >
      <ThemeSunBright />
    </Tabs.Item>
    <Tabs.Item
      value="moon"
      aria-label="Moon"
    >
      <ThemeMoonDark />
    </Tabs.Item>
    <Tabs.Item
      value="system"
      aria-label="System"
    >
      <ThemeSystem />
    </Tabs.Item>
  </Tabs>
)
```

### Mixed Content Tabs

```tsx
const [selectedTab, setSelectedTab] = useState("sun")

return (
  <Tabs
    value={selectedTab}
    onChange={(value) => setSelectedTab(value)}
  >
    <Tabs.Item
      value="sun"
      aria-label="Sun"
    >
      <div className="flex items-center gap-1">
        <ThemeSunBright />
        <span>Sun</span>
      </div>
    </Tabs.Item>
    <Tabs.Item
      value="moon"
      aria-label="Moon"
    >
      <div className="flex items-center gap-1">
        <ThemeMoonDark />
        <span>Moon</span>
      </div>
    </Tabs.Item>
    <Tabs.Item
      value="system"
      aria-label="System"
    >
      <div className="flex items-center gap-1">
        <ThemeSystem />
        <span>System</span>
      </div>
    </Tabs.Item>
  </Tabs>
)
```

### Dark Variant

```tsx
const [selectedTab, setSelectedTab] = useState("tab1")

return (
  <div className="rounded-xl bg-gray-900 p-8">
    <Tabs
      value={selectedTab}
      onChange={(value) => setSelectedTab(value)}
      variant="dark"
    >
      <Tabs.Item value="tab1">Tab 1</Tabs.Item>
      <Tabs.Item value="tab2">Tab 2</Tabs.Item>
      <Tabs.Item value="tab3">Tab 3</Tabs.Item>
    </Tabs>
  </div>
)
```

## Props

### Tabs

```tsx
interface TabsProps extends Omit<HTMLProps<HTMLDivElement>, "onChange"> {
  /** Child Tabs.Item components */
  children?: ReactNode

  /** Additional CSS classes */
  className?: string

  /** Whether the entire tabs component is disabled */
  disabled?: boolean

  /** Tab selection change handler */
  onChange?: (value: string) => void

  /** Currently selected tab value */
  value: string

  /** Visual variant */
  variant?: "default" | "light" | "dark" | "reset"
}
```

- Required props: `value`
- Defaults:
  - `variant`: `"default"`

### Tabs.Item

```tsx
interface TabItemProps extends Omit<HTMLProps<HTMLButtonElement>, "value"> {
  /** Child content (text, icons, or mixed) */
  children?: ReactNode

  /** Additional CSS classes */
  className?: string

  /** Disable this tab */
  disabled?: boolean

  /** Unique identifier for this tab */
  value: string
}
```

- Required props: `value`
- Defaults:
  - `disabled`: `false`

## Components

### Tabs

The root tabs container that manages state and provides context.

### Tabs.Item

Individual tab item that can contain text, icons, or complex content.

## Styling

- Uses Tailwind CSS via `tailwind-variants`
- Two visual variants: `default` and `dark`
- Customizable with `className` prop
- Smooth hover and focus transitions
- Active state highlighting
- Disabled state styling

## Best Practices

### Usage Guidelines

- Always use as a controlled component with `value` and `onChange`
- Provide meaningful tab labels that describe their content
- Use `aria-label` for icon-only tabs to ensure accessibility
- Keep the number of tabs reasonable (typically 2-7 tabs)
- Consider the dark variant for dark backgrounds or themes

### Content Guidelines

- Use clear, concise tab labels
- Maintain consistent content types across tabs
- For icon tabs, ensure icons are universally understood
- Mixed content should balance text and visual elements

### Accessibility

- Provides proper ARIA roles (`tablist`, `tab`)
- Supports keyboard navigation:
  - Arrow keys to move between tabs
  - Home/End to jump to first/last tab
  - Space/Enter to activate tabs
- Uses `aria-selected` to indicate active tab
- Respects `disabled` state for keyboard navigation
- Announces tab changes to screen readers

### Performance

- Minimal re-renders through controlled state management
- Efficient event handling with proper callback patterns
- No unnecessary DOM updates for inactive tabs

## Examples

### Settings Panel

```tsx
const [activeTab, setActiveTab] = useState("general")

return (
  <div className="space-y-4">
    <Tabs
      value={activeTab}
      onChange={setActiveTab}
    >
      <Tabs.Item value="general">General</Tabs.Item>
      <Tabs.Item value="privacy">Privacy</Tabs.Item>
      <Tabs.Item value="security">Security</Tabs.Item>
      <Tabs.Item value="notifications">Notifications</Tabs.Item>
    </Tabs>

    <div className="mt-6">
      {activeTab === "general" && <GeneralSettings />}
      {activeTab === "privacy" && <PrivacySettings />}
      {activeTab === "security" && <SecuritySettings />}
      {activeTab === "notifications" && <NotificationSettings />}
    </div>
  </div>
)
```

### Theme Selector

```tsx
const [theme, setTheme] = useState("system")

return (
  <Tabs
    value={theme}
    onChange={setTheme}
  >
    <Tabs.Item
      value="light"
      aria-label="Light theme"
    >
      <div className="flex items-center gap-2">
        <ThemeSunBright />
        <span>Light</span>
      </div>
    </Tabs.Item>
    <Tabs.Item
      value="dark"
      aria-label="Dark theme"
    >
      <div className="flex items-center gap-2">
        <ThemeMoonDark />
        <span>Dark</span>
      </div>
    </Tabs.Item>
    <Tabs.Item
      value="system"
      aria-label="System theme"
    >
      <div className="flex items-center gap-2">
        <ThemeSystem />
        <span>System</span>
      </div>
    </Tabs.Item>
  </Tabs>
)
```

### Dashboard Navigation

```tsx
const [section, setSection] = useState("overview")

return (
  <div className="space-y-6">
    <Tabs
      value={section}
      onChange={setSection}
    >
      <Tabs.Item value="overview">Overview</Tabs.Item>
      <Tabs.Item value="analytics">Analytics</Tabs.Item>
      <Tabs.Item value="reports">Reports</Tabs.Item>
      <Tabs.Item
        value="settings"
        disabled
      >
        Settings
      </Tabs.Item>
    </Tabs>

    <main>
      {section === "overview" && <DashboardOverview />}
      {section === "analytics" && <AnalyticsView />}
      {section === "reports" && <ReportsView />}
    </main>
  </div>
)
```

### Icon-Only Toolbar

```tsx
const [tool, setTool] = useState("select")

return (
  <Tabs
    value={tool}
    onChange={setTool}
  >
    <Tabs.Item
      value="select"
      aria-label="Select tool"
    >
      <SelectIcon />
    </Tabs.Item>
    <Tabs.Item
      value="move"
      aria-label="Move tool"
    >
      <MoveIcon />
    </Tabs.Item>
    <Tabs.Item
      value="draw"
      aria-label="Draw tool"
    >
      <DrawIcon />
    </Tabs.Item>
    <Tabs.Item
      value="erase"
      aria-label="Erase tool"
    >
      <EraseIcon />
    </Tabs.Item>
  </Tabs>
)
```

## Notes

- This is a controlled component - there is no `defaultValue` prop
- Initial selection is handled through the state's initial value
- Tab content rendering is handled by the consuming application
- The component handles tab switching, but content management is external
- Individual tabs can be disabled while maintaining keyboard navigation
- Both text and complex content (icons, mixed layouts) are supported
- Dark variant is optimized for dark backgrounds and themes
- All interactive states (hover, focus, active, disabled) are properly styled
