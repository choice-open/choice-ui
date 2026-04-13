import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { act } from "react-dom/test-utils"
import { vi } from "vitest"
import { useNumericInput } from "../../hooks/use-numeric-input"
import { NumericInputValue } from "../../types"

// Test component using the hook
function TestComponent({
  initialValue = 50,
  min,
  max,
  step,
  shiftStep,
  decimal,
  disabled,
  readOnly,
  expression,
  onChange = vi.fn(),
  onChangeEnd = vi.fn(),
  onEmpty = vi.fn(),
}: {
  decimal?: number
  disabled?: boolean
  expression?: string
  initialValue?: NumericInputValue
  max?: number
  min?: number
  onChange?: vi.Mock
  onChangeEnd?: vi.Mock
  onEmpty?: vi.Mock
  readOnly?: boolean
  shiftStep?: number
  step?: number
}) {
  const { inputProps, handlerProps, handlerPressed } = useNumericInput({
    value: initialValue,
    min,
    max,
    step,
    shiftStep,
    decimal,
    disabled,
    readOnly,
    expression,
    onChange,
    onChangeEnd,
    onEmpty,
  })

  return (
    <div>
      <input
        data-testid="input"
        {...inputProps}
      />
      <div
        data-testid="handler"
        {...handlerProps}
      >
        ⟷
      </div>
      <div data-testid="handler-state">{handlerPressed ? "pressed" : "idle"}</div>
    </div>
  )
}

