import { tcv } from "~/utils"

export const mdRenderTv = tcv({
  slots: {
    root: "md max-w-none p-2",
    paragraph: "md-p",
    h1: "md-h1",
    h2: "md-h2",
    h3: "md-h3",
    h4: "md-h4",
    h5: "md-h5",
    h6: "md-h6",
    ul: "md-ul",
    ol: "md-ol",
    li: "md-li",
    blockquote: "md-blockquote",
    hr: "md-hr",
    a: "md-a",
    code: "md-code",
    pre: "md-pre",
    table: "md-table",
    th: "md-th",
    td: "md-td",
    tr: "md-tr",
    thead: "md-thead",
    tbody: "md-tbody",
    tableWrapper: "md-table-wrapper",
    strong: "md-strong",
    em: "md-em",
    del: "md-del",
    img: "md-img",
    checkbox: "md-checkbox",
  },
  variants: {
    size: {
      default: {},
      small: {
        root: "md-compact",
      },
      large: {
        root: "md-large",
      },
    },
    hasCheckbox: {
      true: {
        li: "md-li-task",
      },
      false: {},
    },
  },
  defaultVariants: {
    size: "default",
    hasCheckbox: false,
  },
})
