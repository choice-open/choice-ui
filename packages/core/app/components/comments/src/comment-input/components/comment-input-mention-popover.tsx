import { Avatar } from "@choice-ui/avatar"
import { MenuItem, Menus, MenuScrollArrow } from "@choice-ui/menus"
import {
  autoUpdate,
  FloatingList,
  FloatingOverlay,
  FloatingPortal,
  offset,
  shift,
  size,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
} from "@floating-ui/react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { Range } from "slate"
import { ReactEditor } from "slate-react"
import { useEventCallback } from "usehooks-ts"
import type { User } from "../../types"

const PORTAL_ROOT_ID = "floating-menu-root"

interface CommentInputMentionPopoverProps {
  editor: ReactEditor
  onKeyNavigation: (index: number) => void
  onSelectMention: (user: User) => void
  searchText: string
  selectedIndex: number
  target: Range | null
  users: User[]
}

export const CommentInputMentionPopover = ({
  target,
  editor,
  users,
  searchText,
  selectedIndex,
  onSelectMention,
  onKeyNavigation,
}: CommentInputMentionPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrollTop, setScrollTop] = useState(0)
  const [isPositioned, setIsPositioned] = useState(false)
  const [activeIndex, setActiveIndex] = useState(selectedIndex)
  const [forceUpdate, setForceUpdate] = useState(0)
  const [needsScrolling, setNeedsScrolling] = useState(false)

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const elementsRef = useRef<Array<HTMLElement | null>>([])
  const labelsRef = useRef<Array<string | null>>([])
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  // 同步内部激活索引与外部索引
  useEffect(() => {
    setActiveIndex(selectedIndex)
  }, [selectedIndex])

  useEffect(() => {
    labelsRef.current = users.map((user) => user.name)
  }, [users])

  // 使用 useMemo 缓存过滤结果，避免每次渲染重新计算
  const filteredUsers = useMemo(
    () =>
      searchText
        ? users.filter((user) => user.name.toLowerCase().includes(searchText.toLowerCase()))
        : users,
    [users, searchText],
  )

  // 优化检查滚动逻辑，避免不必要的状态更新
  const checkNeedsScrolling = useCallback(() => {
    if (!scrollRef.current) return false

    const needsScroll = scrollRef.current.scrollHeight > scrollRef.current.clientHeight

    // 只有当值有变化时才更新状态
    if (needsScrolling !== needsScroll) {
      setNeedsScrolling(needsScroll)
    }
    return needsScroll
  }, [needsScrolling])

  // 处理用户选择mention，确保之后编辑器获得焦点
  const handleSelectWithFocus = useCallback(
    (user: User) => {
      // 首先调用原始的选择函数
      onSelectMention(user)

      // 然后使用setTimeout确保在React渲染周期后安全地聚焦编辑器
      setTimeout(() => {
        try {
          ReactEditor.focus(editor)
        } catch (error) {
          console.warn("Failed to focus editor after mention selection:", error)
        }
      }, 10)
    },
    [editor, onSelectMention],
  )

  // 当过滤数据变化时，更新布局和滚动状态
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setForceUpdate((prev) => prev + 1)

      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0
        setScrollTop(0)
        checkNeedsScrolling()
      }
    }, 0)

    return () => clearTimeout(timeoutId)
  }, [filteredUsers.length, checkNeedsScrolling])

  // 创建ResizeObserver来监听内容尺寸变化
  useEffect(() => {
    if (!resizeObserverRef.current && typeof ResizeObserver !== "undefined") {
      resizeObserverRef.current = new ResizeObserver(() => {
        if (isOpen) {
          setForceUpdate((prev) => prev + 1)
          checkNeedsScrolling()
        }
      })
    }

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
    }
  }, [isOpen, checkNeedsScrolling])

  // 监听内容元素尺寸变化
  useEffect(() => {
    const currentScrollRef = scrollRef.current
    const currentResizeObserver = resizeObserverRef.current

    if (currentScrollRef && currentResizeObserver) {
      currentResizeObserver.observe(currentScrollRef)

      return () => {
        currentResizeObserver.unobserve(currentScrollRef)
      }
    }
  }, [isOpen])

  // Floating UI 设置
  const { refs, floatingStyles, context, update } = useFloating({
    open: isOpen && !!target && filteredUsers.length > 0,
    onOpenChange: useCallback((open: boolean) => {
      setIsOpen(open)
    }, []),
    placement: "bottom-start",
    middleware: [
      offset({ mainAxis: 6 }),
      shift({ padding: 4 }),
      size({
        padding: 4,
        apply({ elements, availableHeight, rects }) {
          // 检测内容实际高度
          const contentHeight = scrollRef.current?.scrollHeight || elements.floating.scrollHeight

          // 根据内容实际高度和可用空间计算合适的高度
          const calculatedHeight = Math.min(contentHeight, availableHeight - 8)

          // 应用计算的高度
          Object.assign(elements.floating.style, {
            maxHeight: `${calculatedHeight}px`,
            overflow: "hidden",
          })

          // 设置内容容器的高度
          if (scrollRef.current) {
            scrollRef.current.style.maxHeight = `${calculatedHeight}px`
          }

          // 设置宽度
          if (!elements.floating.style.width) {
            elements.floating.style.minWidth = "220px"
          }

          setIsPositioned(true)
          setTimeout(checkNeedsScrolling, 0)
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  })

  // 监听强制更新状态变化，触发位置更新
  useEffect(() => {
    if (isOpen && forceUpdate > 0) {
      update()
    }
  }, [isOpen, forceUpdate, update])

  // 处理键盘导航回调
  const handleNavigate = useCallback(
    (nextIndex: number | null) => {
      if (nextIndex !== null) {
        setActiveIndex(nextIndex)
        onKeyNavigation(nextIndex)
      }
    },
    [onKeyNavigation],
  )

  // 配置键盘导航 - 使用虚拟模式
  const listNavigation = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    onNavigate: handleNavigate,
    loop: true,
    enabled: true,
    focusItemOnOpen: false,
    scrollItemIntoView: true, // 启用内置滚动支持
    virtual: true,
  })

  // 添加其他交互功能
  const role = useRole(context, { role: "menu" })
  const dismiss = useDismiss(context)

  // 组合所有交互
  const { getFloatingProps, getItemProps } = useInteractions([listNavigation, role, dismiss])

  // 处理滚动
  const handleScroll = useCallback(
    ({ currentTarget }: React.UIEvent) => {
      flushSync(() => {
        setScrollTop(currentTarget.scrollTop)
        checkNeedsScrolling()
      })
    },
    [checkNeedsScrolling],
  )

  // 处理滚动箭头点击
  const handleArrowScroll = useEventCallback((amount: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop -= amount
      flushSync(() => {
        setScrollTop(scrollRef.current?.scrollTop ?? 0)
        checkNeedsScrolling()
      })
    }
  })

  // 处理箭头隐藏 - 简化，移除未使用的逻辑
  const handleArrowHide = useEventCallback(() => {
    // 暂不需要特殊处理
  })

  // 在目标 @ 处定位弹出框
  useEffect(() => {
    if (target && filteredUsers.length > 0) {
      try {
        const domRange = ReactEditor.toDOMRange(editor, target)
        const rect = domRange.getBoundingClientRect()

        refs.setPositionReference({
          getBoundingClientRect: () => rect,
          contextElement: domRange.commonAncestorContainer.parentElement as HTMLElement,
        })

        setIsOpen(true)
      } catch (error) {
        console.error("Failed to position popover:", error)
        setIsOpen(false)
      }
    } else {
      setIsOpen(false)
    }
  }, [target, filteredUsers.length, editor, searchText, refs])

  // 在打开时设置初始焦点
  useEffect(() => {
    if (isOpen && filteredUsers.length > 0) {
      if (activeIndex === -1 || activeIndex >= filteredUsers.length) {
        setActiveIndex(0)
        onKeyNavigation(0)
      }
    }
  }, [isOpen, filteredUsers.length, activeIndex, onKeyNavigation])

  // 如果没有打开或没有结果，不渲染任何内容
  if (!isOpen || !target || filteredUsers.length === 0) {
    return null
  }

  return (
    <FloatingPortal id={PORTAL_ROOT_ID}>
      <FloatingOverlay
        lockScroll={false}
        className="z-menu"
      >
        <div
          ref={refs.setFloating}
          style={{
            ...floatingStyles,
            overflow: "hidden",
          }}
          {...getFloatingProps({
            onContextMenu(e) {
              e.preventDefault()
            },
          })}
        >
          <FloatingList
            elementsRef={elementsRef}
            labelsRef={labelsRef}
          >
            <Menus
              ref={scrollRef}
              onScroll={handleScroll}
              style={{ overflow: "auto" }}
            >
              {filteredUsers.map((user, index) => (
                <MenuItem
                  key={user.id}
                  active={index === activeIndex}
                  onMouseUp={() => handleSelectWithFocus(user)}
                  onMouseEnter={() => {
                    onKeyNavigation(index)
                    checkNeedsScrolling()
                  }}
                  ref={(node: HTMLElement | null) => {
                    elementsRef.current[index] = node
                  }}
                  {...getItemProps({
                    role: "menuitem",
                  })}
                >
                  {user.photo_url ? (
                    <Avatar
                      photo={user.photo_url}
                      name={user.name}
                      size="small"
                    />
                  ) : null}
                  <span className="flex-1 truncate">{user.name}</span>
                </MenuItem>
              ))}
            </Menus>

            {needsScrolling &&
              ["up", "down"].map((dir) => (
                <MenuScrollArrow
                  key={dir}
                  dir={dir as "up" | "down"}
                  scrollTop={scrollTop}
                  scrollRef={scrollRef}
                  innerOffset={0}
                  isPositioned={isPositioned}
                  onScroll={handleArrowScroll}
                />
              ))}
          </FloatingList>
        </div>
      </FloatingOverlay>
    </FloatingPortal>
  )
}
