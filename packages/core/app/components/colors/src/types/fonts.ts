import { IndexKey } from "./base"
import { TextFillItem } from "./fill"

// 段落
export type TextContent = Array<TextContentItem>

// 行
export type TextContentItem = {
  align?: LineAlignment
  children?: Array<TextElement>
  index: IndexKey
  lineHeight?: LineHeight
  paragraphSpacing?: number
  type?: TextType
}

// 节点
export type TextElement = {
  fill?: TextFillItem
  fontName?: FontName
  fontSize?: number
  index: IndexKey
  letterSpacing?: LetterSpacing
  text: string
  textCase?: TextCase
  textDecoration?: string
}

export type TextType = string

export type LineAlignment = string

export type TextCase = string

export type FontName = {
  family: string
  style: string
}

export type LineHeight = {
  number: number
  unit: LineHeightUnitType
}

export type LetterSpacing = {
  number: number
  unit: LetterSpacingUnitType
}

export type LineHeightUnitType = "px" | "%" | "em"

export type LetterSpacingUnitType = "px" | "em"
