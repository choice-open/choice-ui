import { Editor, Node } from "slate"
import { HistoryEditor } from "slate-history"
import { ReactEditor } from "slate-react"

type CustomEditor = Editor & ReactEditor & HistoryEditor

export const withMaxLength =
  (maxLength: number) =>
  <T extends Editor>(editor: T): T => {
    const customEditor = editor as unknown as CustomEditor
    const { insertText, insertData, insertFragment } = customEditor

    // Helper function to get current text length
    const getCurrentLength = () => Editor.string(customEditor, []).length

    // Intercept normal text insertion
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

    // Intercept paste operation
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
            // Only insert text up to allowed length
            customEditor.insertText(text.slice(0, remainingLength))
          }
        }
      } else {
        // If not text data, check if insertion exceeds limit
        const currentLength = getCurrentLength()

        // Temporarily insert to check length
        insertData(data)

        const newLength = getCurrentLength()
        if (newLength > maxLength) {
          // If exceeds limit, undo and truncate
          customEditor.undo()

          // Calculate allowed text length
          const remainingLength = maxLength - currentLength
          if (remainingLength > 0) {
            // Try to extract text from data and insert truncated
            const fallbackText = data.getData("text/plain") || ""
            if (fallbackText) {
              customEditor.insertText(fallbackText.slice(0, remainingLength))
            }
          }
        }
      }
    }

    // Intercept fragment insertion
    customEditor.insertFragment = (fragment: Node[]) => {
      const fragmentText = fragment.map((value: Node) => Node.string(value)).join("")
      const currentLength = getCurrentLength()
      const newLength = currentLength + fragmentText.length

      if (newLength <= maxLength) {
        insertFragment(fragment)
      } else {
        const remainingLength = maxLength - currentLength
        if (remainingLength > 0) {
          // Convert fragment to text and truncate
          customEditor.insertText(fragmentText.slice(0, remainingLength))
        }
      }
    }

    return editor
  }
