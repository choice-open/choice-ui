import React, { forwardRef, useImperativeHandle, useMemo, useRef } from "react"
import { ReactEditor } from "slate-react"
import { useEventCallback } from "usehooks-ts"
import {
  ContextInputFooter,
  ContextInputHeader,
  CopyButton,
  InsertMentionsButton,
  Mention,
  MentionMenu,
  type MentionMenuRef,
  SlateEditor,
} from "./components"
import { ContextInputEditorContext, useContextInput, useMentions, useSlateEditor } from "./hooks"
import { contextInputTv } from "./tv"
import type { ContextInputProps, ContextInputRef, MentionItemProps, MentionTrigger } from "./types"

// Empty array constant to avoid creating new references on each render
const EMPTY_TRIGGERS: MentionTrigger[] = []

interface ContextInputComponent extends React.ForwardRefExoticComponent<
  ContextInputProps & React.RefAttributes<ContextInputRef>
> {
  CopyButton: typeof CopyButton
  Footer: typeof ContextInputFooter
  Header: typeof ContextInputHeader
  InsertMentionsButton: typeof InsertMentionsButton
  Mention: typeof Mention
}

// Main ContextInput component
const ContextInputBase = forwardRef<ContextInputRef, ContextInputProps>(function ContextInputBase(
  {
    value,
    placeholder = "Type someone...",
    disabled = false,
    readOnly = false,
    maxLength,
    autoFocus = false,
    className,
    customMentionComponent,
    triggers = EMPTY_TRIGGERS,
    maxSuggestions = 10,
    variant = "default",
    mentionPrefix = "@",
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    onCompositionStart,
    onCompositionEnd,
    onMentionSelect,
    renderMention,
    renderSuggestion,
    children,
    size = "default",
    minHeight = 80,
    afterElement,
    beforeElement,
    root,
    ...props
  },
  ref,
) {
  // Create editor instance
  const editor = useSlateEditor(maxLength)

  // MentionMenu ref
  const mentionMenuRef = useRef<MentionMenuRef>(null)

  // Expose focus method to external components
  useImperativeHandle(ref, () => ({
    focus: () => {
      try {
        ReactEditor.focus(editor)
      } catch {
        // Editor may not be mounted or already unmounted, ignore error
      }
    },
  }))

  const handleFocusClick = useEventCallback(() => {
    try {
      ReactEditor.focus(editor)
    } catch {
      // Editor may not be mounted or already unmounted, ignore error
    }
  })

  // Separate header and footer children - optimized with useMemo
  const { header, footer, otherChildren } = useMemo(() => {
    let header: React.ReactNode = null
    let footer: React.ReactNode = null
    const otherChildren: React.ReactNode[] = []

    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        if (child.type === ContextInputHeader) {
          header = React.cloneElement(child, {
            ...child.props,
            size: size as "default" | "large",
            handleClick: handleFocusClick,
          })
        } else if (child.type === ContextInputFooter) {
          // Automatically pass size prop to footer
          footer = React.cloneElement(child, {
            ...child.props,
            size: size as "default" | "large",
            handleClick: handleFocusClick,
          })
        } else {
          otherChildren.push(child)
        }
      } else {
        otherChildren.push(child)
      }
    })

    return { header, footer, otherChildren }
  }, [children, size, handleFocusClick])
  const hasHeader = !!header
  const hasFooter = !!footer

  // Handle mention search close
  const handleSearchClose = useEventCallback(() => {
    ReactEditor.focus(editor)
  })

  // Mentions hook
  const mentions = useMentions({
    editor,
    triggers,
    maxSuggestions,
    mentionPrefix,
    onMentionSelect,
    onSearchClose: handleSearchClose,
  })

  // Context input state management
  const { slateValue, handleChange: baseHandleChange } = useContextInput({
    value,
    onChange: readOnly ? undefined : onChange,
    editor,
    autoFocus,
  })

  // Wrap handleChange to check mention on content change
  const handleChange = useEventCallback((newValue: import("slate").Descendant[]) => {
    baseHandleChange(newValue)
    // Defer mention check to avoid multiple state updates in same render cycle causing focus loss
    requestAnimationFrame(() => {
      mentions.checkMentionSearch()
    })
  })

  // Keyboard event handler
  const handleKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    // First try to let MentionMenu handle keyboard events
    if (mentionMenuRef.current?.handleKeyDown(event)) {
      return
    }

    // Handle other keyboard events
    onKeyDown?.(event)
  })

  // Handle suggestion selection
  const handleSuggestionSelect = useEventCallback((mention: MentionItemProps, index: number) => {
    mentions.selectMention(index)
  })

  // Cache style object
  const tv = useMemo(
    () => contextInputTv({ hasHeader, hasFooter, size, disabled, variant }),
    [hasHeader, hasFooter, size, disabled, variant],
  )

  return (
    <ContextInputEditorContext.Provider value={editor}>
      {beforeElement}
      <div className={tv.container({ className })}>
        {header}
        <SlateEditor
          size={size}
          hasHeader={hasHeader}
          hasFooter={hasFooter}
          editor={editor}
          slateValue={slateValue}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          maxLength={maxLength}
          autoFocus={autoFocus}
          variant={variant}
          mentionPrefix={mentionPrefix}
          customMentionComponent={customMentionComponent}
          renderMention={renderMention}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onCompositionStart={onCompositionStart}
          onCompositionEnd={onCompositionEnd}
          onFocus={onFocus}
          onBlur={onBlur}
          minHeight={minHeight}
          {...props}
        >
          {otherChildren}
        </SlateEditor>
        {footer}
      </div>
      {afterElement}
      <MentionMenu
        ref={mentionMenuRef}
        disabled={disabled}
        isOpen={mentions.searchState.isSearching && !!mentions.searchState.position}
        onClose={mentions.closeMentionSearch}
        suggestions={mentions.searchState.suggestions}
        loading={mentions.searchState.loading}
        position={mentions.searchState.position}
        onSelect={handleSuggestionSelect}
        renderSuggestion={renderSuggestion}
      />
    </ContextInputEditorContext.Provider>
  )
})

const ContextInput = ContextInputBase as ContextInputComponent
ContextInput.Header = ContextInputHeader
ContextInput.Footer = ContextInputFooter
ContextInput.CopyButton = CopyButton
ContextInput.InsertMentionsButton = InsertMentionsButton
ContextInput.Mention = Mention

export { ContextInput }
