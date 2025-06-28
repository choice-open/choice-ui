import { Descendant, Element } from "slate"
import type { CustomText, ImageElement, MentionElement, ParagraphElement } from "../types"

const isText = (node: unknown): node is CustomText => {
  return typeof node === "object" && node !== null && "text" in node
}

export const isImageElement = (element: unknown): element is ImageElement => {
  return Element.isElement(element) && element.type === "image"
}

export const isMentionElement = (element: unknown): element is MentionElement => {
  return Element.isElement(element) && element.type === "mention"
}

export const isParagraphElement = (element: unknown): element is ParagraphElement => {
  return Element.isElement(element) && element.type === "paragraph"
}

export const serializeToPlainText = (nodes: Descendant[]): string => {
  return nodes
    .map((node) => {
      if (!node) return ""

      if (isParagraphElement(node)) {
        return node.children
          .map((n) => {
            if (isText(n)) {
              return n.text || ""
            }
            return ""
          })
          .join("")
      }

      if (isImageElement(node)) {
        const attachmentCount = node.attachments?.length || 0
        return attachmentCount > 0
          ? `[${attachmentCount} image${attachmentCount > 1 ? "s" : ""}]`
          : "[image]"
      }

      if (isMentionElement(node)) {
        return `@${node.user.name}`
      }

      if (isText(node)) {
        return node.text || ""
      }

      return ""
    })
    .join("\n")
}

export const isEmptyContent = (data: Descendant[]): boolean => {
  if (!data || data.length === 0) return true

  // 检查是否有任何非空内容
  const hasContent = data.some((node) => {
    // 如果包含 mention 或 image 元素，则不为空
    if (isMentionElement(node) || isImageElement(node)) {
      return true
    }

    // 如果是段落，检查是否有文本内容或特殊元素
    if (isParagraphElement(node)) {
      // 检查段落中的文本内容
      const textContent = node.children
        .filter((child): child is CustomText => isText(child))
        .map((child) => child.text)
        .join("")

      if (textContent.trim() !== "") {
        return true
      }

      // 检查段落中是否包含特殊元素（mention、image）
      return node.children.some(
        (child): boolean =>
          Element.isElement(child) && (isMentionElement(child) || isImageElement(child)),
      )
    }

    return false
  })

  return !hasContent
}
