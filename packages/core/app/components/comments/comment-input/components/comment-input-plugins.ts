import { Editor, Point, Range, Transforms } from "slate"
import { ReactEditor } from "slate-react"
import type { User } from "../../types"
import type { CustomEditor, CustomElement, CustomText, MentionElement } from "../types"
import { isImageElement, isMentionElement } from "../utils"

export const withImages = (editor: ReactEditor) => {
  const { isVoid, isInline, insertData, deleteBackward, deleteForward } = editor

  // 标记图片为void元素
  editor.isVoid = (element) => {
    return isImageElement(element) || isVoid(element)
  }

  // 确保图片是块级元素而非内联元素
  editor.isInline = (element) => {
    return isImageElement(element) ? false : isInline(element)
  }

  // 处理拖拽和粘贴操作
  editor.insertData = (data) => {
    const { files } = data

    // 处理文件拖拽上传
    if (files && files.length > 0) {
      // 这部分逻辑由handleImageUpload处理，不在这里实现
      insertData(data)
      return
    }

    // 检查如果是HTML包含图片的粘贴，则交给html处理插件
    const html = data.getData("text/html")
    if (html && html.includes("<img")) {
      insertData(data)
      return
    }

    // 其他情况正常处理
    insertData(data)
  }

  // 防止图片被拖拽，保护图片不被误删
  editor.deleteBackward = (unit) => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      // 使用类型断言避免类型错误
      const nodeEntries = Array.from(
        Editor.nodes(editor as unknown as CustomEditor, {
          match: (n) => isImageElement(n),
          at: selection,
        }),
      )

      if (nodeEntries.length > 0) {
        // 如果光标在图片内，阻止常规的删除操作
        return
      }

      // 检查前一个节点是否是图片
      try {
        const prev = Editor.previous(editor as unknown as CustomEditor)
        if (prev && prev[0] && isImageElement(prev[0])) {
          // 如果前一个节点是图片，删除整个图片节点
          Transforms.removeNodes(editor as unknown as CustomEditor, { at: prev[1] })
          return
        }
      } catch (error) {
        console.error("Error checking previous node:", error)
      }
    }

    // 默认删除行为
    deleteBackward(unit)
  }

  // 防止图片被拖拽，保护图片不被误删
  editor.deleteForward = (unit) => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      // 使用类型断言避免类型错误
      const nodeEntries = Array.from(
        Editor.nodes(editor as unknown as CustomEditor, {
          match: (n) => isImageElement(n),
          at: selection,
        }),
      )

      if (nodeEntries.length > 0) {
        // 如果光标在图片内，阻止常规的删除操作
        return
      }

      // 检查下一个节点是否是图片
      try {
        const next = Editor.next(editor as unknown as CustomEditor)
        if (next && next[0] && isImageElement(next[0])) {
          // 如果下一个节点是图片，删除整个图片节点
          Transforms.removeNodes(editor as unknown as CustomEditor, { at: next[1] })
          return
        }
      } catch (error) {
        console.error("Error checking next node:", error)
      }
    }

    // 默认删除行为
    deleteForward(unit)
  }

  return editor
}

export const withMentions = (editor: ReactEditor) => {
  const { isInline, isVoid, markableVoid, deleteBackward, deleteForward } = editor

  editor.isInline = (element: CustomElement) => {
    return element.type === "mention" ? true : isInline(element)
  }

  editor.isVoid = (element: CustomElement) => {
    return element.type === "mention" ? true : isVoid(element)
  }

  editor.markableVoid = (element: CustomElement) => {
    return element.type === "mention" || markableVoid(element)
  }

  // 增强删除功能，防止删除mention导致的问题
  editor.deleteBackward = (unit) => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      try {
        // 检查前一个节点是否是提及
        const customEditor = editor as unknown as CustomEditor
        const [prev, prevPath] = Editor.previous(customEditor) || [null, null]

        if (prev && isMentionElement(prev)) {
          // 删除提及节点
          Transforms.removeNodes(customEditor, { at: prevPath })
          return
        }
      } catch (error) {
        console.warn("Error in deleteBackward with mention:", error)
        // 失败后，回退到默认处理
      }
    }

    // 默认删除行为
    deleteBackward(unit)
  }

  // 增强前向删除功能
  editor.deleteForward = (unit) => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      try {
        // 检查下一个节点是否是提及
        const customEditor = editor as unknown as CustomEditor
        const [next, nextPath] = Editor.next(customEditor) || [null, null]

        if (next && isMentionElement(next)) {
          // 删除提及节点
          Transforms.removeNodes(customEditor, { at: nextPath })
          return
        }
      } catch (error) {
        console.warn("Error in deleteForward with mention:", error)
        // 失败后，回退到默认处理
      }
    }

    // 默认删除行为
    deleteForward(unit)
  }

  return editor
}

