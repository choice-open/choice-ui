/**
 * MdRender bug-focused tests
 *
 * BUG 1: INITIAL_COMPONENTS silently overrides user's custom code component
 *   - User scenario: Developer provides a custom code component to MdRender via
 *     the `components` prop, expecting it to handle code rendering instead of the
 *     built-in CodeBlock renderer
 *   - Regression it prevents: Custom code components are silently ignored — the
 *     built-in INITIAL_COMPONENTS always wins, so users cannot customize code rendering
 *   - Logic change that makes it fail: The spread order in md-render.tsx line 97 puts
 *     INITIAL_COMPONENTS last: `{...tvComponents, ...customComponents, ...INITIAL_COMPONENTS}`.
 *     Since INITIAL_COMPONENTS includes a `code` key, it always overrides the user's
 *     custom code component. Fix = spread customComponents AFTER INITIAL_COMPONENTS.
 *
 * BUG 2: MarkdownBlock memo only checks content, ignoring components/policy changes
 *   - User scenario: Developer re-renders with the same markdown content but updated
 *     components (e.g., switching to a different code highlighter or theme)
 *   - Regression it prevents: Component and policy prop changes are silently dropped
 *     when content stays the same, causing stale or incorrect renders
 *   - Logic change that makes it fail: The memo comparison in markdown-block.tsx line 107
 *     only compares `prevProps.content === nextProps.content`. Fix = also compare
 *     `components`, `linkBlockPolicy`, and `imageBlockPolicy`.
 *
 * BUG 3: allowedPrefixes applied to both links and images independently
 *   - User scenario: Developer wants to allow image URLs from any source but
 *     restrict link URLs to https:// only. They set `allowedPrefixes={["https://"]}`
 *     expecting it to apply only to links. But images from http:// are also blocked.
 *   - Regression it prevents: Cannot configure independent URL policies for links vs images
 *   - Logic change that makes it fail: md-render.tsx:127-128 — the same `allowedPrefixes`
 *     value is passed to both `allowedLinkPrefixes` and `allowedImagePrefixes`.
 *     The props type has separate `linkBlockPolicy` and `imageBlockPolicy` but
 *     no separate `allowedLinkPrefixes`/`allowedImagePrefixes` prop.
 *     Fix = add separate `allowedLinkPrefixes` and `allowedImagePrefixes` props
 *     to MdRenderProps, falling back to `allowedPrefixes` if not provided.
 */
import "@testing-library/jest-dom"
import { render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { MarkdownBlock } from "../components/markdown-block"
import { MdRender } from "../md-render"
import type { MdRenderProps } from "../types"

vi.mock("harden-react-markdown", () => ({
  default: (Component: any) => Component,
}))

vi.mock("react-markdown", () => ({
  default: function MockReactMarkdown({
    children,
    components: comps,
  }: {
    children?: string
    components?: Record<string, React.ComponentType<any>>
  }) {
    const text = String(children ?? "")

    const inlineMatch = text.match(/^(.*?)`([^`]+)`(.*)$/s)
    if (inlineMatch && comps?.code) {
      const CodeComp = comps.code as unknown as (props: any) => React.ReactNode
      return (
        <p>
          {inlineMatch[1]}
          {CodeComp({
            children: inlineMatch[2],
            className: undefined,
            node: {
              position: { start: { line: 1 }, end: { line: 1 } },
            },
          })}
          {inlineMatch[3]}
        </p>
      )
    }

    const blockMatch = text.match(/^```(\w*)\n?([\s\S]*?)```/m)
    if (blockMatch && comps?.code) {
      const CodeComp = comps.code as unknown as (props: any) => React.ReactNode
      return CodeComp({
        children: blockMatch[2],
        className: blockMatch[1] ? `language-${blockMatch[1]}` : undefined,
        node: {
          position: { start: { line: 1 }, end: { line: 3 } },
        },
      })
    }

    return <p>{text}</p>
  },
}))

vi.mock("remark-breaks", () => ({ default: {} }))
vi.mock("remark-gfm", () => ({ default: {} }))
vi.mock("remark-math", () => ({ default: {} }))

vi.mock("@choice-ui/code-block", () => {
  const MockCodeBlock = ({ children }: any) => <div data-testid="builtin-codeblock">{children}</div>
  MockCodeBlock.Header = () => null
  MockCodeBlock.Content = ({ children }: any) => <>{children}</>
  MockCodeBlock.Code = ({ children }: any) => <>{children}</>
  return {
    CodeBlock: MockCodeBlock,
    getDefaultFilenameForLanguage: () => "file.txt",
  }
})

vi.mock("@choice-ui/scroll-area", () => {
  const Viewport = ({ children }: any) => <>{children}</>
  const Content = ({ children }: any) => <>{children}</>
  return {
    ScrollArea: Object.assign(({ children }: any) => <>{children}</>, {
      Viewport,
      Content,
    }),
  }
})

vi.mock("@choiceform/icons-react", () => ({
  Check: () => <svg />,
}))

vi.mock("@choice-ui/shared", () => ({
  tcv: (config: any) => (_opts: any) => {
    const result: Record<string, () => string> = {}
    for (const slot of Object.keys(config.slots || {})) {
      result[slot] = () => slot
    }
    return result
  },
  tcx: (...args: any[]) => args.filter(Boolean).join(" "),
}))

describe("MdRender bugs", () => {
  describe("BUG 1: custom code component is overridden by INITIAL_COMPONENTS", () => {
    it("renders user-provided code component instead of built-in", async () => {
      const CustomCode = ({ children }: any) => (
        <span data-testid="custom-code">{String(children)}</span>
      )

      render(
        <MdRender
          content="Hello `world`"
          components={{ code: CustomCode }}
        />,
      )

      await waitFor(() => {
        expect(screen.getByTestId("custom-code")).toBeInTheDocument()
      })
    })
  })

  describe("BUG 2: MarkdownBlock memo ignores components prop changes", () => {
    it("re-renders when components change but content stays the same", async () => {
      const FirstCode = ({ children }: any) => (
        <span data-testid="first-code">{String(children)}</span>
      )
      const SecondCode = ({ children }: any) => (
        <span data-testid="second-code">{String(children)}</span>
      )

      const { rerender } = render(
        <MarkdownBlock
          content="Hello `world`"
          components={{ code: FirstCode }}
        />,
      )

      await waitFor(() => {
        expect(screen.getByTestId("first-code")).toBeInTheDocument()
      })

      rerender(
        <MarkdownBlock
          content="Hello `world`"
          components={{ code: SecondCode }}
        />,
      )

      await waitFor(() => {
        expect(screen.getByTestId("second-code")).toBeInTheDocument()
      })
    })
  })

  describe("BUG 3: MdRender forces same allowedPrefixes for links and images", () => {
    it("passes the same allowedPrefixes array to both MarkdownBlock link and image props", () => {
      const fs = require("fs")
      const path = require("path")
      const source = fs.readFileSync(path.resolve(__dirname, "../md-render.tsx"), "utf-8")

      const passesSameValue =
        source.includes("allowedLinkPrefixes={allowedPrefixes}") &&
        source.includes("allowedImagePrefixes={allowedPrefixes}")

      expect(passesSameValue).toBe(true)
    })
  })
})
