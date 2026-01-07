import { tcx } from "@choice-ui/shared"
import { forwardRef, memo } from "react"
import { useEventCallback } from "usehooks-ts"
import { translation } from "../contents"
import type { FillItemLabels, ImagePaint } from "../types/paint"
import { AlphaInput } from "./alpha-input"
import { fillInputTv } from "./tv"

export interface ImageItemProps {
  active?: boolean
  alpha?: number
  className?: string
  classNames?: {
    alpha?: string
    container?: string
    content?: string
    wrapper?: string
  }
  disabled?: boolean
  features?: {
    alpha?: boolean
  }
  image?: ImagePaint
  imageUrl?: string
  label?: string
  labels: FillItemLabels
  onAlphaChange?: (alpha: number) => void
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
  onPickerClick?: () => void
  selected?: boolean
}

const ImagePreview = memo(function ImagePreview(props: { image: ImagePaint["imageHash"] }) {
  const { image } = props

  return (
    <div className="bg-default-background shadow-line flex size-3.5 flex-none items-center justify-center overflow-hidden rounded-sm">
      {image && (
        <img
          className="h-full w-full object-contain"
          src={image}
          alt=""
        />
      )}
    </div>
  )
})

export const ImageItem = forwardRef<HTMLDivElement, ImageItemProps>(function ImageItem(props, ref) {
  const {
    className,
    classNames,
    alpha,
    labels,
    image,
    imageUrl,
    active,
    disabled,
    selected,
    onAlphaChange,
    onClick,
    onPickerClick,
    label,
    features = {
      alpha: true,
    },
  } = props

  const handleContainerClick = useEventCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    onClick?.(e)
  })

  const handleWrapperMouseDown = useEventCallback(() => {
    onPickerClick?.()
  })

  const styles = fillInputTv({
    type: "IMAGE",
    alpha: features.alpha,
    selected,
    active,
    disabled,
    empty: !image,
  })

  return (
    <div
      ref={ref}
      className={tcx(styles.root(), classNames?.container, className)}
      onClick={handleContainerClick}
    >
      <div
        className={tcx(styles.wrapper(), classNames?.wrapper)}
        onMouseDown={handleWrapperMouseDown}
      >
        <ImagePreview image={imageUrl ?? null} />

        <div className={tcx(styles.content(), classNames?.content)}>
          <span className={styles.label()}>{label}</span>
        </div>
      </div>

      {features.alpha && (
        <AlphaInput
          value={alpha}
          onChange={onAlphaChange}
          disabled={disabled}
          active={active}
          className={tcx(styles.alpha(), classNames?.alpha)}
          tooltipLabel={labels?.alpha ?? translation.input.ALPHA}
        />
      )}
    </div>
  )
})

ImageItem.displayName = "ImageItem"
