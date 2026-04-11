/**
 * Select bug-focused tests
 *
 * BUG 7.3: value={null} shows first item as selected
 *   - User scenario: Developer sets value={null} to indicate "nothing selected".
 *     The type signature explicitly allows `string | null`. But the first option
 *     appears visually selected in the open listbox.
 *   - Regression it prevents: value={null} producing a false visual selection
 *   - Logic change that makes it fail: currentSelectedIndex (line 263) — when
 *     value is null, findIndex returns -1, falls back to selectedIndex (default 0).
 *     Fix = add `if (value === null) return -1`.
 *
 * BUG 7.2: redundant setOpen(false) causes controlled/uncontrolled state divergence
 *   - User scenario: Controlled Select with open={true} + onOpenChange. User selects
 *     an item. The internal state gets setOpen(false) called directly (line 416),
 *     bypassing the controlled flow through handleOpenChange.
 *   - Regression it prevents: Double state update, stale internal state after selection
 *   - Logic change that makes it fail: handleSelect (line 410) calls both
 *     handleOpenChange(false) AND setOpen(false). The second call is redundant
 *     in uncontrolled mode and harmful in controlled mode.
 *     Fix = remove the direct setOpen(false) call.
 */
import "@testing-library/jest-dom"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Select } from "../select"

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

describe("Select bugs", () => {
  describe("BUG 7.3: value={null} must not visually select the first item", () => {
    it("does not highlight any option as selected when value is null", async () => {
      render(
        <Select
          value={null}
          onChange={vi.fn()}
          open
        >
          <Select.Trigger>
            <Select.Value placeholder="Choose..." />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="a">Alpha</Select.Item>
            <Select.Item value="b">Beta</Select.Item>
          </Select.Content>
        </Select>,
      )

      await waitFor(
        () => {
          expect(screen.getByRole("listbox")).toBeInTheDocument()
        },
        { timeout: 5000 },
      )

      const options = screen.getAllByRole("option")
      for (const option of options) {
        expect(option).toHaveAttribute("aria-selected", "false")
      }
    })
  })

  describe("BUG 7.2: selecting an item must call onOpenChange(false) exactly once", () => {
    it("does not call setOpen directly when in controlled mode", async () => {
      const onOpenChange = vi.fn()
      const onChange = vi.fn()
      const user = userEvent.setup()

      render(
        <Select
          value="a"
          onChange={onChange}
          open={true}
          onOpenChange={onOpenChange}
        >
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="a">Alpha</Select.Item>
            <Select.Item value="b">Beta</Select.Item>
          </Select.Content>
        </Select>,
      )

      await waitFor(
        () => {
          expect(screen.getByRole("listbox")).toBeInTheDocument()
        },
        { timeout: 5000 },
      )

      await user.click(screen.getByText("Beta"))

      expect(onChange).toHaveBeenCalledWith("b")
      expect(onOpenChange).toHaveBeenCalledTimes(1)
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })
})
