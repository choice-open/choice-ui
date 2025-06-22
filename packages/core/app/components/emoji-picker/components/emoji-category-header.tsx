import React, { forwardRef } from "react"
import { emojiTv } from "../tv"

interface EmojiCategoryHeaderProps {
  "data-index"?: number
  style?: React.CSSProperties
  title: string
  variant?: "dark" | "light"
}

export const EmojiCategoryHeader = forwardRef<HTMLDivElement, EmojiCategoryHeaderProps>(
  function EmojiCategoryHeader({ title, variant = "dark", style, ...props }, ref) {
    const tv = emojiTv({ variant })

    return (
      <div
        ref={ref}
        className={tv.categoryHeader()}
        style={style}
        {...props}
      >
        {title}
      </div>
    )
  },
)
