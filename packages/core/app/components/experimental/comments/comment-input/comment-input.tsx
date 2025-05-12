import { forwardRef, useCallback, useEffect, useRef, useState } from "react"
import { Descendant, Editor, Transforms } from "slate"
import { Editable, ReactEditor, RenderElementProps, Slate } from "slate-react"
import type { InputDefaultText, User } from "../types"
import {
  CommentInputEmojiPopover,
  CommentInputFooter,
  CommentInputMentionPopover,
  renderElement,
  renderLeaf,
} from "./components"
import { useCommentInput } from "./hooks"
import { CommentInputTv } from "./tv"
import type { ExtendedRenderElement } from "./types"
import { handleHotkeys, isEmptyContent } from "./utils"
import { useEventCallback } from "usehooks-ts"

export interface CommentInputProps {
  className?: string
  initialValue?: Descendant[]
  variant?: "default" | "solid"
  placeholder?: string
  users?: User[]
  maxUploadFiles?: number
  onChange?: (value: Descendant[]) => void
  onSubmit?: (value: Descendant[]) => void
  onCancel?: () => void
  onTypingChange?: (isTyping: boolean) => void
  defaultText?: InputDefaultText
}

export const CommentInput = forwardRef<HTMLDivElement, CommentInputProps>((props, ref) => {
  const {
    className,
    initialValue,
    placeholder = "Add a comment",
    variant = "default",
    users = [],
    maxUploadFiles = 5,
    onChange,
    onSubmit,
    onCancel,
    onTypingChange,
    defaultText = {
      SAVE: "Save",
      CANCEL: "Cancel",
      SUBMIT: "Submit",
      ADD_MENTION: "Add mention",
      ADD_EMOJI: "Add emoji",
      UPLOAD_ATTACHMENT: "Upload up to 5 images",
      REMOVE_IMAGE: "Remove image",
    },
  } = props

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false)

  // 添加一个状态来跟踪IME输入法组合状态
  const [isComposing, setIsComposing] = useState(false)

  // 添加emoji相关状态
  const [emojiPopoverOpen, setEmojiPopoverOpen] = useState(false)
  const emojiButtonRef = useRef<HTMLButtonElement>(null)

  const {
    editor,
    value,
    allowSubmission,
    typing,
    handleImageUpload,
    handleKeyDown,
    handleMention,
    handleChange,
    handleSubmit: originalHandleSubmit,
    target,
    mentionIndex,
    mentionSearch,
    error,
    setError,
    handleMentionButtonClick,
    handleRemoveImage,
    setMentionIndex,
    imageCount,
    maxImageCount,
    isImageUploadLimitReached,
    hasOnlyImages,
  } = useCommentInput({
    users,
    onChange,
    initialValue,
    maxUploadFiles,
    onSubmit: (data) => {
      if (isEmptyContent(data)) {
        return
      }
      setError(null)
      originalHandleSubmit()
      if (onSubmit) {
        onSubmit(data)
      }
      if (isEditMode) {
        setIsEditMode(false)
      }
    },
  })

  useEffect(() => {
    if (initialValue && initialValue.length > 0 && !isEmptyContent(initialValue)) {
      setIsEditMode(true)
    }
  }, [initialValue])

  // 当typing状态变化时通知父组件
  useEffect(() => {
    if (onTypingChange) {
      onTypingChange(typing)
    }
  }, [typing, onTypingChange])

  // 处理表情选择
  const handleEmojiSelect = useEventCallback((emoji: string) => {
    if (!emoji) return

    // 插入表情到编辑器中
    try {
      // 获取当前选择
      const { selection } = editor

      if (selection) {
        // 插入带有emoji属性的文本节点
        Transforms.insertNodes(editor, {
          text: emoji,
          emoji: true,
        })
      } else {
        // 如果没有选择，则在末尾插入
        Transforms.select(editor, Editor.end(editor, []))
        Transforms.insertNodes(editor, {
          text: emoji,
          emoji: true,
        })
      }

      try {
        const domNode = editor.children[0]
        if (domNode) {
          ReactEditor.focus(editor)
        }
      } catch (e) {
        console.error("Failed to focus editor:", e)
      }
    } catch (error) {
      console.error("Insert emoji failed:", error)
    }
  })

  // 统一提交处理函数
  const handleSubmit = useCallback(() => {
    if (onSubmit) {
      onSubmit(value)
    }

    if (isEditMode) {
      setIsEditMode(false)
    }

    originalHandleSubmit()
  }, [value, setError, onSubmit, originalHandleSubmit, isEditMode, hasOnlyImages])

  // 处理取消编辑
  const handleCancel = useCallback(() => {
    setIsEditMode(false)
    originalHandleSubmit()

    if (onCancel) {
      onCancel()
    }
  }, [onCancel, originalHandleSubmit])

  // 创建渲染元素的回调函数
  const renderElementWithCallbacks = useCallback(
    (props: RenderElementProps) => {
      return renderElement({
        ...props,
        handleRemoveImage,
        editor,
      } as ExtendedRenderElement)
    },
    [handleRemoveImage, editor],
  )

  // 处理输入法组合开始事件
  const handleCompositionStart = useEventCallback(() => {
    setIsComposing(true)
  })

  // 处理输入法组合结束事件
  const handleCompositionEnd = useEventCallback(() => {
    setIsComposing(false)
  })

  // 处理用户选择
  const handleUserSelect = useEventCallback((user: User) => {
    handleMention(user)
  })

  const handleMentionsKeyNavigation = useEventCallback((index: number) => {
    if (index >= 0) {
      setMentionIndex(index)
    }
  })

  // 计算是否应该显示placeholder
  // 只有在不处于组合状态且非typing状态时才显示
  const shouldShowPlaceholder = !isComposing && !typing

  const styles = CommentInputTv({ variant, typing })

  // 更新handleKeyDown函数处理热键
  const handleCommentKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      // 先检查是否是格式化热键
      const isHotkeyHandled = handleHotkeys(event, editor)

      // 如果不是格式化热键，则使用原有的键盘处理逻辑
      if (!isHotkeyHandled) {
        handleKeyDown(event)
      }
    },
    [editor, handleKeyDown],
  )

  return (
    <div
      ref={ref}
      className={styles.root({ className })}
    >
      <Slate
        editor={editor as ReactEditor}
        initialValue={value}
        onChange={handleChange}
      >
        <Editable
          style={{
            minHeight: typing ? "56px" : "40px",
          }}
          className={styles.editor()}
          renderElement={renderElementWithCallbacks}
          renderLeaf={renderLeaf}
          onKeyDown={handleCommentKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
        />

        {/* Portal for mention popover */}
        <CommentInputMentionPopover
          target={target}
          editor={editor}
          users={users}
          searchText={mentionSearch}
          selectedIndex={mentionIndex}
          onSelectMention={handleUserSelect}
          onKeyNavigation={handleMentionsKeyNavigation}
        />

        <CommentInputEmojiPopover
          setSelectedEmoji={handleEmojiSelect}
          anchorRect={emojiButtonRef}
          open={emojiPopoverOpen}
          onOpenChange={setEmojiPopoverOpen}
        />

        <CommentInputFooter
          typing={typing}
          allowSubmission={allowSubmission}
          isEditMode={isEditMode}
          onImageUpload={handleImageUpload}
          onMentionClick={handleMentionButtonClick}
          emojiButtonRef={emojiButtonRef}
          onEmojiClick={() => setEmojiPopoverOpen(!emojiPopoverOpen)}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          disableImageUpload={isImageUploadLimitReached}
          imageCount={imageCount}
          maxImageCount={maxImageCount}
          hasOnlyImages={hasOnlyImages}
          defaultText={defaultText}
        />

        {shouldShowPlaceholder ? (
          <div className={styles.placeholder()}>
            <span className="truncate">{error || placeholder}</span>
          </div>
        ) : null}
      </Slate>
    </div>
  )
})

CommentInput.displayName = "CommentInput"
