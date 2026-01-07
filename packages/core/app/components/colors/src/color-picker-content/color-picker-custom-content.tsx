import { cloneElement, isValidElement, ReactElement, ReactNode } from "react"
import { match } from "ts-pattern"
import { translation } from "../contents"
import type { ColorContrast, PaintType, PaintTypeLabels, PickerFeatures } from "../types"
import { PaintTypeSelector } from "./paint-type-selector"
import { ColorPickerContentTV } from "./tv"

type Props = {
  checkColorContrast?: ColorContrast
  features: PickerFeatures
  gradientPaint?: ReactNode
  handlePaintsTypeChange?: (type: PaintType) => void
  imagePaint?: ReactNode
  labels?: PaintTypeLabels
  paintsType: PaintType
  paintsTypeAvailable: boolean
  patternPaint?: ReactNode
  solidPaint: ReactNode
}

// Helper to inject checkColorContrast into a ReactElement if it doesn't already have one
const injectCheckColorContrast = (
  element: ReactNode,
  checkColorContrast?: ColorContrast,
): ReactNode => {
  if (!checkColorContrast || !isValidElement(element)) {
    return element
  }

  const elementProps = element.props as { checkColorContrast?: ColorContrast }

  // Only inject if the element doesn't already have checkColorContrast prop
  if (elementProps.checkColorContrast) {
    return element
  }

  return cloneElement(element as ReactElement, { checkColorContrast })
}

export const ColorPickerCustomContent = (props: Props) => {
  const {
    features,
    paintsTypeAvailable,
    paintsType,
    handlePaintsTypeChange,
    checkColorContrast,
    solidPaint,
    gradientPaint,
    imagePaint,
    labels = {},
  } = props

  const styles = ColorPickerContentTV()

  // 渲染无可用类型提示
  const renderNoAvailable = () => {
    return (
      <div
        className={styles.noAvailable()}
        style={{
          width: features.containerWidth,
        }}
      >
        {translation.colorPicker.NO_AVAILABLE}
      </div>
    )
  }

  return (
    <>
      <PaintTypeSelector
        features={features}
        paintsTypeAvailable={paintsTypeAvailable}
        className={styles.paintsType()}
        paintsType={paintsType}
        onPaintsTypeChange={handlePaintsTypeChange}
        showColorContrast={checkColorContrast?.showColorContrast}
        onShowColorContrast={checkColorContrast?.handleShowColorContrast}
        labels={labels}
      />

      {match(paintsType)
        .with("SOLID", () => {
          if (!features.solid) return null

          return injectCheckColorContrast(solidPaint, checkColorContrast)
        })
        .when(
          (t) => ["GRADIENT_ANGULAR", "GRADIENT_LINEAR", "GRADIENT_RADIAL"].includes(t),
          () => {
            if (!features.gradient || !gradientPaint) return renderNoAvailable()
            return gradientPaint
          },
        )
        .with("PATTERN", () => renderNoAvailable())
        .with("IMAGE", () => {
          if (!imagePaint) return renderNoAvailable()
          return imagePaint
        })
        .otherwise(() => {
          return renderNoAvailable()
        })}
    </>
  )
}
