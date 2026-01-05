import { ChipProps, Label, MultiSelect, Select, tcx } from "@choice-ui/react"
import {
  FieldTypeAttachment,
  FieldTypeCheckbox,
  FieldTypeCount,
  RemoveTiny,
  Settings,
} from "@choiceform/icons-react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { useCallback, useMemo, useState } from "react"

const meta: Meta<typeof MultiSelect> = {
  title: "Collections/MultiSelect",
  component: MultiSelect,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof MultiSelect>

/**
 * Basic: The simplest usage of MultiSelect.
 *
 * Features:
 * - Multiple selection with chip-based display
 * - Individual item removal
 * - Keyboard navigation support
 * - Standard dropdown positioning
 * - Controlled selection state
 */
export const Basic: Story = {
  render: function BasicStory() {
    const [values, setValues] = useState<string[]>(["option-2", "option-4"])

    const options = useMemo(
      () =>
        Array.from({ length: 8 }, (_, i) => ({
          value: `option-${i + 1}`,
          label: `Option ${i + 1}`,
        })),
      [],
    )

    const getDisplayValue = useCallback(
      (value: string) => {
        return options.find((opt) => opt.value === value)?.label || value
      },
      [options],
    )

    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label>Basic Multi-Select</Label>
          <MultiSelect
            values={values}
            onChange={setValues}
          >
            <MultiSelect.Trigger
              placeholder="Select options..."
              getDisplayValue={getDisplayValue}
              className="w-80"
            />
            <MultiSelect.Content>
              <MultiSelect.Label>Available Options</MultiSelect.Label>
              {options.map((option) => (
                <MultiSelect.Item
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </MultiSelect.Item>
              ))}
            </MultiSelect.Content>
          </MultiSelect>
        </div>

        <div className="w-80 rounded-xl border p-4">
          <h3 className="font-strong mb-2">Selected Values</h3>
          <div className="space-y-1">
            <div>
              Count: <span className="font-mono">{values.length}</span>
            </div>
            <div>
              Values: <span className="font-mono">[{values.join(", ")}]</span>
            </div>
          </div>
        </div>
      </div>
    )
  },
}

/**
 * Disabled: Demonstrates disabled MultiSelect functionality.
 *
 * Features:
 * - Disabled component prevents interaction
 * - Visual feedback for disabled state
 * - Selected values remain visible
 * - Useful for conditional availability
 */
export const Disabled: Story = {
  render: function DisabledStory() {
    const [values] = useState<string[]>(["option-2", "option-4"])

    const options = useMemo(
      () =>
        Array.from({ length: 5 }, (_, i) => ({
          value: `option-${i + 1}`,
          label: `Option ${i + 1}`,
        })),
      [],
    )

    const getDisplayValue = useCallback(
      (value: string) => {
        return options.find((opt) => opt.value === value)?.label || value
      },
      [options],
    )

    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label>Disabled Multi-Select</Label>
          <MultiSelect
            values={values}
            disabled
          >
            <MultiSelect.Trigger
              placeholder="Select options..."
              getDisplayValue={getDisplayValue}
              className="w-80"
            />
            <MultiSelect.Content>
              <MultiSelect.Label>Available Options</MultiSelect.Label>
              {options.map((option) => (
                <MultiSelect.Item
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </MultiSelect.Item>
              ))}
            </MultiSelect.Content>
          </MultiSelect>
        </div>

        <div className="w-80 rounded-xl border p-4">
          <h3 className="font-strong mb-2">Component State</h3>
          <div className="space-y-1">
            <div>
              Status: <span className="font-mono text-red-600">Disabled</span>
            </div>
            <div>
              Selected: <span className="font-mono">{values.join(", ")}</span>
            </div>
          </div>
        </div>
      </div>
    )
  },
}

/**
 * DisabledItems: Demonstrates disabled items in MultiSelect.
 *
 * Features:
 * - Individual items can be disabled
 * - Disabled items cannot be selected
 * - Visual feedback for disabled items
 * - Maintains keyboard navigation flow
 */
