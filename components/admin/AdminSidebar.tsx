'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Building2, LayoutDashboard, Plus, LogOut, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { lang } from '@/lib/lang'
import ThemeToggle from '@/components/ThemeToggle'
import { motion, AnimatePresence } from 'motion/react'

const navItems = [
  { href: '/admin', label: lang.admin.navList, icon: LayoutDashboard },
  { href: '/admin/new', label: lang.admin.navAdd, icon: Plus },
]

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Ẩn option của page đang đứng
  const visibleNav = navItems.filter(({ href }) => href !== pathname)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      {/* Mobile: FAB speed-dial menu góc dưới trái */}
      <div className="md:hidden">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40"
              onClick={() => setOpen(false)}
            />
          )}
        </AnimatePresence>

        <div className="fixed left-4 z-50 flex flex-col-reverse items-start gap-3 bottom-[max(1.25rem,env(safe-area-inset-bottom))]">
          {/* FAB chính */}
          <motion.button
            onClick={() => setOpen((v) => !v)}
            whileTap={{ scale: 0.88 }}
            className="h-14 w-14 rounded-full bg-orange-500 text-white shadow-xl shadow-orange-500/30 flex items-center justify-center"
          >
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="flex items-center justify-center"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </motion.span>
          </motion.button>

          {/* Options bung lên trên */}
          <AnimatePresence>
            {open && (
              <div className="flex flex-col items-start gap-3">
                {visibleNav.map(({ href, label, icon: Icon }, i) => (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, y: 20, scale: 0.5 }}
                    animate={{
                      opacity: 1, y: 0, scale: 1,
                      transition: { delay: i * 0.06, type: 'spring', stiffness: 450, damping: 26 },
                    }}
                    exit={{
                      opacity: 0, y: 14, scale: 0.5,
                      transition: { delay: (visibleNav.length - i) * 0.04, duration: 0.12 },
                    }}
                    className="flex items-center gap-2.5"
                  >
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'h-11 w-11 rounded-full flex items-center justify-center shadow-lg border',
                        pathname === href
                          ? 'bg-orange-500 text-white border-orange-400'
                          : 'bg-card text-foreground border-border'
                      )}
                    >
                      <Icon size={19} />
                    </Link>
                    <span className="bg-card/95 backdrop-blur text-foreground text-xs font-medium px-2.5 py-1.5 rounded-full border border-border shadow-sm">
                      {label}
                    </span>
                  </motion.div>
                ))}

                {/* Logout */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.5 }}
                  animate={{
                    opacity: 1, y: 0, scale: 1,
                    transition: { delay: visibleNav.length * 0.06, type: 'spring', stiffness: 450, damping: 26 },
                  }}
                  exit={{ opacity: 0, y: 14, scale: 0.5, transition: { duration: 0.12 } }}
                  className="flex items-center gap-2.5"
                >
                  <button
                    onClick={handleLogout}
                    className="h-11 w-11 rounded-full flex items-center justify-center shadow-lg bg-card text-red-500 border border-red-500/30"
                  >
                    <LogOut size={19} />
                  </button>
                  <span className="bg-card/95 backdrop-blur text-red-500 text-xs font-medium px-2.5 py-1.5 rounded-full border border-red-500/30 shadow-sm">
                    {lang.admin.logout}
                  </span>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-card/60 backdrop-blur border-r border-border h-screen sticky top-0 overflow-y-auto">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 px-4 py-5 border-b border-border">
            <div className="bg-orange-500 text-white p-1.5 rounded-lg">
              <Building2 size={20} />
            </div>
            <span className="font-semibold text-foreground flex-1">{lang.admin.brand}</span>
            <ThemeToggle />
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  pathname === href
                    ? 'bg-orange-500 text-white'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
          </nav>

          <div className="p-3 border-t border-border">
            <p className="text-xs text-muted-foreground px-3 mb-2 truncate">{userEmail}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
            >
              <LogOut size={16} className="mr-2" />
              {lang.admin.logout}
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
