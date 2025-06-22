import { memo } from "react"
import type { EmojiData } from "../hooks"
import { emojiItemTv } from "../tv"

interface EmojiItemProps {
  emoji: EmojiData
  onHover?: (emoji: EmojiData | null) => void
  onSelect: (emoji: EmojiData) => void
  selected?: boolean
  variant?: "dark" | "light"
}

export const EmojiItem = memo(function EmojiItem(props: EmojiItemProps) {
  const { emoji, onSelect, onHover, selected = false, variant = "dark" } = props

  return (
    <button
      className={emojiItemTv({ variant, selected })}
      onClick={() => onSelect(emoji)}
      onMouseEnter={() => onHover?.(emoji)}
      onMouseLeave={() => onHover?.(null)}
      title={`${emoji.name} (${emoji.emoji})`}
      type="button"
    >
      {emoji.emoji}
    </button>
  )
})
