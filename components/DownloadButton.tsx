'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { lang } from '@/lib/lang'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  images: { url: string }[]
  propertyId: string
}

export default function DownloadButton({ images, propertyId }: Props) {
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

  return (
    <Button onClick={handleDownload} disabled={loading} className="flex-1 gap-2">
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
      {loading ? lang.download.loading : lang.download.btn(images.length)}
    </Button>
  )
}
