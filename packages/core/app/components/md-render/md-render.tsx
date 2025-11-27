import {
  DetailedHTMLProps,
  forwardRef,
  HTMLAttributes,
  memo,
  ReactNode,
  useId,
  useMemo,
} from "react"
import type { Components } from "react-markdown"
import { tcx } from "~/utils"
import { CodeBlock, getDefaultFilenameForLanguage } from "../code-block"
import { createMarkdownComponents, MarkdownBlock } from "./components"
import { useMdBlocks } from "./hooks"
import { mdRenderTv } from "./tv"
import type { MdRenderProps } from "./types"
import { extractLanguage } from "./utils"

type InitialComponents = Partial<Components> & {
  filename?: string
}

type CodeElementProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
type CodeComponentProps = CodeElementProps & {
  children?: ReactNode
  className?: string
  filename?: string
  node?: {
    position?: {
      end?: { line?: number }
      start?: { line?: number }
    }
  }
}

const INITIAL_COMPONENTS: InitialComponents = {
  code: function CodeComponent({ className, children, filename, node }: CodeComponentProps) {
    const isInline =
      !node?.position?.start?.line || node?.position?.start?.line === node?.position?.end?.line

    if (isInline) {
      return <code className="md-code">{children}</code>
    }

    const language = extractLanguage(className)
    const effectiveFilename = filename ?? getDefaultFilenameForLanguage(language)

    return (
      <CodeBlock
        language={language}
        filename={effectiveFilename}
        lineThreshold={undefined}
      >
        <CodeBlock.Header />
        <CodeBlock.Content code={children as string} />
      </CodeBlock>
    )
  },
}

export const MdRender = memo(
  forwardRef<HTMLDivElement, MdRenderProps>(function MdRender(props, ref) {
    const {
      id,
      components: customComponents,
      content,
      className,
      mentionRenderComponent,
      mentionItems,
      allowedPrefixes,
      customColor,
      size = "default",
      variant = "default",
    } = props

    const generatedId = useId()
    const blockId = id ?? generatedId
    const blocks = useMdBlocks(content)

    const tv = useMemo(() => mdRenderTv({ size, variant }), [size, variant])

    const tvComponents = useMemo(
      () => createMarkdownComponents(tv, mentionRenderComponent, mentionItems),
      [tv, mentionRenderComponent, mentionItems],
    )

    const components = useMemo(() => {
      const base = {
        ...tvComponents,
        ...customComponents,
        ...INITIAL_COMPONENTS,
      } as Partial<Components>

      return base
    }, [tvComponents, customComponents])

    const style = useMemo(() => {
      return {
        "--default-background-color": customColor?.defaultBackground,
        "--default-boundary-color": customColor?.defaultBoundary,
        "--default-foreground-color": customColor?.defaultForeground,
        "--secondary-background-color": customColor?.secondaryBackground,
        "--secondary-foreground-color": customColor?.secondaryForeground,
        "--code-background-color": customColor?.codeBackground,
      } as React.CSSProperties
    }, [customColor])

    return (
      <div
        ref={ref}
        className={tcx(tv.root(), className)}
        style={style}
      >
        {blocks.map((block, index) => (
          <MarkdownBlock
            key={`${blockId}-block-${index}`}
            content={block}
            components={components}
            allowedLinkPrefixes={allowedPrefixes}
            allowedImagePrefixes={allowedPrefixes}
          />
        ))}
      </div>
    )
  }),
)
