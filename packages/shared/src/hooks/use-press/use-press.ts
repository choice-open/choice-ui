import {
  useCallback,
  useState,
  PointerEvent as ReactPointerEvent,
  KeyboardEvent as ReactKeyboardEvent,
} from "react"

type PressEvent = ReactPointerEvent<HTMLElement> | ReactKeyboardEvent<HTMLElement>

export type PressProps = {
  disabled?: boolean
  onPress?: (event: PressEvent) => void
  onPressEnd?: (event: PressEvent) => void
  onPressStart?: (event: PressEvent) => void
}

export function usePress({ disabled, onPress, onPressStart, onPressEnd }: PressProps) {
  const [isPressed, setPressed] = useState(false)

  const createHandlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!disabled) {
        setPressed(true)
        onPressStart?.(event)
        document.addEventListener(
          "pointerup",
          () => {
            setPressed(false)
            onPress?.(event)
            onPressEnd?.(event)
          },
          { once: true },
        )
      }
    },
    [disabled, onPress, onPressEnd, onPressStart],
  )

  const createHandleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLElement>) => {
      if (
        event.target === event.currentTarget &&
        (event.key === " " || event.key === "Enter") &&
        isPressed === false &&
        !disabled
      ) {
        setPressed(true)
        onPressStart?.(event)
      }
    },
    [disabled, isPressed, onPressStart],
  )

  const createHandleKeyUp = useCallback(
    (event: ReactKeyboardEvent<HTMLElement>) => {
      // calling preventDefault in keyUp on a <button> will not dispatch a click event if Space is pressed
      // https://codesandbox.io/p/sandbox/button-keyup-preventdefault-dn7f0
      if (
        event.target === event.currentTarget &&
        (event.key === " " || event.key === "Enter") &&
        !disabled
      ) {
        setPressed(false)
        onPress?.(event)
        onPressEnd?.(event)
      }
    },
    [disabled, onPress, onPressEnd],
  )

  return {
    isPressed,
    pressProps: {
      onPointerDown: createHandlePointerDown,
      onKeyDown: createHandleKeyDown,
      onKeyUp: createHandleKeyUp,
    },
  }
}
