import { Input, type InputProps } from "@choice-ui/input"
import { forwardRef, useCallback } from "react"

export const MenuInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { className, onKeyDown, ...rest } = props

  // Prevent keyboard event bubbling, prevent useTypeahead from intercepting
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e)

      e.stopPropagation()
    },
    [onKeyDown],
  )

  return (
    <Input
      {...rest}
      ref={ref}
      autoFocus
      onKeyDown={handleKeyDown}
      variant="dark"
    />
  )
})

MenuInput.displayName = "MenuInput"
