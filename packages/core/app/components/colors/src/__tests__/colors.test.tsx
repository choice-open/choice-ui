/**
 * Colors component bug-catching tests
 *
 * BUG 1: ColorSlider onChange not called on pointer release
 *   - User scenario: User drags a color slider thumb and releases it at a new position
 *   - Regression it prevents: The final slider position after release is lost — only
 *     intermediate drag positions are reported via onChange.
 *   - Logic change that makes it fail: In updatePosition (color-slider.tsx:154-167),
 *     the isEnd=true branch sets isDragging=false but skips onChange(newPosition).
 *     Fixing the bug requires also calling onChange in the isEnd branch.
 *
 * BUG 2: GradientSlider all new stops share the same nanoid
 *   - User scenario: User clicks on the gradient track to add multiple color stops
 *   - Regression it prevents: Duplicate stop IDs cause incorrect stop selection,
 *     deletion, and color picker association.
 *   - Logic change that makes it fail: nanoid() is called once at component level
 *     (color-gradient-slider.tsx:53) instead of inside addStop (line 151).
 *     Fixing requires moving nanoid() into the addStop function.
 *
 * BUG 3: Gradient rotation produces invalid transform matrix
 *   - User scenario: User clicks the rotate button on a linear gradient editor
 *   - Regression it prevents: Rotation corrupts the gradient transform matrix with
 *     nonsensical values (e.g., 91 instead of cos/sin values), breaking gradient rendering.
 *   - Logic change that makes it fail: handleRotate (color-gradients-paint.tsx:63-69)
 *     applies `(value + 90) % 360` to each matrix element instead of computing a proper
 *     rotation matrix using cos/sin. Fixing requires replacing modular addition with
 *     trigonometric matrix multiplication.
 */

import "@testing-library/jest-dom"
import { act, fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import React from "react"
import { beforeAll, describe, expect, it, vi } from "vitest"
import { ColorArea } from "../color-area/color-area"
import { ColorGradientSlider } from "../color-gradients-paint/color-gradient-slider"
import { ColorGradientsPaint } from "../color-gradients-paint/color-gradients-paint"
import { ColorSlider } from "../color-slider/color-slider"
import { ColorsProvider } from "../context/colots-context"
import type { ColorStop } from "../types/colors"
import type { GradientPaint } from "../types/paint"

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any

  if (typeof PointerEvent === "undefined") {
    class PointerEventPoly extends MouseEvent {
      pointerId: number
      constructor(type: string, init: any = {}) {
        super(type, init)
        this.pointerId = init.pointerId ?? 0
      }
    }
    globalThis.PointerEvent = PointerEventPoly as any
  }
})

vi.mock("../color-gradients-paint/color-gradients-toolbar", () => {
  const h = require("react").createElement
  return {
    ColorGradientsToolbar: ({ onRotate }: any) =>
      h("button", { "data-testid": "rotate-btn", onClick: onRotate }, "Rotate"),
  }
})

vi.mock("../color-gradients-paint/color-gradient-combined", () => ({
  ColorGradientCombined: () => null,
}))

vi.mock("../color-picker-popover", () => ({
  ColorPickerPopover: () => null,
}))

vi.mock("../color-solid-paint", () => ({
  ColorSolidPaint: () => null,
  ColorNativePicker: () => null,
}))

function mockRect(
  el: HTMLElement,
  { left, top, width, height }: { left: number; top: number; width: number; height: number },
) {
  el.getBoundingClientRect = () =>
    ({
      left,
      top,
      width,
      height,
      right: left + width,
      bottom: top + height,
      x: left,
      y: top,
      toJSON: () => {},
    }) as DOMRect
}

function mockPointerCapture(el: HTMLElement) {
  el.setPointerCapture = vi.fn()
  el.releasePointerCapture = vi.fn()
  el.hasPointerCapture = vi.fn().mockReturnValue(true)
}

function renderWithProvider(ui: React.ReactElement) {
  return render(<ColorsProvider>{ui}</ColorsProvider>)
}

