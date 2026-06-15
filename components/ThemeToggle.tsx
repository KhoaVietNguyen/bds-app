'use client'

import { useLayoutEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

function getThemeColor(dark: boolean) {
  const isAdmin = typeof location !== 'undefined' && location.pathname.startsWith('/admin')
  if (dark) return isAdmin ? '#09090b' : '#171717'
  return isAdmin ? '#fdba74' : '#ffffff'
}

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)

  useLayoutEffect(() => {
    const stored = localStorage.getItem('theme')
    const dark = stored ? stored === 'dark' : true
    setIsDark(dark)
    document.documentElement.classList.toggle('dark', dark)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', getThemeColor(dark))
  }, [])

  function toggle() {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', getThemeColor(next))
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  )
}
