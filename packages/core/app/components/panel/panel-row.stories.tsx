import {
  AlignBottom,
  AlignCenterHorizontal,
  AlignCenterVertical,
  AlignLeft,
  AlignRight,
  AlignTop,
  ColorTypeGradient,
  Delete,
  EffectDropShadow,
  InfoCircle,
  MaxHeight,
  MaxWidth,
  Search,
  SetupPreferences,
  Styles,
  Variable,
  VariablesBoolean,
  Visible,
  ZoomIn,
  ZoomOut,
} from "@choiceform/icons-react"
import type { Meta, StoryObj } from "@storybook/react"
import "allotment/dist/style.css"
import React, { useState } from "react"
import { Button } from "../button"
import { Checkbox } from "../checkbox"
import { Dropdown } from "../dropdown"
import { IconButton, IconButtonGroup } from "../icon-button"
import { Input } from "../input"
import { NumericInput } from "../numeric-input"
import { Panel } from "../panel"
import { Scroll } from "../scroll"
import { Segmented } from "../segmented"
import { Select } from "../select"
import { Splitter } from "../splitter"
import { Switch } from "../switch"
import { tcx } from "../../utils"

const meta: Meta<typeof Panel> = {
  title: "Layouts/Panel/Row",
  component: Panel,
}

export default meta

type Story = StoryObj<typeof Panel>

const AllotmentContainer = ({
  children,
  header,
}: {
  children: React.ReactNode
  header: React.ReactNode
}) => {
  return (
    <Splitter
      defaultSizes={[800, 240]}
      className="absolute! inset-0"
    >
      <Splitter.Pane minSize={320}>
        <div className="bg-secondary-background flex h-screen min-h-0 w-full flex-1 flex-col"></div>
      </Splitter.Pane>

      <Splitter.Pane minSize={240}>
        <Scroll className="h-full overflow-hidden">
          <Scroll.Viewport className="bg-default-background h-full pb-16">
            <div className="border-b p-4 text-sm font-medium">{header}</div>

            {children}
          </Scroll.Viewport>
        </Scroll>
      </Splitter.Pane>
    </Splitter>
  )
}