// 在当前选择位置插入一个提及
export const insertMention = (editor: CustomEditor, user: User) => {
  try {
    // 首先删除@text模式
    Transforms.delete(editor)

    // 创建一个提及节点
    const mention: MentionElement = {
      type: "mention",
      user,
      children: [{ text: "" }],
    }

    // 插入提及节点
    Transforms.insertNodes(editor, mention)

    // 移动光标到提及节点后
    Transforms.move(editor)

    // 在提及节点后插入一个空格（如果不在块的末尾）
    try {
      const { selection } = editor
      if (selection) {
        const [node, path] = Editor.node(editor, selection)
        // 检查是否在块的末尾
        const isAtBlockEnd = Point.equals(selection.anchor, Editor.end(editor, path))

        // 如果不在块的末尾，添加一个空格
        if (!isAtBlockEnd) {
          Transforms.insertText(editor, " ")
        }
      }
    } catch (error) {
      // 回退 - 只添加一个空格
      try {
        Transforms.insertText(editor, " ")
      } catch (innerError) {
        console.warn("Failed to insert space after mention:", innerError)
      }
    }
  } catch (error) {
    console.error("Error inserting mention:", error)

    // 恢复编辑器状态 - 确保光标在有效位置
    try {
      // 尝试将光标放在第一个段落
      const [firstNode] = Editor.first(editor, [])
      if (firstNode) {
        Transforms.select(editor, Editor.start(editor, [0]))
      }
    } catch (recoveryError) {
      console.warn("Failed to recover editor state:", recoveryError)
    }
  }
}

// 定义HTML粘贴处理插件
export const withHtml = (editor: ReactEditor) => {
  const { insertData } = editor

  editor.insertData = (data) => {
    const html = data.getData("text/html")

    if (html) {
      const parsed = new DOMParser().parseFromString(html, "text/html")
      const fragment = deserializeHtml(parsed.body)
      Transforms.insertFragment(editor as unknown as CustomEditor, fragment)
      return
    }

    insertData(data)
  }

  return editor
}

// HTML反序列化函数 - 将HTML转换为Slate节点
const deserializeHtml = (el: HTMLElement): (CustomElement | CustomText)[] => {
  // 如果节点是文本节点，直接返回文本内容
  if (el.nodeType === 3) {
    return [{ text: el.textContent ?? "" }]
  }

  // 如果节点不是元素节点，返回空数组
  if (el.nodeType !== 1) {
    return []
  }

  // 处理元素节点
  const children = Array.from(el.childNodes).flatMap((node) => deserializeHtml(node as HTMLElement))

  // 如果没有子节点，确保返回一个有效的空文本节点
  if (children.length === 0) {
    children.push({ text: "" })
  }

  // 解析文本节点的样式属性
  if (el.nodeName === "BODY") {
    return children
  }

  // 文本样式映射
  if (el.nodeName === "B" || el.nodeName === "STRONG") {
    return children.map((child) => ({ ...child, bold: true })) as CustomText[]
  }

  if (el.nodeName === "I" || el.nodeName === "EM") {
    return children.map((child) => ({ ...child, italic: true })) as CustomText[]
  }

  if (el.nodeName === "U") {
    return children.map((child) => ({ ...child, underline: true })) as CustomText[]
  }

  // 块级元素映射
  switch (el.nodeName) {
    case "P":
      return [{ type: "paragraph", children }] as CustomElement[]
    case "LI":
      return [{ type: "list-item", children }] as CustomElement[]
    case "OL":
      return [{ type: "numbered-list", children }] as CustomElement[]
    case "UL":
      return [{ type: "bulleted-list", children }] as CustomElement[]
    case "DIV":
    case "SPAN":
      return children
    default:
      // 对于不支持的元素，转换为段落
      return [{ type: "paragraph", children }] as CustomElement[]
  }
}
