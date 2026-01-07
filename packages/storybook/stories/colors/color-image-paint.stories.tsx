import type { ImagePaint } from "@choice-ui/react"
import { ColorImagePaint, useImageFilterStyle } from "@choice-ui/react"
import { Meta, StoryObj } from "@storybook/react"
import { useMemo, useState } from "react"
import { useEventCallback } from "usehooks-ts"

const meta: Meta<typeof ColorImagePaint> = {
  title: "Colors/ColorImagePaint",
  component: ColorImagePaint,
  tags: ["new"],
}

export default meta

type Story = StoryObj<typeof ColorImagePaint>

export const Basic: Story = {
  render: function BasicStory() {
    const [image, setImage] = useState<ImagePaint>({
      type: "IMAGE",
      scaleMode: "FILL",
      imageHash: null,
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
      imageTransform: undefined,
      rotation: 0,
      filters: {
        exposure: 0,
        contrast: 0,
        saturation: 0,
        temperature: 0,
        tint: 0,
      },
    })

    const filterStyle = useImageFilterStyle(image.filters)

    const imgStyle = useMemo(() => {
      const { width, height } = image.imageSizes.sourceSize
      const isLandscape = width > height

      return {
        transform: `rotate(${image.rotation || 0}deg)`,
        aspectRatio: width / height,
        width: isLandscape ? "100vw" : undefined,
        height: isLandscape ? undefined : "100vh",
      }
    }, [image.imageSizes.sourceSize, image.rotation])

    const handleImageChange = useEventCallback((newImage: ImagePaint) => {
      setImage((prev) => ({
        ...prev,
        ...newImage,
      }))
    })

    return (
      <>
        <div className="ignore pointer-events-none absolute inset-0 grid place-content-center">
          {image.imageHash && (
            <img
              src={image.imageSizes.raw}
              alt="Original"
              className="object-contain"
              style={{
                ...imgStyle,
                ...filterStyle,
              }}
            />
          )}
        </div>

        <div className="bg-default-background z-10 flex flex-col rounded-xl pb-4 shadow-lg">
          <ColorImagePaint
            image={image}
            onImageChange={handleImageChange}
            onImageChangeEnd={() => {
              console.log("change end")
            }}
            onImageChangeStart={() => {
              console.log("change start")
            }}
          />
        </div>
      </>
    )
  },
}
