import { tcx } from "@choice-ui/shared"
import { ToggleButton } from "@choice-ui/toggle-button"
import { CheckColorContrast } from "@choiceform/icons-react"
import { ColorPaintsType } from "../color-picker-popover/color-paints-type"
import { translation } from "../contents"
import type { PaintType, PaintTypeLabels, PickerFeatures } from "../types"

type Props = {
  className: string
  features: PickerFeatures
  labels?: PaintTypeLabels
  onPaintsTypeChange?: (type: PaintType) => void
  onShowColorContrast?: () => void
  paintsType: PaintType
  paintsTypeAvailable: boolean
  showColorContrast?: boolean
}

export const PaintTypeSelector = (props: Props) => {
  const {
    features,
    paintsTypeAvailable,
    className,
    paintsType,
    onPaintsTypeChange,
    showColorContrast = false,
    onShowColorContrast,
    labels,
  } = props

  if (!features.paintsType || !paintsTypeAvailable) return null
  return (
    <div className={tcx("flex flex-none items-center gap-1", className)}>
      <ColorPaintsType
        value={paintsType}
        onChange={onPaintsTypeChange}
        labels={{
          gradient: labels?.gradient ?? translation.type.GRADIENT,
          image: labels?.image ?? translation.type.IMAGE,
          pattern: labels?.pattern ?? translation.type.PATTERN,
          solid: labels?.solid ?? translation.type.SOLID,
        }}
        features={features}
      />

      {paintsType === "SOLID" && features.checkColorContrast && (
        <ToggleButton
          variant="highlight"
          tooltip={{
            content: labels?.colorContrast ?? translation.colorContrast.LABEL,
          }}
          value={showColorContrast}
          onChange={onShowColorContrast}
        >
          <CheckColorContrast />
        </ToggleButton>
      )}
    </div>
  )
}
