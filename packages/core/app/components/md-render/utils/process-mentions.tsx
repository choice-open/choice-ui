import { Fragment } from "react"
import type { MentionItemProps, MentionRenderProps } from "../types"

export function processMentionsInText(
  text: string,
  MentionComponent?: React.ComponentType<MentionRenderProps>,
  mentionItems?: MentionItemProps[],
): React.ReactNode[] {
  // 边缘情况：没有 MentionComponent 或文本为空
  if (!MentionComponent || !text) {
    return [text]
  }

  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let key = 0

  // 如果有 mentionItems，优先匹配已知的 label（按长度从长到短排序，优先匹配更长的名字）
  // 过滤掉空字符串和无效的 label
  const sortedLabels = mentionItems
    ? [...mentionItems]
        .map((item) => item?.label)
        .filter((label): label is string => typeof label === "string" && label.length > 0)
        .sort((a, b) => b.length - a.length)
    : []

  // 匹配 @ 符号
  const atSymbolRegex = /@/g
  let match

  while ((match = atSymbolRegex.exec(text)) !== null) {
    const atIndex = match.index
    const beforeMatch = text.substring(lastIndex, atIndex)
    if (beforeMatch) {
      parts.push(beforeMatch)
    }

    // 从 @ 符号后开始查找匹配的 mention
    const textAfterAt = text.substring(atIndex + 1)

    // 边缘情况：@ 后面没有内容（字符串结尾）
    if (textAfterAt.length === 0) {
      parts.push("@")
      lastIndex = atIndex + 1
      continue
    }

    let matchedMention: string | null = null
    let matchedLength = 0

    // 优先尝试匹配 mentionItems 中的 label
    // 如果 label 在 mentionItems 中，直接匹配这个 label
    // 但要确保是完整匹配，不是部分匹配（如 "Jane" 不应该匹配到 "Jane Smith"）
    if (sortedLabels.length > 0) {
      for (const label of sortedLabels) {
        // 边缘情况：label 为空字符串，跳过
        if (!label || label.length === 0) {
          continue
        }

        // 精确匹配 label，检查是否以 label 开头
        if (textAfterAt.startsWith(label)) {
          const afterLabel = textAfterAt.substring(label.length)
          // 如果后面是空字符串、空格、标点符号或换行符，说明 label 匹配完整
          // 如果后面直接是单词字符，可能是部分匹配，跳过（因为我们已经按长度排序，更长的会先匹配）
          if (afterLabel === "" || /^[\s.,!?;:)\]}\n\r]/.test(afterLabel)) {
            matchedMention = label
            matchedLength = label.length
            break
          }
        }
      }
    }

    // 如果没有找到匹配的 label，使用正则匹配单词字符（但限制匹配范围）
    if (!matchedMention) {
      // 边缘情况：@ 后面直接是空格、标点符号或换行符，不匹配
      if (/^[\s.,!?;:)\]}\n\r]/.test(textAfterAt)) {
        parts.push("@")
        lastIndex = atIndex + 1
        continue
      }

      // 只匹配第一个单词，或者最多匹配两个单词（名字通常是 1-2 个单词）
      // 使用非贪婪匹配，遇到边界就停止
      const fallbackRegex = /^[\w]+(?:\s+[\w]+)?/
      const fallbackMatch = textAfterAt.match(fallbackRegex)
      if (fallbackMatch) {
        const matchedText = fallbackMatch[0]
        const afterMatch = textAfterAt.substring(matchedText.length)
        // 使用相同的边界检查逻辑
        if (
          afterMatch === "" ||
          /^[\s.,!?;:)\]}\n\r]/.test(afterMatch) ||
          (/^\s/.test(afterMatch) && !/^\s+[\w]/.test(afterMatch))
        ) {
          matchedMention = matchedText.trim()
          matchedLength = matchedText.length
        }
      }
    }

    if (matchedMention) {
      parts.push(
        <MentionComponent
          key={`mention-${key++}`}
          mention={matchedMention}
          mentionItems={mentionItems}
        />,
      )
      lastIndex = atIndex + 1 + matchedLength
    } else {
      // 如果没有匹配到，保留 @ 符号
      parts.push("@")
      lastIndex = atIndex + 1
    }
  }

  const remaining = text.substring(lastIndex)
  if (remaining) {
    parts.push(remaining)
  }

  return parts.length > 0 ? parts : [text]
}

export function processMentionsInChildren(
  children: React.ReactNode,
  MentionComponent?: React.ComponentType<MentionRenderProps>,
  mentionItems?: MentionItemProps[],
): React.ReactNode {
  // 边缘情况：没有 MentionComponent
  if (!MentionComponent) {
    return children
  }

  // 边缘情况：children 为 null 或 undefined
  if (children == null) {
    return children
  }

  // 边缘情况：children 是字符串
  if (typeof children === "string") {
    // 空字符串直接返回
    if (children.length === 0) {
      return children
    }
    const processed = processMentionsInText(children, MentionComponent, mentionItems)
    return processed.length === 1 ? processed[0] : <Fragment>{processed}</Fragment>
  }

  // 边缘情况：children 是数组
  if (Array.isArray(children)) {
    // 空数组直接返回
    if (children.length === 0) {
      return children
    }
    return children.map((child, index) => {
      // 边缘情况：数组中的 child 为 null 或 undefined
      if (child == null) {
        return child
      }
      if (typeof child === "string") {
        // 空字符串直接返回
        if (child.length === 0) {
          return child
        }
        const processed = processMentionsInText(child, MentionComponent, mentionItems)
        return processed.length === 1 ? processed[0] : <Fragment key={index}>{processed}</Fragment>
      }
      // 其他类型的 child（React 元素、数字等）直接返回
      // markdown renderer 已经处理了这些情况
      return child
    })
  }

  // 其他类型的 children（React 元素、数字等）直接返回
  return children
}
