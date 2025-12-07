import type { HTMLProps, ReactNode, RefObject } from "react"

// ============================================================================
// Context Types
// ============================================================================

export interface CodeBlockContextValue {
  codeExpanded: boolean
  contentRef?: RefObject<HTMLDivElement>
  copied: boolean
  expandable?: boolean
  filename?: string
  handleCodeExpand: () => void
  handleCopy: (code?: string) => void
  handleExpand: () => void
  isExpanded: boolean
  language: string
  lineCount: number
  lineThreshold: number
  needsScroll: boolean
  scrollRef?: RefObject<HTMLDivElement>
}

export interface CodeBlockInjectedProps {
  codeBlock?: CodeBlockContextValue
}

// ============================================================================
// Component Props
// ============================================================================

export interface CodeBlockProps {
  children?: ReactNode
  className?: string
  defaultCodeExpanded?: boolean
  defaultExpanded?: boolean
  expandable?: boolean
  filename?: string
  language?: string
  lineThreshold?: number
  onCodeExpandChange?: (expanded: boolean) => void
  onExpandChange?: (expanded: boolean) => void
}

export interface CodeBlockHeaderProps extends CodeBlockInjectedProps {
  children?: ReactNode
  className?: string
  i18n?: {
    collapse: string
    copied: string
    copy: string
    expand: string
  }
  showLineCount?: boolean
}

export interface CodeBlockFooterProps extends CodeBlockInjectedProps {
  className?: string
}

export interface CodeBlockContentProps extends CodeBlockInjectedProps {
  className?: string
  code: string
  language?: string
  withScrollArea?: boolean
}

export interface CodeBlockCodeProps extends HTMLProps<HTMLDivElement> {
  className?: string
  code: string
  codeBlockId?: string
  language?: string
}

// ============================================================================
// Hook Types
// ============================================================================

export interface UseCodeBlockOptions {
  defaultCodeExpanded?: boolean
  defaultExpanded?: boolean
  onCodeExpandChange?: (expanded: boolean) => void
  onExpandChange?: (expanded: boolean) => void
  scrollToBottom?: () => void
}

export interface UseCodeBlockReturn {
  codeExpanded: boolean
  copied: boolean
  handleCodeExpand: () => void
  handleCopy: (code: string) => void
  handleExpand: () => void
  isExpanded: boolean
}

export interface UseScrollDetectionOptions {
  children?: ReactNode
  codeExpanded: boolean
  contentRef: RefObject<HTMLDivElement>
  isExpanded: boolean
  scrollRef: RefObject<HTMLDivElement>
}
