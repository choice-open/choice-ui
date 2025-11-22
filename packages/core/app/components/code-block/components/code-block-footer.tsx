import { ChevronDownSmall, ChevronUpSmall } from "@choiceform/icons-react"
import { memo } from "react"
import { tcv } from "@choiceform/design-system"
import type { CodeBlockFooterProps } from "../types"

const codeBlockFooterTv = tcv({
  slots: {
    footer: "flex h-6 items-center justify-center px-2",
    icon: "",
  },
  variants: {
    codeExpanded: {
      true: {
        footer: "bg-transparent-background hover:bg-tertiary-background",
        icon: "opacity-0 group-hover:opacity-100",
      },
      false: {
        footer: [
          "bg-secondary-background/90 absolute inset-x-0 bottom-0 z-3",
          "opacity-0 group-hover:opacity-100",
          "hover:bg-tertiary-background",
        ],
      },
    },
  },
  defaultVariants: {
    codeExpanded: false,
  },
})

export const CodeBlockFooter = memo(function CodeBlockFooter(props: CodeBlockFooterProps) {
  const { className, codeBlock } = props

  if (!codeBlock) return null

  const { isExpanded, codeExpanded, handleCodeExpand, lineCount, lineThreshold, needsScroll } =
    codeBlock

  const tv = codeBlockFooterTv({ codeExpanded })

  // Only show footer if content needs scrolling
  if (!(lineCount > lineThreshold || needsScroll || codeExpanded) || !isExpanded) {
    return null
  }

  return (
    <div
      className={tv.footer({ className })}
      onClick={handleCodeExpand}
    >
      <div className={tv.icon()}>{codeExpanded ? <ChevronUpSmall /> : <ChevronDownSmall />}</div>
    </div>
  )
})
