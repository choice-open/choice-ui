import { Button } from "@choice-ui/button"
import { Range } from "@choice-ui/range"
import { useMergedValue } from "@choice-ui/shared"
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useEventCallback } from "usehooks-ts"
import { useImageProcessor } from "../hooks"
import type { ImageFilters, ImagePaint, ImagePaintFeature, ImageSizes } from "../types"
import { getColorSwatchBackground } from "../utils"
import { ColorImageToolbar } from "./color-image-toolbar"
import { ColorImagePaintTv } from "./tv"

export interface ColorImagePaintProps {
  className?: string
  features?: ImagePaintFeature
  image?: ImagePaint
  imageSrc?: string
  onChooseImage?: () => void
  onImageChange?: (image: ImagePaint) => void
  onImageChangeEnd?: () => void
  onImageChangeStart?: () => void
}

/**
 * 创建默认的图片尺寸对象
 * @param baseUrl 基础URL或为空字符串
 */
const createDefaultSizes = (baseUrl: string | null = null): ImageSizes => ({
  thumb: baseUrl || "",
  small: baseUrl || "",
  regular: baseUrl || "",
  raw: baseUrl || "",
  sourceSize: {
    width: 0,
    height: 0,
  },
})

/**
 * 创建图片变更对象，确保所有必需字段存在
 */
const createImageChangeObject = (
  baseImage: ImagePaint | undefined,
  overrides: Partial<ImagePaint>,
): ImagePaint => {
  return {
    type: "IMAGE",
    scaleMode: baseImage?.scaleMode ?? "FILL",
    imageHash: baseImage?.imageHash ?? null,
    imageSizes: baseImage?.imageSizes ?? createDefaultSizes(baseImage?.imageHash),
    imageTransform: baseImage?.imageTransform,
    scalingFactor: baseImage?.scalingFactor,
    rotation: baseImage?.rotation ?? 0,
    visible: baseImage?.visible ?? true,
    opacity: baseImage?.opacity ?? 1,
    filters: baseImage?.filters,
    ...overrides,
  }
}

