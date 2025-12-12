import type { Descendant } from "slate"
import type { ContextMentionElement, ContextParagraphElement, ContextInputText } from "../types"

/**
 * Convert SlateJS node array to string
 * Mention nodes are converted to {{#context#}}{{#id.text#}} format
 */
export function convertSlateToText(nodes: Descendant[]): string {
  if (!nodes || nodes.length === 0) return ""

  return nodes
    .map((node) => convertNodeToText(node))
    .join("\n")
    .trim()
}

/**
 * Convert string to SlateJS node array
 * Supports parsing {{#context#}}{{#id.text#}} format to mention nodes
 */
export function convertTextToSlate(text: string): Descendant[] {
  if (!text || text.trim() === "") {
    return [{ type: "paragraph", children: [{ text: "" }] }] as unknown as Descendant[]
  }

  const lines = text.split("\n")

  return lines.map((line) => {
    const children = parseLineToNodes(line)
    return {
      type: "paragraph",
      children: children,
    } as unknown as Descendant
  })
}

/**
 * Recursively convert single node to text
 */
function convertNodeToText(node: Descendant): string {
  const nodeAny = node as unknown as Record<string, unknown>

  // If mention node
  if (isMentionElement(node)) {
    const mentionId = (nodeAny.mentionId as string) || "unknown"

    // Determine format based on mentionId:
    // - If pure number or contains number, use {{#id.text#}} format
    // - If text (like context), use {{#id#}} format
    if (/^\d+$/.test(mentionId) || mentionId.includes(".")) {
      return `{{#${mentionId}.text#}}`
    } else {
      return `{{#${mentionId}#}}`
    }
  }

  // If plain text node
  if (isTextNode(node)) {
    return node.text
  }

  // If paragraph element, recursively process all child nodes
  if (isParagraphElement(node)) {
    // Paragraph children may contain text nodes and mention nodes, need recursive processing
    const result: string[] = []
    for (const child of node.children) {
      const childNode = child as unknown as Record<string, unknown>
      // If mention node
      if (childNode.type === "mention") {
        const mentionId = (childNode.mentionId as string) || "unknown"

        // Same format determination logic
        if (/^\d+$/.test(mentionId) || mentionId.includes(".")) {
          result.push(`{{#${mentionId}.text#}}`)
        } else {
          result.push(`{{#${mentionId}#}}`)
        }
      }
      // If text node
      else if (typeof childNode.text === "string") {
        result.push(childNode.text)
      }
    }
    return result.join("")
  }

  return ""
}

/**
 * Parse a line of text into node array, handling mention format
 */
