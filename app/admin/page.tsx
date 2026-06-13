import { createClient } from '@/lib/supabase/server'
import AdminPropertyTable from '@/components/admin/AdminPropertyTable'
import { lang } from '@/lib/lang'

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; city?: string; district?: string; type?: string; status?: string; days?: string }>
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
  if (params.status) {
    query = query.eq('status', params.status)
  }
  if (params.days) {
    const since = new Date(Date.now() - parseInt(params.days) * 86_400_000).toISOString()
    query = query.gte('created_at', since)
  }

  const { data: properties } = await query

  return (

    <AdminPropertyTable properties={properties ?? []} filters={params} />

  )
}
