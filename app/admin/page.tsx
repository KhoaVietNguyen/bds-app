import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import AdminPropertyTable from '@/components/admin/AdminPropertyTable'
import { Plus } from 'lucide-react'

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; area?: string; type?: string }>
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
  if (params.area) {
    query = query.ilike('area', `%${params.area}%`)
  }
  if (params.type) {
    query = query.eq('type', params.type)
  }

  const { data: properties } = await query

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Danh sách BĐS</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {properties?.length ?? 0} bất động sản
          </p>
        </div>
        <Link href="/admin/new">
          <Button>
            <Plus size={16} className="mr-1.5" />
            Thêm mới
          </Button>
        </Link>
      </div>

      <AdminPropertyTable properties={properties ?? []} filters={params} />
    </div>
  )
}
