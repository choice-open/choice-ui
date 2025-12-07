import { Editor, Node, Descendant } from "slate"
import { ReactEditor } from "slate-react"
import { HistoryEditor } from "slate-history"

type CustomEditor = Editor & ReactEditor & HistoryEditor

export const withMaxLength =
  (maxLength: number) =>
  <T extends Editor>(editor: T): T => {
    const customEditor = editor as unknown as CustomEditor
    const { insertText, insertData, insertFragment } = customEditor

    // 获取当前文本长度的辅助函数
    const getCurrentLength = () => Editor.string(customEditor, []).length

    // 拦截普通文本插入
    customEditor.insertText = (text: string) => {
      const currentLength = getCurrentLength()
      const newLength = currentLength + text.length

      if (newLength <= maxLength) {
        insertText(text)
      } else {
        const remainingLength = maxLength - currentLength
        if (remainingLength > 0) {
          insertText(text.slice(0, remainingLength))
        }
      }
    }

    // 拦截粘贴操作
    customEditor.insertData = (data: DataTransfer) => {
      const text = data.getData("text/plain")

      if (text) {
        const currentLength = getCurrentLength()
        const newLength = currentLength + text.length

        if (newLength <= maxLength) {
          insertData(data)
        } else {
          const remainingLength = maxLength - currentLength
          if (remainingLength > 0) {
            // 只插入允许长度的文本
            customEditor.insertText(text.slice(0, remainingLength))
          }
        }
      } else {
        // 如果不是文本数据，检查插入后是否超过限制
        const currentLength = getCurrentLength()

        // 临时插入以检查长度
        insertData(data)

        const newLength = getCurrentLength()
        if (newLength > maxLength) {
          // 如果超过限制，撤销并截断
          customEditor.undo()

          // 计算允许插入的文本长度
          const remainingLength = maxLength - currentLength
          if (remainingLength > 0) {
            // 尝试从数据中提取文本并截断插入
            const fallbackText = data.getData("text/plain") || ""
            if (fallbackText) {
              customEditor.insertText(fallbackText.slice(0, remainingLength))
            }
          }
        }
      }
    }

    // 拦截 fragment 插入
    customEditor.insertFragment = (fragment: Node[]) => {
      const fragmentText = fragment.map((value: Node) => Node.string(value)).join("")
      const currentLength = getCurrentLength()
      const newLength = currentLength + fragmentText.length

      if (newLength <= maxLength) {
        insertFragment(fragment)
      } else {
        const remainingLength = maxLength - currentLength
        if (remainingLength > 0) {
          // 将 fragment 转换为文本并截断
          customEditor.insertText(fragmentText.slice(0, remainingLength))
        }
      }
    }

    return editor
  }
