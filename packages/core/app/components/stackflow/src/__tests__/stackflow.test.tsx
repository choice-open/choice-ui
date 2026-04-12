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
 */
import "@testing-library/jest-dom"
import { render, screen, waitFor, act } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import React from "react"
import { Stackflow } from "../stackflow"

vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: any) => children,
  motion: {
    div: ({ initial, animate, exit, variants, transition, custom, ...rest }: any) => (
      <div {...rest} />
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

  /**
   * BUG: StackflowItem return null prevents exit animation
   *   - User scenario: User is viewing item "B" and navigates back to item "A".
   *     Item "B" should play an exit animation before being removed from the DOM.
   *   - Regression it prevents: Items disappear instantly with no animation when
   *     switching away, making the UI feel broken/jarring.
   *   - Logic change that makes it fail: In stackflow-item.tsx:26, `if (!isActive) return null`
   *     immediately unmounts the component, so the AnimatePresence exit animation
   *     never renders. Fix = always render the motion.div and let AnimatePresence
   *     handle mount/unmount via its children callback pattern.
   */
  describe("BUG: StackflowItem return null prevents exit animation", () => {
    it("should render both items during transition so exit animation can play", async () => {
      const TestComponent = () => {
        const [activeId, setActiveId] = React.useState("first")

        return (
          <div>
            <Stackflow initialId={activeId}>
              <Stackflow.Item id="first">
                <div data-testid="first-content">First Content</div>
              </Stackflow.Item>
              <Stackflow.Item id="second">
                <div data-testid="second-content">Second Content</div>
              </Stackflow.Item>
            </Stackflow>
            <button
              data-testid="go-second"
              onClick={() => setActiveId("second")}
            >
              Go Second
            </button>
            <button
              data-testid="go-first"
              onClick={() => setActiveId("first")}
            >
              Go First
            </button>
          </div>
        )
      }

      render(<TestComponent />)

      await waitFor(() => {
        expect(screen.getByTestId("first-content")).toBeInTheDocument()
      })

      await act(async () => {
        screen.getByTestId("go-second").click()
      })

      await waitFor(() => {
        expect(screen.getByTestId("second-content")).toBeInTheDocument()
      })

      const firstContent = screen.queryByTestId("first-content")
      expect(firstContent).toBeInTheDocument()
    })
  })
})
