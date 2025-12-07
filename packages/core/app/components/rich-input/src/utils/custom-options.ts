import {
  ParagraphBold,
  ParagraphCode,
  ParagraphHeading1,
  ParagraphHeading2,
  ParagraphHeading3,
  ParagraphItalic,
  ParagraphList,
  ParagraphListOrdered,
  ParagraphListTodo,
  ParagraphPilcrow,
  ParagraphQuote,
  ParagraphStrikethrough,
  ParagraphUnderline,
} from "@choiceform/icons-react"
import React from "react"

// 使用简单的 emoji 图标替代，实际使用时可以替换为真实图标
export const charactersOptions = [
  {
    format: "bold",
    icon: React.createElement(ParagraphBold),
  },
  {
    format: "italic",
    icon: React.createElement(ParagraphItalic),
  },
  {
    format: "underlined",
    icon: React.createElement(ParagraphUnderline),
  },
  {
    format: "strikethrough",
    icon: React.createElement(ParagraphStrikethrough),
  },
  {
    format: "code",
    icon: React.createElement(ParagraphCode),
  },
]

export const paragraphOptions = [
  {
    format: "paragraph",
    icon: React.createElement(ParagraphPilcrow),
  },
  {
    format: "block_quote",
    icon: React.createElement(ParagraphQuote),
  },
  {
    format: "code",
    icon: React.createElement(ParagraphCode),
  },
  {
    format: "h1",
    icon: React.createElement(ParagraphHeading1),
  },
  {
    format: "h2",
    icon: React.createElement(ParagraphHeading2),
  },
  {
    format: "h3",
    icon: React.createElement(ParagraphHeading3),
  },
  {
    format: "numbered_list",
    icon: React.createElement(ParagraphListOrdered),
  },
  {
    format: "bulleted_list",
    icon: React.createElement(ParagraphList),
  },
  {
    format: "check_list",
    icon: React.createElement(ParagraphListTodo),
  },
]
