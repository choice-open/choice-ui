import { BaseElement, BaseText, Editor } from "slate"
import { ReactEditor } from "slate-react"

export interface CustomText extends BaseText {
  bold?: boolean
  code?: boolean
  italic?: boolean
  link?: string
  strikethrough?: boolean
  underlined?: boolean
}

export interface CustomElement extends BaseElement {
  block_quote?: boolean
  bulleted_list?: boolean
  check_list?: boolean
  checked?: boolean
  code?: boolean
  h1?: boolean
  h2?: boolean
  h3?: boolean
  h4?: boolean
  h5?: boolean
  h6?: boolean
  link?: string
  list_item?: boolean
  numbered_list?: boolean
  paragraph?: boolean
  type: string
}

export type CustomEditor = ReactEditor & Editor

export type ElementType =
  | "paragraph"
  | "block_quote"
  | "code"
  | "check_list"
  | "bulleted_list"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "numbered_list"
  | "list_item"
  | "check_item"
  | "ref_user"
  | "mention"
  | "image"

export interface CustomElementWithType extends CustomElement {
  type: ElementType
}

// HTML element tag mappings from paste-html.tsx
export type ElementTags = {
  [tag: string]: (el: HTMLElement) => { [key: string]: unknown }
}

export type TextTags = {
  [tag: string]: (el: HTMLElement) => { [key: string]: unknown }
}
