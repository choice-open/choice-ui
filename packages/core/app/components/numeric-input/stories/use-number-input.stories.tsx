import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { useRef, useState } from "react"
import { useNumericInput } from "../hooks/use-numeric-input"

const meta: Meta = {
  title: "Forms/useNumericInput",
}

export default meta

/**
 * # useNumericInput Hook
 *
 * A powerful React hook that provides comprehensive numeric input functionality
 * including value processing, keyboard navigation, and interactive adjustments.
 *
 * ## Core Features
 * - Basic number input with validation
 * - Expression evaluation (math calculations)
 * - Pattern-based formatting (units, multiple values)
 * - Keyboard navigation (arrow keys, modifiers)
 * - Drag-to-adjust values
 * - Constraint handling (min/max/step)
 */

/**
 * Basic implementation showcasing core functionality:
 * - Number input with validation
 * - Drag-to-adjust value
 * - Value display and formatting
 */
export const Basic: StoryObj = {
  render: function BasicStory() {
    const [value, setValue] = useState<number>(0)
    const { inputProps, handlerProps } = useNumericInput({
      value,
      onChange: (newValue) => setValue(newValue as number),
    })

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <input
            {...inputProps}
            className="w-24 rounded border border-gray-300 px-2 py-1"
            placeholder="Enter number"
          />
          <div
            {...handlerProps}
            className="cursor-ew-resize px-4 select-none"
          >
            ⟷
          </div>
        </div>
        <div>Current value: {value}</div>
      </div>
    )
  },
}

/**
 * Demonstrates expression patterns with unit formatting:
 * - Input values with units (e.g., "100px")
 * - Automatic parsing and formatting
 * - Unit preservation during interactions
 */
export const Expression: StoryObj = {
  render: function ExpressionStory() {
    const [value, setValue] = useState("100px")
    const { inputProps, handlerProps } = useNumericInput({
      value,
      expression: "{value}px",
      onChange: (newValue) => setValue(newValue as string),
    })

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <input
            {...inputProps}
            className="w-24 rounded border border-gray-300 px-2 py-1"
            placeholder="Enter value"
          />
          <div
            {...handlerProps}
            className="cursor-ew-resize px-4 select-none"
          >
            ⟷
          </div>
        </div>
        <div>Current value: {value}</div>
      </div>
    )
  },
}

/**
 * Shows handling multi-value inputs with structured output:
 * - Coordinate-style inputs (x,y format)
 * - Object-based value representation
 * - Synchronized value updates
 */
export const MultipleValues: StoryObj = {
  render: function MultipleValuesStory() {
    const [value, setValue] = useState<Record<string, number>>({ x: 100, y: 200 })
    const { inputProps, handlerProps } = useNumericInput({
      value,
      expression: "{x},{y}",
      onChange: (newValue) => setValue(newValue as Record<string, number>),
    })

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <input
            {...inputProps}
            className="w-32 rounded border border-gray-300 px-2 py-1"
            placeholder="x,y"
          />
          <div
            {...handlerProps}
            className="cursor-ew-resize px-4 select-none"
          >
            ⟷
          </div>
        </div>
        <div>
          X: {value.x}, Y: {value.y}
        </div>
      </div>
    )
  },
}

/**
 * Demonstrates value constraints and step controls:
 * - Min/max boundaries
 * - Step increments
 * - Modifier keys for step adjustment
 * - Decimal precision control
 */
export const Constraints: StoryObj = {
  render: function ConstraintsStory() {
    const [value, setValue] = useState(50)
    const { inputProps, handlerProps } = useNumericInput({
      value,
      min: 0,
      max: 100,
      step: 5,
      shiftStep: 20,
      decimal: 0,
      onChange: (newValue) => setValue(newValue as number),
    })

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <input
            {...inputProps}
            className="w-24 rounded border border-gray-300 px-2 py-1"
            placeholder="0-100"
          />
          <div
            {...handlerProps}
            className="cursor-ew-resize px-4 select-none"
          >
            ⟷
          </div>
        </div>
        <div>
          Value: {value}
          <div className="text-secondary-foreground text-sm">
            Min: 0, Max: 100, Step: 5 (Shift: 20)
          </div>
        </div>
      </div>
    )
  },
}

/**
 * Shows support for array values:
 * - Array input/output
 * - Comma-separated value parsing
 * - Multiple value management
 */
export const ArrayValues: StoryObj = {
  render: function ArrayValuesStory() {
    const [value, setValue] = useState<number[]>([10, 20, 30])
    const { inputProps, handlerProps } = useNumericInput({
      value,
      onChange: (newValue) => setValue(newValue as number[]),
    })

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <input
            {...inputProps}
            className="w-32 rounded border border-gray-300 px-2 py-1"
            placeholder="Enter numbers"
          />
          <div
            {...handlerProps}
            className="cursor-ew-resize px-4 select-none"
          >
            ⟷
          </div>
        </div>
        <div>Values: {value.join(", ")}</div>
      </div>
    )
  },
}

