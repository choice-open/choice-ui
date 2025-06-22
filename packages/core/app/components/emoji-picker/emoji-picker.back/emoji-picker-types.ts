import type { EmojiData } from "./use-emoji-picker"

// Types for Picker from emoji-mart
export interface PickerProps {
  data?: any
  i18n?: any
  set?: "native" | "apple" | "facebook" | "google" | "twitter"
  theme?: "auto" | "light" | "dark"
  emoji?: string
  categories?: string[]
  categoryIcons?: Record<string, any>
  custom?: any[]
  onEmojiSelect?: (emoji: EmojiData) => void
  onClickOutside?: () => void
  perLine?: number
  previewPosition?: "top" | "bottom" | "none"
  searchPosition?: "top" | "bottom" | "none"
  skinTonePosition?: "preview" | "search" | "none"
  autoFocus?: boolean
  maxFrequentRows?: number
  icons?: "auto" | "outline" | "solid"
  skin?: 1 | 2 | 3 | 4 | 5 | 6
  getSpritesheetURL?: (set: string, sheet: string) => string
  emojiButtonSize?: number
  emojiSize?: number
  emojiButtonColors?: string[]
  exceptEmojis?: string[]
  dynamicWidth?: boolean
  noCountryFlags?: boolean
  navPosition?: "top" | "bottom" | "none"
  noResultsEmoji?: string
  previewEmoji?: string
}
