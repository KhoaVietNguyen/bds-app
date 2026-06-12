'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Building2, LayoutDashboard, Plus, LogOut, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import ThemeToggle from '@/components/ThemeToggle'

const navItems = [
  { href: '/admin', label: 'Danh sách BĐS', icon: LayoutDashboard },
  { href: '/admin/new', label: 'Thêm BĐS mới', icon: Plus },
]

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-5 border-b border-border">
        <div className="bg-orange-500 text-white p-1.5 rounded-lg">
          <Building2 size={20} />
        </div>
        <span className="font-semibold text-foreground flex-1">BĐS Manager</span>
        <ThemeToggle />
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              pathname === href
                ? 'bg-orange-500 text-white'
                : 'text-muted-foreground hover:bg-muted'
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
          Đăng xuất
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-40 md:hidden bg-card shadow-md border border-border"
      >
        <Menu size={20} />
      </Button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div className={cn(
        'fixed inset-y-0 left-0 w-64 bg-card z-50 shadow-xl transition-transform duration-300 md:hidden',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3"
        >
          <X size={18} />
        </Button>
        <NavContent />
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-card border-r border-border min-h-screen">
        <NavContent />
      </aside>
    </>
  )
}
