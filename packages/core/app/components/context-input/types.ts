export interface MentionItem {
  description?: string
  id: string
  label: string
  metadata?: Record<string, unknown>
  prefix?: React.ReactNode
  type: "user" | "channel" | "tag" | "custom"
}

export interface MentionMatch {
  context?: {
    fullContext: string
    mentionText: string
  }
  endIndex: number
  item: MentionItem
  startIndex: number
  text: string
}

export interface ContextInputValue {
  mentions: MentionMatch[]
  text: string
}

export interface MentionTrigger {
  allowSpaceInQuery?: boolean
  char: string
  mentionRegex?: RegExp
  onSearch: (query: string, char: string) => Promise<MentionItem[]> | MentionItem[]
  renderItem?: (item: MentionItem, isSelected: boolean) => React.ReactNode
}

export interface ContextInputProps {
  autoFocus?: boolean
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  maxLength?: number
  maxSuggestions?: number
  mentionClassName?: string
  mentionPrefix?: string
  minHeight?: number

  // 事件回调
  onBlur?: () => void
  onChange?: (value: ContextInputValue) => void
  onCompositionEnd?: (event: React.CompositionEvent) => void
  onCompositionStart?: (event: React.CompositionEvent) => void
  onFocus?: () => void
  onKeyDown?: (event: React.KeyboardEvent) => void
  onMentionSelect?: (mention: MentionItem, trigger: string) => void

  placeholder?: string
  // 渲染自定义
  renderMention?: (mention: MentionMatch) => React.ReactNode
  renderSuggestion?: (item: MentionItem, isSelected: boolean) => React.ReactNode
  size?: "default" | "large"

  suggestionListClassName?: string
  // Mentions 配置
  triggers?: MentionTrigger[]
  value?: ContextInputValue
  variant?: "default" | "light" | "dark" | "reset"
}

// Slate.js 扩展类型
export interface ContextMentionElement {
  children: [{ text: "" }]
  mentionData?: MentionItem["metadata"]
  mentionId: string
  mentionLabel: string
  mentionPrefix?: string
  mentionType: MentionItem["type"]
  type: "mention"
}

export interface ContextParagraphElement {
  children: Array<ContextInputText | ContextMentionElement>
  type: "paragraph"
}

export type ContextInputElement = ContextMentionElement | ContextParagraphElement

export interface ContextInputText {
  text: string
}
