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
      {/* Set nền body theo màu admin NGAY trong lúc parse (body đã tồn tại ở
          đây), trước first paint → hết race khiến light mode lúc trắng lúc cam.
          iOS lấy màu safe area từ nền body. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `try{var d=document.documentElement.classList.contains('dark');var c=d?'#09090b':'#fdba74';document.body.style.backgroundColor=c;var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',c)}catch(e){}`,
        }}
      />
      <div className="min-h-screen flex relative isolate bg-orange-300 dark:bg-zinc-950">
        {/* Gradient nền — góc trên-trái là orange-300/zinc-950 trùng màu body
            nên vùng safe area (lấy màu từ body) liền mạch với gradient */}
        <div className="fixed inset-0 z-0 pointer-events-none bg-linear-to-br from-orange-300 via-orange-100 to-amber-200 dark:from-zinc-950 dark:via-orange-950/60 dark:to-black" />
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
