import { Button, Label, NumericInput, Popover, Range, RangeTuple, tcx } from "@choice-ui/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"

const meta: Meta<typeof Range> = {
  title: "Forms/Range",
  component: Range,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof Range>

/**
 * `Range` is a slider component that allows users to select a numeric value within a specified range.
 *
 * ## Features
 * - Customizable minimum and maximum values (including negative ranges)
 * - Optional step intervals with visual tick marks
 * - Default value indicator with snap-to-default behavior
 * - Compound component pattern for advanced customization
 * - Auto-width calculation or explicit width specification
 * - Disabled and read-only state support
 *
 * ## Compound Components
 * The Range component supports a compound pattern for fine-grained control:
 * - `Range.Container` - Wraps the track area and renders dots (accepts custom `Range.Connects` as children)
 * - `Range.Connects` - The colored connection bar (supports `data-connect-status` for positive/negative styling)
 * - `Range.Thumb` - The draggable handle (supports `data-status` for default value styling)
 * - `Range.Dot` - Step markers or default value indicator (supports `data-status` for state styling)
 *
 * ## Usage
 * ```tsx
 * // Basic usage
 * <Range value={value} onChange={setValue} />
 *
 * // With compound components for custom styling
 * <Range value={value} onChange={setValue}>
 *   <Range.Container>
 *     <Range.Connects className="bg-gradient-to-r from-blue-500 to-purple-500" />
 *   </Range.Container>
 *   <Range.Thumb size={18} className="bg-purple-500" />
 * </Range>
 * ```
 *
 * ## Accessibility
 * - Keyboard support (arrow keys with shift for larger steps)
 * - Focus management with visible focus states
 * - Appropriate contrast ratios
 */

/**
 * Basic: Demonstrates the simplest Range implementation.
 *
 * Features:
 * - Controlled component with value and onChange props
 * - Default sizing and appearance
 * - Smooth sliding interaction
 *
 * This example shows a minimal Range implementation with default props.
 * The slider uses its default min (0), max (100), and step values.
 */
export const Basic: Story = {
  render: function BasicStory() {
    const [value, setValue] = useState(0)

    return (
      <>
        <Range
          value={value}
          onChange={setValue}
        />
      </>
    )
  },
}

/**
 * Negative: Demonstrates the Range component with negative values.
 *
 * Features:
 * - Support for negative value ranges
 * - Proper handling of ranges crossing zero
 * - Default value at zero point
 * - Symmetrical range selection
 */
export const Negative: Story = {
  render: function NegativeStory() {
    const [value, setValue] = useState(0)

    return (
      <Range
        value={value}
        onChange={setValue}
        min={-100}
        max={100}
        defaultValue={0}
      />
    )
  },
}

/**
 * Step: Demonstrates Range with discrete steps and tick marks.
 *
 * Features:
 * - Visual tick marks for each step
 * - Snapping to step values during dragging
 * - Value display to show current selection
 *
 * Use stepped ranges when:
 * - Only specific values are valid (like percentages in increments of 10)
 * - Users benefit from visual indicators of available options
 * - Precise selection between specific intervals is needed
 */
export const Step: Story = {
  render: function StepStory() {
    const [value, setValue] = useState(0)

    return (
      <>
        <Range
          value={value}
          onChange={setValue}
          min={0}
          max={100}
          step={10}
        />
        <div className="w-10 text-right">{value}%</div>
      </>
    )
  },
}

/**
 * DefaultValue: Demonstrates the defaultValue feature for indicating recommended settings.
 *
 * Features:
 * - Visual indicator for the default/recommended value
 * - Snap effect when dragging near the default value
 * - No step marks, allowing continuous selection
 *
 * Note: This defaultValue is not the initial value of the slider, but rather
 * a reference point on the scale. The initial value is set via state.
 *
 * Use defaultValue when:
 * - There's a recommended or factory setting to highlight
 * - Users should be aware of a standard value while still having freedom to adjust
 */
export const DefaultValue: Story = {
  render: function DefaultValueStory() {
    const [value, setValue] = useState(10)

    return (
      <>
        <Range
          value={value}
          onChange={setValue}
          min={0}
          max={100}
          defaultValue={50}
        />
        <div className="w-10 text-right">{value}%</div>
      </>
    )
  },
}

/**
 * DefaultValueAndStep: Demonstrates combining defaultValue with step marks.
 *
 * Features:
 * - Both step marks and default value indicator
 * - Snap effect to both steps and default value
 * - Visual hierarchy showing both step intervals and recommended value
 *
 * This pattern is useful for:
 * - Settings with both recommended values and required increments
 * - Advanced controls where precision and guidance are both important
 * - Helping users choose appropriate values within constraints
 */
export const DefaultValueAndStep: Story = {
  render: function DefaultValueAndStepStory() {
    const [value, setValue] = useState(10)

    return (
      <>
        <Range
          value={value}
          onChange={setValue}
          min={0}
          max={100}
          defaultValue={50}
          step={10}
        />
        <div className="w-10 text-right">{value}%</div>
      </>
    )
  },
}

/**
 * Disabled: Demonstrates the Range component in a disabled state.
 *
 * Features:
 * - Visual indication that the control cannot be interacted with
 * - Prevents user interaction while maintaining current value
 * - Appropriate styling to show unavailable state
 *
 * Use disabled Range when:
 * - The setting is not applicable in the current context
 * - Permissions don't allow adjusting this setting
 * - The control should show a value but not allow changes
 */
export const Disabled: Story = {
  render: function DisabledStory() {
    const [value, setValue] = useState(50)

    return (
      <>
        <Range
          value={value}
          onChange={setValue}
          min={0}
          max={100}
          disabled
        />
        <div className="w-10 text-right">{value}%</div>
      </>
    )
  },
}

/**
 * CustomSize: Demonstrates configuring the Range component dimensions.
 *
 * Use compound components to customize dimensions:
 * - `Range.Container height={number}` - Sets track height
 * - `Range.Thumb size={number}` - Sets thumb size
 * - `width={number}` prop on Range - Sets track width
 *
 * The `thumbSize` prop on Range is used for calculations when not using
 * compound components, but `Range.Thumb size` takes precedence when specified.
 */
export const CustomSize: Story = {
  render: function CustomSizeStory() {
    const [value, setValue] = useState(50)

    return (
      <>
        <Range
          value={value}
          onChange={setValue}
          min={0}
          max={100}
          width={200}
          thumbSize={10}
        >
          <Range.Container height={10} />
          <Range.Thumb size={10} />
        </Range>
        <div className="w-10 text-right">{value}%</div>
      </>
    )
  },
}

/**
 * Compound: Demonstrates the compound component pattern for custom styling.
 *
 * The Range component uses a compound pattern with these subcomponents:
 * - `Range.Container` - Renders the track background and dots
 * - `Range.Thumb` - The draggable handle with customizable size and className
 *
 * When using compound components, the parent Range only provides the container
 * wrapper and context. All visual elements are explicitly rendered as children.
 *
 * ```tsx
 * <Range value={value} onChange={setValue}>
 *   <Range.Container height={4} />
 *   <Range.Thumb size={6} className="rounded-sm" />
 * </Range>
 * ```
 */
export const Compound: Story = {
  render: function CompoundStory() {
    const [value, setValue] = useState(50)

    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Range
            value={value}
            onChange={setValue}
          >
            <Range.Container />
            <Range.Thumb
              size={18}
              className="bg-blue-500"
            />
          </Range>
          <div className="w-10 text-right">{value}%</div>
        </div>

        <div className="flex items-center gap-4">
          <Range
            value={value}
            onChange={setValue}
            className="bg-red-500"
          >
            <Range.Container height={4} />
            <Range.Thumb
              className="h-2 w-3 rounded-sm"
              size={6}
            />
          </Range>
          <div className="w-10 text-right">{value}%</div>
        </div>
      </div>
    )
  },
}