export const DisabledItems: Story = {
  render: function DisabledItemsStory() {
    const [values, setValues] = useState<string[]>(["option-1", "option-3"])

    const options = useMemo(
      () =>
        Array.from({ length: 6 }, (_, i) => ({
          value: `option-${i + 1}`,
          label: `Option ${i + 1}`,
          disabled: i === 2,
        })),
      [],
    )

    const getDisplayValue = useCallback(
      (value: string) => {
        return options.find((opt) => opt.value === value)?.label || value
      },
      [options],
    )

    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label>Disabled Items</Label>
          <MultiSelect
            values={values}
            onChange={setValues}
          >
            <MultiSelect.Trigger
              placeholder="Select options..."
              getDisplayValue={getDisplayValue}
              className="w-80"
            />
            <MultiSelect.Content>
              {options.map((option) => (
                <MultiSelect.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </MultiSelect.Item>
              ))}
            </MultiSelect.Content>
          </MultiSelect>
        </div>
      </div>
    )
  },
}

/**
 * LargeSize: Demonstrates MultiSelect with large size variant.
 *
 * Features:
 * - Large trigger size
 * - Large menu items
 * - Consistent sizing across components
 * - Better visibility and touch targets
 */
export const LargeSize: Story = {
  render: function LargeSizeStory() {
    const [values, setValues] = useState<string[]>(["option-1", "option-3"])

    const options = useMemo(
      () =>
        Array.from({ length: 6 }, (_, i) => ({
          value: `option-${i + 1}`,
          label: `Large Option ${i + 1}`,
        })),
      [],
    )

    const getDisplayValue = useCallback(
      (value: string) => {
        return options.find((opt) => opt.value === value)?.label || value
      },
      [options],
    )

    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label>Large Multi-Select</Label>
          <MultiSelect
            values={values}
            onChange={setValues}
            size="large"
          >
            <MultiSelect.Trigger
              placeholder="Select options..."
              getDisplayValue={getDisplayValue}
              className="w-80"
            />
            <MultiSelect.Content>
              <MultiSelect.Label>Available Options</MultiSelect.Label>
              {options.map((option) => (
                <MultiSelect.Item
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </MultiSelect.Item>
              ))}
            </MultiSelect.Content>
          </MultiSelect>
        </div>

        <div className="w-80 rounded-xl border p-4">
          <h3 className="font-strong mb-2">Selected Values</h3>
          <div className="space-y-1">
            <div>
              Size: <span className="font-mono">Large</span>
            </div>
            <div>
              Count: <span className="font-mono">{values.length}</span>
            </div>
            <div>
              Values: <span className="font-mono">[{values.join(", ")}]</span>
            </div>
          </div>
        </div>
      </div>
    )
  },
}

/**
 * LightVariant: Demonstrates MultiSelect with light variant styling.
 *
 * Features:
 * - Light variant visual style
 * - Standard selection functionality
 * - Chip-based display
 * - Consistent with light theme
 */
export const LightVariant: Story = {
  render: function LightVariantStory() {
    const [values, setValues] = useState<string[]>([])
    return (
      <MultiSelect
        values={values}
        onChange={setValues}
        variant="light"
      >
        <MultiSelect.Trigger className="w-80" />
        <MultiSelect.Content>
          <MultiSelect.Item value="apple">Apple</MultiSelect.Item>
          <MultiSelect.Item value="banana">Banana</MultiSelect.Item>
          <MultiSelect.Item value="orange">Orange</MultiSelect.Item>
          <MultiSelect.Item value="grape">Grape</MultiSelect.Item>
          <MultiSelect.Item value="strawberry">Strawberry</MultiSelect.Item>
          <MultiSelect.Item value="kiwi">Kiwi</MultiSelect.Item>
        </MultiSelect.Content>
      </MultiSelect>
    )
  },
}

/**
 * WithIcons: Demonstrates MultiSelect with icons and complex data.
 *
 * Features:
 * - Icons displayed in menu items
 * - Icons shown in selected chips
 * - Complex data structures support
 * - Maximum selection limit
 *
 * Use cases:
 * - Field type selection
 * - Category selection with icons
 * - Visual option identification
 */
