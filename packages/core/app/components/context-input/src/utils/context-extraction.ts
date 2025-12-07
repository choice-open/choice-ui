// 提取 mention 上下文的工具函数
export const extractMentionContext = (
  text: string,
  startIndex: number,
  endIndex: number,
  contextLength = 50,
) => {
  const beforeStart = Math.max(0, startIndex - contextLength)
  const afterEnd = Math.min(text.length, endIndex + contextLength)

  const before = text.slice(beforeStart, startIndex)
  const mention = text.slice(startIndex, endIndex)
  const after = text.slice(endIndex, afterEnd)

  return {
    mentionText: mention,
    fullContext: `...${before.trim()} [${mention}] ${after.trim()}...`,
  }
}
