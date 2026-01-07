import {
  VariablesBoolean,
  VariablesEnum,
  VariablesNumber,
  VariablesString,
} from "@choiceform/icons-react"
import { ColorSwatch } from "../../color-swatch"
import type { RGB, Variable } from "../../types"
import { usePaletteColor } from "../hooks"
import { colorLibrariesItemTv } from "../tv"
import type { LibrariesDisplayType, LibrariesType } from "../../types"

interface VariableItemProps {
  displayType?: LibrariesDisplayType
  isDuplicate?: boolean
  isSelected?: boolean
  item: Variable
  libraryType?: LibrariesType
  onSwatchChange?: (value: { alpha: number; color: RGB }) => void
  paletteSize?: number
}

export const VariableColorItem = ({
  item,
  libraryType,
  displayType,
  onSwatchChange,
  paletteSize,
  isSelected,
  isDuplicate,
}: VariableItemProps) => {
  const { paletteColor, paletteStyle } = usePaletteColor({
    item,
    libraryType: "VARIABLE",
  })

  return (
    <ColorSwatch
      color={paletteColor.color}
      alpha={paletteColor.alpha}
      size={paletteSize}
      className={colorLibrariesItemTv({
        displayType,
        libraryType,
        isSelected,
        isDuplicate,
      }).palette()}
      style={paletteStyle}
      type="VARIABLE"
      onClick={
        onSwatchChange
          ? () => onSwatchChange({ color: paletteColor.color, alpha: paletteColor.alpha })
          : undefined
      }
    />
  )
}

export const VariableNumberItem = () => (
  <div className={colorLibrariesItemTv().itemIcon()}>
    <VariablesNumber />
  </div>
)

export const VariableBooleanItem = () => (
  <div className={colorLibrariesItemTv().itemIcon()}>
    <VariablesBoolean />
  </div>
)

export const VariableStringItem = () => (
  <div className={colorLibrariesItemTv().itemIcon()}>
    <VariablesString />
  </div>
)

export const VariableEnumItem = () => (
  <div className={colorLibrariesItemTv().itemIcon()}>
    <VariablesEnum />
  </div>
)
