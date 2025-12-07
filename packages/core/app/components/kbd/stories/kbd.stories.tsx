import { Story } from "@storybook/addon-docs/blocks"
import type { Meta, StoryObj } from "@storybook/react-vite"
import React from "react"
import { Kbd } from "../src/kbd"

const meta: Meta<typeof Kbd> = {
  title: "Data Display/Kbd",
  component: Kbd,
}

export default meta

type Story = StoryObj<typeof Kbd>

/**
 * Basic usage of the Kbd component.
 *
 * This story demonstrates how to use the Kbd component with different combinations of keys.
 * It shows examples with single key, multiple keys, and nested keys.
 *
 * ```tsx
 * <Kbd keys={["command"]}>K</Kbd>
 * <Kbd keys={["command", "shift"]}>K</Kbd>
 * <Kbd keys={["command", "shift", "option"]}>K</Kbd>
 * <Kbd keys={["command", "shift", "option", "ctrl"]}>K</Kbd>
 * ```
 *
 * kbdKeysMap:
 * ```ts
 * {
 *   command: '⌘',
 *   windows: '⊞',
 *   shift: '⇧',
 *   ctrl: '⌃',
 *   option: '⌥',
 *   alt: '⌥',
 *   enter: '↵',
 *   delete: '⌫',
 *   backspace: '⌫',
 *   escape: '⎋',
 *   tab: '⇥',
 *   capslock: '⇪',
 *   up: '↑',
 *   right: '→',
 *   down: '↓',
 *   left: '←',
 *   pageup: '⇞',
 *   pagedown: '⇟',
 *   home: '↖',
 *   end: '↘',
 *   help: '?',
 *   space: '␣',
 * }
 * ```
 */

export const Basic: Story = {
  render: function BasicStory() {
    return (
      <div className="flex gap-4">
        <Kbd keys={"command"}>K</Kbd>
        <Kbd keys={["command", "shift"]}>K</Kbd>
        <Kbd keys={["command", "shift", "option"]}>K</Kbd>
        <Kbd keys={["command", "shift", "option", "ctrl"]}>K</Kbd>
      </div>
    )
  },
}
