"use client"

import * as React from "react"

type Theme = "dark" | "light" | "system"

interface ThemeProviderContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "dark" | "light"
}

const ThemeProviderContext = React.createContext<ThemeProviderContextValue>({
  theme: "system",
  setTheme: () => {},
  resolvedTheme: "light",
})

function getSystemTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function applyTheme(resolved: "dark" | "light") {
  const root = document.documentElement
  root.classList.remove("dark", "light")
  root.classList.add(resolved)
  root.style.colorScheme = resolved
}

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "dashboard-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = React.useState<"dark" | "light">("light")
  const [mounted, setMounted] = React.useState(false)

  // After mount, read from localStorage
  React.useEffect(() => {
    const stored = localStorage.getItem(storageKey) as Theme | null
    const initial = stored || defaultTheme
    setThemeState(initial)
    const resolved = initial === "system" ? getSystemTheme() : initial
    setResolvedTheme(resolved)
    applyTheme(resolved)
    setMounted(true)
  }, [defaultTheme, storageKey])

  // Listen for system preference changes
  React.useEffect(() => {
    if (theme !== "system") return
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = (e: MediaQueryListEvent) => {
      const next = e.matches ? "dark" : "light"
      setResolvedTheme(next)
      applyTheme(next)
    }
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [theme])

  const setTheme = React.useCallback(
    (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme)
      setThemeState(newTheme)
      const resolved = newTheme === "system" ? getSystemTheme() : newTheme
      setResolvedTheme(resolved)
      applyTheme(resolved)
    },
    [storageKey]
  )

  const value = React.useMemo(
    () => ({ theme, setTheme, resolvedTheme }),
    [theme, setTheme, resolvedTheme]
  )

  // Avoid rendering with wrong theme class (prevent flash)
  if (!mounted) {
    return (
      <ThemeProviderContext.Provider value={value}>
        <div style={{ visibility: "hidden" }}>{children}</div>
      </ThemeProviderContext.Provider>
    )
  }

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export function useTheme(): ThemeProviderContextValue {
  const ctx = React.useContext(ThemeProviderContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}
