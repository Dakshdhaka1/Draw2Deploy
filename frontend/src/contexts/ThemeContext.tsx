import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark'

type ThemeContextType = {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Helper function to apply theme to document
function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize theme from localStorage or system preference
  const getInitialTheme = (): Theme => {
    // Check localStorage first
    try {
      const saved = localStorage.getItem('d2d_theme')
      if (saved === 'dark' || saved === 'light') {
        return saved as Theme
      }
    } catch (e) {
      console.warn('Failed to read theme from localStorage:', e)
    }
    
    // Fall back to system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    
    return 'light'
  }

  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  // Apply theme on mount and whenever it changes
  useEffect(() => {
    applyTheme(theme)
    try {
      localStorage.setItem('d2d_theme', theme)
    } catch (e) {
      console.warn('Failed to save theme to localStorage:', e)
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === 'light' ? 'dark' : 'light'
      // Apply immediately for instant visual feedback
      applyTheme(newTheme)
      return newTheme
    })
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
