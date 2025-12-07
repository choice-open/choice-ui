import { Descendant, Element as SlateElement, Node, Text } from "slate"
import type { ContextMentionElement, MentionMatch } from "../types"

// 自定义文本提取函数：将 mention 替换为其 label
export const extractTextWithMentions = (nodes: Descendant[]) => {
  let text = ""
  const mentionsData: Array<{
    element: ContextMentionElement
    endIndex: number
    startIndex: number
  }> = []

  const processNode = (node: Node) => {
    if (Text.isText(node)) {
      text += node.text
    } else if (SlateElement.isElement(node)) {
      if ((node as unknown as { type: string }).type === "mention") {
        const element = node as unknown as ContextMentionElement
        const startIndex = text.length
        const label = element.mentionLabel
        text += label // 将 mention 替换为其 label
        const endIndex = text.length

        mentionsData.push({
          element,
          startIndex,
          endIndex,
        })
      } else if ((node as unknown as { children?: Node[] }).children) {
        // 递归处理子节点
        for (const child of (node as unknown as { children: Node[] }).children) {
          processNode(child)
        }
      }
    }
  }

  // Process each node (paragraph) and add newlines between them
  for (let i = 0; i < nodes.length; i++) {
    processNode(nodes[i])
    // Add newline after each paragraph except the last one
    if (i < nodes.length - 1) {
      text += "\n"
    }
  }

  return { text, mentionsData }
}

// 解析文本和 mentions，生成 Slate 节点
export const parseTextWithMentions = (text: string, mentions: MentionMatch[]): Descendant[] => {
  if (!mentions || mentions.length === 0) {
    return [{ type: "paragraph", children: [{ text }] }] as unknown as Descendant[]
  }

  // 按起始位置排序 mentions
  const sortedMentions = [...mentions].sort((a, b) => a.startIndex - b.startIndex)

  const children: ({ text: string } | ContextMentionElement)[] = []
  let currentIndex = 0

  for (const mention of sortedMentions) {
    // 添加 mention 前的文本
    if (mention.startIndex > currentIndex) {
      const beforeText = text.slice(currentIndex, mention.startIndex)
      if (beforeText) {
        children.push({ text: beforeText })
      }
    }

    // 添加 mention 元素
    const mentionElement: ContextMentionElement = {
      type: "mention" as const,
      mentionType: mention.item.type,
      mentionId: mention.item.id,
      mentionLabel: mention.item.label,
      mentionData: mention.item.metadata,
      children: [{ text: "" }],
    }
    children.push(mentionElement)

    currentIndex = mention.endIndex
  }

  // 添加剩余的文本
  if (currentIndex < text.length) {
    const remainingText = text.slice(currentIndex)
    if (remainingText) {
      children.push({ text: remainingText })
    }
  }

  // 确保至少有一个文本节点
  if (children.length === 0) {
    children.push({ text: "" })
  }

  return [{ type: "paragraph", children }] as unknown as Descendant[]
}
