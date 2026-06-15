'use client'

import { useEffect } from 'react'

const ADMIN_LIGHT = '#fdba74' // orange-300 — top of admin light gradient
const ADMIN_DARK = '#09090b'  // zinc-950 — top of admin dark gradient

export function AdminThemeSync() {
  useEffect(() => {
    function sync() {
      const dark = document.documentElement.classList.contains('dark')
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? ADMIN_DARK : ADMIN_LIGHT)
    }

    sync()

    const mo = new MutationObserver(sync)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => mo.disconnect()
  }, [])

  return null
}
