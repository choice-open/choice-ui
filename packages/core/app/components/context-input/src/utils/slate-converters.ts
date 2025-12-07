import type { Descendant } from "slate"
import type { ContextMentionElement, ContextParagraphElement, ContextInputText } from "../types"

/**
 * 将SlateJS节点数组转换为字符串
 * mention节点转换为 {{#context#}}{{#id.text#}} 格式
 */
export function convertSlateToText(nodes: Descendant[]): string {
  if (!nodes || nodes.length === 0) return ""

  return nodes
    .map((node) => convertNodeToText(node))
    .join("\n")
    .trim()
}

/**
 * 将字符串转换为SlateJS节点数组
 * 支持解析 {{#context#}}{{#id.text#}} 格式为mention节点
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
 * 递归转换单个节点为文本
 */
function convertNodeToText(node: Descendant): string {
  const nodeAny = node as unknown as Record<string, unknown>

  // 如果是mention节点
  if (isMentionElement(node)) {
    const mentionId = (nodeAny.mentionId as string) || "unknown"

    // 根据 mentionId 决定格式：
    // - 如果是纯数字或包含数字，使用 {{#id.text#}} 格式
    // - 如果是文字（如 context），使用 {{#id#}} 格式
    if (/^\d+$/.test(mentionId) || mentionId.includes(".")) {
      return `{{#${mentionId}.text#}}`
    } else {
      return `{{#${mentionId}#}}`
    }
  }

  // 如果是普通文本节点
  if (isTextNode(node)) {
    return node.text
  }

  // 如果是段落元素，递归处理所有子节点
  if (isParagraphElement(node)) {
    // 段落的children可能包含文本节点和mention节点，需要递归处理
    const result: string[] = []
    for (const child of node.children) {
      const childNode = child as unknown as Record<string, unknown>
      // 如果是mention节点
      if (childNode.type === "mention") {
        const mentionId = (childNode.mentionId as string) || "unknown"

        // 同样的格式判断逻辑
        if (/^\d+$/.test(mentionId) || mentionId.includes(".")) {
          result.push(`{{#${mentionId}.text#}}`)
        } else {
          result.push(`{{#${mentionId}#}}`)
        }
      }
      // 如果是文本节点
      else if (typeof childNode.text === "string") {
        result.push(childNode.text)
      }
    }
    return result.join("")
  }

  return ""
}

/**
 * 解析一行文本为节点数组，处理mention格式
 */
function parseLineToNodes(line: string): (ContextInputText | ContextMentionElement)[] {
  // 支持两种 mention 格式：
  // 1. {{#id#}} - 简单格式（如：{{#context#}}）
  // 2. {{#id.text#}} - 带 .text 后缀格式（如：{{#1739416889031.text#}}）
  const mentionRegex = /\{\{#([^}]+?)(?:\.text)?#\}\}/g
  const nodes: (ContextInputText | ContextMentionElement)[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = mentionRegex.exec(line)) !== null) {
    const [fullMatch, mentionId] = match
    const matchStart = match.index
    const matchEnd = match.index + fullMatch.length

    // 添加mention前的普通文本
    if (matchStart > lastIndex) {
      const textBefore = line.slice(lastIndex, matchStart)
      if (textBefore) {
        nodes.push({ text: textBefore })
      }
    }

    // 创建mention节点
    const mentionNode: ContextMentionElement = {
      type: "mention",
      mentionType: "user", // 默认类型，可能需要根据实际情况调整
      mentionId: mentionId,
      mentionLabel: `User ${mentionId}`, // 默认标签，实际使用时可能需要查找真实标签
      mentionData: {},
      children: [{ text: "" }],
    }

    nodes.push(mentionNode)
    lastIndex = matchEnd
  }

  // 添加剩余的普通文本
  if (lastIndex < line.length) {
    const textAfter = line.slice(lastIndex)
    if (textAfter) {
      nodes.push({ text: textAfter })
    }
  }

  // 如果没有任何内容，返回空文本节点
  if (nodes.length === 0) {
    nodes.push({ text: line })
  }

  return nodes
}

/**
 * 创建段落元素 - 返回原生对象而不是类型化对象
 */
function createParagraphElement(
  children: (ContextInputText | ContextMentionElement)[],
): Record<string, unknown> {
  // 如果没有任何子节点，创建一个空的文本节点
  if (children.length === 0) {
    return {
      type: "paragraph",
      children: [{ text: "" }],
    }
  }

  // 保留所有子节点（包括文本节点和 mention 节点）
  return {
    type: "paragraph",
    children: children,
  }
}

/**
 * 类型守卫：检查是否为文本节点
 */
function isTextNode(node: Descendant): node is ContextInputText {
  const nodeAny = node as unknown as Record<string, unknown>
  return typeof nodeAny.text === "string" && !nodeAny.type
}

/**
 * 类型守卫：检查是否为段落元素
 */
function isParagraphElement(node: Descendant): boolean {
  const nodeAny = node as unknown as Record<string, unknown>
  return nodeAny.type === "paragraph"
}

/**
 * 类型守卫：检查是否为mention元素
 */
function isMentionElement(node: Descendant): boolean {
  const nodeAny = node as unknown as Record<string, unknown>
  return nodeAny.type === "mention"
}

/**
 * 创建mention查找函数的接口
 */
export interface MentionResolver {
  (mentionId: string): Promise<{
    label: string
    metadata?: Record<string, unknown>
    type: string
  }>
}

/**
 * 高级版本：支持异步解析mention信息
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
 * 解析一行文本，支持异步mention解析
 */
async function parseLineToNodesWithResolver(
  line: string,
  mentionResolver?: MentionResolver,
): Promise<(ContextInputText | ContextMentionElement)[]> {
  // 支持两种 mention 格式：
  // 1. {{#id#}} - 简单格式（如：{{#context#}}）
  // 2. {{#id.text#}} - 带 .text 后缀格式（如：{{#1739416889031.text#}}）
  const mentionRegex = /\{\{#([^}]+?)(?:\.text)?#\}\}/g
  const nodes: (ContextInputText | ContextMentionElement)[] = []
  let lastIndex = 0
  const matches: RegExpExecArray[] = []
  let match: RegExpExecArray | null

  // 收集所有匹配
  while ((match = mentionRegex.exec(line)) !== null) {
    matches.push({ ...match } as RegExpExecArray)
  }

  // 异步解析mention信息
  for (const match of matches) {
    const [fullMatch, mentionId] = match
    const matchStart = match.index
    const matchEnd = match.index + fullMatch.length

    // 添加mention前的普通文本
    if (matchStart > lastIndex) {
      const textBefore = line.slice(lastIndex, matchStart)
      if (textBefore) {
        nodes.push({ text: textBefore })
      }
    }

    // 解析mention信息
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

    // 创建mention节点
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

  // 添加剩余的普通文本
  if (lastIndex < line.length) {
    const textAfter = line.slice(lastIndex)
    if (textAfter) {
      nodes.push({ text: textAfter })
    }
  }

  // 如果没有任何内容，返回空文本节点
  if (nodes.length === 0) {
    nodes.push({ text: line })
  }

  return nodes
}