/**
 * Demonstrates input field states:
 * - Disabled state
 * - ReadOnly state
 * - Visual state feedback
 */
export const States: StoryObj = {
  render: function StatesStory() {
    const [value, setValue] = useState(50)
    const [isDisabled, setIsDisabled] = useState(false)
    const [isReadOnly, setIsReadOnly] = useState(false)

    const { inputProps, handlerProps } = useNumericInput({
      value,
      disabled: isDisabled,
      readOnly: isReadOnly,
      onChange: (newValue) => setValue(newValue as number),
    })

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <input
            {...inputProps}
            className="w-24 rounded border border-gray-300 px-2 py-1"
            placeholder="Enter number"
          />
          <div
            {...handlerProps}
            className="cursor-ew-resize px-4 select-none"
          >
            ⟷
          </div>
        </div>
        <div className="flex gap-4">
          <label>
            <input
              type="checkbox"
              checked={isDisabled}
              onChange={(e) => setIsDisabled(e.target.checked)}
            />{" "}
            Disabled
          </label>
          <label>
            <input
              type="checkbox"
              checked={isReadOnly}
              onChange={(e) => setIsReadOnly(e.target.checked)}
            />{" "}
            ReadOnly
          </label>
        </div>
        <div>Value: {value}</div>
      </div>
    )
  },
}

/**
 * Shows support for mathematical expression evaluation:
 * - Basic arithmetic operations (+, -, *, /)
 * - Expression parsing
 * - Real-time calculation
 */
export const MathExpressions: StoryObj = {
  render: function MathExpressionsStory() {
    const [value, setValue] = useState("1 + 2 * 3")
    const [result, setResult] = useState<number | null>(null)

    const { inputProps, handlerProps } = useNumericInput({
      value,
      onChange: (newValue, details) => {
        if (typeof newValue === "string") {
          setValue(newValue)
          setResult(details.array?.[0] ?? null)
        }
      },
    })

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <input
            {...inputProps}
            className="w-32 rounded border border-gray-300 px-2 py-1 font-mono"
            placeholder="Math expression"
          />
          <div
            {...handlerProps}
            className="cursor-ew-resize px-4 select-none"
          >
            ⟷
          </div>
        </div>
        <div>
          <div>Expression: {value}</div>
          {result !== null && <div className="font-bold">Result: {result}</div>}
          <div className="text-secondary-foreground text-sm">Try: "5+10", "(20-5)*2", "100/4"</div>
        </div>
      </div>
    )
  },
}

/**
 * Demonstrates empty value handling:
 * - Support for undefined/null values
 * - Value clearing functionality
 * - Default value management
 */
export const EmptyValue: StoryObj = {
  render: function EmptyValueStory() {
    const [value, setValue] = useState<number | undefined>(100)
    const { inputProps, handlerProps } = useNumericInput({
      value,
      onChange: (newValue) => {
        if (typeof newValue === "number" || newValue === undefined) {
          setValue(newValue)
        }
      },
      onEmpty: () => setValue(undefined),
    })

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <input
            {...inputProps}
            className="w-32 rounded border border-gray-300 px-2 py-1"
            placeholder="Clear for empty"
          />
          <div
            {...handlerProps}
            className="cursor-ew-resize px-4 select-none"
          >
            ⟷
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div>Current value: {value === undefined ? "empty" : value}</div>
          <button
            className="rounded bg-gray-200 px-2 py-0.5 text-sm"
            onClick={() => setValue(undefined)}
          >
            Clear
          </button>
        </div>
      </div>
    )
  },
}

/**
 * Demonstrates keyboard navigation and shortcuts:
 * - Arrow up/down for value adjustment
 * - Shift+arrow for larger steps
 * - Meta/Alt+arrow for smaller steps
 */
