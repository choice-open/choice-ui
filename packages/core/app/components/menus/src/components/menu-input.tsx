import { Input, type InputProps } from "@choiceform/input"

import { forwardRef, useCallback } from "react"

export const MenuInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { className, onKeyDown, ...rest } = props

  // 阻止键盘事件冒泡，防止被 useTypeahead 截获
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
