import { CodeBlock as CodeBlockRoot } from "./code-block"
import { CodeBlockHeader, CodeBlockFooter, CodeBlockContent, CodeBlockCode } from "./components"

// Create compound component
export const CodeBlock = Object.assign(CodeBlockRoot, {
  Code: CodeBlockCode,
  Content: CodeBlockContent,
  Footer: CodeBlockFooter,
  Header: CodeBlockHeader,
})

// Export individual components for backward compatibility
export { CodeBlockCode } from "./components"

// Export all types from centralized types.ts
export type {
  // Main component props
  CodeBlockProps,
  CodeBlockHeaderProps,
  CodeBlockFooterProps,
  CodeBlockContentProps,
  CodeBlockCodeProps,

  // Context and utility types
  CodeBlockContextValue,
  CodeBlockInjectedProps,

  // Hook types
  UseCodeBlockOptions,
  UseCodeBlockReturn,
  UseScrollDetectionOptions,
} from "./types"

export { getDefaultFilenameForLanguage } from "./utils"
