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
})
