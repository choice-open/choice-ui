import type { HTMLAttributes } from "react"
import { useMarkdownFormatting } from "./hooks"

interface MentionItemProps {
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

export interface MdInputProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "children"> {
  children: React.ReactNode
  disabled?: boolean
  mentionItems?: MentionItemProps[]
  mentionOnSelect?: (item: MentionItemProps, query: string) => string
  onChange?: (value: string) => void
  readOnly?: boolean
  value?: string
}

export interface MentionState {
  closeMentionSearch: () => void
  filteredItems: MentionItemProps[]
  handleSelect: (item: MentionItemProps) => void
  isOpen: boolean
  position: { x: number; y: number } | null
  query: string
}

export interface MdInputContextValue {
  activeTab: "write" | "preview"
  disabled?: boolean
  handleToolbarAction: (action: string) => void
  hasTabs: boolean
  insertListPrefix: ReturnType<typeof useMarkdownFormatting>["insertListPrefix"]
  insertText: ReturnType<typeof useMarkdownFormatting>["insertText"]
  mentionItems?: MentionItemProps[]
  mentionOnSelect?: (item: MentionItemProps, query: string) => string
  mentionState?: MentionState
  onChange?: (value: string) => void
  readOnly?: boolean
  setActiveTab: (tab: "write" | "preview") => void
  setMentionState?: (state: MentionState) => void
  textareaRef: React.RefObject<HTMLTextAreaElement>
  value: string
  wrapText: ReturnType<typeof useMarkdownFormatting>["wrapText"]
}

export interface ToolbarAction {
  icon?: React.ReactNode
  id: string
  label?: string
}

export interface ToolbarProps {
  afterElement?: React.ReactNode
  beforeElement?: React.ReactNode
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  groups?: ToolbarAction[][]
  i18n?: {
    bold: string
    code: string
    "code-block": string
    heading: string
    italic: string
    "ordered-list": string
    quote: string
    "task-list": string
    "unordered-list": string
  }
  onAction?: (action: string) => void
  visible?: boolean
  visibleActions?: string[]
}
