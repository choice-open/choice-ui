import { useEffect, useState } from "react"

export function useTheme(): "light" | "dark" {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light"

    const html = document.documentElement
    if (html.classList.contains("dark") || html.getAttribute("data-theme") === "dark") {
      return "dark"
    }
    return "light"
  })

  useEffect(() => {
    const html = document.documentElement

    const updateTheme = () => {
      if (html.classList.contains("dark") || html.getAttribute("data-theme") === "dark") {
        setTheme("dark")
      } else {
        setTheme("light")
      }
    }

    // Initial check
    updateTheme()

    // Create a MutationObserver to watch for class/attribute changes
    const observer = new MutationObserver(updateTheme)
    observer.observe(html, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return theme
}
