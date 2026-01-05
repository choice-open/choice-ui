import {
  Button,
  Checkbox,
  Dropdown,
  IconButton,
  IconButtonGroup,
  Input,
  NumericInput,
  Panel,
  Popover,
  ScrollArea,
  Segmented,
  Select,
  Splitter,
  Switch,
  tcx,
  useSortableRowItem,
} from "@choice-ui/react"
import {
  AddSmall,
  AlignBottom,
  AlignCenterHorizontal,
  AlignCenterVertical,
  AlignLeft,
  AlignRight,
  AlignTop,
  ColorTypeGradient,
  Delete,
  DeleteSmall,
  EffectDropShadow,
  Hidden,
  InfoCircle,
  MaxHeight,
  MaxWidth,
  Search,
  SetupPreferences,
  Styles,
  Target,
  VariablesBoolean,
  Visible,
  ZoomIn,
  ZoomOut,
} from "@choiceform/icons-react"
import { Observable } from "@legendapp/state"
import { observer, useObservable } from "@legendapp/state/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { nanoid } from "nanoid"
import React, { useEffect, useRef, useState } from "react"
import { useEventCallback } from "usehooks-ts"

const meta: Meta<typeof Panel> = {
  title: "Layouts/Panel",
  component: Panel,
  parameters: {
    docs: {
      description: {
        component: `
Panel is a container component for organizing form controls in a properties panel layout.

### Features
- **Grid-based Layouts**: Multiple row types with predefined grid areas for consistent alignment
- **Optional Labels**: Toggle label visibility with \`showLabels\` prop
- **Collapsible Sections**: Support for expandable/collapsible panel sections
- **Sortable Rows**: Drag-and-drop reordering with \`Panel.Sortable\`

### Row Types
- \`single\`: Single input spanning full width
- \`two-columns\`: Two equal-width columns
- \`one-input-one-icon\`: Input with one action icon
- \`one-input-two-icon\`: Input with two action icons
- \`two-input-one-icon\`: Two inputs with one shared icon
- \`two-input-two-icon\`: Two inputs with two icons
- \`one-icon-one-input-two-icon\`: Prefix icon, input, and two suffix icons
- \`two-input-one-icon-double-row\`: Double-height row with complex layout
- \`one-label-one-input\`: Inline label with input
- \`one-icon-one-input\`: Prefix icon with input

### Grid Areas
Use \`[grid-area:xxx]\` classes to position elements:
- \`label\`, \`label-1\`, \`label-2\`: Label positions
- \`input\`, \`input-1\`, \`input-2\`, \`input-3\`: Input positions
- \`icon\`, \`icon-1\`, \`icon-2\`, \`icon-3\`: Icon button positions
`,
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof Panel>

const AllotmentContainer = ({
  children,
  header,
}: {
  children: React.ReactNode
  header?: React.ReactNode
}) => {
  return (
    <div style={{ height: "320px", maxWidth: "100%" }}>
      <Splitter
        defaultSizes={[800, 240]}
        className="!absolute inset-0"
      >
        <Splitter.Pane minSize={320}>
          <div className="bg-secondary-background flex h-screen min-h-0 w-full flex-1 flex-col"></div>
        </Splitter.Pane>

        <Splitter.Pane minSize={240}>
          <ScrollArea className="h-full overflow-hidden">
            <ScrollArea.Viewport className="bg-default-background h-full pb-16">
              <ScrollArea.Content className="w-full">
                <div className="text-body-medium text-secondary-foreground border-b p-4">
                  {header}
                </div>

                {children}
              </ScrollArea.Content>
            </ScrollArea.Viewport>
          </ScrollArea>
        </Splitter.Pane>
      </Splitter>
    </div>
  )
}

const SelectComponent = ({ className }: { className?: string }) => {
  const selectOptions = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
  ]
  const [selectValue, setSelectValue] = useState(selectOptions[0])
  return (
    <Select
      matchTriggerWidth
      value={selectValue.value}
      onChange={(value) =>
        setSelectValue(selectOptions.find((option) => option.value === value) ?? selectOptions[0])
      }
    >
      <Select.Trigger className={tcx("[grid-area:input]", className)}>
        <span className="flex-1 truncate">{selectValue.label}</span>
      </Select.Trigger>
      <Select.Content>
        {selectOptions.map((option) => (
          <Select.Item
            key={option.value}
            value={option.value}
          >
            {option.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  )
}

const InputComponent = ({ className }: { className?: string }) => {
  const [inputValue, setInputValue] = useState("")
  return (
    <Input
      className={tcx("[grid-area:input]", className)}
      value={inputValue}
      onChange={(value) => setInputValue(value)}
      placeholder="Input"
    />
  )
}

const SegmentedComponent = ({ className }: { className?: string }) => {
  const [segmentedValue, setSegmentedValue] = useState("zoomOut")
  return (
    <Segmented
      className={tcx("[grid-area:input]", className)}
      value={segmentedValue}
      onChange={(value) => setSegmentedValue(value)}
    >
      <Segmented.Item value="zoomOut">
        <ZoomOut />
      </Segmented.Item>
      <Segmented.Item value="100%">
        <Search />
      </Segmented.Item>
      <Segmented.Item value="zoomIn">
        <ZoomIn />
      </Segmented.Item>
    </Segmented>
  )
}

const CheckboxComponent = ({ className }: { className?: string }) => {
  const [checkboxValue, setCheckboxValue] = useState(false)
  return (
    <Checkbox
      className={tcx("[grid-area:input]", className)}
      value={checkboxValue}
      onChange={(value) => setCheckboxValue(value)}
    >
      <Checkbox.Label>Checkbox</Checkbox.Label>
    </Checkbox>
  )
}

const DropdownComponent = ({ className }: { className?: string }) => {
  const dropdownOptions = [
    { label: "Zoom Out", value: "zoomOut", icon: <ZoomOut /> },
    { label: "100%", value: "100%", icon: <Search /> },
    { label: "Zoom In", value: "zoomIn", icon: <ZoomIn /> },
  ]

  const [dropdownValue, setDropdownValue] = useState(dropdownOptions[0])

  return (
    <Dropdown>
      <Dropdown.Trigger
        className={tcx("[grid-area:input]", className)}
        prefixElement={<ZoomOut />}
      >
        <span className="flex-1 truncate">{dropdownValue.label}</span>
      </Dropdown.Trigger>
      <Dropdown.Content>
        {dropdownOptions.map((option) => (
          <Dropdown.Item
            key={option.value}
            onMouseUp={() => setDropdownValue(option)}
          >
            {option.icon}
            <span>{option.label}</span>
          </Dropdown.Item>
        ))}
      </Dropdown.Content>
    </Dropdown>
  )
}

const NumericInputComponent = ({
  className,
  prefix,
  suffix,
}: {
  className?: string
  prefix?: React.ReactNode
  suffix?: React.ReactNode
}) => {
  const [numericInputValue, setNumericInputValue] = useState(100)
  return (
    <NumericInput
      className={tcx("[grid-area:input]", className)}
      value={numericInputValue}
      onChange={(value) => setNumericInputValue(Number(value))}
    >
      {prefix && <NumericInput.Prefix>{prefix}</NumericInput.Prefix>}
      {suffix && <NumericInput.Suffix>{suffix}</NumericInput.Suffix>}
    </NumericInput>
  )
}

/**
 * Single row layout with full-width input.
 *
 * The `single` type provides a simple one-column layout where the input spans the full width.
 * Use `Panel.Label` for optional labels that appear above the input when `showLabels` is enabled.
 *
 * ### Grid Areas
 * - `[grid-area:label]`: Label position (shown when `showLabels={true}`)
 * - `[grid-area:input]`: Input position (full width)
 *
 * ### Features
 * - Toggle label visibility with `showLabels` prop on Panel
 * - Supports Select, Input, Segmented, Checkbox, and other form controls
 */
export const Basic: Story = {
  render: function BasicStory() {
    const [showLabels, setShowLabels] = useState(false)

    return (
      <AllotmentContainer
        header={
          <Switch
            size="small"
            label="Show labels"
            value={showLabels}
            onChange={(value) => setShowLabels(value)}
          />
        }
      >
        <Panel showLabels={showLabels}>
          <Panel.Title title="Single">
            <IconButton tooltip={{ content: "Styles" }}>
              <Styles />
            </IconButton>
          </Panel.Title>

          <Panel.Row type="single">
            <Panel.Label>Select</Panel.Label>
            <SelectComponent />
          </Panel.Row>
          <Panel.Row type="single">
            <Panel.Label>Input</Panel.Label>
            <InputComponent />
          </Panel.Row>
          <Panel.Row type="single">
            <Panel.Label>Segmented Control</Panel.Label>
            <SegmentedComponent />
          </Panel.Row>
          <Panel.Row type="single">
            <CheckboxComponent />
          </Panel.Row>
        </Panel>
      </AllotmentContainer>
    )
  },
}

/**
 * Two-column layout with equal-width inputs side by side.
 *
 * The `two-columns` type splits the row into two equal columns, ideal for related inputs
 * like width/height, X/Y coordinates, or any paired values.
 *
 * ### Grid Areas
 * - `[grid-area:label-1]`: Left label position
 * - `[grid-area:label-2]`: Right label position
 * - `[grid-area:input-1]`: Left input position
 * - `[grid-area:input-2]`: Right input position
 *
 * ### Features
 * - Equal-width columns for balanced layouts
 * - Independent labels for each column
 * - Supports IconButtonGroup, Select, Input, and other controls
 */
export const TwoColumns: Story = {
  render: function TwoColumnsStory() {
    const [showLabels, setShowLabels] = useState(false)
    const [segmentedControlValue, setSegmentedControlValue] = useState("zoomOut")
    return (
      <AllotmentContainer
        header={
          <Switch
            size="small"
            label="Show labels"
            value={showLabels}
            onChange={(value) => setShowLabels(value)}
          />
        }
      >
        <Panel showLabels={showLabels}>
          <Panel.Title title="Two Columns">
            <IconButton tooltip={{ content: "Styles" }}>
              <Styles />
            </IconButton>
          </Panel.Title>
          <Panel.Row type="two-columns">
            <Panel.Label className="[grid-area:label-1]">Dropdown</Panel.Label>
            <Panel.Label className="[grid-area:label-2]">Segmented Control</Panel.Label>
            <DropdownComponent className="[grid-area:input-1]" />
            <SegmentedComponent className="[grid-area:input-2]" />
          </Panel.Row>

          <Panel.Row type="two-columns">
            <Panel.Label className="[grid-area:label-1]">Group 1</Panel.Label>
            <Panel.Label className="[grid-area:label-2]">Group 2</Panel.Label>
            <IconButtonGroup className="[grid-area:input-1]">
              <IconButton tooltip={{ content: "Align Left" }}>
                <AlignLeft />
              </IconButton>
              <IconButton tooltip={{ content: "Align Center" }}>
                <AlignCenterHorizontal />
              </IconButton>
              <IconButton tooltip={{ content: "Align Right" }}>
                <AlignRight />
              </IconButton>
            </IconButtonGroup>
            <IconButtonGroup className="[grid-area:input-2]">
              <IconButton tooltip={{ content: "Align Top" }}>
                <AlignTop />
              </IconButton>
              <IconButton tooltip={{ content: "Align Center" }}>
                <AlignCenterVertical />
              </IconButton>
              <IconButton tooltip={{ content: "Align Bottom" }}>
                <AlignBottom />
              </IconButton>
            </IconButtonGroup>
          </Panel.Row>

          <Panel.Row type="two-columns">
            <Panel.Label className="[grid-area:label-1]">Select</Panel.Label>
            <Panel.Label className="[grid-area:label-2]">Input</Panel.Label>
            <SelectComponent className="[grid-area:input-1]" />
            <InputComponent className="[grid-area:input-2]" />
          </Panel.Row>
        </Panel>
      </AllotmentContainer>
    )
  },
}

/**
 * Input with a single action icon on the right.
 *
 * The `one-input-one-icon` type provides an input field with one icon button,
 * commonly used for visibility toggles, delete actions, or other single actions.
 *
 * ### Grid Areas
 * - `[grid-area:label]`: Label position
 * - `[grid-area:input]`: Input position (flexible width)
 * - `[grid-area:icon]`: Icon button position (fixed width)
 *
 * ### Use Cases
 * - Visibility toggle for layer properties
 * - Delete action for list items
 * - Settings or configuration access
 */
export const OneInputOneIcon: Story = {
  render: function OneInputOneIconStory() {
    const [showLabels, setShowLabels] = useState(false)

    return (
      <AllotmentContainer
        header={
          <Switch
            size="small"
            label="Show labels"
            value={showLabels}
            onChange={(value) => setShowLabels(value)}
          />
        }
      >
        <Panel showLabels={showLabels}>
          <Panel.Title title="One Input One Icon">
            <IconButton tooltip={{ content: "Styles" }}>
              <Styles />
            </IconButton>
          </Panel.Title>

          <Panel.Row type="one-input-one-icon">
            <Panel.Label>Input</Panel.Label>
            <InputComponent />
            <IconButton
              className="[grid-area:icon]"
              tooltip={{ content: "Visible" }}
            >
              <Visible />
            </IconButton>
          </Panel.Row>

          <Panel.Row type="one-input-one-icon">
            <Panel.Label>Color</Panel.Label>
            <InputComponent />
            <IconButton
              className="[grid-area:icon]"
              tooltip={{ content: "Visible" }}
            >
              <Visible />
            </IconButton>
          </Panel.Row>
          <Panel.Row type="one-input-one-icon">
            <Button
              className="[grid-area:input]"
              variant="secondary"
            >
              Button
            </Button>
          </Panel.Row>
        </Panel>
      </AllotmentContainer>
    )
  },
}

/**
 * Input with two action icons on the right.
 *
 * The `one-input-two-icon` type provides an input field with two icon buttons,
 * commonly used when multiple actions are needed per row (e.g., visibility + delete).
 *
 * ### Grid Areas
 * - `[grid-area:label]`: Label position
 * - `[grid-area:input]`: Input position (flexible width)
 * - `[grid-area:icon-1]`: First icon button position
 * - `[grid-area:icon-2]`: Second icon button position
 *
 * ### Use Cases
 * - List items with visibility toggle and delete button
 * - Properties with show/hide and reset actions
 */
export const OneInputTwoIcon: Story = {
  render: function OneInputTwoIconStory() {
    const [showLabels, setShowLabels] = useState(false)

    return (
      <AllotmentContainer
        header={
          <Switch
            size="small"
            label="Show labels"
            value={showLabels}
            onChange={(value) => setShowLabels(value)}
          />
        }
      >
        <Panel showLabels={showLabels}>
          <Panel.Title title="One Input Two Icon">
            <IconButton tooltip={{ content: "Styles" }}>
              <Styles />
            </IconButton>
          </Panel.Title>

          <Panel.Row type="one-input-two-icon">
            <Panel.Label>Input</Panel.Label>
            <InputComponent />
            <IconButton
              className="[grid-area:icon-1]"
              tooltip={{ content: "Visible" }}
            >
              <Visible />
            </IconButton>
            <IconButton
              className="[grid-area:icon-2]"
              tooltip={{ content: "Delete" }}
            >
              <Delete />
            </IconButton>
          </Panel.Row>

          <Panel.Row type="one-input-two-icon">
            <Panel.Label>Color Input</Panel.Label>
            <InputComponent />
            <IconButton
              className="[grid-area:icon-1]"
              tooltip={{ content: "Visible" }}
            >
              <Visible />
            </IconButton>
            <IconButton
              className="[grid-area:icon-2]"
              tooltip={{ content: "Delete" }}
            >
              <Delete />
            </IconButton>
          </Panel.Row>
        </Panel>
      </AllotmentContainer>
    )
  },
}

/**
 * Two inputs with a shared action icon.
 *
 * The `two-input-one-icon` type provides two input fields with one shared icon button,
 * ideal for paired values like dimensions (width/height) with a shared action.
 *
 * ### Grid Areas
 * - `[grid-area:label-1]`: First label position
 * - `[grid-area:label-2]`: Second label position
 * - `[grid-area:input-1]`: First input position
 * - `[grid-area:input-2]`: Second input position
 * - `[grid-area:icon]`: Shared icon button position
 *
 * ### Use Cases
 * - Dimension inputs (width × height) with lock/unlock ratio
 * - Coordinate inputs (X, Y) with reset action
 * - Paired numeric inputs with constraint toggle
 */
export const TwoInputOneIcon: Story = {
  render: function TwoInputOneIconStory() {
    const [showLabels, setShowLabels] = useState(false)

    return (
      <AllotmentContainer
        header={
          <Switch
            size="small"
            label="Show labels"
            value={showLabels}
            onChange={(value) => setShowLabels(value)}
          />
        }
      >
        <Panel showLabels={showLabels}>
          <Panel.Title title="Two Input One Icon">
            <IconButton tooltip={{ content: "Styles" }}>
              <Styles />
            </IconButton>
          </Panel.Title>

          <Panel.Row type="two-input-one-icon">
            <Panel.Label className="[grid-area:label-1]">Input 1</Panel.Label>
            <Panel.Label className="[grid-area:label-2]">Input 2</Panel.Label>
            <InputComponent className="[grid-area:input-1]" />
            <InputComponent className="[grid-area:input-2]" />
            <IconButton
              className="[grid-area:icon]"
              tooltip={{ content: "Visible" }}
            >
              <Visible />
            </IconButton>
          </Panel.Row>

          <Panel.Row type="two-input-one-icon">
            <Panel.Label className="[grid-area:label-1]">Number Input 1</Panel.Label>
            <Panel.Label className="[grid-area:label-2]">Number Input 2</Panel.Label>
            <NumericInputComponent
              className="[grid-area:input-1]"
              prefix={<MaxWidth />}
            />
            <NumericInputComponent
              className="[grid-area:input-2]"
              prefix={<MaxHeight />}
            />
          </Panel.Row>
        </Panel>
      </AllotmentContainer>
    )
  },
}

/**
 * Two inputs with two action icons.
 *
 * The `two-input-two-icon` type provides two input fields with two icon buttons,
 * offering maximum flexibility for paired inputs with independent actions.
 *
 * ### Grid Areas
 * - `[grid-area:label-1]`: First label position
 * - `[grid-area:label-2]`: Second label position
 * - `[grid-area:input-1]`: First input position
 * - `[grid-area:input-2]`: Second input position
 * - `[grid-area:icon-1]`: First icon button position
 * - `[grid-area:icon-2]`: Second icon button position
 *
 * ### Use Cases
 * - Paired inputs with visibility and delete actions
 * - Dimension controls with constraint lock and reset buttons
 */
export const TwoInputTwoIcon: Story = {
  render: function TwoInputTwoIconStory() {
    const [showLabels, setShowLabels] = useState(false)

    return (
      <AllotmentContainer
        header={
          <Switch
            size="small"
            label="Show labels"
            value={showLabels}
            onChange={(value) => setShowLabels(value)}
          />
        }
      >
        <Panel showLabels={showLabels}>
          <Panel.Title title="Two Input Two Icon">
            <IconButton tooltip={{ content: "Styles" }}>
              <Styles />
            </IconButton>
          </Panel.Title>

          <Panel.Row type="two-input-two-icon">
            <Panel.Label className="[grid-area:label-1]">Input 1</Panel.Label>
            <Panel.Label className="[grid-area:label-2]">Input 2</Panel.Label>
            <InputComponent className="[grid-area:input-1]" />
            <InputComponent className="[grid-area:input-2]" />
            <IconButton
              className="[grid-area:icon-1]"
              tooltip={{ content: "Visible" }}
            >
              <Visible />
            </IconButton>
            <IconButton
              className="[grid-area:icon-2]"
              tooltip={{ content: "Delete" }}
            >
              <Delete />
            </IconButton>
          </Panel.Row>

          <Panel.Row type="two-input-two-icon">
            <Panel.Label className="[grid-area:label-1]">Number Input 1</Panel.Label>
            <Panel.Label className="[grid-area:label-2]">Number Input 2</Panel.Label>
            <NumericInputComponent
              className="[grid-area:input-1]"
              prefix={<MaxWidth />}
            />
            <NumericInputComponent
              className="[grid-area:input-2]"
              prefix={<MaxHeight />}
            />
            <IconButton
              className="[grid-area:icon-1]"
              tooltip={{ content: "Visible" }}
            >
              <Visible />
            </IconButton>
            <IconButton
              className="[grid-area:icon-2]"
              tooltip={{ content: "Delete" }}
            >
              <Delete />
            </IconButton>
          </Panel.Row>
        </Panel>
      </AllotmentContainer>
    )
  },
}

/**
 * Prefix icon, input, and two suffix icons.
 *
 * The `one-icon-one-input-two-icon` type provides a complex layout with a leading icon,
 * an input field, and two trailing icons. Ideal for effect/style rows in design tools.
 *
 * ### Grid Areas
 * - `[grid-area:label]`: Label position
 * - `[grid-area:icon-1]`: Prefix icon position (e.g., effect type indicator)
 * - `[grid-area:input]`: Input position (flexible width)
 * - `[grid-area:icon-2]`: First suffix icon (e.g., visibility toggle)
 * - `[grid-area:icon-3]`: Second suffix icon (e.g., delete action)
 *
 * ### Use Cases
 * - Effect rows (shadow, blur) with type icon, value selector, visibility, and delete
 * - Style properties with color preview, name input, and actions
 * - Used in `Panel.SortableRow` for drag-and-drop reorderable lists
 */
export const OneIconOneInputTwoIcon: Story = {
  render: function OneIconOneInputTwoIconStory() {
    const [showLabels, setShowLabels] = useState(false)

    return (
      <AllotmentContainer
        header={
          <Switch
            size="small"
            label="Show labels"
            value={showLabels}
            onChange={(value) => setShowLabels(value)}
          />
        }
      >
        <Panel showLabels={showLabels}>
          <Panel.Title title="One Icon One Input Two Icon">
            <IconButton tooltip={{ content: "Styles" }}>
              <Styles />
            </IconButton>
          </Panel.Title>

          <Panel.Row type="one-icon-one-input-two-icon">
            <Panel.Label>Effect Drop Shadow</Panel.Label>
            <IconButton
              className="[grid-area:icon-1]"
              tooltip={{ content: "Effect drop shadow-sm" }}
            >
              <EffectDropShadow />
            </IconButton>
            <SelectComponent />
            <IconButton
              className="[grid-area:icon-2]"
              tooltip={{ content: "Visible" }}
            >
              <Visible />
            </IconButton>
            <IconButton
              className="[grid-area:icon-3]"
              tooltip={{ content: "Delete" }}
            >
              <Delete />
            </IconButton>
          </Panel.Row>
        </Panel>
      </AllotmentContainer>
    )
  },
}

/**
 * Double-height row with complex multi-input layout.
 *
 * The `two-input-one-icon-double-row` type provides a taller row that spans two standard row heights,
 * allowing for more complex layouts with multiple inputs and a preview/content area.
 *
 * ### Grid Areas
 * - `[grid-area:label-1]`: First label position
 * - `[grid-area:label-2]`: Second label position
 * - `[grid-area:input-1]`: First input position (top row)
 * - `[grid-area:input-2]`: Second input position (top row)
 * - `[grid-area:input-3]`: Extended content area (spans bottom row)
 * - `[grid-area:icon-1]`: Icon button position
 *
 * ### Use Cases
 * - Gradient editor with type selector, stops input, and preview
 * - Complex property editors with configuration and preview
 * - Multi-value inputs with visual preview area
 */
export const TwoInputOneIconDoubleRow: Story = {
  render: function TwoInputOneIconDoubleRowStory() {
    const [showLabels, setShowLabels] = useState(false)

    return (
      <AllotmentContainer
        header={
          <Switch
            size="small"
            label="Show labels"
            value={showLabels}
            onChange={(value) => setShowLabels(value)}
          />
        }
      >
        <Panel showLabels={showLabels}>
          <Panel.Title title="Two Input One Icon Double Row">
            <IconButton tooltip={{ content: "Styles" }}>
              <Styles />
            </IconButton>
          </Panel.Title>

          <Panel.Row type="two-input-one-icon-double-row">
            <Panel.Label className="[grid-area:label-1]">Select</Panel.Label>
            <Panel.Label className="[grid-area:label-2]">Double Row</Panel.Label>
            <SelectComponent className="[grid-area:input-1]" />
            <NumericInputComponent
              className="[grid-area:input-2]"
              prefix={<MaxWidth />}
            />
            <div className="flex h-full flex-col [grid-area:input-3]">
              <div className="bg-secondary-background my-1 flex-1 rounded-md" />
            </div>
            <IconButton
              className="[grid-area:icon-1]"
              tooltip={{ content: "Setup preferences" }}
            >
              <SetupPreferences />
            </IconButton>
          </Panel.Row>
        </Panel>
      </AllotmentContainer>
    )
  },
}

/**
 * Inline label with input on the same row.
 *
 * The `one-label-one-input` type displays a label and input side by side,
 * with the label always visible (unlike other types where labels are toggled).
 *
 * ### Grid Areas
 * - `[grid-area:label]`: Label position (fixed width on left)
 * - `[grid-area:input]`: Input position (flexible width)
 *
 * ### Use Cases
 * - Key-value property displays
 * - Settings with always-visible labels
 * - Form fields where label context is essential
 */
export const OneLabelOneInput: Story = {
  render: function OneLabelOneInputStory() {
    return (
      <AllotmentContainer header={<>One Label One Input</>}>
        <Panel>
          <Panel.Title title="One Label One Input">
            <IconButton tooltip={{ content: "Styles" }}>
              <Styles />
            </IconButton>
          </Panel.Title>

          <Panel.Row type="one-label-one-input">
            <div className="text-secondary-foreground cursor-default [grid-area:label]">
              Label 1
            </div>
            <SelectComponent />
          </Panel.Row>
          <Panel.Row type="one-label-one-input">
            <div className="text-secondary-foreground cursor-default [grid-area:label]">
              Label 2
            </div>
            <SelectComponent />
          </Panel.Row>
        </Panel>
      </AllotmentContainer>
    )
  },
}

/**
 * Prefix icon with input field.
 *
 * The `one-icon-one-input` type provides an icon on the left followed by an input,
 * useful for categorized inputs or inputs with visual type indicators.
 *
 * ### Grid Areas
 * - `[grid-area:label]`: Label position (shown when `showLabels={true}`)
 * - `[grid-area:icon]`: Prefix icon position (left side)
 * - `[grid-area:input]`: Input position (flexible width)
 *
 * ### Use Cases
 * - Inputs with category/type indicator icons
 * - Search fields with search icon prefix
 * - Labeled inputs with visual context
 */
export const OneIconOneInput: Story = {
  render: function OneIconOneInputStory() {
    const [showLabels, setShowLabels] = useState(false)

    return (
      <AllotmentContainer
        header={
          <Switch
            size="small"
            label="Show labels"
            value={showLabels}
            onChange={(value) => setShowLabels(value)}
          />
        }
      >
        <Panel showLabels={showLabels}>
          <Panel.Title title="One Icon One Input">
            <IconButton tooltip={{ content: "Styles" }}>
              <Styles />
            </IconButton>
          </Panel.Title>

          <Panel.Row type="one-icon-one-input">
            <Panel.Label>Input</Panel.Label>
            <Input
              className="[grid-area:input]"
              placeholder="Input"
            />
            <IconButton
              className="[grid-area:icon]"
              tooltip={{ content: "Visible" }}
            >
              <Visible />
            </IconButton>
          </Panel.Row>
        </Panel>
      </AllotmentContainer>
    )
  },
}

/**
 * Row with multiple icon buttons that auto-hide when not hovered.
 *
 * `Panel.RowManyIcon` displays icon buttons that appear on hover, keeping the UI clean.
 * Icons can be marked as `alwaysShow` to remain visible regardless of hover state.
 *
 * ### Props
 * - `icons`: Array of icon configurations with `id`, `element`, and optional `alwaysShow`
 * - `isEditing`: When true, shows all icons and expands the row for editing
 * - `children`: Main content (typically an editable field)
 *
 * ### Features
 * - Icons auto-hide when row is not hovered
 * - `alwaysShow: true` keeps specific icons visible (e.g., info indicators)
 * - Supports inline editing with focus management
 *
 * ### Use Cases
 * - Variable/token rows with action icons
 * - List items with contextual actions
 * - Editable labels with status indicators
 */
export const ManyIcon: Story = {
  render: function ManyIconStory() {
    const [manyIconIsEditing, setManyIconIsEditing] = useState({
      a: false,
      b: false,
    })

    return (
      <AllotmentContainer header={<>Many Icon</>}>
        <Panel>
          <Panel.Title title="Panel row many icon">
            <IconButton tooltip={{ content: "Styles" }}>
              <Styles />
            </IconButton>
          </Panel.Title>

          <Panel.RowManyIcon
            isEditing={manyIconIsEditing.a}
            icons={[
              {
                id: "variable",
                element: (
                  <IconButton tooltip={{ content: "Variable" }}>
                    <Visible />
                  </IconButton>
                ),
              },
              {
                id: "variable-boolean",
                element: (
                  <IconButton tooltip={{ content: "Variables Boolean" }}>
                    <VariablesBoolean />
                  </IconButton>
                ),
              },
            ]}
          >
            <div
              className="bg-secondary-background focus-within:border-selected-boundary focus-within:bg-default-background flex h-6 min-w-0 flex-1 cursor-default items-center gap-1 rounded-md border border-transparent px-2"
              onClick={() => setManyIconIsEditing({ ...manyIconIsEditing, a: true })}
            >
              <ColorTypeGradient />

              {manyIconIsEditing.a ? (
                <Input
                  className="flex-1 pl-0"
                  variant="reset"
                  autoFocus
                  value="Panel row many icon"
                  onBlur={() => setManyIconIsEditing({ ...manyIconIsEditing, a: false })}
                />
              ) : (
                <span className="min-w-0 flex-1 truncate">Panel row many icon</span>
              )}
            </div>
          </Panel.RowManyIcon>

          <Panel.RowManyIcon
            isEditing={manyIconIsEditing.b}
            icons={[
              {
                id: "variable",
                element: (
                  <IconButton tooltip={{ content: "Variable" }}>
                    <Visible />
                  </IconButton>
                ),
              },
              {
                id: "variable-boolean",
                element: (
                  <IconButton tooltip={{ content: "Variables Boolean" }}>
                    <VariablesBoolean />
                  </IconButton>
                ),
              },
              {
                id: "variable-info",
                element: (
                  <div className="flex h-6 w-6 items-center justify-center">
                    <InfoCircle />
                  </div>
                ),
                alwaysShow: true,
              },
            ]}
          >
            <div
              className="bg-secondary-background focus-within:border-selected-boundary focus-within:bg-default-background flex h-6 min-w-0 flex-1 cursor-default items-center gap-1 rounded-md border border-transparent px-2"
              onClick={() => setManyIconIsEditing({ ...manyIconIsEditing, b: true })}
            >
              <ColorTypeGradient />
              {manyIconIsEditing.b ? (
                <Input
                  className="flex-1 pl-0"
                  variant="reset"
                  autoFocus
                  value="Panel row many icon"
                  onBlur={() => setManyIconIsEditing({ ...manyIconIsEditing, b: false })}
                />
              ) : (
                <span className="min-w-0 flex-1 truncate">Panel row many icon</span>
              )}
            </div>
          </Panel.RowManyIcon>
        </Panel>
      </AllotmentContainer>
    )
  },
}

/**
 * Panel header with title and optional actions.
 *
 * `Panel.Title` provides a consistent header for panel sections with support
 * for action buttons, dropdowns, and collapsible behavior.
 *
 * ### Props
 * - `title`: Header text
 * - `children`: Action elements (IconButton, Dropdown, etc.)
 * - `onClick`: Click handler for title interaction
 * - `classNames`: Style overrides for `container`, `titleWrapper`, `title`, `actionWrapper`
 *
 * ### Features
 * - Collapsible panels with `collapsible={true}` on parent Panel
 * - Multiple action buttons with automatic spacing
 * - Dropdown menus for additional options
 * - Interactive title with hover/active states
 *
 * ### Variants Shown
 * - Basic title only
 * - Title with single action icon
 * - Title with multiple action icons
 * - Collapsible panel with expand/collapse
 * - Title with dropdown menu
 */
export const PanelTitle: Story = {
  render: function PanelTitleStory() {
    const [collapsible, setCollapsible] = useState(false)
    const [open, setOpen] = useState(false)

    return (
      <AllotmentContainer header="Panel title">
        {/* Basic panel title */}
        <Panel>
          <Panel.Title title="Panel title" />
        </Panel>

        {/* Panel title with icon button */}
        <Panel>
          <Panel.Title title="Panel title with icon button">
            <IconButton tooltip={{ content: "Action" }}>
              <Styles />
            </IconButton>
          </Panel.Title>
        </Panel>

        {/* Panel title with multiple icon buttons */}
        <Panel>
          <Panel.Title title="Panel title with multiple icon buttons">
            <IconButton tooltip={{ content: "Action 1" }}>
              <Target />
            </IconButton>
            <IconButton tooltip={{ content: "Action 2" }}>
              <Styles />
            </IconButton>
          </Panel.Title>
        </Panel>

        {/* Panel title with collapsible */}
        <Panel
          collapsible={true}
          isCollapsed={collapsible}
          onCollapsedChange={setCollapsible}
        >
          <Panel.Title title="Panel title with collapsible">
            <IconButton tooltip={{ content: "Action" }}>
              <Styles />
            </IconButton>
          </Panel.Title>
          <div className="px-4">
            <div className="bg-secondary-background grid place-items-center rounded-md py-4 text-center">
              <Button
                variant="secondary"
                onClick={() => setCollapsible(true)}
              >
                Close
              </Button>
            </div>
          </div>
        </Panel>

        {/* Panel title with action */}
        <Panel>
          <Panel.Title
            title="Panel title with action"
            classNames={{
              title: tcx(
                open
                  ? "text-default-foreground"
                  : "text-secondary-foreground hover:text-default-foreground",
              ),
            }}
            onClick={() => setOpen(!open)}
          >
            <Dropdown
              open={open}
              onOpenChange={setOpen}
              placement="bottom-end"
            >
              <Dropdown.Trigger asChild>
                <IconButton
                  variant="highlight"
                  active={open}
                  tooltip={{ content: "Action" }}
                >
                  <Styles />
                </IconButton>
              </Dropdown.Trigger>
              <Dropdown.Content>
                <Dropdown.Item>Action 1</Dropdown.Item>
                <Dropdown.Item>Action 2</Dropdown.Item>
              </Dropdown.Content>
            </Dropdown>
          </Panel.Title>
        </Panel>
      </AllotmentContainer>
    )
  },
}

// Sortable item data type
interface SortableItem {
  id: string
  indexKey: string
  value: string
  visible: boolean
}

// Helper function to move array elements
function moveItem<T>(array: T[], fromIndex: number, toIndex: number): T[] {
  const result = [...array]
  const [removed] = result.splice(fromIndex, 1)
  result.splice(toIndex, 0, removed)
  return result
}

// Helper function to calculate target index
function calculateTargetIndex(
  dragIndex: number,
  dropIndex: number,
  position: "top" | "bottom" | null,
): number {
  // position === "top" means place above the target item
  // position === "bottom" means place below the target item

  if (dragIndex < dropIndex) {
    // Dragging downward
    return position === "top" ? dropIndex - 1 : dropIndex
  } else {
    // Dragging upward
    return position === "top" ? dropIndex : dropIndex + 1
  }
}

interface SortablePopoverProps {
  open$: Observable<string | null>
  triggerRefs: React.RefObject<Map<string, HTMLFieldSetElement>>
}

const SortablePopover = observer(function SortablePopover({
  triggerRefs,
  open$,
}: SortablePopoverProps) {
  const currentTriggerRef = useRef<HTMLFieldSetElement | null>(null)

  const openId = open$.get()
  useEffect(() => {
    if (openId) {
      currentTriggerRef.current = triggerRefs.current?.get(openId) ?? null
    } else {
      currentTriggerRef.current = null
    }
  }, [openId, triggerRefs])

  return (
    <Popover
      triggerRef={currentTriggerRef}
      open={openId !== null}
      onOpenChange={(open) => {
        if (!open) open$.set(null)
      }}
      placement="left"
      draggable={true}
      autoUpdate={true}
    >
      <Popover.Header title="Popover" />
      <Popover.Content className="max-w-64 p-4">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
      </Popover.Content>
    </Popover>
  )
})

// ============ Basic Story ============

// Fixed initial data to avoid SSR hydration issues
const BASIC_INITIAL_DATA: SortableItem[] = [
  { id: "basic-001", indexKey: "a", value: "option-a", visible: true },
]

/**
 * Drag-and-drop sortable list within a panel.
 *
 * `Panel.Sortable` and `Panel.SortableRow` enable reorderable lists with drag-and-drop functionality.
 * Use `useSortableRowItem()` hook inside row content to access the current item data.
 *
 * ### Props (Panel.Sortable)
 * - `data`: Array of items with unique `id` and `indexKey`
 * - `selectedId`: Currently selected item ID
 * - `onSelectedIdChange`: Selection change callback
 * - `onDrop`: Reorder callback with `(position, dragId, dropIndex)`
 *
 * ### Features
 * - Drag handle auto-hides when only one item exists
 * - Visual drop indicator shows placement position
 * - Auto-scroll when dragging near container edges
 * - Keyboard delete support (Delete/Backspace when selected)
 * - Interactive elements (Select, IconButton) don't trigger drag
 *
 * ### Row Content
 * Use `useSortableRowItem<T>()` to access current item data in child components.
 * Wrap child components with `observer()` for reactive updates.
 */
export const Sortable: Story = {
  render: function SortableStory() {
    const [items, setItems] = useState<SortableItem[]>(BASIC_INITIAL_DATA)
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const open$ = useObservable<string | null>(null)
    const triggerRefs = useRef<Map<string, HTMLFieldSetElement>>(new Map())

    const handleAdd = useEventCallback(() => {
      const newItem: SortableItem = {
        id: nanoid(),
        indexKey: String(Date.now()),
        value: "option-a",
        visible: true,
      }
      setItems((prev) => [...prev, newItem])
    })

    const handleRemove = useEventCallback((id: string) => {
      setItems((prev) => prev.filter((item) => item.id !== id))
      setSelectedId(null)
    })

    const handleVisible = useEventCallback((id: string) => {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, visible: !item.visible } : item)),
      )
    })

    const handleValueChange = useEventCallback((id: string, value: string) => {
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, value } : item)))
    })

    const handleDrop = useEventCallback(
      (position: "top" | "bottom" | null, dragId: string, dropIndex: number) => {
        setItems((prev) => {
          const dragIndex = prev.findIndex((item) => item.id === dragId)
          if (dragIndex === -1) return prev

          const targetIndex = calculateTargetIndex(dragIndex, dropIndex, position)
          return moveItem(prev, dragIndex, targetIndex)
        })
      },
    )

    // Keyboard delete handler
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
          handleRemove(selectedId)
        }
      }
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [selectedId, handleRemove])

    // Select options list
    const SELECT_OPTIONS = [
      { value: "option-a", label: "Option A" },
      { value: "option-b", label: "Option B" },
      { value: "option-c", label: "Option C" },
      { value: "option-d", label: "Option D" },
      { value: "option-e", label: "Option E" },
    ]

    const BasicRowContent = observer(function BasicRowContent() {
      const item = useSortableRowItem<SortableItem>()

      return (
        <Panel.SortableRow
          ref={(el) => {
            if (el) triggerRefs.current?.set(item.id, el)
          }}
          type="one-icon-one-input-two-icon"
        >
          <IconButton
            active={open$.get() === item.id}
            variant="highlight"
            className={tcx("[grid-area:icon-1]", !item.visible && "text-disabled-foreground")}
            tooltip={{ content: "Open popover" }}
            onMouseDown={(e) => {
              e.stopPropagation()
              open$.set(open$.get() === item.id ? null : item.id)
            }}
          >
            <EffectDropShadow />
          </IconButton>

          <Select
            matchTriggerWidth
            value={item.value}
            onChange={(value) => handleValueChange(item.id, value)}
          >
            <Select.Trigger
              onMouseDown={(e) => e.stopPropagation()}
              className={tcx(
                !item.visible && "text-disabled-foreground",
                "group-data-[selected=true]/sortable-row:border-selected-boundary [grid-area:input]",
              )}
            >
              <span className="flex-1 truncate">
                {SELECT_OPTIONS.find((opt) => opt.value === item.value)?.label ?? item.value}
              </span>
            </Select.Trigger>
            <Select.Content>
              {SELECT_OPTIONS.map((opt) => (
                <Select.Item
                  key={opt.value}
                  value={opt.value}
                >
                  {opt.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>

          <IconButton
            className="[grid-area:icon-2]"
            tooltip={{ content: "Toggle visibility" }}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => handleVisible(item.id)}
          >
            {item.visible ? <Visible /> : <Hidden />}
          </IconButton>

          <IconButton
            className="[grid-area:icon-3]"
            tooltip={{ content: "Delete" }}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => handleRemove(item.id)}
          >
            <DeleteSmall />
          </IconButton>
        </Panel.SortableRow>
      )
    })

    return (
      <>
        <AllotmentContainer header={<>Sortable</>}>
          <Panel>
            <Panel.Title title="Items">
              <IconButton
                onClick={handleAdd}
                tooltip={{ content: "Add item" }}
              >
                <AddSmall />
              </IconButton>
            </Panel.Title>

            <Panel.Sortable
              data={items}
              selectedId={selectedId}
              onSelectedIdChange={setSelectedId}
              onDrop={handleDrop}
            >
              <BasicRowContent />
            </Panel.Sortable>
          </Panel>
        </AllotmentContainer>

        <SortablePopover
          triggerRefs={triggerRefs}
          open$={open$}
        />
      </>
    )
  },
}
