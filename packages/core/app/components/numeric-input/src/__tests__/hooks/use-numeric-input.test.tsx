import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { act } from "react-dom/test-utils"
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
  onChange = jest.fn(),
  onEmpty = jest.fn(),
}: {
  decimal?: number
  disabled?: boolean
  expression?: string
  initialValue?: NumericInputValue
  max?: number
  min?: number
  onChange?: jest.Mock
  onEmpty?: jest.Mock
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
      const onChange = jest.fn()
      render(<TestComponent onChange={onChange} />)

      const input = screen.getByTestId("input")
      await userEvent.clear(input)
      await userEvent.type(input, "75")
      await userEvent.tab() // Blur to trigger change

      expect(onChange).toHaveBeenCalledWith(75, expect.anything())
    })

    it("calls onEmpty when input is cleared", async () => {
      const onEmpty = jest.fn()
      render(<TestComponent onEmpty={onEmpty} />)

      const input = screen.getByTestId("input")
      await userEvent.clear(input)
      await userEvent.tab() // Blur to trigger change

      expect(onEmpty).toHaveBeenCalled()
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
      const onChange = jest.fn()
      render(<TestComponent onChange={onChange} />)

      const input = screen.getByTestId("input")
      await userEvent.clear(input)
      await userEvent.type(input, "10+15")
      await userEvent.tab() // Blur to trigger evaluation

      expect(onChange).toHaveBeenCalledWith(25, expect.anything())
    })

    it("evaluates complex math expressions", async () => {
      const onChange = jest.fn()
      render(<TestComponent onChange={onChange} />)

      const input = screen.getByTestId("input")
      await userEvent.clear(input)
      await userEvent.type(input, "(100 / 4) * 2")
      await userEvent.tab() // Blur to trigger evaluation

      expect(onChange).toHaveBeenCalledWith(50, expect.anything())
    })
  })

  // Constraints
  describe("constraints", () => {
    it("applies min constraint", async () => {
      const onChange = jest.fn()
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
      const onChange = jest.fn()
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
      const onChange = jest.fn()
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
      const onChange = jest.fn()
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
      const onChange = jest.fn()
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
      const onChange = jest.fn()
      render(
        <TestComponent
          step={1}
          shiftStep={10}
          onChange={onChange}
        />,
      )

      const input = screen.getByTestId("input")
      fireEvent.keyDown(input, { key: "ArrowUp", shiftKey: true })

      expect(onChange).toHaveBeenCalledWith(60, expect.anything()) // 50 + 10
    })

    it("uses 1 as step with meta/alt key", () => {
      const onChange = jest.fn()
      render(
        <TestComponent
          step={5}
          onChange={onChange}
        />,
      )

      const input = screen.getByTestId("input")
      fireEvent.keyDown(input, { key: "ArrowUp", altKey: true })

      expect(onChange).toHaveBeenCalledWith(51, expect.anything()) // 50 + 1
    })
  })

  // Drag interaction
  describe("drag interaction", () => {
    it("updates handlerPressed state on pointer down/up", () => {
      render(<TestComponent />)

      const handler = screen.getByTestId("handler")
      const handlerState = screen.getByTestId("handler-state")

      expect(handlerState).toHaveTextContent("idle")

      // Press down
      fireEvent.pointerDown(handler)
      expect(handlerState).toHaveTextContent("pressed")

      // Release
      fireEvent.pointerUp(document)
      expect(handlerState).toHaveTextContent("idle")
    })

    it("changes value on drag movement", () => {
      // Mock getBoundingClientRect for the handler element
      Element.prototype.getBoundingClientRect = jest.fn(() => {
        return {
          width: 100,
          height: 20,
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          x: 0,
          y: 0,
          toJSON: () => {},
        }
      })

      const onChange = jest.fn()
      render(<TestComponent onChange={onChange} />)

      const handler = screen.getByTestId("handler")

      // Start drag
      fireEvent.pointerDown(handler)

      // Simulate drag movement
      fireEvent.pointerMove(handler, {
        clientX: 20, // Moving right by 20px
        buttons: 1,
      })

      // Should have changed the value
      expect(onChange).toHaveBeenCalled()
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
      const onChange = jest.fn()
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
      const onChange = jest.fn()
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