/**
 * CustomConnects: Demonstrates custom styling for the connection bar.
 *
 * Use `Range.Container` with a nested `Range.Connects` for fine-grained control
 * over the connection bar styling (gradients, conditional colors, etc.).
 *
 * ## Component Structure
 * - `Range.Container` - Logical wrapper that renders connects + dots
 * - `Range.Connects` - The actual colored bar element
 *
 * ## Data Attributes
 * `Range.Connects` exposes `data-connect-status` for conditional styling:
 * - `positive` - when value >= 0 (or min >= 0)
 * - `negative` - when value < 0 (only for ranges with min < 0)
 * - `disabled` - when the range is disabled
 *
 * ```tsx
 * <Range.Connects className="data-[connect-status=negative]:bg-red-500 data-[connect-status=positive]:bg-green-500" />
 * ```
 */
export const CustomConnects: Story = {
  render: function CustomConnectsStory() {
    const [value, setValue] = useState(50)
    const [negativeValue, setNegativeValue] = useState(0)

    return (
      <div className="flex flex-col gap-8">
        {/* Gradient connects */}
        <div className="flex flex-col gap-2">
          <Label>Gradient connection bar</Label>
          <div className="flex items-center gap-4">
            <Range
              value={value}
              onChange={setValue}
            >
              <Range.Container>
                <Range.Connects className="bg-gradient-to-r from-blue-500 to-purple-500" />
              </Range.Container>
              <Range.Thumb
                size={18}
                className="bg-purple-500"
              />
            </Range>
            <div className="w-10 text-right">{value}%</div>
          </div>
        </div>

        {/* Custom styled connects with dots */}
        <div className="flex flex-col gap-2">
          <Label>Custom connects with step dots</Label>
          <div className="flex items-center gap-4">
            <Range
              value={value}
              onChange={setValue}
              step={10}
              defaultValue={50}
            >
              <Range.Container>
                <Range.Connects className="bg-gradient-to-r from-green-400 to-blue-500" />
              </Range.Container>
              <Range.Thumb
                size={18}
                className="bg-blue-500 data-[status=default]:bg-white"
              />
              <Range.Dot className="size-1.5 bg-blue-400/30 data-[status=default]:bg-orange-400 data-[status=over]:bg-blue-500" />
            </Range>
            <div className="w-10 text-right">{value}%</div>
          </div>
        </div>

        {/* Negative range with different positive/negative colors */}
        <div className="flex flex-col gap-2">
          <Label>Negative range with data-connect-status styling</Label>
          <div className="flex items-center gap-4">
            <Range
              value={negativeValue}
              onChange={setNegativeValue}
              min={-100}
              max={100}
              defaultValue={0}
            >
              <Range.Container>
                <Range.Connects className="data-[connect-status=negative]:bg-red-500 data-[connect-status=positive]:bg-green-500" />
              </Range.Container>
              <Range.Thumb
                size={18}
                className={tcx(
                  negativeValue < 0 ? "bg-red-500" : "bg-green-500",
                  "data-[status=default]:bg-white",
                )}
              />
            </Range>
            <div className="w-10 text-right">{negativeValue}</div>
          </div>
        </div>
      </div>
    )
  },
}

