import { Descendant, Text } from "slate"
import { CustomElement, CustomText } from "../types"

/**
 * 将 Slate.js 的节点数据转换为 Markdown 格式
 */
export function slateToMarkdown(nodes: Descendant[]): string {
  return nodes.map((node) => serializeNode(node)).join("\n")
}

/**
 * 序列化单个节点
 */
function serializeNode(node: Descendant): string {
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
 * 序列化子节点
 */
function serializeChildren(children: Descendant[]): string {
  return children.map((child) => serializeNode(child)).join("")
}

/**
 * 序列化文本节点，应用格式化
 */
function serializeText(text: CustomText): string {
  let content = text.text || ""

  // 转义 Markdown 特殊字符
  content = escapeMarkdown(content)

  // 应用文本格式
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
    // Markdown 不原生支持下划线，使用 HTML
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
 * 转义 Markdown 特殊字符
 */
function escapeMarkdown(text: string): string {
  // 保留换行符，但转义其他特殊字符
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
    // 如果是列表项开头的 - 或者数字后的 .，不转义
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
