import hardenReactMarkdownImport from "harden-react-markdown"
import { ComponentType, memo } from "react"
import ReactMarkdown, { Components, Options } from "react-markdown"
import rehypeKatex from "rehype-katex"
import remarkBreaks from "remark-breaks"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"

const hardenReactMarkdown =
  (
    hardenReactMarkdownImport as unknown as ComponentType<Options> & {
      default: typeof hardenReactMarkdownImport
    }
  ).default || hardenReactMarkdownImport

const HardenedMarkdown = hardenReactMarkdown(
  ReactMarkdown as unknown as ComponentType<Options>,
) as ComponentType<
  Options & {
    allowedImagePrefixes?: string[]
    allowedLinkPrefixes?: string[]
    defaultOrigin?: string
  }
>

type HardenReactMarkdownProps = Options & {
  allowedImagePrefixes?: string[]
  allowedLinkPrefixes?: string[]
  defaultOrigin?: string
}

interface MarkdownBlockProps extends Omit<HardenReactMarkdownProps, "children"> {
  components?: Partial<Components>
  content: string
}

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

    return (
      <HardenedMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
        rehypePlugins={[rehypeKatex]}
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
