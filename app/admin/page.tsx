import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import AdminPropertyTable from '@/components/admin/AdminPropertyTable'
import { lang } from '@/lib/lang'
import { Plus } from 'lucide-react'

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; city?: string; district?: string; type?: string; days?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('properties')
    .select('*, property_images(id, url, order_index)')
    .order('created_at', { ascending: false })

  if (params.q) {
    query = query.or(`id.eq.${params.q},name.ilike.%${params.q}%`)
  }
  if (params.city) {
    query = query.eq('city', params.city)
  }
  if (params.district) {
    query = query.eq('district', params.district)
  }
  if (params.type) {
    query = query.eq('type', params.type)
  }
  if (params.days) {
    const since = new Date(Date.now() - parseInt(params.days) * 86_400_000).toISOString()
    query = query.gte('created_at', since)
  }

  const { data: properties } = await query

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{lang.admin.pageTitle}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {lang.admin.propertyCount(properties?.length ?? 0)}
          </p>
        </div>
        <Link href="/admin/new">
          <Button>
            <Plus size={16} className="mr-1.5" />
            {lang.admin.addBtn}
          </Button>
        </Link>
      </div>

      <AdminPropertyTable properties={properties ?? []} filters={params} />
    </div>
  )
}
