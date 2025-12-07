import { useEventCallback } from "usehooks-ts"

export function useMarkdownFormatting(textareaRef: React.RefObject<HTMLTextAreaElement>) {
  const insertText = useEventCallback((text: string, onChange?: (value: string) => void) => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.focus()

    const success = document.execCommand("insertText", false, text)
    if (success) {
      onChange?.(textarea.value)
    } else {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const value = textarea.value
      const newValue = value.slice(0, start) + text + value.slice(end)
      textarea.value = newValue
      const newCursorPos = start + text.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
      onChange?.(newValue)
    }
  })

  const insertListPrefix = useEventCallback(
    (prefix: string, onChange?: (value: string) => void) => {
      const textarea = textareaRef.current
      if (!textarea) return

      textarea.focus()

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const value = textarea.value

      const beforeSelection = value.slice(0, start)
      const selectedText = value.slice(start, end)
      const afterSelection = value.slice(end)

      const lines = selectedText.split("\n")
      const isMultiLine = lines.length > 1

      if (isMultiLine) {
        const startLineIndex = beforeSelection.lastIndexOf("\n") + 1
        const isOrderedList = prefix.includes(".")
        let counter = 1

        const processedLines = lines.map((line) => {
          if (line.trim() === "") {
            return line
          }
          if (isOrderedList) {
            const numberedPrefix = `${counter}. `
            counter++
            return numberedPrefix + line
          }
          return prefix + line
        })

        const newSelectedText = processedLines.join("\n")
        const newValue = value.slice(0, startLineIndex) + newSelectedText + afterSelection

        textarea.setSelectionRange(startLineIndex, end)
        const success = document.execCommand("insertText", false, newSelectedText)
        if (success) {
          const newStart = startLineIndex
          const newEnd = startLineIndex + newSelectedText.length
          textarea.setSelectionRange(newStart, newEnd)
          onChange?.(textarea.value)
        } else {
          textarea.value = newValue
          const newStart = startLineIndex
          const newEnd = startLineIndex + newSelectedText.length
          textarea.setSelectionRange(newStart, newEnd)
          const inputEvent = new Event("input", { bubbles: true, cancelable: true })
          textarea.dispatchEvent(inputEvent)
          onChange?.(newValue)
        }
      } else {
        insertText(prefix, onChange)
      }
    },
  )

  const wrapText = useEventCallback(
    (before: string, after: string, onChange?: (value: string) => void) => {
      const textarea = textareaRef.current
      if (!textarea) return

      textarea.focus()

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = textarea.value.slice(start, end)

      if (selectedText) {
        const success = document.execCommand("insertText", false, before + selectedText + after)
        if (success) {
          const newStart = start + before.length
          const newEnd = newStart + selectedText.length
          textarea.setSelectionRange(newStart, newEnd)
          onChange?.(textarea.value)
        } else {
          const value = textarea.value
          const newValue = value.slice(0, start) + before + selectedText + after + value.slice(end)
          textarea.value = newValue
          const newStart = start + before.length
          const newEnd = newStart + selectedText.length
          textarea.setSelectionRange(newStart, newEnd)
          onChange?.(newValue)
        }
      } else {
        const success = document.execCommand("insertText", false, before + after)
        if (success) {
          const newCursorPos = start + before.length
          textarea.setSelectionRange(newCursorPos, newCursorPos)
          onChange?.(textarea.value)
        } else {
          const value = textarea.value
          const newValue = value.slice(0, start) + before + after + value.slice(end)
          textarea.value = newValue
          const newCursorPos = start + before.length
          textarea.setSelectionRange(newCursorPos, newCursorPos)
          onChange?.(newValue)
        }
      }
    },
  )

  return {
    insertText,
    wrapText,
    insertListPrefix,
  }
}