/**
 * `IfPanel.Row` provides a flexible grid-based layout system for panel content with various predefined layouts.
 *
 * ### Available Layout Types
 *
 * #### 1. Single Row (`type="single"`)
 * ```css
 * grid-template-areas: "label" "input";
 * grid-template-columns: 1fr;
 * grid-template-rows: auto minmax(2rem, auto);
 * ```
 *
 * #### 2. Two Columns (`type="two-columns"`)
 * ```css
 * grid-template-areas: "label-1 label-2" "left right";
 * grid-template-columns: 1fr 1fr;
 * grid-template-rows: auto minmax(2rem, auto);
 * ```
 *
 * #### 3. One Input One Icon (`type="one-input-one-icon"`)
 * ```css
 * grid-template-areas: "label label" "input icon";
 * grid-template-columns: 1fr 1.5rem;
 * grid-template-rows: auto minmax(2rem, auto);
 * ```
 *
 * #### 4. One Input Two Icon (`type="one-input-two-icon"`)
 * ```css
 * grid-template-areas: "input . icon-1 . icon-2";
 * grid-template-columns: 1fr 0.5rem 1.5rem 0.25rem 1.5rem;
 * grid-template-rows: 2rem;
 * ```
 *
 * #### 5. Two Input One Icon (`type="two-input-one-icon"`)
 * ```css
 * grid-template-areas: "label-1 label-2 label-2" "input-1 input-2 icon";
 * grid-template-columns: 1fr 1fr 1.5rem;
 * grid-template-rows: auto 2rem;
 * ```
 *
 * #### 6. Two Input Two Icon (`type="two-input-two-icon"`)
 * ```css
 * grid-template-areas: "label-1 label-1 label-2 label-2 . . ." "input-1 . input-2 . icon-1 . icon-2";
 * grid-template-columns: minmax(76px, 1fr) 0.5rem 1fr 0.5rem 1.5rem 0.25rem 1.5rem;
 * grid-template-rows: auto minmax(2rem, auto);
 * ```
 *
 * #### 7. One Icon One Input Two Icon (`type="one-icon-one-input-two-icon"`)
 * ```css
 * grid-template-areas: "label label label label label label label" "icon-1 . input . icon-2 . icon-3";
 * grid-template-columns: 1.5rem 0.5rem 1fr 0.5rem 1.5rem 0.25rem 1.5rem;
 * grid-template-rows: auto minmax(2rem, auto);
 * ```
 *
 * #### 8. Two Input One Icon Double Row (`type="two-input-one-icon-double-row"`)
 * ```css
 * grid-template-areas: "label-1 label-2 ." "input-1 input-3 icon-1" "input-2 input-3 icon-2";
 * grid-template-columns: 1fr 1fr 1.5rem;
 * grid-template-rows: auto 2rem 2rem;
 * ```
 *
 * #### 9. One Label One Input (`type="one-label-one-input"`)
 * ```css
 * grid-template-areas: "label input";
 * grid-template-columns: 8fr 20fr;
 * grid-template-rows: 2rem;
 * ```
 *
 * #### 10. Many Icon
 * ```tsx
 * <IfPanel.RowManyIcon
 *   isEditing={manyIconIsEditing.a}
 *   icons={
 *     <>
 *       <IfIconButton tooltip={{ content: "Variable" }}>
 *         <SvgIcon name={SvgIconName.interface.variable} />
 *       </IfIconButton>
 *       <div className="h-6 w-6 flex items-center justify-center">
 *         <SvgIcon name={SvgIconName.ui.infoCircle14} />
 *       </div>
 *     </>
 *   }
 * />
 * ```
 *
 * #### 11. One Icon One Input (`type="one-icon-one-input"`)
 * ```css
 * grid-template-areas: "label label" "icon input";
 * grid-template-columns: 1.5rem 1fr;
 * grid-template-rows: auto minmax(2rem, auto);
 * ```
 *
 * ### Features
 * - Consistent spacing and alignment
 * - Support for labels, inputs, and icons
 * - Flexible grid-based layouts
 * - Optional property labels
 * - Responsive design
 *
 * ### Best Practices
 * - Use appropriate layout type based on content needs
 * - Maintain consistent spacing with grid areas
 * - Follow accessibility guidelines with proper labels
 * - Keep icon sizes consistent within layouts
 */
