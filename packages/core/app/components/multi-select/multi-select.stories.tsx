import {
  FieldTypeAttachment,
  FieldTypeCheckbox,
  FieldTypeCount,
  RemoveTiny,
  Settings,
} from "@choiceform/icons-react"
import { faker } from "@faker-js/faker"
import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { useCallback, useMemo, useState } from "react"
import { MultiSelect } from "./multi-select"
import { tcx } from "../../utils"
import { ChipProps } from "../chip"
import { Select } from "../select"

const meta: Meta<typeof MultiSelect> = {
  title: "Collections/MultiSelect",
  component: MultiSelect,
  tags: ["new", "autodocs"],
}

export default meta
type Story = StoryObj<typeof MultiSelect>

/**
 * Basic multiple selection component.
 *
 * Features:
 * - Multiple selection with chip-based display
 * - Individual item removal
 * - Keyboard navigation support
 * - Standard dropdown positioning
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
        <div className="space-y-2">
          <label className="font-strong">Basic Multi-Select</label>
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
 * Multi-select with maximum and minimum selection limits.
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
        <div className="space-y-2">
          <label className="font-strong">Multi-Select with Limits (Max 3, Min 1)</label>
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
 * Multi-select with icons and complex data.
 */
export const WithIcons: Story = {
  render: function WithIconsStory() {
    const [values, setValues] = useState<string[]>(["attachment", "count"])

    const options = useMemo(
      () => [
        { value: "attachment", label: "Attachment Field", icon: <FieldTypeAttachment /> },
        { value: "checkbox", label: "Checkbox Field", icon: <FieldTypeCheckbox /> },
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
        <div className="space-y-2">
          <label className="font-strong">Field Types Selection</label>
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
 * Multi-select with dividers and labels for better organization.
 */
export const WithDividers: Story = {
  render: function WithDividersStory() {
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
        <div className="space-y-2">
          <label className="font-strong">Plan Selection</label>
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

/**
 * Multi-select with long list of options for performance testing.
 */
export const LongList: Story = {
  render: function LongListStory() {
    const [values, setValues] = useState<string[]>(["city-25", "city-50", "city-75"])

    const options = useMemo(
      () =>
        Array.from({ length: 100 }, (_, i) => ({
          value: `city-${i + 1}`,
          label: `${faker.location.city()} ${i + 1}`,
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
        <div className="space-y-2">
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
 * Disabled multi-select component.
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
        <div className="space-y-2">
          <label className="font-strong">Disabled Multi-Select</label>
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
 * Disabled items
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
        <div className="space-y-2">
          <label className="font-strong">Disabled Items</label>
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
 * Large size multi-select component.
 */
export const Large: Story = {
  render: function LargeStory() {
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
        <div className="space-y-2">
          <label className="font-strong">Large Multi-Select</label>
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
 * Exclusive options demonstration.
 *
 * Features:
 * - exclusiveIndex > 0: Group exclusive (groups mutually exclusive, multiple within group allowed)
 * - exclusiveIndex = -1: Global exclusive (clears all other options)
 * - exclusiveIndex = undefined: No exclusive constraint (but cleared when selecting constrained options)
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
        { value: "g", label: "Option G (Global Exclusive)", exclusiveIndex: -1 },
        { value: "h", label: "Option H (No Constraint)", exclusiveIndex: undefined },
        { value: "i", label: "Option I (No Constraint)", exclusiveIndex: undefined },
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
        <div className="text-secondary-foreground">
          <p>Exclusive Options Rules:</p>
          <ul className="mt-2 ml-4 space-y-1">
            <li>• Group 1 (A, B, C): Can select multiple within group</li>
            <li>• Group 2 (D, E, F): Can select multiple within group</li>
            <li>• Groups are mutually exclusive (selecting Group 2 clears Group 1)</li>
            <li>• Option G: Global exclusive (clears all others)</li>
            <li>• Options H, I: No constraints (but cleared when selecting constrained options)</li>
          </ul>
        </div>

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

        <div className="text-secondary-foreground">Selected: {values.join(", ") || "None"}</div>
      </div>
    )
  },
}

/**
 * Control whether the menu closes when selecting options.
 *
 * Features:
 * - closeOnSelect=false: Menu stays open (default behavior)
 * - closeOnSelect=true: Menu closes after each selection
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
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-body-small-strong">closeOnSelect=false (Default)</h3>
            <p className="text-secondary-foreground">Menu stays open after selecting options</p>
          </div>

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

          <div className="text-secondary-foreground">Selected: {values1.join(", ") || "None"}</div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-strong">closeOnSelect=true</h3>
            <p className="text-secondary-foreground">Menu closes after each selection</p>
          </div>

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

          <div className="text-secondary-foreground">Selected: {values2.join(", ") || "None"}</div>
        </div>
      </div>
    )
  },
}

/**
 * Validation messages for constraints.
 *
 * Features:
 * - Shows validation messages when constraints are violated
 * - Customizable messages via i18n prop
 * - Auto-dismiss after 3 seconds
 * - showValidationMessage prop to control display
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
          <div>
            <h3 className="font-strong mb-2">With Custom Messages</h3>
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

          <div>
            <h3 className="font-strong mb-2">Default Messages</h3>
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

          <div>
            <h3 className="font-strong mb-2">Messages Disabled</h3>
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
          <h3 className="font-strong mb-2">Instructions</h3>
          <div className="text-secondary-foreground space-y-1">
            <p>• Try selecting more than the maximum allowed items</p>
            <p>• Try removing items below the minimum required</p>
            <p>• Notice how messages auto-dismiss after 3 seconds</p>
            <p>• Compare custom vs default messages</p>
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
 * MaxChips
 *
 */
export const MaxChips: Story = {
  render: function MaxChipsStory() {
    const [values, setValues] = useState<string[]>([])

    return (
      <div>
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
      </div>
    )
  },
}

/**
 * Variant
 */
export const Variant: Story = {
  render: function VariantStory() {
    const [values, setValues] = useState<string[]>([])
    const [variant, setVariant] = useState<ChipProps["variant"]>("default")

    return (
      <div className="space-y-4">
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
          variant={variant}
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
      </div>
    )
  },
}

/**
 * Custom chip rendering example.
 *
 * Features:
 * - Custom chip appearance with custom colors
 * - Custom delete button styling
 * - Maintains all standard functionality
 */
export const CustomChip: Story = {
  render: function CustomChipExample() {
    const [values, setValues] = useState<string[]>(["apple", "banana"])

    const handleChange = useCallback((newValues: string[]) => {
      setValues(newValues)
    }, [])

    const renderCustomChip = useCallback(
      ({
        value,
        index,
        displayValue,
        onRemove,
        disabled,
      }: {
        disabled?: boolean
        displayValue: string
        index: number
        onRemove?: (e: React.MouseEvent<HTMLButtonElement>) => void
        value: string
      }) => {
        const colors = [
          "bg-red-100 text-red-800 border-red-500",
          "bg-blue-100 text-blue-800 border-blue-500",
          "bg-green-100 text-green-800 border-green-500",
          "bg-yellow-100 text-yellow-800 border-yellow-500",
          "bg-purple-100 text-purple-800 border-purple-500",
          "bg-pink-100 text-pink-800 border-pink-500",
        ]

        const colorClass = colors[index % colors.length]

        return (
          <div
            className={tcx(
              "inline-flex h-4 items-center gap-1 rounded-md border pl-1",
              disabled ? "bg-disabled-background" : colorClass,
            )}
          >
            <span>🍎</span>
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
          onChange={handleChange}
          renderChip={renderCustomChip}
          placeholder="Select fruits with custom chips"
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

        <div className="text-body-small text-gray-600">Selected: {values.length} items</div>
      </div>
    )
  },
}

/**
 * MultiSelect component in readonly state.
 *
 * In readonly mode:
 * - The menu can be opened and closed normally
 * - Clicking on options will not change the current selection
 * - The menu will remain open after clicking an option
 * - Chip remove buttons are disabled and cannot remove chips
 * - Backspace key cannot remove chips
 * - Useful for displaying options without allowing changes
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
          readonly
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

        <div className="text-body-small text-stone-600">
          💡 Try clicking on different options - the selection should not change and the change count
          should remain at 0. The menu can still be opened and closed normally. Also try clicking the
          remove button on chips or pressing Backspace - chips should not be removable in readonly mode.
        </div>
      </div>
    )
  },
}
