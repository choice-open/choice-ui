import type { ChannelFieldSpace, RGB } from "@choice-ui/react"
import { Checkbox, ColorInput, ColorPickerPopover, ColorSolidPaint } from "@choice-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import { useRef, useState } from "react"

const meta: Meta<typeof ColorInput> = {
  title: "Colors/FillInput/ColorInput",
  component: ColorInput,
}

export default meta

type Story = StoryObj<typeof ColorInput>

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
 * `ColorInput` is a comprehensive color input component that combines color swatch, hex input, and alpha control.
 *
 * Features:
 * - Color swatch preview with hex input
 * - Optional alpha transparency control
 * - Multiple states support:
 *   - Active: When color picker is open
 *   - Selected: When color container is selected
 *   - Disabled: When input is disabled
 * - Configurable features via `features` prop:
 *   - `alpha`: Toggle alpha control visibility
 *   - Other features inherited from ColorPickerPopover
 *
 * States:
 * - `active`: Indicates if the color picker is open
 * - `selected`: Indicates if the color container is selected
 * - `disabled`: Disables all interactions and shows disabled state
 *
 */
export const Basic: Story = {
  render: function BasicStory() {
    const triggerRef = useRef<HTMLDivElement>(null)

    const [open, setOpen] = useState(false)
    const [color, setColor] = useState<RGB | undefined>(undefined)
    const [alpha, setAlpha] = useState(1)

    const [showAlpha, setShowAlpha] = useState(true)
    const [disabled, setDisabled] = useState(false)
    const [selected, setSelected] = useState(false)
    const [colorSpace, setColorSpace] = useState<ChannelFieldSpace>("hex")

    return (
      <div className="flex flex-col gap-4">
        <ColorInput
          ref={triggerRef}
          disabled={disabled}
          selected={selected}
          active={open}
          color={color}
          onColorChange={(color) => setColor(color)}
          alpha={alpha}
          onAlphaChange={(alpha) => setAlpha(alpha)}
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
          open={open}
          onOpenChange={(open) => setOpen(open)}
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
