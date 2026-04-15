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
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import React from "react"
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

  /**
   * EXPAND/COLLAPSE via imperative handle
   *   User scenario: Developer calls ref.current.expandNodes(["folder1"]) to
   *     programmatically expand a folder node. The node's children should become visible.
   *   Regression it prevents: Imperative expandNodes doing nothing
   *   Logic change: useImperativeHandle exposes expandNodes which calls
   *     setInternalExpandedNodeIds. If the handle or setState breaks, programmatic
   *     expansion silently fails.
   */
  describe("imperative expandNodes", () => {
    it("expands nodes when expandNodes is called via ref", async () => {
      const { TreeList } = await import("../tree-list")
      const ref = React.createRef<any>()

      const data = [
        {
          id: "root",
          label: "Root",
          children: [{ id: "child1", label: "Child 1" }],
        },
      ]

      render(
        <TreeList
          ref={ref}
          data={data}
          onToggle={vi.fn()}
          virtualScroll={false}
          renderLabel={(node: any) => <span>{node.label}</span>}
        />,
      )

      expect(screen.queryByText("Child 1")).not.toBeInTheDocument()

      React.act(() => {
        ref.current?.expandNodes(["root"])
      })

      await waitFor(() => {
        expect(screen.getByText("Child 1")).toBeInTheDocument()
      })
    })
  })

  /**
   * COLLAPSE ALL via imperative handle
   *   User scenario: Developer calls ref.current.collapseAll(). All expanded nodes
   *     should collapse, hiding all children.
   *   Regression it prevents: collapseAll not collapsing nodes
   *   Logic change: useImperativeHandle exposes collapseAll which sets expandedNodeIds
   *     to an empty Set. If this breaks, nodes remain expanded.
   */
  describe("imperative collapseAll", () => {
    it("collapses all nodes when collapseAll is called via ref", async () => {
      const { TreeList } = await import("../tree-list")
      const ref = React.createRef<any>()

      const data = [
        {
          id: "root",
          label: "Root",
          children: [{ id: "child1", label: "Child 1" }],
        },
      ]

      render(
        <TreeList
          ref={ref}
          data={data}
          initialExpandedNodeIds={new Set(["root"])}
          onToggle={vi.fn()}
          virtualScroll={false}
          renderLabel={(node: any) => <span>{node.label}</span>}
        />,
      )

      await waitFor(() => {
        expect(screen.getByText("Child 1")).toBeInTheDocument()
      })

      React.act(() => {
        ref.current?.collapseAll()
      })

      await waitFor(() => {
        expect(screen.queryByText("Child 1")).not.toBeInTheDocument()
      })
    })
  })

  /**
   * NODE SELECTION: clicking a node triggers onNodeSelect
   *   User scenario: User clicks on a tree node. The onNodeSelect callback fires
   *     with the selected node's data.
   *   Regression it prevents: Node clicks not triggering selection
   *   Logic change: TreeNodeWrapper calls onSelect which triggers useSelection's
   *     selectNode which calls onNodeSelect. If the chain breaks, clicking does nothing.
   */
  describe("node selection", () => {
    it("calls onNodeSelect when a node container is clicked", async () => {
      const { TreeList } = await import("../tree-list")
      const onNodeSelect = vi.fn()
      const user = userEvent.setup()

      const data = [
        { id: "node1", label: "Node One" },
        { id: "node2", label: "Node Two" },
      ]

      render(
        <TreeList
          data={data}
          onNodeSelect={onNodeSelect}
          onToggle={vi.fn()}
          virtualScroll={false}
          renderLabel={(node: any) => <span>{node.label}</span>}
        />,
      )

      const nodeEl = document.querySelector('[data-node-id="node1"]')
      expect(nodeEl).toBeTruthy()
      await user.click(nodeEl!)

      expect(onNodeSelect).toHaveBeenCalled()
    })
  })
})
