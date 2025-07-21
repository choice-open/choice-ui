import { Check, CopySmall } from "@choiceform/icons-react"
import { useContext, useState } from "react"
import { IconButton, type IconButtonProps } from "../../icon-button"
import { ContextInputEditorContext } from "../hooks"
import { convertSlateToText } from "../utils"

export interface CopyButtonProps extends Omit<IconButtonProps, "onClick"> {
  onClick?: (copiedText: string) => void
  successDuration?: number
}

export function CopyButton({
  disabled = false,
  successDuration = 2000,
  onClick,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const editor = useContext(ContextInputEditorContext)

  const handleCopy = async () => {
    if (!editor) {
      console.warn("CopyButton must be used within ContextInput")
      return
    }

    try {
      // 转换SlateJS内容为字符串
      const textContent = convertSlateToText(editor.children)

      // 复制到剪贴板
      await navigator.clipboard.writeText(textContent)

      // 设置成功状态
      setCopied(true)

      // 触发回调
      onClick?.(textContent)

      // 重置状态
      setTimeout(() => setCopied(false), successDuration)
    } catch (error) {
      console.error("Failed to copy content:", error)
    }
  }

  return (
    <IconButton
      disabled={disabled}
      onClick={handleCopy}
      {...props}
    >
      {copied ? <Check /> : <CopySmall />}
    </IconButton>
  )
}
