'use client'

import { useLayoutEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

function getThemeColor(dark: boolean) {
  const isAdmin = typeof location !== 'undefined' && location.pathname.startsWith('/admin')
  if (dark) return isAdmin ? '#09090b' : '#171717'
  return isAdmin ? '#fdba74' : '#ffffff'
}

// Với viewport-fit=cover, vùng safe area trên cùng (sau notch) được tô bằng
// background của <html>. Set thẳng nền html theo màu theme để safe area đổi
// màu trên iOS Safari. Đồng thời update thẻ theme-color cho phần chrome.
function applyThemeColor(color: string) {
  document.documentElement.style.backgroundColor = color
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color)
}

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)

  useLayoutEffect(() => {
    const stored = localStorage.getItem('theme')
    const dark = stored ? stored === 'dark' : true
    setIsDark(dark)
    document.documentElement.classList.toggle('dark', dark)
    applyThemeColor(getThemeColor(dark))
  }, [])

  function toggle() {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
    applyThemeColor(getThemeColor(next))
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  )
}
