import { translation } from "../contents"
import type { PickerFeatures } from "../types/colors"
import type { ColorPickerLabels } from "../types/paint"
import { ColorPickerTabs, TabItem } from "./color-picker-tabs"

type Props = {
  additionalTabs?: TabItem[]
  features: PickerFeatures
  labels?: Pick<ColorPickerLabels, "custom">
  onChangePickerType?: (pickerType: string) => void
  pickerType: string
  pickerTypeAvailable: boolean
  title?: string
}

export const ColorPickerTitle = (props: Props) => {
  const {
    title,
    features,
    labels,
    pickerTypeAvailable,
    pickerType,
    onChangePickerType,
    additionalTabs = [],
  } = props

  if (title) return title

  if (features.pickerType && pickerTypeAvailable) {
    return (
      <ColorPickerTabs
        pickerType={pickerType}
        onPickerTypeChange={onChangePickerType}
        customTabLabel={labels?.custom}
        additionalTabs={additionalTabs}
      />
    )
  }

  return (
    <div className="text-body-medium font-strong ml-2 flex items-center gap-2 p-2">
      {labels?.custom ?? translation.colorPicker.TITLE}
    </div>
  )
}
