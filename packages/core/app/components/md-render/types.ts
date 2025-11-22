interface MentionItemProps {
  [key: string]: unknown
  id: string
  label: string
}

export interface MdRenderProps {
  allowedPrefixes?: string[]
  className?: string
  content: string
  customColor?: {
    codeBackground?: string
    defaultBackground?: string
    defaultBoundary?: string
    defaultForeground?: string
    secondaryBackground?: string
    secondaryForeground?: string
  }
  mentionItems?: MentionItemProps[]
  mentionRenderComponent?: React.ComponentType<MentionRenderProps>
  size?: "small" | "default" | "large"
  variant?: "github" | "default"
}

export interface UseMentionsOptions {
  disabled?: boolean
  items?: MentionItemProps[]
  onChange?: (value: string) => void
  onSelect?: (item: MentionItemProps, query: string) => string
  readOnly?: boolean
}

export interface MentionRenderProps {
  mention: string
  mentionItems?: MentionItemProps[]
}
