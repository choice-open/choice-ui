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
import { render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
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
})
