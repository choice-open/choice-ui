import type { ColorProfile, RGB } from "@choice-ui/react"
import {
  ColorSwatch,
  hslToRgb,
  profileConvertString,
  Segmented,
  useColorProfile,
  useColors,
} from "@choice-ui/react"
import { Meta, StoryObj } from "@storybook/react"
import { CSSProperties, Fragment, useMemo } from "react"

const meta: Meta = {
  title: "Colors/ColorsProvider",
}

export default meta

type Story = StoryObj

/**
 * `ColorsProvider` is the context provider for color profile management in the design system.
 *
 * ### Wide Gamut Color Support
 *
 * Modern displays support wider color gamuts than traditional sRGB:
 * - **sRGB**: Standard color space for web, covers ~35% of visible colors
 * - **Display P3**: Extended gamut used by Apple devices, covers ~49% more colors than sRGB
 *
 * ### Usage
 *
 * ```tsx
 * import { ColorsProvider, useColorProfile, useColors } from "@choice-ui/react"
 *
 * // Wrap your app with ColorsProvider
 * <ColorsProvider>
 *   <App />
 * </ColorsProvider>
 *
 * // Access color profile in components
 * function MyComponent() {
 *   const colorProfile = useColorProfile() // "srgb" | "display-p3"
 *   const { isWideGamutSupported, userPreference } = useColors()
 *   // ...
 * }
 * ```
 *
 * ### Key Hooks
 *
 * - `useColorProfile()`: Returns current color profile ("srgb" | "display-p3")
 * - `useColors()`: Returns full context including `colorProfile`, `isWideGamutSupported`, `userPreference`
 *
 * ### Helper Functions
 *
 * - `profileConvertString(rgb, profile)`: Converts RGB to CSS color string for the given profile
 */
export const Basic: Story = {
  render: function BasicStory() {
    const colorProfile = useColorProfile()
    const { isWideGamutSupported, userPreference, setUserPreference } = useColors()

    const preferenceValue =
      userPreference === "srgb" ? "srgb" : userPreference === "display-p3" ? "p3" : "auto"

    const handlePreferenceChange = (value: string) => {
      if (value === "auto") {
        setUserPreference(null)
      } else if (value === "srgb") {
        setUserPreference("srgb")
      } else if (value === "p3") {
        setUserPreference("display-p3")
      }
    }

    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <strong>User Preference:</strong>
            <Segmented
              value={preferenceValue}
              onChange={handlePreferenceChange}
            >
              <Segmented.Item
                className="px-2"
                value="auto"
              >
                Auto
              </Segmented.Item>
              <Segmented.Item
                className="px-2"
                value="srgb"
              >
                sRGB
              </Segmented.Item>
              <Segmented.Item
                className="px-2"
                value="p3"
              >
                P3
              </Segmented.Item>
            </Segmented>
          </div>
          <div className="text-secondary-foreground flex gap-4">
            <span>Wide Gamut Support: {isWideGamutSupported ? "Yes" : "No"}</span>
            <span>Current Profile: {colorProfile}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <ColorProfileDisplay
            profile={colorProfile}
            label="Vivid Red"
            color={{ r: 255, g: 0, b: 0 }}
          />
          <ColorProfileDisplay
            profile={colorProfile}
            label="Vivid Green"
            color={{ r: 0, g: 255, b: 0 }}
          />
        </div>
      </div>
    )
  },
}

const ColorProfileDisplay = ({
  profile,
  label,
  color,
}: {
  color: RGB
  label: string
  profile: ColorProfile
}) => {
  return (
    <div className="flex items-center gap-4 rounded-md border p-4">
      <ColorSwatch
        className="rounded-md"
        color={color}
        size={60}
      />
      <div>
        <div className="mb-2 font-bold">{label}</div>
        <div className="text-secondary-foreground">
          {profile === "srgb" ? "sRGB" : "Display P3"}
        </div>
      </div>
    </div>
  )
}

const PROFILES: { name: string; colorProfile: ColorProfile; description: string }[] = [
  {
    name: "sRGB",
    colorProfile: "srgb",
    description: "Standard color space for web and digital imaging.",
  },
  {
    name: "Display P3",
    colorProfile: "display-p3",
    description: "Extended color space with 49% more colors than sRGB.",
  },
]

/**
 * Visual comparison of sRGB and Display P3 color spaces.
 *
 * The grid shows the full range of hues at varying saturation and lightness levels.
 * On Display P3 capable displays, the right grid will show more vibrant colors.
 */
export const ColorSpaceComparison: Story = {
  render: function ColorSpaceComparisonStory() {
    const colorProfile = useColorProfile()

    return (
      <div className="grid grid-cols-2 gap-4">
        {PROFILES.map((profile) => (
          <div
            key={profile.name}
            className="flex min-w-0 flex-col gap-4"
          >
            <h2 className="font-strong">{profile.name}</h2>
            <ColorProfileTestGrid
              colorProfile={profile.colorProfile}
              size={12}
            />
            <div className="text-secondary-foreground w-72">{profile.description}</div>
            {colorProfile === profile.colorProfile && (
              <div className="text-sm">
                {colorProfile === "display-p3"
                  ? "Your display supports Display P3."
                  : "Your display does not support Display P3."}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  },
}

interface ColorProfileTestGridProps {
  colorProfile: ColorProfile
  grid?: number
  size?: number
}

const ColorProfileTestGrid = (props: ColorProfileTestGridProps) => {
  const { colorProfile, size = 24, grid = 24 } = props

  const rowsColor = useMemo(() => {
    return Array.from({ length: grid }, (_, i) => {
      const ratio = 1 - i / grid
      return {
        saturation: 100 * ratio,
        lightness: 100 - ratio * 50,
        id: i,
      }
    })
  }, [grid])

  const huesColor = useMemo(() => {
    return Array.from({ length: grid }, (_, i) => (i * 360) / grid)
  }, [grid])

  return (
    <div
      className="grid overflow-hidden"
      style={{ gridTemplateColumns: `repeat(${grid}, ${size}px)` }}
    >
      {rowsColor.map((row) => (
        <Fragment key={row.id}>
          {huesColor.map((hue) => {
            const { r, g, b } = hslToRgb({
              h: hue,
              s: row.saturation,
              l: row.lightness,
            })
            return (
              <div
                key={hue}
                style={
                  {
                    backgroundColor: profileConvertString({ r, g, b }, colorProfile),
                    width: `${size}px`,
                    height: `${size}px`,
                  } as CSSProperties
                }
              />
            )
          })}
        </Fragment>
      ))}
    </div>
  )
}
