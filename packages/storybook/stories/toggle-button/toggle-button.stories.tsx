import { Badge, Label, Select, ToggleButton, ToggleGroup } from "@choice-ui/react"
import {
  AlignBottom,
  AlignBottomSolid,
  AlignCenterHorizontal,
  AlignCenterHorizontalSolid,
  AlignCenterVertical,
  AlignCenterVerticalSolid,
  AlignLeft,
  AlignLeftSolid,
  AlignRight,
  AlignRightSolid,
  AlignTop,
  AlignTopSolid,
  FieldAdd,
  FieldTypeAttachment,
  FieldTypeCheckbox,
} from "@choiceform/icons-react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Fragment, useState } from "react"

const meta: Meta<typeof ToggleButton> = {
  title: "Buttons/ToggleButton",
  component: ToggleButton,
  tags: ["autodocs", "upgrade"],
}

export default meta

type Story = StoryObj<typeof ToggleButton>

/**
 * - The `aria-label` prop is required.
 * - This is a controlled component that requires `value` and `onChange` props to control its state.
 */
export const Basic: Story = {
  render: function ControlledStory() {
    const [controlled, setControlled] = useState(false)
    return (
      <ToggleButton
        aria-label="Toggle button"
        value={controlled}
        onChange={(value) => setControlled(value)}
      >
        {controlled ? <FieldTypeCheckbox /> : <FieldAdd />}
      </ToggleButton>
    )
  },
}

/**
 * The `variant` prop is used to set the variant of the toggle button.
 * - `default`: default variant
 * - `secondary`: secondary variant
 * - `highlight`: highlight variant
 */