export const WithIcons: Story = {
  render: function WithIconsStory() {
    const [values, setValues] = useState<string[]>(["attachment", "count"])

    const options = useMemo(
      () => [
        {
          value: "attachment",
          label: "Attachment Field",
          icon: <FieldTypeAttachment />,
        },
        {
          value: "checkbox",
          label: "Checkbox Field",
          icon: <FieldTypeCheckbox />,
        },
        { value: "count", label: "Count Field", icon: <FieldTypeCount /> },
        { value: "settings", label: "Settings Field", icon: <Settings /> },
      ],
      [],
    )

    const getDisplayValue = useCallback(
      (value: string) => {
        return options.find((opt) => opt.value === value)?.label || value
      },
      [options],
    )

    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label>Field Types Selection</Label>
          <MultiSelect
            values={values}
            onChange={setValues}
            maxSelection={3}
          >
            <MultiSelect.Trigger
              placeholder="Select field types..."
              getDisplayValue={getDisplayValue}
              className="w-80"
            />
            <MultiSelect.Content>
              <MultiSelect.Label>Field Types</MultiSelect.Label>
              {options.map((option) => (
                <MultiSelect.Item
                  key={option.value}
                  value={option.value}
                >
                  {option.icon}
                  {option.label}
                </MultiSelect.Item>
              ))}
            </MultiSelect.Content>
          </MultiSelect>
        </div>

        <div className="w-80 rounded-xl border p-4">
          <h3 className="font-strong mb-2">Selected Field Types</h3>
          <div className="space-y-2">
            {values.map((value) => {
              const option = options.find((opt) => opt.value === value)
              return (
                <div
                  key={value}
                  className="text-body-small flex items-center gap-2"
                >
                  {option?.icon}
                  <span>{option?.label}</span>
                  <span className="text-secondary-foreground font-mono">({value})</span>
                </div>
              )
            })}
            {values.length === 0 && (
              <div className="text-secondary-foreground font-mono">No field types selected</div>
            )}
          </div>
        </div>
      </div>
    )
  },
}

/**
 * WithLabelsAndDividers: Demonstrates MultiSelect with labels and dividers for organization.
 *
 * Features:
 * - Section labels for grouping
 * - Visual dividers for separation
 * - Better menu organization
 * - Hierarchical menu structure
 *
 * Use cases:
 * - Plan selection with categories
 * - Grouped option lists
 * - Complex menu structures
 */
export const WithLabelsAndDividers: Story = {
  render: function WithLabelsAndDividersStory() {
    const [values, setValues] = useState<string[]>(["basic-1", "premium-1"])

    const getDisplayValue = useCallback((value: string) => {
      const labelMap: Record<string, string> = {
        "basic-1": "Basic - Starter",
        "basic-2": "Basic - Professional",
        "premium-1": "Premium - Business",
        "premium-2": "Premium - Enterprise",
        "custom-1": "Custom - Tailored",
      }
      return labelMap[value] || value
    }, [])

    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label>Plan Selection</Label>
          <MultiSelect
            values={values}
            onChange={setValues}
          >
            <MultiSelect.Trigger
              placeholder="Select plans..."
              getDisplayValue={getDisplayValue}
              className="w-80"
            />
            <MultiSelect.Content>
              <MultiSelect.Label>Basic Plans</MultiSelect.Label>
              <MultiSelect.Item value="basic-1">Basic - Starter</MultiSelect.Item>
              <MultiSelect.Item value="basic-2">Basic - Professional</MultiSelect.Item>

              <MultiSelect.Divider />

              <MultiSelect.Label>Premium Plans</MultiSelect.Label>
              <MultiSelect.Item value="premium-1">Premium - Business</MultiSelect.Item>
              <MultiSelect.Item value="premium-2">Premium - Enterprise</MultiSelect.Item>

              <MultiSelect.Divider />

              <MultiSelect.Label>Custom Solutions</MultiSelect.Label>
              <MultiSelect.Item value="custom-1">Custom - Tailored</MultiSelect.Item>
            </MultiSelect.Content>
          </MultiSelect>
        </div>

        <div className="w-80 rounded-xl border p-4">
          <h3 className="font-strong mb-2">Selected Plans</h3>
          <div className="space-y-1">
            {values.map((value) => (
              <div key={value}>
                <span className="text-secondary-foreground font-mono">{value}</span>
                {" → "}
                <span>{getDisplayValue(value)}</span>
              </div>
            ))}
            {values.length === 0 && (
              <div className="text-secondary-foreground font-mono">No plans selected</div>
            )}
          </div>
        </div>
      </div>
    )
  },
}

