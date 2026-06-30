/**
 * usePress bug-focused tests
 *
 * BUG 1: onPress/onPressEnd captured in pointerup listener are stale after re-render
 *   - User scenario: Component uses usePress and changes its onPress callback
 *     based on state (e.g., a toggle button). User presses, state changes causing
 *     re-render, then releases. The pointerup listener fires with the OLD onPress
 *     callback captured at pointerDown time, not the new one.
 *   - Regression it prevents: Press handlers reading stale state after re-renders
 *     during a press gesture
 *   - Logic change: use-press.ts:25-33 -- the pointerup listener is registered
 *     inside onPointerDown and captures `onPress` and `onPressEnd` via closure.
 *     When the component re-renders during a press, the listener still holds the
 *     old versions. Fix = use a ref to store the latest callbacks, or remove the
 *     listener and re-register on each render.
 *
 * BUG 2: isPressed stays true after pointercancel event
 *   - User scenario: User starts pressing a button (pointerDown). The browser
 *     fires a pointercancel event (e.g., scroll initiated, or touch interrupted).
 *     The button stays visually pressed because isPressed is never set to false.
 *   - Regression it prevents: Button stuck in pressed state after touch interruption
 *   - Logic change: use-press.ts:25-33 -- only `pointerup` is listened for, never
 *     `pointercancel`. When the pointer is cancelled, the cleanup listener never
 *     fires, leaving isPressed=true forever. Fix = also listen for `pointercancel`
 *     and set isPressed=false.
 *
 * BUG 3: disabled prop must prevent all press interactions
 *   - User scenario: Developer renders a button with disabled=true. User clicks
 *     it or presses Enter/Space. onPress, onPressStart, onPressEnd must not fire,
 *     and isPressed must stay false.
 *   - Regression it prevents: Press events firing on disabled elements
 *   - Logic change: use-press.ts:22, 46-49, 63-65 — `!disabled` guard in all
 *     three handlers. If any guard is removed, disabled elements become pressable.
 */
import "@testing-library/jest-dom"
import { act, render, screen } from "@testing-library/react"
import { useState } from "react"
import { describe, expect, it, vi } from "vitest"
import { usePress } from "@choice-ui/shared"

function PressableButton({
  onPress,
  onPressStart,
  onPressEnd,
  disabled,
}: {
  onPress?: (event: any) => void
  onPressStart?: (event: any) => void
  onPressEnd?: (event: any) => void
  disabled?: boolean
}) {
  const { isPressed, pressProps } = usePress({
    disabled,
    onPress,
    onPressStart,
    onPressEnd,
  })

  return (
    <button
      data-pressed={isPressed}
      data-testid="pressable"
      {...pressProps}
    >
      Press me
    </button>
  )
}

describe("usePress bugs", () => {
  describe("BUG 1: onPress must fire with latest callback after re-render during press", () => {
    it("calls the updated onPress handler after state change during press", async () => {
      const secondHandler = vi.fn()

      function TogglePressComponent() {
        const [toggled, setToggled] = useState(false)

        return (
          <PressableButton
            onPress={() => {
              if (!toggled) {
                setToggled(true)
              } else {
                secondHandler()
              }
            }}
          />
        )
      }

      render(<TogglePressComponent />)

      const button = screen.getByTestId("pressable")

      act(() => {
        button.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }))
      })

      act(() => {
        button.dispatchEvent(new MouseEvent("pointerup", { bubbles: true }))
      })

      act(() => {
        button.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }))
      })

      act(() => {
        button.dispatchEvent(new MouseEvent("pointerup", { bubbles: true }))
      })

      expect(secondHandler).toHaveBeenCalled()
    })
  })

  describe("BUG 2: isPressed must reset on pointercancel", () => {
    it("sets isPressed to false when pointercancel is fired", () => {
      render(<PressableButton />)

      const button = screen.getByTestId("pressable")

      act(() => {
        button.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }))
      })

      expect(button).toHaveAttribute("data-pressed", "true")

      act(() => {
        document.dispatchEvent(new MouseEvent("pointercancel", { bubbles: true }))
      })

      expect(button).toHaveAttribute("data-pressed", "false")
    })
  })

  describe("BUG 3: disabled must prevent all press interactions", () => {
    it("does not fire callbacks or set isPressed when disabled", () => {
      const onPress = vi.fn()
      const onPressStart = vi.fn()
      const onPressEnd = vi.fn()

      render(
        <PressableButton
          disabled
          onPress={onPress}
          onPressStart={onPressStart}
          onPressEnd={onPressEnd}
        />,
      )

      const button = screen.getByTestId("pressable")

      act(() => {
        button.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }))
      })
      act(() => {
        button.dispatchEvent(new MouseEvent("pointerup", { bubbles: true }))
      })
      act(() => {
        button.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }))
      })
      act(() => {
        button.dispatchEvent(new KeyboardEvent("keyup", { key: " ", bubbles: true }))
      })

      expect(onPress).not.toHaveBeenCalled()
      expect(onPressStart).not.toHaveBeenCalled()
      expect(onPressEnd).not.toHaveBeenCalled()
      expect(button).toHaveAttribute("data-pressed", "false")
    })
  })
})