/**
 * CustomDot: Demonstrates custom styling for step markers and default value indicators.
 *
 * Use `Range.Dot` to customize the appearance of dots that appear when using
 * `step` (tick marks) or `defaultValue` (default indicator).
 *
 * ## Data Attributes
 * `Range.Dot` exposes `data-status` for conditional styling:
 * - `under` - dots above current value
 * - `over` - dots at or below current value
 * - `default` - the default value dot (when not passed)
 * - `default-over` - default value dot when current value >= default
 *
 * ```tsx
 * <Range.Dot className="size-1.5 data-[status=default]:bg-orange-400 data-[status=over]:bg-blue-500" />
 * ```
 */
export const CustomDot: Story = {
  render: function CustomDotStory() {
    const [value, setValue] = useState(50)

    return (
      <div className="flex flex-col gap-8">
        {/* With step */}
        <div className="flex flex-col gap-2">
          <Label>Step with custom dots</Label>
          <div className="flex items-center gap-4">
            <Range
              value={value}
              onChange={setValue}
              step={10}
            >
              <Range.Container />
              <Range.Thumb
                size={18}
                className="bg-blue-500"
              />
              <Range.Dot />
            </Range>
            <div className="w-10 text-right">{value}%</div>
          </div>
        </div>

        {/* With defaultValue */}
        <div className="flex flex-col gap-2">
          <Label>Default value with custom dot</Label>
          <div className="flex items-center gap-4">
            <Range
              value={value}
              onChange={setValue}
              defaultValue={50}
            >
              <Range.Container>
                <Range.Connects className="bg-gradient-to-r from-green-400 to-blue-500" />
              </Range.Container>
              <Range.Thumb
                size={18}
                className="bg-green-500 data-[status=default]:border-green-500"
              />
              <Range.Dot className="size-2 bg-green-400 data-[status=over]:bg-pink-400" />
            </Range>
            <div className="w-10 text-right">{value}%</div>
          </div>
        </div>

        {/* Step + defaultValue with custom dots */}
        <div className="flex flex-col gap-2">
          <Label>Step + Default value with custom dots</Label>
          <div className="flex items-center gap-4">
            <Range
              value={value}
              onChange={setValue}
              step={10}
              defaultValue={50}
            >
              <Range.Container>
                <Range.Connects className="bg-purple-500" />
              </Range.Container>
              <Range.Thumb
                size={18}
                className="bg-purple-500 data-[status=default]:bg-white"
              />
              <Range.Dot className="size-1 rotate-45 rounded-none bg-purple-400/20 data-[status=default-over]:bg-white data-[status=default]:bg-red-400 data-[status=over]:bg-purple-600" />
            </Range>
            <div className="w-10 text-right">{value}%</div>
          </div>
        </div>
      </div>
    )
  },
}

