import type {
  ChannelFieldSpace,
  CheckColorContrastCategory,
  CheckColorContrastLevel,
  RGB,
} from "@choice-ui/react"
import {
  ColorPickerPopover,
  ColorSolidPaint,
  ColorSwatch,
  Popover,
  Select,
  useColorPicker,
} from "@choice-ui/react"
import { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import tinycolor from "tinycolor2"

const meta: Meta<typeof ColorPickerPopover> = {
  title: "Colors/CheckColorContrast",
  component: ColorPickerPopover,
  tags: ["experimental"],
}

export default meta

type Story = StoryObj<typeof ColorPickerPopover>

const SolidBackground = ({
  backgroundColor,
  color,
  alpha,
}: {
  alpha: number
  backgroundColor: RGB
  color: RGB
}) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <ColorSwatch
        color={backgroundColor}
        size={32}
        className="size-full! absolute inset-0"
      />
      <ColorSwatch
        color={color}
        alpha={alpha}
        size={32}
        className="z-2"
      />
    </div>
  )
}

const Controller = ({
  backgroundColor,
  setBackgroundColor,
  selectedElementType,
  setSelectedElementType,
}: {
  backgroundColor: RGB
  selectedElementType: "text" | "graphics"
  setBackgroundColor: (backgroundColor: RGB) => void
  setSelectedElementType: (selectedElementType: "text" | "graphics") => void
}) => {
  return (
    <Popover
      open={true}
      placement="right"
      draggable
      rememberPosition
    >
      <Popover.Header title="Features" />
      <Popover.Trigger>
        <div className="pointer-events-none absolute left-1/2" />
      </Popover.Trigger>
      <Popover.Content className="flex w-60 flex-col gap-2 border-t py-3">
        <div className="flex flex-col gap-2 px-3">
          <Select
            value={selectedElementType}
            onChange={(value) => setSelectedElementType(value as "text" | "graphics")}
          >
            <Select.Trigger>
              <span className="flex-1 truncate">{selectedElementType}</span>
            </Select.Trigger>
            <Select.Content>
              {[
                { label: "Text", value: "text" },
                { label: "Graphics", value: "graphics" },
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
          <input
            type="color"
            value={`#${tinycolor(backgroundColor).toHex()}`}
            onChange={(e) => setBackgroundColor(tinycolor(e.target.value).toRgb())}
          />
        </div>
      </Popover.Content>
    </Popover>
  )
}

/**
 * ### `checkColorContrast` Prop Configuration
 *
 * The `checkColorContrast` prop is an object containing the following properties:
 *
 * - `showColorContrast`: (boolean) Controls the visibility of the contrast checker UI (toolbar and boundary lines).
 * - `level`: ('AA' | 'AAA') The target WCAG contrast level standard.
 * - `category`: ('auto' | 'large-text' | 'normal-text' | 'graphics') The type of content being checked, which affects the required contrast threshold.
 * - `backgroundColor`: (RGB) The background color object ({ r, g, b }).
 * - `foregroundColor`: (RGB) The foreground color object ({ r, g, b }). This is typically linked to the picker's main color state.
 * - `foregroundAlpha`: (number) The alpha value (0-1) of the foreground color. This is linked to the picker's alpha state.
 * - `selectedElementType`: ('text' | 'graphics') Indicates the type of element selected by the user, influencing the 'auto' category behavior.
 * - `handleLevelChange`: (function) Callback function invoked when the user changes the contrast level setting.
 * - `handleCategoryChange`: (function) Callback function invoked when the user changes the category setting.
 * - `handleShowColorContrast`: (function) Callback function to toggle the visibility of the contrast checker UI.
 * - `contrastInfo`: (number | undefined) Optional. If provided, overrides the calculated contrast ratio display in the toolbar.
 *
 * ### Story Implementation
 *
 * In this story:
 * - A separate `Controller` component allows changing the `backgroundColor` and `selectedElementType`.
 * - State variables (`showColorContrast`, `level`, `category`) manage the contrast checker settings.
 * - The `checkColorContrast` object is constructed using these state variables and the picker's color/alpha state.
 * - Callbacks (`setLevel`, `setCategory`, `setShowColorContrast`) update the state when the user interacts with the contrast settings dropdown or the toggle button (if implemented elsewhere).
 * - The contrast boundary lines and recommended point logic are handled internally by the `ColorSolidPaint` component based on the provided `checkColorContrast` props.
 *
 * This setup demonstrates how to integrate and control the color contrast checking functionality within the color picker.
 */
export const Basic: Story = {
  render: function BasicStory() {
    const [backgroundColor, setBackgroundColor] = useState<RGB>({ r: 255, g: 255, b: 255 })
    const [selectedElementType, setSelectedElementType] = useState<"text" | "graphics">("graphics")

    const [showColorContrast, setShowColorContrast] = useState(false)
    const [level, setLevel] = useState<CheckColorContrastLevel>("AA")
    const [category, setCategory] = useState<CheckColorContrastCategory>("auto")
    const [colorSpace, setColorSpace] = useState<ChannelFieldSpace>("hex")

    const {
      color,
      alpha,
      pickerType,
      paintsType,
      handlePickerTypeChange,
      handlePaintsTypeChange,
      handleColorChange,
      handleAlphaChange,
    } = useColorPicker()

    return (
      <>
        <SolidBackground
          color={color}
          alpha={alpha}
          backgroundColor={backgroundColor}
        />

        <Controller
          backgroundColor={backgroundColor}
          setBackgroundColor={setBackgroundColor}
          selectedElementType={selectedElementType}
          setSelectedElementType={setSelectedElementType}
        />

        <ColorPickerPopover
          rememberPosition
          pickerType={pickerType}
          onPickerTypeChange={handlePickerTypeChange}
          paintsType={paintsType}
          onPaintsTypeChange={handlePaintsTypeChange}
          features={{
            checkColorContrast: true,
          }}
          solidPaint={
            <ColorSolidPaint
              colorSpace={colorSpace}
              onColorSpaceChange={(value) => setColorSpace(value as ChannelFieldSpace)}
              color={color}
              alpha={alpha}
              onColorChange={handleColorChange}
              onAlphaChange={handleAlphaChange}
              checkColorContrast={{
                showColorContrast,
                level,
                category,
                backgroundColor,
                foregroundColor: color,
                foregroundAlpha: alpha,
                selectedElementType,
                handleLevelChange: setLevel,
                handleCategoryChange: setCategory,
                handleShowColorContrast: () => setShowColorContrast((prev) => !prev),
              }}
            />
          }
          open={true}
          placement="left"
          checkColorContrast={{
            showColorContrast,
            level,
            category,
            backgroundColor,
            foregroundColor: color,
            foregroundAlpha: alpha,
            selectedElementType,
            handleLevelChange: setLevel,
            handleCategoryChange: setCategory,
            handleShowColorContrast: () => setShowColorContrast((prev) => !prev),
          }}
        >
          <Popover.Trigger>
            <div className="pointer-events-none absolute right-1/2" />
          </Popover.Trigger>
        </ColorPickerPopover>
      </>
    )
  },
}
