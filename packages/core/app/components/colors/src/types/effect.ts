import { IndexKey } from "./base"
import { RGBA } from "./colors"
import { ValueOf } from "./util"

export type EffectItemType = "BACKGROUND_BLUR" | "FOREGROUND_BLUR" | "DROP_SHADOW" | "INNER_SHADOW"

export type EffectItem = {
  color: RGBA
  index: IndexKey
  offset: {
    x: number
    y: number
  }
  radius: number
  spread: number
  type: EffectItemType
  // blur
  visible: boolean
}

export type EffectItemKey = keyof EffectItem
export type EffectItemValue = ValueOf<EffectItem>
