import { Editor, Element as SlateElement, Transforms, Range } from "slate"
import { ReactEditor } from "slate-react"
import { HistoryEditor } from "slate-history"
import { convertTextToSlate } from "../utils/slate-converters"

type CustomEditor = Editor & ReactEditor & HistoryEditor

// Create an editor with mentions support
export const withMentions = <T extends Editor>(editor: T): T => {
  const customEditor = editor as unknown as CustomEditor
  const { isInline, isVoid, insertData } = customEditor

  customEditor.isInline = (element: SlateElement) => {
    return (element as unknown as { type: string }).type === "mention" ? true : isInline(element)
  }

  customEditor.isVoid = (element: SlateElement) => {
    return (element as unknown as { type: string }).type === "mention" ? true : isVoid(element)
  }

  // Override insertData to handle paste
  customEditor.insertData = (data: DataTransfer) => {
    const text = data.getData("text/plain")

    // Check whether the pasted text contains mention tokens
    const mentionRegex = /\{\{#([^}]+?)(?:\.text)?#\}\}/

    if (text && mentionRegex.test(text)) {
      // Parse into Slate nodes
      const nodes = convertTextToSlate(text)

      // Delete current selection (if expanded)
      if (customEditor.selection && Range.isExpanded(customEditor.selection)) {
        Transforms.delete(customEditor)
      }

      // Insert parsed nodes
      if (nodes.length === 1) {
        // If there is only one paragraph, insert its children
        const paragraph = nodes[0] as unknown as { children: unknown[]; type: string }
        if (paragraph.type === "paragraph" && paragraph.children) {
          // Insert children one by one (text + mention)
          for (const child of paragraph.children) {
            const childNode = child as unknown as { text?: string; type?: string }

            if (childNode.type === "mention") {
              // Insert mention node
              Transforms.insertNodes(customEditor, child as SlateElement)
            } else if (typeof childNode.text === "string") {
              // Insert text
              Transforms.insertText(customEditor, childNode.text)
            }
          }
        }
      } else {
        // If there are multiple paragraphs, insert them all
        Transforms.insertNodes(customEditor, nodes)
      }

      return
    }

    // Fall back to the default behavior
    insertData(data)
  }

  return editor
}
