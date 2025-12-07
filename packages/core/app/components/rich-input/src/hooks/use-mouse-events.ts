import { useEffect } from "react"
import { Editor } from "slate"
import { UseFloatingReturn } from "@floating-ui/react"
import type { CustomText } from "../types"

interface UseMouseEventsProps {
  charactersRefs: UseFloatingReturn["refs"]
  editor: Editor
  isParagraphExpanded: boolean
  paragraphCollapsedRefs: UseFloatingReturn["refs"]
  paragraphExpandedRefs: UseFloatingReturn["refs"]
  setCharactersUrl: (value: string) => void
  setIsCharactersStyleOpen: (value: boolean) => void
  setIsParagraphStyleOpen: (value: boolean) => void
  setIsUrlOpen: (value: boolean) => void
  slateRef: React.RefObject<HTMLDivElement>
  urlRefs: UseFloatingReturn["refs"]
}

export const useMouseEvents = (props: UseMouseEventsProps) => {
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

  useEffect(() => {
    function handleMouseUp(event: MouseEvent) {
      if (charactersRefs.floating.current?.contains(event.target as Element | null)) {
        return
      }
      const selection = window.getSelection()
      const marks = Editor.marks(editor) as Partial<CustomText>
      const range =
        typeof selection?.rangeCount === "number" && selection.rangeCount > 0
          ? selection.getRangeAt(0)
          : null

      // 首先隐藏字符样式选择器
      setIsCharactersStyleOpen(false)

      if (selection?.isCollapsed) {
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
    }

    function handleMouseDown(event: MouseEvent) {
      if (charactersRefs.floating.current?.contains(event.target as Element | null)) {
        return
      }
      if (window.getSelection()?.isCollapsed) {
        setIsCharactersStyleOpen(false)
      }
    }

    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("mousedown", handleMouseDown)
    return () => {
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("mousedown", handleMouseDown)
    }
  }, [
    charactersRefs,
    editor,
    paragraphCollapsedRefs,
    paragraphExpandedRefs,
    urlRefs,
    slateRef,
    setIsCharactersStyleOpen,
    setIsParagraphStyleOpen,
    setIsUrlOpen,
    setCharactersUrl,
    isParagraphExpanded,
  ])
}
