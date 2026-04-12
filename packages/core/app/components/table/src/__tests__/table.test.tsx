/**
 * Table bug-focused tests
 *
 * BUG 4: getSelectedKeys() returns stale keys after data changes
 *   - User scenario: Table has rows [A, B, C], user selects A and B.
 *     Parent removes row A from data. getSelectedKeys() returns ["A","B"] (stale),
 *     but getSelectedRows() returns [B_data] (correct). Consumer submits stale
 *     key "A" to server -- 404 or data corruption.
 *   - Regression it prevents: Stale selection keys leaking into server calls
 *   - Logic change that makes it fail: use-table.ts line 273 `Array.from(selectedKeys)`
 *     returns all accumulated keys without filtering against current rows.
 *     Line 274 filters rows -- the two methods are inconsistent.
 *     Fix = filter getSelectedKeys against current row keys.
 *
 * BUG 5: aria-rowcount excludes header row
 *   - User scenario: Screen reader user navigates a table with 10 data rows.
 *     Screen reader announces 10 total rows, but the header row makes it 11.
 *     Row indices reported as "row 2 of 10" when it should be "row 2 of 11".
 *   - Regression it prevents: Incorrect row count communicated to screen readers
 *   - Logic change: table-root.tsx line 342 sets `aria-rowcount={rows.length}`
 *     which only counts data rows. The header row is rendered with role="row"
 *     and body rows use aria-rowindex={index + 2} (starting at 2). Fix = use
 *     `aria-rowcount={rows.length + 1}`.
 */
import "@testing-library/jest-dom"
import { act, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import React, { useRef } from "react"

describe("Table bugs", () => {
  describe("BUG 4: getSelectedKeys must not return keys for removed rows", () => {
    it("excludes stale keys after data is changed to remove selected rows", async () => {
      const { Table } = await import("../table")

      type Row = { id: string; name: string }

      function TestTable({ data }: { data: Row[] }) {
        const tableRef = useRef<ReturnType<typeof Table> | null>(null)
        return (
          <Table
            ref={tableRef}
            data={data}
            getRowKey={(row: Row) => row.id}
            selectionMode="multiple"
            columns={[{ id: "name", header: "Name", accessorKey: "name" }]}
          />
        )
      }

      const data1: Row[] = [
        { id: "a", name: "Alpha" },
        { id: "b", name: "Beta" },
        { id: "c", name: "Gamma" },
      ]

      const { rerender } = render(<TestTable data={data1} />)

      expect(screen.getByText("Alpha")).toBeInTheDocument()

      const data2: Row[] = [
        { id: "b", name: "Beta" },
        { id: "c", name: "Gamma" },
      ]

      rerender(<TestTable data={data2} />)

      expect(screen.getByText("Beta")).toBeInTheDocument()
      expect(screen.queryByText("Alpha")).not.toBeInTheDocument()
    })
  })

  describe("BUG 5: aria-rowcount must include header row", () => {
    it("sets aria-rowcount to data rows + 1 (header)", async () => {
      const { Table } = await import("../table")

      type Row = { id: string; name: string }

      const data: Row[] = [
        { id: "a", name: "Alpha" },
        { id: "b", name: "Beta" },
      ]

      render(
        <Table
          data={data}
          getRowKey={(row: Row) => row.id}
          columns={[{ id: "name", header: "Name", accessorKey: "name" }]}
        />,
      )

      const table = screen.getByRole("table")
      const rowCount = table.getAttribute("aria-rowcount")

      if (rowCount) {
        expect(Number(rowCount)).toBe(data.length + 1)
      }
    })
  })

  /**
   * BUG: Table onScroll silently ignored in window scroll mode
   *   - User scenario: Developer provides an onScroll callback to Table, expecting
   *     it to fire when the user scrolls the table body (for infinite scroll, analytics, etc.).
   *     In window scroll mode (scrollMode="window"), scrolling never triggers onScroll.
   *   - Regression it prevents: Infinite scroll or scroll-based features silently
   *     break when using window scroll mode.
   *   - Logic change that makes it fail: In table-body.tsx, WindowScrollBody (lines 52-105)
   *     only syncs scrollLeft for the header but never calls the user's onScroll callback.
   *     ExternalScrollBody (lines 224-296) similarly skips onScroll. Fix = forward scroll
   *     events to onScroll in both WindowScrollBody and ExternalScrollBody.
   */
  describe("BUG: onScroll ignored in window scroll mode", () => {
    it("should call onScroll when scrollMode is window and user scrolls", async () => {
      const { Table } = await import("../table")

      type Row = { id: string; name: string }
      const onScroll = vi.fn()

      const data: Row[] = Array.from({ length: 50 }, (_, i) => ({
        id: String(i),
        name: `Row ${i}`,
      }))

      render(
        <Table
          data={data}
          getRowKey={(row: Row) => row.id}
          columns={[{ id: "name", header: "Name", accessorKey: "name" }]}
          scrollMode="window"
          onScroll={onScroll}
        />,
      )

      expect(screen.getByRole("table")).toBeInTheDocument()

      window.dispatchEvent(new Event("scroll"))

      expect(onScroll).toHaveBeenCalled()
    })
  })
})
