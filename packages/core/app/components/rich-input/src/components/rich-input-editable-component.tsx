import { forwardRef, useMemo } from "react"
import { Editable, Slate } from "slate-react"
import { useRichInputContext } from "../context"
import { richInputTv } from "../tv"
import type { RichInputEditableProps } from "../types"
import { FloatingMenusContainer } from "./floating-menus-container"

/**
 * RichInput.Editable - 富文本编辑器核心组件
 * 包含 Slate 编辑器和浮动菜单容器
 */
export const RichInputEditableComponent = forwardRef<HTMLDivElement, RichInputEditableProps>(
  ({ className }, ref) => {
    const context = useRichInputContext()
    const tv = useMemo(() => richInputTv(), [])

    // 准备编辑器样式
    const editableStyle = useMemo(() => ({ minHeight: context.minHeight }), [context.minHeight])

    // 准备浮动菜单属性
    const floatingMenuProps = useMemo(
      () => ({
        editor: context.editor,
        isFocused: context.isFocused,
        isHover: context.isHover,
        editorInView: context.editorInView,
        enterFormatting: context.enterFormatting,
        portalElementId: context.portalElementId,
        floatingUI: context.floatingUI,
        editorState: context.editorState,
        charactersOptions: context.charactersOptions,
        paragraphOptions: context.paragraphOptions,
        i18n: context.i18n,
      }),
      [
        context.editor,
        context.isFocused,
        context.isHover,
        context.editorInView,
        context.enterFormatting,
        context.portalElementId,
        context.floatingUI,
        context.editorState,
        context.charactersOptions,
        context.paragraphOptions,
        context.i18n,
      ],
    )

    return (
      <Slate
        editor={context.editor}
        initialValue={context.value}
        onChange={context.handleEditorChange}
      >
        <Editable
          className={tv.editable({ className })}
          renderElement={context.renderElement}
          renderLeaf={context.renderLeaf}
          placeholder={context.placeholder}
          autoFocus={context.autoFocus}
          readOnly={context.readOnly}
          onKeyDown={context.onKeyDown}
          onCompositionStart={context.onCompositionStart}
          onCompositionEnd={context.onCompositionEnd}
          onFocus={context.onFocus}
          onBlur={context.onBlur}
          spellCheck={false}
          tabIndex={context.disableTabFocus ? -1 : undefined}
          style={editableStyle}
          {...context.editableProps}
        />

        <FloatingMenusContainer {...floatingMenuProps} />
      </Slate>
    )
  },
)

RichInputEditableComponent.displayName = "RichInput.Editable"
