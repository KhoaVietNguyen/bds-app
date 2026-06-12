import { createClient } from '@/lib/supabase/server'
import PropertyCard from '@/components/PropertyCard'
import ClientSearch from '@/components/ClientSearch'
import ThemeToggle from '@/components/ThemeToggle'
import { lang } from '@/lib/lang'
import { Building2 } from 'lucide-react'

export default async function HomePage({
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
    query = query.or(`id.ilike.%${params.q}%,name.ilike.%${params.q}%`)
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

  const hasFilters = params.q || params.city || params.district || params.type || params.days

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="bg-orange-500 text-white p-1.5 rounded-lg">
            <Building2 size={20} />
          </div>
          <span className="font-bold text-foreground text-lg flex-1">{lang.app.name}</span>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero search */}
      <div className="relative px-4 py-16 bg-linear-to-br from-orange-200 via-orange-50 to-amber-200 dark:from-zinc-950 dark:via-orange-950/60 dark:to-black">
        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{lang.home.heroTitle}</h1>
          <p className="text-muted-foreground text-sm">{lang.home.heroSubtitle}</p>
          <ClientSearch
            initialQ={params.q}
            initialCity={params.city}
            initialDistrict={params.district}
            initialType={params.type}
            initialDays={params.days}
          />
        </div>
      </div>

      {/* Results */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {hasFilters ? lang.home.resultsFiltered : lang.home.resultsAll}{' '}
            <span className="font-semibold text-foreground">{properties?.length ?? 0} {lang.home.countUnit}</span>
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
            <p className="text-lg font-medium">{lang.home.noResults}</p>
            <p className="text-sm mt-1">{lang.home.noResultsHint}</p>
          </div>
        )}
      </main>
    </div>
  )
}
