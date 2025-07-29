import { ThemeMoonDark, ThemeSunBright, ThemeSystem } from "@choiceform/icons-react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { useState } from "react"
import { Tabs } from "./tabs"

const meta: Meta<typeof Tabs> = {
  title: "Navigation/Tabs",
  component: Tabs,
}

export default meta

type Story = StoryObj<typeof Tabs>

/**
 * - This is a controlled component that requires `value` and `onChange` props to control its state.
 * - Use `<Tabs.Item>` for each tab item.
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
 * Since it is a controlled component, there is no separate `defaultValue` property.
 * The default value can be set through the initial state.
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
 * The `disabled` prop is used to disable the tab.
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
 * Icon tabs using the compound component pattern.
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
 * Mixed tabs with icons and text.
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
 * Dark variant.
 */
export const DarkVariant: Story = {
  render: function DarkVariantStory() {
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
  },
}
