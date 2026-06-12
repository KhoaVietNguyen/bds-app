'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  images: { url: string }[]
  propertyId: string
}

export default function DownloadButton({ images, propertyId }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleDownload() {
    if (images.length === 0) return toast.error('Không có ảnh để tải')
    setLoading(true)
    toast.info(`Đang chuẩn bị ${images.length} ảnh...`)

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
      toast.success('Tải xuống thành công!')
    } catch {
      toast.error('Tải thất bại, vui lòng thử lại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleDownload} disabled={loading} className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700">
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
      {loading ? 'Đang tải...' : `Tải ảnh (${images.length})`}
    </Button>
  )
}
