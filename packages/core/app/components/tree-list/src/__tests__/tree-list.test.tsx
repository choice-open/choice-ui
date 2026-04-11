/**
 * TreeList bug-focused tests
 *
 * BUG 6: Mutates input data prop by adding parentId
 *   - User scenario: Developer passes a tree data structure from React state.
 *     After TreeList renders, the original data objects now have unexpected parentId
 *     properties. This violates React immutability and can cause subtle bugs in
 *     consumer code (e.g. JSON serialization, equality checks).
 *   - Regression it prevents: Silent mutation of consumer data
 *   - Logic change that makes it fail: tree.ts line 37 `node.parentId = parent.id`
 *     directly mutates the input node object. Should create a copy instead.
 *     Fix = spread node into a new object: `{ ...node, parentId: parent.id }`.
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

window.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
}))
window.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
}))

describe("TreeList bugs", () => {
  describe("BUG 6: must not mutate input data by adding parentId", () => {
    it("does not add parentId to original data nodes after rendering", async () => {
      const { TreeList } = await import("../tree-list")

      const data = [
        {
          id: "root",
          label: "Root",
          children: [
            { id: "child1", label: "Child 1" },
            { id: "child2", label: "Child 2" },
          ],
        },
      ]

      expect(data[0].children![0]).not.toHaveProperty("parentId")
      expect(data[0].children![1]).not.toHaveProperty("parentId")

      render(
        <TreeList
          data={data}
          onToggle={vi.fn()}
        />,
      )

      expect(data[0].children![0]).not.toHaveProperty("parentId")
      expect(data[0].children![1]).not.toHaveProperty("parentId")
    })
  })
})
