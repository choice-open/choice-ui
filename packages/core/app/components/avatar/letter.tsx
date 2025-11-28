import { memo, useMemo } from "react"

const SIZE_MAP = {
  small: 16,
  medium: 24,
  large: 32,
} as const

interface InitialLetterProps {
  letter: string
  size?: "small" | "medium" | "large" | number
}

export const InitialLetter = memo(function InitialLetter({
  letter,
  size = "medium",
}: InitialLetterProps) {
  const avatarSize = useMemo(() => {
    if (typeof size === "number") {
      return size
    }
    return SIZE_MAP[size]
  }, [size])

  const fontSize = useMemo(() => {
    return Math.round(avatarSize * 0.5)
  }, [avatarSize])

  const upperLetter = useMemo(() => letter.toUpperCase(), [letter])

  return (
    <span
      className="flex h-full w-full items-center justify-center uppercase select-none"
      style={{
        fontSize: `${fontSize}px`,
        lineHeight: 1,
      }}
    >
      {upperLetter}
    </span>
  )
})
