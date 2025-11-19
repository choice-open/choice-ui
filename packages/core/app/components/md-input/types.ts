import type { HTMLAttributes } from "react"

export interface MentionItemProps {
  [key: string]: unknown
  id: string
  label: string
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

export interface MdInputProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "children"> {
  allowedPrefixes?: string[]
  children: React.ReactNode
  customColor?: {
    codeBackground?: string
    defaultBackground?: string
    defaultBoundary?: string
    defaultForeground?: string
    secondaryBackground?: string
    secondaryForeground?: string
  }
  disabled?: boolean
  mentionItems?: MentionItemProps[]
  mentionOnSelect?: (item: MentionItemProps, query: string) => string
  mentionRenderComponent?: React.ComponentType<MentionRenderProps>
  onChange?: (value: string) => void
  readOnly?: boolean
  theme?: "light" | "dark"
  value?: string
}
