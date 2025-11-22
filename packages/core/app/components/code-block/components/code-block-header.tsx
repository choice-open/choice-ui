import { CircleCirclehecirclek, ClipboardSmall, Enlarge, FileCode } from "@choiceform/icons-react"
import React, { memo } from "react"
import { IconButton } from "~/components/icon-button"
import { tcv } from "~/utils"
import type { CodeBlockHeaderProps } from "../types"
import { getDefaultFilenameForLanguage, getIconFromFilename, getLanguageIcon } from "../utils"

const codeBlockHeaderTv = tcv({
  slots: {
    header: "text-body-medium code-header flex h-8 items-center justify-between pr-1 pl-2",
    title: "flex items-center gap-1",
    filename: "text-secondary-foreground",
    actions: "flex items-center",
    button: "opacity-0 group-hover:opacity-100",
    lineCount: "text-success-foreground ml-2 font-strong",
  },
  variants: {
    isExpanded: {
      true: { header: "bg-secondary-background" },
      false: {},
    },
  },
  defaultVariants: {
    isExpanded: true,
  },
})

export const CodeBlockHeader = memo(function CodeBlockHeader(props: CodeBlockHeaderProps) {
  const {
    className,
    codeBlock,
    showLineCount = true,
    i18n = {
      collapse: "Collapse",
      copied: "Copied",
      copy: "Copy",
      expand: "Expand",
    },
    children,
  } = props

  if (!codeBlock) return null

  const {
    language = "code",
    filename,
    lineCount = 0,
    isExpanded = true,
    copied = false,
    expandable = true,
    handleExpand,
    handleCopy,
  } = codeBlock

  // Guard against missing handlers
  if (!handleExpand || !handleCopy) {
    return null
  }

  const tv = codeBlockHeaderTv({ isExpanded })

  // Determine which icon to use
  let icon = null as React.ReactNode
  try {
    if (filename && typeof filename === "string") {
      const filenameIcon = getIconFromFilename(filename)
      if (filenameIcon) icon = filenameIcon
    }
    if (!icon && language) {
      icon = getLanguageIcon(language)
    }
  } catch {
    // Fallback to default icon
    icon = null
  }

  const copyTooltipContent = copied ? i18n.copied : i18n.copy
  const expandTooltipContent = isExpanded ? i18n.collapse : i18n.expand

  return (
    <div className={tv.header({ className })}>
      <div className={tv.title()}>
        {icon ? <span className="size-4 flex-shrink-0">{icon}</span> : <FileCode />}
        {filename ? (
          <span className={tv.filename()}>{filename}</span>
        ) : (
          <span className={tv.filename()}>{getDefaultFilenameForLanguage(language)}</span>
        )}
        {showLineCount && lineCount > 0 && (
          <span className={tv.lineCount()}>{`+ ${lineCount}`}</span>
        )}
        {children}
      </div>

      <div className={tv.actions()}>
        {isExpanded && (
          <IconButton
            className={tv.button()}
            variant="ghost"
            onClick={() => handleCopy()}
            tooltip={{ content: copyTooltipContent }}
          >
            {copied ? (
              <CircleCirclehecirclek className="text-success-foreground" />
            ) : (
              <ClipboardSmall />
            )}
          </IconButton>
        )}
        {expandable && (
          <IconButton
            className={tv.button()}
            variant="ghost"
            onClick={handleExpand}
            tooltip={{
              content: expandTooltipContent,
            }}
          >
            <Enlarge />
          </IconButton>
        )}
      </div>
    </div>
  )
})
