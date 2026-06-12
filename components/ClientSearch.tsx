'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { lang } from '@/lib/lang'
import { CITY_OPTIONS, DISTRICTS, CityKey } from '@/lib/locations'
import { Search, X } from 'lucide-react'

export default function ClientSearch({
  initialQ,
  initialCity,
  initialDistrict,
  initialType,
  initialDays,
}: {
  initialQ?: string
  initialCity?: string
  initialDistrict?: string
  initialType?: string
  initialDays?: string
}) {
  const router = useRouter()
  const [q, setQ] = useState(initialQ ?? '')
  const [city, setCity] = useState(initialCity ?? '')
  const [district, setDistrict] = useState(initialDistrict ?? '')
  const [type, setType] = useState(initialType ?? '')
  const [days, setDays] = useState(initialDays ?? '')

  const search = useCallback(() => {
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    if (city) params.set('city', city)
    if (district) params.set('district', district)
    if (type && type !== 'all') params.set('type', type)
    if (days && days !== 'all') params.set('days', days)
    router.push(`/?${params.toString()}`)
  }, [q, city, district, type, days, router])

  const clear = () => {
    setQ(''); setCity(''); setDistrict(''); setType(''); setDays('')
    router.push('/')
  }

  const hasFilters = q || city || (type && type !== 'all') || (days && days !== 'all')

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && search()}
          placeholder={lang.search.queryPlaceholder}
          className="bg-background/90 text-foreground placeholder:text-white/80 border-0 shadow-lg"
        />
        <Button onClick={search} className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shrink-0">
          <Search size={18} />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Select value={city || 'all'} onValueChange={(v) => {
          const newCity = !v || v === 'all' ? '' : v
          setCity(newCity)
          setDistrict('')
        }}>
          <SelectTrigger className="bg-background/80 text-foreground border-0 flex-1 min-w-[140px]">
            <SelectValue placeholder={lang.search.cityLabel} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{lang.search.cityAll}</SelectItem>
            {CITY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={district || 'all'} onValueChange={(v) => setDistrict(v === 'all' ? '' : (v ?? ''))} disabled={!city}>
          <SelectTrigger className="bg-background/80 text-foreground border-0 flex-1 min-w-[140px]">
            <SelectValue placeholder={lang.search.districtLabel} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{lang.search.districtAll}</SelectItem>
            {city && DISTRICTS[city as CityKey]?.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={type || 'all'} onValueChange={(v) => setType(v === 'all' ? '' : (v ?? ''))}>
          <SelectTrigger className="bg-background/80 text-foreground border-0 w-36 shrink-0">
            <SelectValue placeholder={lang.search.typeLabel} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{lang.search.typeAll}</SelectItem>
            <SelectItem value="villa">{lang.propertyTypes.villa}</SelectItem>
            <SelectItem value="biet_thu">{lang.propertyTypes.biet_thu}</SelectItem>
            <SelectItem value="can_ho_dich_vu">{lang.propertyTypes.can_ho_dich_vu}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={days || 'all'} onValueChange={(v) => setDays(v === 'all' ? '' : (v ?? ''))}>
          <SelectTrigger className="bg-background/80 text-foreground border-0 w-36 shrink-0">
            <SelectValue placeholder={lang.search.dateLabel} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{lang.search.dateAll}</SelectItem>
            <SelectItem value="7">{lang.search.date7}</SelectItem>
            <SelectItem value="30">{lang.search.date30}</SelectItem>
            <SelectItem value="90">{lang.search.date90}</SelectItem>
            <SelectItem value="180">{lang.search.date180}</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="ghost" onClick={clear} className="text-white hover:bg-white/20 shrink-0">
            <X size={16} />
          </Button>
        )}
      </div>
    </div>
  )
}
