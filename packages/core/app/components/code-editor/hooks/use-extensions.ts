import { EditorState, Extension } from "@codemirror/state"
import {
  drawSelection,
  dropCursor,
  EditorView,
  highlightActiveLine,
  keymap,
  lineNumbers,
  ViewUpdate,
} from "@codemirror/view"
import { useMemo } from "react"
import { history } from "@codemirror/commands"
import { codeEditorTheme, editorKeymap } from "../extensions"
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete"
import { highlightSelectionMatches } from "@codemirror/search"
import { bracketMatching, foldGutter, indentOnInput } from "@codemirror/language"
import { indentationMarkers } from "@replit/codemirror-indentation-markers"
import { createFormatExtension } from "../extensions/format"

type Props = {
  customExtensions?: Extension[]
  onEditorUpdate: (update: ViewUpdate) => void
  onFormat?: (formattedCode: string) => void
  readonly?: boolean
  rows?: number
}

export function useExtensions(props: Props) {
  const { readonly, customExtensions = [], rows, onEditorUpdate, onFormat } = props

  const extensions: Extension[] = useMemo(() => {
    const baseExtensions: Extension[] = [
      lineNumbers(),
      EditorView.lineWrapping,
      codeEditorTheme({
        isReadOnly: readonly,
        maxHeight: "100%",
        minHeight: "20vh",
        rows,
      }),
    ]

    if (readonly) {
      baseExtensions.push(EditorState.readOnly.of(true), EditorView.editable.of(false))
    } else {
      baseExtensions.push(
        EditorView.updateListener.of(onEditorUpdate),
        EditorState.allowMultipleSelections.of(true),
        EditorView.clickAddsSelectionRange.of(
          (event) => event.altKey && !event.metaKey && !event.shiftKey,
        ),
        highlightSelectionMatches({ minSelectionLength: 2 }),
        drawSelection(),
        foldGutter({
          markerDOM: (open) => {
            const svgNS = "http://www.w3.org/2000/svg"
            const wrapper = document.createElement("div")
            wrapper.classList.add("cm-fold-marker")
            const svgElement = document.createElementNS(svgNS, "svg")
            svgElement.setAttribute("viewBox", "0 0 10 10")
            svgElement.setAttribute("width", "6")
            svgElement.setAttribute("height", "6")
            const pathElement = document.createElementNS(svgNS, "path")
            const d = open ? "M1 3 L5 7 L9 3" : "M3 1 L7 5 L3 9" // Chevron paths
            pathElement.setAttribute("d", d)
            pathElement.setAttribute("fill", "none")
            pathElement.setAttribute("stroke", "currentColor")
            pathElement.setAttribute("stroke-width", "1.5")
            pathElement.setAttribute("stroke-linecap", "round")
            svgElement.appendChild(pathElement)
            wrapper.appendChild(svgElement)
            return wrapper
          },
        }),
        history(),
        dropCursor(),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        highlightActiveLine(),
        // mappingDropCursor(),
        indentationMarkers({
          highlightActiveBlock: true,
          markerType: "fullScope",
          colors: {
            activeDark: "var(--color-code-indentation-marker-active)",
            activeLight: "var(--color-code-indentation-marker-active)",
            dark: "var(--color-code-indentation-marker)",
            light: "var(--color-code-indentation-marker)",
          },
        }),
        keymap.of(editorKeymap),
        keymap.of(closeBracketsKeymap),
      )
    }

    const formatExtension = onFormat ? createFormatExtension(onFormat) : []

    return [baseExtensions, formatExtension, ...customExtensions]
  }, [customExtensions, onEditorUpdate, onFormat, readonly, rows])

  return extensions
}
