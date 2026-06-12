'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Share2, Check, Copy } from 'lucide-react'
import { toast } from 'sonner'

export default function ShareButton({ title, description }: { title: string; description: string }) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const url = window.location.href
    const shareData = { title, text: description, url }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (e) {
        // User cancelled — no action needed
      }
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Đã sao chép link!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Button onClick={handleShare} variant="outline" className="flex-1 gap-2">
      {copied ? <Check size={16} className="text-green-500" /> : <Share2 size={16} />}
      {copied ? 'Đã sao chép' : 'Chia sẻ'}
    </Button>
  )
}
