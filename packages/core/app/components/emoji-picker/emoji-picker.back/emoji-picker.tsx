import data from "@emoji-mart/data"
import { memo } from "react"
import type { PickerProps } from "./emoji-picker-types"
import { LazyEmoji } from "./lazy-picker"
import { type EmojiData } from "./use-emoji-picker"
import { useTheme } from "~/hooks/use-theme"

export interface EmojiPickerProps {
  onEmojiSelect?: (emoji: EmojiData) => void
  onClickOutside?: () => void
  pickerProps?: Partial<PickerProps>
}

export const EmojiPicker = memo((props: EmojiPickerProps) => {
  const { onEmojiSelect, onClickOutside, ...rest } = props

  // Use our custom theme hook
  const { theme } = useTheme()

  return (
    <>
      <style>
        {`
        em-emoji-picker {
          ${theme === "dark" ? "--rgb-background: 30, 30, 30;" : "--rgb-background: 255, 255, 255;"}
          --rgb-accent: 12, 140, 233;
          --font-family: inherit;
          --font-size: 11px;
          --preview-placeholder-size: 11px;
          --preview-title-size: 11px;
          --preview-subtitle-size: 11px;
        }
      `}
      </style>
      <LazyEmoji
        data={data}
        onEmojiSelect={onEmojiSelect}
        onClickOutside={onClickOutside}
        icons="outline"
        theme={theme}
        {...rest}
      />
    </>
  )
})

EmojiPicker.displayName = "EmojiPicker"