function parseLineToNodes(line: string): (ContextInputText | ContextMentionElement)[] {
  // Support two mention formats:
  // 1. {{#id#}} - simple format (e.g., {{#context#}})
  // 2. {{#id.text#}} - format with .text suffix (e.g., {{#1739416889031.text#}})
  const mentionRegex = /\{\{#([^}]+?)(?:\.text)?#\}\}/g
  const nodes: (ContextInputText | ContextMentionElement)[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = mentionRegex.exec(line)) !== null) {
    const [fullMatch, mentionId] = match
    const matchStart = match.index
    const matchEnd = match.index + fullMatch.length

    // Add plain text before mention
    if (matchStart > lastIndex) {
      const textBefore = line.slice(lastIndex, matchStart)
      if (textBefore) {
        nodes.push({ text: textBefore })
      }
    }

    // Create mention node
    const mentionNode: ContextMentionElement = {
      type: "mention",
      mentionType: "user", // Default type, may need adjustment based on actual use
      mentionId: mentionId,
      mentionLabel: `User ${mentionId}`, // Default label, actual use may need to look up real label
      mentionData: {},
      children: [{ text: "" }],
    }

    nodes.push(mentionNode)
    lastIndex = matchEnd
  }

  // Add remaining plain text
  if (lastIndex < line.length) {
    const textAfter = line.slice(lastIndex)
    if (textAfter) {
      nodes.push({ text: textAfter })
    }
  }

  // If no content, return empty text node
  if (nodes.length === 0) {
    nodes.push({ text: line })
  }

  return nodes
}

/**
 * Create paragraph element - return native object instead of typed object
 */
function createParagraphElement(
  children: (ContextInputText | ContextMentionElement)[],
): Record<string, unknown> {
  // If no child nodes, create an empty text node
  if (children.length === 0) {
    return {
      type: "paragraph",
      children: [{ text: "" }],
    }
  }

  // Keep all child nodes (including text nodes and mention nodes)
  return {
    type: "paragraph",
    children: children,
  }
}

/**
 * Type guard: check if node is text node
 */
function isTextNode(node: Descendant): node is ContextInputText {
  const nodeAny = node as unknown as Record<string, unknown>
  return typeof nodeAny.text === "string" && !nodeAny.type
}

/**
 * Type guard: check if node is paragraph element
 */
function isParagraphElement(node: Descendant): boolean {
  const nodeAny = node as unknown as Record<string, unknown>
  return nodeAny.type === "paragraph"
}

/**
 * Type guard: check if node is mention element
 */
function isMentionElement(node: Descendant): boolean {
  const nodeAny = node as unknown as Record<string, unknown>
  return nodeAny.type === "mention"
}

/**
 * Interface for mention resolver function
 */
export interface MentionResolver {
  (mentionId: string): Promise<{
    label: string
    metadata?: Record<string, unknown>
    type: string
  }>
}

/**
 * Advanced version: supports async mention info resolution
 */
export async function convertTextToSlateWithResolver(
  text: string,
  mentionResolver?: MentionResolver,
): Promise<Descendant[]> {
  if (!text || text.trim() === "") {
    return [{ type: "paragraph", children: [{ text: "" }] }] as unknown as Descendant[]
  }

  const lines = text.split("\n")

  const resolvedLines = await Promise.all(
    lines.map((line) => parseLineToNodesWithResolver(line, mentionResolver)),
  )

  return resolvedLines.map((children) => ({
    type: "paragraph",
    children: children,
  })) as unknown as Descendant[]
}

/**
 * Parse a line of text with async mention resolution support
 */
async function parseLineToNodesWithResolver(
  line: string,
  mentionResolver?: MentionResolver,
): Promise<(ContextInputText | ContextMentionElement)[]> {
  // Support two mention formats:
  // 1. {{#id#}} - simple format (e.g., {{#context#}})
  // 2. {{#id.text#}} - format with .text suffix (e.g., {{#1739416889031.text#}})
  const mentionRegex = /\{\{#([^}]+?)(?:\.text)?#\}\}/g
  const nodes: (ContextInputText | ContextMentionElement)[] = []
  let lastIndex = 0
  const matches: RegExpExecArray[] = []
  let match: RegExpExecArray | null

  // Collect all matches
  while ((match = mentionRegex.exec(line)) !== null) {
    matches.push({ ...match } as RegExpExecArray)
  }

  // Async resolve mention info
  for (const match of matches) {
    const [fullMatch, mentionId] = match
    const matchStart = match.index
    const matchEnd = match.index + fullMatch.length

    // Add plain text before mention
    if (matchStart > lastIndex) {
      const textBefore = line.slice(lastIndex, matchStart)
      if (textBefore) {
        nodes.push({ text: textBefore })
      }
    }

    // Resolve mention info
    let mentionInfo: {
      label: string
      metadata?: Record<string, unknown>
      type: string
    } = {
      label: `User ${mentionId}`,
      type: "user",
    }

    if (mentionResolver) {
      try {
        mentionInfo = await mentionResolver(mentionId)
      } catch (error) {
        console.warn(`Failed to resolve mention ${mentionId}:`, error)
      }
    }

    // Create mention node
    const mentionNode: ContextMentionElement = {
      type: "mention",
      mentionType: mentionInfo.type as "user" | "channel" | "tag" | "custom",
      mentionId: mentionId,
      mentionLabel: mentionInfo.label,
      mentionData: mentionInfo.metadata || {},
      children: [{ text: "" }],
    }

    nodes.push(mentionNode)
    lastIndex = matchEnd
  }

  // Add remaining plain text
  if (lastIndex < line.length) {
    const textAfter = line.slice(lastIndex)
    if (textAfter) {
      nodes.push({ text: textAfter })
    }
  }

  // If no content, return empty text node
  if (nodes.length === 0) {
    nodes.push({ text: line })
  }

  return nodes
}
