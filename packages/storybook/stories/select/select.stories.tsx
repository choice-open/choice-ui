import { Button, Checkbox, Popover, Select } from "@choice-ui/react"
import {
  FieldTypeAttachment,
  FieldTypeCheckbox,
  FieldTypeCount,
  Settings,
} from "@choiceform/icons-react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { useMemo, useRef, useState } from "react"

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
    const [value, setValue] = useState<string>("Option 2")

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
              value={`Option ${i + 1}`}
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
    const [value, setValue] = useState<string>("Option 2")

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
              value={`Option ${i + 1}`}
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
    const [value, setValue] = useState<string>("Option 2")

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
            value="Option 1"
            disabled
          >
            <Select.Value>Option 1 (Disabled)</Select.Value>
          </Select.Item>
          <Select.Item value="Option 2">
            <Select.Value>Option 2</Select.Value>
          </Select.Item>
          <Select.Item value="Option 3">
            <Select.Value>Option 3</Select.Value>
          </Select.Item>
          <Select.Item
            value="Option 4"
            disabled
          >
            <Select.Value>Option 4 (Disabled)</Select.Value>
          </Select.Item>
          <Select.Item value="Option 5">
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
    const [value, setValue] = useState<string>("Category A - Option 1")

    return (
      <Select
        value={value}
        onChange={setValue}
      >
        <Select.Trigger>
          <Select.Value>{value || "Select an option..."}</Select.Value>
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="Category A - Option 1">
            <Select.Value>Category A - Option 1</Select.Value>
          </Select.Item>
          <Select.Item value="Category A - Option 2">
            <Select.Value>Category A - Option 2</Select.Value>
          </Select.Item>
          <Select.Divider />
          <Select.Item value="Category B - Option 1">
            <Select.Value>Category B - Option 1</Select.Value>
          </Select.Item>
          <Select.Item value="Category B - Option 2">
            <Select.Value>Category B - Option 2</Select.Value>
          </Select.Item>
          <Select.Divider />
          <Select.Item value="Category C - Option 1">
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
    const [value, setValue] = useState<string>("Starter")

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
          <Select.Item value="Starter">
            <Select.Value>Starter</Select.Value>
          </Select.Item>
          <Select.Item value="Professional">
            <Select.Value>Professional</Select.Value>
          </Select.Item>

          <Select.Divider />

          <Select.Label>Premium Plans</Select.Label>
          <Select.Item value="Business">
            <Select.Value>Business</Select.Value>
          </Select.Item>
          <Select.Item value="Enterprise">
            <Select.Value>Enterprise</Select.Value>
          </Select.Item>

          <Select.Divider />

          <Select.Label>Custom Solutions</Select.Label>
          <Select.Item value="Custom - Tailored">
            <Select.Value>Tailored</Select.Value>
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
    const [value, setValue] = useState<string>("Attachment Field")

    return (
      <Select
        value={value}
        onChange={setValue}
      >
        <Select.Trigger>
          <Select.Value>{value || "Select field type..."}</Select.Value>
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="Attachment Field">
            <FieldTypeAttachment />
            <Select.Value>Attachment Field</Select.Value>
          </Select.Item>
          <Select.Item value="Checkbox Field">
            <FieldTypeCheckbox />
            <Select.Value>Checkbox Field</Select.Value>
          </Select.Item>
          <Select.Item value="Count Field">
            <FieldTypeCount />
            <Select.Value>Count Field</Select.Value>
          </Select.Item>
        </Select.Content>
      </Select>
    )
  },
}

