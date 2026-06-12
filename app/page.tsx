import { createClient } from '@/lib/supabase/server'
import PropertyCard from '@/components/PropertyCard'
import ClientSearch from '@/components/ClientSearch'
import ThemeToggle from '@/components/ThemeToggle'
import { Building2 } from 'lucide-react'

export default async function HomePage({
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
    query = query.or(`id.ilike.%${params.q}%,name.ilike.%${params.q}%`)
  }
  if (params.area) {
    query = query.ilike('area', `%${params.area}%`)
  }
  if (params.type) {
    query = query.eq('type', params.type)
  }

  const { data: properties } = await query

  const hasFilters = params.q || params.area || params.type

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="bg-orange-500 text-white p-1.5 rounded-lg">
            <Building2 size={20} />
          </div>
          <span className="font-bold text-foreground text-lg flex-1">BĐS Việt</span>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero search */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-700 text-white px-4 py-10">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold">Tìm bất động sản lý tưởng</h1>
          <p className="text-orange-100 text-sm">Villa · Biệt thự · Căn hộ dịch vụ</p>
          <ClientSearch initialQ={params.q} initialArea={params.area} initialType={params.type} />
        </div>
      </div>

      {/* Results */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {hasFilters ? 'Kết quả tìm kiếm: ' : 'Tất cả BĐS: '}
            <span className="font-semibold text-foreground">{properties?.length ?? 0} căn</span>
          </p>
        </div>

        {properties && properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property as any} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-muted-foreground">
            <Building2 size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">Không tìm thấy BĐS phù hợp</p>
            <p className="text-sm mt-1">Thử thay đổi bộ lọc</p>
          </div>
        )}
      </main>
    </div>
  )
}
