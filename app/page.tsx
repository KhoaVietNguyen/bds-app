import Image from 'next/image'
import PropertyCard from '@/components/PropertyCard'
import ClientSearch from '@/components/ClientSearch'
import ThemeToggle from '@/components/ThemeToggle'
import { lang } from '@/lib/lang'
import { Building2, Phone } from 'lucide-react'
import { ZaloIcon } from '@/components/AgentCard'
import { toLabelsMap } from '@/lib/config'
import { getProperties, getProfile, getPropertyTypes, getPropertyStatuses } from '@/lib/data'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; city?: string; district?: string; type?: string; status?: string; days?: string; pmin?: string; pmax?: string; cur?: string }>
}) {
  const params = await searchParams

  // Compute `since` outside cache scope so Date.now() isn't frozen in cache
  const since = params.days
    ? new Date(Math.floor((Date.now() - parseInt(params.days) * 86_400_000) / 60000) * 60000).toISOString()
    : undefined

  const cur = params.cur === 'usd' ? 'usd' : 'vnd'
  const pmin = params.pmin ? parseFloat(params.pmin) : undefined
  const pmax = params.pmax ? parseFloat(params.pmax) : undefined
  const priceMin = pmin != null ? (cur === 'vnd' ? pmin * 1_000_000_000 : pmin * 1_000) : undefined
  const priceMax = pmax != null ? (cur === 'vnd' ? pmax * 1_000_000_000 : pmax * 1_000) : undefined

  const [properties, profile, propertyTypes, propertyStatuses] = await Promise.all([
    getProperties({ q: params.q, city: params.city, district: params.district, type: params.type, status: params.status, since, priceMin, priceMax, priceCurrency: cur }),
    getProfile(),
    getPropertyTypes(),
    getPropertyStatuses(),
  ])
  const typeLabels = toLabelsMap(propertyTypes)

  const hasFilters = params.q || params.city || params.district || params.type || params.status || params.days || params.pmin || params.pmax

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
          <div className="bg-orange-500 text-white p-1.5 rounded-lg">
            <Building2 size={20} />
          </div>
          <span className="font-bold text-foreground text-lg flex-1">{lang.app.name}</span>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero search */}
      <div className="relative px-5 py-3 bg-linear-to-br from-orange-500 via-orange-200 to-orange-300">
        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-2">
          {profile?.avatar_url && (
            <div className="relative h-20 w-20 md:h-24 md:w-24 rounded-full overflow-hidden border-2 border-orange-400/60 shadow-lg mx-auto">
              <Image src={profile.avatar_url} alt={profile.name} fill className="object-cover" sizes="96px" />
            </div>
          )}
          {profile?.phone && (
            <div className="flex items-center justify-center gap-2">
              <a
                href={`tel:${profile.phone.replace(/\D/g, '')}`}
                className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg px-4 h-9 transition-colors shadow"
              >
                <Phone size={14} />
                {profile.phone}
              </a>
              <a
                href={`https://zalo.me/${profile.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-card hover:bg-accent text-foreground text-sm font-medium border border-border rounded-lg px-3 h-9 transition-colors shadow"
              >
                <ZaloIcon size={16} />
                {lang.profile.zaloBtn}
              </a>
            </div>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-black">
            {profile?.name ? `${profile.name} BĐS HCM` : lang.home.heroTitle}
          </h1>
          <p className="text-black/45 text-sm">{lang.home.heroSubtitle}</p>
          {/* Desktop: search trong hero */}
          <div className="hidden md:block">
            <ClientSearch
              initialQ={params.q}
              initialCity={params.city}
              initialDistrict={params.district}
              initialType={params.type}
              initialStatus={params.status}
              initialDays={params.days}
              initialPmin={params.pmin}
              initialPmax={params.pmax}
              initialCur={params.cur}
              types={propertyTypes}
              statuses={propertyStatuses}
            />
          </div>
        </div>
      </div>

      {/* Mobile: search band sticky dưới header (giống admin) */}
      <div className="md:hidden sticky top-14 z-20 bg-card/60 backdrop-blur-md border-b border-border px-4 py-2.5">
        <ClientSearch
          initialQ={params.q}
          initialCity={params.city}
          initialDistrict={params.district}
          initialType={params.type}
          initialDays={params.days}
          initialPmin={params.pmin}
          initialPmax={params.pmax}
          initialCur={params.cur}
          types={propertyTypes}
          statuses={propertyStatuses}
        />
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
              <PropertyCard key={property.id} property={property as any} profile={profile} typeLabels={typeLabels} statuses={propertyStatuses} types={propertyTypes} />
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
