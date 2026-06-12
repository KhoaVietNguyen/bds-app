import { createClient } from '@/lib/supabase/server'
import ProfileForm from '@/components/admin/ProfileForm'
import { lang } from '@/lib/lang'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: profile } = await supabase.from('profile').select('*').eq('id', 1).single()

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="sticky top-0 z-20 bg-card/50 backdrop-blur-md -mx-4 -mt-4 px-4 py-3 border-b border-border flex items-center md:mx-0 md:mt-0 md:rounded-xl md:border md:bg-card/90 md:top-4">
        <h1 className="text-lg md:text-2xl font-bold text-foreground flex-1 text-center">{lang.profile.pageTitle}</h1>
      </div>
      <ProfileForm profile={profile} />
    </div>
  )
}
