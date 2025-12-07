import { BaseEditor, BaseElement, BaseText, Descendant, Path } from "slate"
import { HistoryEditor } from "slate-history"
import { ReactEditor, RenderElementProps } from "slate-react"
import { User } from "../types"

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

export interface ExtendedRenderElement extends RenderElementProps {
  handleRemoveImage?: (path: Path, attachmentIndex?: number) => void
  editor: ReactEditor
}

export interface ParagraphElement extends BaseElement {
  type: "paragraph"
  children: CustomText[]
}

export interface StructuredData {
  text: string
  mentions: Array<{ id: string; name: string }>
  attachments: Array<Attachment>
  raw: Descendant[]
}

export interface MentionElement extends BaseElement {
  type: "mention"
  user: User
  children: CustomText[]
}

export interface Attachment {
  url: string
  name?: string
  type?: string
  width?: number
  height?: number
}

export interface ImageElement extends BaseElement {
  type: "image"
  attachments: Attachment[]
  children: CustomText[]
}

export interface ListItemElement extends BaseElement {
  type: "list-item"
  children: CustomText[]
}

export interface NumberedListElement extends BaseElement {
  type: "numbered-list"
  children: CustomElement[]
}

export interface BulletedListElement extends BaseElement {
  type: "bulleted-list"
  children: CustomElement[]
}

export type CustomElement =
  | ParagraphElement
  | MentionElement
  | ImageElement
  | ListItemElement
  | NumberedListElement
  | BulletedListElement

export interface CustomText extends BaseText {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
  emoji?: boolean
}

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText
  }
}
