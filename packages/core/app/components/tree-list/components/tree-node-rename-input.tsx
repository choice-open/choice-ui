import {
  useCallback,
  useEffect,
  useRef,
  type ChangeEvent,
  type KeyboardEvent,
  type RefObject,
} from "react"
import { tcx } from "~/utils"

export interface TreeNodeRenameInputProps {
  /**
   * 节点名称展示区域的 ref，用于外部测量宽度
   */
  contentRef: RefObject<HTMLDivElement>

  /**
   * 是否处于重命名状态
   */
  isRenaming: boolean

  /**
   * 当前节点是否被选中，用于样式控制
   */
  isSelected: boolean

  /**
   * 当前节点名称
   */
  name: string

  /**
   * 重命名完成后触发，返回新的名称
   */
  onRename?: (newName: string) => void

  /**
   * 当输入值变化时触发
   */
  onRenameValueChange: (value: string) => void

  /**
   * 当重命名状态变化时触发
   */
  onRenamingChange: (isRenaming: boolean) => void

  /**
   * 重命名输入框的值
   */
  renameValue: string

  /**
   * 请求外部重新测量节点宽度
   */
  triggerMeasure?: () => void
}

export function TreeNodeRenameInput(props: TreeNodeRenameInputProps) {
  const {
    name,
    isRenaming,
    renameValue,
    isSelected,
    contentRef,
    onRenamingChange,
    onRenameValueChange,
    onRename,
    triggerMeasure,
  } = props

  const inputRef = useRef<HTMLInputElement>(null)
  const hasCommittedRef = useRef(false)

  useEffect(() => {
    if (!isRenaming || !inputRef.current) return

    const scrollContainer = document.querySelector(
      ".tree-list__scroll-container",
    ) as HTMLElement | null
    const scrollLeft = scrollContainer?.scrollLeft ?? 0

    inputRef.current.focus()
    inputRef.current.select()

    requestAnimationFrame(() => {
      if (scrollContainer && scrollContainer.scrollLeft !== scrollLeft) {
        scrollContainer.scrollLeft = scrollLeft
      }
    })
  }, [isRenaming])

  useEffect(() => {
    if (!isRenaming) {
      hasCommittedRef.current = false
    }
  }, [isRenaming])

  const handleStartRenaming = useCallback(() => {
    if (isRenaming) return
    onRenameValueChange(name)
    onRenamingChange(true)
  }, [isRenaming, name, onRenamingChange, onRenameValueChange])

  const finalizeRename = useCallback(() => {
    if (!isRenaming || hasCommittedRef.current) return

    hasCommittedRef.current = true

    const trimmedValue = renameValue.trim()

    if (trimmedValue !== "" && trimmedValue !== name) {
      onRename?.(trimmedValue)
    } else if (trimmedValue === "") {
      onRenameValueChange(name)
    }

    onRenamingChange(false)

    window.setTimeout(() => {
      triggerMeasure?.()
    }, 0)

    window.setTimeout(() => {
      hasCommittedRef.current = false
    }, 0)
  }, [
    isRenaming,
    name,
    onRename,
    onRenameValueChange,
    renameValue,
    triggerMeasure,
    onRenamingChange,
  ])

  const cancelRename = useCallback(() => {
    if (!isRenaming) return

    hasCommittedRef.current = true

    onRenameValueChange(name)
    onRenamingChange(false)

    window.setTimeout(() => {
      triggerMeasure?.()
    }, 0)

    window.setTimeout(() => {
      hasCommittedRef.current = false
    }, 0)
  }, [isRenaming, name, onRenamingChange, onRenameValueChange, triggerMeasure])

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onRenameValueChange(event.target.value)
    },
    [onRenameValueChange],
  )

  const handleInputKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      event.stopPropagation()
      event.preventDefault()

      if (event.key === "Enter") {
        finalizeRename()
        inputRef.current?.blur()
      } else if (event.key === "Escape") {
        cancelRename()
      }
    },
    [cancelRename, finalizeRename],
  )

  return isRenaming ? (
    <div className="flex w-full items-center px-2">
      <input
        ref={inputRef}
        className={tcx(
          "text-body-medium bg-default-background h-8 w-full rounded-sm border border-transparent px-2 leading-[1.35]",
          "transition-colors duration-150 ease-in-out",
          "focus-visible:border-selected-boundary focus-visible:outline-none",
        )}
        value={renameValue}
        onChange={handleInputChange}
        onBlur={finalizeRename}
        onKeyDown={handleInputKeyDown}
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  ) : (
    <>
      <span
        onDoubleClick={handleStartRenaming}
        className="flex w-full flex-shrink-1 items-center justify-between truncate px-2 text-left whitespace-pre"
      >
        <div
          className="text-body-medium invisible absolute pr-2"
          title={name}
        >
          {name}
        </div>
        <div
          ref={contentRef}
          className={tcx(
            "text-body-medium max-w-fit flex-1 group-hover/tree-node:truncate",
            isSelected && "text-default-foreground",
          )}
          title={name}
        >
          {name}
        </div>
      </span>
      <div className="flex h-8 w-0 shrink-0 items-center group-hover/tree-node:w-12" />
    </>
  )
}
