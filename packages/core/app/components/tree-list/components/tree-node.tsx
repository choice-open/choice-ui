import { forwardRef, useEffect, useMemo, useRef, useState, type MouseEvent } from "react"
import { useNodeWidth } from "../hooks/use-node-width"
import { TreeNodeProps } from "../types"
import { DropIndicator } from "./drop-indicator"
import { TreeNodeRenameInput } from "./tree-node-rename-input"
import { tcx } from "~/utils"
import { TreeNodeIcon } from "./tree-node-icon"
import { TreeNodeToggle, type TreeNodeToggleHandle } from "./tree-node-toggle"

export const TreeNode = forwardRef<HTMLDivElement, TreeNodeProps>((props, ref) => {
  const {
    containerWidth,
    node,
    style,
    className,
    renderIcon,
    renderActions,
    renderLabel,
    onSelect,
    onExpand,
    onDragStart,
    onDragOver,
    onDragEnd,
    onDrop,
    onRename,
    onContextMenu,
    onHover,
    onIconDoubleClick,
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
  const nodeRef = useRef<HTMLDivElement | null>(null)
  const toggleRef = useRef<TreeNodeToggleHandle | null>(null)

  const {
    id,
    name,
    children,
    isFolder,
    isEditable = true,
    state: {
      isExpanded,
      isSelected,
      isDragging,
      isDropTarget,
      dropPosition,
      level,
      isParentSelected,
      indexKey,
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

  useEffect(() => {
    if (!isRenaming) {
      setRenameValue(name)
    }
  }, [isRenaming, name])

  const hasChildren = Array.isArray(children) && children.length > 0

  // 严格判断是否是文件夹（允许没有子项但标记为文件夹，用于拖拽等能力）
  const isFolderWithChildren = hasChildren || Boolean(isFolder)

  // 控制折叠按钮的展示：仅当存在子节点时显示
  const shouldRenderToggle = hasChildren

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

  const clearExpandHoverTimeout = () => {
    toggleRef.current?.clearTimeout()
  }

  // 判断是否是父节点中的最后一个子项
  const isLastItemInFolder = isLastInParent ?? false

  // 拖拽开始
  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation()

    // 如果节点不可编辑，阻止拖拽
    if (!isEditable) {
      e.preventDefault()
      return
    }

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
    clearExpandHoverTimeout()

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
    clearExpandHoverTimeout()
    onDrop?.(node, e)
  }

  // 处理右键菜单
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onContextMenu?.(node, e)
  }

  // 计算节点缩进
  const indentSize = level * 24 // 每层缩进24px

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

  // Handle mouse enter/leave on the outer container to cover the entire node area
  const handleOuterMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
    if (!isHovered) {
      setIsHovered(true)
      onHover?.(node, true, e)
    }
  }

  const handleOuterMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
    // Check if we're moving to a child element within the node
    const relatedTarget = e.relatedTarget as Node | null
    const currentTarget = e.currentTarget as Node

    // If relatedTarget is null or not within the current target, we're truly leaving
    if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
      setIsHovered(false)
      onHover?.(node, false, e)
    }
  }

  return (
    <div
      className={tcx(
        "relative",
        "after:absolute after:right-2 after:left-3 after:-z-1",
        "before:absolute before:inset-y-0 before:right-2 before:left-3 before:-z-1",
        getSelectionStyle,
        isParentSelected && !isSelected && "after:bg-blue-50 hover:after:bg-blue-200",
        isLastItemInFolder && "before:rounded-b-sm",
        hasHorizontalScroll && "before:right-0 after:right-0",
      )}
      data-is-selection={isSelected ? "selected" : "unselected"}
      data-is-parent-selected={isParentSelected && !isSelected}
      data-is-last-in-group={isLastItemInFolder}
      onMouseEnter={handleOuterMouseEnter}
      onMouseLeave={handleOuterMouseLeave}
    >
      {/* Label: 显示在非 hover 状态 */}
      {renderLabel && (
        <div
          className={tcx(
            "pointer-events-none absolute inset-0 flex items-center justify-end gap-1 px-2",
            isRenaming ? "opacity-0" : isHovered ? "opacity-0" : "opacity-100",
          )}
          aria-hidden={isRenaming || isHovered}
        >
          <div
            className={tcx(
              "pointer-events-auto sticky right-3 flex h-6 items-center gap-2",
              isParentSelected && !isSelected
                ? "bg-blue-200"
                : isSelected
                  ? "bg-blue-100"
                  : "bg-default-background",
            )}
            onMouseDown={(event) => event.stopPropagation()}
          >
            {renderLabel(node)}
          </div>
        </div>
      )}

      {/* Actions: 显示在 hover 状态 */}
      {renderActions && (
        <div
          className={tcx(
            "pointer-events-none absolute inset-0 flex items-center justify-end gap-1 px-2",
            isRenaming ? "opacity-0" : isHovered ? "opacity-100" : "opacity-0",
          )}
          aria-hidden={isRenaming || !isHovered}
        >
          <div
            className={tcx(
              "pointer-events-auto sticky right-3 flex h-6 items-center gap-2",
              isParentSelected && !isSelected
                ? "bg-blue-200"
                : isSelected
                  ? "bg-blue-100"
                  : isHovered
                    ? "bg-gray-100"
                    : "bg-default-background",
            )}
            onMouseDown={(event) => event.stopPropagation()}
          >
            {renderActions(node)}
          </div>
        </div>
      )}

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
        data-node-index-key={indexKey}
        data-node-parent-id={parentId}
        data-is-dragging={isDragging}
        data-is-selected={isSelected}
        data-is-expanded={isExpanded}
        data-is-last-in-folder={isLastItemInFolder}
        data-drag-id={id}
        data-drag-type="node"
        draggable={isEditable}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDrop={handleDrop}
        onDragLeave={() => {
          clearExpandHoverTimeout()
        }}
        onClick={useClickEvent ? handleClick : undefined}
        onMouseDown={useClickEvent ? undefined : handleClick}
        onContextMenu={handleContextMenu}
      >
        <DropIndicator
          dropPosition={dropPosition}
          isDropTarget={isDropTarget}
          level={level}
          isFolderWithChildren={isFolderWithChildren}
          isExpanded={isExpanded}
        />

        <TreeNodeToggle
          ref={toggleRef}
          isDragging={isDragging}
          isExpanded={isExpanded}
          isFolderWithChildren={isFolderWithChildren}
          nodeId={id}
          onExpandClick={handleExpandClick}
          shouldRenderToggle={shouldRenderToggle}
        />

        <TreeNodeIcon
          node={node}
          isSelected={isSelected}
          renderIcon={renderIcon}
          onIconDoubleClick={onIconDoubleClick}
        />

        <TreeNodeRenameInput
          name={name}
          isRenaming={isRenaming}
          renameValue={renameValue}
          isSelected={isSelected}
          isEditable={isEditable}
          contentRef={contentRef}
          onRenamingChange={setIsRenaming}
          onRenameValueChange={setRenameValue}
          onRename={(newName) => onRename?.(node, newName)}
          triggerMeasure={triggerMeasure}
        />
      </div>
    </div>
  )
})

TreeNode.displayName = "TreeNode"