// 固定的城市名称列表，确保 SSR 和客户端渲染一致
const CITY_NAMES = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
  "Austin",
  "Jacksonville",
  "Fort Worth",
  "Columbus",
  "Charlotte",
  "San Francisco",
  "Indianapolis",
  "Seattle",
  "Denver",
  "Washington",
  "Boston",
  "El Paso",
  "Nashville",
  "Detroit",
  "Oklahoma City",
  "Portland",
  "Las Vegas",
  "Memphis",
  "Louisville",
  "Baltimore",
  "Milwaukee",
  "Albuquerque",
  "Tucson",
  "Fresno",
  "Sacramento",
  "Kansas City",
  "Mesa",
  "Atlanta",
  "Omaha",
  "Colorado Springs",
  "Raleigh",
  "Virginia Beach",
  "Miami",
  "Oakland",
  "Minneapolis",
  "Tulsa",
  "Cleveland",
  "Wichita",
  "Arlington",
  "Tampa",
  "New Orleans",
  "Honolulu",
  "Anaheim",
  "Santa Ana",
  "St. Louis",
  "Corpus Christi",
  "Riverside",
  "Lexington",
  "Pittsburgh",
  "Anchorage",
  "Stockton",
  "Cincinnati",
  "St. Paul",
  "Toledo",
  "Greensboro",
  "Newark",
  "Plano",
  "Henderson",
  "Lincoln",
  "Buffalo",
  "Jersey City",
  "Chula Vista",
  "Fort Wayne",
  "Orlando",
  "St. Petersburg",
  "Chandler",
  "Laredo",
  "Norfolk",
  "Durham",
  "Madison",
  "Lubbock",
  "Irvine",
  "Winston-Salem",
  "Glendale",
  "Garland",
  "Hialeah",
  "Reno",
  "Chesapeake",
  "Gilbert",
  "Baton Rouge",
  "Irving",
  "Scottsdale",
  "North Las Vegas",
  "Boise",
  "Fremont",
  "Richmond",
  "Birmingham",
  "Spokane",
  "Rochester",
  "Des Moines",
  "Modesto",
  "Fayetteville",
  "Tacoma",
  "Oxnard",
  "Fontana",
  "Columbus",
  "Montgomery",
  "Moreno Valley",
  "Shreveport",
  "Aurora",
  "Yonkers",
  "Akron",
]

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
          label: `${CITY_NAMES[i % CITY_NAMES.length]} ${i + 1}`,
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

    const options = [
      { value: "small", label: "Small" },
      { value: "medium", label: "Medium" },
      { value: "large", label: "Large" },
      { value: "extra-large", label: "Extra Large" },
    ]

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

        <div className="bg-secondary-background rounded-xl p-4">
          <p>Current Selection: {value || "None"}</p>
        </div>
      </div>
    )
  },
}

/**
 * [TEST] Select positioned at edge cases for testing placement behavior.
 */
export const MarginalConditions: Story = {
  render: function MarginalConditionsStory() {
    const [value, setValue] = useState<string>("")

    return (
      <div className="flex flex-col justify-end p-4">
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
 * [TEST]Multiple selects testing proper event handling and switching.
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

        <div className="bg-secondary-background space-y-2 rounded-xl p-4">
          <p className="text-secondary-foreground">Current Values:</p>
          <ul className="list-inside list-disc">
            <li>First: {value1}</li>
            <li>Second: {value2}</li>
            <li>Third: {value3}</li>
          </ul>
        </div>
      </div>
    )
  },
}

/**
 * Select.Item with custom onClick action handling.
 *
 * When a Select.Item has an onClick prop, it behaves as an action item rather than a selection item:
 * - Clicking the item executes the onClick handler instead of changing the Select value
 * - The Select menu will close after the onClick handler executes
 * - The current selection value remains unchanged
 * - Useful for adding action buttons within Select menus (e.g., "Settings", "More options", etc.)
 *
 * In this example:
 * - The first three items are normal selection items that update the Select value
 * - The "Open Music Settings" item has an onClick handler that opens a Popover
 * - The item with onClick does not require a value prop, as it won't be selected
 */
