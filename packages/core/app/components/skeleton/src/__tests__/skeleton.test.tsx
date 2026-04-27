/**
 * Skeleton bug-focused tests
 *
 * BUG 1: hasChildren missing from useMemo deps causes stale styles
 *   - User scenario: Developer toggles children visibility while loading stays true.
 *     The skeleton styles don't update because hasChildren is not in the deps array.
 *     When children go from present to absent, the skeleton keeps "hasChildren" styles.
 *   - Regression it prevents: Stale skeleton styles when children change dynamically
 *   - Logic change: skeleton.tsx:33-40 - `useMemo` uses `hasChildren` in the factory
 *     but only lists `[loading]` as deps. Fix = add `hasChildren` to the dep array.
 *
 * BUG 2: variant prop flows into {...rest} and pollutes the DOM
 *   - User scenario: Developer passes <Skeleton variant="circular" />. The variant
 *     prop is declared in types.ts (line 34) but never destructured in skeleton.tsx
 *     (lines 11-20). It ends up in {...rest} and gets spread onto the <span> element
 *     as an invalid HTML attribute: <span variant="circular">.
 *   - Regression it prevents: Invalid DOM attributes from unimplemented props
 *   - Logic change: skeleton.tsx:11-20 - variant is not in the destructuring list,
 *     so it falls into ...rest and spreads onto the DOM. tv.ts has no variant key.
 *     Fix = destructure variant and either implement it or omit it from rest.
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { useState } from "react"
import userEvent from "@testing-library/user-event"
import { Skeleton } from "../skeleton"

function DynamicChildrenSkeleton() {
  const [show, setShow] = useState(true)
  return (
    <div>
      <Skeleton loading>{show && <span>Content</span>}</Skeleton>
      <button onClick={() => setShow(false)}>hide</button>
      <button onClick={() => setShow(true)}>show</button>
    </div>
  )
}

describe("Skeleton bugs", () => {
  describe("BUG 1: useMemo must include hasChildren in dependency array", () => {
    it("recomputes styles when children are removed", async () => {
      const user = userEvent.setup()

      const { container } = render(<DynamicChildrenSkeleton />)

      const rootBefore = container.querySelector("[aria-busy]")
      expect(rootBefore).toBeTruthy()
      const classesBefore = rootBefore?.className

      await user.click(screen.getByText("hide"))

      const rootAfter = container.querySelector("[aria-busy]")
      expect(rootAfter).toBeTruthy()
      const classesAfter = rootAfter?.className

      expect(classesAfter).not.toBe(classesBefore)
    })
  })

  describe("BUG 2: variant prop must not leak as DOM attribute", () => {
    it("does not render variant attribute on the DOM element", () => {
      const { container } = render(
        <Skeleton
          loading
          variant="circular"
          data-testid="skeleton"
        />,
      )

      const element = container.querySelector("[data-testid='skeleton']") || container.firstChild
      expect(element).toBeTruthy()
      expect(element).not.toHaveAttribute("variant")
    })
  })

  /**
   * LOADING→LOADED TRANSITION
   *   User scenario: Skeleton shows a loading state, then loading flips to false.
   *     Children should become visible and aria-busy should be removed.
   *   Regression it prevents: Skeleton never transitioning out of loading state
   *   Logic change: tv is computed from loading + hasChildren. When loading=false,
   *     aria-busy is undefined and children are visible. If loading isn't in tv deps,
   *     the transition never happens.
   */
  describe("loading to loaded transition", () => {
    it("removes aria-busy and shows children when loading becomes false", async () => {
      const user = userEvent.setup()

      function ToggleSkeleton() {
        const [loading, setLoading] = useState(true)
        return (
          <div>
            <Skeleton loading={loading}>{loading ? null : <span>Loaded!</span>}</Skeleton>
            <button onClick={() => setLoading(false)}>load</button>
          </div>
        )
      }

      render(<ToggleSkeleton />)

      expect(screen.queryByText("Loaded!")).not.toBeInTheDocument()

      await user.click(screen.getByText("load"))

      expect(screen.getByText("Loaded!")).toBeInTheDocument()
    })
  })

  /**
   * ARIA-BUSY: present while loading, absent when not
   *   User scenario: Screen reader user encounters a skeleton. It must announce
   *     aria-busy="true" while loading and remove it when done.
   *   Regression it prevents: Missing aria-busy accessibility contract
   *   Logic change: aria-busy is set to "true" when loading, undefined when not.
   *     If this conditional breaks, the skeleton always or never announces busy.
   */
  describe("aria-busy accessibility", () => {
    it("sets aria-busy=true when loading and removes it when not loading", () => {
      const { container, rerender } = render(
        <Skeleton
          loading
          data-testid="skel"
        >
          <span>Content</span>
        </Skeleton>,
      )

      const root = container.querySelector("[aria-busy]")
      expect(root).toHaveAttribute("aria-busy", "true")

      rerender(
        <Skeleton
          loading={false}
          data-testid="skel"
        >
          <span>Content</span>
        </Skeleton>,
      )

      expect(container.querySelector("[aria-busy]")).toBeNull()
    })
  })
})
