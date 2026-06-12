import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen flex relative isolate bg-orange-200 dark:bg-zinc-950">
      {/* Gradient nền fixed phủ toàn viewport, tràn cả safe area iOS */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-linear-to-br from-orange-200 via-orange-50 to-amber-200 dark:from-zinc-950 dark:via-orange-950/60 dark:to-black" />
      <div className="relative z-30">
        <AdminSidebar userEmail={user.email ?? ''} />
      </div>
      <main className="relative z-10 flex-1 min-w-0 p-4 pb-24 md:p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}
