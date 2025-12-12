import { ComponentType } from "react"
import { RenderElementProps } from "slate-react"

export interface MentionProps extends RenderElementProps {
  mentionPrefix?: string
  renderMention?: (mention: MentionMatch) => React.ReactNode
  variant?: "default" | "light" | "dark" | "reset"
}

export interface MentionItemProps {
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
  item: MentionItemProps
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
  onSearch: (query: string, char: string) => Promise<MentionItemProps[]> | MentionItemProps[]
  renderItem?: (item: MentionItemProps, isSelected: boolean) => React.ReactNode
}

export interface ContextInputProps {
  afterElement?: React.ReactNode
  autoFocus?: boolean
  beforeElement?: React.ReactNode
  children?: React.ReactNode
  className?: string
  // Custom Mention component
  customMentionComponent?: ComponentType<MentionProps>
  disabled?: boolean
  maxLength?: number
  maxSuggestions?: number
  mentionClassName?: string
  mentionPrefix?: string
  minHeight?: number
  // Event callbacks
  onBlur?: () => void
  onChange?: (value: ContextInputValue) => void
  onCompositionEnd?: (event: React.CompositionEvent) => void
  onCompositionStart?: (event: React.CompositionEvent) => void
  onFocus?: () => void
  onKeyDown?: (event: React.KeyboardEvent) => void
  onMentionSelect?: (mention: MentionItemProps, trigger: string) => void
  placeholder?: string

  readOnly?: boolean
  // Custom rendering
  renderMention?: (mention: MentionMatch) => React.ReactNode
  renderSuggestion?: (item: MentionItemProps, isSelected: boolean) => React.ReactNode
  root?: HTMLElement | null
  size?: "default" | "large"

  suggestionListClassName?: string
  // Mentions configuration
  triggers?: MentionTrigger[]
  value?: ContextInputValue
  variant?: "default" | "light" | "dark" | "reset"
}

// Slate.js 扩展类型
export interface ContextMentionElement {
  children: [{ text: "" }]
  mentionData?: MentionItemProps["metadata"]
  mentionId: string
  mentionLabel: string
  mentionPrefix?: string
  mentionType: MentionItemProps["type"]
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

export interface ContextInputRef {
  focus: () => void
}
