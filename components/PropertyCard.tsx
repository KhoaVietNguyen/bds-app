import Link from 'next/link'
import Image from 'next/image'
import { Property, Profile, PROPERTY_TYPE_LABELS, PROPERTY_STATUS_LABELS } from '@/lib/types'
import { lang } from '@/lib/lang'
import { formatPrice, formatPriceUsd } from '@/lib/format'
import { formatLocation } from '@/lib/locations'
import { MapPin, BedDouble, Maximize2, Images, Phone, UserRound } from 'lucide-react'

const STATUS_COLORS = {
  selling: 'bg-green-500/80 text-white dark:text-white',
  renting: 'bg-blue-500/80 text-white dark:text-white',
  sold: 'bg-red-500/80 text-white dark:text-white',
  rented: 'bg-orange-500/80 text-white dark:text-white',
  vacant: 'bg-purple-500/80 text-white dark:text-white',
}

export default function PropertyCard({ property, profile }: { property: Property; profile?: Profile | null }) {
  const images = property.property_images?.sort((a, b) => a.order_index - b.order_index) ?? []
  const cover = images[0]?.url

  return (
    <Link href={`/bds/${property.id}`} className="group block" prefetch={false}>
      <div className="bg-card rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        {/* Image */}
        <div className="relative aspect-video bg-muted overflow-hidden">
          {cover ? (
            <Image
              src={cover}
              alt={property.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
              <Images size={40} />
            </div>
          )}
          {/* Status badge */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`${STATUS_COLORS[property.status]} text-sm px-2 py-0.5 rounded-md font-bold`}>
              {PROPERTY_STATUS_LABELS[property.status]}
            </span>
          </div>
          {/* Image count */}
          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-sm px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
              <Images size={11} />
              {images.length}
            </div>
          )}
          {/* Type badge */}
          <div className="absolute top-3 right-3 bg-card/90 bg-orange-400/90 text-white text-sm px-2 py-0.5 rounded-md font-bold">
            {PROPERTY_TYPE_LABELS[property.type]}
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="font-mono text-xs text-orange-500 font-medium mb-1">{property.id}</p>
          <h3 className="font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-orange-500 transition-colors">
            {property.name}
          </h3>

          <div className="flex items-center gap-1 text-muted-foreground text-xs mt-2">
            <MapPin size={12} />
            <span className="truncate">{formatLocation(property.district, property.city)}</span>
          </div>

          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            {property.bedrooms && (
              <span className="flex items-center gap-1">
                <BedDouble size={12} />
                {property.bedrooms} {lang.property.bedroomShort}
              </span>
            )}
            {property.area_sqm && (
              <span className="flex items-center gap-1">
                <Maximize2 size={12} />
                {property.area_sqm} m²
              </span>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between gap-2">
            <div>
              <p className="text-base font-bold text-orange-500">{formatPrice(property.price)}</p>
              {property.price_usd && (
                <p className="text-xs text-muted-foreground">{formatPriceUsd(property.price_usd)}</p>
              )}
            </div>
            {profile && (profile.avatar_url || profile.phone) && (
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="relative h-6 w-6 rounded-full overflow-hidden bg-muted border border-border shrink-0">
                  {profile.avatar_url ? (
                    <Image src={profile.avatar_url} alt={profile.name} fill className="object-cover" sizes="24px" />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      <UserRound size={13} />
                    </span>
                  )}
                </div>
                {profile.phone && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium truncate">
                    <Phone size={11} className="shrink-0" />
                    {profile.phone}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
