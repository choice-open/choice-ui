/**
 * Stackflow bug-focused tests
 *
 * BUG 1 (High): No item displayed when initialId/defaultId are omitted
 *   - User scenario: Developer renders <Stackflow> with <Stackflow.Item> children
 *     without providing initialId or defaultId, expecting the first item to be shown
 *     automatically after mount.
 *   - Regression it prevents: Empty stackflow view when consumer relies on automatic
 *     first-item selection instead of explicitly calling push(id).
 *   - Logic change that makes it fail: In hooks/use-stackflow.ts:30-35, useState
 *     initializes currentId from items[0]?.id, but items is [] on first render
 *     because items register asynchronously via useEffect in stackflow-item.tsx:19-21.
 *     currentId stays "" forever. Fix = add a useEffect that auto-selects the first
 *     item when items populate and currentId is falsy.
 *
 * BUG 2 (High): back() then push() permanently destroys forward history
 *   - User scenario: User navigates A → B → C, goes back to B, then pushes D.
 *     The forward item C is now preserved in history (truncated only by push).
 *     This matches standard browser navigation behavior.
 *   - Regression it prevents: Irreversible navigation loss in multi-step flows
 *   - Logic change: hooks/use-stackflow.ts — back() now decrements currentIndex
 *     instead of popping from history. push() truncates forward entries after
 *     currentIndex and appends. If this cursor logic is removed, the bug returns.
 */
import "@testing-library/jest-dom"
import { render, screen, waitFor, act, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import React from "react"
import { Stackflow } from "../stackflow"
import { useStackflowContext } from "../context"

vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children, onExitComplete }: any) => {
    if (typeof children === "function") return children({ current: null })
    return children
  },
  motion: {
    div: ({ initial, animate, exit, variants, transition, custom, ...rest }: any) => (
      <div {...rest}>{rest.children}</div>
    ),
  },
}))

describe("Stackflow bugs", () => {
  describe("BUG 1 (High): No item displayed when initialId/defaultId are omitted", () => {
    it("shows the first item's content after mount without initialId or defaultId", async () => {
      render(
        <Stackflow>
          <Stackflow.Item id="first">
            <div>First Content</div>
          </Stackflow.Item>
          <Stackflow.Item id="second">
            <div>Second Content</div>
          </Stackflow.Item>
        </Stackflow>,
      )

      await waitFor(() => {
        expect(screen.getByText("First Content")).toBeInTheDocument()
      })
    })
  })

  describe("BUG: StackflowItem return null prevents exit animation", () => {
    it("should render both items during transition so exit animation can play", async () => {
      function NavButtons() {
        const ctx = useStackflowContext()

        return (
          <div>
            <button
              data-testid="push-second"
              onClick={() => ctx.push("second")}
            >
              Go Second
            </button>
          </div>
        )
      }

      render(
        <Stackflow initialId="first">
          <Stackflow.Item id="first">
            <div data-testid="first-content">First Content</div>
          </Stackflow.Item>
          <Stackflow.Item id="second">
            <div data-testid="second-content">Second Content</div>
          </Stackflow.Item>
          <Stackflow.Suffix>
            <NavButtons />
          </Stackflow.Suffix>
        </Stackflow>,
      )

      await waitFor(() => {
        expect(screen.getByTestId("first-content")).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId("push-second"))

      await waitFor(() => {
        expect(screen.getByTestId("second-content")).toBeInTheDocument()
      })

      expect(screen.getByTestId("first-content")).toBeInTheDocument()
    })
  })
})

describe("useStackflow hook bugs", () => {
  describe("BUG 2: back() then push() destroys forward history", () => {
    it("preserves forward history: navigating A→B→C→back→D keeps C accessible", async () => {
      const user = userEvent.setup()

      function NavButtons() {
        const ctx = useStackflowContext()

        return (
          <div>
            <button
              data-testid="push-b"
              onClick={() => ctx.push("b")}
            >
              Push B
            </button>
            <button
              data-testid="push-c"
              onClick={() => ctx.push("c")}
            >
              Push C
            </button>
            <button
              data-testid="push-d"
              onClick={() => ctx.push("d")}
            >
              Push D
            </button>
            <button
              data-testid="back"
              onClick={() => ctx.back()}
            >
              Back
            </button>
            <span data-testid="history">{ctx.history.join(",")}</span>
          </div>
        )
      }

      render(
        <Stackflow initialId="a">
          <Stackflow.Item id="a">
            <div>A</div>
          </Stackflow.Item>
          <Stackflow.Item id="b">
            <div>B</div>
          </Stackflow.Item>
          <Stackflow.Item id="c">
            <div>C</div>
          </Stackflow.Item>
          <Stackflow.Item id="d">
            <div>D</div>
          </Stackflow.Item>
          <Stackflow.Suffix>
            <NavButtons />
          </Stackflow.Suffix>
        </Stackflow>,
      )

      await waitFor(() => expect(screen.getByText("A")).toBeInTheDocument())

      await user.click(screen.getByTestId("push-b"))
      await waitFor(() => expect(screen.getByText("B")).toBeInTheDocument())

      await user.click(screen.getByTestId("push-c"))
      await waitFor(() => expect(screen.getByText("C")).toBeInTheDocument())
      expect(screen.getByTestId("history").textContent).toBe("a,b,c")

      await user.click(screen.getByTestId("back"))
      await waitFor(() => expect(screen.getByText("B")).toBeInTheDocument())
      expect(screen.getByTestId("history").textContent).toBe("a,b,c")

      await user.click(screen.getByTestId("push-d"))
      await waitFor(() => expect(screen.getByText("D")).toBeInTheDocument())
      expect(screen.getByTestId("history").textContent).toBe("a,b,d")
    })
  })

  describe("push to same id is a no-op", () => {
    it("does not add duplicate entries to history when pushing the current id", async () => {
      const user = userEvent.setup()

      function NavButtons() {
        const ctx = useStackflowContext()
        return (
          <div>
            <button
              data-testid="push-a"
              onClick={() => ctx.push("a")}
            >
              Push A
            </button>
            <span data-testid="history">{ctx.history.join(",")}</span>
          </div>
        )
      }

      render(
        <Stackflow initialId="a">
          <Stackflow.Item id="a">
            <div>A</div>
          </Stackflow.Item>
          <Stackflow.Item id="b">
            <div>B</div>
          </Stackflow.Item>
          <Stackflow.Suffix>
            <NavButtons />
          </Stackflow.Suffix>
        </Stackflow>,
      )

      await waitFor(() => expect(screen.getByText("A")).toBeInTheDocument())
      expect(screen.getByTestId("history").textContent).toBe("a")

      await user.click(screen.getByTestId("push-a"))

      expect(screen.getByTestId("history").textContent).toBe("a")
    })
  })
})
