'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { PropertyImage } from '@/lib/types'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'

export default function ImageGallery({ images }: { images: PropertyImage[] }) {
  const sorted = [...images].sort((a, b) => a.order_index - b.order_index)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [lightboxRef, lightboxApi] = useEmblaCarousel({ loop: true })

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const lightboxPrev = useCallback(() => lightboxApi?.scrollPrev(), [lightboxApi])
  const lightboxNext = useCallback(() => lightboxApi?.scrollNext(), [lightboxApi])

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setTimeout(() => lightboxApi?.scrollTo(index, true), 50)
  }

  if (sorted.length === 0) {
    return (
      <div className="aspect-video bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300">
        Chưa có ảnh
      </div>
    )
  }

  return (
    <>
      {/* Main carousel */}
      <div className="relative overflow-hidden rounded-2xl" ref={emblaRef}>
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
                onClick={() => openLightbox(i)}
              />
              <button
                onClick={() => openLightbox(i)}
                className="absolute bottom-3 right-3 bg-black/40 text-white rounded-full p-1.5 hover:bg-black/60 transition-colors"
              >
                <ZoomIn size={16} />
              </button>
            </div>
          ))}
        </div>

        {sorted.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 shadow hover:bg-white transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 shadow hover:bg-white transition-colors"
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
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
          <div className="flex items-center justify-between p-4">
            <span className="text-white text-sm opacity-70">{sorted.length} ảnh</span>
            <button
              onClick={() => setLightboxIndex(null)}
              className="text-white hover:text-slate-300 p-2"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-hidden" ref={lightboxRef}>
            <div className="flex h-full touch-pan-y">
              {sorted.map((img, i) => (
                <div key={img.id} className="flex-[0_0_100%] min-w-0 flex items-center justify-center p-4">
                  <div className="relative w-full h-full max-h-[75vh]">
                    <Image
                      src={img.url}
                      alt={`Ảnh ${i + 1}`}
                      fill
                      sizes="100vw"
                      className="object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-4 p-4">
            <button onClick={lightboxPrev} className="text-white bg-white/20 rounded-full p-2 hover:bg-white/30">
              <ChevronLeft size={24} />
            </button>
            <button onClick={lightboxNext} className="text-white bg-white/20 rounded-full p-2 hover:bg-white/30">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
