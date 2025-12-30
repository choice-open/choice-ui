import { IconButton } from "@choice-ui/icon-button"
import { tcv } from "@choice-ui/shared"
import { Check, ClipboardSmall, Enlarge, FileCode } from "@choiceform/icons-react"
import React, { memo } from "react"
import type { CodeBlockHeaderProps } from "../types"
import { getDefaultFilenameForLanguage, getIconFromFilename, getLanguageIcon } from "../utils"

const codeBlockHeaderTv = tcv({
  slots: {
    header: "text-body-medium code-header flex h-8 items-center justify-between pr-1 pl-2",
    title: "flex items-center gap-1",
    filename: "",
    actions: "flex items-center",
    button: "opacity-0 group-hover/code-block:opacity-100",
    lineCount: "text-success-foreground ml-2 font-strong",
  },
  variants: {
    isExpanded: {
      true: {},
      false: {},
    },
    variant: {
      default: {
        filename: "text-secondary-foreground",
      },
      light: {
        filename: "text-gray-900",
      },
      dark: {
        filename: "text-white",
      },
    },
  },
  compoundVariants: [
    {
      variant: "default",
      isExpanded: true,
      class: {
        header: "bg-secondary-background",
      },
    },
    {
      variant: "light",
      isExpanded: true,
      class: {
        header: "bg-gray-100",
      },
    },
    {
      variant: "dark",
      isExpanded: true,
      class: {
        header: "bg-gray-700",
      },
    },
  ],
  defaultVariants: {
    isExpanded: true,
  },
})

export const CodeBlockHeader = memo(function CodeBlockHeader(props: CodeBlockHeaderProps) {
  const {
    className,
    codeBlock,
    showLineCount = false,
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
    variant,
  } = codeBlock

  // Check if handlers are available for enabling buttons
  const canExpand = Boolean(handleExpand)
  const canCopy = Boolean(handleCopy)

  const tv = codeBlockHeaderTv({ isExpanded, variant })

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
        {isExpanded && canCopy && (
          <IconButton
            className={tv.button()}
            variant={variant === "dark" ? "dark" : "ghost"}
            onClick={() => handleCopy?.()}
            tooltip={{ content: copyTooltipContent }}
          >
            {copied ? <Check className="text-success-foreground" /> : <ClipboardSmall />}
          </IconButton>
        )}
        {expandable && canExpand && (
          <IconButton
            className={tv.button()}
            variant={variant === "dark" ? "dark" : "ghost"}
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
