import { Editor, Element as SlateElement, Transforms } from "slate"
import { CustomElement, CustomText } from "../types"

export const LIST_TYPES = ["numbered_list", "bulleted_list"]
export const CHECK_TYPES = ["check_list"]

export const toggleMark = (editor: Editor, format: keyof CustomText) => {
  if (!editor || !editor.selection) return

  const isActive = isMarkActive(editor, format)
  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

export const isMarkActive = (editor: Editor, format: keyof CustomText) => {
  if (!editor || !editor.selection) return false
  const marks = Editor.marks(editor) as CustomText
  return marks ? marks[format] === true : false
}

export const toggleBlock = (editor: Editor, format: keyof CustomElement) => {
  const isActive = isBlockActive(editor, format)
  const isList = LIST_TYPES.includes(format)
  const isCheck = CHECK_TYPES.includes(format)

  // 取消激活当前块类型
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      (LIST_TYPES.includes((n as CustomElement).type) ||
        CHECK_TYPES.includes((n as CustomElement).type)),
    split: true,
  })

  let blockProperties: Partial<CustomElement>
  // 切换块类型或者更改为段落
  if (!isActive) {
    if (isList) {
      blockProperties = { type: "list_item" }
    } else if (isCheck) {
      blockProperties = { type: "check_item" }
    } else {
      blockProperties = { type: format }
    }
  } else {
    blockProperties = { type: "paragraph" }
  }

  // 设置选中元素的新类型
  Transforms.setNodes(editor, blockProperties)

  // 如果不是激活状态且是列表类型，默认包裹一个对应的列表块元素
  if (!isActive && (isList || isCheck)) {
    const block = {
      type: isCheck ? "check_list" : format,
      children: [],
    }
    Transforms.wrapNodes(editor, block as import("slate").Element)
  }
}

export const isBlockActive = (
  editor: Editor,
  format: keyof CustomElement,
  blockType: keyof CustomElement = "type",
) => {
  if (!editor) return false
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        (n as CustomElement)[blockType] === format,
    }),
  )

  return !!match
}
