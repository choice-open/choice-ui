import type { RGB } from "@choice-ui/react"
import { ColorSwatch, HexInput } from "@choice-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import tinycolor from "tinycolor2"

const meta: Meta<typeof HexInput> = {
  title: "Colors/HexInput",
  component: HexInput,
}

export default meta

type Story = StoryObj<typeof HexInput>

/**
 * `IfHexInput` is a versatile color input component that supports multiple color formats and provides intelligent color completion.
 *
 * ## Features
 *
 * ### Input Support
 * - Color Formats: HEX, RGB, HSL, LAB, OKLAB, LCH, OKLCH, DISPLAY-P3
 * - Display Format: HEX (automatically converted)
 * - Output Format: RGB values and Alpha
 *
 * ### Smart Color Completion
 * The component includes intelligent color completion for partial HEX inputs:
 * - Single digit (e.g., "5") → Repeats 6 times (555555)
 * - Two digits (e.g., "58") → Repeats 3 times (585858)
 * - Three digits (e.g., "58F") → Creates symmetric pattern (58FF85)
 * - Incomplete inputs → Smart pattern detection and completion
 *
 * ### Key Properties
 * - `value`: RGB color value ({ r: number, g: number, b: number })
 * - `onChange`: Callback for RGB color changes
 * - `onAlphaChange`: Callback for alpha value changes
 * - `disabled`: Disables input interaction
 *
 *
 * Note: The component requires custom styling as it does not include default styles.
 */
export const Basic: Story = {
  render: function BasicStory() {
    const [color, setColor] = useState<RGB>({ r: 255, g: 87, b: 51 })
    const [alpha, setAlpha] = useState(1)

    return (
      <div className="w-md flex flex-col items-start gap-4">
        <div className="focus-within:border-selected-boundary flex items-center self-start rounded-md border pl-2">
          <ColorSwatch
            color={color}
            alpha={alpha}
            className="rounded-sm"
          />

          <HexInput
            value={color}
            onChange={(value) => setColor(value)}
            onAlphaChange={(value) => setAlpha(value)}
          />
        </div>

        <ul className="flex flex-col gap-2 rounded-md border p-4">
          <li>
            <b className="font-strong">HEX Format</b>: Input accepts 3-digit (#RGB) or 6-digit
            (#RRGGBB) hex codes, with optional alpha (#RGBA or #RRGGBBAA).
          </li>
          <li>
            <b className="font-strong">RGB Format</b>: Input accepts rgb(R, G, B) or rgba(R, G, B,
            A) syntax.
          </li>
          <li>
            <b className="font-strong">HSL Format</b>: Input accepts hsl(H, S%, L%) or hsla(H, S%,
            L%, A) syntax.
          </li>
          <li>
            <b className="font-strong">Advanced Formats</b>: Also supports LAB, OKLAB, LCH, OKLCH
            and display-p3 color spaces.
          </li>
          <li>
            <b className="font-strong">Intelligent Completion</b>: Partial inputs are smartly
            completed (e.g., &quot;5&quot; → &quot;555555&quot;, &quot;58&quot; →
            &quot;585858&quot;).
          </li>
        </ul>

        <div className="flex flex-col gap-1 rounded-md border p-4">
          <div>Current Color Values:</div>
          <ul className="flex list-disc flex-col gap-1">
            {Object.entries(color).map(([key, value]) => (
              <li
                key={key}
                className="flex items-center gap-2 uppercase"
              >
                <ColorSwatch
                  className="rounded-sm"
                  color={{
                    r: key === "r" ? value : 255,
                    g: key === "g" ? value : 255,
                    b: key === "b" ? value : 255,
                  }}
                  size={16}
                />
                {key}: {value}
              </li>
            ))}
            <li className="flex items-center gap-2 uppercase">
              <ColorSwatch
                className="rounded-sm"
                color={color}
                alpha={alpha}
                size={16}
              />
              A: {alpha.toFixed(2)}
            </li>
          </ul>
          <div className="mt-2">HEX: {tinycolor(color).toHexString()}</div>
          <div>RGB: {tinycolor(color).toRgbString()}</div>
        </div>
      </div>
    )
  },
}
