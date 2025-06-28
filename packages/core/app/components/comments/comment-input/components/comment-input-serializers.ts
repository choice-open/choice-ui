import { Descendant } from "slate"
import type {
  Attachment,
  CustomText,
  ImageElement,
  MentionElement,
  ParagraphElement,
  StructuredData,
} from "../types"
import { isImageElement, isMentionElement, isParagraphElement } from "../utils"

/**
 * 将Slate节点序列化为HTML字符串
 */
export const serializeToHtml = (nodes: Descendant[]): string => {
  return nodes
    .map((node) => {
      if (isParagraphElement(node)) {
        const paragraphNode = node as ParagraphElement
        const inner = paragraphNode.children
          .map((child) => {
            if (isMentionElement(child)) {
              const mentionChild = child
              return `<span class="mention">@${mentionChild.user.name}</span>`
            }

            // 处理格式化文本
            const textChild = child as CustomText
            if (textChild.text) {
              let text = textChild.text
              if (textChild.bold) {
                text = `<strong>${text}</strong>`
              }
              if (textChild.italic) {
                text = `<em>${text}</em>`
              }
              if (textChild.underline) {
                text = `<u>${text}</u>`
              }
              return text
            }

            return ""
          })
          .join("")

        return `<p>${inner}</p>`
      }

      if (isImageElement(node)) {
        const imageNode = node as ImageElement
        if (!imageNode.attachments || imageNode.attachments.length === 0) {
          return ""
        }

        const imagesHtml = imageNode.attachments
          .map((attachment) => `<img src="${attachment.url}" alt="${attachment.name || ""}" />`)
          .join("")

        return `<div class="images">${imagesHtml}</div>`
      }

      return ""
    })
    .join("")
}

/**
 * 序列化为纯文本（用于提交和存储）
 */
export const serializeToText = (nodes: Descendant[]): string => {
  return nodes
    .map((node) => {
      if (isParagraphElement(node)) {
        const paragraphNode = node as ParagraphElement
        return paragraphNode.children
          .map((child) => {
            if (isMentionElement(child)) {
              const mentionChild = child as MentionElement
              return `@${mentionChild.user.name}`
            }
            const textChild = child as CustomText
            return textChild.text || ""
          })
          .join("")
      }

      if (isImageElement(node)) {
        const imageNode = node as ImageElement
        const attachmentCount = imageNode.attachments?.length || 0
        return attachmentCount > 0 ? `[${attachmentCount} 图片]` : ""
      }

      return ""
    })
    .join("\n")
}

/**
 * 将Slate内容序列化为结构化JSON数据
 */
export const serializeToStructuredData = (nodes: Descendant[]): StructuredData => {
  const mentions: Array<{ id: string; name: string }> = []
  const attachments: Array<Attachment> = []
  let text = ""

  nodes.forEach((node) => {
    if (isParagraphElement(node)) {
      const paragraphNode = node as ParagraphElement
      paragraphNode.children.forEach((child) => {
        if (isMentionElement(child)) {
          const mentionChild = child as MentionElement
          mentions.push({
            id: mentionChild.user.id,
            name: mentionChild.user.name,
          })
          text += `@${mentionChild.user.name} `
        } else {
          const textChild = child as CustomText
          if (textChild.text) {
            text += textChild.text
          }
        }
      })
    } else if (isImageElement(node)) {
      const imageNode = node as ImageElement
      if (imageNode.attachments && imageNode.attachments.length > 0) {
        attachments.push(...imageNode.attachments)
      }
    }
  })

  return {
    text: text.trim(),
    mentions,
    attachments,
    raw: nodes,
  }
}