describe("useNumericInput", () => {
  // Basic value handling
  describe("value handling", () => {
    it("initializes with provided value", () => {
      render(<TestComponent initialValue={42} />)
      const input = screen.getByTestId("input")
      expect(input).toHaveValue("42")
    })

    it("calls onChange when input value changes", async () => {
      const onChange = vi.fn()
      render(<TestComponent onChange={onChange} />)

      const input = screen.getByTestId("input")
      await userEvent.clear(input)
      await userEvent.type(input, "75")
      await userEvent.tab() // Blur to trigger change

      expect(onChange).toHaveBeenCalledWith(75, expect.anything())
    })

    it("handles cleared input by calling onChange with NaN result", async () => {
      const onChange = vi.fn()
      render(<TestComponent onChange={onChange} />)

      const input = screen.getByTestId("input")
      await userEvent.clear(input)
      await userEvent.tab()

      expect(onChange).toHaveBeenCalled()
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1]
      expect(lastCall[1].object.value).toBeNaN()
    })
  })

  // Expression handling
  describe("expression handling", () => {
    it("formats simple expression correctly", () => {
      render(
        <TestComponent
          initialValue={100}
          expression="{value}px"
        />,
      )
      const input = screen.getByTestId("input")
      expect(input).toHaveValue("100px")
    })

    it("formats object values with expression", () => {
      render(
        <TestComponent
          initialValue={{ x: 10, y: 20 }}
          expression="{x},{y}"
        />,
      )
      const input = screen.getByTestId("input")
      expect(input).toHaveValue("10,20")
    })

    it("formats array values with expression", () => {
      render(
        <TestComponent
          initialValue={[5, 10, 15]}
          expression="{value1},{value2},{value3}"
        />,
      )
      const input = screen.getByTestId("input")
      expect(input).toHaveValue("5,10,15")
    })
  })

  // Math expression evaluation
  describe("math expression evaluation", () => {
    it("evaluates simple math expressions", async () => {
      const onChange = vi.fn()
      render(<TestComponent onChange={onChange} />)

      const input = screen.getByTestId("input")
      await userEvent.clear(input)
      await userEvent.type(input, "10+15")
      await userEvent.tab() // Blur to trigger evaluation

      expect(onChange).toHaveBeenCalledWith(25, expect.anything())
    })

    it("evaluates complex math expressions", async () => {
      const onChange = vi.fn()
      render(
        <TestComponent
          initialValue={0}
          onChange={onChange}
        />,
      )

      const input = screen.getByTestId("input")
      await userEvent.clear(input)
      await userEvent.type(input, "(100 / 4) * 2")
      await userEvent.tab()

      expect(onChange).toHaveBeenCalledWith(50, expect.anything())
    })
  })

  // Constraints
  describe("constraints", () => {
    it("applies min constraint", async () => {
      const onChange = vi.fn()
      render(
        <TestComponent
          min={10}
          onChange={onChange}
        />,
      )

      const input = screen.getByTestId("input")
      await userEvent.clear(input)
      await userEvent.type(input, "5") // Below min
      await userEvent.tab() // Blur to trigger constraint

      expect(onChange).toHaveBeenCalledWith(10, expect.anything())
    })

    it("applies max constraint", async () => {
      const onChange = vi.fn()
      render(
        <TestComponent
          max={100}
          onChange={onChange}
        />,
      )

      const input = screen.getByTestId("input")
      await userEvent.clear(input)
      await userEvent.type(input, "150") // Above max
      await userEvent.tab() // Blur to trigger constraint

      expect(onChange).toHaveBeenCalledWith(100, expect.anything())
    })

    it("applies decimal precision", async () => {
      const onChange = vi.fn()
      render(
        <TestComponent
          decimal={2}
          onChange={onChange}
        />,
      )

      const input = screen.getByTestId("input")
      await userEvent.clear(input)
      await userEvent.type(input, "12.3456")
      await userEvent.tab() // Blur to trigger constraint

      expect(onChange).toHaveBeenCalledWith(12.35, expect.anything()) // Rounds to nearest
    })
  })

  // Keyboard navigation
  describe("keyboard navigation", () => {
    it("handles arrow up to increment value", () => {
      const onChange = vi.fn()
      render(
        <TestComponent
          step={5}
          onChange={onChange}
        />,
      )

      const input = screen.getByTestId("input")
      fireEvent.keyDown(input, { key: "ArrowUp" })

      expect(onChange).toHaveBeenCalledWith(55, expect.anything()) // 50 + 5
    })

    it("handles arrow down to decrement value", () => {
      const onChange = vi.fn()
      render(
        <TestComponent
          step={5}
          onChange={onChange}
        />,
      )

      const input = screen.getByTestId("input")
      fireEvent.keyDown(input, { key: "ArrowDown" })

      expect(onChange).toHaveBeenCalledWith(45, expect.anything()) // 50 - 5
    })

    it("uses shiftStep with shift key", () => {
      const onChange = vi.fn()
      render(
        <TestComponent
          step={1}
          shiftStep={10}
          onChange={onChange}
        />,
      )

      const input = screen.getByTestId("input")
      act(() => {
        fireEvent.keyDown(input, { key: "ArrowUp", shiftKey: true })
      })

      expect(onChange).toHaveBeenCalledWith(51, expect.anything())
    })

    it("uses 1 as step with meta/alt key", () => {
      const onChange = vi.fn()
      render(
        <TestComponent
          step={5}
          onChange={onChange}
        />,
      )

      const input = screen.getByTestId("input")
      act(() => {
        fireEvent.keyDown(input, { key: "ArrowUp", altKey: true })
      })

      expect(onChange).toHaveBeenCalledWith(55, expect.anything())
    })
  })

  // Drag interaction
  describe("drag interaction", () => {
    beforeEach(() => {
      document.documentElement.requestPointerLock = vi.fn()
      document.exitPointerLock = vi.fn()
      Object.defineProperty(document, "pointerLockElement", {
        value: null,
        writable: true,
        configurable: true,
      })
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it("updates handlerPressed state on pointer down/up", () => {
      render(<TestComponent />)

      const handler = screen.getByTestId("handler")
      const handlerState = screen.getByTestId("handler-state")

      expect(handlerState).toHaveTextContent("idle")

      act(() => {
        fireEvent.pointerDown(handler)
      })
      expect(handlerState).toHaveTextContent("pressed")

      act(() => {
        vi.runAllTimers()
        document.dispatchEvent(new Event("pointerlockchange"))
        fireEvent.pointerUp(document)
      })
      expect(handlerState).toHaveTextContent("idle")
    })

    it("changes value on drag movement", () => {
      Element.prototype.getBoundingClientRect = vi.fn(() => ({
        width: 100,
        height: 20,
        top: 0,
        left: 0,
        bottom: 20,
        right: 100,
        x: 0,
        y: 0,
        toJSON: () => {},
      }))

      const onChange = vi.fn()
      render(<TestComponent onChange={onChange} />)

      const handler = screen.getByTestId("handler")

      act(() => {
        fireEvent.pointerDown(handler)
      })

      act(() => {
        vi.runAllTimers()
        Object.defineProperty(document, "pointerLockElement", {
          value: document.documentElement,
          writable: true,
          configurable: true,
        })
      })

      act(() => {
        const event = new Event("pointermove")
        Object.defineProperties(event, {
          movementX: { value: 20 },
          movementY: { value: 0 },
          buttons: { value: 1 },
        })
        document.dispatchEvent(event)
      })

      expect(onChange).toHaveBeenCalled()
    })

    it("calls onChangeEnd once with final value after drag ends", () => {
      const onChange = vi.fn()
      const onChangeEnd = vi.fn()

      render(
        <TestComponent
          onChange={onChange}
          onChangeEnd={onChangeEnd}
        />,
      )

      const handler = screen.getByTestId("handler")

      act(() => {
        fireEvent.pointerDown(handler)
      })

      act(() => {
        vi.runAllTimers()
        Object.defineProperty(document, "pointerLockElement", {
          value: document.documentElement,
          writable: true,
          configurable: true,
        })
      })

      act(() => {
        const event1 = new Event("pointermove")
        Object.defineProperties(event1, {
          movementX: { value: 5 },
          movementY: { value: 0 },
          buttons: { value: 1 },
        })
        document.dispatchEvent(event1)
      })

      act(() => {
        const event2 = new Event("pointermove")
        Object.defineProperties(event2, {
          movementX: { value: 5 },
          movementY: { value: 0 },
          buttons: { value: 1 },
        })
        document.dispatchEvent(event2)
      })

      act(() => {
        fireEvent.pointerUp(document)
      })

      expect(onChange).toHaveBeenCalled()
      expect(onChangeEnd).toHaveBeenCalledTimes(1)
    })

    it("does not call onChangeEnd when drag ends without value change", () => {
      const onChangeEnd = vi.fn()

      render(<TestComponent onChangeEnd={onChangeEnd} />)

      const handler = screen.getByTestId("handler")
      act(() => {
        fireEvent.pointerDown(handler)
      })

      act(() => {
        vi.runAllTimers()
      })

      act(() => {
        fireEvent.pointerUp(document)
      })

      expect(onChangeEnd).not.toHaveBeenCalled()
    })
  })

  // Disabled and ReadOnly states
  describe("states", () => {
    it("applies disabled state", () => {
      render(<TestComponent disabled />)
      const input = screen.getByTestId("input")
      expect(input).toBeDisabled()
    })

    it("applies readOnly state", () => {
      render(<TestComponent readOnly />)
      const input = screen.getByTestId("input")
      expect(input).toHaveAttribute("readOnly")
    })

    it("prevents interaction when disabled", async () => {
      const onChange = vi.fn()
      render(
        <TestComponent
          disabled
          onChange={onChange}
        />,
      )

      const input = screen.getByTestId("input")
      await userEvent.type(input, "123")

      expect(onChange).not.toHaveBeenCalled()
    })

    it("allows typing but not dragging when readOnly", () => {
      const onChange = vi.fn()
      render(
        <TestComponent
          readOnly
          onChange={onChange}
        />,
      )

      const handler = screen.getByTestId("handler")

      // Try to drag
      fireEvent.pointerDown(handler)
      fireEvent.pointerMove(handler, { clientX: 20, buttons: 1 })

      expect(onChange).not.toHaveBeenCalled()
    })
  })
})
