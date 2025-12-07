import { useEffect, useState } from "react"

export function useTheme(): "light" | "dark" {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light"

    try {
      const html = document.documentElement
      if (html.classList.contains("dark") || html.getAttribute("data-theme") === "dark") {
        return "dark"
      }
    } catch {
      // Fallback in case of DOM access error
    }
    return "light"
  })

  useEffect(() => {
    if (typeof window === "undefined") return

    const html = document.documentElement
    if (!html) return

    const updateTheme = () => {
      try {
        if (html.classList.contains("dark") || html.getAttribute("data-theme") === "dark") {
          setTheme("dark")
        } else {
          setTheme("light")
        }
      } catch {
        // Fallback in case of DOM access error
        setTheme("light")
      }
    }

    // Initial check
    updateTheme()

    // Create a MutationObserver to watch for class/attribute changes
    if (typeof MutationObserver === "undefined") return

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
