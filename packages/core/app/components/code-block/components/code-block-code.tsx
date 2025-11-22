import { tcv } from "@choiceform/design-system"
import { memo, useEffect, useMemo, useState } from "react"
import { codeToHtml } from "shiki"
import { useTheme } from "../hooks"
import type { CodeBlockCodeProps } from "../types"

const codeBlockCodeTv = tcv({
  base: "text-message-code w-fit min-w-full font-mono [&>pre]:!bg-transparent [&>pre]:px-0 [&>pre]:py-0",
})

const highlightCache = new Map<string, string>()

function getCacheKey(code: string, language: string, theme: "light" | "dark"): string {
  return `${theme}:${language}:${code.slice(0, 100)}`
}

export const CodeBlockCode = memo(function CodeBlockCode(props: CodeBlockCodeProps) {
  const { code, language = "tsx", className, ...rest } = props

  const theme = useTheme()
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null)

  const cacheKey = useMemo(() => getCacheKey(code, language, theme), [code, language, theme])

  useEffect(() => {
    let cancelled = false

    const cached = highlightCache.get(cacheKey)
    if (cached) {
      setHighlightedHtml(cached)
      return
    }

    async function highlight() {
      if (!code) {
        const html = "<pre><code></code></pre>"
        if (!cancelled) {
          setHighlightedHtml(html)
          highlightCache.set(cacheKey, html)
        }
        return
      }

      try {
        const html = await codeToHtml(code, {
          lang: language,
          theme: theme === "light" ? "github-light" : "github-dark",
        })
        if (!cancelled) {
          setHighlightedHtml(html)
          highlightCache.set(cacheKey, html)

          if (highlightCache.size > 100) {
            const firstKey = highlightCache.keys().next().value
            if (firstKey) highlightCache.delete(firstKey)
          }
        }
      } catch {
        const html = `<pre><code>${code}</code></pre>`
        if (!cancelled) {
          setHighlightedHtml(html)
          highlightCache.set(cacheKey, html)
        }
      }
    }
    highlight()

    return () => {
      cancelled = true
    }
  }, [code, language, theme, cacheKey])

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
