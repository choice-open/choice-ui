import {
  EffectBackgroundBlur,
  EffectDropShadow,
  EffectInnerShadow,
  EffectLayerBlur,
} from "@choiceform/icons-react"
import { ColorSwatch } from "../../color-swatch"
import type { EffectItemType, EffectStyle, Style, TextStyle } from "../../types"
import { usePaletteColor } from "../hooks"
import { colorLibrariesItemTv } from "../tv"
import type { LibrariesDisplayType, LibrariesType } from "../../types"

interface StyleItemProps {
  displayType?: LibrariesDisplayType
  isDuplicate?: boolean
  isSelected?: boolean
  item: Style
  libraryType?: LibrariesType
  paletteSize?: number
  previewUrl?: string
}

export const StylePaintItem = ({
  item,
  libraryType,
  displayType,
  paletteSize,
  isSelected,
  isDuplicate,
}: StyleItemProps) => {
  const { paletteColor, paletteStyle } = usePaletteColor({
    item,
    libraryType: "STYLE",
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
      type="STYLE"
    />
  )
}

export const StyleTextItem = ({ item, previewUrl }: StyleItemProps) => {
  const textStyle = item as TextStyle

  return (
    <div className={colorLibrariesItemTv().itemIcon()}>
      {previewUrl && (
        <img
          className="dark:invert"
          src={previewUrl}
          alt="Preview"
          width={16}
          height={16}
        />
      )}
    </div>
  )
}

const EffectIcons: Record<EffectItemType, () => JSX.Element> = {
  BACKGROUND_BLUR: () => (
    <div className={colorLibrariesItemTv().itemIcon()}>
      <EffectBackgroundBlur />
    </div>
  ),
  FOREGROUND_BLUR: () => (
    <div className={colorLibrariesItemTv().itemIcon()}>
      <EffectLayerBlur />
    </div>
  ),
  DROP_SHADOW: () => (
    <div className={colorLibrariesItemTv().itemIcon()}>
      <EffectDropShadow />
    </div>
  ),
  INNER_SHADOW: () => (
    <div className={colorLibrariesItemTv().itemIcon()}>
      <EffectInnerShadow />
    </div>
  ),
}

interface StyleEffectItemProps extends StyleItemProps {
  item: EffectStyle
}

export const StyleEffectItem = ({ item }: StyleEffectItemProps) => {
  const effectType = item.effects[0]?.type as EffectItemType
  const EffectIcon = EffectIcons[effectType]
  return EffectIcon ? <EffectIcon /> : null
}
