'use client'

import { useEffect } from 'react'

const ADMIN_LIGHT = '#fdba74' // orange-300 — top of admin light gradient
const ADMIN_DARK = '#09090b'  // zinc-950 — top of admin dark gradient

export function AdminThemeSync() {
  useEffect(() => {
    function sync() {
      const dark = document.documentElement.classList.contains('dark')
      const color = dark ? ADMIN_DARK : ADMIN_LIGHT
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color)
      document.body.style.backgroundColor = color
    }

    sync()

    const mo = new MutationObserver(sync)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => {
      mo.disconnect()
      document.body.style.backgroundColor = ''
    }
  }, [])

  return null
}
