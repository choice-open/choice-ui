import { ReactNode } from "react"
import { match } from "ts-pattern"
import { TabItem } from "../color-picker-popover/color-picker-tabs"
import type { ColorContrast, PaintType, PaintTypeLabels, PickerFeatures } from "../types"
import { ColorPickerCustomContent } from "./color-picker-custom-content"
import { ColorPickerContentTV } from "./tv"

type Props = {
  additionalTabs?: TabItem[]
  checkColorContrast?: ColorContrast
  features: PickerFeatures
  gradientPaint?: ReactNode
  handlePaintsTypeChange?: (type: PaintType) => void
  imagePaint?: ReactNode
  labels?: PaintTypeLabels
  paintsType: PaintType
  paintsTypeAvailable: boolean
  pickerType: string
  solidPaint: ReactNode
}

export const ColorPickerContent = (props: Props) => {
  const {
    features,
    pickerType,
    paintsType,
    handlePaintsTypeChange,
    paintsTypeAvailable,
    checkColorContrast,
    additionalTabs = [],
    solidPaint,
    gradientPaint,
    imagePaint,
    labels,
  } = props

  const styles = ColorPickerContentTV()

  const renderNoAvailable = () => {
    return (
      <div
        className={styles.noAvailable()}
        style={{
          width: features.containerWidth,
        }}
      >
        No available picker type
      </div>
    )
  }

  // 查找当前选中的额外标签页
  const currentAdditionalTab = additionalTabs.find((tab) => tab.value === pickerType)

  return match(pickerType)
    .with("CUSTOM", () => {
      if (!features.custom) return renderNoAvailable()

      return (
        <ColorPickerCustomContent
          solidPaint={solidPaint}
          gradientPaint={gradientPaint}
          imagePaint={imagePaint}
          features={features}
          paintsType={paintsType}
          handlePaintsTypeChange={handlePaintsTypeChange}
          paintsTypeAvailable={paintsTypeAvailable}
          checkColorContrast={checkColorContrast}
          labels={labels}
        />
      )
    })
    .otherwise(() => {
      // 如果是额外标签页，渲染对应的内容
      if (currentAdditionalTab) {
        return currentAdditionalTab.content
      }

      return renderNoAvailable()
    })
}