export const KeyboardNavigation: StoryObj = {
  render: function KeyboardNavigationStory() {
    const [value, setValue] = useState<number>(50)
    const [lastKey, setLastKey] = useState<string | null>(null)

    const { inputProps, handlerProps } = useNumericInput({
      value,
      min: 0,
      max: 100,
      step: 5,
      shiftStep: 20,
      onChange: (newValue) => setValue(newValue as number),
    })

    // Display which keys are being used
    const handleKeyDown = (e: React.KeyboardEvent) => {
      setLastKey(e.key)
      // Allow the event to continue to the input
      if (inputProps.onKeyDown) {
        inputProps.onKeyDown(e as any)
      }
    }

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <input
            {...inputProps}
            onKeyDown={handleKeyDown}
            className="w-24 rounded border border-gray-300 px-2 py-1"
            placeholder="Enter number"
          />
          <div
            {...handlerProps}
            className="cursor-ew-resize px-4 select-none"
          >
            ⟷
          </div>
        </div>
        <div>
          <div>Current value: {value}</div>
          {lastKey && <div className="text-secondary-foreground text-sm">Last key: {lastKey}</div>}
          <div className="text-secondary-foreground mt-2">
            <p>↑/↓: ±5, Shift+↑/↓: ±20, Meta/Alt+↑/↓: ±1</p>
          </div>
        </div>
      </div>
    )
  },
}

/**
 * Shows focus state handling and event tracking:
 * - Focus/blur events
 * - Editing state visualization
 * - Event notification
 */
export const FocusState: StoryObj = {
  render: function FocusStateStory() {
    const [value, setValue] = useState<number>(50)
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [lastEvent, setLastEvent] = useState<string>("")

    const { inputProps, handlerProps } = useNumericInput({
      value,
      onChange: (newValue) => {
        setValue(newValue as number)
        setLastEvent("onChange")
      },
      onEmpty: () => setLastEvent("onEmpty"),
    })

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsEditing(true)
      setLastEvent("onFocus")
      if (inputProps.onFocus) inputProps.onFocus(e)
    }

    const handleBlur = () => {
      setIsEditing(false)
      setLastEvent("onBlur")
      if (inputProps.onBlur) inputProps.onBlur()
    }

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className={`h-6 w-1 rounded ${isEditing ? "bg-blue-500" : "bg-gray-200"}`} />
          <input
            {...inputProps}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`w-32 rounded border ${isEditing ? "border-blue-500" : "border-gray-300"} px-2 py-1`}
            placeholder="Focus me"
          />
          <div
            {...handlerProps}
            className="cursor-ew-resize px-4 select-none"
          >
            ⟷
          </div>
        </div>
        <div>
          <div>Current value: {value}</div>
          <div className="flex items-center gap-2 text-sm">
            <span>State:</span>
            <span
              className={`rounded px-2 py-0.5 ${isEditing ? "bg-blue-100 text-blue-800" : "bg-gray-100"}`}
            >
              {isEditing ? "Editing" : "Idle"}
            </span>
            <span>Last event: {lastEvent}</span>
          </div>
        </div>
      </div>
    )
  },
}

/**
 * Demonstrates error handling and recovery:
 * - Invalid input detection
 * - Error feedback
 * - Recovery mechanisms
 */
export const ErrorHandling: StoryObj = {
  render: function ErrorHandlingStory() {
    const [value, setValue] = useState<number>(50)
    const [errorState, setErrorState] = useState<{ hasError: boolean; message: string }>({
      hasError: false,
      message: "",
    })
    const inputRef = useRef<HTMLInputElement>(null)

    const { inputProps, handlerProps } = useNumericInput({
      value,
      min: 0,
      max: 100,
      onChange: (newValue) => {
        setValue(newValue as number)
        setErrorState({ hasError: false, message: "" })
      },
    })

    const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value

      if (inputProps.onChange) {
        inputProps.onChange(e)
      }

      if (input && isNaN(Number(input)) && !/^[\d+\-*/().]+$/.test(input)) {
        setErrorState({
          hasError: true,
          message: "Only numbers and math operators allowed",
        })
      } else {
        setErrorState({ hasError: false, message: "" })
      }
    }

    const handleBlur = () => {
      if (errorState.hasError && inputRef.current) {
        setErrorState({ hasError: false, message: "" })
      }

      if (inputProps.onBlur) {
        inputProps.onBlur()
      }
    }

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <input
            {...inputProps}
            ref={inputRef}
            onChange={handleManualInput}
            onBlur={handleBlur}
            className={`w-32 rounded border ${errorState.hasError ? "border-red-500 bg-red-50" : "border-gray-300"} px-2 py-1`}
            placeholder="Try invalid input"
          />
          <div
            {...handlerProps}
            className="cursor-ew-resize px-4 select-none"
          >
            ⟷
          </div>
        </div>
        <div>
          <div>Current value: {value}</div>
          {errorState.hasError && <div className="text-sm text-red-500">{errorState.message}</div>}
          <div className="text-secondary-foreground text-sm">
            Try valid (50, 1+2) or invalid (abc, 50px) inputs
          </div>
        </div>
      </div>
    )
  },
}

/**
 * Shows a practical example with linked inputs:
 * - Coordinated multiple inputs
 * - Shared state management
 * - Visual result feedback
 */
