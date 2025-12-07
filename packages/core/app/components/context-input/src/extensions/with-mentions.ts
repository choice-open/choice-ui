import { Editor, Element as SlateElement, Transforms, Range } from "slate"
import { convertTextToSlate } from "../utils/slate-converters"

// 创建带有 mentions 支持的编辑器
export const withMentions = (editor: Editor) => {
  const { isInline, isVoid, insertData } = editor

  editor.isInline = (element: SlateElement) => {
    return (element as unknown as { type: string }).type === "mention" ? true : isInline(element)
  }

  editor.isVoid = (element: SlateElement) => {
    return (element as unknown as { type: string }).type === "mention" ? true : isVoid(element)
  }

  // 重写 insertData 来处理 paste 事件
  editor.insertData = (data: DataTransfer) => {
    const text = data.getData("text/plain")

    // 检查是否包含 mention 格式
    const mentionRegex = /\{\{#([^}]+?)(?:\.text)?#\}\}/

    if (text && mentionRegex.test(text)) {
      // 解析文本为 Slate 节点
      const nodes = convertTextToSlate(text)

      // 删除当前选区（如果有选择的话）
      if (editor.selection && Range.isExpanded(editor.selection)) {
        Transforms.delete(editor)
      }

      // 插入解析后的节点
      if (nodes.length === 1) {
        // 如果只有一个段落，插入其子节点
        const paragraph = nodes[0] as unknown as { children: unknown[]; type: string }
        if (paragraph.type === "paragraph" && paragraph.children) {
          // 逐个插入子节点（文本和mention）
          for (const child of paragraph.children) {
            const childNode = child as unknown as { text?: string; type?: string }

            if (childNode.type === "mention") {
              // 插入 mention 节点
              Transforms.insertNodes(editor, child as SlateElement)
            } else if (typeof childNode.text === "string") {
              // 插入文本
              Transforms.insertText(editor, childNode.text)
            }
          }
        }
      } else {
        // 如果有多个段落，插入所有节点
        Transforms.insertNodes(editor, nodes)
      }

      return
    }

    // 如果不包含 mention 格式，使用默认处理
    insertData(data)
  }

  return editor
}