export const Variants: Story = {
  render: function VariantsStory() {
    enum Variant {
      Default = "default",
      Highlight = "highlight",
      Secondary = "secondary",
    }

    enum Size {
      Default = "default",
      Large = "large",
    }

    enum State {
      Active = "active",
      Disabled = "disabled",
      Focused = "focused",
      Rest = "rest",
    }

    enum Event {
      Click = "click",
      Mousedown = "mousedown",
    }

    const [variant, setVariant] = useState<Variant>(Variant.Default)
    const [size, setSize] = useState<Size>(Size.Default)
    const [controlled, setControlled] = useState(false)
    const [event, setEvent] = useState<Event>(Event.Click)
    return (
      <div className="flex flex-col items-start gap-4">
        <div className="flex gap-4">
          <Select
            value={variant}
            onChange={(value) => setVariant(value as Variant)}
          >
            <Select.Trigger>
              {Object.keys(Variant).find((v) => Variant[v as keyof typeof Variant] === variant)}
            </Select.Trigger>
            <Select.Content>
              {Object.entries(Variant).map(([key, value]) => (
                <Select.Item
                  key={key}
                  value={value}
                >
                  {key}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
          <Select
            value={size}
            onChange={(value) => setSize(value as Size)}
          >
            <Select.Trigger>
              {Object.keys(Size).find((v) => Size[v as keyof typeof Size] === size)}
            </Select.Trigger>
            <Select.Content>
              {Object.entries(Size).map(([key, value]) => (
                <Select.Item
                  key={key}
                  value={value}
                >
                  {key}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
          <Select
            value={event}
            onChange={(value) => setEvent(value as Event)}
          >
            <Select.Trigger>
              {Object.keys(Event).find((v) => Event[v as keyof typeof Event] === event)}
            </Select.Trigger>
            <Select.Content>
              {Object.entries(Event).map(([key, value]) => (
                <Select.Item
                  key={key}
                  value={value}
                >
                  {key}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>

        <div className="grid grid-cols-[auto_1fr] items-center gap-4">
          {Object.values(State).map((state) => (
            <Fragment key={state}>
              <span className="capitalize text-fuchsia-500">{state}</span>
              <ToggleButton
                variant={variant}
                value={controlled}
                onChange={(value) => setControlled(value)}
                size={size}
                active={state === State.Active}
                focused={state === State.Focused}
                disabled={state === State.Disabled}
                event={event}
              >
                {controlled ? <FieldTypeCheckbox /> : <FieldTypeAttachment />}
              </ToggleButton>
            </Fragment>
          ))}
        </div>
      </div>
    )
  },
}

/**
 * The `tooltip` prop is used to show a tooltip when the toggle button is hovered.
 * - The `aria-label` will be used as the tooltip's content if the content type is string.
 */
export const Tooltip: Story = {
  render: function TooltipStory() {
    const [controlled, setControlled] = useState(false)
    return (
      <ToggleButton
        tooltip={{
          content: controlled ? "Current state is correct" : "Current state is wrong",
        }}
        value={controlled}
        onChange={(value) => setControlled(value)}
      >
        {controlled ? <FieldTypeCheckbox /> : <FieldAdd />}
      </ToggleButton>
    )
  },
}

/**
 * [TEST] ToggleButton component in readOnly state.
 *
 * In readOnly mode:
 * - The toggle button does not respond to click or change events
 * - The value cannot be changed
 * - Useful for displaying toggle state without allowing changes
 */
export const Readonly: Story = {
  render: function ReadonlyStory() {
    const [value, setValue] = useState(false)
    const [changeCount, setChangeCount] = useState(0)

    const handleChange = (newValue: boolean) => {
      setValue(newValue)
      setChangeCount((prev) => prev + 1)
    }

    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border bg-stone-50 p-4">
          <div className="text-body-small-strong mb-2 text-stone-700">Current Value:</div>
          <div className="text-body-small font-mono text-stone-600">{value ? "true" : "false"}</div>
          <div className="text-body-small-strong mt-2 text-stone-700">Change Count:</div>
          <div className="text-body-small font-mono text-stone-600">{changeCount}</div>
        </div>

        <div className="flex flex-wrap gap-4">
          <ToggleButton
            readOnly
            value={value}
            onChange={handleChange}
          >
            {value ? <FieldTypeCheckbox /> : <FieldAdd />}
          </ToggleButton>
          <ToggleButton
            readOnly
            value={!value}
            onChange={handleChange}
            variant="secondary"
          >
            {!value ? <FieldTypeCheckbox /> : <FieldAdd />}
          </ToggleButton>
          <ToggleButton
            value={value}
            onChange={handleChange}
          >
            {value ? <FieldTypeCheckbox /> : <FieldAdd />}
          </ToggleButton>
        </div>

        <div className="text-body-small text-stone-600">
          💡 Try clicking on the readonly toggle buttons - the value should not change and the
          change count should remain at 0. Only the normal button will change the value.
        </div>
      </div>
    )
  },
}

/**
 * Group: Demonstrates the ToggleGroup component for managing related toggle buttons.
 *
 * Features:
 * - Single selection mode (multiple=false): Only one button can be pressed at a time
 * - Multiple selection mode (multiple=true): Multiple buttons can be pressed simultaneously
 * - Automatic state management across the group
 * - Keyboard navigation with arrow keys
 * - Support for controlled and uncontrolled modes
 *
 * Usage Guidelines:
 * - Use ToggleGroup for related toggle buttons that share state
 * - Use single selection mode for mutually exclusive options
 * - Use multiple selection mode for independent options
 * - Provide aria-label for each ToggleGroup.Item
 */
export const Group: Story = {
  render: function GroupStory() {
    const [singleValue, setSingleValue] = useState<string[]>([])
    const [multipleValue, setMultipleValue] = useState<string[]>([])

    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <Label>Single Selection Mode (multiple=false)</Label>

          <ToggleGroup
            value={singleValue}
            onChange={setSingleValue}
            multiple={false}
          >
            <ToggleGroup.Item
              value="left"
              aria-label="Align left"
            >
              {singleValue.includes("left") ? <AlignLeftSolid /> : <AlignLeft />}
            </ToggleGroup.Item>
            <ToggleGroup.Item
              value="center"
              aria-label="Align center"
            >
              {singleValue.includes("center") ? (
                <AlignCenterHorizontalSolid />
              ) : (
                <AlignCenterHorizontal />
              )}
            </ToggleGroup.Item>
            <ToggleGroup.Item
              value="right"
              aria-label="Align right"
            >
              {singleValue.includes("right") ? <AlignRightSolid /> : <AlignRight />}
            </ToggleGroup.Item>
          </ToggleGroup>

          <div className="bg-secondary-background text-secondary-foreground flex flex-col gap-2 rounded-lg p-2">
            Only one button can be pressed at a time. Current value:
            <div className="flex flex-wrap gap-2">
              {singleValue.map((value) => (
                <Badge key={value}>{value}</Badge>
              ))}
              {singleValue.length === 0 && <Badge>none</Badge>}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Multiple Selection Mode (multiple=true)</Label>

          <ToggleGroup
            value={multipleValue}
            onChange={setMultipleValue}
            multiple={true}
          >
            <ToggleGroup.Item
              value="left"
              aria-label="Align left"
            >
              {multipleValue.includes("left") ? <AlignLeftSolid /> : <AlignLeft />}
            </ToggleGroup.Item>
            <ToggleGroup.Item
              value="center"
              aria-label="Align center"
            >
              {multipleValue.includes("center") ? (
                <AlignCenterHorizontalSolid />
              ) : (
                <AlignCenterHorizontal />
              )}
            </ToggleGroup.Item>
            <ToggleGroup.Item
              value="right"
              aria-label="Align right"
            >
              {multipleValue.includes("right") ? <AlignRightSolid /> : <AlignRight />}
            </ToggleGroup.Item>
          </ToggleGroup>

          <div className="bg-secondary-background text-secondary-foreground flex flex-col gap-2 rounded-lg p-2">
            Multiple buttons can be pressed simultaneously. Current values:
            <div className="flex flex-wrap gap-2">
              {multipleValue.map((value) => (
                <Badge key={value}>{value}</Badge>
              ))}
              {multipleValue.length === 0 && <Badge>none</Badge>}
            </div>
          </div>
        </div>
      </div>
    )
  },
}

/**
 * GroupOrientation: Demonstrates ToggleGroup with different orientations.
 *
 * Features:
 * - Horizontal orientation (default): Buttons arranged in a row
 * - Vertical orientation: Buttons arranged in a column
 * - Keyboard navigation adapts to orientation (arrow keys)
 */
export const GroupOrientation: Story = {
  render: function GroupOrientationStory() {
    const [horizontalValue, setHorizontalValue] = useState<string[]>([])
    const [verticalValue, setVerticalValue] = useState<string[]>([])

    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <Label>Horizontal Orientation (default)</Label>
          <ToggleGroup
            value={horizontalValue}
            onChange={setHorizontalValue}
          >
            <ToggleGroup.Item
              value="left"
              aria-label="Align left"
            >
              {horizontalValue.includes("left") ? <AlignLeftSolid /> : <AlignLeft />}
            </ToggleGroup.Item>
            <ToggleGroup.Item
              value="center"
              aria-label="Align center"
            >
              {horizontalValue.includes("center") ? (
                <AlignCenterHorizontalSolid />
              ) : (
                <AlignCenterHorizontal />
              )}
            </ToggleGroup.Item>
            <ToggleGroup.Item
              value="right"
              aria-label="Align right"
            >
              {horizontalValue.includes("right") ? <AlignRightSolid /> : <AlignRight />}
            </ToggleGroup.Item>
          </ToggleGroup>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Vertical Orientation</Label>
          <ToggleGroup
            value={verticalValue}
            onChange={setVerticalValue}
            orientation="vertical"
          >
            <ToggleGroup.Item
              value="top"
              aria-label="Align top"
            >
              {verticalValue.includes("top") ? <AlignTopSolid /> : <AlignTop />}
            </ToggleGroup.Item>
            <ToggleGroup.Item
              value="middle"
              aria-label="Align middle"
            >
              {verticalValue.includes("middle") ? (
                <AlignCenterVerticalSolid />
              ) : (
                <AlignCenterVertical />
              )}
            </ToggleGroup.Item>
            <ToggleGroup.Item
              value="bottom"
              aria-label="Align bottom"
            >
              {verticalValue.includes("bottom") ? <AlignBottomSolid /> : <AlignBottom />}
            </ToggleGroup.Item>
          </ToggleGroup>
        </div>
      </div>
    )
  },
}

/**
 * GroupControlled: Demonstrates controlled and uncontrolled ToggleGroup.
 *
 * Features:
 * - Controlled mode: Use `value` and `onChange` props
 * - Uncontrolled mode: Use `defaultValue` prop
 * - Both modes support the same features
 */
export const GroupControlled: Story = {
  render: function GroupControlledStory() {
    const [controlledValue, setControlledValue] = useState<string[]>(["1"])

    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <Label>Controlled Mode (value + onChange)</Label>

          <ToggleGroup
            value={controlledValue}
            onChange={setControlledValue}
          >
            <ToggleGroup.Item
              value="1"
              aria-label="Option 1"
            >
              1
            </ToggleGroup.Item>
            <ToggleGroup.Item
              value="2"
              aria-label="Option 2"
            >
              2
            </ToggleGroup.Item>
            <ToggleGroup.Item
              value="3"
              aria-label="Option 3"
            >
              3
            </ToggleGroup.Item>
          </ToggleGroup>

          <div className="bg-secondary-background text-secondary-foreground flex flex-col gap-2 rounded-lg p-2">
            Current value:
            <div className="flex flex-wrap gap-2">
              {controlledValue.map((value) => (
                <Badge key={value}>{value}</Badge>
              ))}
              {controlledValue.length === 0 && <Badge>none</Badge>}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Uncontrolled Mode (defaultValue)</Label>
          <ToggleGroup defaultValue={["option2"]}>
            <ToggleGroup.Item
              value="1"
              aria-label="Option 1"
            >
              1
            </ToggleGroup.Item>
            <ToggleGroup.Item
              value="2"
              aria-label="Option 2"
            >
              2
            </ToggleGroup.Item>
            <ToggleGroup.Item
              value="3"
              aria-label="Option 3"
            >
              3
            </ToggleGroup.Item>
          </ToggleGroup>
        </div>
      </div>
    )
  },
}

/**
 * GroupDisabled: Demonstrates ToggleGroup with disabled state.
 *
 * Features:
 * - Group-level disabled: All buttons in the group are disabled
 * - Individual disabled: Specific buttons can be disabled while others remain enabled
 */
export const GroupDisabled: Story = {
  render: function GroupDisabledStory() {
    const [groupDisabledValue, setGroupDisabledValue] = useState<string[]>([])
    const [individualDisabledValue, setIndividualDisabledValue] = useState<string[]>([])

    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <Label>Group-Level Disabled</Label>
          <ToggleGroup
            value={groupDisabledValue}
            onChange={setGroupDisabledValue}
            disabled
          >
            <ToggleGroup.Item
              value="1"
              aria-label="Option 1"
            >
              1
            </ToggleGroup.Item>
            <ToggleGroup.Item
              value="2"
              aria-label="Option 2"
            >
              2
            </ToggleGroup.Item>
            <ToggleGroup.Item
              value="3"
              aria-label="Option 3"
            >
              3
            </ToggleGroup.Item>
          </ToggleGroup>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Individual Disabled Items</Label>
          <ToggleGroup
            value={individualDisabledValue}
            onChange={setIndividualDisabledValue}
          >
            <ToggleGroup.Item
              value="1"
              aria-label="Option 1"
            >
              1
            </ToggleGroup.Item>
            <ToggleGroup.Item
              value="2"
              aria-label="Option 2"
              disabled
            >
              2
            </ToggleGroup.Item>
            <ToggleGroup.Item
              value="3"
              aria-label="Option 3"
            >
              3
            </ToggleGroup.Item>
          </ToggleGroup>
        </div>
      </div>
    )
  },
}

/**
 * [TEST] ToggleGroup component in readOnly state.
 *
 * In readOnly mode:
 * - Toggle buttons do not respond to click or keyboard events
 * - The selected values cannot be changed
 * - Useful for displaying toggle group state without allowing changes
 */
export const GroupReadonly: Story = {
  render: function GroupReadonlyStory() {
    const [value, setValue] = useState<string[]>(["option1"])
    const [changeCount, setChangeCount] = useState(0)

    const handleChange = (newValue: string[]) => {
      setValue(newValue)
      setChangeCount((prev) => prev + 1)
    }

    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border bg-stone-50 p-4">
          <div className="text-body-small-strong mb-2 text-stone-700">Current Value:</div>
          <div className="text-body-small font-mono text-stone-600">
            {value.length > 0 ? value.join(", ") : "none"}
          </div>
          <div className="text-body-small-strong mt-2 text-stone-700">Change Count:</div>
          <div className="text-body-small font-mono text-stone-600">{changeCount}</div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-body-small-strong">ReadOnly ToggleGroup</p>
            <ToggleGroup
              readOnly
              value={value}
              onChange={handleChange}
            >
              <ToggleGroup.Item
                value="option1"
                aria-label="Option 1"
              >
                <FieldTypeCheckbox />
              </ToggleGroup.Item>
              <ToggleGroup.Item
                value="option2"
                aria-label="Option 2"
              >
                <FieldAdd />
              </ToggleGroup.Item>
              <ToggleGroup.Item
                value="option3"
                aria-label="Option 3"
              >
                <FieldTypeAttachment />
              </ToggleGroup.Item>
            </ToggleGroup>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-body-small-strong">Normal ToggleGroup (for comparison)</p>
            <ToggleGroup
              value={value}
              onChange={handleChange}
            >
              <ToggleGroup.Item
                value="option1"
                aria-label="Option 1"
              >
                <FieldTypeCheckbox />
              </ToggleGroup.Item>
              <ToggleGroup.Item
                value="option2"
                aria-label="Option 2"
              >
                <FieldAdd />
              </ToggleGroup.Item>
              <ToggleGroup.Item
                value="option3"
                aria-label="Option 3"
              >
                <FieldTypeAttachment />
              </ToggleGroup.Item>
            </ToggleGroup>
          </div>
        </div>

        <div className="text-body-small text-stone-600">
          💡 Try clicking on the readonly toggle group - the value should not change and the change
          count should remain at 0. Only the normal toggle group will change the value.
        </div>
      </div>
    )
  },
}
