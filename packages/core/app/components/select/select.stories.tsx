import {
  FieldTypeAttachment,
  FieldTypeCheckbox,
  FieldTypeCount,
  Settings,
} from "@choiceform/icons-react"
import { faker } from "@faker-js/faker"
import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { useMemo, useRef, useState } from "react"
import { Popover } from "../popover"
import { Select } from "./select"

const meta: Meta<typeof Select> = {
  title: "Collections/Select",
  component: Select,
  tags: ["upgrade"],
}

export default meta
type Story = StoryObj<typeof Select>

/**
 * Basic select component using the new MenuContext system.
 *
 * Features:
 * - Enhanced MenuContextItem components
 * - Unified interaction handling with useEventCallback
 * - Improved keyboard navigation and selection
 * - Better ref management for floating UI
 */
export const Basic: Story = {
  render: function BasicStory() {
    const [value, setValue] = useState<string>("option-2")

    return (
      <Select
        value={value}
        onChange={setValue}
      >
        <Select.Trigger>
          <Select.Value>{value || "Select an option..."}</Select.Value>
        </Select.Trigger>
        <Select.Content>
          {Array.from({ length: 8 }, (_, i) => (
            <Select.Item
              key={i}
              value={`option-${i + 1}`}
            >
              <Select.Value>Option {i + 1}</Select.Value>
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    )
  },
}

/**
 * Select component in disabled state.
 */
export const Disabled: Story = {
  render: function DisabledStory() {
    const [value, setValue] = useState<string>("option-2")

    return (
      <Select
        disabled
        value={value}
        onChange={setValue}
      >
        <Select.Trigger>
          <Select.Value>{value || "Select an option..."}</Select.Value>
        </Select.Trigger>
        <Select.Content>
          {Array.from({ length: 5 }, (_, i) => (
            <Select.Item
              key={i}
              value={`option-${i + 1}`}
            >
              <Select.Value>Option {i + 1}</Select.Value>
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    )
  },
}

/**
 * Select with individual disabled options.
 */
export const DisabledOptions: Story = {
  render: function DisabledOptionsStory() {
    const [value, setValue] = useState<string>("option-2")

    return (
      <Select
        value={value}
        onChange={setValue}
      >
        <Select.Trigger>
          <Select.Value>{value || "Select an option..."}</Select.Value>
        </Select.Trigger>
        <Select.Content>
          <Select.Item
            value="option-1"
            disabled
          >
            <Select.Value>Option 1 (Disabled)</Select.Value>
          </Select.Item>
          <Select.Item value="option-2">
            <Select.Value>Option 2</Select.Value>
          </Select.Item>
          <Select.Item value="option-3">
            <Select.Value>Option 3</Select.Value>
          </Select.Item>
          <Select.Item
            value="option-4"
            disabled
          >
            <Select.Value>Option 4 (Disabled)</Select.Value>
          </Select.Item>
          <Select.Item value="option-5">
            <Select.Value>Option 5</Select.Value>
          </Select.Item>
        </Select.Content>
      </Select>
    )
  },
}

/**
 * Select with dividers for grouping options.
 */
export const WithDivider: Story = {
  render: function WithDividerStory() {
    const [value, setValue] = useState<string>("category-a-1")

    return (
      <Select
        value={value}
        onChange={setValue}
      >
        <Select.Trigger>
          <Select.Value>{value || "Select an option..."}</Select.Value>
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="category-a-1">
            <Select.Value>Category A - Option 1</Select.Value>
          </Select.Item>
          <Select.Item value="category-a-2">
            <Select.Value>Category A - Option 2</Select.Value>
          </Select.Item>
          <Select.Divider />
          <Select.Item value="category-b-1">
            <Select.Value>Category B - Option 1</Select.Value>
          </Select.Item>
          <Select.Item value="category-b-2">
            <Select.Value>Category B - Option 2</Select.Value>
          </Select.Item>
          <Select.Divider />
          <Select.Item value="category-c-1">
            <Select.Value>Category C - Option 1</Select.Value>
          </Select.Item>
        </Select.Content>
      </Select>
    )
  },
}

/**
 * Select with labels for better organization.
 */
export const WithLabels: Story = {
  render: function WithLabelsStory() {
    const [value, setValue] = useState<string>("basic-1")

    return (
      <Select
        value={value}
        onChange={setValue}
      >
        <Select.Trigger>
          <Select.Value>{value || "Select a plan..."}</Select.Value>
        </Select.Trigger>
        <Select.Content>
          <Select.Label>Basic Plans</Select.Label>
          <Select.Item value="basic-1">
            <Select.Value>Basic - Starter</Select.Value>
          </Select.Item>
          <Select.Item value="basic-2">
            <Select.Value>Basic - Professional</Select.Value>
          </Select.Item>

          <Select.Divider />

          <Select.Label>Premium Plans</Select.Label>
          <Select.Item value="premium-1">
            <Select.Value>Premium - Business</Select.Value>
          </Select.Item>
          <Select.Item value="premium-2">
            <Select.Value>Premium - Enterprise</Select.Value>
          </Select.Item>

          <Select.Divider />

          <Select.Label>Custom Solutions</Select.Label>
          <Select.Item value="custom-1">
            <Select.Value>Custom - Tailored</Select.Value>
          </Select.Item>
        </Select.Content>
      </Select>
    )
  },
}

/**
 * Select with icons for better visual recognition.
 */
export const WithIcons: Story = {
  render: function WithIconsStory() {
    const [value, setValue] = useState<string>("attachment")

    return (
      <Select
        value={value}
        onChange={setValue}
      >
        <Select.Trigger>
          <Select.Value>{value || "Select field type..."}</Select.Value>
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="attachment">
            <FieldTypeAttachment />
            <Select.Value>Attachment Field</Select.Value>
          </Select.Item>
          <Select.Item value="checkbox">
            <FieldTypeCheckbox />
            <Select.Value>Checkbox Field</Select.Value>
          </Select.Item>
          <Select.Item value="count">
            <FieldTypeCount />
            <Select.Value>Count Field</Select.Value>
          </Select.Item>
        </Select.Content>
      </Select>
    )
  },
}

/**
 * Select with a large number of options demonstrating scroll performance.
 */
export const LongList: Story = {
  render: function LongListStory() {
    const [value, setValue] = useState<string>("item-25")

    const options = useMemo(
      () =>
        Array.from({ length: 100 }, (_, i) => ({
          value: `item-${i + 1}`,
          label: `${faker.location.city()} ${i + 1}`,
        })),
      [],
    )

    return (
      <Select
        value={value}
        onChange={setValue}
      >
        <Select.Trigger>
          <Select.Value>
            {value ? options.find((opt) => opt.value === value)?.label : "Select a city..."}
          </Select.Value>
        </Select.Trigger>
        <Select.Content>
          <Select.Label>Cities ({options.length} total)</Select.Label>
          {options.map((option) => (
            <Select.Item
              key={option.value}
              value={option.value}
            >
              <Select.Value>{option.label}</Select.Value>
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    )
  },
}

/**
 * Select that matches the trigger width for consistent layout.
 */
export const MatchTriggerWidth: Story = {
  render: function MatchTriggerWidthStory() {
    const [value, setValue] = useState<string>("medium")

    const options = useMemo(
      () => [
        { value: "small", label: faker.music.songName() },
        { value: "medium", label: faker.music.songName() },
        { value: "large", label: faker.music.songName() },
        { value: "extra-large", label: faker.music.songName() },
      ],
      [],
    )

    return (
      <Select
        value={value}
        onChange={setValue}
        matchTriggerWidth
      >
        <Select.Trigger className="w-80">
          <Select.Value>
            {value ? options.find((opt) => opt.value === value)?.label : "Select a song..."}
          </Select.Value>
        </Select.Trigger>
        <Select.Content>
          <Select.Label>Songs</Select.Label>
          {options.map((option) => (
            <Select.Item
              key={option.value}
              value={option.value}
            >
              <Select.Value>{option.label}</Select.Value>
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    )
  },
}

/**
 * Select with different placement options.
 */
export const Placement: Story = {
  render: function PlacementStory() {
    const [value, setValue] = useState<string>("option-2")

    return (
      <div className="flex flex-wrap gap-4">
        <Select
          value={value}
          onChange={setValue}
          placement="bottom-start"
        >
          <Select.Trigger>
            <Select.Value>Bottom Start</Select.Value>
          </Select.Trigger>
          <Select.Content>
            {Array.from({ length: 5 }, (_, i) => (
              <Select.Item
                key={i}
                value={`option-${i + 1}`}
              >
                <Select.Value>Option {i + 1}</Select.Value>
              </Select.Item>
            ))}
          </Select.Content>
        </Select>

        <Select
          value={value}
          onChange={setValue}
          placement="bottom-end"
        >
          <Select.Trigger>
            <Select.Value>Bottom End</Select.Value>
          </Select.Trigger>
          <Select.Content>
            {Array.from({ length: 5 }, (_, i) => (
              <Select.Item
                key={i}
                value={`option-${i + 1}`}
              >
                <Select.Value>Option {i + 1}</Select.Value>
              </Select.Item>
            ))}
          </Select.Content>
        </Select>

        <Select
          value={value}
          onChange={setValue}
          placement="bottom-start"
        >
          <Select.Trigger>
            <Select.Value>Another Bottom Start</Select.Value>
          </Select.Trigger>
          <Select.Content>
            {Array.from({ length: 5 }, (_, i) => (
              <Select.Item
                key={i}
                value={`option-${i + 1}`}
              >
                <Select.Value>Option {i + 1}</Select.Value>
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      </div>
    )
  },
}

/**
 * Compound component pattern demonstration.
 */
export const CompoundComponent: Story = {
  render: function CompoundComponentStory() {
    const [value, setValue] = useState<string | null>("option-2")

    return (
      <div className="flex w-80 flex-col gap-8">
        <Select
          value={value}
          onChange={setValue}
        >
          <Select.Trigger>
            <Select.Value>{value ? `Selected: ${value}` : "Choose an option..."}</Select.Value>
          </Select.Trigger>
          <Select.Content>
            <Select.Label>Available Options</Select.Label>
            <Select.Item value="option-1">
              <Select.Value>First Option</Select.Value>
            </Select.Item>
            <Select.Item value="option-2">
              <Select.Value>Second Option</Select.Value>
            </Select.Item>
            <Select.Divider />
            <Select.Item value="option-3">
              <Select.Value>Third Option</Select.Value>
            </Select.Item>
            <Select.Item
              value="option-4"
              disabled
            >
              <Select.Value>Disabled Option</Select.Value>
            </Select.Item>
          </Select.Content>
        </Select>

        <div className="rounded-xl bg-stone-50 p-4">
          <div className="text-body-small-strong mb-2 text-stone-700">Current Selection:</div>
          <div className="text-body-small font-mono text-stone-600">{value || "None"}</div>
        </div>
      </div>
    )
  },
}

/**
 * Select positioned at edge cases for testing placement behavior.
 */
export const MarginalConditions: Story = {
  render: function MarginalConditionsStory() {
    const [value, setValue] = useState<string>("")

    return (
      <div className="flex h-screen flex-col justify-end p-4">
        <Select
          value={value}
          onChange={setValue}
        >
          <Select.Trigger>
            <Select.Value>{value || "Edge case test..."}</Select.Value>
          </Select.Trigger>
          <Select.Content>
            <Select.Label>Edge Position Test</Select.Label>
            {Array.from({ length: 12 }, (_, i) => (
              <Select.Item
                key={i}
                value={`edge-option-${i + 1}`}
              >
                <Select.Value>Edge Option {i + 1}</Select.Value>
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      </div>
    )
  },
}

/**
 * Multiple selects testing proper event handling and switching.
 */
export const Multiple: Story = {
  render: function MultipleStory() {
    const [value1, setValue1] = useState<string>("option-1")
    const [value2, setValue2] = useState<string>("choice-b")
    const [value3, setValue3] = useState<string>("item-ii")

    const options1 = Array.from({ length: 4 }, (_, i) => ({
      value: `option-${i + 1}`,
      label: `Option ${i + 1}`,
    }))

    const options2 = Array.from({ length: 4 }, (_, i) => ({
      value: `choice-${String.fromCharCode(97 + i)}`,
      label: `Choice ${String.fromCharCode(65 + i)}`,
    }))

    const options3 = Array.from({ length: 4 }, (_, i) => ({
      value: `item-${["i", "ii", "iii", "iv"][i]}`,
      label: `Item ${["I", "II", "III", "IV"][i]}`,
    }))

    return (
      <div className="flex flex-col gap-8 p-8">
        <div className="text-body-large-strong">Multiple Select Components Test</div>

        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-body-small text-stone-600">First Select</label>
            <Select
              value={value1}
              onChange={setValue1}
            >
              <Select.Trigger className="w-48">
                <Select.Value>
                  {value1
                    ? options1.find((opt) => opt.value === value1)?.label
                    : "Select option..."}
                </Select.Value>
              </Select.Trigger>
              <Select.Content>
                <Select.Label>Number Options</Select.Label>
                {options1.map((option) => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                  >
                    <Select.Value>{option.label}</Select.Value>
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-body-small text-stone-600">Second Select</label>
            <Select
              value={value2}
              onChange={setValue2}
            >
              <Select.Trigger className="w-48">
                <Select.Value>
                  {value2
                    ? options2.find((opt) => opt.value === value2)?.label
                    : "Select option..."}
                </Select.Value>
              </Select.Trigger>
              <Select.Content>
                <Select.Label>Letter Options</Select.Label>
                {options2.map((option) => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                  >
                    <FieldTypeAttachment />
                    <Select.Value>{option.label}</Select.Value>
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-body-small text-stone-600">Third Select</label>
            <Select
              value={value3}
              onChange={setValue3}
              placement="bottom-end"
            >
              <Select.Trigger className="w-48">
                <Select.Value>
                  {value3
                    ? options3.find((opt) => opt.value === value3)?.label
                    : "Select option..."}
                </Select.Value>
              </Select.Trigger>
              <Select.Content>
                <Select.Label>Roman Numerals</Select.Label>
                {options3.map((option) => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                  >
                    <FieldTypeCount />
                    <Select.Value>{option.label}</Select.Value>
                  </Select.Item>
                ))}
                <Select.Divider />
                <Select.Item
                  value="special"
                  disabled
                >
                  <Settings />
                  <Select.Value>Special Option (Disabled)</Select.Value>
                </Select.Item>
              </Select.Content>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-xl bg-stone-50 p-4">
          <div className="text-body-small-strong text-stone-700">Current Values:</div>
          <div className="text-body-small text-stone-600">
            First: <span className="font-mono">{value1}</span>
          </div>
          <div className="text-body-small text-stone-600">
            Second: <span className="font-mono">{value2}</span>
          </div>
          <div className="text-body-small text-stone-600">
            Third: <span className="font-mono">{value3}</span>
          </div>
        </div>

        <div className="text-xs text-stone-500">
          💡 Test: Try switching between different selects rapidly to ensure proper event handling.
        </div>
      </div>
    )
  },
}

/**
 * Select with active item handling and popover integration.
 */
export const ItemActive: Story = {
  render: function ItemActiveStory() {
    const [open, setOpen] = useState(false)
    const [selectOpen, setSelectOpen] = useState(false)
    const itemRef = useRef<HTMLDivElement>(null)
    const [value, setValue] = useState<string | null>(null)

    const options = useMemo(
      () =>
        Array.from({ length: 8 }, (_, i) => ({
          value: `option-${i + 1}`,
          label: faker.music.songName(),
        })),
      [],
    )

    return (
      <>
        <Select
          value={value}
          onChange={setValue}
          open={selectOpen}
          onOpenChange={setSelectOpen}
        >
          <Select.Trigger className="relative">
            <Select.Value>
              {value ? options.find((option) => option.value === value)?.label : "Select song..."}
            </Select.Value>
            <div
              className="absolute inset-x-0 bottom-0 h-px"
              ref={itemRef}
            />
          </Select.Trigger>
          <Select.Content>
            <Select.Label>Music Library</Select.Label>
            {options.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
              >
                <Select.Value>{option.label}</Select.Value>
              </Select.Item>
            ))}
            <Select.Divider />
            <Select.Label>Actions</Select.Label>
            <Select.Item
              onClick={() => {
                setOpen(true)
                setSelectOpen(false)
              }}
            >
              <Settings />
              <Select.Value>Open Music Settings</Select.Value>
            </Select.Item>
          </Select.Content>
        </Select>

        <Popover
          open={open}
          onOpenChange={setOpen}
          triggerRef={itemRef}
        >
          <Popover.Content className="w-80 p-4">
            <div className="space-y-4">
              <h3 className="font-strong">Music Settings</h3>
              <p className="text-body-small text-stone-600">
                Configure your music playback preferences and library settings.
              </p>
              <div className="flex gap-2">
                <button
                  className="text-body-small rounded bg-blue-500 px-3 py-1 text-white"
                  onClick={() => setOpen(false)}
                >
                  Save
                </button>
                <button
                  className="text-body-small rounded border px-3 py-1"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Popover.Content>
        </Popover>
      </>
    )
  },
}

/**
 * Advanced select demonstrating complex real-world usage patterns.
 */
export const Advanced: Story = {
  render: function AdvancedStory() {
    const [status, setStatus] = useState<string>("active")
    const [priority, setPriority] = useState<string>("medium")
    const [assignee, setAssignee] = useState<string>("john-doe")

    const statusOptions = [
      { value: "active", label: "Active", color: "bg-green-500" },
      { value: "pending", label: "Pending", color: "bg-yellow-500" },
      { value: "completed", label: "Completed", color: "bg-blue-500" },
      { value: "cancelled", label: "Cancelled", color: "bg-red-500" },
    ]

    const priorityOptions = [
      { value: "low", label: "Low Priority", icon: "📋" },
      { value: "medium", label: "Medium Priority", icon: "⚡" },
      { value: "high", label: "High Priority", icon: "🔥" },
      { value: "urgent", label: "Urgent", icon: "🚨" },
    ]

    const assigneeOptions = useMemo(
      () =>
        Array.from({ length: 6 }, (_, i) => ({
          value: `user-${i + 1}`,
          name: faker.person.fullName(),
          email: faker.internet.email(),
        })),
      [],
    )

    return (
      <div className="space-y-6 p-6">
        <h2 className="text-body-large-strong">Task Management</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-body-small-strong text-stone-700">Status</label>
            <Select
              value={status}
              onChange={setStatus}
            >
              <Select.Trigger className="w-full">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${statusOptions.find((opt) => opt.value === status)?.color}`}
                  />
                  <Select.Value>
                    {statusOptions.find((opt) => opt.value === status)?.label}
                  </Select.Value>
                </div>
              </Select.Trigger>
              <Select.Content>
                <Select.Label>Task Status</Select.Label>
                {statusOptions.map((option) => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                  >
                    <div className={`h-2 w-2 rounded-full ${option.color}`} />
                    <Select.Value>{option.label}</Select.Value>
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-body-small-strong text-stone-700">Priority</label>
            <Select
              value={priority}
              onChange={setPriority}
            >
              <Select.Trigger className="w-full">
                <Select.Value>
                  {priorityOptions.find((opt) => opt.value === priority)?.icon}{" "}
                  {priorityOptions.find((opt) => opt.value === priority)?.label}
                </Select.Value>
              </Select.Trigger>
              <Select.Content>
                <Select.Label>Priority Level</Select.Label>
                {priorityOptions.map((option) => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                  >
                    <span className="text-base">{option.icon}</span>
                    <Select.Value>{option.label}</Select.Value>
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-body-small-strong text-stone-700">Assignee</label>
            <Select
              value={assignee}
              onChange={setAssignee}
            >
              <Select.Trigger className="w-full">
                <Select.Value>
                  {assigneeOptions.find((opt) => opt.value === assignee)?.name || "Unassigned"}
                </Select.Value>
              </Select.Trigger>
              <Select.Content>
                <Select.Label>Team Members</Select.Label>
                <Select.Item value="unassigned">
                  <Select.Value>Unassigned</Select.Value>
                </Select.Item>
                <Select.Divider />
                {assigneeOptions.map((option) => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                  >
                    <div className="flex flex-col">
                      <Select.Value>{option.name}</Select.Value>
                      <span className="text-xs text-stone-500">{option.email}</span>
                    </div>
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>
        </div>

        <div className="rounded-xl border bg-stone-50 p-4">
          <h3 className="font-strong mb-2">Current Configuration</h3>
          <div className="text-body-small space-y-1">
            <div>
              Status: <span className="font-mono">{status}</span>
            </div>
            <div>
              Priority: <span className="font-mono">{priority}</span>
            </div>
            <div>
              Assignee: <span className="font-mono">{assignee}</span>
            </div>
          </div>
        </div>
      </div>
    )
  },
}

export const Large: Story = {
  render: function LargeStory() {
    const [value, setValue] = useState<string>("option-1")
    const options = useMemo(
      () =>
        Array.from({ length: 8 }, (_, i) => ({
          value: `option-${i + 1}`,
          label: faker.music.songName(),
        })),
      [],
    )

    return (
      <Select
        size="large"
        value={value}
        onChange={setValue}
      >
        <Select.Trigger
          prefixElement={<Settings />}
          className="w-48"
        >
          <Select.Value>
            {value ? options.find((option) => option.value === value)?.label : "Select song..."}
          </Select.Value>
        </Select.Trigger>
        <Select.Content>
          {options.map((option) => (
            <Select.Item
              key={option.value}
              value={option.value}
            >
              <Select.Value>{option.label}</Select.Value>
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    )
  },
}

/**
 * Demonstrates closeOnEscape functionality with interactive toggle.
 *
 * When closeOnEscape is set to false, pressing ESC key will not close the select menu.
 * This is useful when the select is nested in other components that also handle ESC key,
 * and you want to prevent the ESC event from bubbling up.
 */
export const CloseOnEscapeToggle: Story = {
  render: function CloseOnEscapeToggleStory() {
    const [value, setValue] = useState<string>("option-2")
    const [closeOnEscape, setCloseOnEscape] = useState(true)

    return (
      <div
        style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "flex-start" }}
      >
        <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="checkbox"
            checked={closeOnEscape}
            onChange={(e) => setCloseOnEscape(e.target.checked)}
          />
          <span>Enable close on ESC key</span>
        </label>

        <Select
          value={value}
          onChange={setValue}
          closeOnEscape={closeOnEscape}
        >
          <Select.Trigger>
            <Select.Value>{value || "Select an option..."}</Select.Value>
          </Select.Trigger>
          <Select.Content>
            {Array.from({ length: 5 }, (_, i) => (
              <Select.Item
                key={i}
                value={`option-${i + 1}`}
              >
                <Select.Value>Option {i + 1}</Select.Value>
              </Select.Item>
            ))}
          </Select.Content>
        </Select>

        <div style={{ fontSize: "14px", color: "#666", maxWidth: "400px" }}>
          {closeOnEscape
            ? "✅ Try opening the select and pressing ESC - it will close the menu."
            : "❌ With this option disabled, pressing ESC will not close the select menu."}
        </div>
      </div>
    )
  },
}

/**
 * Example with ESC key disabled.
 *
 * Pressing ESC key will NOT close the select menu.
 * This is useful in modal dialogs or nested overlays where you want to prevent
 * ESC from closing the select and instead let it close the parent container.
 */
export const DisableCloseOnEscape: Story = {
  render: function DisableCloseOnEscapeStory() {
    const [value, setValue] = useState<string>("option-2")

    return (
      <div
        style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "flex-start" }}
      >
        <Select
          value={value}
          onChange={setValue}
          closeOnEscape={false}
        >
          <Select.Trigger>
            <Select.Value>{value || "Select an option..."}</Select.Value>
          </Select.Trigger>
          <Select.Content>
            {Array.from({ length: 5 }, (_, i) => (
              <Select.Item
                key={i}
                value={`option-${i + 1}`}
              >
                <Select.Value>Option {i + 1}</Select.Value>
              </Select.Item>
            ))}
          </Select.Content>
        </Select>

        <div
          style={{
            padding: "12px 16px",
            backgroundColor: "#fff3cd",
            border: "1px solid #ffc107",
            borderRadius: "4px",
            fontSize: "14px",
            maxWidth: "400px",
          }}
        >
          <strong>⚠️ Note:</strong> Pressing ESC key will NOT close this select menu. Click outside
          or select an option to close it.
        </div>
      </div>
    )
  },
}

/**
 * EventPropagation: Verifies that ESC key events do not propagate to window when closeOnEscape is true.
 *
 * This story demonstrates that when the select menu is open and you press ESC:
 * - The select menu will close
 * - The ESC event will NOT propagate to the window
 * - The window ESC counter will NOT increment
 *
 * Press ESC outside the select to increment the counter, then open the select and press ESC again.
 * The counter should not change when pressing ESC inside the select menu.
 */
export const EventPropagation: Story = {
  render: function EventPropagationStory() {
    const [value, setValue] = useState<string>("option-2")
    const [escCount, setEscCount] = useState(0)

    React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setEscCount((prev) => prev + 1)
        }
      }

      window.addEventListener("keydown", handleEscape)
      return () => window.removeEventListener("keydown", handleEscape)
    }, [])

    return (
      <div className="flex flex-col gap-4">
        <p>
          Window ESC count: <strong>{escCount}</strong>
        </p>
        <p className="text-secondary-foreground text-body-small">
          Press ESC to increment. Open popover and press ESC - counter should NOT change.
        </p>

        <Select
          value={value}
          onChange={setValue}
          closeOnEscape={true}
        >
          <Select.Trigger>
            <Select.Value>{value || "Select an option..."}</Select.Value>
          </Select.Trigger>
          <Select.Content>
            {Array.from({ length: 5 }, (_, i) => (
              <Select.Item
                key={i}
                value={`option-${i + 1}`}
              >
                <Select.Value>Option {i + 1}</Select.Value>
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      </div>
    )
  },
}