/**
 * DraggableRangePopover: Demonstrates Range inside a draggable Popover component.
 *
 * Features:
 * - Integration with Popover for contextual settings
 * - Properly sized for compact display
 * - Value display alongside the slider
 * - Draggable container with proper interaction handling
 *
 * This pattern is useful for:
 * - Quick adjustment panels that don't require dedicated forms
 * - Property inspectors or editing tools
 * - Settings that should be adjustable without navigating to a new screen
 */
export const DraggableRangePopover: Story = {
  render: function DraggableRangePopoverStory() {
    const [value, setValue] = useState(0)

    return (
      <Popover draggable>
        <Popover.Trigger>
          <Button>Open</Button>
        </Popover.Trigger>
        <Popover.Header title="Range" />
        <Popover.Content className="grid w-64 grid-cols-[180px_auto] gap-2 p-3">
          <Range
            className="flex-1"
            value={value}
            onChange={setValue}
            min={0}
            max={100}
            defaultValue={50}
            width={180}
          />
          <div className="w-10 flex-1 text-right">{value}%</div>
        </Popover.Content>
      </Popover>
    )
  },
}

/**
 * AutoWidth: Demonstrates automatic width calculation from the container.
 *
 * Set `width={false}` to enable auto-width mode. The Range component will
 * use a ResizeObserver to calculate its width from the parent container,
 * making it responsive to layout changes.
 *
 * This is useful for:
 * - Fluid layouts where the slider should fill available space
 * - Integration with other form elements (like NumericInput)
 * - Responsive designs without fixed widths
 *
 * ```tsx
 * <Range value={value} onChange={setValue} width={false}>
 *   <Range.Container height={6} />
 *   <Range.Thumb size={10} />
 * </Range>
 * ```
 */
export const AutoWidth: Story = {
  render: function AutoWidthStory() {
    const [value, setValue] = useState(0)

    return (
      <div className="grid w-40 grid-cols-[1fr_2.5rem] gap-px">
        <div className="bg-secondary-background flex items-center rounded-l-md px-2">
          <Range
            className="bg-default-boundary flex-1"
            value={value}
            onChange={setValue}
            min={0}
            max={100}
            thumbSize={10}
            width={false}
          >
            <Range.Container height={6} />
            <Range.Thumb size={10} />
          </Range>
        </div>
        <NumericInput
          className="before:rounded-l-none"
          expression="{value}%"
          value={value}
          onChange={(value) => setValue(value as number)}
          min={0}
          max={100}
        >
          <NumericInput.Prefix className="w-2 rounded-l-none" />
        </NumericInput>
      </div>
    )
  },
}

/**
 * BasicTuple: Demonstrates the simplest RangeTuple implementation for selecting a range.
 *
 * Features:
 * - Dual thumbs for selecting min and max values
 * - Controlled component with tuple value [min, max]
 * - Highlighted area between thumbs
 * - Independent thumb dragging
 *
 * This example shows a minimal RangeTuple implementation for selecting a range
 * of values between two endpoints. Both thumbs can be dragged independently.
 */
export const BasicTuple: Story = {
  render: function BasicTupleStory() {
    const [value, setValue] = useState<[number, number]>([25, 75])

    return (
      <div className="flex items-center gap-4">
        <RangeTuple
          value={value}
          onChange={setValue}
        />
        <div className="text-body-medium w-20 text-right">
          {value[0]} - {value[1]}
        </div>
      </div>
    )
  },
}

