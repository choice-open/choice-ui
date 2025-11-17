import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  type DragEvent,
  type MouseEvent,
} from "react"
import { ChevronDownSmall, ChevronRightSmall } from "@choiceform/icons-react"

const AUTO_EXPAND_DELAY = 350

interface TreeNodeToggleProps {
  isDragging: boolean
  isExpanded: boolean
  isFolderWithChildren: boolean
  nodeId: string
  onExpandClick: (event: MouseEvent<HTMLButtonElement>) => void
  shouldRenderToggle: boolean
}

export interface TreeNodeToggleHandle {
  clearTimeout: () => void
}

export const TreeNodeToggle = forwardRef<TreeNodeToggleHandle, TreeNodeToggleProps>(
  (
    {
      isExpanded,
      isDragging,
      isFolderWithChildren,
      nodeId,
      onExpandClick,
      shouldRenderToggle,
    },
    ref,
  ) => {
    const expandHoverTimeoutRef = useRef<number | null>(null)

    const clearExpandHoverTimeout = useCallback(() => {
      if (expandHoverTimeoutRef.current !== null) {
        window.clearTimeout(expandHoverTimeoutRef.current)
        expandHoverTimeoutRef.current = null
      }
    }, [])

    useImperativeHandle(ref, () => ({
      clearTimeout: clearExpandHoverTimeout,
    }), [clearExpandHoverTimeout])

  const scheduleExpandOnDragHover = useCallback(() => {
    if (
      !isFolderWithChildren ||
      isExpanded ||
      isDragging ||
      expandHoverTimeoutRef.current !== null
    ) {
      return
    }

    expandHoverTimeoutRef.current = window.setTimeout(() => {
      expandHoverTimeoutRef.current = null
      document.dispatchEvent(
        new CustomEvent("folder-expand", {
          detail: { nodeId },
        }),
      )
    }, AUTO_EXPAND_DELAY)
  }, [nodeId, isExpanded, isFolderWithChildren, isDragging])

  useEffect(() => {
    return () => clearExpandHoverTimeout()
  }, [clearExpandHoverTimeout])

  if (!shouldRenderToggle) {
    return <div className="h-8 w-4 flex-none" />
  }

  const handleDragInteraction = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    scheduleExpandOnDragHover()
  }

  return (
    <button
      className="invisible flex h-8 w-4 flex-none items-center justify-center group-hover/tree-list:visible"
      onMouseDown={onExpandClick}
      onDragEnter={handleDragInteraction}
      onDragOver={handleDragInteraction}
      onDragLeave={(event) => {
        event.preventDefault()
        event.stopPropagation()
        clearExpandHoverTimeout()
      }}
    >
      {isExpanded ? (
        <ChevronDownSmall className="text-secondary-foreground" />
      ) : (
        <ChevronRightSmall className="text-secondary-foreground" />
      )}
    </button>
  )
})

TreeNodeToggle.displayName = "TreeNodeToggle"
