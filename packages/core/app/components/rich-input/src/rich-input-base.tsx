import { useI18n } from "@choice-ui/shared"
import { ScrollArea } from "@choice-ui/scroll-area"
import { useMergeRefs } from "@floating-ui/react"
import React, { forwardRef, useCallback, useRef } from "react"
import { Descendant } from "slate"
import { ReactEditor } from "slate-react"
import { useHover, useIntersectionObserver } from "usehooks-ts"
import {
  ElementRender,
  ElementRenderProps,
  LeafRender,
  RichInputEditableComponent,
  RichInputViewport,
} from "./components"
import { RichInputContext } from "./context"
import {
  useEditorConfig,
  useEditorEffects,
  useEditorState,
  useFloatingUI,
  useRichInput,
  useSelectionEvents,
} from "./hooks"
import { richInputTv } from "./tv"
import type { RichInputProps } from "./types"
import { defaultI18n } from "./types"
import { charactersOptions, paragraphOptions } from "./utils"

export interface RichInputComponent extends React.ForwardRefExoticComponent<
  RichInputProps & React.RefAttributes<HTMLDivElement>
> {
  Editable: typeof import("./components/rich-input-editable-component").RichInputEditableComponent
  Viewport: typeof import("./components/rich-input-viewport").RichInputViewport
}

/**
 * RichInput Base Component - Supports compound component pattern
 */
