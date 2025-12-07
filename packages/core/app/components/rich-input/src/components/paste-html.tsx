import { Transforms } from "slate"
import { jsx } from "slate-hyperscript"
import { ReactEditor } from "slate-react"
import type { CustomElement, CustomText, CustomEditor } from "../types"

const ELEMENT_TAGS: {
  [key: string]: (element: HTMLElement) => Omit<CustomElement, "children">
} = {
  BLOCKQUOTE: () => ({ type: "block_quote" }),
  H1: () => ({ type: "h1" }),
  H2: () => ({ type: "h2" }),
  H3: () => ({ type: "h3" }),
  H4: () => ({ type: "h4" }),
  H5: () => ({ type: "h5" }),
  H6: () => ({ type: "h6" }),
  IMG: (el) => ({ type: "image", url: el.getAttribute("src") }),
  LI: () => ({ type: "list_item" }),
  OL: () => ({ type: "numbered_list" }),
  P: () => ({ type: "paragraph" }),
  PRE: () => ({ type: "code" }),
  UL: () => ({ type: "bulleted_list" }),
}

const TEXT_TAGS: {
  [key: string]: (element: HTMLElement) => Omit<CustomText, "text">
} = {
  A: (el) => ({ link: el.getAttribute("href") ?? "" }),
  CODE: () => ({ code: true }),
  DEL: () => ({ strikethrough: true }),
  EM: () => ({ italic: true }),
  I: () => ({ italic: true }),
  S: () => ({ strikethrough: true }),
  STRONG: () => ({ bold: true }),
  U: () => ({ underlined: true }),
}

export const deserialize = (
  el: Node,
): CustomElement | CustomText | (CustomElement | CustomText)[] | null => {
  if (el.nodeType === 3) {
    const textContent = el.textContent ?? ""
    return { text: textContent } as CustomText
  } else if (el.nodeType !== 1) {
    return null
  } else if (el.nodeName === "BR") {
    return { text: "\n" } as CustomText
  }

  const { nodeName } = el
  let parent = el

  if (nodeName === "PRE" && el.childNodes[0] && el.childNodes[0].nodeName === "CODE") {
    parent = el.childNodes[0]
  }
  let children = Array.from(parent.childNodes).map(deserialize).flat()

  if (children.length === 0) {
    children = [{ text: "" } as CustomText]
  }

  if (el.nodeName === "BODY") {
    return jsx("fragment", {}, children) as (CustomElement | CustomText)[]
  }

  const attrsElementFunction = ELEMENT_TAGS[nodeName]
  if (attrsElementFunction) {
    const attrs = attrsElementFunction(el as HTMLElement)
    return jsx("element", attrs, children) as CustomElement
  }

  const attrsTextFunction = TEXT_TAGS[nodeName]
  if (attrsTextFunction) {
    const attrs = attrsTextFunction(el as HTMLElement)
    return children.map((child) => jsx("text", attrs, child)) as CustomText[]
  }

  return children.filter((child): child is CustomText | CustomElement => child !== null)
}

export const withHtml = (e: ReactEditor): CustomEditor => {
  const editor = e as CustomEditor
  const { insertData } = editor
  editor.insertData = (data: DataTransfer) => {
    const html = data.getData("text/html")
    if (html) {
      const parsed = new DOMParser().parseFromString(html, "text/html")
      const fragment = deserialize(parsed.body)
      if (fragment) {
        Transforms.insertFragment(
          editor,
          Array.isArray(fragment)
            ? (fragment as import("slate").Node[])
            : ([fragment] as import("slate").Node[]),
        )
      }
      return
    }
    insertData(data)
  }

  return editor
}
