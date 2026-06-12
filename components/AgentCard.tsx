import Image from 'next/image'
import { Profile } from '@/lib/types'
import { lang } from '@/lib/lang'
import { Phone, UserRound } from 'lucide-react'

function ZaloIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill="#0068FF" />
      <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold" fontFamily="Arial, sans-serif">Z</text>
    </svg>
  )
}

export default function AgentCard({ profile }: { profile: Profile | null }) {
  if (!profile || (!profile.name && !profile.phone)) return null

  const phoneDigits = profile.phone?.replace(/\D/g, '') ?? ''

  return (
    <div className="bg-card rounded-2xl p-5 shadow-sm border border-border space-y-4">
      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 rounded-full overflow-hidden bg-muted border border-border shrink-0">
          {profile.avatar_url ? (
            <Image src={profile.avatar_url} alt={profile.name} fill className="object-cover" sizes="64px" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <UserRound size={28} />
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">{lang.profile.agentTitle}</p>
          <p className="font-bold text-foreground text-lg leading-snug">{profile.name}</p>
          {profile.bio && (
            <p className="text-sm text-muted-foreground leading-relaxed mt-1 whitespace-pre-line">{profile.bio}</p>
          )}
        </div>
      </div>

      {phoneDigits && (
        <div className="flex gap-2">
          <a
            href={`tel:${phoneDigits}`}
            className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
          >
            <Phone size={15} />
            {lang.profile.callBtn} · {profile.phone}
          </a>
          <a
            href={`https://zalo.me/${phoneDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border border-border bg-card hover:bg-accent text-foreground text-sm font-medium rounded-lg px-4 py-2.5 transition-colors"
          >
            <ZaloIcon />
            {lang.profile.zaloBtn}
          </a>
        </div>
      )}
    </div>
  )
}
