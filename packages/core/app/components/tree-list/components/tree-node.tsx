import { forwardRef, useEffect, useMemo, useRef, useState } from "react"
import { useNodeWidth } from "../hooks/use-node-width"
import { TreeNodeProps } from "../types"
import { DropIndicator } from "./drop-indicator"
import { tcx } from "~/utils"
import { ChevronRightSmall } from "@choiceform/icons-react"
import { ChevronDownSmall } from "@choiceform/icons-react"
export const TreeNode = forwardRef<HTMLDivElement, TreeNodeProps>((props, ref) => {
  const {
    containerWidth,
    node,
    style,
    className,
    renderIcon,
    renderActions,
    onSelect,
    onExpand,
    onDragStart,
    onDragOver,
    onDragEnd,
    onDrop,
    onRename,
    onContextMenu,
    isLastInParent,
    isFirstSelected,
    isLastSelected,
    isMiddleSelected,
    hasHorizontalScroll,
    onMeasure,
    isMultiSelectionActive,
    isCommandKeyPressed,
  } = props

  const [isRenaming, setIsRenaming] = useState(false)
  const [renameValue, setRenameValue] = useState(node.name)
  const [isHovered, setIsHovered] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const nodeRef = useRef<HTMLDivElement | null>(null)

  const {
    id,
    name,
    children,
    state: {
      isExpanded,
      isSelected,
      isDragging,
      isDropTarget,
      dropPosition,
      level,
      isParentSelected,
      index,
    },
    parentId,
  } = node

  // 使用 useNodeWidth hook 测量节点宽度
  const { contentRef, triggerMeasure, nodeWidth } = useNodeWidth({
    nodeId: id,
    name,
    level,
    isRenaming,
    renameValue,
    isHovered,
    containerWidth,
    onWidthChange: (_nodeId, width) => {
      onMeasure?.(width)
    },
    onResetRenaming: () => {
      // 当滚动开始时结束重命名状态
      if (isRenaming) {
        setIsRenaming(false)
        setRenameValue(name) // 恢复原始名称，取消编辑
      }
    },
  })

  // 处理重命名开始时自动聚焦输入框
  useEffect(() => {
    if (isRenaming && inputRef.current) {
      // 获取指定的滚动容器 - tree-list__scroll-container
      const scrollContainer = document.querySelector(".tree-list__scroll-container") as HTMLElement

      // 保存当前滚动位置
      const scrollLeft = scrollContainer?.scrollLeft || 0

      // 聚焦输入框
      inputRef.current.focus()
      inputRef.current.select()

      // 使用 requestAnimationFrame 确保在下一帧渲染时恢复滚动位置
      requestAnimationFrame(() => {
        // 恢复滚动位置
        if (scrollContainer && scrollContainer.scrollLeft !== scrollLeft) {
          scrollContainer.scrollLeft = scrollLeft
        }
      })
    }
  }, [isRenaming])

  // 节点点击
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect?.(node, e)
  }

  // 展开/折叠图标点击
  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onExpand?.(node)
  }

  // 拖拽开始
  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation()

    // 标记当前节点为拖拽中
    if (nodeRef.current) {
      nodeRef.current.classList.add("dragging")
    }

    onDragStart?.(node, e)
  }

  // 拖拽经过
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    onDragOver?.(node, e)
  }

  // 拖拽结束
  const handleDragEnd = (e: React.DragEvent) => {
    e.stopPropagation()

    // 移除拖拽中的样式
    if (nodeRef.current) {
      nodeRef.current.classList.remove("dragging")
    }

    onDragEnd?.(e)
  }

  // 处理放置
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDrop?.(node, e)
  }

  // 处理右键菜单
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onContextMenu?.(node, e)
  }

  // 重命名完成
  const handleRenamingComplete = () => {
    if (renameValue.trim() !== "" && renameValue !== name) {
      onRename?.(node, renameValue)
    }
    setIsRenaming(false)

    // 重命名完成后主动触发一次测量
    setTimeout(() => {
      triggerMeasure()
    }, 0)
  }

  // 重命名键盘事件
  const handleRenameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleRenamingComplete()
    } else if (e.key === "Escape") {
      setRenameValue(name)
      setIsRenaming(false)
    }
  }

  // 计算节点缩进
  const indentSize = level * 24 // 每层缩进24px

  // 严格判断是否是文件夹（必须有子项）
  const isFolderWithChildren = Boolean(children && Array.isArray(children) && children.length > 0)

  // 判断是否是父节点中的最后一个子项
  const isLastItemInFolder = isLastInParent ?? false

  // 计算选中状态的样式类
  const getSelectionStyle = useMemo(() => {
    if (!isSelected)
      return "group-hover/tree-node:after:bg-gray-100 after:inset-y-1 after:h-6 after:rounded-sm"

    // 选中时的样式处理，根据在选择组中的位置使用不同样式
    if (isFirstSelected) {
      // 第一个选中的项：顶部圆角，底部边框
      return "after:bg-blue-100 after:top-1 after:h-7 after:rounded-t-sm after:border-b-4 after:border-b-blue-100"
    } else if (isMiddleSelected) {
      // 中间的选中项：没有圆角，有底部边框
      return "after:bg-blue-100 after:inset-y-0 after:h-8"
    } else if (isLastSelected) {
      // 最后一个选中项：底部圆角
      return "after:bg-blue-100 after:bottom-1 after:h-7 after:rounded-b-sm after:border-t-4 after:border-blue-100"
    }

    // 单个选中项（没有特殊标记）：所有边都有圆角
    return isFolderWithChildren && isSelected && isExpanded
      ? "after:bg-blue-100 after:top-1 after:h-7 after:rounded-t-sm after:border-b-4 after:border-b-blue-50"
      : "after:bg-blue-100 after:inset-y-1 after:h-6 after:rounded-sm"
  }, [
    isSelected,
    isFirstSelected,
    isMiddleSelected,
    isLastSelected,
    isFolderWithChildren,
    isExpanded,
  ])

  // 判断当前节点选择/点击事件的处理方式
  // 1. 按住Command键时总是使用onMouseDown
  // 2. 多选状态下不按Command键使用onClick（以支持多选拖拽）
  // 3. 其他情况下使用onMouseDown（响应更快）
  const useClickEvent = isMultiSelectionActive && !isCommandKeyPressed

  return (
    <div
      className={tcx(
        "relative",
        "after:absolute after:right-2 after:left-3 after:-z-1",
        "before:absolute before:inset-y-0 before:right-2 before:left-3 before:-z-1",
        getSelectionStyle,
        isParentSelected && !isSelected && "before:bg-blue-50 hover:after:bg-blue-200",
        isLastItemInFolder && "before:rounded-b-sm",
        hasHorizontalScroll && "before:right-0 after:right-0",
      )}
      data-is-selection={isSelected ? "selected" : "unselected"}
      data-is-parent-selected={isParentSelected && !isSelected}
      data-is-last-in-group={isLastItemInFolder}
    >
      <div
        className={tcx(
          "pointer-events-none absolute inset-0 flex items-center justify-end gap-1 px-2",
          isRenaming ? "opacity-0" : isHovered ? "opacity-100" : "opacity-0",
        )}
      >
        <div
          className={tcx(
            "sticky right-3 flex h-6 items-center gap-2",
            isParentSelected && !isSelected
              ? "bg-blue-200"
              : isSelected
                ? "bg-blue-100"
                : isHovered
                  ? "bg-gray-100"
                  : "bg-default-background",
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {renderActions && renderActions(node)}
        </div>
      </div>

      <div
        ref={(el) => {
          // 同时设置forwardRef和内部ref
          if (typeof ref === "function") {
            ref(el)
          } else if (ref) {
            ref.current = el
          }
          nodeRef.current = el
        }}
        className={tcx(
          "pl-[var(--indent-size)]",
          "flex h-8 cursor-default items-center select-none",
          className,
        )}
        style={
          {
            ...style,
            "--indent-size": indentSize + "px",
            width: nodeWidth,
          } as React.CSSProperties
        }
        data-node-id={id}
        data-node-level={level}
        data-node-index={index}
        data-node-parent-id={parentId}
        data-is-dragging={isDragging}
        data-is-selected={isSelected}
        data-is-expanded={isExpanded}
        data-is-last-in-folder={isLastItemInFolder}
        data-drag-id={id}
        data-drag-type="node"
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDrop={handleDrop}
        onClick={useClickEvent ? handleClick : undefined}
        onMouseDown={useClickEvent ? undefined : handleClick}
        onContextMenu={handleContextMenu}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <DropIndicator
          dropPosition={dropPosition}
          isDropTarget={isDropTarget}
          level={level}
          isFolderWithChildren={isFolderWithChildren}
          isExpanded={isExpanded}
        />

        {/* 展开/折叠图标 */}
        {children && children.length > 0 ? (
          <button
            className="invisible flex h-8 w-4 flex-none items-center justify-center group-hover/tree-list:visible"
            onMouseDown={handleExpandClick}
          >
            {isExpanded ? (
              <ChevronDownSmall className="text-secondary-foreground" />
            ) : (
              <ChevronRightSmall className="text-secondary-foreground" />
            )}
          </button>
        ) : (
          <div className="h-8 w-4 flex-none" />
        )}

        {/* 节点图标 */}
        {renderIcon && (
          <div
            className={tcx(
              "flex h-4 w-4 flex-none items-center justify-center",
              isSelected ? "text-default-foreground" : "text-secondary-foreground",
            )}
          >
            {renderIcon(node)}
          </div>
        )}

        {/* 节点名称/重命名输入框 */}
        <>
          {isRenaming ? (
            <input
              ref={inputRef}
              className={tcx(
                "border-selected-boundary text-field -mr-1 h-6 w-[calc(100%+0.5rem)] rounded border bg-white px-[calc(0.5rem-1px)]",
              )}
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={handleRenamingComplete}
              onKeyDown={handleRenameKeyDown}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <>
              <span
                onDoubleClick={() => setIsRenaming(true)}
                className="flex w-full flex-shrink-1 items-center justify-between truncate px-2 text-left whitespace-pre"
              >
                <div
                  className="text-md invisible absolute pr-2"
                  title={name}
                >
                  {name}
                </div>
                <div
                  ref={contentRef}
                  className={tcx(
                    "text-md max-w-fit flex-1 group-hover/tree-node:truncate",
                    isSelected && "text-default-foreground",
                  )}
                  title={name}
                >
                  {name}
                </div>
              </span>
              <div className="flex h-8 w-0 shrink-0 items-center group-hover/tree-node:w-12" />
            </>
          )}
        </>
      </div>
    </div>
  )
})

TreeNode.displayName = "TreeNode"
