/**
 * Popover bug-focused tests
 *
 * BUG 5: interactions="none" still closes on Escape
 *   - User scenario: Developer sets interactions="none" for full programmatic control.
 *     Outside clicks correctly don't close, but pressing Escape still closes the popover.
 *     The developer's state is now out of sync — they set open=true but it's visually closed.
 *   - Regression it prevents: interactions="none" being a lie — Escape bypasses it
 *   - Logic change that makes it fail: use-floating-popover.ts line 233 disables useDismiss
 *     when interactions="none", but line 279's standalone escape handler only checks
 *     closeOnEscape, not interactions. Fix = add `&& interactions !== "none"` guard.
 */
import "@testing-library/jest-dom"
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import React from "react"
import { afterEach, describe, expect, it, vi } from "vitest"

describe("Popover bugs", () => {
  describe("BUG 5: interactions=none must not close on Escape", () => {
    it("keeps popover open when Escape is pressed and interactions is none", async () => {
      const { Popover } = await import("../popover")
      const user = userEvent.setup()

      const onOpenChange = vi.fn()

      render(
        <Popover
          open
          onOpenChange={onOpenChange}
          interactions="none"
        >
          <Popover.Trigger>
            <button>Open</button>
          </Popover.Trigger>
          <Popover.Header>Header</Popover.Header>
          <Popover.Content>Content</Popover.Content>
        </Popover>,
      )

      await waitFor(() => {
        expect(screen.getByText("Content")).toBeInTheDocument()
      })

      await user.keyboard("{Escape}")

      expect(onOpenChange).not.toHaveBeenCalled()
    })
  })

  /**
   * BUG: Popover aria-modal="true" contradicts focusManagerProps.modal: false
   *   - User scenario: Screen reader user encounters a popover with aria-modal="true",
   *     which tells the screen reader that content outside the popover is inert.
   *     But the actual focus trap (modal:false) does not trap focus, so the screen
   *     reader's mental model is wrong.
   *   - Regression it prevents: Screen reader announces modal behavior but focus
   *     can leave the popover, confusing assistive technology users.
   *   - Logic change that makes it fail: In popover.tsx:252, the popover renders
   *     aria-modal="true" unconditionally, but the floating-ui focusManager is
   *     configured with modal:false. Fix = either set aria-modal to match the
   *     actual modal behavior (false by default), or set modal:true in focusManager.
   */
  describe("BUG: aria-modal contradicts actual modal behavior", () => {
    it("should not set aria-modal=true when focus trap is not enabled (modal:false)", async () => {
      const { Popover } = await import("../popover")
      const user = userEvent.setup()

      render(
        <Popover defaultOpen>
          <Popover.Trigger>
            <button>Open</button>
          </Popover.Trigger>
          <Popover.Content>
            <div data-testid="popover-content">Content</div>
          </Popover.Content>
        </Popover>,
      )

      await waitFor(() => {
        expect(screen.getByTestId("popover-content")).toBeInTheDocument()
      })

      const popover = screen.getByTestId("popover-content").closest("[aria-modal]")
      expect(popover).toBeTruthy()
      expect(popover!.getAttribute("aria-modal")).toBe("false")
    })
  })

  /**
   * BUG: useDrag floatingRef.current in useEffect deps never triggers on ref mutation
   *   - User scenario: A draggable popover opens and the floating element mounts.
   *     The useDrag hook should detect the new element and reset its drag state.
   *     But the useEffect with floatingRef.current in its deps array never fires
   *     because React doesn't re-render when a ref's .current changes.
   *   - Regression it prevents: Drag state is not reset when a popover re-mounts
   *     its floating element, potentially leaving stale position state.
   *   - Logic change that makes it fail: In use-drag.ts:207, the useEffect deps
   *     include `floatingRef.current`, but refs don't trigger React re-renders.
   *     The ESLint disable comment acknowledges this. Fix = use a callback ref
   *     pattern or a state-based approach to detect when the floating element mounts.
   *
   * BUG 6: Clicking trigger toggles popover open/close
   *   - User scenario: User clicks a popover trigger button to open it, then clicks
   *     again to close. The popover should appear and disappear accordingly.
   *   - Regression it prevents: Trigger click not toggling popover visibility
   *   - Logic change: If useClick stops toggling on mousedown or handleOpenChange
   *     stops updating innerOpen.
   *
   * BUG 7: 200ms forceDismissed must not block controlled prop changes
   *   - User scenario: Controlled popover. Application sets open=false then open=true
   *     in rapid succession (e.g. switching tabs). The popover must reappear immediately.
   *   - Regression it prevents: Controlled popover stuck in forceDismissed state
   *   - Logic change: use-floating-popover.ts:157-165 — handleOpenChange(false) sets
   *     forceDismissed=true with 200ms timer. But useMergedValue syncs from the `open`
   *     prop via useEffect, bypassing handleOpenChange. If useMergedValue behavior
   *     changes to route through handleOpenChange, this test catches the regression.
   */
  describe("BUG: useDrag does not detect floatingRef.current changes", () => {
    it("resets drag state when floating element remounts after close/reopen", async () => {
      const { Popover } = await import("../popover")
      const onOpenChange = vi.fn()

      // Drive close/reopen via the controlled `open` prop. We deliberately
      // don't use Escape here: a controlled popover must follow the prop and
      // ignore internal dismiss attempts (see "BUG 7: forceDismissed dead
      // zone" / controlled-component semantics).
      const Comp = ({ open }: { open: boolean }) => (
        <Popover
          open={open}
          onOpenChange={onOpenChange}
          draggable
        >
          <Popover.Trigger>
            <button>Trigger</button>
          </Popover.Trigger>
          <Popover.Content>
            <div data-testid="drag-content">Drag me</div>
          </Popover.Content>
        </Popover>
      )

      const { rerender } = render(<Comp open={true} />)

      await waitFor(() => {
        expect(screen.getByTestId("drag-content")).toBeInTheDocument()
      })

      const popoverEl = screen.getByTestId("drag-content").closest("[style]") as HTMLElement
      expect(popoverEl).toBeTruthy()
      const styleBefore = popoverEl?.getAttribute("style")

      rerender(<Comp open={false} />)
      await waitFor(() => {
        expect(screen.queryByTestId("drag-content")).not.toBeInTheDocument()
      })

      rerender(<Comp open={true} />)

      await waitFor(() => {
        expect(screen.getByTestId("drag-content")).toBeInTheDocument()
      })

      const popoverElAfter = screen.getByTestId("drag-content").closest("[style]") as HTMLElement
      expect(popoverElAfter).toBeTruthy()
      const styleAfter = popoverElAfter?.getAttribute("style")
      expect(styleAfter).toBe(styleBefore)
    })
  })

  describe("BUG 6: clicking trigger toggles popover open/close", () => {
    it("opens popover on first trigger click and closes on second", async () => {
      const { Popover } = await import("../popover")
      const user = userEvent.setup()

      render(
        <Popover>
          <Popover.Trigger>
            <button>Toggle</button>
          </Popover.Trigger>
          <Popover.Content>
            <div data-testid="popover-body">Body</div>
          </Popover.Content>
        </Popover>,
      )

      expect(screen.queryByTestId("popover-body")).not.toBeInTheDocument()

      await user.click(screen.getByText("Toggle"))

      await waitFor(() => {
        expect(screen.getByTestId("popover-body")).toBeInTheDocument()
      })

      await user.click(screen.getByText("Toggle"))

      await waitFor(() => {
        expect(screen.queryByTestId("popover-body")).not.toBeInTheDocument()
      })
    })
  })

  describe("BUG 7: 200ms forceDismissed dead zone must not block controlled reopen", () => {
    it("allows controlled popover to reopen immediately after close", async () => {
      const { Popover } = await import("../popover")
      const user = userEvent.setup()

      const TestComp = ({ open }: { open: boolean }) => (
        <Popover open={open}>
          <Popover.Trigger>
            <button>Trigger</button>
          </Popover.Trigger>
          <Popover.Content>
            <div data-testid="popover-body">Body</div>
          </Popover.Content>
        </Popover>
      )

      const { rerender } = render(<TestComp open={true} />)

      await waitFor(() => {
        expect(screen.getByTestId("popover-body")).toBeInTheDocument()
      })

      rerender(<TestComp open={false} />)

      await waitFor(() => {
        expect(screen.queryByTestId("popover-body")).not.toBeInTheDocument()
      })

      rerender(<TestComp open={true} />)

      await waitFor(
        () => {
          expect(screen.getByTestId("popover-body")).toBeInTheDocument()
        },
        { timeout: 250 },
      )
    })
  })

  describe("controlled popover ignores internal dismiss when parent keeps open=true", () => {
    // Regression: forceDismissed used to fire unconditionally on dismiss, so
    // a controlled popover whose parent kept open={true} would briefly hide
    // and then reappear, violating controlled-component semantics.
    it("stays visible after Escape when parent does not flip open", async () => {
      const { Popover } = await import("../popover")
      const user = userEvent.setup()
      const onOpenChange = vi.fn()

      render(
        <Popover
          open
          onOpenChange={onOpenChange}
        >
          <Popover.Trigger>
            <button>Trigger</button>
          </Popover.Trigger>
          <Popover.Content>
            <div data-testid="controlled-body">Body</div>
          </Popover.Content>
        </Popover>,
      )

      await waitFor(() => {
        expect(screen.getByTestId("controlled-body")).toBeInTheDocument()
      })

      await user.keyboard("{Escape}")

      // Parent ignores onOpenChange and keeps open={true}, so the popover
      // must remain visible — no transient close/reopen flicker.
      expect(screen.getByTestId("controlled-body")).toBeInTheDocument()
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })
})

/**
 * Position persistence: defaultPosition / onPositionChange (semi-controlled,
 * defaultValue-style). defaultPosition seeds the drag position when the
 * floating element mounts (clamped to the viewport); onPositionChange fires
 * once per drag end with the clamped position so callers can persist it.
 */
describe("Popover position persistence", () => {
  // jsdom reports zero-size rects; give elements a real size so the
  // viewport clamp (adjustPosition) has something to work with.
  const mockRect = () =>
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 200,
      bottom: 150,
      width: 200,
      height: 150,
      toJSON: () => ({}),
    } as DOMRect)

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("renders the floating element at defaultPosition with fixed positioning", async () => {
    const { Popover } = await import("../popover")

    render(
      <Popover
        draggable
        defaultOpen
        defaultPosition={{ x: 120, y: 80 }}
      >
        <Popover.Trigger>
          <button>Open</button>
        </Popover.Trigger>
        <Popover.Header>Header</Popover.Header>
        <Popover.Content>
          <div data-testid="content">Content</div>
        </Popover.Content>
      </Popover>,
    )

    await waitFor(() => {
      expect(screen.getByTestId("content")).toBeInTheDocument()
    })

    const popover = screen.getByTestId("content").closest('[data-draggable="true"]') as HTMLElement
    expect(popover).toBeTruthy()
    expect(popover.style.position).toBe("fixed")
    expect(popover.style.left).toBe("120px")
    expect(popover.style.top).toBe("80px")
  })

  it("clamps an off-viewport defaultPosition back into view", async () => {
    const { Popover } = await import("../popover")
    mockRect()

    render(
      <Popover
        draggable
        defaultOpen
        defaultPosition={{ x: 5000, y: 5000 }}
      >
        <Popover.Trigger>
          <button>Open</button>
        </Popover.Trigger>
        <Popover.Header>Header</Popover.Header>
        <Popover.Content>
          <div data-testid="content">Content</div>
        </Popover.Content>
      </Popover>,
    )

    await waitFor(() => {
      expect(screen.getByTestId("content")).toBeInTheDocument()
    })

    // Viewport is 1024x768 (jsdom default), rect is 200x150:
    // maxLeft = 1024 - 200 * 0.25 = 974, maxTop = 768 - 40 (header) = 728
    const popover = screen.getByTestId("content").closest('[data-draggable="true"]') as HTMLElement
    await waitFor(() => {
      expect(popover.style.left).toBe("974px")
      expect(popover.style.top).toBe("728px")
    })
  })

  it("calls onPositionChange once per drag end with the clamped position", async () => {
    const { Popover } = await import("../popover")
    const onPositionChange = vi.fn()
    mockRect()

    render(
      <Popover
        draggable
        defaultOpen
        onPositionChange={onPositionChange}
      >
        <Popover.Trigger>
          <button>Open</button>
        </Popover.Trigger>
        <Popover.Header>Drag handle</Popover.Header>
        <Popover.Content>
          <div data-testid="content">Content</div>
        </Popover.Content>
      </Popover>,
    )

    await waitFor(() => {
      expect(screen.getByTestId("content")).toBeInTheDocument()
    })

    // Mounting alone must not fire the callback
    expect(onPositionChange).not.toHaveBeenCalled()

    // Drag the header far off-screen, then release
    fireEvent.mouseDown(screen.getByText("Drag handle"), { clientX: 50, clientY: 30 })
    fireEvent.mouseMove(document, { clientX: 5000, clientY: 5000 })
    // Flush the rAF-batched position update before ending the drag
    await act(async () => {
      await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
    })
    fireEvent.mouseUp(document)

    // Raw drop point is (4950, 4970); clamped to (974, 728) — see test above
    expect(onPositionChange).toHaveBeenCalledTimes(1)
    expect(onPositionChange).toHaveBeenCalledWith({ x: 974, y: 728 })

    // Closing (which resets the position back to the anchor) must not fire it
    fireEvent.keyDown(window, { key: "Escape" })
    await waitFor(() => {
      expect(screen.queryByTestId("content")).not.toBeInTheDocument()
    })
    await act(async () => {
      await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
    })
    expect(onPositionChange).toHaveBeenCalledTimes(1)
  })

  it("re-applies the latest defaultPosition on reopen", async () => {
    const { Popover } = await import("../popover")

    const Comp = ({ open, pos }: { open: boolean; pos: { x: number; y: number } }) => (
      <Popover
        open={open}
        draggable
        defaultPosition={pos}
      >
        <Popover.Trigger>
          <button>Open</button>
        </Popover.Trigger>
        <Popover.Header>Header</Popover.Header>
        <Popover.Content>
          <div data-testid="content">Content</div>
        </Popover.Content>
      </Popover>
    )

    const { rerender } = render(
      <Comp
        open
        pos={{ x: 100, y: 100 }}
      />,
    )

    await waitFor(() => {
      expect(screen.getByTestId("content")).toBeInTheDocument()
    })
    let popover = screen.getByTestId("content").closest('[data-draggable="true"]') as HTMLElement
    expect(popover.style.left).toBe("100px")

    rerender(
      <Comp
        open={false}
        pos={{ x: 100, y: 100 }}
      />,
    )
    await waitFor(() => {
      expect(screen.queryByTestId("content")).not.toBeInTheDocument()
    })

    // Caller persists a new position and passes it on the next open
    rerender(
      <Comp
        open
        pos={{ x: 300, y: 200 }}
      />,
    )
    await waitFor(() => {
      expect(screen.getByTestId("content")).toBeInTheDocument()
    })
    popover = screen.getByTestId("content").closest('[data-draggable="true"]') as HTMLElement
    expect(popover.style.left).toBe("300px")
    expect(popover.style.top).toBe("200px")
  })
})
