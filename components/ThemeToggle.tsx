'use client'

import { useLayoutEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

function getThemeColor(dark: boolean) {
  const isAdmin = typeof location !== 'undefined' && location.pathname.startsWith('/admin')
  if (dark) return isAdmin ? '#09090b' : '#171717'
  return isAdmin ? '#fdba74' : '#ffffff'
}

// Vùng safe area sau notch lấy màu từ background của <body> (body có class
// bg-background phủ kín, đè lên <html>). Set nền cả html và body theo theme.
// Đồng thời xoá + tạo lại thẻ theme-color để ép iOS Safari re-sample khi toggle.
function applyThemeColor(color: string) {
  document.documentElement.style.backgroundColor = color
  document.body.style.backgroundColor = color
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.remove())
  const meta = document.createElement('meta')
  meta.setAttribute('name', 'theme-color')
  meta.setAttribute('content', color)
  document.head.appendChild(meta)
}

// iOS Safari không vẽ lại màu safe area khi đổi theme-color động (chỉ ăn sau
// khi kill app). Nhúc trang 1px rồi trả lại buộc nó re-sample ngay lập tức.
function nudgeSafeArea() {
  const y = window.scrollY
  window.scrollTo(0, y + 1)
  requestAnimationFrame(() => window.scrollTo(0, y))
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
    nudgeSafeArea()
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  )
}
