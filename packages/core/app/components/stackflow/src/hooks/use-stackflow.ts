import { useEffect, useState, useCallback } from "react"

export interface StackflowItem {
  content: React.ReactNode
  id: string
}

export interface StackflowState {
  currentId: string
  direction: "forward" | "backward"
  history: string[]
  currentIndex: number
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
    currentIndex: 0,
    direction: "forward",
    isInitial: true,
  })

  useEffect(() => {
    if (!state.currentId && items.length > 0) {
      const firstId = items[0].id
      setState({
        currentId: firstId,
        history: [firstId],
        currentIndex: 0,
        direction: "forward",
        isInitial: true,
      })
    }
  }, [items, state.currentId])

  const push = useCallback(
    (id: string) => {
      const item = items.find((item) => item.id === id)
      if (!item) return

      setState((prev) => {
        // If the page to be jumped to is the current page, do nothing
        if (prev.currentId === id) return prev

        const truncatedHistory = prev.history.slice(0, prev.currentIndex + 1)

        return {
          currentId: id,
          history: [...truncatedHistory, id],
          currentIndex: truncatedHistory.length,
          direction: "forward",
          isInitial: false,
        }
      })
    },
    [items],
  )

  const back = useCallback(() => {
    setState((prev) => {
      if (prev.currentIndex <= 0) return prev

      const newIndex = prev.currentIndex - 1
      const previousId = prev.history[newIndex]

      return {
        currentId: previousId,
        history: prev.history,
        currentIndex: newIndex,
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
        currentIndex: 0,
        direction: "forward",
        isInitial: false,
      }
    })
  }, [items])

  const current = items.find((item) => item.id === state.currentId)
  const canGoBack = state.currentIndex > 0

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