/**
 * TupleCompound: Demonstrates the compound component pattern for RangeTuple.
 *
 * RangeTuple uses the same compound pattern as Range:
 * - `RangeTuple.Container` - Renders the track background and dots
 * - `RangeTuple.Thumb` - The draggable handles (requires `index` prop: 0 or 1)
 *
 * Each thumb must specify its index to identify which end of the range it controls.
 *
 * ```tsx
 * <RangeTuple value={value} onChange={setValue}>
 *   <RangeTuple.Container height={4} />
 *   <RangeTuple.Thumb index={0} size={8} className="rounded-sm" />
 *   <RangeTuple.Thumb index={1} size={8} className="rounded-sm" />
 * </RangeTuple>
 * ```
 */
export const TupleCompound: Story = {
  render: function TupleCompoundStory() {
    const [value, setValue] = useState<[number, number]>([25, 75])

    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <RangeTuple
            value={value}
            onChange={setValue}
          >
            <RangeTuple.Container height={4} />
            <RangeTuple.Thumb
              index={0}
              size={8}
              className="rounded-sm"
            />
            <RangeTuple.Thumb
              index={1}
              size={8}
              className="rounded-sm"
            />
          </RangeTuple>
          <div className="text-body-medium w-20 text-right">
            {value[0]} - {value[1]}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <RangeTuple
            value={value}
            onChange={setValue}
          >
            <RangeTuple.Container />
            <RangeTuple.Thumb
              index={0}
              size={18}
              className="bg-blue-500"
            />
            <RangeTuple.Thumb
              index={1}
              size={18}
              className="bg-blue-500"
            />
          </RangeTuple>
          <div className="text-body-medium w-20 text-right">
            {value[0]} - {value[1]}
          </div>
        </div>
      </div>
    )
  },
}

/**
 * TupleWithStep: Demonstrates RangeTuple with discrete steps and tick marks.
 *
 * Features:
 * - Visual tick marks for each step
 * - Dual thumbs snap to step values
 * - Range display showing selected interval
 * - Dots highlight within the selected range
 *
 * Use stepped tuple ranges when:
 * - Selecting a range with specific intervals (like time slots)
 * - Users need visual feedback for available options
 * - Precision between specific values is required
 */
export const TupleWithStep: Story = {
  render: function TupleWithStepStory() {
    const [value, setValue] = useState<[number, number]>([20, 80])

    return (
      <div className="flex items-center gap-4">
        <RangeTuple
          value={value}
          onChange={setValue}
          min={0}
          max={100}
          step={10}
        />
        <div className="text-body-medium w-20 text-right">
          {value[0]} - {value[1]}%
        </div>
      </div>
    )
  },
}

/**
 * TupleWithDefaultValue: Demonstrates RangeTuple with default value indicators.
 *
 * Features:
 * - Visual indicators for recommended default range
 * - Snap effect when dragging near default values
 * - Helps users identify standard ranges
 * - Thumbs change color when at default positions
 *
 * Use defaultValue tuple when:
 * - There's a recommended range to highlight
 * - Users should be aware of standard ranges
 * - Providing guidance for typical selections
 */
export const TupleWithDefaultValue: Story = {
  render: function TupleWithDefaultValueStory() {
    const [value, setValue] = useState<[number, number]>([10, 90])

    return (
      <div className="flex items-center gap-4">
        <RangeTuple
          value={value}
          onChange={setValue}
          min={0}
          max={100}
          defaultValue={[25, 75]}
        />
        <div className="text-body-medium w-20 text-right">
          {value[0]} - {value[1]}%
        </div>
      </div>
    )
  },
}

/**
 * TupleNegativeRange: Demonstrates RangeTuple with negative min/max values.
 *
 * Features:
 * - Support for negative value ranges
 * - Proper handling of ranges crossing zero
 * - Default value at zero point
 * - Symmetrical range selection
 *
 * Useful for:
 * - Temperature ranges
 * - Profit/loss intervals
 * - Any measurement that includes negative values
 */
export const TupleNegativeRange: Story = {
  render: function TupleNegativeRangeStory() {
    const [value, setValue] = useState<[number, number]>([-50, 50])

    return (
      <div className="flex items-center gap-4">
        <RangeTuple
          value={value}
          onChange={setValue}
          min={-100}
          max={100}
          defaultValue={[0, 0]}
        />
        <div className="text-body-medium w-20 text-right">
          {value[0]} - {value[1]}
        </div>
      </div>
    )
  },
}