export const ColorImagePaint = memo(function ColorImagePaint(props: ColorImagePaintProps) {
  const {
    image,
    imageSrc: initialImageSrc,
    onImageChange,
    onChooseImage,
    className,
    features: userFeatures = {},
    onImageChangeEnd,
    onImageChangeStart,
  } = props

  // 状态管理
  const [imageSrc, setImageSrc] = useState<string | undefined>(
    image?.imageSizes?.small ?? initialImageSrc ?? undefined,
  )
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 特性和样式设置
  const features = useMemo(
    () => ({
      containerWidth: 240,
      labels: {
        exposure: "Exposure",
        contrast: "Contrast",
        saturation: "Saturation",
        temperature: "Temperature",
        tint: "Tint",
        highlights: "Highlights",
        shadows: "Shadows",
        upload: "Upload from computer",
        fill: "Fill",
        fit: "Fit",
        crop: "Crop",
        tile: "Tile",
        rotate: "Rotate 90°",
        processing: "Processing...",
      },
      ...userFeatures,
    }),
    [userFeatures],
  )

  const containerWidth = features?.containerWidth ?? 240
  const styles = ColorImagePaintTv({ hasImage: !!imageSrc })

  const checkerboard = useMemo(
    () => getColorSwatchBackground((containerWidth - 32) / 15, 1),
    [containerWidth],
  )

  // 图片处理相关
  const { processImage, isProcessing } = useImageProcessor()
  const isLoading = isUploading || isProcessing

  // 同步外部图片的small尺寸
  useEffect(() => {
    if (image?.imageSizes?.small) {
      setImageSrc(image.imageSizes.small)
    }
  }, [image?.imageSizes?.small])

  // 处理滤镜变化
  const [filters, setFilters] = useMergedValue<ImageFilters>({
    defaultValue: {
      exposure: 0,
      contrast: 0,
      saturation: 0,
      temperature: 0,
      tint: 0,
      highlights: 0,
      shadows: 0,
    },
    value: image?.filters,
    onChange: (filters) => {
      if (onImageChange) {
        onImageChange(createImageChangeObject(image, { filters }))
      }
    },
  })

  // 处理文件选择
  const handleFileChange = useEventCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChooseImage) return

    const file = event.target.files?.[0]
    if (!file || !onImageChange) return

    setIsUploading(true)

    processImage(file)
      .then((urls) => {
        // 使用small尺寸的图片用于组件内显示
        setImageSrc(urls.small)

        // 将多尺寸图片数据存储到imageHash
        onImageChange(
          createImageChangeObject(image, {
            imageHash: urls.small,
            imageSizes: urls,
          }),
        )
      })
      .catch((error) => {
        console.error("图片处理失败", error)
      })
      .finally(() => {
        setIsUploading(false)
      })
  })

  // 处理按钮点击
  const handleUploadClick = useEventCallback(() => {
    if (onChooseImage) {
      // 如果提供了外部处理函数，则调用它
      onChooseImage()
    } else {
      // 否则触发文件选择框
      fileInputRef.current?.click()
    }
  })

  // 处理缩放模式变更
  const handleScaleModeChange = useCallback(
    (scaleMode: ImagePaint["scaleMode"]) => {
      console.log("scale mode change", scaleMode)
      if (onImageChange) {
        onImageChange(createImageChangeObject(image, { scaleMode }))
      }
    },
    [image, onImageChange],
  )

  // 处理旋转
  const handleRotate = useCallback(() => {
    if (onImageChange) {
      const currentRotation = image?.rotation ?? 0
      onImageChange(
        createImageChangeObject(image, {
          rotation: currentRotation + 90,
        }),
      )
    }
  }, [image, onImageChange])

  // 渲染主容器 —— 注意:不再在 <img> 上套 CSS filter。CSS filter() 的
  // 数学(brightness/contrast/saturate/hue-rotate/sepia)跟下游消费者
  // (Lovision engine WGSL shader)在 temperature/tint/highlights/shadows
  // 等维度上发散到不可接受,所以预览由消费者通过 `imageSrc` 传入(典型
  // 做法:processor 端 readback adjusted texture → blob URL)。如果消费
  // 者只想要快速 CSS 预览,可以仍调用 `useImageFilterStyle(filters)` 自
  // 行套样式(该 hook 仍然导出,deprecated 但可用)。
  return (
    <div
      className={styles.root({ className })}
      style={{ width: containerWidth }}
    >
      <ColorImageToolbar
        features={features}
        scaleMode={image?.scaleMode}
        onScaleModeChange={handleScaleModeChange}
        onRotate={handleRotate}
      />

      <div
        className={styles.container()}
        style={{ background: checkerboard }}
      >
        {imageSrc && (
          <div className={styles.imgContainer()}>
            <img
              className={styles.image()}
              src={imageSrc}
              alt="Uploaded image"
            />
          </div>
        )}
        <div className={styles.buttonContainer()}>
          <Button
            className={styles.button()}
            onClick={handleUploadClick}
            disabled={isLoading}
          >
            {isLoading ? features?.labels?.processing : features?.labels?.upload}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className={styles.adjustContainer()}>
        {(
          [
            "exposure",
            "contrast",
            "saturation",
            "temperature",
            "tint",
            "highlights",
            "shadows",
          ] as const
        ).map((filterName) => (
          <React.Fragment key={filterName}>
            <span className={styles.adjustLabel()}>
              {features?.labels?.[filterName as keyof typeof features.labels]}
            </span>

            <Range
              min={-100}
              max={100}
              defaultValue={0}
              width={128}
              value={filters[filterName] ?? 0}
              onChange={(value) =>
                setFilters({
                  ...filters,
                  [filterName]: value,
                })
              }
              onChangeEnd={onImageChangeEnd}
              onChangeStart={onImageChangeStart}
              disabled={isLoading || !imageSrc}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  )
})
