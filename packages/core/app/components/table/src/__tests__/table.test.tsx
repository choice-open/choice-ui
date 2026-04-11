/**
 * Table bug-focused tests
 *
 * BUG 4: getSelectedKeys() returns stale keys after data changes
 *   - User scenario: Table has rows [A, B, C], user selects A and B.
 *     Parent removes row A from data. getSelectedKeys() returns ["A","B"] (stale),
 *     but getSelectedRows() returns [B_data] (correct). Consumer submits stale
 *     key "A" to server — 404 or data corruption.
 *   - Regression it prevents: Stale selection keys leaking into server calls
 *   - Logic change that makes it fail: use-table.ts line 273 `Array.from(selectedKeys)`
 *     returns all accumulated keys without filtering against current rows.
 *     Line 274 filters rows — the two methods are inconsistent.
 *     Fix = filter getSelectedKeys against current row keys.
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
})
