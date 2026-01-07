import { IndexKey } from "./base"
import { ValueOf } from "./util"
import { GradientPaint, ImagePaint, Paint, SolidPaint } from "./paint"

export type FillItem = BaseFillItem & Paint

export type BaseFillItem = {
  index: IndexKey
  isVariable?: boolean
}

export type SolidFillItem = BaseFillItem & SolidPaint

export type TextFillItem = SolidFillItem

export type GradientFillItem = BaseFillItem & GradientPaint

export type ImageFillItem = BaseFillItem & ImagePaint

export type FillItemKey = keyof FillItem
export type FillItemValue = ValueOf<FillItem>

export type FillType = Paint["type"]
