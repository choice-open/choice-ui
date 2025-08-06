import { EditorView, ViewUpdate } from "@codemirror/view"
import { Extension } from "@codemirror/state"
import { forwardRef } from "react"
import { tcx } from "~/utils"
import { useCodeEditor } from "./hooks"

export interface CodeEditorProps {
  autoFocus?: boolean
  className?: string
  customExtensions?: Extension[]
  onChange?(value: string, viewUpdate: ViewUpdate): void
  onEditorUpdate?: (update: ViewUpdate) => void
  onFormat?: (formattedCode: string) => void
  placeholder?: string | HTMLElement
  readonly?: boolean
  value?: string
}

export interface CodeEditorRef {
  getEditor: () => EditorView | null
}

export const CodeEditor = forwardRef<HTMLDivElement, CodeEditorProps>((props, ref) => {
  const { value, onChange, autoFocus, className, readonly, onEditorUpdate, onFormat } = props

  const { containerRef } = useCodeEditor({
    value,
    onChange,
    autoFocus,
    readonly,
    onEditorUpdate,
    onFormat,
  })

  return (
    <div
      ref={containerRef}
      className={tcx("relative h-full", className)}
    />
  )
})

CodeEditor.displayName = "CodeEditor"
