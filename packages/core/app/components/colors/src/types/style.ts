import { IndexKey } from "./base"
import { EffectItem } from "./effect"
import { FillItem } from "./fill"
import { FontName, LetterSpacing, LineHeight, TextCase } from "./fonts"

import { ValueOf } from "./util"

export type StyleId = string

export type BaseStyleCommon = {
  consumers: string[]
  createdAt: number
  description?: string
  fileId: string

  id: StyleId
  index: IndexKey

  name?: string
  updatedAt: number | null
}

export type BasePendingStyleCommon = {
  description?: string
  id: string
  isPending: true
  name?: string
}

export type BasePaintStyle = {
  fills: FillItem[]
  type: "PAINT"
}

export type PaintStyle = BaseStyleCommon & BasePaintStyle

export type PendingPaintStyle = BasePaintStyle & BasePendingStyleCommon

export type BaseTextStyle = {
  fontName: FontName
  fontSize: number
  letterSpacing: LetterSpacing
  lineHeight: LineHeight
  paragraphSpacing: number
  textCase: TextCase
  textDecoration: string
  type: "TEXT"
}

export type TextStyle = BaseTextStyle & BaseStyleCommon

export type PendingTextStyle = BaseTextStyle & BasePendingStyleCommon

export type BaseEffectStyle = {
  effects: EffectItem[]
  type: "EFFECT"
}

export type EffectStyle = BaseEffectStyle & BaseStyleCommon

export type PendingEffectStyle = BaseEffectStyle & BasePendingStyleCommon

export type BasePendingStyle = PendingPaintStyle | PendingTextStyle | PendingEffectStyle

export type StyleType = "TEXT" | "PAINT" | "EFFECT"

export type TextStyleKey = keyof BaseTextStyle
export type TextStyleValue = ValueOf<BaseTextStyle>

export type Style = PaintStyle | TextStyle | EffectStyle
