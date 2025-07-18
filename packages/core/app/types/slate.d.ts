import { BaseElement } from "slate"

export type ParagraphElement = { children: any[], type: "paragraph"; }
declare module "slate" {
  interface CustomTypes {
    Element: ParagraphElement
  }
}
