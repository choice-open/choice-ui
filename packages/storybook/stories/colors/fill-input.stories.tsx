import type { ChannelFieldSpace, GradientPaint, ImagePaint, PickerType, RGB } from "@choice-ui/react"
import {
  Button,
  Checkbox,
  ColorGradientsPaint,
  ColorInput,
  ColorPickerPopover,
  ColorSolidPaint,
  DEFAULT_COLOR,
  DEFAULT_GRADIENT_TRANSFORM,
  GradientItem,
  ImageItem,
} from "@choice-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import { nanoid } from "nanoid"
import React, { useRef, useState } from "react"
import { useEventCallback } from "usehooks-ts"

const meta: Meta = {
  title: "Colors/FillInput",
}

export default meta

type Story = StoryObj

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

const UploadImage = ({
  handleImageUpload,
}: {
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
}) => {
  return (
    <div className="relative">
      <input
        id="image-upload"
        className="absolute inset-0 appearance-none opacity-0"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
      />
      <Button asChild>
        <label htmlFor="image-upload">Upload Image</label>
      </Button>
    </div>
  )
}

/**
 * `ColorInput` is a comprehensive color input component that combines color swatch, hex input, and alpha control.
 *
 * Features:
 * - Color swatch preview with hex input
 * - Optional alpha transparency control
 * - Multiple states: active, selected, disabled
 * - Configurable features via `features` prop
 */
export const Solid: Story = {
  render: function SolidStory() {
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

/**
 * `GradientItem` is a component that displays and manages gradient inputs.
 *
 * Features:
 * - Gradient preview with interactive stops
 * - Optional alpha transparency control
 * - Multiple states: active, selected, disabled
 * - Configurable features via `features` prop
 */
export const Gradient: Story = {
  render: function GradientStory() {
    const triggerRef = useRef<HTMLDivElement>(null)
    const [pickerType, setPickerType] = useState<PickerType>("CUSTOM")

    const [open, setOpen] = useState(false)
    const [color, setColor] = useState<RGB>({ r: 255, g: 87, b: 51 })
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

/**
 * `ImageItem` is a component that displays and manages image inputs with preview functionality.
 *
 * Features:
 * - Image preview with thumbnail display
 * - Optional alpha transparency control
 * - Multiple states: active, selected, disabled
 * - Image upload with automatic resizing
 */
export const Image: Story = {
  render: function ImageStory() {
    const [image, setImage] = useState<ImagePaint | undefined>(undefined)

    const [showAlpha, setShowAlpha] = useState(true)
    const [disabled, setDisabled] = useState(false)
    const [selected, setSelected] = useState(false)

    const handleImageUpload = useEventCallback(
      async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const img = new window.Image()
        img.src = URL.createObjectURL(file)

        await new Promise((resolve) => {
          img.onload = () => {
            let newWidth = img.width
            let newHeight = img.height
            const targetSize = 32

            if (img.width > img.height) {
              newHeight = targetSize
              newWidth = Math.round((img.width / img.height) * targetSize)
            } else {
              newWidth = targetSize
              newHeight = Math.round((img.height / img.width) * targetSize)
            }

            const canvas = document.createElement("canvas")
            canvas.width = newWidth
            canvas.height = newHeight
            const ctx = canvas.getContext("2d")
            ctx?.drawImage(img, 0, 0, newWidth, newHeight)

            const base64 = canvas.toDataURL("image/png")
            setImage({
              imageHash: base64,
              type: "IMAGE",
              scaleMode: "FILL",
              imageSizes: {
                thumb: "",
                small: "",
                regular: "",
                raw: "",
                sourceSize: {
                  width: 0,
                  height: 0,
                },
              },
            })

            URL.revokeObjectURL(img.src)
            resolve(null)
          }
        })
      },
    )

    return (
      <div className="flex flex-col gap-4">
        <ImageItem
          disabled={disabled}
          selected={selected}
          imageUrl={image?.imageHash ?? undefined}
          image={image}
          className="w-48"
          features={{
            alpha: showAlpha,
          }}
          labels={{
            alpha: "Alpha",
          }}
        />

        <UploadImage handleImageUpload={handleImageUpload} />

        <FeaturesControl
          disabled={disabled}
          selected={selected}
          showAlpha={showAlpha}
          setDisabled={setDisabled}
          setSelected={setSelected}
          setShowAlpha={setShowAlpha}
        />
      </div>
    )
  },
}
