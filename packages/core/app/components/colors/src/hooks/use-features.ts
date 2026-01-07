import { useEffect, useMemo } from "react"
import { COLOR_SPACES } from "../contents"
import type { ChannelFieldFeature, ChannelFieldSpace, PickerFeatures } from "../types/colors"
import type { Paint } from "../types/paint"

interface UseChannelFieldFeaturesProps {
  colorSpace?: ChannelFieldSpace
  features: ChannelFieldFeature
  onAlphaChange?: (alpha: number) => void
  onChangeColorSpace?: (colorSpace: ChannelFieldSpace) => void
}

export const useChannelFieldFeatures = (props: UseChannelFieldFeaturesProps) => {
  const { features, colorSpace, onChangeColorSpace, onAlphaChange } = props

  const availableSpaces = useMemo(
    () =>
      [
        features.hex && COLOR_SPACES.HEX,
        features.rgb && COLOR_SPACES.RGB,
        features.hsl && COLOR_SPACES.HSL,
        features.hsb && COLOR_SPACES.HSB,
      ].filter(Boolean) as ChannelFieldSpace[],
    [features],
  )

  // 如果 alpha 被关闭，则自动设置为 1
  useEffect(() => {
    if (features.alpha === false) {
      onAlphaChange?.(1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [features.alpha])

  useEffect(() => {
    const currentSpaceEnabled = features[colorSpace?.toLowerCase() as keyof ChannelFieldFeature]
    if (!currentSpaceEnabled && availableSpaces.length > 0) {
      onChangeColorSpace?.(availableSpaces[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [features])

  const spacesAvailable = availableSpaces.length > 0

  return spacesAvailable
}

interface UseColorPickerFeaturesProps {
  features: PickerFeatures
  onChangePaintsType?: (paintsType: Paint["type"]) => void
  onChangePickerType?: (pickerType: string) => void
  paintsType?: Paint["type"]
  pickerType?: string
}

export const useColorPickerFeatures = (props: UseColorPickerFeaturesProps) => {
  const { features, paintsType, onChangePaintsType, pickerType, onChangePickerType } = props

  const availablePickerType = useMemo(() => {
    const types: string[] = []
    if (features.custom) {
      types.push("CUSTOM")
    }
    // 不再默认添加 LIBRARIES，由外部通过 additionalTabs 提供
    return types
  }, [features])

  const availablePaintsType = useMemo(() => {
    const types: Paint["type"][] = []

    if (features.solid) {
      types.push("SOLID")
    }

    if (features.gradient) {
      types.push("GRADIENT_LINEAR", "GRADIENT_RADIAL", "GRADIENT_ANGULAR")
    }

    if (features.image) {
      types.push("IMAGE")
    }

    if (features.pattern) {
      types.push("PATTERN")
    }

    return types
  }, [features])

  useEffect(() => {
    if (!paintsType || !availablePaintsType.length) return

    const isEnabled = paintsType.startsWith("GRADIENT")
      ? features.gradient
      : features[paintsType.toLowerCase() as keyof PickerFeatures]

    if (!isEnabled) {
      onChangePaintsType?.(availablePaintsType[0])
    }
  }, [features, paintsType, availablePaintsType, onChangePaintsType])

  useEffect(() => {
    if (!pickerType || !availablePickerType.length) return

    // 只检查 CUSTOM 类型，其他类型由外部管理
    if (pickerType === "CUSTOM" && !features.custom) {
      onChangePickerType?.(availablePickerType[0])
    }
  }, [features, pickerType, availablePickerType, onChangePickerType])

  const pickerTypeAvailable = availablePickerType.length > 0
  const paintsTypeAvailable = availablePaintsType.length > 0

  return { paintsTypeAvailable, pickerTypeAvailable }
}
