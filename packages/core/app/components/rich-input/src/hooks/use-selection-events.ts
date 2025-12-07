import { useEffect, useRef } from "react"
import { Editor } from "slate"
import { useEventCallback } from "usehooks-ts"
import type { CustomText, UseSelectionEventsProps } from "../types"

export const useSelectionEvents = (props: UseSelectionEventsProps) => {
  const {
    editor,
    charactersRefs,
    paragraphCollapsedRefs,
    paragraphExpandedRefs,
    urlRefs,
    slateRef,
    setIsCharactersStyleOpen,
    setIsParagraphStyleOpen,
    setIsUrlOpen,
    setCharactersUrl,
    isParagraphExpanded,
  } = props

  // 跟踪用户是否正在进行拖拽选择
  const isDraggingRef = useRef(false)
  const selectionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 处理选择变化的核心逻辑
  const handleSelectionChange = useEventCallback(() => {
    // 如果用户正在拖拽选择，跳过处理
    if (isDraggingRef.current) {
      return
    }

    // 检查当前元素是否在浮动菜单内，如果是则跳过处理
    const activeElement = document.activeElement
    if (
      charactersRefs.floating.current?.contains(activeElement) ||
      paragraphCollapsedRefs.floating.current?.contains(activeElement) ||
      paragraphExpandedRefs.floating.current?.contains(activeElement)
    ) {
      return
    }

    const selection = window.getSelection()
    const marks = Editor.marks(editor) as Partial<CustomText>
    const range =
      typeof selection?.rangeCount === "number" && selection.rangeCount > 0
        ? selection.getRangeAt(0)
        : null

    if (selection?.isCollapsed) {
      // 只有在光标位置时才隐藏字符样式选择器
      setIsCharactersStyleOpen(false)

      if (range) {
        // 如果没有文本被选中，但是光标在文本中，显示段落样式选择器
        // 为两个状态都设置 reference，确保切换时位置正确
        const referenceElement = {
          getBoundingClientRect: () => {
            const rect = slateRef.current?.getBoundingClientRect()
            const rangeRect = range.getBoundingClientRect()
            if (!rect || !rangeRect) {
              return new DOMRect()
            }
            return {
              ...rangeRect,
              x: rect.x,
              left: rect.left,
            }
          },
          getClientRects: () => {
            const slateRects = slateRef.current?.getClientRects()
            const rects = range.getClientRects()
            if (slateRects && rects[0]) {
              rects[0].x = slateRects[0].x
            }
            return rects
          },
        }

        // 同时设置两个 floating UI 的 reference
        paragraphCollapsedRefs.setReference(referenceElement)
        paragraphExpandedRefs.setReference(referenceElement)

        urlRefs.setReference({
          getBoundingClientRect: () => range.getBoundingClientRect(),
          getClientRects: () => range.getClientRects(),
        })
        setIsParagraphStyleOpen(true)
        if (marks?.link) {
          setIsUrlOpen(true)
          setCharactersUrl(marks["link"] ?? "")
        } else {
          setIsUrlOpen(false)
        }
      } else {
        // 如果光标不在文本中，隐藏所有样式选择器
        setIsParagraphStyleOpen(false)
        setIsUrlOpen(false)
      }
      return
    } else {
      // 有文本选择时隐藏段落样式选择器
      setIsParagraphStyleOpen(false)
    }

    if (range && !selection?.isCollapsed) {
      // 只有在确实有文本被选中时才显示文本样式选择器
      charactersRefs.setReference({
        getBoundingClientRect: () => range.getBoundingClientRect(),
        getClientRects: () => range.getClientRects(),
      })

      setIsCharactersStyleOpen(true)
    }
  })

  // 防抖处理选择变化
  const debouncedHandleSelectionChange = useEventCallback(() => {
    if (selectionTimeoutRef.current) {
      clearTimeout(selectionTimeoutRef.current)
    }
    selectionTimeoutRef.current = setTimeout(() => {
      handleSelectionChange()
    }, 50) // 50ms 防抖
  })

  // 监听鼠标事件
  useEffect(() => {
    function handleMouseDown(event: MouseEvent) {
      if (charactersRefs.floating.current?.contains(event.target as Element | null)) {
        return
      }

      // 检测用户开始拖拽选择
      const selection = window.getSelection()
      if (selection && !selection.isCollapsed) {
        isDraggingRef.current = true
      }

      if (selection?.isCollapsed) {
        setIsCharactersStyleOpen(false)
      }
    }

    function handleMouseUp(event: MouseEvent) {
      if (charactersRefs.floating.current?.contains(event.target as Element | null)) {
        return
      }

      // 结束拖拽选择
      isDraggingRef.current = false

      // 立即处理选择变化（鼠标操作不使用防抖）
      handleSelectionChange()
    }

    function handleMouseMove(event: MouseEvent) {
      // 如果用户正在拖拽选择，设置标志
      if (event.buttons === 1) {
        // 左键按下
        const selection = window.getSelection()
        if (selection && !selection.isCollapsed) {
          isDraggingRef.current = true
        }
      }
    }

    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [charactersRefs, handleSelectionChange, setIsCharactersStyleOpen])

  // 监听选择变化事件（包括键盘导航） - 使用防抖
  useEffect(() => {
    function handleSelectionChangeEvent() {
      // 对于 selectionchange 事件使用防抖处理，避免影响拖拽选择
      debouncedHandleSelectionChange()
    }

    document.addEventListener("selectionchange", handleSelectionChangeEvent)
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChangeEvent)
      // 清理防抖定时器
      if (selectionTimeoutRef.current) {
        clearTimeout(selectionTimeoutRef.current)
      }
    }
  }, [debouncedHandleSelectionChange])

  // 监听编辑器 DOM 上的键盘事件
  useEffect(() => {
    const slateElement = slateRef.current
    if (!slateElement) return

    function handleKeyUp(event: KeyboardEvent) {
      // 对于可能改变光标位置的键，立即处理选择变化
      const navigationKeys = [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Home",
        "End",
        "PageUp",
        "PageDown",
      ]
      if (navigationKeys.includes(event.key)) {
        // 键盘导航不使用防抖，立即更新位置
        setTimeout(() => {
          handleSelectionChange()
        }, 0)
      }
    }

    slateElement.addEventListener("keyup", handleKeyUp)
    return () => {
      slateElement.removeEventListener("keyup", handleKeyUp)
    }
  }, [handleSelectionChange, slateRef])
}