const RichInputBase = forwardRef<HTMLDivElement, RichInputProps>((props, ref) => {
  const {
    className,
    value = [{ type: "paragraph", children: [{ text: "" }] } as Descendant],
    editableProps,
    enterFormatting = true,
    i18n,
    portalElementId = "formatting-reference",
    readOnly,
    minHeight = 80,
    validation,
    placeholder,
    autoMoveToEnd = true,
    autoFocus = true,
    disableTabFocus,
    charactersOptionsProps,
    paragraphOptionsProps,
    onChange,
    onCompositionStart,
    onCompositionEnd,
    onFocus,
    onBlur,
    onValidationChange,
    children,
    ...divProps
  } = props

  // Use common i18n Hook for internationalization config
  const mergedI18n = useI18n(defaultI18n, i18n)

  // UI state management
  const { ref: inViewRef, isIntersecting: editorInView } = useIntersectionObserver({})
  const viewportRef = useRef<HTMLDivElement>(null)

  // Editor state management (initialized first for editorConfig)
  const editorState = useEditorState()

  // Editor config (includes ESC key handling)
  const editorConfig = useEditorConfig({
    disableTabFocus,
    isParagraphExpanded: editorState.paragraph.isExpanded,
    setIsParagraphExpanded: editorState.paragraph.setIsExpanded,
  })

  // Controlled component logic - handles Slate uncontrolled component issues
  const richInputState = useRichInput({
    value,
    onChange,
    editor: editorConfig.editor,
    autoFocus,
    autoMoveToEnd,
  })

  // Floating UI management
  const floatingUI = useFloatingUI()
  const mergedRef = useMergeRefs([ref, floatingUI.slateRef, inViewRef])
  const isHover = useHover(floatingUI.slateRef)

  // Render functions
  const renderElement = useCallback((props: import("slate-react").RenderElementProps) => {
    const elementProps = props as ElementRenderProps
    return <ElementRender {...elementProps} />
  }, [])

  const renderLeaf = useCallback((props: import("slate-react").RenderLeafProps) => {
    return <LeafRender {...props} />
  }, [])

  // Calculate editor focus state (real-time, not cached)
  const isFocused = ReactEditor.isFocused(editorConfig.editor)

  // Convert event handler types to ensure component interface compatibility
  const handleFocus = useCallback(() => {
    if (onFocus) {
      const mockEvent = {} as React.FocusEvent<HTMLDivElement>
      onFocus(mockEvent)
    }
  }, [onFocus])

  const handleBlur = useCallback(() => {
    if (onBlur) {
      const mockEvent = {} as React.FocusEvent<HTMLDivElement>
      onBlur(mockEvent)
    }
  }, [onBlur])

  const handleCompositionStart = useCallback(
    (event: React.CompositionEvent) => {
      if (onCompositionStart) {
        const adaptedEvent = event as React.CompositionEvent<HTMLDivElement>
        onCompositionStart(adaptedEvent)
      }
    },
    [onCompositionStart],
  )

  const handleCompositionEnd = useCallback(
    (event: React.CompositionEvent) => {
      if (onCompositionEnd) {
        const adaptedEvent = event as React.CompositionEvent<HTMLDivElement>
        onCompositionEnd(adaptedEvent)
      }
    },
    [onCompositionEnd],
  )

  // Editor side effects
  useEditorEffects({
    editor: editorConfig.editor,
    value: richInputState.slateValue,
    isCharactersStyleOpen: editorState.characters.isStyleOpen,
    isParagraphStyleOpen: editorState.paragraph.isStyleOpen,
    setIsParagraphExpanded: editorState.paragraph.setIsExpanded,
    setSwitchUrlInput: editorState.characters.setSwitchUrlInput,
  })

  // Selection event handling (includes mouse and keyboard)
  useSelectionEvents({
    editor: editorConfig.editor,
    charactersRefs: floatingUI.characters.refs,
    paragraphCollapsedRefs: floatingUI.paragraphCollapsed.refs,
    paragraphExpandedRefs: floatingUI.paragraphExpanded.refs,
    urlRefs: floatingUI.url.refs,
    slateRef: floatingUI.slateRef,
    setIsCharactersStyleOpen: editorState.characters.setIsStyleOpen,
    setIsParagraphStyleOpen: editorState.paragraph.setIsStyleOpen,
    setIsUrlOpen: editorState.url.setIsOpen,
    setCharactersUrl: editorState.characters.setUrl,
    isParagraphExpanded: editorState.paragraph.isExpanded,
  })

  // Optimized scroll handling - use batch updates
  const updateFloating = useCallback(() => {
    if (floatingUI.updateAll) {
      // Use batch update function
      requestAnimationFrame(floatingUI.updateAll)
    }
  }, [floatingUI.updateAll])

  // Prepare Context value
  const contextValue = {
    // Editor related
    editor: editorConfig.editor,
    isFocused,
    renderElement,
    renderLeaf,
    handleEditorChange: richInputState.handleChange,
    onKeyDown: editorConfig.handleKeyDown,

    // Event handlers
    onCompositionStart: handleCompositionStart,
    onCompositionEnd: handleCompositionEnd,
    onFocus: handleFocus,
    onBlur: handleBlur,

    // Editor state
    value: richInputState.slateValue,
    placeholder,
    autoFocus,
    readOnly,
    minHeight,
    editableProps: editableProps as Record<string, unknown> | undefined,
    disableTabFocus,

    // UI state
    isHover,
    editorInView,
    enterFormatting,
    portalElementId,
    floatingUI,
    editorState,
    charactersOptions: charactersOptionsProps || charactersOptions,
    paragraphOptions: paragraphOptionsProps || paragraphOptions,
    i18n: mergedI18n,

    // Refs
    viewportRef,
  }

  const tv = richInputTv()

  return (
    <RichInputContext.Provider value={contextValue}>
      <div
        {...divProps}
        ref={mergedRef}
        className={tv.root({ className })}
      >
        <ScrollArea
          scrollbarMode="default"
          orientation="vertical"
          onScroll={updateFloating}
        >
          {children ? (
            children
          ) : (
            // Default render - backward compatible
            <RichInputViewport>
              <RichInputEditableComponent />
            </RichInputViewport>
          )}
        </ScrollArea>
      </div>
    </RichInputContext.Provider>
  )
})

RichInputBase.displayName = "RichInput"

// Create compound component
const RichInput = RichInputBase as RichInputComponent
RichInput.Viewport = RichInputViewport
RichInput.Editable = RichInputEditableComponent

export { RichInput }
