import { Button } from "@choice-ui/button"
import { IconButton } from "@choice-ui/icon-button"
import { Tooltip } from "@choice-ui/tooltip"
import { ArrowUp, AtSign, Image, Smile } from "@choiceform/icons-react"
import { ChangeEvent, useRef } from "react"
import type { InputDefaultText } from "../../types"
import { CommentInputTv } from "../tv"

interface CommentInputFooterProps {
  allowSubmission?: boolean
  className?: string
  defaultText: InputDefaultText
  disableImageUpload?: boolean
  disabled?: boolean
  emojiButtonRef?: React.RefObject<HTMLButtonElement>
  hasOnlyImages?: boolean
  imageCount?: number
  isEditMode?: boolean
  maxImageCount?: number
  onCancel?: () => void
  onEmojiClick?: () => void
  onImageUpload?: (event: ChangeEvent<HTMLInputElement>) => void
  onMentionClick?: () => void
  onSubmit?: () => void
  typing?: boolean
  showMentionButton?: boolean
  showEmojiButton?: boolean
  showImageUploadButton?: boolean
}

export const CommentInputFooter = (props: CommentInputFooterProps) => {
  const {
    className,
    onEmojiClick,
    onMentionClick,
    onImageUpload,
    onSubmit,
    onCancel,
    disabled = false,
    typing = false,
    allowSubmission = false,
    isEditMode = false,
    emojiButtonRef,
    disableImageUpload = false,
    imageCount = 0,
    maxImageCount = 5,
    hasOnlyImages = false,
    defaultText,
    showMentionButton = true,
    showEmojiButton = true,
    showImageUploadButton = true,
  } = props

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageButtonClick = () => {
    if (disableImageUpload) return
    fileInputRef.current?.click()
  }

  const styles = CommentInputTv({ typing })

  // 构建图片上传按钮的tooltip文本
  const getImageTooltipText = () => {
    if (disableImageUpload) {
      return `${defaultText.UPLOAD_ATTACHMENT} (${imageCount}/${maxImageCount})`
    }
    return `${defaultText.UPLOAD_ATTACHMENT} (${imageCount}/${maxImageCount})`
  }

  // 计算提交按钮是否应该禁用
  const isSubmitDisabled = disabled || !allowSubmission || hasOnlyImages

  return (
    <div className={styles.footer({ className })}>
      {typing && (
        <div className={styles.footerActions()}>
          {/* Emoji Button */}
          {showEmojiButton && (
            <IconButton
              ref={emojiButtonRef}
              onClick={onEmojiClick}
              tooltip={{
                content: defaultText.ADD_EMOJI,
              }}
            >
              <Smile />
            </IconButton>
          )}

          {/* Mention Button */}
          {showMentionButton && (
            <IconButton
              onClick={onMentionClick}
              tooltip={{
                content: defaultText.ADD_MENTION,
              }}
            >
              <AtSign />
            </IconButton>
          )}

          {/* Image Upload Button */}
          {showImageUploadButton && (
            <IconButton
              onClick={handleImageButtonClick}
              disabled={disableImageUpload}
              tooltip={{
                content: getImageTooltipText(),
              }}
            >
              <Image />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={onImageUpload}
                className="hidden"
                disabled={disableImageUpload}
              />
            </IconButton>
          )}
        </div>
      )}

      {/* Edit Mode: Save and Cancel Buttons */}
      {isEditMode ? (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={onCancel}
          >
            {defaultText.CANCEL}
          </Button>
          <Button
            variant="primary"
            onClick={onSubmit}
            disabled={isSubmitDisabled}
          >
            {defaultText.SAVE}
          </Button>
        </div>
      ) : (
        /* Submit Button */
        <Tooltip content={defaultText.SUBMIT}>
          <Button
            onClick={onSubmit}
            disabled={isSubmitDisabled}
            className="w-6 rounded-full border-none px-0"
          >
            <ArrowUp />
          </Button>
        </Tooltip>
      )}
    </div>
  )
}
