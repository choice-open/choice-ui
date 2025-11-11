import { useEffect, useState } from "react"

interface ModifierKeysState {
  isCommandKeyPressed: boolean
  isShiftKeyPressed: boolean
}

export function useModifierKeys(): ModifierKeysState {
  const [state, setState] = useState<ModifierKeysState>({
    isCommandKeyPressed: false,
    isShiftKeyPressed: false,
  })

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Meta" || event.key === "Control") {
        setState((prev) =>
          prev.isCommandKeyPressed
            ? prev
            : {
                ...prev,
                isCommandKeyPressed: true,
              },
        )
        return
      }

      if (event.key === "Shift") {
        setState((prev) =>
          prev.isShiftKeyPressed
            ? prev
            : {
                ...prev,
                isShiftKeyPressed: true,
              },
        )
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Meta" || event.key === "Control") {
        setState((prev) =>
          prev.isCommandKeyPressed
            ? {
                ...prev,
                isCommandKeyPressed: false,
              }
            : prev,
        )
        return
      }

      if (event.key === "Shift") {
        setState((prev) =>
          prev.isShiftKeyPressed
            ? {
                ...prev,
                isShiftKeyPressed: false,
              }
            : prev,
        )
      }
    }

    const handleWindowBlur = () => {
      setState({
        isCommandKeyPressed: false,
        isShiftKeyPressed: false,
      })
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    window.addEventListener("blur", handleWindowBlur)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      window.removeEventListener("blur", handleWindowBlur)
    }
  }, [])

  return state
}