const CITY_NAMES_MULTI = [
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
 * LongList: Demonstrates MultiSelect with a long list of options and performance optimization.
 *
 * Features:
 * - Long list of options (100 items)
 * - Automatic scrolling when content exceeds height
 * - Scroll arrows for navigation
 * - Performance optimization for large lists
 * - Maximum selection limit
 *
 * Use cases:
 * - City/region selectors
 * - Long option lists
 * - Large dataset selection
 */
export const LongList: Story = {
  render: function LongListStory() {
    const [values, setValues] = useState<string[]>(["city-25", "city-50", "city-75"])

    const options = useMemo(
      () =>
        Array.from({ length: 100 }, (_, i) => ({
          value: `city-${i + 1}`,
          label: `${CITY_NAMES_MULTI[i % CITY_NAMES_MULTI.length]} ${i + 1}`,
        })),
      [],
    )

    const getDisplayValue = useCallback(
      (value: string) => {
        return options.find((opt) => opt.value === value)?.label || value
      },
      [options],
    )

    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <label className="font-strong">City Selection ({options.length} cities)</label>
          <MultiSelect
            values={values}
            onChange={setValues}
            maxSelection={10}
          >
            <MultiSelect.Trigger
              placeholder="Select cities..."
              getDisplayValue={getDisplayValue}
              className="w-80"
            />
            <MultiSelect.Content>
              <MultiSelect.Label>Cities ({options.length} total)</MultiSelect.Label>
              {options.map((option) => (
                <MultiSelect.Item
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </MultiSelect.Item>
              ))}
            </MultiSelect.Content>
          </MultiSelect>
        </div>

        <div className="w-80 rounded-xl border p-4">
          <h3 className="font-strong mb-2">Selected Cities</h3>
          <div className="space-y-1">
            <div>
              Count: <span className="font-mono">{values.length}</span>
            </div>
            <div className="max-h-32 overflow-y-auto">
              {values.map((value) => (
                <div
                  key={value}
                  className="flex items-center gap-2"
                >
                  <span className="text-secondary-foreground font-mono">{value}</span>
                  <span>→</span>
                  <span>{getDisplayValue(value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  },
}

/**
 * WithLimits: Demonstrates MultiSelect with maximum and minimum selection limits.
 *
 * Features:
 * - Maximum selection limit (prevents selecting more)
 * - Minimum selection limit (prevents removing below threshold)
 * - Visual feedback for limit constraints
 * - Selection state validation
 *
 * Use cases:
 * - Required field selection
 * - Limited choice scenarios
 * - Form validation requirements
 */
export const WithLimits: Story = {
  render: function WithLimitsStory() {
    const [values, setValues] = useState<string[]>(["option-2"])

    const options = useMemo(
      () =>
        Array.from({ length: 8 }, (_, i) => ({
          value: `option-${i + 1}`,
          label: `Option ${i + 1}`,
        })),
      [],
    )

    const getDisplayValue = useCallback(
      (value: string) => {
        return options.find((opt) => opt.value === value)?.label || value
      },
      [options],
    )

    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label>Multi-Select with Limits (Max 3, Min 1)</Label>
          <MultiSelect
            values={values}
            onChange={setValues}
            maxSelection={3}
            minSelection={1}
          >
            <MultiSelect.Trigger
              placeholder="Select 1-3 options..."
              getDisplayValue={getDisplayValue}
              className="w-80"
            />
            <MultiSelect.Content>
              <MultiSelect.Label>Available Options</MultiSelect.Label>
              {options.map((option) => (
                <MultiSelect.Item
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </MultiSelect.Item>
              ))}
            </MultiSelect.Content>
          </MultiSelect>
        </div>

        <div className="w-80 rounded-xl border p-4">
          <h3 className="font-strong mb-2">Selection Status</h3>
          <div className="space-y-1">
            <div>
              Count: <span className="font-mono">{values.length}</span>
            </div>
            <div>
              Can add more: <span className="font-mono">{values.length < 3 ? "Yes" : "No"}</span>
            </div>
            <div>
              Can remove: <span className="font-mono">{values.length > 1 ? "Yes" : "No"}</span>
            </div>
          </div>
        </div>
      </div>
    )
  },
}

/**
 * ExclusiveOptions: Demonstrates exclusive options with group and global exclusivity.
 *
 * Features:
 * - Group exclusive (exclusiveIndex > 0): Groups mutually exclusive, multiple within group allowed
 * - Global exclusive (exclusiveIndex = -1): Clears all other options
 * - No constraint (exclusiveIndex = undefined): No exclusive constraint
 * - Automatic clearing of conflicting selections
 *
 * Exclusive Options Rules:
 * - Group 1 (A, B, C): Can select multiple within group
 * - Group 2 (D, E, F): Can select multiple within group
 * - Groups are mutually exclusive (selecting Group 2 clears Group 1)
 * - Option G: Global exclusive (clears all others)
 * - Options H, I: No constraints (but cleared when selecting constrained options)
 */
export const ExclusiveOptions: Story = {
  render: function ExclusiveOptionsStory() {
    const [values, setValues] = useState<string[]>([])

    const options = useMemo(
      () => [
        { value: "a", label: "Option A (Group 1)", exclusiveIndex: 1 },
        { value: "b", label: "Option B (Group 1)", exclusiveIndex: 1 },
        { value: "c", label: "Option C (Group 1)", exclusiveIndex: 1 },
        { value: "d", label: "Option D (Group 2)", exclusiveIndex: 2 },
        { value: "e", label: "Option E (Group 2)", exclusiveIndex: 2 },
        { value: "f", label: "Option F (Group 2)", exclusiveIndex: 2 },
        {
          value: "g",
          label: "Option G (Global Exclusive)",
          exclusiveIndex: -1,
        },
        {
          value: "h",
          label: "Option H (No Constraint)",
          exclusiveIndex: undefined,
        },
        {
          value: "i",
          label: "Option I (No Constraint)",
          exclusiveIndex: undefined,
        },
      ],
      [],
    )

    const getDisplayValue = useCallback(
      (value: string) => {
        return options.find((opt) => opt.value === value)?.label || value
      },
      [options],
    )

    return (
      <MultiSelect
        values={values}
        onChange={setValues}
        placement="bottom-start"
        matchTriggerWidth
      >
        <MultiSelect.Trigger
          placeholder="Select options..."
          getDisplayValue={getDisplayValue}
          className="w-80"
        />
        <MultiSelect.Content>
          <MultiSelect.Label>Group 1</MultiSelect.Label>
          {options.slice(0, 3).map((option) => (
            <MultiSelect.Item
              key={option.value}
              value={option.value}
              exclusiveIndex={option.exclusiveIndex}
            >
              {option.label}
            </MultiSelect.Item>
          ))}

          <MultiSelect.Divider />

          <MultiSelect.Label>Group 2</MultiSelect.Label>
          {options.slice(3, 6).map((option) => (
            <MultiSelect.Item
              key={option.value}
              value={option.value}
              exclusiveIndex={option.exclusiveIndex}
            >
              {option.label}
            </MultiSelect.Item>
          ))}

          <MultiSelect.Divider />

          <MultiSelect.Label>Special Options</MultiSelect.Label>
          <MultiSelect.Item
            value="g"
            exclusiveIndex={-1}
          >
            Option G (Global Exclusive)
          </MultiSelect.Item>

          <MultiSelect.Divider />

          <MultiSelect.Label>No Constraints</MultiSelect.Label>
          {options.slice(7).map((option) => (
            <MultiSelect.Item
              key={option.value}
              value={option.value}
              exclusiveIndex={option.exclusiveIndex}
            >
              {option.label}
            </MultiSelect.Item>
          ))}
        </MultiSelect.Content>
      </MultiSelect>
    )
  },
}

/**
 * CloseOnSelect: Demonstrates controlling whether the menu closes when selecting options.
 *
 * Features:
 * - closeOnSelect=false: Menu stays open after selecting options (default behavior)
 * - closeOnSelect=true: Menu closes after each selection
 * - Side-by-side comparison of both behaviors
 * - Better UX for multiple selections
 *
 * Use cases:
 * - Quick multi-selection (keep open)
 * - Single selection scenarios (close on select)
 */
export const CloseOnSelect: Story = {
  render: function CloseOnSelectStory() {
    const [values1, setValues1] = useState<string[]>([])
    const [values2, setValues2] = useState<string[]>([])

    const options = useMemo(
      () =>
        Array.from({ length: 6 }, (_, i) => ({
          value: `option-${i + 1}`,
          label: `Option ${i + 1}`,
        })),
      [],
    )

    const getDisplayValue = useCallback(
      (value: string) => {
        return options.find((opt) => opt.value === value)?.label || value
      },
      [options],
    )

    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label>closeOnSelect=false (Default)</Label>

          <MultiSelect
            values={values1}
            onChange={setValues1}
            closeOnSelect={false}
            placement="bottom-start"
          >
            <MultiSelect.Trigger
              placeholder="Select options..."
              getDisplayValue={getDisplayValue}
              className="w-80"
            />
            <MultiSelect.Content>
              {options.map((option) => (
                <MultiSelect.Item
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </MultiSelect.Item>
              ))}
            </MultiSelect.Content>
          </MultiSelect>
        </div>

        <div className="flex flex-col gap-2">
          <Label>closeOnSelect=true</Label>

          <MultiSelect
            values={values2}
            onChange={setValues2}
            closeOnSelect={true}
            placement="bottom-start"
          >
            <MultiSelect.Trigger
              placeholder="Select options..."
              getDisplayValue={getDisplayValue}
              className="w-80"
            />
            <MultiSelect.Content>
              {options.map((option) => (
                <MultiSelect.Item
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </MultiSelect.Item>
              ))}
            </MultiSelect.Content>
          </MultiSelect>
        </div>
      </div>
    )
  },
}

/**
 * ValidationMessages: Demonstrates validation messages for selection constraints.
 *
 * Features:
 * - Shows validation messages when constraints are violated
 * - Customizable messages via i18n prop
 * - Auto-dismiss after 3 seconds
 * - showValidationMessage prop to control display
 * - Custom vs default message comparison
 *
 * Use cases:
 * - Form validation feedback
 * - User guidance for constraints
 * - Internationalization support
 */
export const ValidationMessages: Story = {
  render: function ValidationMessagesStory() {
    const [values, setValues] = useState<string[]>([])

    const options = useMemo(
      () =>
        Array.from({ length: 8 }, (_, i) => ({
          value: `option-${i + 1}`,
          label: `Option ${i + 1}`,
        })),
      [],
    )

    const getDisplayValue = useCallback(
      (value: string) => {
        return options.find((opt) => opt.value === value)?.label || value
      },
      [options],
    )

    return (
      <div className="space-y-4">
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label>With Custom Messages</Label>
            <MultiSelect
              values={values}
              onChange={setValues}
              maxSelection={3}
              minSelection={1}
              i18n={{
                maxSelectionMessage: (maxSelection) =>
                  `You can select up to ${maxSelection} options`,
                minSelectionMessage: (minSelection) =>
                  `You must select at least ${minSelection} options`,
              }}
              showValidationMessage={true}
            >
              <MultiSelect.Trigger getDisplayValue={getDisplayValue} />
              <MultiSelect.Content>
                {options.map((option) => (
                  <MultiSelect.Item
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </MultiSelect.Item>
                ))}
              </MultiSelect.Content>
            </MultiSelect>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Default Messages</Label>
            <MultiSelect
              values={values}
              onChange={setValues}
              maxSelection={2}
              minSelection={1}
              showValidationMessage={true}
            >
              <MultiSelect.Trigger getDisplayValue={getDisplayValue} />
              <MultiSelect.Content>
                {options.slice(0, 5).map((option) => (
                  <MultiSelect.Item
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </MultiSelect.Item>
                ))}
              </MultiSelect.Content>
            </MultiSelect>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Messages Disabled</Label>
            <MultiSelect
              values={values}
              onChange={setValues}
              maxSelection={2}
              showValidationMessage={false}
            >
              <MultiSelect.Trigger getDisplayValue={getDisplayValue} />
              <MultiSelect.Content>
                {options.slice(0, 4).map((option) => (
                  <MultiSelect.Item
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </MultiSelect.Item>
                ))}
              </MultiSelect.Content>
            </MultiSelect>
          </div>
        </div>

        <div className="w-80 rounded-xl border p-4">
          <h3 className="font-strong mb-2">Selected Values</h3>
          <div className="space-y-1">
            <div>
              Count: <span className="font-mono">{values.length}</span>
            </div>
            <div>
              Values: <span className="font-mono">[{values.join(", ")}]</span>
            </div>
          </div>
        </div>
      </div>
    )
  },
}

/**
 * MaxChips: Demonstrates limiting the number of visible chips in the trigger.
 *
 * Features:
 * - Maximum number of visible chips
 * - Overflow indicator when limit exceeded
 * - Compact display for many selections
 * - Better UI for space-constrained layouts
 *
 * Use cases:
 * - Narrow input fields
 * - Mobile interfaces
 * - Space-efficient designs
 */
export const MaxChips: Story = {
  render: function MaxChipsStory() {
    const [values, setValues] = useState<string[]>([])

    return (
      <MultiSelect
        values={values}
        onChange={setValues}
        maxChips={3}
        placeholder="Select options..."
      >
        <MultiSelect.Trigger className="w-80" />
        <MultiSelect.Content>
          <MultiSelect.Item value="apple">Apple</MultiSelect.Item>
          <MultiSelect.Item value="banana">Banana</MultiSelect.Item>
          <MultiSelect.Item value="orange">Orange</MultiSelect.Item>
          <MultiSelect.Item value="grape">Grape</MultiSelect.Item>
          <MultiSelect.Item value="strawberry">Strawberry</MultiSelect.Item>
          <MultiSelect.Item value="kiwi">Kiwi</MultiSelect.Item>
        </MultiSelect.Content>
      </MultiSelect>
    )
  },
}

/**
 * ChipVariant: Demonstrates different chip visual variants.
 *
 * Features:
 * - Multiple chip variants (default, accent, success)
 * - Dynamic variant selection
 * - Visual distinction for selected items
 * - Consistent styling across variants
 *
 * Use cases:
 * - Status-based selection
 * - Category differentiation
 * - Visual hierarchy
 */
export const ChipVariant: Story = {
  render: function VariantStory() {
    const [values, setValues] = useState<string[]>([])
    const [variant, setVariant] = useState<ChipProps["variant"]>("default")

    return (
      <>
        <Select
          value={variant}
          onChange={(value) => setVariant(value as ChipProps["variant"])}
        >
          <Select.Trigger>
            <Select.Value>{variant}</Select.Value>
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="default">Default</Select.Item>
            <Select.Item value="accent">Accent</Select.Item>
            <Select.Item value="success">Success</Select.Item>
          </Select.Content>
        </Select>
        <MultiSelect
          values={values}
          onChange={setValues}
          chipVariant={variant}
        >
          <MultiSelect.Trigger className="w-80" />
          <MultiSelect.Content>
            <MultiSelect.Item value="apple">Apple</MultiSelect.Item>
            <MultiSelect.Item value="banana">Banana</MultiSelect.Item>
            <MultiSelect.Item value="orange">Orange</MultiSelect.Item>
            <MultiSelect.Item value="grape">Grape</MultiSelect.Item>
            <MultiSelect.Item value="strawberry">Strawberry</MultiSelect.Item>
            <MultiSelect.Item value="kiwi">Kiwi</MultiSelect.Item>
          </MultiSelect.Content>
        </MultiSelect>
      </>
    )
  },
}

/**
 * CustomChip: Demonstrates custom chip rendering with personalized styling.
 *
 * Features:
 * - Custom chip appearance with custom colors
 * - Custom delete button styling
 * - Emoji-based visual indicators
 * - Maintains all standard functionality
 *
 * Use cases:
 * - Branded interfaces
 * - Themed applications
 * - Enhanced visual appeal
 */
export const CustomChip: Story = {
  render: function CustomChipExample() {
    const [values, setValues] = useState<string[]>(["apple", "banana"])

    const fruitConfig: Record<string, { emoji: string; colorClass: string }> = {
      apple: { emoji: "🍎", colorClass: "bg-red-100 text-red-800 border-red-500" },
      banana: { emoji: "🍌", colorClass: "bg-yellow-100 text-yellow-800 border-yellow-500" },
      orange: { emoji: "🍊", colorClass: "bg-orange-100 text-orange-800 border-orange-500" },
      grape: { emoji: "🍇", colorClass: "bg-purple-100 text-purple-800 border-purple-500" },
      strawberry: { emoji: "🍓", colorClass: "bg-pink-100 text-pink-800 border-pink-500" },
      kiwi: { emoji: "🥝", colorClass: "bg-green-100 text-green-800 border-green-500" },
    }

    const renderCustomChip = useCallback(
      ({
        value,
        displayValue,
        onRemove,
        disabled,
      }: {
        value: string
        displayValue: string
        onRemove?: (e: React.MouseEvent<HTMLButtonElement>) => void
        disabled?: boolean
      }) => {
        const config = fruitConfig[value.toLowerCase()] || {
          emoji: "🍎",
          colorClass: "bg-blue-100 text-blue-800 border-blue-500",
        }
        return (
          <div
            className={tcx(
              "inline-flex h-4 items-center gap-1 rounded-md border pl-1",
              disabled ? "bg-disabled-background" : config.colorClass,
            )}
          >
            <span>{config.emoji}</span>
            <span>{displayValue}</span>
            {onRemove && !disabled && (
              <button
                type="button"
                className="size-4 opacity-50 hover:opacity-100"
                onClick={onRemove}
                data-remove-button
              >
                <RemoveTiny />
              </button>
            )}
          </div>
        )
      },
      [],
    )

    return (
      <div className="space-y-4">
        <MultiSelect
          values={values}
          onChange={setValues}
          renderChip={renderCustomChip}
          placeholder="Select fruits with custom chips"
        >
          <MultiSelect.Trigger className="w-80" />
          <MultiSelect.Content>
            <MultiSelect.Item value="apple">{fruitConfig.apple.emoji} Apple</MultiSelect.Item>
            <MultiSelect.Item value="banana">{fruitConfig.banana.emoji} Banana</MultiSelect.Item>
            <MultiSelect.Item value="orange">{fruitConfig.orange.emoji} Orange</MultiSelect.Item>
            <MultiSelect.Item value="grape">{fruitConfig.grape.emoji} Grape</MultiSelect.Item>
            <MultiSelect.Item value="strawberry">
              {fruitConfig.strawberry.emoji} Strawberry
            </MultiSelect.Item>
            <MultiSelect.Item value="kiwi">{fruitConfig.kiwi.emoji} Kiwi</MultiSelect.Item>
          </MultiSelect.Content>
        </MultiSelect>

        <div className="text-secondary-foreground">Selected: {values.length} items</div>
      </div>
    )
  },
}

/**
 * [TEST] Readonly: Demonstrates MultiSelect in readOnly state.
 *
 * Features:
 * - The menu can be opened and closed normally
 * - Clicking on options will not change the current selection
 * - The menu will remain open after clicking an option
 * - Chip remove buttons are disabled and cannot remove chips
 * - Backspace key cannot remove chips
 * - Useful for displaying options without allowing changes
 *
 * Use cases:
 * - Preview mode interfaces
 * - Read-only user permissions
 * - Display-only selection scenarios
 */
export const Readonly: Story = {
  render: function ReadonlyStory() {
    const [values, setValues] = useState<string[]>(["apple", "banana"])
    const [changeCount, setChangeCount] = useState(0)

    const handleChange = (newValues: string[]) => {
      setValues(newValues)
      setChangeCount((prev) => prev + 1)
    }

    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border bg-stone-50 p-4">
          <div className="text-body-small-strong mb-2 text-stone-700">Current Selection:</div>
          <div className="text-body-small font-mono text-stone-600">
            {values.length > 0 ? values.join(", ") : "None"}
          </div>
          <div className="text-body-small-strong mt-2 text-stone-700">Change Count:</div>
          <div className="text-body-small font-mono text-stone-600">{changeCount}</div>
        </div>

        <MultiSelect
          readOnly
          values={values}
          onChange={handleChange}
        >
          <MultiSelect.Trigger placeholder="Select fruits...">
            {values.length > 0 ? `${values.length} selected` : "Select fruits..."}
          </MultiSelect.Trigger>
          <MultiSelect.Content>
            <MultiSelect.Item value="apple">Apple</MultiSelect.Item>
            <MultiSelect.Item value="banana">Banana</MultiSelect.Item>
            <MultiSelect.Item value="orange">Orange</MultiSelect.Item>
            <MultiSelect.Item value="grape">Grape</MultiSelect.Item>
            <MultiSelect.Item value="strawberry">Strawberry</MultiSelect.Item>
            <MultiSelect.Item value="kiwi">Kiwi</MultiSelect.Item>
          </MultiSelect.Content>
        </MultiSelect>
      </div>
    )
  },
}

/**
 * Empty: Demonstrates empty state display when no options are available.
 *
 * Features:
 * - Show custom empty message when options list is empty
 * - Useful for async loading or filtered results scenarios
 */
export const Empty: Story = {
  render: function EmptyStory() {
    const [values, setValues] = useState<string[]>([])
    const options: { value: string; label: string }[] = []

    return (
      <MultiSelect
        values={values}
        onChange={setValues}
      >
        <MultiSelect.Trigger
          placeholder="Select options..."
          className="w-80"
        />
        <MultiSelect.Content>
          {options.length > 0 ? (
            options.map((option) => (
              <MultiSelect.Item
                key={option.value}
                value={option.value}
              >
                {option.label}
              </MultiSelect.Item>
            ))
          ) : (
            <MultiSelect.Empty>No options available</MultiSelect.Empty>
          )}
        </MultiSelect.Content>
      </MultiSelect>
    )
  },
}
