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
   * 完整路径的节点名称数组（从根到当前节点）
   */
  fullPath?: string[]

  /**
   * 是否可编辑（可重命名），默认为 true
   */
  isEditable?: boolean

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
   * 如果启用 showFullPathOnRename，newName 将包含完整路径
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
   * 是否在重命名时显示完整路径
   * 当为 true 时，输入框会显示完整路径，但只选中最后一部分
   */
  showFullPathOnRename?: boolean

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
    isEditable = true, // 默认为可编辑
    onRenamingChange,
    onRenameValueChange,
    onRename,
    triggerMeasure,
    showFullPathOnRename = false,
    fullPath = [],
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

    // 如果启用完整路径显示，只选中最后一部分（节点名称）
    if (showFullPathOnRename && fullPath.length > 0) {
      const fullPathText = fullPath.join("/")
      // 计算最后一部分（节点名称）的起始位置
      // 路径格式：parent1/parent2/nodeName
      // 我们需要找到最后一个 "/" 之后的位置
      const lastSlashIndex = fullPathText.lastIndexOf("/")
      const nodeNameStart = lastSlashIndex === -1 ? 0 : lastSlashIndex + 1
      // 选中最后一部分（节点名称）
      inputRef.current.setSelectionRange(nodeNameStart, fullPathText.length)
    } else {
      // 默认选中全部
      inputRef.current.select()
    }

    requestAnimationFrame(() => {
      if (scrollContainer && scrollContainer.scrollLeft !== scrollLeft) {
        scrollContainer.scrollLeft = scrollLeft
      }
    })
  }, [isRenaming, showFullPathOnRename, fullPath, name])

  useEffect(() => {
    if (!isRenaming) {
      hasCommittedRef.current = false
    }
  }, [isRenaming])

  const handleStartRenaming = useCallback(() => {
    // 如果节点不可编辑，阻止重命名
    if (!isEditable) return
    if (isRenaming) return

    // 如果启用完整路径显示，使用完整路径作为初始值
    if (showFullPathOnRename && fullPath.length > 0) {
      onRenameValueChange(fullPath.join("/"))
    } else {
      onRenameValueChange(name)
    }
    onRenamingChange(true)
  }, [
    isEditable,
    isRenaming,
    name,
    onRenamingChange,
    onRenameValueChange,
    showFullPathOnRename,
    fullPath,
  ])

  const finalizeRename = useCallback(() => {
    if (!isRenaming || hasCommittedRef.current) return

    hasCommittedRef.current = true

    const trimmedValue = renameValue.trim()
    let newName = trimmedValue

    // 如果启用完整路径显示，newName 应该是用户输入的完整路径（包括可能被修改的父节点名称）
    // 如果未启用，newName 就是节点名称
    if (!showFullPathOnRename) {
      // 未启用完整路径显示时，只使用节点名称
      newName = trimmedValue
    }
    // 启用完整路径显示时，newName 已经是完整路径（trimmedValue）

    if (newName !== "" && newName !== name) {
      onRename?.(newName)
    } else if (newName === "") {
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
    showFullPathOnRename,
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

      if (event.key === "Enter") {
        // 只在处理 Enter 键时阻止默认行为
        event.preventDefault()
        finalizeRename()
        inputRef.current?.blur()
      } else if (event.key === "Escape") {
        // 只在处理 Escape 键时阻止默认行为
        event.preventDefault()
        cancelRename()
      }
    },
    [cancelRename, finalizeRename],
  )

  // 计算显示的输入值
  const displayValue = isRenaming
    ? showFullPathOnRename && fullPath.length > 0
      ? renameValue
      : renameValue
    : name

  return isRenaming ? (
    <div className="flex w-full items-center px-2">
      <input
        ref={inputRef}
        className={tcx(
          "text-body-medium bg-default-background h-8 w-full rounded-sm border border-transparent px-2 leading-[1.35]",
          "transition-colors duration-150 ease-in-out",
          "focus-visible:border-selected-boundary focus-visible:outline-none",
        )}
        value={displayValue}
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
