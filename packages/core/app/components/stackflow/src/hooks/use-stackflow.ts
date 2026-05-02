import { useState, useCallback } from "react"

export interface StackflowItem {
  content: React.ReactNode
  id: string
}

export interface StackflowState {
  currentId: string
  direction: "forward" | "backward"
  history: string[]
  isInitial: boolean
}

export interface StackflowControls {
  back: () => void
  canGoBack: boolean
  clearHistory: () => void
  current: StackflowItem | undefined
  direction: "forward" | "backward"
  history: string[]
  isInitial: boolean
  push: (id: string) => void
}

export function useStackflow(items: StackflowItem[], initialId?: string): StackflowControls {
  const firstItem = items[0]
  const defaultId = initialId || firstItem?.id

  const [state, setState] = useState<StackflowState>({
    currentId: defaultId || "",
    history: defaultId ? [defaultId] : [],
    direction: "forward",
    isInitial: true,
  })

  const push = useCallback(
    (id: string) => {
      const item = items.find((item) => item.id === id)
      if (!item) return

      setState((prev) => {
        // If the page to be jumped to is the current page, do nothing
        if (prev.currentId === id) return prev

        return {
          currentId: id,
          history: [...prev.history, id],
          direction: "forward",
          isInitial: false,
        }
      })
    },
    [items],
  )

  const back = useCallback(() => {
    setState((prev) => {
      if (prev.history.length <= 1) return prev

      const newHistory = [...prev.history]
      newHistory.pop() // Remove current page
      const previousId = newHistory[newHistory.length - 1]

      return {
        currentId: previousId,
        history: newHistory,
        direction: "backward",
        isInitial: false,
      }
    })
  }, [])

  const clearHistory = useCallback(() => {
    setState((prev) => {
      const firstItem = items[0]
      const resetId = firstItem?.id || prev.currentId

      return {
        currentId: resetId,
        history: [resetId],
        direction: "forward",
        isInitial: false,
      }
    })
  }, [items])

  const current = items.find((item) => item.id === state.currentId)
  const canGoBack = state.history.length > 1

  return {
    push,
    back,
    clearHistory,
    canGoBack,
    current,
    history: state.history,
    direction: state.direction,
    isInitial: state.isInitial,
  }
}
