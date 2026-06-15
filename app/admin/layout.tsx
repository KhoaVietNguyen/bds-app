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
      <div className="min-h-screen flex relative isolate bg-orange-200 dark:bg-zinc-950">
        <div className="fixed top-0 left-0 w-screen h-screen z-0 pointer-events-none bg-linear-to-br from-orange-200 via-orange-50 to-amber-200 dark:from-zinc-950 dark:via-orange-950/60 dark:to-black" />
        <div className="relative z-30">
          <AdminSidebar userEmail={session.user.email ?? ''} />
        </div>
        <main className="relative z-10 flex-1 min-w-0 p-4 pb-24 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </ConfigContextProvider>
  )
}
