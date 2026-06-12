import Image from 'next/image'
import { Profile } from '@/lib/types'
import { lang } from '@/lib/lang'
import { Phone, UserRound } from 'lucide-react'
import { SiZalo } from 'react-icons/si'

export function ZaloIcon({ size = 18 }: { size?: number }) {
  return (
    <span
      style={{ width: size, height: size }}
      className="bg-[#0068FF] rounded-sm flex items-center justify-center text-white shrink-0"
    >
      <SiZalo size={size * 0.65} />
    </span>
  )
}

/** Hàng thông tin sale + actions, dùng trong footer cố định của trang detail */
export default function AgentCard({ profile, actions }: { profile: Profile | null; actions?: React.ReactNode }) {
  const hasProfile = !!profile && (!!profile.name || !!profile.phone)
  const phoneDigits = profile?.phone?.replace(/\D/g, '') ?? ''

  return (
    <div className="flex items-center gap-2.5">
      {hasProfile && (
        <>
          {/* Avatar */}
          <div className="relative h-10 w-10 rounded-full overflow-hidden bg-muted border border-border shrink-0">
            {profile!.avatar_url ? (
              <Image src={profile!.avatar_url} alt={profile!.name} fill className="object-cover" sizes="40px" />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <UserRound size={20} />
              </span>
            )}
          </div>

          {/* Tên */}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-muted-foreground leading-tight">{lang.profile.agentTitle}</p>
            <p className="text-sm font-bold text-foreground truncate leading-snug">{profile!.name}</p>
          </div>
        </>
      )}

      {/* Share / Save */}
      <div className={`flex items-center gap-2 shrink-0 ${hasProfile ? '' : 'flex-1 justify-end'}`}>
        {actions}
      </div>

      {/* Liên hệ */}
      {phoneDigits && (
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`tel:${phoneDigits}`}
            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-sm px-3 h-10 transition-colors"
          >
            <Phone size={14} />
            <span className="hidden sm:inline">{profile!.phone}</span>
            <span className="sm:hidden">{lang.profile.callBtn}</span>
          </a>
          <a
            href={`https://zalo.me/${phoneDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={lang.profile.zaloBtn}
          >
            <ZaloIcon size={40} />
          </a>
        </div>
      )}
    </div>
  )
}
