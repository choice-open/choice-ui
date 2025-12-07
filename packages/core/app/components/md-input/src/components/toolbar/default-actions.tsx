import {
  FontBoldSmall,
  ParagraphCode,
  ParagraphCodeBlock,
  ParagraphHeading,
  ParagraphItalic,
  ParagraphList,
  ParagraphListOrdered,
  ParagraphListTodo,
  ParagraphQuote,
} from "@choiceform/icons-react"
import type { ToolbarAction } from "../../types"

export const DEFAULT_TOOLBAR_GROUPS: ToolbarAction[][] = [
  [
    { id: "heading", label: "Heading", icon: <ParagraphHeading /> },
    { id: "bold", label: "Bold", icon: <FontBoldSmall /> },
    { id: "italic", label: "Italic", icon: <ParagraphItalic /> },
  ],
  [
    { id: "quote", label: "Quote", icon: <ParagraphQuote /> },
    { id: "code", label: "Code", icon: <ParagraphCode /> },
    { id: "code-block", label: "Code block", icon: <ParagraphCodeBlock /> },
  ],
  [
    { id: "unordered-list", label: "Unordered list", icon: <ParagraphList /> },
    { id: "ordered-list", label: "Ordered list", icon: <ParagraphListOrdered /> },
    { id: "task-list", label: "Task list", icon: <ParagraphListTodo /> },
  ],
]
