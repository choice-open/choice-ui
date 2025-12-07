import { useI18n } from "@choiceform/design-shared"
import { ScrollArea } from "@choiceform/scroll-area"
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

export interface RichInputComponent
  extends React.ForwardRefExoticComponent<RichInputProps & React.RefAttributes<HTMLDivElement>> {
  Editable: typeof import("./components/rich-input-editable-component").RichInputEditableComponent
  Viewport: typeof import("./components/rich-input-viewport").RichInputViewport
}

/**
 * RichInput 基础组件 - 支持复合组件模式
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

  // 使用通用的 i18n Hook 处理国际化配置
  const mergedI18n = useI18n(defaultI18n, i18n)

  // UI状态管理
  const { ref: inViewRef, isIntersecting: editorInView } = useIntersectionObserver({})
  const viewportRef = useRef<HTMLDivElement>(null)

  // 编辑器状态管理（先初始化，用于传给 editorConfig）
  const editorState = useEditorState()

  // 编辑器配置（包含 ESC 键处理）
  const editorConfig = useEditorConfig({
    disableTabFocus,
    isParagraphExpanded: editorState.paragraph.isExpanded,
    setIsParagraphExpanded: editorState.paragraph.setIsExpanded,
  })

  // 受控组件逻辑 - 处理 Slate 非受控组件的问题
  const richInputState = useRichInput({
    value,
    onChange,
    editor: editorConfig.editor,
    autoFocus,
    autoMoveToEnd,
  })

  // 浮动UI管理
  const floatingUI = useFloatingUI()
  const mergedRef = useMergeRefs([ref, floatingUI.slateRef, inViewRef])
  const isHover = useHover(floatingUI.slateRef)

  // 渲染函数
  const renderElement = useCallback((props: import("slate-react").RenderElementProps) => {
    const elementProps = props as ElementRenderProps
    return <ElementRender {...elementProps} />
  }, [])

  const renderLeaf = useCallback((props: import("slate-react").RenderLeafProps) => {
    return <LeafRender {...props} />
  }, [])

  // 计算编辑器聚焦状态（实时计算，不缓存）
  const isFocused = ReactEditor.isFocused(editorConfig.editor)

  // 转换事件处理器类型，确保与组件接口兼容
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

  // 编辑器副作用
  useEditorEffects({
    editor: editorConfig.editor,
    value: richInputState.slateValue,
    isCharactersStyleOpen: editorState.characters.isStyleOpen,
    isParagraphStyleOpen: editorState.paragraph.isStyleOpen,
    setIsParagraphExpanded: editorState.paragraph.setIsExpanded,
    setSwitchUrlInput: editorState.characters.setSwitchUrlInput,
  })

  // 选择事件处理（包括鼠标和键盘）
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

  // 优化的滚动处理 - 使用批量更新
  const updateFloating = useCallback(() => {
    if (floatingUI.updateAll) {
      // 使用新的批量更新函数
      requestAnimationFrame(floatingUI.updateAll)
    }
  }, [floatingUI.updateAll])

  // 准备 Context 值
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
            // 默认渲染 - 向后兼容
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

// 创建复合组件
const RichInput = RichInputBase as RichInputComponent
RichInput.Viewport = RichInputViewport
RichInput.Editable = RichInputEditableComponent

export { RichInput }
