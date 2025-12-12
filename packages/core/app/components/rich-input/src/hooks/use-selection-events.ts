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

  // Track if user is performing drag selection
  const isDraggingRef = useRef(false)
  const selectionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Core logic for handling selection changes
  const handleSelectionChange = useEventCallback(() => {
    // Skip processing if user is drag selecting
    if (isDraggingRef.current) {
      return
    }

    // Check if active element is inside floating menu, skip if so
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
      // Only hide character style selector when cursor is collapsed
      setIsCharactersStyleOpen(false)

      if (range) {
        // If no text selected but cursor is in text, show paragraph style selector
        // Set reference for both states to ensure correct position when toggling
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

        // Set reference for both floating UIs
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
        // If cursor is not in text, hide all style selectors
        setIsParagraphStyleOpen(false)
        setIsUrlOpen(false)
      }
      return
    } else {
      // Hide paragraph style selector when text is selected
      setIsParagraphStyleOpen(false)
    }

    if (range && !selection?.isCollapsed) {
      // Only show text style selector when text is actually selected
      charactersRefs.setReference({
        getBoundingClientRect: () => range.getBoundingClientRect(),
        getClientRects: () => range.getClientRects(),
      })

      setIsCharactersStyleOpen(true)
    }
  })

  // Debounce selection change handling
  const debouncedHandleSelectionChange = useEventCallback(() => {
    if (selectionTimeoutRef.current) {
      clearTimeout(selectionTimeoutRef.current)
    }
    selectionTimeoutRef.current = setTimeout(() => {
      handleSelectionChange()
    }, 50) // 50ms debounce
  })

  // Listen for mouse events
  useEffect(() => {
    function handleMouseDown(event: MouseEvent) {
      if (charactersRefs.floating.current?.contains(event.target as Element | null)) {
        return
      }

      // Detect user starting drag selection
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

      // End drag selection
      isDraggingRef.current = false

      // Immediately handle selection change (no debounce for mouse operations)
      handleSelectionChange()
    }

    function handleMouseMove(event: MouseEvent) {
      // Set flag if user is drag selecting
      if (event.buttons === 1) {
        // Left button pressed
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

  // Listen for selection change events (includes keyboard navigation) - with debounce
  useEffect(() => {
    function handleSelectionChangeEvent() {
      // Use debounce for selectionchange events to avoid affecting drag selection
      debouncedHandleSelectionChange()
    }

    document.addEventListener("selectionchange", handleSelectionChangeEvent)
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChangeEvent)
      // Clean up debounce timer
      if (selectionTimeoutRef.current) {
        clearTimeout(selectionTimeoutRef.current)
      }
    }
  }, [debouncedHandleSelectionChange])

  // Listen for keyboard events on editor DOM
  useEffect(() => {
    const slateElement = slateRef.current
    if (!slateElement) return

    function handleKeyUp(event: KeyboardEvent) {
      // For keys that may change cursor position, immediately handle selection change
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
        // No debounce for keyboard navigation, update position immediately
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
