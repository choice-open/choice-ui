import { BaseElement } from "slate"

export type ParagraphElement = { type: "paragraph"; children: any[] }
declare module "slate" {
  interface CustomTypes {
    Element: ParagraphElement
  }
}
