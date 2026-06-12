'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { lang } from '@/lib/lang'
import { Share2, Check } from 'lucide-react'
import { toast } from 'sonner'

function ZaloIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill="#0068FF" />
      <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold" fontFamily="Arial, sans-serif">Z</text>
    </svg>
  )
}

export default function ShareButton({ title, description }: { title: string; description: string }) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const url = window.location.href
    const shareData = { title, text: description, url }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // User cancelled — no action needed
      }
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success(lang.share.successToast)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  async function handleZaloShare() {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title, text: description, url })
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url)
      window.open('https://zalo.me', '_blank')
      toast.success(lang.share.zaloToast)
    }
  }

  return (
    <>
      <Button onClick={handleShare} variant="outline" className="flex-1 gap-2">
        {copied ? <Check size={16} className="text-green-500" /> : <Share2 size={16} />}
        {copied ? lang.share.copied : lang.share.btn}
      </Button>
      <Button onClick={handleZaloShare} variant="outline" className="flex-1 gap-2">
        <ZaloIcon />
        {lang.share.zaloBtn}
      </Button>
    </>
  )
}