describe("Colors bugs", () => {
  describe("BUG 1: ColorSlider onChange not called on pointer release", () => {
    /**
     * User scenario: User drags a color slider thumb to a new position and releases
     * Regression it prevents: Final position lost — onChange callback is never invoked
     *   with the value at the point of release, so the consumer only gets intermediate
     *   drag values, not the committed final value.
     * Logic change that makes it fail: In updatePosition (color-slider.tsx:154-167),
     *   the `isEnd` branch sets isDragging=false but skips onChange(newPosition).
     *   Fix = also call onChange(newPosition) when isEnd is true.
     */
    it("calls onChange with the final position when pointer is released after drag", async () => {
      const onChange = vi.fn()
      const onChangeEnd = vi.fn()

      const { container } = renderWithProvider(
        <ColorSlider
          position={0.5}
          onChange={onChange}
          onChangeEnd={onChangeEnd}
          type="hue"
          width={256}
        />,
      )

      const slider = container.firstChild as HTMLDivElement
      const thumb = slider.firstChild as HTMLDivElement

      mockRect(slider, { left: 0, top: 0, width: 256, height: 16 })
      mockPointerCapture(thumb)

      await act(async () => {
        fireEvent.pointerDown(slider, { clientX: 128, pointerId: 1 })
      })

      await act(async () => {
        fireEvent(
          window,
          new PointerEvent("pointermove", { clientX: 200, pointerId: 1, bubbles: true }),
        )
      })

      await act(async () => {
        fireEvent(
          window,
          new PointerEvent("pointerup", { clientX: 230, pointerId: 1, bubbles: true }),
        )
      })

      expect(onChangeEnd).toHaveBeenCalledTimes(1)

      const lastValue = onChange.mock.calls[onChange.mock.calls.length - 1][0] as number

      expect(lastValue).toBeGreaterThan(0.85)
    })
  })

  describe("BUG 2: GradientSlider new stops share the same nanoid", () => {
    /**
     * User scenario: User clicks on the gradient track to add two color stops
     * Regression it prevents: Duplicate stop IDs cause incorrect stop selection,
     *   deletion, and color picker association — the second stop silently overwrites
     *   the first because they share an ID.
     * Logic change that makes it fail: nanoid() is called once at component level
     *   (color-gradient-slider.tsx:53) instead of inside addStop (line 151).
     *   Fix = call nanoid() inside addStop so each invocation generates a fresh ID.
     */
    it("assigns unique IDs to each new gradient stop added via track click", () => {
      const initialStops: ColorStop[] = [
        { id: "left", position: 0, color: { r: 255, g: 0, b: 0 }, alpha: 1 },
        { id: "right", position: 1, color: { r: 0, g: 0, b: 255 }, alpha: 1 },
      ]

      const onChange = vi.fn()

      const { container } = renderWithProvider(
        <ColorGradientSlider
          value={initialStops}
          onChange={onChange}
          controlledSelectedStopId="left"
          onSelectedStopIdChange={vi.fn()}
          width={224}
        />,
      )

      const rootDiv = container.firstChild as HTMLDivElement
      const trackDiv = rootDiv.children[1] as HTMLDivElement

      mockRect(trackDiv, { left: 0, top: 0, width: 224, height: 16 })

      act(() => {
        fireEvent.click(trackDiv, { clientX: 74, clientY: 8 })
      })

      expect(onChange).toHaveBeenCalledTimes(1)
      const firstStops = onChange.mock.calls[0][0] as ColorStop[]
      const firstNewStop = firstStops.find((s) => s.id !== "left" && s.id !== "right")

      act(() => {
        fireEvent.click(trackDiv, { clientX: 148, clientY: 8 })
      })

      expect(onChange).toHaveBeenCalledTimes(2)
      const secondStops = onChange.mock.calls[1][0] as ColorStop[]
      const secondNewStop = secondStops.find((s) => s.id !== "left" && s.id !== "right")

      expect(firstNewStop).toBeDefined()
      expect(secondNewStop).toBeDefined()

      expect(firstNewStop!.id).not.toBe(secondNewStop!.id)
    })
  })

  describe("BUG 3: Gradient rotation produces invalid transform matrix", () => {
    /**
     * User scenario: User clicks the rotate button on a linear gradient editor
     * Regression it prevents: Rotation corrupts the gradient transform matrix,
     *   producing nonsensical values like 91/90 instead of valid cos/sin in [-1,1],
     *   which breaks gradient rendering entirely.
     * Logic change that makes it fail: handleRotate (color-gradients-paint.tsx:63-69)
     *   applies `(value + 90) % 360` to each matrix element instead of computing a
     *   proper rotation matrix. Fix = use trigonometric matrix multiplication.
     */
    it("produces a valid rotation matrix with bounded values after clicking rotate", async () => {
      const onGradientChange = vi.fn()

      const defaultGradient: GradientPaint = {
        type: "GRADIENT_LINEAR",
        gradientStops: [
          { id: "s1", position: 0, color: { r: 255, g: 0, b: 0 }, alpha: 1 },
          { id: "s2", position: 1, color: { r: 0, g: 0, b: 255 }, alpha: 1 },
        ],
        gradientTransform: [
          [1, 0, 0],
          [0, 1, 0],
        ],
      }

      renderWithProvider(
        <ColorGradientsPaint
          gradient={defaultGradient}
          onGradientChange={onGradientChange}
          colorSpace="rgb"
          onColorSpaceChange={vi.fn()}
        />,
      )

      const user = userEvent.setup()
      await user.click(screen.getByTestId("rotate-btn"))

      expect(onGradientChange).toHaveBeenCalledTimes(1)

      const updated = onGradientChange.mock.calls[0][0] as GradientPaint
      const transform = updated.gradientTransform

      for (const row of transform) {
        for (const value of row) {
          expect(Math.abs(value)).toBeLessThanOrEqual(1)
        }
      }
    })
  })

  describe("BUG 4: ColorArea onChange not called on pointer release", () => {
    /**
     * User scenario: User drags the color area thumb to a new position and releases.
     * Regression it prevents: Final position after release is lost. Consumer only gets
     *   intermediate drag positions, never the committed final value.
     * Logic change that makes it fail: color-area.tsx:82-86 - the isEnd=true branch
     *   sets isDragging=false but does NOT call onChange(newPosition). Only the
     *   intermediate branch calls onChange. Fix = call onChange in isEnd branch too.
     */
    it("calls onChange with the final position when pointer is released after drag on color area", async () => {
      const onChange = vi.fn()
      const onChangeEnd = vi.fn()

      const { container } = renderWithProvider(
        <ColorArea
          position={{ x: 0.5, y: 0.5 }}
          onChange={onChange}
          onChangeEnd={onChangeEnd}
          type="saturation-brightness"
          areaSize={{ width: 256, height: 192 }}
        />,
      )

      const area = container.firstChild as HTMLDivElement
      const thumb = area.children[0] as HTMLDivElement

      mockRect(area, { left: 0, top: 0, width: 256, height: 192 })
      mockPointerCapture(thumb)

      await act(async () => {
        fireEvent.pointerDown(area, { clientX: 128, clientY: 96, pointerId: 1 })
      })

      await act(async () => {
        fireEvent(
          window,
          new PointerEvent("pointermove", {
            clientX: 200,
            clientY: 50,
            pointerId: 1,
            bubbles: true,
          }),
        )
      })

      await act(async () => {
        fireEvent(
          window,
          new PointerEvent("pointerup", {
            clientX: 220,
            clientY: 40,
            pointerId: 1,
            bubbles: true,
          }),
        )
      })

      expect(onChangeEnd).toHaveBeenCalledTimes(1)

      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1]
      expect(lastCall).toBeTruthy()
      const lastPosition = lastCall[0] as { x: number; y: number }
      expect(lastPosition.x).toBeGreaterThan(0.8)
    })
  })
})
