'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { PropertyImage } from '@/lib/types'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'

export default function ImageGallery({ images }: { images: PropertyImage[] }) {
  const sorted = [...images].sort((a, b) => a.order_index - b.order_index)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [lightboxRef, lightboxApi] = useEmblaCarousel({ loop: true })

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', () => setActiveIndex(emblaApi.selectedScrollSnap()))
  }, [emblaApi])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const lightboxPrev = useCallback(() => lightboxApi?.scrollPrev(), [lightboxApi])
  const lightboxNext = useCallback(() => lightboxApi?.scrollNext(), [lightboxApi])

  useEffect(() => {
    if (lightboxIndex !== null && lightboxApi) {
      lightboxApi.scrollTo(lightboxIndex, true)
    }
  }, [lightboxIndex, lightboxApi])

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
  }

  if (sorted.length === 0) {
    return (
      <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center text-slate-300">
        Chưa có ảnh
      </div>
    )
  }

  return (
    <>
      {/* Main carousel */}
      <div className="relative overflow-hidden rounded-lg border border-border" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {sorted.map((img, i) => (
            <div key={img.id} className="flex-[0_0_100%] min-w-0 relative aspect-video bg-slate-100">
              <Image
                src={img.url}
                alt={`Ảnh ${i + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover cursor-zoom-in"
                priority={i === 0}
                loading={i === 0 ? undefined : 'lazy'}
                onClick={() => openLightbox(i)}
              />
              {i === activeIndex && (
                <button
                  type="button"
                  aria-label="Xem ảnh lớn"
                  onClick={() => openLightbox(i)}
                  className="absolute bottom-3 right-3 bg-black/40 text-white rounded-full p-1.5 hover:bg-black/60 transition-colors"
                >
                  <ZoomIn size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        {sorted.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-orange-500/60 rounded-full p-1.5 shadow hover:bg-white transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-orange-500/60 rounded-full p-1.5 shadow hover:bg-white transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 mt-2 scrollbar-hide">
          {sorted.map((img, i) => (
            <button
              key={img.id}
              onClick={() => emblaApi?.scrollTo(i)}
              className="flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-400 transition-all"
            >
              <Image src={img.url} alt="" width={64} height={48} className="object-cover w-full h-full" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black/70 backdrop-blur-md z-9999 flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-2 shrink-0">
            <span className="text-white/50 text-sm tabular-nums">
              {(lightboxApi?.selectedScrollSnap() ?? lightboxIndex) + 1} / {sorted.length}
            </span>
            <button
              onClick={() => setLightboxIndex(null)}
              className="text-white/70 hover:text-white p-2 -mr-2"
            >
              <X size={22} />
            </button>
          </div>

          {/* Images — fill remaining height */}
          <div className="flex-1 min-h-0 overflow-hidden relative" ref={lightboxRef}>
            <div className="flex h-full touch-pan-y">
              {sorted.map((img, i) => (
                <div key={img.id} className="flex-[0_0_100%] min-w-0 h-full relative">
                  <Image
                    src={img.url}
                    alt={`Ảnh ${i + 1}`}
                    fill
                    sizes="100vw"
                    className="object-contain"
                  />
                </div>
              ))}
            </div>

            {/* Side nav arrows */}
            {sorted.length > 1 && (
              <>
                <button type="button" aria-label="Ảnh trước" onClick={lightboxPrev} className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-orange-500/70 backdrop-blur-sm hover:bg-orange-500/90 rounded-full p-2 transition-colors">
                  <ChevronLeft size={22} />
                </button>
                <button type="button" aria-label="Ảnh tiếp" onClick={lightboxNext} className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-orange-500/70 backdrop-blur-sm hover:bg-orange-500/90 rounded-full p-2 transition-colors">
                  <ChevronRight size={22} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
