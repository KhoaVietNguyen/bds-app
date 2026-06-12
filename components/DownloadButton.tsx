'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { lang } from '@/lib/lang'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  images: { url: string }[]
  propertyId: string
  compact?: boolean
}

export default function DownloadButton({ images, propertyId, compact }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleDownload() {
    if (images.length === 0) return toast.error(lang.download.errorEmpty)
    setLoading(true)
    toast.info(lang.download.preparing(images.length))

    try {
      const JSZip = (await import('jszip')).default
      const { saveAs } = await import('file-saver')

      const zip = new JSZip()
      const folder = zip.folder(propertyId)!

      // Chụp info card thành ảnh PNG kèm vào zip (fail thì bỏ qua, vẫn tải ảnh BĐS)
      // Luôn chụp ở light mode cho dễ đọc — tạm tắt dark trong lúc chụp rồi trả lại
      const htmlEl = document.documentElement
      const wasDark = htmlEl.classList.contains('dark')
      try {
        const { toPng } = await import('html-to-image')
        const node = document.getElementById('property-info-card')
        if (node) {
          if (wasDark) {
            htmlEl.classList.remove('dark')
            await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
          }
          const dataUrl = await toPng(node, {
            pixelRatio: 2,
            backgroundColor: '#ffffff',
          })
          const infoBlob = await (await fetch(dataUrl)).blob()
          folder.file(`${propertyId}_000_thong-tin.png`, infoBlob)
        }
      } catch {
        // bỏ qua nếu chụp thất bại
      } finally {
        if (wasDark) htmlEl.classList.add('dark')
      }

      await Promise.all(
        images.map(async (img, i) => {
          const res = await fetch(img.url)
          const blob = await res.blob()
          const ext = blob.type.split('/')[1] || 'jpg'
          folder.file(`${propertyId}_${String(i + 1).padStart(3, '0')}.${ext}`, blob)
        })
      )

      const content = await zip.generateAsync({ type: 'blob' })
      saveAs(content, `${propertyId}_images.zip`)
      toast.success(lang.download.success)
    } catch {
      toast.error(lang.download.errorFail)
    } finally {
      setLoading(false)
    }
  }

  if (compact) {
    return (
      <Button onClick={handleDownload} disabled={loading} variant="outline" size="icon" aria-label={lang.download.btn(images.length)} className="h-10 w-10 shrink-0">
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
      </Button>
    )
  }

  return (
    <Button onClick={handleDownload} disabled={loading} className="flex-1 gap-2">
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
      {loading ? lang.download.loading : lang.download.btn(images.length)}
    </Button>
  )
}
