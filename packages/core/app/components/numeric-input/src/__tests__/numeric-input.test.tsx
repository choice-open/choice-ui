import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { NumericInput } from "../numeric-input"
import { act } from "react-dom/test-utils"

describe("NumericInput", () => {
  // Basic rendering and functionality
  describe("basic rendering", () => {
    it("renders correctly with default props", () => {
      render(
        <NumericInput
          value={10}
          onChange={jest.fn()}
        />,
      )
      const input = screen.getByRole("textbox")
      expect(input).toBeInTheDocument()
      expect(input).toHaveValue("10")
    })

    it("applies custom className", () => {
      render(
        <NumericInput
          value={10}
          onChange={jest.fn()}
          className="test-class"
        />,
      )
      const container = screen.getByTestId("numeric-input")
      expect(container).toHaveClass("test-class")
    })

    it("forwards data-* attributes to the root element", () => {
      render(
        <NumericInput
          value={10}
          onChange={jest.fn()}
          data-custom="test-value"
        />,
      )
      const container = screen.getByTestId("numeric-input")
      expect(container).toHaveAttribute("data-custom", "test-value")
    })
  })

  // Value handling
  describe("value handling", () => {
    it("displays initial value correctly", () => {
      render(
        <NumericInput
          value={42}
          onChange={jest.fn()}
        />,
      )
      const input = screen.getByRole("textbox")
      expect(input).toHaveValue("42")
    })

    it("calls onChange when value is changed", async () => {
      const handleChange = jest.fn()
      render(
        <NumericInput
          value={10}
          onChange={handleChange}
        />,
      )

      const input = screen.getByRole("textbox")
      await userEvent.clear(input)
      await userEvent.type(input, "20")
      await userEvent.tab() // Blur to trigger change

      expect(handleChange).toHaveBeenCalledWith(20, expect.anything())
    })

    it("handles empty input and calls onEmpty", async () => {
      const handleChange = jest.fn()
      const handleEmpty = jest.fn()

      render(
        <NumericInput
          value={10}
          onChange={handleChange}
          onEmpty={handleEmpty}
        />,
      )

      const input = screen.getByRole("textbox")
      await userEvent.clear(input)
      await userEvent.tab() // Blur to trigger change

      expect(handleEmpty).toHaveBeenCalled()
    })

    it("works in uncontrolled mode with defaultValue", async () => {
      render(
        <NumericInput
          defaultValue={25}
          onChange={jest.fn()}
        />,
      )

      const input = screen.getByRole("textbox")
      expect(input).toHaveValue("25")

      await userEvent.clear(input)
      await userEvent.type(input, "30")
      await userEvent.tab() // Blur to trigger change

      expect(input).toHaveValue("30")
    })
  })

  // Expression support
  describe("expression support", () => {
    it("formats value according to expression pattern", () => {
      render(
        <NumericInput
          value={100}
          expression="{value}px"
          onChange={jest.fn()}
        />,
      )

      const input = screen.getByRole("textbox")
      expect(input).toHaveValue("100px")
    })

    it("handles object values with expression", () => {
      render(
        <NumericInput
          value={{ width: 100, height: 200 }}
          expression="{width}×{height}"
          onChange={jest.fn()}
        />,
      )

      const input = screen.getByRole("textbox")
      expect(input).toHaveValue("100×200")
    })

    it("handles array values with expression", () => {
      render(
        <NumericInput
          value={[10, 20, 30]}
          expression="{value1}, {value2}, {value3}"
          onChange={jest.fn()}
        />,
      )

      const input = screen.getByRole("textbox")
      expect(input).toHaveValue("10, 20, 30")
    })
  })

  // Math expression evaluation
  describe("math expression evaluation", () => {
    it("evaluates basic math expressions on blur", async () => {
      const handleChange = jest.fn()
      render(
        <NumericInput
          value={10}
          onChange={handleChange}
        />,
      )

      const input = screen.getByRole("textbox")
      await userEvent.clear(input)
      await userEvent.type(input, "5+5")
      await userEvent.tab() // Blur to trigger evaluation

      expect(handleChange).toHaveBeenCalledWith(10, expect.anything())
    })

    it("evaluates complex math expressions on blur", async () => {
      const handleChange = jest.fn()
      render(
        <NumericInput
          value={10}
          onChange={handleChange}
        />,
      )

      const input = screen.getByRole("textbox")
      await userEvent.clear(input)
      await userEvent.type(input, "(10+5)*2")
      await userEvent.tab() // Blur to trigger evaluation

      expect(handleChange).toHaveBeenCalledWith(30, expect.anything())
    })
  })

  // Constraints
  describe("constraints", () => {
    it("respects min constraint", async () => {
      const handleChange = jest.fn()
      render(
        <NumericInput
          value={10}
          min={5}
          onChange={handleChange}
        />,
      )

      const input = screen.getByRole("textbox")
      await userEvent.clear(input)
      await userEvent.type(input, "3") // Below min
      await userEvent.tab() // Blur to trigger constraint

      expect(handleChange).toHaveBeenCalledWith(5, expect.anything())
    })

    it("respects max constraint", async () => {
      const handleChange = jest.fn()
      render(
        <NumericInput
          value={10}
          max={20}
          onChange={handleChange}
        />,
      )

      const input = screen.getByRole("textbox")
      await userEvent.clear(input)
      await userEvent.type(input, "25") // Above max
      await userEvent.tab() // Blur to trigger constraint

      expect(handleChange).toHaveBeenCalledWith(20, expect.anything())
    })

    it("applies decimal precision", async () => {
      const handleChange = jest.fn()
      render(
        <NumericInput
          value={10}
          decimal={2}
          onChange={handleChange}
        />,
      )

      const input = screen.getByRole("textbox")
      await userEvent.clear(input)
      await userEvent.type(input, "10.12345")
      await userEvent.tab() // Blur to trigger constraint

      expect(handleChange).toHaveBeenCalledWith(10.12, expect.anything())
    })
  })

  // Keyboard interaction
  describe("keyboard interaction", () => {
    it("increments value with up arrow key", async () => {
      const handleChange = jest.fn()
      render(
        <NumericInput
          value={10}
          step={1}
          onChange={handleChange}
        />,
      )

      const input = screen.getByRole("textbox")
      input.focus()
      fireEvent.keyDown(input, { key: "ArrowUp" })

      expect(handleChange).toHaveBeenCalledWith(11, expect.anything())
    })

    it("decrements value with down arrow key", async () => {
      const handleChange = jest.fn()
      render(
        <NumericInput
          value={10}
          step={1}
          onChange={handleChange}
        />,
      )

      const input = screen.getByRole("textbox")
      input.focus()
      fireEvent.keyDown(input, { key: "ArrowDown" })

      expect(handleChange).toHaveBeenCalledWith(9, expect.anything())
    })

    it("uses shiftStep with shift+arrow keys", async () => {
      const handleChange = jest.fn()
      render(
        <NumericInput
          value={10}
          step={1}
          shiftStep={10}
          onChange={handleChange}
        />,
      )

      const input = screen.getByRole("textbox")
      input.focus()
      fireEvent.keyDown(input, { key: "ArrowUp", shiftKey: true })

      expect(handleChange).toHaveBeenCalledWith(20, expect.anything())
    })
  })

  // States
  describe("states", () => {
    it("applies disabled state correctly", () => {
      render(
        <NumericInput
          value={10}
          onChange={jest.fn()}
          disabled
        />,
      )
      const input = screen.getByRole("textbox")
      expect(input).toBeDisabled()
    })

    it("applies readOnly state correctly", () => {
      render(
        <NumericInput
          value={10}
          onChange={jest.fn()}
          readOnly
        />,
      )
      const input = screen.getByRole("textbox")
      expect(input).toHaveAttribute("readOnly")
    })

    it("applies focused state correctly", () => {
      render(
        <NumericInput
          value={10}
          onChange={jest.fn()}
          focused
        />,
      )
      const container = screen.getByTestId("numeric-input")
      expect(container).toHaveClass("focused")
    })

    it("applies selected state correctly", () => {
      render(
        <NumericInput
          value={10}
          onChange={jest.fn()}
          selected
        />,
      )
      const container = screen.getByTestId("numeric-input")
      expect(container).toHaveClass("selected")
    })
  })

  // Sub-components
  describe("sub-components", () => {
    it("renders with Prefix component", () => {
      render(
        <NumericInput
          value={10}
          onChange={jest.fn()}
        >
          <NumericInput.Prefix>$</NumericInput.Prefix>
        </NumericInput>,
      )

      expect(screen.getByText("$")).toBeInTheDocument()
    })

    it("renders with Suffix component", () => {
      render(
        <NumericInput
          value={10}
          onChange={jest.fn()}
        >
          <NumericInput.Suffix>%</NumericInput.Suffix>
        </NumericInput>,
      )

      expect(screen.getByText("%")).toBeInTheDocument()
    })

    it("renders with Variable component when value is undefined", () => {
      render(
        <NumericInput
          value={undefined}
          onChange={jest.fn()}
        >
          <NumericInput.Variable value={10} />
        </NumericInput>,
      )

      // Check that variable element exists and contains the right value
      const variableElement = screen.getByTestId("numeric-input-variable")
      expect(variableElement).toBeInTheDocument()
      expect(variableElement).toHaveTextContent("10")
    })

    it("renders with ActionPrompt component", () => {
      render(
        <NumericInput
          value={10}
          onChange={jest.fn()}
        >
          <NumericInput.ActionPrompt>Action</NumericInput.ActionPrompt>
        </NumericInput>,
      )

      expect(screen.getByText("Action")).toBeInTheDocument()
    })
  })

  // Variants
  describe("variants", () => {
    it("applies dark variant correctly", () => {
      render(
        <NumericInput
          value={10}
          onChange={jest.fn()}
          variant="dark"
        />,
      )
      const container = screen.getByTestId("numeric-input")
      expect(container).toHaveClass("dark")
    })
  })
})
