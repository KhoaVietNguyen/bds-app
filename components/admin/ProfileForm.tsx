'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import imageCompression from 'browser-image-compression'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { lang } from '@/lib/lang'
import { Loader2, Camera, UserRound } from 'lucide-react'
import { toast } from 'sonner'

const AVATAR_COMPRESSION = {
  maxSizeMB: 0.2,
  maxWidthOrHeight: 512,
  useWebWorker: true,
  fileType: 'image/webp',
}

export default function ProfileForm({ profile }: { profile: Profile | null }) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)

  const [name, setName] = useState(profile?.name ?? '')
  const [phone, setPhone] = useState(profile?.phone ?? '')
  const [bio, setBio] = useState(profile?.bio ?? '')
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? '')
  const [newAvatar, setNewAvatar] = useState<{ file: File; preview: string } | null>(null)

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const compressed = await imageCompression(file, AVATAR_COMPRESSION)
      if (newAvatar) URL.revokeObjectURL(newAvatar.preview)
      setNewAvatar({ file: compressed, preview: URL.createObjectURL(compressed) })
    } catch {
      toast.error(lang.form.errorCompress)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return toast.error(lang.profile.errorName)

    setSaving(true)
    const supabase = createClient()

    try {
      let finalAvatarUrl = avatarUrl

      if (newAvatar) {
        const formData = new FormData()
        formData.append('file', newAvatar.file)
        formData.append('folder', 'bds-app/profile')
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        if (!res.ok) throw new Error(lang.form.errorUpload)
        const { url } = await res.json()
        finalAvatarUrl = url
      }

      const { error } = await supabase.from('profile').upsert({
        id: 1,
        name: name.trim(),
        phone: phone.trim() || null,
        bio: bio.trim() || null,
        avatar_url: finalAvatarUrl || null,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error

      setAvatarUrl(finalAvatarUrl)
      setNewAvatar(null)
      toast.success(lang.profile.success)
      router.refresh()
    } catch (err: any) {
      toast.error(lang.profile.errorPrefix + ' ' + (err.message ?? 'Không xác định'))
    } finally {
      setSaving(false)
    }
  }

  const displayAvatar = newAvatar?.preview || avatarUrl

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-card/60 backdrop-blur rounded-xl border border-border p-5 space-y-5">
        <h2 className="font-semibold text-foreground">{lang.profile.sectionTitle}</h2>

        {/* Avatar */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative h-24 w-24 rounded-full overflow-hidden bg-muted border-2 border-border shrink-0 group"
          >
            {displayAvatar ? (
              <Image src={displayAvatar} alt="" fill className="object-cover" sizes="96px" />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <UserRound size={36} />
              </span>
            )}
            <span className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-[10px] py-1 flex items-center justify-center gap-1">
              <Camera size={11} />
              {lang.profile.changeAvatar}
            </span>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{lang.profile.avatarLabel}</p>
            <p className="text-xs mt-0.5">Ảnh vuông, tự nén về 512px</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>{lang.profile.nameLabel} <span className="text-red-500">*</span></Label>
          <Input className="text-xs md:text-sm" value={name} onChange={(e) => setName(e.target.value)} placeholder={lang.profile.namePlaceholder} required />
        </div>

        <div className="space-y-1.5">
          <Label>{lang.profile.phoneLabel}</Label>
          <Input className="text-xs md:text-sm" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={lang.profile.phonePlaceholder} />
        </div>

        <div className="space-y-1.5">
          <Label>{lang.profile.bioLabel}</Label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder={lang.profile.bioPlaceholder}
            className="w-full rounded-lg border border-input bg-transparent dark:bg-input/30 px-2.5 py-2 text-xs md:text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-none"
          />
        </div>
      </div>

      <Button type="submit" disabled={saving} className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white">
        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {lang.profile.saveBtn}
      </Button>
    </form>
  )
}
