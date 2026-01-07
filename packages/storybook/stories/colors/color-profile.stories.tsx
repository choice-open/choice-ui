import type { ColorProfile, RGB } from "@choice-ui/react"
import { ColorsContext, ColorSwatch, useColors } from "@choice-ui/react"
import { StoryObj } from "@storybook/react"

const meta = {
  title: "Colors/ColorProfile",
}

export default meta

type Story = StoryObj

// Color profile display component
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
          {profile === "srgb" ? "sRGB Color Space" : "Wide Gamut Display P3"}
        </div>
      </div>
    </div>
  )
}

/**
 * Helper component that consumes the color context
 */
const ColorProfileConsumer = () => {
  // Use the useColors hook to get color profile information from context
  // This is already provided by the ColorsProviderWrapper in preview.tsx
  const { colorProfile, isWideGamutSupported, userPreference } = useColors()

  return (
    <div className="flex w-full max-w-md flex-col gap-8 p-4">
      <h2 className="text-body-large-strong">Color Profile Consumer Demo</h2>

      <div className="flex flex-col gap-2">
        <p>
          <strong>Wide Gamut Support:</strong> {isWideGamutSupported ? "✅ Yes" : "❌ No"}
        </p>
        <p>
          <strong>Current Profile:</strong> {colorProfile}
        </p>
        <p>
          <strong>User Preference:</strong> {userPreference || "Auto"}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-body-large-strong">Color Display</h3>
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
        <p className="text-secondary-foreground">
          Note: Color differences are only visible on displays that support Display P3
        </p>
      </div>
    </div>
  )
}

/**
 * Default story demonstrates how component consumes color context
 */
export const Default: Story = {
  render: function DefaultStory() {
    return (
      <div className="mt-8">
        <div className="bg-secondary-background mb-8 rounded-md p-4">
          <h3 className="text-body-large-strong">Using Color Context</h3>
          <p className="leading-6">
            This component consumes the color context from the Storybook preview wrapper:
          </p>
          <ul className="list-disc pl-5">
            <li>Preview already provides ColorsContext.Provider at the root</li>
            <li>This component uses useColors() hook to access the shared context</li>
            <li>Use the buttons in the preview toolbar to control the color profile</li>
            <li>
              Any changes in the preview toolbar will affect all stories because they share the
              context
            </li>
          </ul>
        </div>
        <ColorProfileConsumer />
      </div>
    )
  },
}
