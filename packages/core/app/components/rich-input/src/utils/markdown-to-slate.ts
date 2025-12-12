import { Descendant } from "slate"
import { CustomElement, CustomText } from "../types"

// Default empty paragraph structure
const EMPTY_PARAGRAPH: Descendant[] = [
  { type: "paragraph", children: [{ text: "" }] } as unknown as Descendant,
]

/**
 * Convert Markdown text to Slate.js node format
 * A simplified implementation supporting basic Markdown syntax
 */
export function markdownToSlate(markdown: string): Descendant[] {
  // Handle empty or invalid input
  if (!markdown || typeof markdown !== "string") {
    return EMPTY_PARAGRAPH
  }

  const lines = markdown.split("\n")
  const nodes: Descendant[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Skip empty lines
    if (!line.trim()) {
      i++
      continue
    }

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const text = headingMatch[2]
      nodes.push({
        type: `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6",
        children: parseInlineElements(text),
      } as unknown as Descendant)
      i++
      continue
    }

    // Block quote
    if (line.startsWith("> ")) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].substring(2))
        i++
      }
      nodes.push({
        type: "block_quote",
        children: [
          {
            type: "paragraph",
            children: parseInlineElements(quoteLines.join("\n")),
          } as CustomElement,
        ],
      } as unknown as Descendant)
      continue
    }

    // Code block
    if (line.startsWith("```")) {
      const codeLines: string[] = []
      i++ // Skip opening ```
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i])
        i++
      }
      i++ // Skip closing ```
      nodes.push({
        type: "code",
        children: [{ text: codeLines.join("\n") }],
      } as unknown as Descendant)
      continue
    }

    // Unordered list
    if (line.match(/^[-*+]\s+/)) {
      const listItems: CustomElement[] = []
      while (i < lines.length && lines[i].match(/^[-*+]\s+/)) {
        const itemText = lines[i].replace(/^[-*+]\s+/, "")
        listItems.push({
          type: "list_item",
          children: parseInlineElements(itemText),
        } as CustomElement)
        i++
      }
      nodes.push({
        type: "bulleted_list",
        children: listItems,
      } as unknown as Descendant)
      continue
    }

    // Ordered list
    if (line.match(/^\d+\.\s+/)) {
      const listItems: CustomElement[] = []
      while (i < lines.length && lines[i].match(/^\d+\.\s+/)) {
        const itemText = lines[i].replace(/^\d+\.\s+/, "")
        listItems.push({
          type: "list_item",
          children: parseInlineElements(itemText),
        } as CustomElement)
        i++
      }
      nodes.push({
        type: "numbered_list",
        children: listItems,
      } as unknown as Descendant)
      continue
    }

    // Task list
    if (line.match(/^-\s+\[[x\s]\]\s+/)) {
      const checkItems: CustomElement[] = []
      while (i < lines.length && lines[i].match(/^-\s+\[[x\s]\]\s+/)) {
        const isChecked = lines[i].includes("[x]")
        const itemText = lines[i].replace(/^-\s+\[[x\s]\]\s+/, "")
        checkItems.push({
          type: "check_item",
          checked: isChecked,
          children: parseInlineElements(itemText),
        } as CustomElement)
        i++
      }
      nodes.push({
        type: "check_list",
        children: checkItems,
      } as unknown as Descendant)
      continue
    }

    // Plain paragraph
    nodes.push({
      type: "paragraph",
      children: parseInlineElements(line),
    } as unknown as Descendant)
    i++
  }

  // If no content, return empty paragraph
  if (nodes.length === 0) {
    return EMPTY_PARAGRAPH
  }

  return nodes
}

/**
 * Parse inline elements (bold, italic, links, etc.)
 */
function parseInlineElements(text: string): (CustomText | CustomElement)[] {
  // Handle empty text
  if (!text) {
    return [{ text: "" }]
  }

  const elements: (CustomText | CustomElement)[] = []

  // Store processed text segments
  const segments: Array<{ end: number; node: CustomText; start: number }> = []

  // Handle bold-italic ***text***
  const boldItalicRegex = /\*\*\*([^*]+)\*\*\*/g
  let match
  while ((match = boldItalicRegex.exec(text)) !== null) {
    segments.push({
      start: match.index,
      end: match.index + match[0].length,
      node: { text: match[1], bold: true, italic: true },
    })
  }

  // Handle bold **text**
  const boldRegex = /\*\*([^*]+)\*\*/g
  while ((match = boldRegex.exec(text)) !== null) {
    // Check if already processed
    if (!isOverlapping(segments, match.index, match.index + match[0].length)) {
      segments.push({
        start: match.index,
        end: match.index + match[0].length,
        node: { text: match[1], bold: true },
      })
    }
  }

  // Handle italic *text*
  const italicRegex = /\*([^*]+)\*/g
  while ((match = italicRegex.exec(text)) !== null) {
    if (!isOverlapping(segments, match.index, match.index + match[0].length)) {
      segments.push({
        start: match.index,
        end: match.index + match[0].length,
        node: { text: match[1], italic: true },
      })
    }
  }

  // Handle strikethrough ~~text~~
  const strikethroughRegex = /~~([^~]+)~~/g
  while ((match = strikethroughRegex.exec(text)) !== null) {
    if (!isOverlapping(segments, match.index, match.index + match[0].length)) {
      segments.push({
        start: match.index,
        end: match.index + match[0].length,
        node: { text: match[1], strikethrough: true },
      })
    }
  }

  // Handle inline code `code`
  const codeRegex = /`([^`]+)`/g
  while ((match = codeRegex.exec(text)) !== null) {
    if (!isOverlapping(segments, match.index, match.index + match[0].length)) {
      segments.push({
        start: match.index,
        end: match.index + match[0].length,
        node: { text: match[1], code: true },
      })
    }
  }

  // Handle links [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  while ((match = linkRegex.exec(text)) !== null) {
    if (!isOverlapping(segments, match.index, match.index + match[0].length)) {
      segments.push({
        start: match.index,
        end: match.index + match[0].length,
        node: { text: match[1], link: match[2] },
      })
    }
  }

  // Handle underline <u>text</u>
  const underlineRegex = /<u>([^<]+)<\/u>/g
  while ((match = underlineRegex.exec(text)) !== null) {
    if (!isOverlapping(segments, match.index, match.index + match[0].length)) {
      segments.push({
        start: match.index,
        end: match.index + match[0].length,
        node: { text: match[1], underlined: true },
      })
    }
  }

  // Sort by position
  segments.sort((a, b) => a.start - b.start)

  // Build final elements array
  let currentIndex = 0
  for (const segment of segments) {
    // Add plain text before this segment
    if (currentIndex < segment.start) {
      const plainText = text.substring(currentIndex, segment.start)
      if (plainText) {
        elements.push({ text: plainText })
      }
    }
    // Add formatted text
    elements.push(segment.node)
    currentIndex = segment.end
  }

  // Add remaining text
  if (currentIndex < text.length) {
    const remainingText = text.substring(currentIndex)
    if (remainingText) {
      elements.push({ text: remainingText })
    }
  }

  // If no elements, return single element with entire text
  if (elements.length === 0) {
    elements.push({ text })
  }

  return elements
}

/**
 * Check if segment overlaps with already processed segments
 */
function isOverlapping(
  segments: Array<{ end: number; start: number }>,
  start: number,
  end: number,
): boolean {
  return segments.some(
    (segment) =>
      (start >= segment.start && start < segment.end) ||
      (end > segment.start && end <= segment.end) ||
      (start <= segment.start && end >= segment.end),
  )
}