export const LinkedInputs: StoryObj = {
  render: function LinkedInputsStory() {
    // Color values in RGB
    const [color, setColor] = useState({ r: 255, g: 100, b: 50 })

    // Handlers for each component
    const redInput = useNumericInput({
      value: color.r,
      min: 0,
      max: 255,
      step: 1,
      onChange: (value) => setColor((prev) => ({ ...prev, r: value as number })),
    })

    const greenInput = useNumericInput({
      value: color.g,
      min: 0,
      max: 255,
      step: 1,
      onChange: (value) => setColor((prev) => ({ ...prev, g: value as number })),
    })

    const blueInput = useNumericInput({
      value: color.b,
      min: 0,
      max: 255,
      step: 1,
      onChange: (value) => setColor((prev) => ({ ...prev, b: value as number })),
    })

    // Convert RGB to hex
    const rgbToHex = (r: number, g: number, b: number) => {
      return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
    }

    const hexColor = rgbToHex(color.r, color.g, color.b)

    return (
      <div className="flex flex-col gap-4">
        <div className="grid max-w-md grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-red-600">Red</label>
            <div className="flex items-center gap-2">
              <input
                {...redInput.inputProps}
                className="w-full rounded border border-red-200 bg-red-50 px-2 py-1"
                placeholder="0-255"
              />
              <div
                {...redInput.handlerProps}
                className="cursor-ew-resize text-red-500"
              >
                ⟷
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-green-600">Green</label>
            <div className="flex items-center gap-2">
              <input
                {...greenInput.inputProps}
                className="w-full rounded border border-green-200 bg-green-50 px-2 py-1"
                placeholder="0-255"
              />
              <div
                {...greenInput.handlerProps}
                className="cursor-ew-resize text-green-500"
              >
                ⟷
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-blue-600">Blue</label>
            <div className="flex items-center gap-2">
              <input
                {...blueInput.inputProps}
                className="w-full rounded border border-blue-200 bg-blue-50 px-2 py-1"
                placeholder="0-255"
              />
              <div
                {...blueInput.handlerProps}
                className="cursor-ew-resize text-blue-500"
              >
                ⟷
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div
            style={{
              backgroundColor: hexColor,
              width: "100px",
              height: "50px",
              borderRadius: "6px",
            }}
          />
          <div className="flex flex-col">
            <div className="font-mono text-lg">{hexColor}</div>
            <div className="text-secondary-foreground text-sm">
              rgb({color.r}, {color.g}, {color.b})
            </div>
          </div>
        </div>
      </div>
    )
  },
}

/**
 * Demonstrates controlled vs uncontrolled modes:
 * - Switching between modes
 * - External value updates
 * - Change event handling
 */
export const ControlledVsUncontrolled: StoryObj = {
  render: function ControlledVsUncontrolledStory() {
    const [isControlled, setIsControlled] = useState(true)
    const [controlledValue, setControlledValue] = useState(50)
    const [lastChangeValue, setLastChangeValue] = useState<number | null>(null)

    const { inputProps, handlerProps } = useNumericInput({
      ...(isControlled ? { value: controlledValue } : { defaultValue: 50 }),
      min: 0,
      max: 100,
      onChange: (newValue, details) => {
        // Extract the actual numeric value to avoid rendering objects directly
        const numericValue =
          typeof newValue === "object" && newValue !== null
            ? (details?.array?.[0] ?? 0)
            : Number(newValue)

        if (isControlled) {
          setControlledValue(numericValue)
        }
        setLastChangeValue(numericValue)
      },
    })

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <input
            {...inputProps}
            className="w-32 rounded border border-gray-300 px-2 py-1"
            placeholder="Enter number"
          />
          <div
            {...handlerProps}
            className="cursor-ew-resize px-4 select-none"
          >
            ⟷
          </div>
        </div>

        <div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isControlled}
                onChange={(e) => setIsControlled(e.target.checked)}
              />
              Controlled Mode
            </label>

            <button
              onClick={() => isControlled && setControlledValue(Math.floor(Math.random() * 100))}
              className={`rounded px-3 py-1 text-sm ${
                isControlled
                  ? "bg-blue-500 text-white"
                  : "text-secondary-foreground cursor-not-allowed bg-gray-200"
              }`}
            >
              Random Value
            </button>
          </div>

          <div className="mt-3 text-sm">
            <div>
              <strong>Mode:</strong> {isControlled ? "Controlled" : "Uncontrolled"}
            </div>
            {isControlled && (
              <div>
                <strong>Controlled value:</strong> {controlledValue}
              </div>
            )}
            {lastChangeValue !== null && (
              <div>
                <strong>Last onChange value:</strong> {lastChangeValue}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  },
}
