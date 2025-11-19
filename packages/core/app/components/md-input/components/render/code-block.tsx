import type { HTMLProps } from "react"
import { memo, useEffect, useMemo, useState } from "react"
import { codeToHtml } from "shiki"
import { ScrollArea } from "~/components/scroll-area"
import { tcx } from "~/utils"
import { CodeBlockTv } from "./tv"

interface CodeBlockProps extends HTMLProps<HTMLDivElement> {
  code: string
  language?: string
  theme?: "light" | "dark"
}

const highlightCache = new Map<string, string>()

function getCacheKey(code: string, language: string, theme: "light" | "dark"): string {
  return `${theme}:${language}:${code.slice(0, 100)}`
}

export const CodeBlock = memo(function CodeBlock(props: CodeBlockProps) {
  const { code, language = "plaintext", theme = "light", className, ...rest } = props
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

  const tv = CodeBlockTv()

  return (
    <div
      className={tcx(tv.root(), className)}
      {...rest}
    >
      <ScrollArea orientation="both">
        <ScrollArea.Viewport>
          <ScrollArea.Content className={tv.content()}>
            {highlightedHtml ? (
              <div
                className={tv.code()}
                dangerouslySetInnerHTML={{ __html: highlightedHtml }}
              />
            ) : (
              <div className={tv.code()}>
                <pre>
                  <code>{code}</code>
                </pre>
              </div>
            )}
          </ScrollArea.Content>
        </ScrollArea.Viewport>
      </ScrollArea>
    </div>
  )
})
