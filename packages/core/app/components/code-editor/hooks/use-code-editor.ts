import { EditorState, EditorStateConfig, Extension, StateEffect } from "@codemirror/state"
import { EditorView, ViewUpdate } from "@codemirror/view"
import { useEffect, useId, useLayoutEffect, useRef, useCallback } from "react"
import { useExtensions } from "./use-extensions"
import { useEvent } from "./use-event"
import { useLanguageExtensions } from "./use-language-extensions"

type Props = {
  autoFocus?: boolean
  customExtensions?: Extension[]
  onChange?: (value: string, viewUpdate: ViewUpdate) => void
  onEditorUpdate?: (update: ViewUpdate) => void
  onFormat?: (formattedCode: string) => void
  readonly?: boolean
  value?: string
}

export function useCodeEditor(props: Props) {
  const { value, customExtensions, autoFocus, onChange, readonly, onEditorUpdate, onFormat } = props

  const id = useId()

  const containerRef = useRef<HTMLDivElement>(null)
  const editorViewRef = useRef<EditorView | null>(null)

  const extensions = useExtensions({
    readonly,
    customExtensions,
    onEditorUpdate: onEditorUpdate ?? (() => {}),
    onFormat,
  })

  const { getFullLanguageExtensions } = useLanguageExtensions({
    editorView: editorViewRef.current,
    id,
  })

  const { blurOnClickOutside } = useEvent(editorViewRef)

  const createEditor = useCallback(async () => {
    if (!containerRef.current) return

    const config: EditorStateConfig = {
      doc: value,
      extensions,
    }
    const parent = containerRef.current
    const state = EditorState.create(config)

    const editorView = new EditorView({
      parent,
      state,
    })

    editorViewRef.current = editorView

    // 异步加载语言扩展
    const fullLanguageExtensions = await getFullLanguageExtensions()
    editorView.dispatch({
      effects: StateEffect.appendConfig.of(fullLanguageExtensions),
    })
  }, [value, extensions, getFullLanguageExtensions])

  // init & deinit
  useLayoutEffect(() => {
    createEditor()

    return () => {
      if (editorViewRef.current) {
        editorViewRef.current.destroy()
        editorViewRef.current = null
      }
    }
  }, [createEditor])

  useEffect(() => {
    if (autoFocus && editorViewRef.current) {
      editorViewRef.current.focus()
    }
  }, [autoFocus])

  useEffect(() => {
    document.addEventListener("click", blurOnClickOutside)

    return () => {
      document.removeEventListener("click", blurOnClickOutside)
    }
  }, [blurOnClickOutside])

  return {
    containerRef,
    editorViewRef,
  }
}