export const Basic: Story = {
  render: function BasicStory() {
    // State management
    const [showLabels, setShowLabels] = useState(false)
    const [checkboxValue, setCheckboxValue] = useState(false)
    const [segmentedControlValue, setSegmentedControlValue] = useState("zoomOut")
    const [manyIconIsEditing, setManyIconIsEditing] = useState({
      a: false,
      b: false,
    })

    return (
      <AllotmentContainer
        header={
          <Switch
            size="small"
            label="Property labels"
            value={showLabels}
            onChange={(value) => setShowLabels(value)}
          />
        }
      >
        <Panel>
          <Panel.Title title="Panel title with icon button">
            <IconButton tooltip={{ content: "Action" }}>
              <Styles />
            </IconButton>
          </Panel.Title>
          <Panel.Row>
            <div className="[grid-area:input]" />
          </Panel.Row>
        </Panel>
        {/* Single Row Layout */}
        <Panel showLabels={showLabels}>
          <Panel.Title title="Single Row">
            <IconButton tooltip={{ content: "Styles" }}>
              <Styles />
            </IconButton>
          </Panel.Title>

          <Panel.Row type="single">
            <Panel.Label>Select</Panel.Label>
            <Select matchTriggerWidth>
              <Select.Trigger className="[grid-area:input]">
                <span className="flex-1 truncate">Option 1</span>
              </Select.Trigger>
              <Select.Content>
                {[
                  { label: "Option 1", value: "option1" },
                  { label: "Option 2", value: "option2" },
                  { label: "Option 3", value: "option3" },
                ].map((option) => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </Panel.Row>
          <Panel.Row type="single">
            <Panel.Label>Input</Panel.Label>
            <Input
              className="[grid-area:input]"
              placeholder="Input"
            />
          </Panel.Row>
          <Panel.Row type="single">
            <Panel.Label>Segmented Control</Panel.Label>
            <Segmented
              className="[grid-area:input]"
              value={segmentedControlValue}
              onChange={(value) => setSegmentedControlValue(value)}
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
          </Panel.Row>
          <Panel.Row type="single">
            <Checkbox
              className="[grid-area:input]"
              value={checkboxValue}
              onChange={(value) => setCheckboxValue(value)}
            >
              <Checkbox.Label>Checkbox</Checkbox.Label>
            </Checkbox>
          </Panel.Row>
        </Panel>

        {/* Two Columns Layout */}
        <Panel showLabels={showLabels}>
          <Panel.Title title="Two Columns">
            <IconButton tooltip={{ content: "Styles" }}>
              <Styles />
            </IconButton>
          </Panel.Title>

          <Panel.Row type="two-columns">
            <Panel.Label className="[grid-area:label-1]">Dropdown</Panel.Label>
            <Panel.Label className="[grid-area:label-2]">Segmented Control</Panel.Label>
            <Dropdown>
              <Dropdown.Trigger
                className="[grid-area:left]"
                prefixElement={<ZoomOut />}
              >
                <span className="flex-1 truncate">Zoom Out</span>
              </Dropdown.Trigger>
              <Dropdown.Content>
                <Dropdown.Item>
                  <ZoomOut />
                  <span>Zoom Out</span>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Search />
                  <span>100%</span>
                </Dropdown.Item>
                <Dropdown.Item>
                  <ZoomIn />
                  <span>Zoom In</span>
                </Dropdown.Item>
              </Dropdown.Content>
            </Dropdown>
            <Segmented
              className="[grid-area:right]"
              value={segmentedControlValue}
              onChange={(value) => setSegmentedControlValue(value)}
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
          </Panel.Row>

          <Panel.Row type="two-columns">
            <Panel.Label>Group 1</Panel.Label>
            <Panel.Label>Group 2</Panel.Label>
            <IconButtonGroup className="[grid-area:left]">
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
            <IconButtonGroup className="[grid-area:right]">
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
            <Select>
              <Select.Trigger className="[grid-area:left]">
                <span className="flex-1 truncate">Option 1</span>
              </Select.Trigger>
              <Select.Content>
                {[
                  { label: "Option 1", value: "option1" },
                  { label: "Option 2", value: "option2" },
                ].map((option) => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
            <Input
              className="[grid-area:right]"
              placeholder="Input"
            />
          </Panel.Row>
        </Panel>

        {/* One Icon One Input Layout */}
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

        {/* One Input One Icon Layout */}
        <Panel showLabels={showLabels}>
          <Panel.Title title="One Input One Icon">
            <IconButton tooltip={{ content: "Styles" }}>
              <Styles />
            </IconButton>
          </Panel.Title>

          <Panel.Row type="one-input-one-icon">
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

          <Panel.Row type="one-input-one-icon">
            <Panel.Label>Color</Panel.Label>
            <Input className="[grid-area:input]" />
            <IconButton
              className="[grid-area:icon]"
              tooltip={{ content: "Visible" }}
            >
              <Visible />
            </IconButton>
          </Panel.Row>
        </Panel>

        {/* One Input Two Icon Layout */}
        <Panel showLabels={showLabels}>
          <Panel.Title title="One Input Two Icon">
            <IconButton tooltip={{ content: "Styles" }}>
              <Styles />
            </IconButton>
          </Panel.Title>

          <Panel.Row type="one-input-two-icon">
            <Panel.Label>Input</Panel.Label>
            <Input
              className="[grid-area:input]"
              placeholder="Input"
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

          <Panel.Row type="one-input-two-icon">
            {/* <IfPanel.Label className="area-label">Color Input</IfPanel.Label> */}
            <Input className="[grid-area:input]" />
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

        {/* Two Input One Icon Layout */}
        <Panel showLabels={showLabels}>
          <Panel.Title title="Two Input One Icon">
            <IconButton tooltip={{ content: "Styles" }}>
              <Styles />
            </IconButton>
          </Panel.Title>

          <Panel.Row type="two-input-one-icon">
            <Panel.Label className="[grid-area:label-1]">Input 1</Panel.Label>
            <Panel.Label className="[grid-area:label-2]">Input 2</Panel.Label>
            <Input
              className="[grid-area:input-1]"
              placeholder="Input 1"
            />
            <Input
              className="[grid-area:input-2]"
              placeholder="Input 2"
            />
            <IconButton
              className="[grid-area:icon]"
              tooltip={{ content: "Visible" }}
            >
              <Visible />
            </IconButton>
          </Panel.Row>

          <Panel.Row type="two-input-one-icon">
            <Panel.Label className="[grid-area:label-1]">Width</Panel.Label>
            <Panel.Label className="[grid-area:label-2]">Height</Panel.Label>
            <NumericInput
              value={100}
              className="[grid-area:input-1]"
            >
              <NumericInput.Prefix>
                <MaxWidth />
              </NumericInput.Prefix>
            </NumericInput>

            <NumericInput
              value={100}
              className="[grid-area:input-2]"
            >
              <NumericInput.Prefix>
                <MaxHeight />
              </NumericInput.Prefix>
            </NumericInput>
          </Panel.Row>
        </Panel>

        {/* Two Input Two Icon Layout */}
        <Panel showLabels={showLabels}>
          <Panel.Title title="Two Input Two Icon">
            <IconButton tooltip={{ content: "Styles" }}>
              <Styles />
            </IconButton>
          </Panel.Title>

          <Panel.Row type="two-input-two-icon">
            <Panel.Label className="[grid-area:label-1]">Input 1</Panel.Label>
            <Panel.Label className="[grid-area:label-2]">Input 2</Panel.Label>
            <Input
              className="[grid-area:input-1]"
              placeholder="Input 1"
            />
            <Input
              className="[grid-area:input-2]"
              placeholder="Input 2"
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

          <Panel.Row type="two-input-two-icon">
            <Panel.Label className="[grid-area:label-1]">Number Input 1</Panel.Label>
            <Panel.Label className="[grid-area:label-2]">Number Input 2</Panel.Label>
            <NumericInput
              value={100}
              className="[grid-area:input-1]"
            >
              <NumericInput.Prefix>x</NumericInput.Prefix>
            </NumericInput>
            <NumericInput
              value={100}
              className="[grid-area:input-2]"
            >
              <NumericInput.Prefix>Y</NumericInput.Prefix>
            </NumericInput>
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

        {/* One Icon One Input Two Icon Layout */}
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
            <Select matchTriggerWidth>
              <Select.Trigger className="[grid-area:input]">Option 1</Select.Trigger>
              <Select.Content>
                {[
                  { label: "Option 1", value: "option1" },
                  { label: "Option 2", value: "option2" },
                  { label: "Option 3", value: "option3" },
                ].map((option) => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
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

        {/* Two Input One Icon Double Row Layout */}
        <Panel showLabels={showLabels}>
          <Panel.Title title="Two Input One Icon Double Row">
            <IconButton tooltip={{ content: "Styles" }}>
              <Styles />
            </IconButton>
          </Panel.Title>

          <Panel.Row type="two-input-one-icon-double-row">
            <Panel.Label className="[grid-area:label-1]">Select</Panel.Label>
            <Panel.Label className="[grid-area:label-2]">Double Row</Panel.Label>
            <Select matchTriggerWidth>
              <Select.Trigger className="[grid-area:input]">Option 1</Select.Trigger>
              <Select.Content>
                {[
                  { label: "Option 1", value: "option1" },
                  { label: "Option 2", value: "option2" },
                  { label: "Option 3", value: "option3" },
                ].map((option) => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
            <NumericInput
              value={100}
              className="[grid-area:input-2]"
            >
              <NumericInput.Prefix>
                <MaxWidth />
              </NumericInput.Prefix>
            </NumericInput>
            <div className="area-input-3 flex h-full flex-col">
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

        {/* One Label One Input Layout */}
        <Panel showLabels={showLabels}>
          <Panel.Title title="One Label One Input">
            <IconButton tooltip={{ content: "Styles" }}>
              <Styles />
            </IconButton>
          </Panel.Title>

          <Panel.Row type="one-label-one-input">
            <div className="text-secondary-foreground cursor-default [grid-area:label]">
              Label 1
            </div>
            <Select matchTriggerWidth>
              <Select.Trigger className="[grid-area:input]">Option 1</Select.Trigger>
              <Select.Content>
                {[
                  { label: "Option 1", value: "option1" },
                  { label: "Option 2", value: "option2" },
                  { label: "Option 3", value: "option3" },
                ].map((option) => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </Panel.Row>
          <Panel.Row type="one-label-one-input">
            <div className="text-secondary-foreground cursor-default [grid-area:label]">
              Label 2
            </div>
            <Select matchTriggerWidth>
              <Select.Trigger className="[grid-area:input]">Option 1</Select.Trigger>
              <Select.Content>
                {[
                  { label: "Option 1", value: "option1" },
                  { label: "Option 2", value: "option2" },
                  { label: "Option 3", value: "option3" },
                ].map((option) => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </Panel.Row>
        </Panel>

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
                    <Variable />
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
                    <Variable />
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
 * Single row
 * ```css
 * .rows--single {
 *   grid-template-areas: "label" "input";
 *   grid-template-columns: 1fr;
 *   grid-template-rows: auto minmax(2rem, auto);
 * }
 * ```
 * ### Usage:
 * Specify areas using the following classnames:
 * - `area-label`: Label area
 * - `area-input`: Input area
 *
 * ```tsx
 * <IfPanel.Row type="single">
 *   <IfPanel.Label className="area-label">...</IfPanel.Label>
 *   <IfSelect className="area-input" />
 * </IfPanel.Row>
 * ```
 *
 * Label is optional and can be added based on requirements.
 */
export const Single: Story = {
  render: function SingleStory() {
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
 * Two columns
 * ```css
 * .rows--two-columns {
 *   grid-template-areas: "label-1 label-2" "left right";
 *   grid-template-columns: 1fr 1fr;
 *   grid-template-rows: auto minmax(2rem, auto);
 * }
 * ```
 * ### Usage:
 * Specify areas using the following classnames:
 * - `area-label-1`: Label 1 area
 * - `area-label-2`: Label 2 area
 * - `area-left`: Left area
 * - `area-right`: Right area
 *
 * ```tsx
 * <IfPanel.Row type="two-columns">
 *   <IfPanel.Label className="area-label-1">...</IfPanel.Label>
 *   <IfPanel.Label className="area-label-2">...</IfPanel.Label>
 *   <div className="area-left">...</div>
 *   <div className="area-right">...</div>
 * </IfPanel.Row>
 * ```
 *
 * Label is optional and can be added based on requirements.
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
 * One Input One Icon
 * ```css
 * .rows--one-input-one-icon {
 *   grid-template-areas: "label label" "input icon";
 *   grid-template-columns: 1fr 1.5rem;
 *   grid-template-rows: auto minmax(2rem, auto);
 * }
 * ```
 * ### Usage:
 * Specify areas using the following classnames:
 * - `area-label`: Label area
 * - `area-input`: Input area
 * - `area-icon`: Icon area
 *
 * ```tsx
 * <IfPanel.Row type="one-input-one-icon">
 *   <IfPanel.Label className="area-label">...</IfPanel.Label>
 *   <IfInput className="area-input" />
 *   <IfIconButton className="area-icon" />
 * </IfPanel.Row>
 * ```
 *
 * Label is optional and can be added based on requirements.
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
 * One Input Two Icon
 * ```css
 * .rows--one-input-two-icon {
 *   grid-template-areas: "input . icon-1 . icon-2";
 *   grid-template-columns: 1fr 0.5rem 1.5rem 0.25rem 1.5rem;
 *   grid-template-rows: 2rem;
 * }
 * ```
 * ### Usage:
 * Specify areas using the following classnames:
 * - `area-label`: Label area
 * - `area-input`: Input area
 * - `area-icon-1`: Icon 1 area
 * - `area-icon-2`: Icon 2 area
 *
 * ```tsx
 * <IfPanel.Row type="one-input-two-icon">
 *   <IfPanel.Label className="area-label">...</IfPanel.Label>
 *   <IfInput className="area-input" />
 *   <IfIconButton className="area-icon-1" />
 *   <IfIconButton className="area-icon-2" />
 * </IfPanel.Row>
 * ```
 *
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
 * Two Input One Icon
 * ```css
 * .rows--two-input-one-icon {
 *   grid-template-areas: "label-1 label-2 label-2" "input-1 input-2 icon";
 *   grid-template-columns: 1fr 1fr 1.5rem;
 *   grid-template-rows: auto 2rem;
 * }
 * ```
 * ### Usage:
 * Specify areas using the following classnames:
 * - `area-label-1`: Label 1 area
 * - `area-label-2`: Label 2 area
 * - `area-input-1`: Input 1 area
 * - `area-input-2`: Input 2 area
 * - `area-icon`: Icon area
 *
 * ```tsx
 * <IfPanel.Row type="two-input-one-icon">
 *   <IfPanel.Label className="area-label-1">...</IfPanel.Label>
 *   <IfPanel.Label className="area-label-2">...</IfPanel.Label>
 *   <IfInput className="area-input-1" />
 *   <IfInput className="area-input-2" />
 *   <IfIconButton className="area-icon" />
 * </IfPanel.Row>
 * ```
 *
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
 * Two Input Two Icon
 * ```css
 * .rows--two-input-two-icon {
 *   grid-template-areas: "label-1 label-1 label-2 label-2 . . ." "input-1 . input-2 . icon-1 . icon-2";
 *   grid-template-columns: minmax(76px, 1fr) 0.5rem 1fr 0.5rem 1.5rem 0.25rem 1.5rem;
 *   grid-template-rows: auto minmax(2rem, auto);
 * }
 * ```
 * ### Usage:
 * Specify areas using the following classnames:
 * - `area-label-1`: Label 1 area
 * - `area-label-2`: Label 2 area
 * - `area-input-1`: Input 1 area
 * - `area-input-2`: Input 2 area
 * - `area-icon-1`: Icon 1 area
 * - `area-icon-2`: Icon 2 area
 *
 * ```tsx
 * <IfPanel.Row type="two-input-two-icon">
 *   <IfPanel.Label className="area-label-1">...</IfPanel.Label>
 *   <IfPanel.Label className="area-label-2">...</IfPanel.Label>
 *   <IfInput className="area-input-1" />
 *   <IfInput className="area-input-2" />
 *   <IfIconButton className="area-icon-1" />
 *   <IfIconButton className="area-icon-2" />
 * </IfPanel.Row>
 * ```
 *
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
 * One Icon One Input Two Icon
 * ```css
 * .rows--one-icon-one-input-two-icon {
 *   grid-template-areas: "label label label label label label label" "icon-1 . input . icon-2 . icon-3";
 *   grid-template-columns: 1.5rem 0.5rem 1fr 0.5rem 1.5rem 0.25rem 1.5rem;
 *   grid-template-rows: auto minmax(2rem, auto);
 * }
 * ```
 * ### Usage:
 * Specify areas using the following classnames:
 * - `area-label`: Label area
 * - `area-input`: Input area
 * - `area-icon-1`: Icon 1 area
 * - `area-icon-2`: Icon 2 area
 * - `area-icon-3`: Icon 3 area
 *
 * ```tsx
 * <IfPanel.Row type="one-icon-one-input-two-icon">
 *   <IfPanel.Label className="area-label">...</IfPanel.Label>
 *   <IfInput className="area-input" />
 *   <IfIconButton className="area-icon-1" />
 *   <IfIconButton className="area-icon-2" />
 *   <IfIconButton className="area-icon-3" />
 * </IfPanel.Row>
 * ```
 *
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
 * Two Input One Icon Double Row
 * ```css
 * .rows--two-input-one-icon-double-row {
 *   grid-template-areas: "label-1 label-2 ." "input-1 input-3 icon-1" "input-2 input-3 icon-2";
 *   grid-template-columns: 1fr 1fr 1.5rem;
 *   grid-template-rows: auto 2rem 2rem;
 * }
 * ```
 * ### Usage:
 * Specify areas using the following classnames:
 * - `area-label-1`: Label 1 area
 * - `area-label-2`: Label 2 area
 * - `area-input-1`: Input 1 area
 * - `area-input-2`: Input 2 area
 * - `area-input-3`: Input 3 area
 * - `area-icon-1`: Icon 1 area
 * - `area-icon-2`: Icon 2 area
 *
 * ```tsx
 * <IfPanel.Row type="two-input-one-icon-double-row">
 *   <IfPanel.Label className="area-label-1">...</IfPanel.Label>
 *   <IfPanel.Label className="area-label-2">...</IfPanel.Label>
 *   <IfInput className="area-input-1" />
 *   <IfInput className="area-input-2" />
 *   <div className="area-input-3 flex h-full flex-col">
 *     ...
 *   </div>
 *   <IfIconButton className="area-icon-1" />
 * </IfPanel.Row>
 * ```
 *
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
 * One Label One Input
 * ```css
 * .rows--one-label-one-input {
 *   grid-template-areas: "label input";
 *   grid-template-columns: 8fr 20fr;
 *   grid-template-rows: 2rem;
 * }
 * ```
 * ### Usage:
 * Specify areas using the following classnames:
 * - `area-label`: Label area
 * - `area-input`: Input area
 *
 * ```tsx
 * <IfPanel.Row type="one-label-one-input">
 *   <IfPanel.Label className="area-label">...</IfPanel.Label>
 *   <IfInput className="area-input" />
 * </IfPanel.Row>
 * ```
 *
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
 * Many Icon
 * Usage: If you need to display multiple `IfIconButton` in a row, you can use this type. `IfIconButton` will automatically hide.
 *
 * ### Usage:
 *
 * ```tsx
 * <IfPanel.RowManyIcon
 *   isEditing={manyIconIsEditing.a}
 *   icons={
 *     <>
 *       <IfIconButton tooltip={{ content: "Variable" }}>
 *         <SvgIcon name={SvgIconName.interface.variable} />
 *       </IfIconButton>
 *       <div className="h-6 w-6 flex items-center justify-center">
 *         <SvgIcon name={SvgIconName.ui.infoCircle14} />
 *       </div>
 *     </>
 *   }
 * />
 * ```
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
 * One Icon One Input
 * ```css
 * .rows--one-icon-one-input {
 *   grid-template-areas: "label label" "icon input";
 *   grid-template-columns: 1.5rem 1fr;
 *   grid-template-rows: auto minmax(2rem, auto);
 * }
 * ```
 *
 *
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
