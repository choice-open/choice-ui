import type { PopoverProps } from "@choice-ui/popover"
import { Popover } from "@choice-ui/popover"
import { Placement } from "@floating-ui/react"
import React, { ReactNode } from "react"
import { useEventCallback } from "usehooks-ts"
import { ColorPickerContent } from "../color-picker-content"
import { useColorPickerFeatures } from "../hooks"
import type { ColorContrast, ColorPickerLabels, Paint, PickerFeatures } from "../types"
import { TabItem } from "./color-picker-tabs"
import { ColorPickerTitle } from "./color-picker-title"

export interface ColorPickerPopoverProps extends Omit<PopoverProps, "content"> {
  additionalTabs?: TabItem[]
  autoUpdate?: boolean
  checkColorContrast?: ColorContrast
  className?: string
  features?: PickerFeatures
  gradientPaint?: ReactNode
  imagePaint?: ReactNode
  labels?: ColorPickerLabels
  onOpenChange?: (open: boolean) => void
  onPaintsTypeChange?: (type: Paint["type"]) => void
  onPickerTypeChange?: (type: string) => void
  open: boolean
  paintsType?: Paint["type"]
  pickerType?: string
  placement?: Placement
  solidPaint: ReactNode
  title?: string
  triggerRef?: React.RefObject<HTMLDivElement | HTMLFieldSetElement>
}

export const ColorPickerPopover = function ColorPickerPopover(props: ColorPickerPopoverProps) {
  const {
    // Base props
    className,
    title,

    // Popover control
    triggerRef,
    open,
    onOpenChange,
    placement = "bottom-start",
    autoUpdate = false,

    // Picker type control
    pickerType = "CUSTOM",
    onPickerTypeChange,

    // Paint type control
    paintsType = "SOLID",
    onPaintsTypeChange,

    // Check color contrast control
    checkColorContrast,

    // 动态标签页
    additionalTabs = [],

    // Features configuration
    features: userFeatures = {},

    labels,

    solidPaint,
    gradientPaint,
    imagePaint,

    children,
    ...rest
  } = props

  const features: PickerFeatures = {
    containerWidth: 240,
    spaceDropdown: true,
    alpha: true,
    hex: true,
    rgb: true,
    hsl: true,
    hsb: true,
    nativePicker: true,
    presets: true,
    pickerType: true,
    custom: true,
    paintsType: true,
    solid: true,
    gradient: true,
    pattern: false,
    image: true,
    checkColorContrast: false,
    ...userFeatures,
  }

  const handlePickerTypeChange = useEventCallback((type: string) => {
    onPickerTypeChange?.(type)
  })

  const handlePaintsTypeChange = useEventCallback((type: Paint["type"]) => {
    onPaintsTypeChange?.(type)
  })

  const { paintsTypeAvailable, pickerTypeAvailable } = useColorPickerFeatures({
    features,
    paintsType,
    onChangePaintsType: handlePaintsTypeChange,
    pickerType,
    onChangePickerType: handlePickerTypeChange,
  })

  return (
    <Popover
      {...rest}
      draggable={true}
      triggerRef={triggerRef}
      open={open}
      onOpenChange={onOpenChange}
      placement={placement}
      autoUpdate={autoUpdate}
    >
      {children}

      <Popover.Header>
        <ColorPickerTitle
          title={title}
          features={features}
          pickerTypeAvailable={pickerTypeAvailable}
          pickerType={pickerType}
          onChangePickerType={handlePickerTypeChange}
          labels={labels}
          additionalTabs={additionalTabs}
        />
      </Popover.Header>

      <Popover.Content>
        <ColorPickerContent
          features={features}
          pickerType={pickerType}
          paintsType={paintsType}
          paintsTypeAvailable={paintsTypeAvailable}
          handlePaintsTypeChange={handlePaintsTypeChange}
          checkColorContrast={checkColorContrast}
          additionalTabs={additionalTabs}
          solidPaint={solidPaint}
          gradientPaint={gradientPaint}
          imagePaint={imagePaint}
          labels={labels}
        />
      </Popover.Content>
    </Popover>
  )
}
