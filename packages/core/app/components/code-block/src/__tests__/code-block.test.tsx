/**
 * CodeBlock bug-focused tests
 *
 * BUG 1 (High): Footer always renders for code blocks without lineThreshold,
 *   showing a non-functional expand button.
 *   - User scenario: Developer renders a single-line code block without setting
 *     lineThreshold. A non-functional expand/collapse button appears at the bottom
 *     even though the code height was never limited.
 *   - Regression it prevents: Confusing UI where an expand button does nothing,
 *     wasting vertical space and misleading users into thinking content is truncated.
 *   - Logic change that makes it fail: In `components/code-block-footer.tsx:43-48`,
 *     the condition `(lineThreshold && !(lineCount > lineThreshold || needsScroll || codeExpanded))`
 *     short-circuits to false when lineThreshold is undefined. The only remaining guard
 *     is `!isExpanded`, so the footer renders whenever the block is expanded.
 *     Fix = add a guard that checks needsScroll or requires lineThreshold to be defined
 *     before rendering the footer.
 *
 * BUG 2 (Medium): extractCodeFromChildren silently returns empty string for nested
 *   React elements.
 *   - User scenario: Developer wraps CodeBlock.Content in a React fragment for
 *     conditional rendering. The copy button silently copies nothing — no error,
 *     no feedback — because extractCodeFromChildren returns "".
 *   - Regression it prevents: Silent copy failures when code content is wrapped in
 *     fragments or custom wrapper elements, leading users to believe they copied
 *     code when they didn't.
 *   - Logic change that makes it fail: In `utils/extract-code.ts:14-17`, the function
 *     checks `child.props?.children` but only handles the string case. When children
 *     is a nested React element (from a fragment wrapper), extraction returns "".
 *     Fix = recursively traverse nested React elements to extract text content.
 */
import "@testing-library/jest-dom"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import React from "react"
import { describe, expect, it, vi } from "vitest"
import { CodeBlock } from "../code-block"

vi.mock("shiki", () => ({
  codeToHtml: () => Promise.resolve("<pre><code>mocked</code></pre>"),
}))

vi.mock("use-stick-to-bottom", () => ({
  useStickToBottom: () => ({
    scrollRef: { current: null },
    contentRef: { current: null },
    scrollToBottom: vi.fn(),
  }),
}))

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock as typeof ResizeObserver

describe("CodeBlock bugs", () => {
  describe("BUG 1: footer must not render without lineThreshold for short code", () => {
    it("hides footer when lineThreshold is not set and code is a single line", async () => {
      const { container } = render(
        <CodeBlock language="tsx">
          <CodeBlock.Content>{"console.log('hi')"}</CodeBlock.Content>
          <CodeBlock.Footer />
        </CodeBlock>,
      )

      // BUG: Footer renders because (lineThreshold && ...) short-circuits to false
      // when lineThreshold is undefined, leaving only !isExpanded as the guard.
      // The footer element has class "inset-x-0" (collapsed state with codeExpanded=false).
      // Expected: no footer element present.
      // This assertion FAILS — the footer IS present in the DOM.
      await waitFor(
        () => {
          expect(container.querySelector('[class*="inset-x-0"]')).toBeNull()
        },
        { timeout: 500 },
      )
    })
  })

  describe("BUG 2: copy must extract code from fragment-wrapped content", () => {
    it("copies actual code text when Content is wrapped in a React fragment", async () => {
      const writeTextSpy = vi.fn().mockResolvedValue(undefined)
      Object.assign(navigator, { clipboard: { writeText: writeTextSpy } })

      const user = userEvent.setup()

      render(
        <CodeBlock language="tsx">
          <CodeBlock.Header />
          <React.Fragment>
            <CodeBlock.Content>{"const x = 42"}</CodeBlock.Content>
          </React.Fragment>
        </CodeBlock>,
      )

      // Wait for header buttons to render
      await waitFor(() => {
        expect(screen.getAllByRole("button").length).toBeGreaterThanOrEqual(1)
      })

      // The first button in the header is the copy button (ClipboardSmall icon)
      const [copyButton] = screen.getAllByRole("button")
      await user.click(copyButton)

      // BUG: extractCodeFromChildren returns "" for fragment-wrapped content.
      // handleCopy's guard (if codeToUse) prevents navigator.clipboard.writeText
      // from ever being called with the actual code text.
      // Expected: clipboard.writeText called with "const x = 42".
      // This assertion FAILS — writeTextSpy was never called (or called with "").
      await waitFor(
        () => {
          expect(writeTextSpy).toHaveBeenCalledWith("const x = 42")
        },
        { timeout: 500 },
      )
    })
  })
})
