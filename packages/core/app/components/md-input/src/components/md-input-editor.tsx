import { mergeRefs, tcx } from "@choiceform/design-shared"
import { Textarea, type TextareaProps } from "@choiceform/textarea"
import { forwardRef, memo, useEffect, useRef } from "react"
import { useEventCallback } from "usehooks-ts"
import { useMdInputContext } from "../context"
import { useMarkdownMentions, useMarkdownShortcuts } from "../hooks"
import { mdInputTv } from "../tv"
import type { MentionState } from "../types"

export interface MdInputEditorProps extends Omit<TextareaProps, "value" | "onChange"> {
  className?: string
}

export const MdInputEditor = memo(
  forwardRef<HTMLTextAreaElement, MdInputEditorProps>((props, ref) => {
    const { placeholder = "", className, minRows = 6, maxRows = 10, ...rest } = props
    const {
      value,
      onChange,
      textareaRef,
      insertText,
      wrapText,
      disabled,
      readOnly,
      activeTab,
      hasTabs,
      mentionItems,
      mentionOnSelect,
      setMentionState,
    } = useMdInputContext()

    const mentionHook = useMarkdownMentions({
      items: mentionItems,
      onSelect: mentionOnSelect,
      onChange,
      disabled,
      readOnly,
    })

    const {
      handleInputChange: handleMentionInputChange,
      handleKeyDown: handleMentionKeyDown,
      setTextareaRef: setMentionTextareaRef,
      isOpen,
      position,
      query,
      filteredItems,
      handleSelect,
    } = mentionHook

    const prevMentionStateRef = useRef<MentionState | null>(null)

    useEffect(() => {
      if (textareaRef.current) {
        setMentionTextareaRef(textareaRef.current)
      }
    }, [textareaRef, setMentionTextareaRef])

    useEffect(() => {
      // 只在有 mentionItems 时才设置 mentionState，避免无限循环
      if (!setMentionState || !mentionItems || mentionItems.length === 0) {
        return
      }

      const newState: MentionState = {
        isOpen,
        position,
        query,
        filteredItems,
        handleSelect,
        closeMentionSearch: mentionHook.closeMentionSearch,
      }

      // 检查状态是否真的改变了，避免不必要的更新
      const prev = prevMentionStateRef.current
      if (
        prev &&
        prev.isOpen === newState.isOpen &&
        prev.position === newState.position &&
        prev.query === newState.query &&
        prev.filteredItems === newState.filteredItems
      ) {
        // 状态没有改变，不需要更新
        return
      }

      prevMentionStateRef.current = newState
      setMentionState(newState)
    }, [
      isOpen,
      position,
      query,
      filteredItems,
      handleSelect,
      mentionHook.closeMentionSearch,
      setMentionState,
      mentionItems,
    ])

    const { handleKeyDown } = useMarkdownShortcuts({
      textareaRef,
      insertText,
      wrapText,
      onChange,
      disabled,
      readOnly,
    })

    const handleChange = useEventCallback((newValue: string) => {
      if (textareaRef.current) {
        handleMentionInputChange(newValue, textareaRef.current, onChange)
      } else {
        onChange?.(newValue)
      }
    })

    const handleKeyDownCombined = useEventCallback(
      (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        handleMentionKeyDown(event)
        if (!event.defaultPrevented) {
          handleKeyDown(event)
        }
      },
    )

    const tv = mdInputTv({ disabled, readOnly, visible: hasTabs ? activeTab === "write" : true })

    return (
      <Textarea
        padding={8}
        variant="reset"
        focusSelection="none"
        ref={mergeRefs(ref, textareaRef)}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDownCombined}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        className={tcx(tv.textarea(), className)}
        minRows={minRows}
        maxRows={maxRows}
        {...rest}
      />
    )
  }),
)

MdInputEditor.displayName = "MdInputEditor"
