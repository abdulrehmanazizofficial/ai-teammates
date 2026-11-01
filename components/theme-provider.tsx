"use client"

import * as React from "react"

type Theme = "light" | "dark" | "system"
type ResolvedTheme = Exclude<Theme, "system">

const ThemeContext = React.createContext<{
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
} | null>(null)

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("system")
  const [systemTheme, setSystemTheme] = React.useState<ResolvedTheme>("light")

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const savedTheme = window.localStorage.getItem("theme")
    const initialTheme: Theme =
      savedTheme === "light" || savedTheme === "dark" ? savedTheme : "system"

    setThemeState(initialTheme)
    setSystemTheme(media.matches ? "dark" : "light")

    function onSystemThemeChange(event: MediaQueryListEvent) {
      setSystemTheme(event.matches ? "dark" : "light")
    }

    function onStorage(event: StorageEvent) {
      if (event.key !== "theme") {
        return
      }

      setThemeState(
        event.newValue === "light" || event.newValue === "dark"
          ? event.newValue
          : "system"
      )
    }

    media.addEventListener("change", onSystemThemeChange)
    window.addEventListener("storage", onStorage)

    return () => {
      media.removeEventListener("change", onSystemThemeChange)
      window.removeEventListener("storage", onStorage)
    }
  }, [])

  const resolvedTheme = theme === "system" ? systemTheme : theme

  React.useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("dark", resolvedTheme === "dark")
    root.classList.toggle("light", resolvedTheme === "light")
    root.style.colorScheme = resolvedTheme
  }, [resolvedTheme])

  const setTheme = React.useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme)
    window.localStorage.setItem("theme", nextTheme)
  }, [])

  const value = React.useMemo(
    () => ({ resolvedTheme, setTheme }),
    [resolvedTheme, setTheme]
  )

  return (
    <ThemeContext.Provider value={value}>
      <ThemeHotkey />
      {children}
    </ThemeContext.Provider>
  )
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

function ThemeHotkey() {
  const theme = React.useContext(ThemeContext)

  if (!theme) {
    throw new Error("ThemeHotkey must be rendered inside ThemeProvider")
  }

  const { resolvedTheme, setTheme } = theme

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) {
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (event.key.toLowerCase() !== "d") {
        return
      }

      if (isTypingTarget(event.target)) {
        return
      }

      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [resolvedTheme, setTheme])

  return null
}

export { ThemeProvider }
