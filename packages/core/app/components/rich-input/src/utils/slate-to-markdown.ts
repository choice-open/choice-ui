import { Descendant, Text } from "slate"
import { CustomElement, CustomText } from "../types"

/**
 * Convert Slate.js node data to Markdown format
 */
export function slateToMarkdown(nodes: Descendant[]): string {
  if (!nodes || !Array.isArray(nodes)) {
    return ""
  }
  return nodes.map((node) => serializeNode(node)).join("\n")
}

/**
 * Serialize single node
 */
function serializeNode(node: Descendant): string {
  if (!node) {
    return ""
  }
  if (Text.isText(node)) {
    return serializeText(node as CustomText)
  }

  const element = node as CustomElement

  switch (element.type) {
    case "paragraph":
      return serializeChildren(element.children)

    case "h1":
      return `# ${serializeChildren(element.children)}`

    case "h2":
      return `## ${serializeChildren(element.children)}`

    case "h3":
      return `### ${serializeChildren(element.children)}`

    case "h4":
      return `#### ${serializeChildren(element.children)}`

    case "h5":
      return `##### ${serializeChildren(element.children)}`

    case "h6":
      return `###### ${serializeChildren(element.children)}`

    case "block_quote":
      return element.children.map((child) => `> ${serializeNode(child)}`).join("\n")

    case "code": {
      const codeContent = serializeChildren(element.children)
      return "```\n" + codeContent + "\n```"
    }

    case "bulleted_list":
      return element.children
        .map((child) => {
          const content = serializeNode(child)
          return `- ${content}`
        })
        .join("\n")

    case "numbered_list":
      return element.children
        .map((child, index) => {
          const content = serializeNode(child)
          return `${index + 1}. ${content}`
        })
        .join("\n")

    case "list_item":
      return serializeChildren(element.children)

    case "check_list":
      return element.children.map((child) => serializeNode(child)).join("\n")

    case "check_item": {
      const checked = element.checked ? "x" : " "
      return `- [${checked}] ${serializeChildren(element.children)}`
    }

    default:
      return serializeChildren(element.children)
  }
}

/**
 * Serialize child nodes
 */
function serializeChildren(children: Descendant[]): string {
  if (!children || !Array.isArray(children)) {
    return ""
  }
  return children.map((child) => serializeNode(child)).join("")
}

/**
 * Serialize text node with formatting
 */
function serializeText(text: CustomText): string {
  let content = text.text || ""

  // Escape Markdown special characters
  content = escapeMarkdown(content)

  // Apply text formatting
  if (text.bold && text.italic) {
    content = `***${content}***`
  } else if (text.bold) {
    content = `**${content}**`
  } else if (text.italic) {
    content = `*${content}*`
  }

  if (text.strikethrough) {
    content = `~~${content}~~`
  }

  if (text.underlined) {
    // Markdown doesn't natively support underline, use HTML
    content = `<u>${content}</u>`
  }

  if (text.code) {
    content = `\`${content}\``
  }

  if (text.link) {
    content = `[${content}](${text.link})`
  }

  return content
}

/**
 * Escape Markdown special characters
 */
function escapeMarkdown(text: string): string {
  // Preserve newlines but escape other special characters
  const specialChars: Record<string, string> = {
    "\\": "\\\\",
    "`": "\\`",
    "*": "\\*",
    _: "\\_",
    "{": "\\{",
    "}": "\\}",
    "[": "\\[",
    "]": "\\]",
    "(": "\\(",
    ")": "\\)",
    "#": "\\#",
    "+": "\\+",
    "-": "\\-",
    ".": "\\.",
    "!": "\\!",
    "|": "\\|",
  }

  return text.replace(/[\\`*_{}[\]()#+\-.!|]/g, (char) => {
    // Don't escape - at list item start or . after numbers
    const index = text.indexOf(char)
    if (char === "-" && (index === 0 || text[index - 1] === "\n")) {
      return char
    }
    if (char === "." && index > 0 && /\d/.test(text[index - 1])) {
      return char
    }
    return specialChars[char] || char
  })
}
