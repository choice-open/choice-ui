import { memo } from "react"
import { emojiEmptyTv } from "../tv"

interface EmojiEmptyProps {
  variant?: "dark" | "light"
}

export const EmojiEmpty = memo(function EmojiEmpty({ variant = "dark" }: EmojiEmptyProps) {
  const tv = emojiEmptyTv({ variant })

  return (
    <div className={tv.container()}>
      <div className={tv.title()}>No emoji found</div>
      <p className={tv.description()}>
        You can search for an emoji by name or use the search bar to find it.
      </p>
    </div>
  )
})
