import { memo } from "react"
import { emojiEmptyTv } from "../tv"

interface EmojiEmptyProps {
  variant?: "default" | "dark" | "light"
  i18n?: {
    title?: string
    description?: string
  }
}

export const EmojiEmpty = memo(function EmojiEmpty({
  variant = "dark",
  i18n = {
    title: "No emoji found",
    description: "You can search for an emoji by name or use the search bar to find it.",
  },
}: EmojiEmptyProps) {
  const tv = emojiEmptyTv({ variant })

  return (
    <div className={tv.container()}>
      <div className={tv.title()}>{i18n.title}</div>
      <p className={tv.description()}>{i18n.description}</p>
    </div>
  )
})
