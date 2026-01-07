import { Button, Checkbox, ImageItem, type ImagePaint } from "@choice-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import React, { useState } from "react"
import { useEventCallback } from "usehooks-ts"

const meta: Meta<typeof ImageItem> = {
  title: "Colors/FillInput/ImageItem",
  component: ImageItem,
}

export default meta

type Story = StoryObj<typeof ImageItem>

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
    <>
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
    </>
  )
}

/**
 * `ImageItem` is a component that displays and manages image inputs with preview functionality.
 *
 * Features:
 * - Image Preview: Displays a small thumbnail preview of the uploaded image
 * - Alpha Control: Optional transparency control for the image (can be enabled/disabled)
 * - Multiple States:
 *   - Active: When image picker is open
 *   - Selected: When image container is selected
 *   - Disabled: When input is disabled
 * - Image Upload: Supports image file upload with automatic resizing
 * - Customization: Supports custom styling through className and classNames props
 *
 */
export const Basic: Story = {
  render: function BasicStory() {
    const [image, setImage] = useState<ImagePaint | undefined>(undefined)

    const [showAlpha, setShowAlpha] = useState(true)
    const [disabled, setDisabled] = useState(false)
    const [selected, setSelected] = useState(false)

    const handleImageUpload = useEventCallback(
      async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const img = new Image()
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