export const ItemActive: Story = {
  render: function ItemActiveStory() {
    const [open, setOpen] = useState(false)
    const [selectOpen, setSelectOpen] = useState(false)
    const itemRef = useRef<HTMLDivElement>(null)
    const [value, setValue] = useState<string | null>(null)

    const options = [
      { value: "option-1", label: "Option 1" },
      { value: "option-2", label: "Option 2" },
      { value: "option-3", label: "Option 3" },
    ]

    return (
      <>
        <Select
          value={value}
          onChange={setValue}
          open={selectOpen}
          onOpenChange={setSelectOpen}
        >
          <Select.Trigger>
            <Select.Value ref={itemRef}>
              {value ? options.find((option) => option.value === value)?.label : "Select song..."}
            </Select.Value>
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
          <Popover.Content className="w-80 space-y-4 p-4">
            <h3 className="font-strong">Music Settings</h3>
            <p className="text-secondary-foreground">
              Configure your music playback preferences and library settings.
            </p>
          </Popover.Content>
          <Popover.Footer className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Save</Button>
          </Popover.Footer>
        </Popover>
      </>
    )
  },
}

/**
 * Select component in large size.
 */
export const Large: Story = {
  render: function LargeStory() {
    const [value, setValue] = useState<string>("option-1")
    const options = Array.from({ length: 8 }, (_, i) => ({
      value: `option-${i + 1}`,
      label: `Option ${i + 1}`,
    }))

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
 * ESC key behavior control and event propagation verification.
 *
 * Use the checkbox to toggle closeOnEscape behavior:
 * - When enabled (default): Pressing ESC closes the select menu and prevents event propagation
 * - When disabled: Pressing ESC does NOT close the select menu, allowing event to propagate
 *
 * The ESC counter tracks window-level ESC events. When closeOnEscape is true and the select is open,
 * pressing ESC will close the menu but NOT increment the counter (event is stopped).
 * When closeOnEscape is false, pressing ESC will increment the counter.
 */
export const CloseOnEscape: Story = {
  render: function CloseOnEscapeStory() {
    const [value, setValue] = useState<string>("Option 2")
    const [closeOnEscape, setCloseOnEscape] = useState(true)
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
        <Checkbox
          value={closeOnEscape}
          onChange={setCloseOnEscape}
        >
          <Checkbox.Label>Close on ESC key</Checkbox.Label>
        </Checkbox>

        <div className="bg-secondary-background w-64 rounded-xl p-4">
          <p className="mb-2">
            Window ESC count: <strong>{escCount}</strong>
          </p>
          <p className="text-secondary-foreground">
            {closeOnEscape
              ? "When select is open, pressing ESC will close it but NOT increment the counter (event is stopped)."
              : "When select is open, pressing ESC will increment the counter (event propagates)."}
          </p>
        </div>

        <Select
          matchTriggerWidth
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
                value={`Option ${i + 1}`}
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
 * Select component in light variant.
 */
export const Light: Story = {
  render: function LightStory() {
    const [value, setValue] = useState<string>("Option 2")
    return (
      <Select
        variant="light"
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
              value={`Option ${i + 1}`}
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
 * [TEST] Select component in readOnly state.
 *
 * In readOnly mode:
 * - The menu can be opened and closed normally
 * - Clicking on options will not change the current selection
 * - The menu will remain open after clicking an option
 * - Useful for displaying options without allowing changes
 */
export const Readonly: Story = {
  render: function ReadonlyStory() {
    const [value, setValue] = useState<string>("option-2")
    const [changeCount, setChangeCount] = useState(0)

    const handleChange = (newValue: string) => {
      setValue(newValue)
      setChangeCount((prev) => prev + 1)
    }

    return (
      <div className="flex flex-col gap-4">
        <div className="bg-secondary-background w-64 rounded-xl p-4">
          <p>Current Selection: {value}</p>
          <p>Change Count: {changeCount}</p>
        </div>

        <Select
          readOnly
          value={value}
          onChange={handleChange}
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
