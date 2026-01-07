import { Meta, StoryObj } from "@storybook/react"
import React, { CSSProperties, Fragment, useMemo } from "react"
import { hslToRgb, profileConvertString, useColorProfile } from "@choice-ui/react"
import type { ColorProfile } from "@choice-ui/react"

interface ColorProfileTestGridProps {
  colorProfile: ColorProfile
  grid?: number
  size?: number
}

export const ColorProfileTestGrid = function ColorProfileTestGrid(
  props: ColorProfileTestGridProps,
) {
  const { colorProfile, size = 24, grid = 24 } = props

  const rowsColor = useMemo(() => {
    const rows = Array.from({ length: grid }, (_, i) => {
      const ratio = 1 - i / grid // 从1到0的递减比例
      return {
        saturation: 100 * ratio, // 100% -> 0%
        lightness: 100 - ratio * 50, // 50% -> 100%
        id: i, // 添加 id 用作 key
      }
    })
    return rows
  }, [grid])

  // 生成色相数组 (0-360)
  const huesColor = useMemo(() => {
    const hues = Array.from({ length: grid }, (_, i) => (i * 360) / grid)
    return hues
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
              // a: 1,
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

const meta: Meta<typeof ColorProfileTestGrid> = {
  title: "Colors/ColorProfileTestGrid",
  component: ColorProfileTestGrid,
  tags: ["code-only"],
}

export default meta

type Story = StoryObj<typeof ColorProfileTestGrid>

const PROFILES = [
  {
    name: "sRGB",
    colorProfile: "srgb",
    description: "sRGB is a standard color space for digital imaging systems.",
  },
  {
    name: "Display P3",
    colorProfile: "display-p3",
    description: "Display P3 is a color space for high-quality displays.",
  },
]

const ProfileContent = ({
  profile,
  colorProfile,
}: {
  colorProfile: ColorProfile
  profile: (typeof PROFILES)[number]
}) => {
  return (
    <div className="flex w-[288px] flex-col gap-2 px-2">
      <span className="text-secondary min-w-0 break-words">{profile.description}</span>
      {colorProfile === profile.colorProfile && (
        <p className="break-words">
          {colorProfile === "display-p3"
            ? "Your display supports Display P3."
            : "Your display does not support Display P3."}
        </p>
      )}
    </div>
  )
}

/**
 * `ColorProfileTestGrid` demonstrates color profile support and visualization in different color spaces.
 *
 * ### Key Features
 * - Supports multiple color profiles (sRGB and Display P3)
 * - Visual comparison between color spaces
 * - Automatic detection of display capabilities
 * - Interactive color grid visualization
 *
 * ### Color Profiles
 * - sRGB: Standard color space for digital imaging systems
 * - Display P3: Extended color space for high-quality displays, offering 49% more visually distinct colors
 *
 */
export const Basic: Story = {
  render: function BasicStory() {
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
              colorProfile={profile.colorProfile as ColorProfile}
              size={12}
            />
            <ProfileContent
              profile={profile}
              colorProfile={colorProfile}
            />
          </div>
        ))}
      </div>
    )
  },
}
