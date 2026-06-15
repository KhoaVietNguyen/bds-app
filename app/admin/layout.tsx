import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { ConfigContextProvider } from '@/components/ConfigContext'
import { getPropertyTypes, getPropertyStatuses } from '@/lib/data'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const [{ data: { session } }, types, statuses] = await Promise.all([
    supabase.auth.getSession(),
    getPropertyTypes(),
    getPropertyStatuses(),
  ])

  if (!session) redirect('/login')

  return (
    <ConfigContextProvider types={types} statuses={statuses}>
      <div className="min-h-screen bg-orange-300 dark:bg-zinc-950">
        {/* Dải sticky cao bằng vùng notch — repaint khi đổi theme để iOS
            re-sample màu safe area (giống cơ chế header sticky bên client) */}
        <div className="sticky top-0 z-40 h-[env(safe-area-inset-top)] bg-orange-300 dark:bg-zinc-950" />
        <div className="flex">
          <AdminSidebar userEmail={session.user.email ?? ''} />
          <main className="flex-1 min-w-0 p-4 pb-24 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </ConfigContextProvider>
  )
}
