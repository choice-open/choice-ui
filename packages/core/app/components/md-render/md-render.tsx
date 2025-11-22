import { forwardRef, memo, useMemo } from "react"
import { tcx } from "~/utils"
import { createMarkdownComponents, MarkdownBlock } from "./components"
import { mdRenderTv } from "./tv"
import type { MdRenderProps } from "./types"

export const MdRender = memo(
  forwardRef<HTMLDivElement, MdRenderProps>(function MdRender(props, ref) {
    const {
      content,
      className,
      mentionRenderComponent,
      mentionItems,
      allowedPrefixes,
      customColor,
      size = "default",
      variant = "default",
    } = props
    const tv = mdRenderTv({ size, variant })

    const components = useMemo(
      () => createMarkdownComponents(tv, mentionRenderComponent, mentionItems),
      [tv, mentionRenderComponent, mentionItems],
    )

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
        <MarkdownBlock
          content={content}
          components={components}
          allowedLinkPrefixes={allowedPrefixes}
          allowedImagePrefixes={allowedPrefixes}
        />
      </div>
    )
  }),
)
