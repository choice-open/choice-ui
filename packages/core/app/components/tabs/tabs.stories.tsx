import { ThemeMoonDark, ThemeSunBright, ThemeSystem } from "@choiceform/icons-react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { useState } from "react"
import { Tabs } from "./tabs"
import { Checkbox } from "../checkbox/checkbox"

const meta: Meta<typeof Tabs> = {
  title: "Navigation/Tabs",
  component: Tabs,
}

export default meta

type Story = StoryObj<typeof Tabs>

/**
 * Basic tabs component with text labels.
 * 
 * Features:
 * - Controlled component requiring `value` and `onChange` props
 * - Use `<Tabs.Item>` for each tab item
 * - Keyboard navigation with arrow keys
 * - ARIA attributes for accessibility
 */
export const Basic: Story = {
  render: function BasicStory() {
    const [selectedTab, setSelectedTab] = useState("tab1")
    return (
      <Tabs
        value={selectedTab}
        onChange={(value) => {
          setSelectedTab(value)
        }}
      >
        <Tabs.Item value="tab1">Tab 1</Tabs.Item>
        <Tabs.Item value="tab2">Tab 2</Tabs.Item>
        <Tabs.Item value="tab3">Tab 3</Tabs.Item>
      </Tabs>
    )
  },
}

/**
 * Tabs with default selected value.
 * 
 * Features:
 * - Set default value through initial state
 * - No separate `defaultValue` prop (controlled component)
 * - The selected tab is highlighted on mount
 */
export const DefaultValue: Story = {
  render: function DefaultValueStory() {
    const [selectedTab, setSelectedTab] = useState("analytics")
    return (
      <Tabs
        value={selectedTab}
        onChange={(value) => {
          setSelectedTab(value)
        }}
      >
        <Tabs.Item value="overview">Overview</Tabs.Item>
        <Tabs.Item value="settings">Settings</Tabs.Item>
        <Tabs.Item value="analytics">Analytics</Tabs.Item>
      </Tabs>
    )
  },
}

/**
 * Tabs with disabled state.
 * 
 * Features:
 * - Individual tabs can be disabled
 * - Entire tab group can be disabled
 * - Disabled tabs cannot be selected
 * - Visual feedback for disabled state
 */
export const Disabled: Story = {
  render: function DisabledStory() {
    const [selectedTab, setSelectedTab] = useState("settings")

    return (
      <Tabs
        value={selectedTab}
        onChange={(value) => {
          setSelectedTab(value)
        }}
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
  },
}

/**
 * Icon-only tabs for compact interfaces.
 * 
 * Features:
 * - Icons as tab content
 * - Requires `aria-label` for accessibility
 * - Ideal for theme switchers or view toggles
 * - Maintains full keyboard navigation
 */
export const IconTabs: Story = {
  render: function IconTabsStory() {
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
  },
}

/**
 * Tabs with both icons and text labels.
 * 
 * Features:
 * - Combine icons with descriptive text
 * - Better clarity than icon-only tabs
 * - Use flexbox for alignment
 * - Suitable for main navigation
 */
export const MixedTabs: Story = {
  render: function MixedTabsStory() {
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
  },
}

/**
 * Visual variants of the tabs component.
 * 
 * Variants:
 * - **default**: Follows the page theme dynamically (light/dark mode)
 * - **light**: Fixed light appearance regardless of theme
 * - **dark**: Fixed dark appearance regardless of theme
 * - **reset**: Removes variant styling, no variant settings applied
 * 
 * Each variant maintains full functionality while adapting visual style.
 */
export const Variants: Story = {
  render: function VariantsStory() {
    const [selectedTab, setSelectedTab] = useState("tab1")
    const [disabled, setDisabled] = useState(false)
    return (
      <div className="flex flex-col gap-2">
        <Checkbox
          value={disabled}
          onChange={(value) => setDisabled(value)}
        >
          Disabled
        </Checkbox>
        <div className="grid grid-cols-3 overflow-hidden rounded-xl border">
          <div className="bg-default-background p-8">
            <Tabs
              value={selectedTab}
              onChange={(value) => setSelectedTab(value)}
              disabled={disabled}
            >
              <Tabs.Item value="tab1">Tab 1</Tabs.Item>
              <Tabs.Item value="tab2">Tab 2</Tabs.Item>
              <Tabs.Item value="tab3">Tab 3</Tabs.Item>
            </Tabs>
          </div>
          <div className="bg-white p-8">
            <Tabs
              value={selectedTab}
              onChange={(value) => setSelectedTab(value)}
              variant="light"
              disabled={disabled}
            >
              <Tabs.Item value="tab1">Tab 1</Tabs.Item>
              <Tabs.Item value="tab2">Tab 2</Tabs.Item>
              <Tabs.Item value="tab3">Tab 3</Tabs.Item>
            </Tabs>
          </div>
          <div className="bg-gray-800 p-8">
            <Tabs
              value={selectedTab}
              onChange={(value) => setSelectedTab(value)}
              variant="dark"
              disabled={disabled}
            >
              <Tabs.Item value="tab1">Tab 1</Tabs.Item>
              <Tabs.Item value="tab2">Tab 2</Tabs.Item>
              <Tabs.Item value="tab3">Tab 3</Tabs.Item>
            </Tabs>
          </div>
        </div>
      </div>
    )
  },
}

/**
 * Tabs component in readonly state.
 *
 * In readonly mode:
 * - Tabs do not respond to click or keyboard events
 * - The selected tab cannot be changed
 * - Useful for displaying tabs without allowing changes
 */
export const Readonly: Story = {
  render: function ReadonlyStory() {
    const [value, setValue] = useState<string>("tab1")
    const [changeCount, setChangeCount] = useState(0)

    const handleChange = (newValue: string) => {
      setValue(newValue)
      setChangeCount((prev) => prev + 1)
    }

    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border bg-stone-50 p-4">
          <div className="text-body-small-strong mb-2 text-stone-700">Current Value:</div>
          <div className="text-body-small font-mono text-stone-600">{value}</div>
          <div className="text-body-small-strong mt-2 text-stone-700">Change Count:</div>
          <div className="text-body-small font-mono text-stone-600">{changeCount}</div>
        </div>

        <Tabs
          readonly
          value={value}
          onChange={handleChange}
        >
          <Tabs.Item value="tab1">Tab 1</Tabs.Item>
          <Tabs.Item value="tab2">Tab 2</Tabs.Item>
          <Tabs.Item value="tab3">Tab 3</Tabs.Item>
        </Tabs>

        <Tabs
          value={value}
          onChange={handleChange}
        >
          <Tabs.Item value="tab1">Tab 1</Tabs.Item>
          <Tabs.Item value="tab2">Tab 2</Tabs.Item>
          <Tabs.Item value="tab3">Tab 3</Tabs.Item>
        </Tabs>

        <div className="text-body-small text-stone-600">
          💡 Try clicking on the readonly tabs - the value should not change and the change count
          should remain at 0. Only the normal tabs will change the value.
        </div>
      </div>
    )
  },
}
