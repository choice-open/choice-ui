import { Descendant, Element as SlateElement, Node, Text } from "slate"
import type { ContextMentionElement, MentionMatch } from "../types"

// Custom text extraction function: replace mention with its label
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
        text += label // Replace mention with its label
        const endIndex = text.length

        mentionsData.push({
          element,
          startIndex,
          endIndex,
        })
      } else if ((node as unknown as { children?: Node[] }).children) {
        // Recursively process child nodes
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

// Default empty paragraph structure
const EMPTY_PARAGRAPH: Descendant[] = [
  { type: "paragraph", children: [{ text: "" }] },
] as unknown as Descendant[]

// Parse text and mentions, generate Slate nodes
export const parseTextWithMentions = (text: string, mentions: MentionMatch[]): Descendant[] => {
  // Handle empty or undefined text
  if (!text && text !== "") {
    return EMPTY_PARAGRAPH
  }

  if (!mentions || mentions.length === 0) {
    return [{ type: "paragraph", children: [{ text: text || "" }] }] as unknown as Descendant[]
  }

  // Sort mentions by start position
  const sortedMentions = [...mentions].sort((a, b) => a.startIndex - b.startIndex)

  const children: ({ text: string } | ContextMentionElement)[] = []
  let currentIndex = 0

  for (const mention of sortedMentions) {
    // Add text before mention
    if (mention.startIndex > currentIndex) {
      const beforeText = text.slice(currentIndex, mention.startIndex)
      if (beforeText) {
        children.push({ text: beforeText })
      }
    }

    // Add mention element
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

  // Add remaining text
  if (currentIndex < text.length) {
    const remainingText = text.slice(currentIndex)
    if (remainingText) {
      children.push({ text: remainingText })
    }
  }

  // Ensure at least one text node
  if (children.length === 0) {
    children.push({ text: "" })
  }

  return [{ type: "paragraph", children }] as unknown as Descendant[]
}
