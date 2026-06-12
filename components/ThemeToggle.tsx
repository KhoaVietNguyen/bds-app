'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const dark = stored ? stored === 'dark' : true
    setIsDark(dark)
    document.documentElement.classList.toggle('dark', dark)
  }, [])

  function toggle() {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  )
}
