'use client'

import { useSyncExternalStore } from 'react'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'

function getThemeSnapshot() {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function getServerSnapshot() {
  return 'light' as const
}

function subscribeToTheme(callback: () => void) {
  const observer = new MutationObserver(callback)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  return () => observer.disconnect()
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerSnapshot)

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    document.documentElement.classList.toggle('dark', next === 'dark')
    localStorage.setItem('theme', next)
  }

  return (
    <Button size="icon" variant="ghost" onClick={toggle} title="Cambiar tema">
      {theme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  )
}
