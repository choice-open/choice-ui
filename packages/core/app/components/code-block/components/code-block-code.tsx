import { memo, useEffect, useState } from "react"
import { codeToHtml } from "shiki"
import { tcv } from "~/utils"
import { useTheme } from "../hooks"
import type { CodeBlockCodeProps } from "../types"

const codeBlockCodeTv = tcv({
  base: "text-message-code w-fit min-w-full bg-transparent font-mono [&>pre]:!bg-transparent [&>pre]:px-4 [&>pre]:py-4",
})

export const CodeBlockCode = memo(function CodeBlockCode(props: CodeBlockCodeProps) {
  const { code, language = "tsx", className, ...rest } = props

  const theme = useTheme()

  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null)

  useEffect(() => {
    async function highlight() {
      if (!code) {
        setHighlightedHtml("<pre><code></code></pre>")
        return
      }

      const html = await codeToHtml(code, {
        lang: language,
        theme: theme === "light" ? "github-light" : "github-dark",
      })
      setHighlightedHtml(html)
    }
    highlight()
  }, [code, language, theme])

  const classNames = codeBlockCodeTv({ className })

  // SSR fallback: render plain code if not hydrated yet
  return highlightedHtml ? (
    <div
      className={classNames}
      dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      {...rest}
    />
  ) : (
    <div
      className={classNames}
      {...rest}
    >
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  )
})
