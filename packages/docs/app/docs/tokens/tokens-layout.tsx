"use client"

import { typography } from "@choice-ui/design-tokens"
import { ThemeContext } from "./context"
import { useTheme } from "./hooks"
import styles from "./tokens-layout.module.css"

interface TokensLayoutProps {
  children: React.ReactNode
}

export function TokensLayout({ children }: TokensLayoutProps) {
  const { theme, setTheme } = useTheme()
  const bodyTypography = typography("body.medium")

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div
        className={styles.appContainer}
        data-theme={theme}
        style={{
          fontFamily: bodyTypography.fontFamily,
          fontSize: bodyTypography.fontSize,
          fontWeight: bodyTypography.fontWeight,
          lineHeight: bodyTypography.lineHeight,
          letterSpacing: bodyTypography.letterSpacing,
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}
