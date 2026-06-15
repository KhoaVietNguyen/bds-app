'use client'

import { useState, useCallback, useEffect, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { lang } from '@/lib/lang'
import { CITY_OPTIONS, CITY_LABELS, DISTRICTS, CityKey } from '@/lib/locations'
import type { ConfigItem } from '@/lib/config'
import { Search, X, SlidersHorizontal, Loader2 } from 'lucide-react'
import PriceRangeSlider from '@/components/PriceRangeSlider'

export default function ClientSearch({
  initialQ,
  initialCity,
  initialDistrict,
  initialType,
  initialStatus,
  initialDays,
  initialPmin,
  initialPmax,
  initialCur,
  types = [],
  statuses = [],
}: {
  initialQ?: string
  initialCity?: string
  initialDistrict?: string
  initialType?: string
  initialStatus?: string
  initialDays?: string
  initialPmin?: string
  initialPmax?: string
  initialCur?: string
  types?: ConfigItem[]
  statuses?: ConfigItem[]
}) {
  const router = useRouter()
  const typeLabels = Object.fromEntries(types.map(t => [t.value, t.label]))
  const statusLabels = Object.fromEntries(statuses.map(s => [s.value, s.label]))
  const [q, setQ] = useState(initialQ ?? '')
  const [city, setCity] = useState(initialCity ?? '')
  const [district, setDistrict] = useState(initialDistrict ?? '')
  const [type, setType] = useState(initialType ?? '')
  const [status, setStatus] = useState(initialStatus ?? '')
  const [days, setDays] = useState(initialDays ?? '')
  const [pmin, setPmin] = useState(initialPmin ?? '')
  const [pmax, setPmax] = useState(initialPmax ?? '')
  const [cur, setCur] = useState<'vnd' | 'usd'>(initialCur === 'usd' ? 'usd' : 'vnd')
  const [sliderMax, setSliderMax] = useState<number | null>(() => {
    if (initialPmax) return parseFloat(initialPmax) || null
    if (initialPmin) return parseFloat(initialPmin) * 2 || null
    return null
  })
  const [showFilters, setShowFilters] = useState(false)

  const scrollAnchorRef = useRef(0)
  // Đang mở panel filter mà scroll thật sự (quá 24px) thì tự đóng
  useEffect(() => {
    if (!showFilters) return
    scrollAnchorRef.current = window.scrollY
    const onScroll = () => {
      if (Math.abs(window.scrollY - scrollAnchorRef.current) > 24) setShowFilters(false)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [showFilters])
  // Re-anchor sau khi panel mở rộng (slider xuất hiện làm trang bị đẩy)
  useEffect(() => {
    if (showFilters) scrollAnchorRef.current = window.scrollY
  }, [sliderMax])

  const activeFilterCount = [city, district, type, status, days, pmin, pmax].filter(v => v && v !== 'all').length + (sliderMax ? 1 : 0)

  const [isPending, startTransition] = useTransition()

  const search = useCallback(() => {
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    if (city) params.set('city', city)
    if (district) params.set('district', district)
    if (type && type !== 'all') params.set('type', type)
    if (status && status !== 'all') params.set('status', status)
    if (days && days !== 'all') params.set('days', days)
    const effectivePmax = pmax || (sliderMax ? String(sliderMax) : '')
    if (pmin) params.set('pmin', pmin)
    if (effectivePmax) params.set('pmax', effectivePmax)
    if ((pmin || effectivePmax) && cur === 'usd') params.set('cur', 'usd')
    startTransition(() => router.push(`/?${params.toString()}`))
    setShowFilters(false)
  }, [q, city, district, type, days, pmin, pmax, cur, sliderMax, router])

  const clear = () => {
    setQ(''); setCity(''); setDistrict(''); setType(''); setStatus(''); setDays('')
    setPmin(''); setPmax(''); setCur('vnd'); setSliderMax(null)
    startTransition(() => router.push('/'))
    setShowFilters(false)
  }

  const citySelect = (
    <Select value={city || 'all'} onValueChange={(v) => {
      const newCity = !v || v === 'all' ? '' : v
      setCity(newCity)
      setDistrict('')
    }}>
      <SelectTrigger className="bg-card/60 backdrop-blur border-border w-full h-8 text-xs md:h-9 md:text-sm">
        {city && city !== 'all' ? CITY_LABELS[city as CityKey] : 'Tất cả'}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tất cả</SelectItem>
        {CITY_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )

  const districtSelect = (
    <Select value={district || 'all'} onValueChange={(v) => setDistrict(v === 'all' ? '' : (v ?? ''))} disabled={!city}>
      <SelectTrigger className="bg-card/60 backdrop-blur border-border w-full h-8 text-xs md:h-9 md:text-sm">
        {district && district !== 'all' ? district : 'Tất cả'}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tất cả</SelectItem>
        {city && DISTRICTS[city as CityKey]?.map((d) => (
          <SelectItem key={d} value={d}>{d}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )

  const typeSelect = (
    <Select value={type || 'all'} onValueChange={(v) => setType(v === 'all' ? '' : (v ?? ''))}>
      <SelectTrigger className="bg-card/60 backdrop-blur border-border w-full h-8 text-xs md:h-9 md:text-sm">
        {type && type !== 'all' ? (typeLabels[type] ?? type) : 'Tất cả'}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tất cả</SelectItem>
        {types.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
      </SelectContent>
    </Select>
  )

  const statusSelect = (
    <Select value={status || 'all'} onValueChange={(v) => setStatus(v === 'all' ? '' : (v ?? ''))}>
      <SelectTrigger className="bg-card/60 backdrop-blur border-border w-full h-8 text-xs md:h-9 md:text-sm">
        {status && status !== 'all' ? (statusLabels[status] ?? status) : lang.search.statusAll}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{lang.search.statusAll}</SelectItem>
        {statuses.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
      </SelectContent>
    </Select>
  )

  const daysSelect = (
    <Select value={days || 'all'} onValueChange={(v) => setDays(v === 'all' ? '' : (v ?? ''))}>
      <SelectTrigger className="bg-card/60 backdrop-blur border-border w-full h-8 text-xs md:h-9 md:text-sm">
        {days && days !== 'all' ? ({ '7': lang.search.date7, '30': lang.search.date30, '90': lang.search.date90, '180': lang.search.date180 } as Record<string,string>)[days] : 'Tất cả'}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tất cả</SelectItem>
        <SelectItem value="7">{lang.search.date7}</SelectItem>
        <SelectItem value="30">{lang.search.date30}</SelectItem>
        <SelectItem value="90">{lang.search.date90}</SelectItem>
        <SelectItem value="180">{lang.search.date180}</SelectItem>
      </SelectContent>
    </Select>
  )

  const priceFilter = (
    <PriceRangeSlider
      pmin={pmin} pmax={pmax} cur={cur} sliderMax={sliderMax}
      onPminChange={setPmin} onPmaxChange={setPmax} onCurChange={setCur} onSliderMaxChange={setSliderMax}
    />
  )

  const label = (text: string) => (
    <span className="text-[10px] md:text-xs text-muted-foreground px-1 text-left">{text}</span>
  )

  return (
    <div>
      {/* Search row */}
      <div className="flex gap-2">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && search()}
          placeholder={lang.search.queryPlaceholder}
          className="flex-1 bg-card/60 backdrop-blur border-border shadow-lg h-8 text-xs md:h-9 md:text-sm"
        />
        {/* Mobile: search button — ẩn khi panel filter mở */}
        {!showFilters && (
          <Button
            size="icon"
            onClick={search}
            disabled={isPending}
            className="md:hidden h-8 w-8 shrink-0 bg-orange-500 hover:bg-orange-600 text-white shadow-lg"
          >
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
          </Button>
        )}
        {/* Mobile: filter toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowFilters(v => !v)}
          className={`md:hidden h-8 w-8 shrink-0 border border-border bg-card/60 backdrop-blur relative ${showFilters ? 'bg-accent text-foreground' : 'text-muted-foreground'}`}
        >
          <SlidersHorizontal size={14} />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </Button>
        {/* Desktop: search button */}
        <Button onClick={search} disabled={isPending} className="hidden md:flex h-9 shrink-0 bg-orange-500 hover:bg-orange-600 text-white shadow-lg">
          {isPending ? <Loader2 size={15} className="mr-1.5 animate-spin" /> : <Search size={15} className="mr-1.5" />}
          {lang.search.filterBtn}
        </Button>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="icon" onClick={clear} className="hidden md:flex h-9 w-9 text-muted-foreground hover:text-foreground border border-border bg-card/60 backdrop-blur">
            <X size={15} />
          </Button>
        )}
      </div>

      {/* Desktop: filters row 1 */}
      <div className="hidden md:flex gap-2 items-end mt-3">
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">{label(lang.search.cityLabel)}{citySelect}</div>
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">{label(lang.search.districtLabel)}{districtSelect}</div>
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">{label(lang.search.typeLabel)}{typeSelect}</div>
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">{label(lang.search.statusLabel)}{statusSelect}</div>
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">{label(lang.search.dateLabel)}{daysSelect}</div>
      </div>
      {/* Desktop: filter row 2 - price */}
      <div className="hidden md:flex mt-2">
        {priceFilter}
      </div>

      {/* Mobile: collapsible filter panel */}
      {showFilters && (
        <div className="md:hidden bg-card/60 backdrop-blur rounded-xl border border-border p-3 space-y-3 mt-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-0.5">{label(lang.search.cityLabel)}{citySelect}</div>
            <div className="flex flex-col gap-0.5">{label(lang.search.typeLabel)}{typeSelect}</div>
            <div className="flex flex-col gap-0.5">{label(lang.search.districtLabel)}{districtSelect}</div>
            <div className="flex flex-col gap-0.5">{label(lang.search.statusLabel)}{statusSelect}</div>
            <div className="flex flex-col gap-0.5 col-span-2">{label(lang.search.dateLabel)}{daysSelect}</div>
          </div>
          {priceFilter}
          <div className="flex gap-2">
            <Button onClick={search} disabled={isPending} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white h-8">
              {isPending ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <Search size={14} className="mr-1.5" />}
              {lang.search.filterBtn}
            </Button>
            {activeFilterCount > 0 && (
              <Button variant="ghost" onClick={clear} className="h-8 text-muted-foreground hover:text-foreground border border-border px-3">
                <X size={14} className="mr-1" />
                Xóa lọc
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
