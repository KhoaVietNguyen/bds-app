import { notFound } from 'next/navigation'
import { getPropertyDetail, getPropertyTypes, getPropertyStatuses } from '@/lib/data'
import { toLabelsMap, getStatusBadgeSolid } from '@/lib/config'
import Link from 'next/link'
import { CityKey } from '@/lib/types'
import { lang } from '@/lib/lang'
import { formatPrice, formatPriceUsd, formatDate } from '@/lib/format'
import { formatLocation } from '@/lib/locations'
import ImageGallery from '@/components/ImageGallery'
import AgentCard from '@/components/AgentCard'
import ShareButton from '@/components/ShareButton'
import DownloadButton from '@/components/DownloadButton'
import ThemeToggle from '@/components/ThemeToggle'
import { Building2, MapPin, BedDouble, Maximize2, ChevronLeft, Hash } from 'lucide-react'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const [{ property }, types] = await Promise.all([getPropertyDetail(id), getPropertyTypes()])
  if (!property) return { title: lang.property.notFound }
  const typeLabels = toLabelsMap(types)
  return {
    title: `${property.name} | ${lang.app.name}`,
    description: `${typeLabels[property.type] ?? property.type} tại ${formatLocation(property.district, property.city as CityKey)}`,
  }
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [{ property, images, profile }, propertyTypes, propertyStatuses] = await Promise.all([
    getPropertyDetail(id),
    getPropertyTypes(),
    getPropertyStatuses(),
  ])

  if (!property) notFound()

  const typeLabels = toLabelsMap(propertyTypes)
  const typeItem = propertyTypes.find(t => t.value === property.type)
  const typeBg = getStatusBadgeSolid(typeItem?.color)
  const statusItem = propertyStatuses.find(s => s.value === property.status)
  const statusLabel = statusItem?.label ?? property.status
  const statusColor = getStatusBadgeSolid(statusItem?.color)
  const shareDescription = `${typeLabels[property.type] ?? property.type} tại ${formatLocation(property.district, property.city as CityKey)} - ${formatPrice(property.price)}`

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-30 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-muted-foreground hover:text-foreground p-1">
            <ChevronLeft size={22} />
          </Link>
          <div className="bg-orange-500 text-white p-1.5 rounded-lg">
            <Building2 size={18} />
          </div>
          <span className="font-bold text-foreground flex-1"></span>
          <ShareButton title={property.name} description={shareDescription} compact />
          {images.length > 0 && (
            <DownloadButton images={images} propertyId={property.id} compact />
          )}
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-5 space-y-5 pb-28">
        {/* Gallery */}
        <ImageGallery images={images as any} />

        {/* Info card */}
        <div id="property-info-card" className="bg-card rounded-2xl p-5 space-y-4 shadow-sm border border-border">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <p className="text-xs font-bold text-muted-foreground shrink-0">
                  {lang.property.postedDate}: {formatDate(property.created_at)}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className={`text-white text-lg font-bold px-5 py-1 rounded-md ${statusColor}`}>
                  {statusLabel}
                </span>
                <span className={`text-white text-lg font-bold px-5 py-1 rounded-md ${typeBg}`}>
                  {typeLabels[property.type] ?? property.type}
                </span>
                <span className="font-mono text-lg bg-primary/10 text-primary px-5 py-1 rounded-md font-bold flex items-center gap-1">
                  <Hash size={16} />
                  {property.id}
                </span>
              </div>

              <div className="border-t border-b py-2 flex items-end justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {property.price && (
                      <span className="inline-flex items-center text-2xl font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">{formatPrice(property.price)}</span>
                    )}
                    {property.price_usd && (
                      <span className="inline-flex items-center text-2xl font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">{formatPriceUsd(property.price_usd)}</span>
                    )}
                    {!property.price && !property.price_usd && (
                      <span className="inline-flex items-center text-2xl font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">Liên hệ</span>
                    )}
                  </div>
                </div>
              </div>
              <h1 className="text-xl pt-2 font-bold text-foreground leading-snug">{property.name}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <MapPin size={15} className="shrink-0" />
            <span>{formatLocation(property.district, property.city as CityKey, property.address)}</span>
          </div>

          {(property.bedrooms || property.area_sqm) && (
            <div className="flex gap-4 text-sm text-muted-foreground">
              {property.bedrooms && (
                <span className="flex items-center gap-1.5">
                  <BedDouble size={16} />
                  {property.bedrooms} {lang.property.bedroomFull}
                </span>
              )}
              {property.area_sqm && (
                <span className="flex items-center gap-1.5">
                  <Maximize2 size={16} />
                  {property.area_sqm} m²
                </span>
              )}
            </div>
          )}

          {property.description && (
            <div className="pt-2 border-t border-border">
              <p className="text-sm font-medium text-foreground mb-1.5">{lang.property.descriptionTitle}</p>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{property.description}</p>
            </div>
          )}
        </div>
      </main>

      {/* Sale contact bar */}
      {(profile?.name || profile?.phone) && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-xl z-20 pb-[env(safe-area-inset-bottom)]">
          <div className="max-w-3xl mx-auto p-3">
            <AgentCard profile={profile} />
          </div>
        </div>
      )}
    </div>
  )
}
