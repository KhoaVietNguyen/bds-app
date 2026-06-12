import Link from 'next/link'
import Image from 'next/image'
import { Property, PROPERTY_TYPE_LABELS, PROPERTY_STATUS_LABELS } from '@/lib/types'
import { lang } from '@/lib/lang'
import { formatPrice } from '@/lib/format'
import { formatLocation } from '@/lib/locations'
import { MapPin, BedDouble, Maximize2, Images } from 'lucide-react'

const STATUS_COLORS = {
  active: 'bg-green-500/20 text-green-600 dark:text-green-400',
  sold: 'bg-red-500/20 text-red-600 dark:text-red-400',
  rented: 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
}

export default function PropertyCard({ property }: { property: Property }) {
  const images = property.property_images?.sort((a, b) => a.order_index - b.order_index) ?? []
  const cover = images[0]?.url

  return (
    <Link href={`/bds/${property.id}`} className="group block">
      <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
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
            <span className={`${STATUS_COLORS[property.status]} text-xs px-2 py-0.5 rounded-full font-medium`}>
              {PROPERTY_STATUS_LABELS[property.status]}
            </span>
          </div>
          {/* Image count */}
          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
              <Images size={11} />
              {images.length}
            </div>
          )}
          {/* Type badge */}
          <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm text-foreground text-xs px-2 py-0.5 rounded-full font-medium">
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

          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-base font-bold text-orange-500">{formatPrice(property.price)}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}
