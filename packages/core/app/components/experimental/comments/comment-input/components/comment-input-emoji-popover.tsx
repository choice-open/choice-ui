import { useMemo } from "react"
import { EmojiData, EmojiPicker, Popover } from "~/components"
import { useEventCallback } from "usehooks-ts"

interface CommentInputEmojiPopoverProps {
  anchorRect: React.RefObject<HTMLButtonElement>
  onOpenChange?: (open: boolean) => void
  open?: boolean
  setSelectedEmoji: (emoji: string) => void
}

export const CommentInputEmojiPopover = ({
  setSelectedEmoji,
  anchorRect,
  open = false,
  onOpenChange,
}: CommentInputEmojiPopoverProps) => {
  const handleEmojiSelect = useEventCallback((emoji: EmojiData) => {
    setSelectedEmoji(emoji.emoji)

    if (onOpenChange) {
      onOpenChange(false)
    }
  })

  const emojiPickerContent = useMemo(
    () => (
      <EmojiPicker
        onChange={(emoji: EmojiData) => {
          handleEmojiSelect(emoji)
        }}
      />
    ),
    [handleEmojiSelect],
  )

  return (
    <Popover
      open={open}
      onOpenChange={onOpenChange}
      triggerRef={anchorRect}
    >
      <Popover.Content className="overflow-hidden p-0">{emojiPickerContent}</Popover.Content>
    </Popover>
  )
}