/**
 * TupleDisabled: Demonstrates the RangeTuple component in a disabled state.
 *
 * Features:
 * - Visual indication that the control cannot be interacted with
 * - Prevents user interaction while maintaining current range
 * - Appropriate styling to show unavailable state
 *
 * Use disabled RangeTuple when:
 * - The range setting is not applicable in the current context
 * - Permissions don't allow adjusting this range
 * - The control should show values but not allow changes
 */
export const TupleDisabled: Story = {
  render: function TupleDisabledStory() {
    const [value, setValue] = useState<[number, number]>([30, 70])

    return (
      <div className="flex items-center gap-4">
        <RangeTuple
          value={value}
          onChange={setValue}
          min={0}
          max={100}
          disabled
        />
        <div className="text-body-medium w-20 text-right">
          {value[0]} - {value[1]}%
        </div>
      </div>
    )
  },
}

/**
 * TupleCustomSize: Demonstrates configuring the RangeTuple component dimensions.
 *
 * Features:
 * - Custom track width and height
 * - Custom thumb size for both handles
 * - Proportional adjustments to all visual elements
 *
 * Use custom sizing when:
 * - Fitting into space-constrained layouts
 * - Creating more compact or larger range controls
 * - Matching specific design requirements
 */
export const TupleCustomSize: Story = {
  render: function TupleCustomSizeStory() {
    const [value, setValue] = useState<[number, number]>([20, 80])

    return (
      <div className="flex items-center gap-4">
        <RangeTuple
          value={value}
          onChange={setValue}
          min={0}
          max={100}
          width={200}
          thumbSize={10}
        >
          <RangeTuple.Container height={10} />
          <RangeTuple.Thumb
            index={0}
            size={10}
          />
          <RangeTuple.Thumb
            index={1}
            size={10}
          />
        </RangeTuple>
        <div className="text-body-medium w-20 text-right">
          {value[0]} - {value[1]}%
        </div>
      </div>
    )
  },
}

/**
 * TupleInPopover: Demonstrates RangeTuple inside a draggable Popover component.
 *
 * Features:
 * - Integration with Popover for contextual range selection
 * - Properly sized for compact display
 * - Range value display alongside the slider
 * - Draggable container with proper interaction handling
 *
 * This pattern is useful for:
 * - Filter panels that require range selection
 * - Property inspectors with range constraints
 * - Settings that should be adjustable without navigating away
 */
export const TupleInPopover: Story = {
  render: function TupleInPopoverStory() {
    const [value, setValue] = useState<[number, number]>([25, 75])

    return (
      <Popover draggable>
        <Popover.Trigger>
          <Button>Open Range Filter</Button>
        </Popover.Trigger>
        <Popover.Header title="Select Range" />
        <Popover.Content className="grid grid-cols-[180px_auto] gap-2 p-3">
          <RangeTuple
            className="flex-1"
            value={value}
            onChange={setValue}
            min={0}
            max={100}
            defaultValue={[25, 75]}
            width={180}
          />
          <div className="text-body-medium w-14 flex-1 text-right">
            {value[0]}-{value[1]}%
          </div>
        </Popover.Content>
      </Popover>
    )
  },
}

/**
 * TupleSentimentNeutralRange: Demonstrates RangeTuple for sentiment analysis neutral range.
 *
 * Features:
 * - Range from -1 to 1 representing sentiment values
 * - Default neutral range of [-0.2, 0.2]
 * - Symmetrical range around zero
 * - Decimal value display with precision
 *
 * Use this pattern for:
 * - Sentiment analysis configuration
 * - Defining neutral zones in bipolar scales
 * - Setting thresholds for classification systems
 * - Any measurement requiring a neutral range around zero
 */
export const TupleSentimentNeutralRange: Story = {
  render: function TupleSentimentNeutralRangeStory() {
    const [value, setValue] = useState<[number, number]>([-0.2, 0.2])

    return (
      <div className="flex items-center gap-4">
        <RangeTuple
          value={value}
          step={0.0001}
          onChange={(value) => {
            console.log("value", value)
            setValue(value)
          }}
          min={-1}
          max={1}
          defaultValue={[-0.25, 0.25]}
        />
        <div className="text-body-medium w-28 text-right">
          {value[0].toFixed(3)} - {value[1].toFixed(3)}
        </div>
      </div>
    )
  },
}

/**
 * [TEST] Range component in readOnly state.
 *
 * In readOnly mode:
 * - The range slider does not respond to pointer or keyboard events
 * - The value cannot be changed
 * - Useful for displaying range value without allowing changes
 */
