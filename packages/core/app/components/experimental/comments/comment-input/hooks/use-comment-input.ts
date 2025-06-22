import { KeyboardEvent, useCallback, useMemo, useState } from "react"
import { createEditor, Descendant, Editor, Node, Path, Range, Transforms } from "slate"
import { withHistory } from "slate-history"
import { ReactEditor, withReact } from "slate-react"
import type { User } from "../../types"
import { insertMention, withHtml, withImages, withMentions } from "../components"
import type { CustomEditor, ImageElement, ParagraphElement } from "../types"
import { isEmptyContent, isImageElement, isMentionElement } from "../utils"

interface UseCommentInputProps {
  initialValue?: Descendant[]
  maxUploadFiles?: number
  onChange?: (value: Descendant[]) => void
  onSubmit?: (value: Descendant[]) => void
  users?: User[]
}

// 定义一个安全的日志记录函数
const safeConsoleError = (message: string, error?: unknown) => {
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    console.error(message, error)
  }
}

// 创建一个标准的空编辑器值
const createEmptyValue = (): Descendant[] => {
  return [{ type: "paragraph", children: [{ text: "" }] } as ParagraphElement]
}

export const useCommentInput = ({
  users = [],
  onChange,
  onSubmit,
  initialValue,
  maxUploadFiles = 5,
}: UseCommentInputProps) => {
  // 创建格式化初始值的函数
  const normalizeInitialValue = useCallback((value: Descendant[] | undefined): Descendant[] => {
    if (!value || value.length === 0 || isEmptyContent(value)) {
      return createEmptyValue()
    }
    return value
  }, [])

  // 使用不可变引用初始化值，提高性能
  const [value, setValue] = useState<Descendant[]>(() => normalizeInitialValue(initialValue))

  // Set allowSubmission state based on initial value
  const [allowSubmission, setAllowSubmission] = useState(
    initialValue ? !isEmptyContent(initialValue) : false,
  )

  // 添加 typing 状态 - 检查是否有任何输入（文本、mention 或图片）
  const [typing, setTyping] = useState(initialValue ? !isEmptyContent(initialValue) : false)

  // Mention states
  const [target, setTarget] = useState<Range | null>(null)
  const [mentionIndex, setMentionIndex] = useState(0)
  const [mentionSearch, setMentionSearch] = useState("")

  // 添加错误状态
  const [error, setError] = useState<string | null>(null)

  // Initialize the editor with plugins
  const editor = useMemo(() => {
    // 使用插件链并直接断言类型
    const slateEditor = withMentions(
      withImages(withHtml(withHistory(withReact(createEditor())))),
    ) as CustomEditor

    return slateEditor
  }, [])

  // 安全地获取编辑器文本内容
  const getEditorTextContent = useCallback(() => {
    try {
      // 检查编辑器是否有内容
      if (!editor.children || editor.children.length === 0) {
        return ""
      }

      // 收集所有文本节点的内容
      let text = ""
      for (const node of editor.children) {
        if (Node.string(node)) {
          text += Node.string(node)
        }
      }

      return text.trim()
    } catch (error) {
      safeConsoleError("Failed to get editor text:", error)
      return ""
    }
  }, [editor])

  // 检查是否有文本或提及内容（不考虑图片）
  const hasTextOrMentionContent = useCallback(() => {
    try {
      // 1. 安全地检查文本内容
      const textContent = getEditorTextContent()
      if (textContent && textContent !== "") {
        return true
      }

      // 2. 检查提及元素
      if (editor.children && editor.children.length > 0) {
        const hasMentions =
          Array.from(
            Editor.nodes(editor, {
              at: [],
              match: (n) => isMentionElement(n),
            }),
          ).length > 0

        if (hasMentions) {
          return true
        }
      }

      return false
    } catch (error) {
      safeConsoleError("Failed to check text/mention content:", error)
      return false
    }
  }, [editor, getEditorTextContent])

  // 检查是否有任何内容（文本、mention 或图片）
  const hasAnyContent = useCallback(() => {
    try {
      // 1. 检查文本或提及内容
      if (hasTextOrMentionContent()) {
        return true
      }

      // 2. 检查图片内容
      if (editor.children && editor.children.length > 0) {
        const hasImages =
          Array.from(
            Editor.nodes(editor, {
              at: [],
              match: (n) => isImageElement(n),
            }),
          ).length > 0

        if (hasImages) {
          return true
        }
      }

      return false
    } catch (error) {
      safeConsoleError("Failed to check any content:", error)
      return false
    }
  }, [editor, hasTextOrMentionContent])

  // 检查内容是否为空的优化版本 - 仅用于 allowSubmission
  const checkHasContent = useCallback(
    (nodes: Descendant[]): boolean => {
      // 首先检查是否有文本或提及内容
      if (hasTextOrMentionContent()) {
        return true
      }

      // 如果没有文本或提及内容，但检测到图片，仍然返回false（不允许只有图片的评论）
      const hasImages =
        Array.from(
          Editor.nodes(editor, {
            at: [],
            match: (n) => isImageElement(n),
          }),
        ).length > 0

      // 之前的检查逻辑，现在只判断非图片内容
      return false
    },
    [editor, hasTextOrMentionContent],
  )

  // 查找编辑器中现有的图片元素
  const findImageElement = useCallback(() => {
    try {
      const imageNodes = Array.from(
        Editor.nodes(editor, {
          at: [],
          match: (n) => isImageElement(n),
        }),
      )

      return imageNodes.length > 0 ? imageNodes[0] : null
    } catch (error) {
      safeConsoleError("Failed to find image element:", error)
      return null
    }
  }, [editor])

  // 获取当前上传的图片总数
  const getCurrentImagesCount = useCallback(() => {
    try {
      const imageElement = findImageElement()
      if (!imageElement) return 0

      const [node] = imageElement
      const imageNode = node as ImageElement

      return imageNode.attachments?.length || 0
    } catch (error) {
      safeConsoleError("Failed to get images count:", error)
      return 0
    }
  }, [findImageElement])

  // 判断是否已达到最大上传数量
  const isUploadLimitReached = useCallback(() => {
    const currentCount = getCurrentImagesCount()
    return currentCount >= maxUploadFiles
  }, [getCurrentImagesCount, maxUploadFiles])

  // 确保图片元素在文本最底部
  const ensureImageAtBottom = useCallback(() => {
    try {
      const imageElement = findImageElement()

      if (!imageElement) return

      const [node, path] = imageElement

      // 获取最后一个节点的路径
      const lastPath = [editor.children.length - 1]

      // 如果图片已经是最后一个节点，不需要移动
      if (Path.equals(path, lastPath)) return

      // 将图片移动到最后
      Transforms.moveNodes(editor, {
        at: path,
        to: [editor.children.length],
      })
    } catch (error) {
      safeConsoleError("Failed to ensure image at bottom:", error)
    }
  }, [editor, findImageElement])

  // 是否有图片但没有文本/提及内容
  const hasOnlyImages = useCallback(() => {
    const hasImages = getCurrentImagesCount() > 0
    const hasTextMention = hasTextOrMentionContent()

    return hasImages && !hasTextMention
  }, [getCurrentImagesCount, hasTextOrMentionContent])

  // Handle value changes
  const handleChange = useCallback(
    (newValue: Descendant[]) => {
      setValue(newValue)

      // 检查内容以确定allowSubmission状态 - 只有文本或mention才能提交
      const hasContent = checkHasContent(newValue)

      // 只有在状态不同时才更新，避免不必要的渲染
      if (allowSubmission !== hasContent) {
        setAllowSubmission(hasContent)
      }

      // 检查是否有任何内容（文本、mention或图片）- 更新 typing 状态
      const hasAnyInputContent = hasAnyContent()
      if (typing !== hasAnyInputContent) {
        setTyping(hasAnyInputContent)
      }

      // Call the onChange callback if provided
      if (onChange) {
        onChange(newValue)
      }

      // 确保图片元素始终在底部
      ensureImageAtBottom()

      // Check for @ mentions
      const { selection } = editor

      if (selection && Range.isCollapsed(selection)) {
        // Get the cursor position
        const { anchor } = selection

        // Try to find the text node at the cursor
        try {
          const textNode = Node.get(editor, anchor.path)
          if (textNode && Node.string(textNode)) {
            // Get the text before the cursor
            const textBefore = Node.string(textNode).slice(0, anchor.offset)

            // Check if we have a valid @ mention pattern
            const match = textBefore.match(/@(\w*)$/)

            if (match) {
              // Found a potential @ mention - create the range
              const start = anchor.offset - match[0].length
              const end = anchor.offset

              const mentionRange = {
                anchor: { path: anchor.path, offset: start },
                focus: { path: anchor.path, offset: end },
              }

              // Update the target and search text
              setTarget(mentionRange)
              setMentionSearch(match[1] || "")
              setMentionIndex(0)
              return
            }
          }
        } catch (err) {
          safeConsoleError("Error detecting mention:", err)
        }
      }

      // No valid mention found, clear the target
      setTarget(null)
    },
    [
      onChange,
      allowSubmission,
      typing,
      checkHasContent,
      hasAnyContent,
      editor,
      ensureImageAtBottom,
    ],
  )

  // Handle key presses for mention selection
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      // Handle mention selection with keyboard
      if (target) {
        // Filter users based on search
        const filteredUsers = mentionSearch
          ? users.filter((user) => user.name.toLowerCase().includes(mentionSearch.toLowerCase()))
          : users

        if (filteredUsers.length > 0) {
          switch (event.key) {
            case "ArrowDown":
              event.preventDefault()
              setMentionIndex((prev) => Math.min(prev + 1, filteredUsers.length - 1))
              break
            case "ArrowUp":
              event.preventDefault()
              setMentionIndex((prev) => Math.max(prev - 1, 0))
              break
            case "Tab":
            case "Enter":
              event.preventDefault()
              handleMention(filteredUsers[mentionIndex])
              break
            case "Escape":
              event.preventDefault()
              setTarget(null)
              break
            default:
              return
          }
          return
        }
      }

      // Handle form submission when Enter is pressed without Shift
      if (event.key === "Enter" && !event.shiftKey && !target) {
        event.preventDefault()

        // 检查内容是否为空
        if (isEmptyContent(value)) return

        // 检查是否只有图片无文本
        if (hasOnlyImages()) {
          setError("Cannot submit comment with only images. Please add some text.")
          setTimeout(() => {
            setError(null)
          }, 3000)
          return
        }

        if (onSubmit) {
          onSubmit(value)
        }

        resetEditor()
      }
    },
    [target, mentionSearch, mentionIndex, users, value, onSubmit, hasOnlyImages],
  )

  // Handle @ button click
  const handleMentionButtonClick = useCallback(() => {
    try {
      const domNode = editor.children[0]
      if (domNode) {
        ReactEditor.focus(editor)
      }

      // Insert @ character
      const { selection } = editor

      // Get current position
      const point = selection ? selection.anchor : Editor.end(editor, [])

      // Check if we need a space before the @
      let needsSpace = false
      if (selection) {
        const before = Editor.before(editor, selection.anchor)
        if (before) {
          const charBefore = Editor.string(editor, Editor.range(editor, before, selection.anchor))
          needsSpace = charBefore !== "" && charBefore !== " "
        }
      }

      // Insert @ with space if needed
      Transforms.select(editor, point)
      Transforms.insertText(editor, needsSpace ? " @" : "@")
    } catch (error) {
      safeConsoleError("Failed to handle @ button click:", error)
    }
  }, [editor])

  // 重置编辑器内容
  const resetEditor = useCallback(() => {
    try {
      // 创建一个干净的空编辑器内容
      const emptyValue = createEmptyValue()

      // 更新编辑器内容 - 使用完全替换的方式而不是修改现有内容
      editor.children = emptyValue

      // 重置选区到开始位置
      Transforms.select(editor, Editor.start(editor, []))

      // 通知React组件更新状态
      setValue(emptyValue)
      setAllowSubmission(false)
      setTyping(false)
      setTarget(null)
      setMentionSearch("")
      setMentionIndex(0)
      setError(null)
    } catch (error) {
      safeConsoleError("Failed to reset editor:", error)
    }
  }, [editor])

  // Handle form submission
  const handleSubmit = useCallback(() => {
    // 检查是否只有图片无文本
    if (hasOnlyImages()) {
      setError("Cannot submit comment with only images. Please add some text.")
      setTimeout(() => {
        setError(null)
      }, 3000)
      return
    }

    resetEditor()
  }, [resetEditor, hasOnlyImages])

  // Handle inserting a mention
  const handleMention = useCallback(
    (user: User) => {
      if (!target) return

      try {
        Transforms.select(editor, target)
        insertMention(editor, user)
        setTarget(null)
      } catch (error) {
        safeConsoleError("Failed to insert mention:", error)
      }
    },
    [editor, target],
  )

  // Handle image uploads
  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files

      if (!files || files.length === 0) return

      // 确保编辑器获得焦点
      try {
        const domNode = editor.children[0]
        if (domNode) {
          ReactEditor.focus(editor)
        }
      } catch (e) {
        safeConsoleError("Failed to focus editor:", e)
      }

      // 检查上传限制
      const currentImagesCount = getCurrentImagesCount()
      const remainingSlots = maxUploadFiles - currentImagesCount

      if (remainingSlots <= 0) {
        // 已达到上传限制，直接返回
        event.target.value = ""
        return
      }

      // 限制上传数量，确保总数不超过maxUploadFiles
      const filesToProcess = Array.from(files).slice(0, remainingSlots)

      try {
        // 并行处理文件
        const processedAttachments = await Promise.all(
          filesToProcess.map((file) => {
            return new Promise<{ name: string; size: number; type: string; url: string }>(
              (resolve) => {
                const reader = new FileReader()
                reader.addEventListener("load", () => {
                  resolve({
                    url: reader.result as string,
                    name: file.name,
                    type: file.type,
                    size: file.size,
                  })
                })
                reader.readAsDataURL(file)
              },
            )
          }),
        )

        // 查找现有的图片元素
        const existingImageElement = findImageElement()

        if (existingImageElement) {
          // 如果已有图片元素，向其添加新图片
          const [node, path] = existingImageElement
          const imageNode = node as ImageElement

          // 将新图片附加到现有的附件数组中
          const updatedAttachments = [...(imageNode.attachments || []), ...processedAttachments]

          // 更新节点
          Transforms.setNodes(editor, { attachments: updatedAttachments }, { at: path })
        } else {
          // 如果没有现有图片元素，创建一个新的
          const imageNode: ImageElement = {
            type: "image",
            attachments: processedAttachments,
            children: [{ text: "" }],
          }

          // 在文档末尾插入图片元素
          Transforms.insertNodes(editor, imageNode, { at: [editor.children.length] })
        }

        // 将光标放回到编辑器中上次选择的位置，或者文档开头
        if (editor.selection) {
          Transforms.select(editor, editor.selection)
        } else {
          Transforms.select(editor, Editor.start(editor, []))
        }

        // 检查并更新allowSubmission状态 - 仅当有文本或提及内容时才设置为true
        setAllowSubmission(hasTextOrMentionContent())

        // 更新 typing 状态 - 任何内容都会触发
        setTyping(true)
      } catch (error) {
        safeConsoleError("Failed to process images:", error)
        setError("Failed to upload images. Please try again.")
      }

      // Reset the file input
      event.target.value = ""
    },
    [editor, findImageElement, getCurrentImagesCount, maxUploadFiles, hasTextOrMentionContent],
  )

  // 处理删除图片的逻辑
  const handleRemoveImage = useCallback(
    (nodePath: Path, attachmentIndex?: number) => {
      try {
        // 获取图片节点
        const nodeEntry = Editor.node(editor, nodePath)
        if (!nodeEntry) return

        const [node] = nodeEntry as [ImageElement, Path]

        // 使用原子操作处理删除
        Editor.withoutNormalizing(editor, () => {
          // 如果指定了附件索引，并且有多个附件，则只删除该附件
          if (
            typeof attachmentIndex === "number" &&
            node.attachments &&
            node.attachments.length > 1
          ) {
            // 创建新的附件数组，排除要删除的附件
            const newAttachments = node.attachments.filter((_, i) => i !== attachmentIndex)

            // 更新节点的附件数组
            Transforms.setNodes(editor, { attachments: newAttachments }, { at: nodePath })
          } else {
            // 如果只有一个附件或没有指定索引，则删除整个节点
            Transforms.removeNodes(editor, { at: nodePath })
          }
        })

        // 检查删除后是否还有内容以更新allowSubmission状态
        setTimeout(() => {
          // 仅当有文本或提及内容时才设置allowSubmission为true
          setAllowSubmission(hasTextOrMentionContent())

          // 更新 typing 状态 - 检查是否还有任何内容
          setTyping(hasAnyContent())
        }, 0)
      } catch (error) {
        safeConsoleError("Failed to remove image:", error)
      }
    },
    [editor, hasTextOrMentionContent, hasAnyContent],
  )

  return {
    editor,
    value,
    allowSubmission,
    typing,
    handleImageUpload,
    handleKeyDown,
    handleMention,
    handleChange,
    handleSubmit,
    handleMentionButtonClick,
    handleRemoveImage,
    target,
    mentionIndex,
    mentionSearch,
    error,
    setError,
    setMentionIndex,
    imageCount: getCurrentImagesCount(),
    maxImageCount: maxUploadFiles,
    isImageUploadLimitReached: isUploadLimitReached(),
    hasOnlyImages: hasOnlyImages(),
  }
}
