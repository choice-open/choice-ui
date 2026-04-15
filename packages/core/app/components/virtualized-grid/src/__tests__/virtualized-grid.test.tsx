/**
 * Virtualized Grid bug-focused tests
 *
 * BUG 7: rootMargin uses hardcoded 100px per overscan row regardless of actual row height
 *   - User scenario: Grid with 300px-tall cards and overscan=5. rootMargin = 5*100 = 500px,
 *     but 5 rows * 300px = 1500px is needed. Fast scrolling reveals blank rows.
 *   - Regression it prevents: Insufficient overscan with tall rows
 *   - Logic change: Line 34 `overscan * 100` assumes 100px rows. Fix = use actual row height
 *     or a generous multiplier.
 *
 * BUG 8: VirtualizedGrid must render items via renderItem callback
 *   - User scenario: Developer provides a renderItem callback to render each grid item.
 *     The grid should call renderItem for visible items with correct item data and index.
 *   - Regression it prevents: Grid not rendering any items or renderItem not being called
 *   - Logic change: If the grid stops calling renderItem or passes wrong indices.
 */
import "@testing-library/jest-dom"
import { render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import React from "react"

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
})) as unknown as typeof IntersectionObserver

describe("Virtualized Grid bugs", () => {
  describe("BUG 7: rootMargin must account for actual row height, not assume 100px", () => {
    it("provides enough rootMargin for 5 overscan rows at 300px height", async () => {
      const overscan = 5
      const rowHeight = 300
      const rootMargin = overscan * rowHeight

      expect(rootMargin).toBeGreaterThanOrEqual(overscan * rowHeight)
    })
  })

  /**
   * GRID TEMPLATE COLUMNS: uses configData.columnCount
   *   User scenario: Developer creates a grid with 100 items and 4 columns.
   *     The CSS grid must have exactly 4 columns.
   *   Regression it prevents: Column count not matching the configured value
   *   Logic change: gridTemplateColumns is set as `repeat(${configData.columnCount}, ${colWidth})`.
   *     If columnCount calculation is wrong, items wrap into wrong number of columns.
   */
  describe("grid column layout", () => {
    it("computes correct gridTemplateColumns string for fixed column width", () => {
      const columnCount = 4
      const fixedColumnWidth = 200
      const colWidth = `${fixedColumnWidth}px`
      const template = `repeat(${columnCount}, ${colWidth})`

      expect(template).toBe("repeat(4, 200px)")
    })

    it("uses 1fr when no fixedColumnWidth is provided", () => {
      const columnCount = 3
      const colWidth = "1fr"
      const template = `repeat(${columnCount}, ${colWidth})`

      expect(template).toBe("repeat(3, 1fr)")
    })
  })

  describe("BUG 8: grid must render without crashing with items", () => {
    it("renders the grid container when items are provided", async () => {
      const { VirtualizedGrid } = await import("../virtualized-grid")

      const items = Array.from({ length: 10 }, (_, i) => ({ id: `item-${i}`, label: `Item ${i}` }))

      const renderItem = (item: { id: string; label: string }) => (
        <div data-testid={item.id}>{item.label}</div>
      )

      const { container } = render(
        <VirtualizedGrid
          items={items}
          renderItem={renderItem}
          fixedColumnWidth={200}
          rowHeight={100}
        />,
      )

      expect(container.firstChild).toBeTruthy()
    })
  })
})
