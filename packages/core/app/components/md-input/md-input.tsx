import React, { forwardRef, memo, useMemo, useRef, useState } from "react"
import { useEventCallback } from "usehooks-ts"
import { tcx } from "~/utils"
import { MdInputContainer } from "./components/md-input-container"
import { MdInputEditor } from "./components/md-input-editor"
import { MdInputFooter } from "./components/md-input-footer"
import { MdInputHeader } from "./components/md-input-header"
import { MdInputRender } from "./components/md-input-render"
import { MdInputTabs } from "./components/md-input-tabs"
import { Toolbar } from "./components/toolbar"
import { MdInputContext } from "./context"
import { useMarkdownFormatting } from "./hooks"
import { mdInputTv } from "./tv"
import type { MdInputProps, MdInputContextValue } from "./types"

const MdInputRoot = memo(
  forwardRef<HTMLDivElement, MdInputProps>(function MdInput(props, ref) {
    const {
      value = "",
      onChange,
      className,
      disabled,
      readOnly,
      mentionItems,
      mentionOnSelect,
      children,
      ...rest
    } = props

    if (!children) {
      throw new Error(
        "MdInput requires children. Please use MdInput.Header, MdInput.Container, etc. to compose the component.",
      )
    }

    const [activeTab, setActiveTab] = useState<"write" | "preview">("write")
    const [mentionState, setMentionState] = useState<MdInputContextValue["mentionState"]>(undefined)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const { insertText, wrapText, insertListPrefix } = useMarkdownFormatting(textareaRef)

    // 检测是否有 Tabs 组件
    const hasTabs = useMemo(() => {
      let foundTabs = false
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === MdInputTabs) {
            foundTabs = true
          } else if (child.type === MdInputHeader) {
            // 检查 Header 的 children 中是否有 Tabs
            React.Children.forEach(child.props.children, (headerChild) => {
              if (React.isValidElement(headerChild) && headerChild.type === MdInputTabs) {
                foundTabs = true
              }
            })
          }
        }
      })
      return foundTabs
    }, [children])

    const handleChange = useEventCallback((newValue: string) => {
      onChange?.(newValue)
    })

    const handleToolbarAction = useEventCallback((action: string) => {
      switch (action) {
        case "heading":
          wrapText("### ", "", onChange)
          break
        case "bold":
          wrapText("**", "**", onChange)
          break
        case "italic":
          wrapText("*", "*", onChange)
          break
        case "unordered-list":
          insertListPrefix("- ", onChange)
          break
        case "ordered-list":
          insertListPrefix("1. ", onChange)
          break
        case "task-list":
          insertListPrefix("- [ ] ", onChange)
          break
        case "code":
          wrapText("`", "`", onChange)
          break
        case "code-block":
          wrapText("```\n", "\n```", onChange)
          break
        case "quote":
          insertListPrefix("> ", onChange)
          break
        case "link":
          wrapText("[", "](url)", onChange)
          break
        default:
          break
      }
    })

    const contextValue = useMemo<MdInputContextValue>(
      () => ({
        activeTab,
        setActiveTab,
        hasTabs,
        value,
        onChange: handleChange,
        textareaRef,
        insertText,
        wrapText,
        insertListPrefix,
        handleToolbarAction,
        disabled,
        readOnly,
        mentionItems,
        mentionOnSelect,
        mentionState,
        setMentionState,
      }),
      [
        activeTab,
        hasTabs,
        value,
        handleChange,
        insertText,
        wrapText,
        insertListPrefix,
        handleToolbarAction,
        disabled,
        readOnly,
        mentionItems,
        mentionOnSelect,
        mentionState,
      ],
    )

    const tv = mdInputTv({ disabled, readOnly })

    return (
      <MdInputContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={tcx(tv.root(), className)}
          {...rest}
        >
          {children}
        </div>
      </MdInputContext.Provider>
    )
  }),
)

MdInputRoot.displayName = "MdInput"

interface MdInputComponent
  extends React.ForwardRefExoticComponent<MdInputProps & React.RefAttributes<HTMLDivElement>> {
  Container: typeof MdInputContainer
  Editor: typeof MdInputEditor
  Footer: typeof MdInputFooter
  Header: typeof MdInputHeader
  Render: typeof MdInputRender
  Tabs: typeof MdInputTabs
  Toolbar: typeof Toolbar
}

export const MdInput = Object.assign(MdInputRoot, {
  Header: MdInputHeader,
  Tabs: MdInputTabs,
  Toolbar: Toolbar,
  Container: MdInputContainer,
  Editor: MdInputEditor,
  Render: MdInputRender,
  Footer: MdInputFooter,
}) as MdInputComponent
