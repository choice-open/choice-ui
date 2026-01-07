import type { ChannelFieldSpace, GradientPaint, PickerType, RGB } from "@choice-ui/react"
import {
  Checkbox,
  ColorGradientsPaint,
  ColorPickerPopover,
  ColorSolidPaint,
  DEFAULT_COLOR,
  DEFAULT_GRADIENT_TRANSFORM,
  GradientItem,
} from "@choice-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import { nanoid } from "nanoid"
import { useRef, useState } from "react"

const meta: Meta<typeof GradientItem> = {
  title: "Colors/FillInput/GradientItem",
  component: GradientItem,
}

export default meta

type Story = StoryObj<typeof GradientItem>

const FeaturesControl = ({
  disabled,
  selected,
  showAlpha,
  setDisabled,
  setSelected,
  setShowAlpha,
}: {
  disabled: boolean
  selected: boolean
  showAlpha: boolean
  setDisabled: (value: boolean) => void
  setSelected: (value: boolean) => void
  setShowAlpha: (value: boolean) => void
}) => {
  return (
    <div className="flex flex-col gap-2">
      <Checkbox
        value={disabled}
        onChange={(value) => setDisabled(value)}
      >
        <Checkbox.Label>Disabled</Checkbox.Label>
      </Checkbox>

      <Checkbox
        value={selected}
        onChange={(value) => setSelected(value)}
      >
        <Checkbox.Label>Selected</Checkbox.Label>
      </Checkbox>

      <Checkbox
        value={showAlpha}
        onChange={(value) => setShowAlpha(value)}
      >
        <Checkbox.Label>Show Alpha</Checkbox.Label>
      </Checkbox>
    </div>
  )
}

/**
 * `GradientItem` is a component that displays and manages gradient inputs.
 *
 * Features:
 * - Gradient preview with interactive stops
 * - Optional alpha transparency control
 * - Multiple states support:
 *   - Active: When gradient picker is open
 *   - Selected: When gradient container is selected
 *   - Disabled: When input is disabled
 * - Configurable features via `features` prop:
 *   - `alpha`: Toggle alpha control visibility
 *   - Other features inherited from ColorPickerPopover
 *
 * States:
 * - `active`: Indicates if the gradient picker is open
 * - `selected`: Indicates if the gradient container is selected
 * - `disabled`: Disables all interactions and shows disabled state
 *
 */
export const Basic: Story = {
  render: function BasicStory() {
    const triggerRef = useRef<HTMLDivElement>(null)
    const [pickerType, setPickerType] = useState<PickerType>("CUSTOM")

    const [open, setOpen] = useState(false)
    const [color, setColor] = useState<RGB>({ r: 255, g: 87, b: 51 })
    // 初始化渐变配置
    const [gradient, setGradient] = useState<GradientPaint>({
      gradientStops: [
        { id: nanoid(), position: 0, color: DEFAULT_COLOR, alpha: 0 },
        { id: nanoid(), position: 1, color: DEFAULT_COLOR, alpha: 1 },
      ],
      type: "GRADIENT_LINEAR",
      gradientTransform: DEFAULT_GRADIENT_TRANSFORM,
      opacity: 1,
    })

    const [alpha, setAlpha] = useState(1)

    const [showAlpha, setShowAlpha] = useState(true)
    const [disabled, setDisabled] = useState(false)
    const [selected, setSelected] = useState(false)
    const [colorSpace, setColorSpace] = useState<ChannelFieldSpace>("hex")

    return (
      <div className="flex flex-col gap-4">
        <GradientItem
          ref={triggerRef}
          active={open}
          disabled={disabled}
          selected={selected}
          gradient={gradient}
          onGradientChange={setGradient}
          alpha={alpha}
          onAlphaChange={setAlpha}
          onPickerClick={() => setOpen(disabled ? false : !open)}
          className="w-48"
          features={{
            alpha: showAlpha,
          }}
        />

        <FeaturesControl
          disabled={disabled}
          selected={selected}
          showAlpha={showAlpha}
          setDisabled={setDisabled}
          setSelected={setSelected}
          setShowAlpha={setShowAlpha}
        />

        <ColorPickerPopover
          triggerRef={triggerRef}
          pickerType={pickerType}
          onPickerTypeChange={setPickerType}
          solidPaint={
            <ColorSolidPaint
              colorSpace={colorSpace}
              onColorSpaceChange={(value) => setColorSpace(value as ChannelFieldSpace)}
              color={color}
              alpha={alpha}
              onColorChange={(color) => setColor(color)}
              onAlphaChange={(alpha) => setAlpha(alpha)}
            />
          }
          gradientPaint={
            <ColorGradientsPaint
              gradient={gradient}
              onGradientChange={setGradient}
              colorSpace={colorSpace}
              onColorSpaceChange={(value) => setColorSpace(value as ChannelFieldSpace)}
            />
          }
          open={open}
          onOpenChange={(open) => setOpen(open)}
          paintsType="GRADIENT_LINEAR"
          autoUpdate={false}
          placement="left"
          features={{
            pickerType: false,
            paintsType: false,
            alpha: showAlpha,
          }}
        />
      </div>
    )
  },
}
