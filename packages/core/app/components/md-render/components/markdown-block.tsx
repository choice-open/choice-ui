import { ComponentType, memo, useEffect, useState } from "react"
import type { Components, Options } from "react-markdown"
import remarkBreaks from "remark-breaks"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"

type HardenReactMarkdownProps = Options & {
  allowedImagePrefixes?: string[]
  allowedLinkPrefixes?: string[]
  defaultOrigin?: string
}

interface MarkdownBlockProps extends Omit<HardenReactMarkdownProps, "children"> {
  components?: Partial<Components>
  content: string
}

type HardenedMarkdownComponent = ComponentType<
  Options & {
    allowedImagePrefixes?: string[]
    allowedLinkPrefixes?: string[]
    defaultOrigin?: string
  }
>

export const MarkdownBlock = memo(
  function MarkdownBlock(props: MarkdownBlockProps) {
    const {
      content,
      components,
      allowedLinkPrefixes = ["https://", "http://", "#", "mailto:"],
      allowedImagePrefixes = ["https://", "http://", "data:image/"],
      defaultOrigin = typeof window !== "undefined" ? window.location.origin : "http://localhost",
      ...rest
    } = props

    const [HardenedMarkdown, setHardenedMarkdown] = useState<HardenedMarkdownComponent | null>(null)

    useEffect(() => {
      let isMounted = true

      async function loadMarkdown() {
        try {
          const [hardenReactMarkdownModule, reactMarkdownModule] = await Promise.all([
            import("harden-react-markdown"),
            import("react-markdown"),
          ])

          if (!isMounted) return

          const hardenReactMarkdownImport = hardenReactMarkdownModule.default
          const ReactMarkdown = reactMarkdownModule.default

          const hardenReactMarkdown =
            (
              hardenReactMarkdownImport as unknown as ComponentType<Options> & {
                default: typeof hardenReactMarkdownImport
              }
            ).default || hardenReactMarkdownImport

          const HardenedMarkdownComponent = hardenReactMarkdown(
            ReactMarkdown as unknown as ComponentType<Options>,
          ) as HardenedMarkdownComponent

          setHardenedMarkdown(() => HardenedMarkdownComponent)
        } catch {
          // Failed to load markdown libraries, component will render null
        }
      }

      loadMarkdown()

      return () => {
        isMounted = false
      }
    }, [])

    if (!HardenedMarkdown) {
      // SSR 或加载中时显示原始文本作为占位
      return <div className="whitespace-pre-wrap">{content}</div>
    }

    return (
      <HardenedMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
        components={components}
        allowedLinkPrefixes={allowedLinkPrefixes}
        allowedImagePrefixes={allowedImagePrefixes}
        defaultOrigin={defaultOrigin}
        {...rest}
      >
        {content}
      </HardenedMarkdown>
    )
  },
  function propsAreEqual(prevProps, nextProps) {
    return prevProps.content === nextProps.content
  },
)
