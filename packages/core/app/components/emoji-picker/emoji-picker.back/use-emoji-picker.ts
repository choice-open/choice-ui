import { useCallback } from "react"
import data from "@emoji-mart/data"
import { init } from "emoji-mart"

// Initialize emoji-mart data once
init({ data })

export interface EmojiData {
  id: string
  native: string
  name: string
  skin?: number
  shortcodes?: string
}

export interface UseEmojiPickerProps {
  onEmojiSelect?: (emoji: EmojiData) => void
  onClose?: () => void
}

export function useEmojiPicker(props: UseEmojiPickerProps = {}) {
  const { onEmojiSelect, onClose } = props

  // Memoize handler to prevent unnecessary re-renders
  const handleEmojiSelect = useCallback(
    (emoji: EmojiData) => {
      onEmojiSelect?.(emoji)
      onClose?.()
    },
    [onEmojiSelect, onClose],
  )

  return { handleEmojiSelect }
}
