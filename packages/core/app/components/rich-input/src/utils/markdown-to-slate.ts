import { Descendant } from "slate"
import { CustomElement, CustomText } from "../types"

/**
 * 将 Markdown 文本转换为 Slate.js 节点格式
 * 这是一个简化的实现，支持基本的 Markdown 语法
 */
export function markdownToSlate(markdown: string): Descendant[] {
  const lines = markdown.split("\n")
  const nodes: Descendant[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // 跳过空行
    if (!line.trim()) {
      i++
      continue
    }

    // 标题
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

    // 引用块
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

    // 代码块
    if (line.startsWith("```")) {
      const codeLines: string[] = []
      i++ // 跳过开始的 ```
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i])
        i++
      }
      i++ // 跳过结束的 ```
      nodes.push({
        type: "code",
        children: [{ text: codeLines.join("\n") }],
      } as unknown as Descendant)
      continue
    }

    // 无序列表
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

    // 有序列表
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

    // 任务列表
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

    // 普通段落
    nodes.push({
      type: "paragraph",
      children: parseInlineElements(line),
    } as unknown as Descendant)
    i++
  }

  // 如果没有内容，返回一个空段落
  if (nodes.length === 0) {
    nodes.push({
      type: "paragraph",
      children: [{ text: "" }],
    } as unknown as Descendant)
  }

  return nodes
}

/**
 * 解析行内元素（粗体、斜体、链接等）
 */
function parseInlineElements(text: string): (CustomText | CustomElement)[] {
  const elements: (CustomText | CustomElement)[] = []

  // 用于存储已处理的文本片段
  const segments: Array<{ end: number; node: CustomText; start: number }> = []

  // 处理加粗斜体 ***text***
  const boldItalicRegex = /\*\*\*([^*]+)\*\*\*/g
  let match
  while ((match = boldItalicRegex.exec(text)) !== null) {
    segments.push({
      start: match.index,
      end: match.index + match[0].length,
      node: { text: match[1], bold: true, italic: true },
    })
  }

  // 处理加粗 **text**
  const boldRegex = /\*\*([^*]+)\*\*/g
  while ((match = boldRegex.exec(text)) !== null) {
    // 检查是否已被处理
    if (!isOverlapping(segments, match.index, match.index + match[0].length)) {
      segments.push({
        start: match.index,
        end: match.index + match[0].length,
        node: { text: match[1], bold: true },
      })
    }
  }

  // 处理斜体 *text*
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

  // 处理删除线 ~~text~~
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

  // 处理行内代码 `code`
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

  // 处理链接 [text](url)
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

  // 处理下划线 <u>text</u>
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

  // 按位置排序
  segments.sort((a, b) => a.start - b.start)

  // 构建最终的元素数组
  let currentIndex = 0
  for (const segment of segments) {
    // 添加前面的普通文本
    if (currentIndex < segment.start) {
      const plainText = text.substring(currentIndex, segment.start)
      if (plainText) {
        elements.push({ text: plainText })
      }
    }
    // 添加格式化的文本
    elements.push(segment.node)
    currentIndex = segment.end
  }

  // 添加剩余的文本
  if (currentIndex < text.length) {
    const remainingText = text.substring(currentIndex)
    if (remainingText) {
      elements.push({ text: remainingText })
    }
  }

  // 如果没有元素，返回包含整个文本的单个元素
  if (elements.length === 0) {
    elements.push({ text })
  }

  return elements
}

/**
 * 检查是否与已处理的片段重叠
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
