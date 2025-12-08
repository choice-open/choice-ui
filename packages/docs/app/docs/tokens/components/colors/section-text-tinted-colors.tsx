"use client"
import { color, ColorPath, typography } from "@choice-ui/design-tokens"
import { memo, useState } from "react"
import {
  ColorField,
  ColorTypes,
  ColorTypesSelect,
  ColorValue,
  Panel,
  PanelHeader,
  Section,
} from ".."
import { textTintedGroups } from "./contents"
import styles from "./section-text-tinted-colors.module.css"

export const SectionTextTintedColors = memo(function SectionTextTintedColors() {
  const [colorType, setColorType] = useState<ColorTypes>(ColorTypes.FUNCTION)

  return (
    <Section
      title="Semantic Text Colors"
      content={
        <>
          <p>
            Semantic text colors communicate specific states and meanings through color choices,
            providing visual cues that users can quickly understand and act upon.
          </p>

          <p>
            <b>fg.accent</b>
          </p>
          <p>
            Brand accent color for links, call-to-action text, and prominent interactive elements
            that should draw attention.
          </p>

          <p>
            <b>fg.success</b>
          </p>
          <p>
            Positive confirmation color for success messages, completion indicators, and approved
            states.
          </p>

          <p>
            <b>fg.warning</b>
          </p>
          <p>
            Caution color for warnings, alerts, and content requiring user attention without
            indicating danger.
          </p>

          <p>
            <b>fg.danger</b>
          </p>
          <p>
            Critical color for error messages, destructive actions, and urgent notifications
            requiring immediate attention.
          </p>

          <p>
            <b>fg.assistive</b>
          </p>
          <p>
            Helper color for tips, guidance text, and supportive interface messaging that aids user
            understanding.
          </p>

          <p>
            <b>fg.component</b>
          </p>
          <p>
            Specialized text color for unique component contexts that need distinction from standard
            semantic colors.
          </p>
        </>
      }
    >
      <PanelHeader>
        <ColorTypesSelect
          colorType={colorType}
          setColorType={setColorType}
        />
      </PanelHeader>

      {["light", "dark"].map((theme) => (
        <Panel
          theme={theme as "light" | "dark"}
          key={theme}
        >
          {textTintedGroups.map((colorData) => {
            const colorKey = color(colorData.colorKey as ColorPath, 1, theme as "light" | "dark")

            return (
              <div
                key={colorData.name}
                style={
                  {
                    "--color": colorKey,
                  } as React.CSSProperties
                }
              >
                <ColorField
                  colorValue={colorKey}
                  colorString={
                    <ColorValue
                      selectedColor={colorData.name}
                      colorType={colorType}
                      shade={{
                        key: colorData.colorKey,
                        opacity: 1,
                      }}
                      theme={theme as "light" | "dark"}
                    />
                  }
                />
                <h3
                  className={styles.heading}
                  style={{
                    fontFamily: typography("heading.medium").fontFamily,
                    fontSize: typography("heading.medium").fontSize,
                    fontWeight: typography("heading.medium").fontWeight,
                    lineHeight: typography("heading.medium").lineHeight,
                    letterSpacing: typography("heading.medium").letterSpacing,
                  }}
                >
                  The quick brown fox
                </h3>
              </div>
            )
          })}
        </Panel>
      ))}
    </Section>
  )
})

SectionTextTintedColors.displayName = "SectionTextTintedColors"