export const Readonly: Story = {
  render: function ReadonlyStory() {
    const [value, setValue] = useState(50)
    const [changeCount, setChangeCount] = useState(0)

    const handleChange = (newValue: number) => {
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

        <Range
          readOnly
          value={value}
          onChange={handleChange}
          min={0}
          max={100}
        />

        <Range
          value={value}
          onChange={handleChange}
          min={0}
          max={100}
        />

        <div className="text-body-small text-stone-600">
          💡 Try dragging the readonly range slider or using arrow keys - the value should not
          change and the change count should remain at 0. Only the normal slider will change the
          value.
        </div>
      </div>
    )
  },
}

/**
 * [TEST] RangeTuple component in readOnly state.
 *
 * In readOnly mode:
 * - The range tuple slider does not respond to pointer or keyboard events
 * - The range values cannot be changed
 * - Useful for displaying range values without allowing changes
 */
export const TupleReadonly: Story = {
  render: function TupleReadonlyStory() {
    const [value, setValue] = useState<[number, number]>([30, 70])
    const [changeCount, setChangeCount] = useState(0)

    const handleChange = (newValue: [number, number]) => {
      setValue(newValue)
      setChangeCount((prev) => prev + 1)
    }

    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border bg-stone-50 p-4">
          <div className="text-body-small-strong mb-2 text-stone-700">Current Range:</div>
          <div className="text-body-small font-mono text-stone-600">
            {value[0]} - {value[1]}
          </div>
          <div className="text-body-small-strong mt-2 text-stone-700">Change Count:</div>
          <div className="text-body-small font-mono text-stone-600">{changeCount}</div>
        </div>

        <div className="flex items-center gap-4">
          <RangeTuple
            readOnly
            value={value}
            onChange={handleChange}
            min={0}
            max={100}
          />
          <div className="text-body-medium w-20 text-right">
            {value[0]} - {value[1]}%
          </div>
        </div>

        <div className="flex items-center gap-4">
          <RangeTuple
            value={value}
            onChange={handleChange}
            min={0}
            max={100}
          />
          <div className="text-body-medium w-20 text-right">
            {value[0]} - {value[1]}%
          </div>
        </div>

        <div className="text-body-small text-stone-600">
          💡 Try dragging the thumbs or using arrow keys on both range tuples - only the normal one
          should change the values and increment the count. The readonly one should not respond to
          any interactions.
        </div>
      </div>
    )
  },
}

/**
 * TupleCustomConnects: Demonstrates custom styling for the connection bar in RangeTuple.
 *
 * Use `RangeTuple.Container` with a nested `RangeTuple.Connects` for custom connection bar styling.
 * The connection bar spans between the two thumbs.
 *
 * ## Component Structure
 * - `RangeTuple.Container` - Logical wrapper that renders connects + dots
 * - `RangeTuple.Connects` - The colored bar between the two thumbs
 *
 * ```tsx
 * <RangeTuple value={value} onChange={setValue}>
 *   <RangeTuple.Container>
 *     <RangeTuple.Connects className="bg-gradient-to-r from-pink-500 to-orange-500" />
 *   </RangeTuple.Container>
 *   <RangeTuple.Thumb index={0} className="bg-pink-500" />
 *   <RangeTuple.Thumb index={1} className="bg-orange-500" />
 * </RangeTuple>
 * ```
 */
