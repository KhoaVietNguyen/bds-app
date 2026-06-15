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
      <div className="min-h-screen flex bg-orange-300 dark:bg-zinc-950">
        <AdminSidebar userEmail={session.user.email ?? ''} />
        <main className="flex-1 min-w-0 p-4 pb-24 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </ConfigContextProvider>
  )
}
