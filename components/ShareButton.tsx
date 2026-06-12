'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { lang } from '@/lib/lang'
import { Share2, Check } from 'lucide-react'
import { SiZalo } from 'react-icons/si'
import { toast } from 'sonner'

function ZaloIcon() {
  return (
    <span className="bg-[#0068FF] rounded-sm flex items-center justify-center text-white shrink-0 h-4 w-4">
      <SiZalo size={12} />
    </span>
  )
}

export default function ShareButton({ title, description, compact }: { title: string; description: string; compact?: boolean }) {
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

  if (compact) {
    return (
      <Button onClick={handleShare} variant="outline" size="icon" aria-label={lang.share.btn} className="h-10 w-10 shrink-0">
        {copied ? <Check size={16} className="text-green-500" /> : <Share2 size={16} />}
      </Button>
    )
  }

  return (
    <>
      <Button onClick={handleShare} variant="outline" className="flex-1 gap-2">
        {copied ? <Check size={16} className="text-green-500" /> : <Share2 size={16} />}
        {copied ? lang.share.copied : lang.share.btn}
      </Button>
      <Button onClick={handleZaloShare} variant="outline" className="hidden md:flex flex-1 gap-2">
        <ZaloIcon />
        {lang.share.zaloBtn}
      </Button>
    </>
  )
}
