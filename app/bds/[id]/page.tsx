import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PROPERTY_TYPE_LABELS, PROPERTY_STATUS_LABELS } from '@/lib/types'
import { formatPrice } from '@/lib/format'
import ImageGallery from '@/components/ImageGallery'
import ShareButton from '@/components/ShareButton'
import DownloadButton from '@/components/DownloadButton'
import ThemeToggle from '@/components/ThemeToggle'
import { Building2, MapPin, BedDouble, Maximize2, ChevronLeft, Hash } from 'lucide-react'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('properties').select('name, area, type').eq('id', id).single()
  if (!data) return { title: 'Không tìm thấy BĐS' }
  return {
    title: `${data.name} | BĐS Việt`,
    description: `${PROPERTY_TYPE_LABELS[data.type as keyof typeof PROPERTY_TYPE_LABELS]} tại ${data.area}`,
  }
}

const STATUS_COLORS = {
  active: 'bg-green-500/20 text-green-600 dark:text-green-400',
  sold: 'bg-red-500/20 text-red-600 dark:text-red-400',
  rented: 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()

  if (!property) notFound()

  const { data: images } = await supabase
    .from('property_images')
    .select('*')
    .eq('property_id', id)
    .order('order_index')

  const sortedImages = images ?? []
  const shareDescription = `${PROPERTY_TYPE_LABELS[property.type as keyof typeof PROPERTY_TYPE_LABELS]} tại ${property.area} - ${formatPrice(property.price)}`

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
          <span className="font-bold text-foreground flex-1">BĐS Việt</span>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-5 space-y-5 pb-24">
        {/* Gallery */}
        <ImageGallery images={sortedImages as any} />

        {/* Info card */}
        <div className="bg-card rounded-2xl p-5 space-y-4 shadow-sm border border-border">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="font-mono text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-medium flex items-center gap-1">
                  <Hash size={11} />
                  {property.id}
                </span>
                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                  {PROPERTY_TYPE_LABELS[property.type as keyof typeof PROPERTY_TYPE_LABELS]}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded font-medium ${STATUS_COLORS[property.status as keyof typeof STATUS_COLORS]}`}>
                  {PROPERTY_STATUS_LABELS[property.status as keyof typeof PROPERTY_STATUS_LABELS]}
                </span>
              </div>
              <h1 className="text-xl font-bold text-foreground leading-snug">{property.name}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <MapPin size={15} className="shrink-0" />
            <span>{property.area}</span>
          </div>

          {(property.bedrooms || property.area_sqm) && (
            <div className="flex gap-4 text-sm text-muted-foreground">
              {property.bedrooms && (
                <span className="flex items-center gap-1.5">
                  <BedDouble size={16} />
                  {property.bedrooms} phòng ngủ
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

          <div className="pt-2 border-t border-border">
            <p className="text-2xl font-bold text-primary">{formatPrice(property.price)}</p>
          </div>

          {property.description && (
            <div className="pt-2 border-t border-border">
              <p className="text-sm font-medium text-foreground mb-1.5">Mô tả</p>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{property.description}</p>
            </div>
          )}
        </div>
      </main>

      {/* FAB actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-xl z-20">
        <div className="max-w-3xl mx-auto flex gap-3">
          <ShareButton title={property.name} description={shareDescription} />
          {sortedImages.length > 0 && (
            <DownloadButton images={sortedImages} propertyId={property.id} />
          )}
        </div>
      </div>
    </div>
  )
}
