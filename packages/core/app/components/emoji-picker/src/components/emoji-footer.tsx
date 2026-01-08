import { memo } from "react"
import type { EmojiData } from "../hooks/use-emoji-data"
import { emojiFooterTv } from "../tv"

interface EmojiFooterProps {
  hoveredEmoji: EmojiData | null
  selectedEmoji: EmojiData | null
  variant?: "default" | "dark" | "light"
  i18n?: {
    pickAnEmoji?: string
  }
}

export const EmojiFooter = memo(function EmojiFooter({
  hoveredEmoji,
  selectedEmoji,
  variant = "dark",
  i18n = {
    pickAnEmoji: "Pick an emoji...",
  },
}: EmojiFooterProps) {
  const tv = emojiFooterTv({ variant })

  return (
    <div className={tv.footer()}>
      <div className={tv.emojiPreview()}>
        {(hoveredEmoji || selectedEmoji)?.emoji || <div className={tv.emojiPreviewEmpty()}></div>}
      </div>
      <div className={tv.emojiInfo()}>
        <div className={tv.emojiName()}>
          {hoveredEmoji?.name || selectedEmoji?.name || i18n.pickAnEmoji}
        </div>
        {hoveredEmoji || selectedEmoji ? (
          <div className={tv.emojiCode()}>:{(hoveredEmoji || selectedEmoji)?.nameUrl}:</div>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
})
