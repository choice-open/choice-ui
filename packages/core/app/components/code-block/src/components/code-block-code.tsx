import { tcv, tcx } from "@choice-ui/shared"
import { memo, useEffect, useState } from "react"
import { codeToHtml } from "shiki"
import { useTheme } from "../hooks"
import type { CodeBlockCodeProps } from "../types"

// Language aliases for unsupported or alternative language names
const LANGUAGE_ALIASES: Record<string, string> = {
  node: "javascript",
  nodejs: "javascript",
  js: "javascript",
  ts: "typescript",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  yml: "yaml",
  dockerfile: "docker",
  plaintext: "text",
  plain: "text",
}

function resolveLanguage(lang: string): string {
  const normalized = lang.toLowerCase()
  return LANGUAGE_ALIASES[normalized] ?? normalized
}

const codeBlockCodeTv = tcv({
  base: "text-message-code w-fit min-w-full bg-transparent font-mono [&>pre]:!bg-transparent [&>pre]:px-4 [&>pre]:py-4",
})

export const CodeBlockCode = memo(function CodeBlockCode(props: CodeBlockCodeProps) {
  const { children, language = "tsx", className, variant: variantProp, codeBlock, ...rest } = props

  const systemTheme = useTheme()

  // 优先级：手动传入的 variant > codeBlock context 的 variant > 系统主题
  const resolvedVariant =
    variantProp ?? (codeBlock?.variant === "default" ? undefined : codeBlock?.variant)
  const theme = resolvedVariant ?? systemTheme

  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function highlight() {
      if (!children) {
        if (isMounted) setHighlightedHtml("<pre><code></code></pre>")
        return
      }

      const resolvedLang = resolveLanguage(language)
      const themeConfig = theme === "light" ? "github-light" : "github-dark"

      try {
        const html = await codeToHtml(children, {
          lang: resolvedLang,
          theme: themeConfig,
        })
        if (isMounted) setHighlightedHtml(html)
      } catch {
        // Fallback to plain text if language is not supported
        try {
          const html = await codeToHtml(children, {
            lang: "text",
            theme: themeConfig,
          })
          if (isMounted) setHighlightedHtml(html)
        } catch {
          // Both attempts failed, render escaped plain text
          if (isMounted) {
            const escaped = children
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
            setHighlightedHtml(`<pre><code>${escaped}</code></pre>`)
          }
        }
      }
    }

    highlight()

    return () => {
      isMounted = false
    }
  }, [children, language, theme])

  const classNames = codeBlockCodeTv({ className })

  // SSR fallback: render plain code if not hydrated yet
  return highlightedHtml ? (
    <div
      className={tcx("min-w-0", classNames)}
      dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      {...rest}
    />
  ) : (
    <div
      className={tcx("min-w-0", classNames)}
      {...rest}
    >
      <pre>
        <code>{children}</code>
      </pre>
    </div>
  )
})