export const TupleCustomConnects: Story = {
  render: function TupleCustomConnectsStory() {
    const [value, setValue] = useState<[number, number]>([30, 70])

    return (
      <div className="flex flex-col gap-8">
        {/* Gradient connects */}
        <div className="flex flex-col gap-2">
          <Label>Gradient connection bar</Label>
          <div className="flex items-center gap-4">
            <RangeTuple
              value={value}
              onChange={setValue}
            >
              <RangeTuple.Container>
                <RangeTuple.Connects className="bg-gradient-to-r from-pink-500 to-orange-500" />
              </RangeTuple.Container>
              <RangeTuple.Thumb
                index={0}
                size={18}
                className="bg-pink-500"
              />
              <RangeTuple.Thumb
                index={1}
                size={18}
                className="bg-orange-500"
              />
            </RangeTuple>
            <div className="text-body-medium w-20 text-right">
              {value[0]} - {value[1]}%
            </div>
          </div>
        </div>

        {/* Custom styled connects with dots */}
        <div className="flex flex-col gap-2">
          <Label>Custom connects with step dots</Label>
          <div className="flex items-center gap-4">
            <RangeTuple
              value={value}
              onChange={setValue}
              step={10}
            >
              <RangeTuple.Container>
                <RangeTuple.Connects className="bg-gradient-to-r from-cyan-400 to-emerald-500" />
              </RangeTuple.Container>
              <RangeTuple.Thumb
                index={0}
                size={18}
                className="bg-cyan-500"
              />
              <RangeTuple.Thumb
                index={1}
                size={18}
                className="bg-emerald-500"
              />
              <RangeTuple.Dot className="size-1.5 bg-emerald-400/30 data-[status=over]:bg-emerald-500" />
            </RangeTuple>
            <div className="text-body-medium w-20 text-right">
              {value[0]} - {value[1]}%
            </div>
          </div>
        </div>
      </div>
    )
  },
}

/**
 * TupleCustomDot: Demonstrates custom styling for step markers in RangeTuple.
 *
 * Use `RangeTuple.Dot` to customize the appearance of dots that appear when using
 * `step` (tick marks) or `defaultValue` (default indicators for both ends).
 *
 * ## Data Attributes
 * `RangeTuple.Dot` exposes `data-status` for conditional styling:
 * - `under` - dots outside the selected range
 * - `over` - dots within the selected range
 * - `default` - default value dots (when not within range)
 * - `default-over` - default value dots when within range
 * - `left-over` / `right-over` - specific default dot states
 *
 * ```tsx
 * <RangeTuple.Dot className="size-1.5 data-[status=over]:bg-emerald-500" />
 * ```
 */
export const TupleCustomDot: Story = {
  render: function TupleCustomDotStory() {
    const [value, setValue] = useState<[number, number]>([30, 70])

    return (
      <div className="flex flex-col gap-8">
        {/* With step */}
        <div className="flex flex-col gap-2">
          <div className="text-body-small-strong">Step with custom dots</div>
          <div className="flex items-center gap-4">
            <RangeTuple
              value={value}
              onChange={setValue}
              step={10}
            >
              <RangeTuple.Container />
              <RangeTuple.Thumb
                index={0}
                size={18}
                className="bg-blue-500"
              />
              <RangeTuple.Thumb
                index={1}
                size={18}
                className="bg-blue-500"
              />
              <RangeTuple.Dot />
            </RangeTuple>
            <div className="text-body-medium w-20 text-right">
              {value[0]} - {value[1]}%
            </div>
          </div>
        </div>

        {/* With defaultValue */}
        <div className="flex flex-col gap-2">
          <Label>Default value with custom dots</Label>
          <div className="flex items-center gap-4">
            <RangeTuple
              value={value}
              onChange={setValue}
              defaultValue={[25, 75]}
            >
              <RangeTuple.Container />
              <RangeTuple.Thumb
                index={0}
                size={18}
                className="bg-green-500"
              />
              <RangeTuple.Thumb
                index={1}
                size={18}
                className="bg-green-500"
              />
              <RangeTuple.Dot className="size-2 data-[status=default]:bg-green-400 data-[status=left-over]:bg-pink-400 data-[status=right-over]:bg-pink-400" />
            </RangeTuple>
            <div className="text-body-medium w-20 text-right">
              {value[0]} - {value[1]}%
            </div>
          </div>
        </div>

        {/* Step + defaultValue with custom dots */}
        <div className="flex flex-col gap-2">
          <Label>Step + Default value with custom dots</Label>
          <div className="flex items-center gap-4">
            <RangeTuple
              value={value}
              onChange={setValue}
              step={10}
              defaultValue={[30, 70]}
            >
              <RangeTuple.Container />
              <RangeTuple.Thumb
                index={0}
                size={18}
                className="bg-purple-500"
              />
              <RangeTuple.Thumb
                index={1}
                size={18}
                className="bg-purple-500"
              />
              <RangeTuple.Dot className="size-1 rotate-45 rounded-none bg-purple-400/20 data-[status=default-over]:bg-white data-[status=default]:bg-red-400 data-[status=over]:bg-purple-600" />
            </RangeTuple>
            <div className="text-body-medium w-20 text-right">
              {value[0]} - {value[1]}%
            </div>
          </div>
        </div>
      </div>
    )
  },
}
