'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Property, PROPERTY_TYPE_LABELS, PROPERTY_STATUS_LABELS, PropertyType, PropertyStatus, CityKey } from '@/lib/types'
import { formatPrice } from '@/lib/format'
import { formatLocation, CITY_OPTIONS, CITY_LABELS, DISTRICTS } from '@/lib/locations'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { lang } from '@/lib/lang'
import ThemeToggle from '@/components/ThemeToggle'
import { cn } from '@/lib/utils'
import { Pencil, Trash2, Search, ExternalLink, SlidersHorizontal, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const STATUS_COLORS = {
  selling: 'bg-green-500/20 text-green-600 dark:text-green-400',
  renting: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
  sold: 'bg-red-500/20 text-red-600 dark:text-red-400',
  rented: 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
  vacant: 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
}

export default function AdminPropertyTable({
  properties,
  filters,
}: {
  properties: Property[]
  filters: { q?: string; city?: string; district?: string; type?: string; status?: string; days?: string }
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [q, setQ] = useState(filters.q ?? '')
  const [city, setCity] = useState(filters.city ?? '')
  const [district, setDistrict] = useState(filters.district ?? '')
  const [type, setType] = useState(filters.type ?? '')
  const [status, setStatus] = useState(filters.status ?? '')
  const [days, setDays] = useState(filters.days ?? '')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  // Đang mở panel filter mà scroll thật sự (quá 24px) thì tự đóng
  useEffect(() => {
    if (!showFilters) return
    const startY = window.scrollY
    const onScroll = () => {
      if (Math.abs(window.scrollY - startY) > 24) setShowFilters(false)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [showFilters])

  const activeFilterCount = [city, district, type, status, days].filter(v => v && v !== 'all').length

  function handleCityChange(val: string | null) {
    const newCity = !val || val === 'all' ? '' : val
    setCity(newCity)
    setDistrict('')
  }

  const [isPending, startTransition] = useTransition()

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (city) params.set('city', city)
    if (district) params.set('district', district)
    if (type && type !== 'all') params.set('type', type)
    if (status && status !== 'all') params.set('status', status)
    if (days && days !== 'all') params.set('days', days)
    startTransition(() => router.push(`${pathname}?${params.toString()}`))
    setShowFilters(false)
  }, [q, city, district, type, days, router, pathname])

  const clearFilters = useCallback(() => {
    setQ(''); setCity(''); setDistrict(''); setType(''); setStatus(''); setDays('')
    startTransition(() => router.push(pathname))
    setShowFilters(false)
  }, [router, pathname])

  async function handleDelete(id: string) {
    if (!confirm(lang.admin.table.deleteConfirm(id))) return
    setDeleting(id)
    const supabase = createClient()
    const { error } = await supabase.from('properties').delete().eq('id', id)
    if (error) {
      toast.error(lang.admin.table.deleteError + ' ' + error.message)
    } else {
      toast.success(lang.admin.table.deleteSuccess(id))
      router.refresh()
    }
    setDeleting(null)
  }

  const coverImage = (p: Property) =>
    p.property_images?.sort((a, b) => a.order_index - b.order_index)[0]?.url

  return (
    <div className="space-y-3">
      {/* Filters — sticky trên cùng khi scroll */}
      <div className="sticky top-0 z-20 bg-card/50 backdrop-blur-md overflow-hidden -mx-4 -mt-4 px-1 pt-1 border-b border-border md:mx-0 md:mt-0 md:px-0 md:pt-0 md:top-4 md:rounded-xl md:border md:bg-card/90">
        {/* Search row — always visible */}
        <div className="relative space-y-1 text-center items-center content-center py-1">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 md:hidden">
            <ThemeToggle />
          </span>
          <h1 className="text-2xl font-bold text-foreground">{lang.admin.pageTitle}</h1>
        </div>
        <div className='flex gap-2 p-1 px-3'>
          <Input
            placeholder={lang.search.queryPlaceholder}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            className="flex-1 h-8 text-xs md:h-9 md:text-sm"
          />
          {/* Mobile: search button — ẩn khi panel filter đang mở (panel có nút Lọc riêng) */}
          {!showFilters && (
            <Button
              size="icon"
              onClick={applyFilters}
              disabled={isPending}
              className="md:hidden h-8 w-8 shrink-0 bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isPending ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            </Button>
          )}
          {/* Mobile: filter toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowFilters(v => !v)}
            className={`md:hidden h-8 w-8 shrink-0 border border-border relative ${showFilters ? 'bg-accent text-foreground' : 'text-muted-foreground'}`}
          >
            <SlidersHorizontal size={14} />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </Button>
          {/* Desktop: search button */}
          <Button onClick={applyFilters} disabled={isPending} className="hidden md:flex h-9 shrink-0 bg-orange-500 hover:bg-orange-600">
            {isPending ? <Loader2 size={15} className="mr-1.5 animate-spin" /> : <Search size={15} className="mr-1.5" />}
            {lang.search.filterBtn}
          </Button>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="icon" onClick={clearFilters} className="hidden md:flex h-9 w-9 text-muted-foreground hover:text-foreground border border-border">
              <X size={15} />
            </Button>
          )}
          
        </div>

        <p className="pl-3 pb-2">
          <span className={`inline-block text-xs px-2 py-0.5 rounded-md font-bold ${(properties?.length ?? 0) > 0 ? STATUS_COLORS.selling : STATUS_COLORS.sold}`}>
            {lang.admin.propertyCount(properties?.length ?? 0)}
          </span>
        </p>

        {/* Desktop: all filters in one row */}
        <div className="hidden md:flex gap-2 px-3 pb-3 items-end">
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <span className="text-[10px] md:text-xs text-muted-foreground px-1">{lang.search.cityLabel}</span>
            <Select value={city || 'all'} onValueChange={handleCityChange}>
              <SelectTrigger className="w-full h-8 text-xs md:h-9 md:text-sm">
                {city && city !== 'all' ? CITY_LABELS[city as CityKey] : 'Tất cả'}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {CITY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <span className="text-[10px] md:text-xs text-muted-foreground px-1">{lang.search.districtLabel}</span>
            <Select value={district || 'all'} onValueChange={(v) => setDistrict(v === 'all' ? '' : (v ?? ''))} disabled={!city}>
              <SelectTrigger className="w-full h-8 text-xs md:h-9 md:text-sm">
                {district && district !== 'all' ? district : 'Tất cả'}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {city && DISTRICTS[city as CityKey]?.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <span className="text-[10px] md:text-xs text-muted-foreground px-1">{lang.search.typeLabel}</span>
            <Select value={type || 'all'} onValueChange={(v) => setType(v === 'all' ? '' : v as string)}>
              <SelectTrigger className="w-full h-8 text-xs md:h-9 md:text-sm">
                {type && type !== 'all' ? ({ villa: lang.propertyTypes.villa, biet_thu: lang.propertyTypes.biet_thu, can_ho_dich_vu: lang.propertyTypes.can_ho_dich_vu, chung_cu: lang.propertyTypes.chung_cu } as Record<string, string>)[type] : 'Tất cả'}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="villa">{lang.propertyTypes.villa}</SelectItem>
                <SelectItem value="biet_thu">{lang.propertyTypes.biet_thu}</SelectItem>
                <SelectItem value="can_ho_dich_vu">{lang.propertyTypes.can_ho_dich_vu}</SelectItem>
                <SelectItem value="chung_cu">{lang.propertyTypes.chung_cu}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <span className="text-[10px] md:text-xs text-muted-foreground px-1">{lang.search.statusLabel}</span>
            <Select value={status || 'all'} onValueChange={(v) => setStatus(v === 'all' ? '' : v)}>
              <SelectTrigger className="w-full h-8 text-xs md:h-9 md:text-sm">
                {status && status !== 'all' ? lang.propertyStatuses[status as PropertyStatus] : 'Tất cả'}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="selling">{lang.propertyStatuses.selling}</SelectItem>
                <SelectItem value="renting">{lang.propertyStatuses.renting}</SelectItem>
                <SelectItem value="sold">{lang.propertyStatuses.sold}</SelectItem>
                <SelectItem value="rented">{lang.propertyStatuses.rented}</SelectItem>
                <SelectItem value="vacant">{lang.propertyStatuses.vacant}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <span className="text-[10px] md:text-xs text-muted-foreground px-1">{lang.search.dateLabel}</span>
            <Select value={days || 'all'} onValueChange={(v) => setDays(v === 'all' ? '' : (v ?? ''))}>
              <SelectTrigger className="w-full h-8 text-xs md:h-9 md:text-sm">
                {days && days !== 'all' ? ({ '7': lang.search.date7, '30': lang.search.date30, '90': lang.search.date90, '180': lang.search.date180 } as Record<string, string>)[days] : 'Tất cả'}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="7">{lang.search.date7}</SelectItem>
                <SelectItem value="30">{lang.search.date30}</SelectItem>
                <SelectItem value="90">{lang.search.date90}</SelectItem>
                <SelectItem value="180">{lang.search.date180}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mobile: collapsible filter panel */}
        {showFilters && (
          <div className="md:hidden border-t border-border p-3 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] md:text-xs text-muted-foreground px-1">{lang.search.cityLabel}</span>
                <Select value={city || 'all'} onValueChange={handleCityChange}>
                  <SelectTrigger className="w-full h-8 text-xs md:h-9 md:text-sm">
                    {city && city !== 'all' ? CITY_LABELS[city as CityKey] : 'Tất cả'}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {CITY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] md:text-xs text-muted-foreground px-1">{lang.search.typeLabel}</span>
                <Select value={type || 'all'} onValueChange={(v) => setType(v === 'all' ? '' : v as string)}>
                  <SelectTrigger className="w-full h-8 text-xs md:h-9 md:text-sm">
                    {type && type !== 'all' ? ({ villa: lang.propertyTypes.villa, biet_thu: lang.propertyTypes.biet_thu, can_ho_dich_vu: lang.propertyTypes.can_ho_dich_vu, chung_cu: lang.propertyTypes.chung_cu } as Record<string, string>)[type] : 'Tất cả'}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="villa">{lang.propertyTypes.villa}</SelectItem>
                    <SelectItem value="biet_thu">{lang.propertyTypes.biet_thu}</SelectItem>
                    <SelectItem value="can_ho_dich_vu">{lang.propertyTypes.can_ho_dich_vu}</SelectItem>
                    <SelectItem value="chung_cu">{lang.propertyTypes.chung_cu}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] md:text-xs text-muted-foreground px-1">{lang.search.districtLabel}</span>
                <Select value={district || 'all'} onValueChange={(v) => setDistrict(v === 'all' ? '' : (v ?? ''))} disabled={!city}>
                  <SelectTrigger className="w-full h-8 text-xs md:h-9 md:text-sm">
                    {district && district !== 'all' ? district : 'Tất cả'}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {city && DISTRICTS[city as CityKey]?.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] md:text-xs text-muted-foreground px-1">{lang.search.statusLabel}</span>
                <Select value={status || 'all'} onValueChange={(v) => setStatus(v === 'all' ? '' : v)}>
                  <SelectTrigger className="w-full h-8 text-xs md:h-9 md:text-sm">
                    {status && status !== 'all' ? lang.propertyStatuses[status as PropertyStatus] : 'Tất cả'}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="selling">{lang.propertyStatuses.selling}</SelectItem>
                    <SelectItem value="renting">{lang.propertyStatuses.renting}</SelectItem>
                    <SelectItem value="sold">{lang.propertyStatuses.sold}</SelectItem>
                    <SelectItem value="rented">{lang.propertyStatuses.rented}</SelectItem>
                    <SelectItem value="vacant">{lang.propertyStatuses.vacant}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-0.5 col-span-2">
                <span className="text-[10px] md:text-xs text-muted-foreground px-1">{lang.search.dateLabel}</span>
                <Select value={days || 'all'} onValueChange={(v) => setDays(v === 'all' ? '' : (v ?? ''))}>
                  <SelectTrigger className="w-full h-8 text-xs md:h-9 md:text-sm">
                    {days && days !== 'all' ? ({ '7': lang.search.date7, '30': lang.search.date30, '90': lang.search.date90, '180': lang.search.date180 } as Record<string, string>)[days] : 'Tất cả'}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="7">{lang.search.date7}</SelectItem>
                    <SelectItem value="30">{lang.search.date30}</SelectItem>
                    <SelectItem value="90">{lang.search.date90}</SelectItem>
                    <SelectItem value="180">{lang.search.date180}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={applyFilters} disabled={isPending} className="flex-1 bg-orange-500 hover:bg-orange-600 h-9">
                {isPending ? <Loader2 size={15} className="mr-1.5 animate-spin" /> : <Search size={15} className="mr-1.5" />}
                {lang.search.filterBtn}
              </Button>
              {activeFilterCount > 0 && (
                <Button variant="ghost" onClick={clearFilters} className="h-9 text-muted-foreground hover:text-foreground border border-border px-3">
                  <X size={15} className="mr-1" />
                  Xóa lọc
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Table / Cards */}
      {properties.length === 0 ? (
        <div className="bg-card/80 backdrop-blur rounded-xl border border-border p-12 text-center text-muted-foreground">
          {lang.admin.table.empty} <Link href="/admin/new" className="text-primary underline">{lang.admin.addBtn}</Link>
        </div>
      ) : (
        <div className="bg-card/80 backdrop-blur rounded-xl border border-border overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-muted-foreground text-xs uppercase tracking-wide">
                  <th className="px-4 py-3 text-left">{lang.admin.table.colImage}</th>
                  <th className="px-4 py-3 text-left">{lang.admin.table.colId}</th>
                  <th className="px-4 py-3 text-left">{lang.admin.table.colName}</th>
                  <th className="px-4 py-3 text-left">{lang.admin.table.colType}</th>
                  <th className="px-4 py-3 text-left">{lang.admin.table.colArea}</th>
                  <th className="px-4 py-3 text-left">{lang.admin.table.colPrice}</th>
                  <th className="px-4 py-3 text-left">{lang.admin.table.colStatus}</th>
                  <th className="px-4 py-3 text-right">{lang.admin.table.colActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {properties.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-14 h-10 rounded-lg overflow-hidden bg-muted">
                        {coverImage(p) ? (
                          <Image src={coverImage(p)!} alt={p.name} width={56} height={40} className="object-cover w-full h-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">{lang.property.noImage}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-primary font-medium">{p.id}</td>
                    <td className="px-4 py-3 font-medium text-foreground max-w-[200px] truncate">{p.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{PROPERTY_TYPE_LABELS[p.type]}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatLocation(p.district, p.city)}</td>
                    <td className="px-4 py-3 text-foreground font-medium">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[p.status]}`}>
                        {PROPERTY_STATUS_LABELS[p.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/bds/${p.id}`} target="_blank" rel="noopener noreferrer" prefetch={false}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                            <ExternalLink size={14} />
                          </Button>
                        </Link>
                        <Link href={`/admin/${p.id}/edit`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                            <Pencil size={14} />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-red-500"
                          onClick={() => handleDelete(p.id)}
                          disabled={deleting === p.id}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-border">
            {properties.map((p) => (
              <div key={p.id} className="p-3">
                <div className="flex gap-3">
                  {/* Image */}
                  <div className="w-24 h-18 rounded-lg overflow-hidden bg-muted shrink-0" style={{ height: '72px' }}>
                    {coverImage(p) ? (
                      <Image src={coverImage(p)!} alt={p.name} width={96} height={72} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">{lang.property.noImage}</div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <p className="font-mono text-xs text-primary font-medium leading-tight">{p.id}</p>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0 ${STATUS_COLORS[p.status]}`}>
                        {PROPERTY_STATUS_LABELS[p.status]}
                      </span>
                    </div>
                    <p className="font-semibold text-foreground text-sm truncate mt-0.5">{p.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{PROPERTY_TYPE_LABELS[p.type]} · {formatLocation(p.district, p.city)}</p>
                    <p className="text-sm font-bold text-primary mt-1">{formatPrice(p.price)}</p>
                  </div>
                </div>
                {/* Action row */}
                <div className="flex gap-2 mt-2.5">
                  <Link href={`/bds/${p.id}`} target="_blank" rel="noopener noreferrer" className="flex-1" prefetch={false}>
                    <Button variant="ghost" size="sm" className="w-full h-8 text-muted-foreground hover:text-foreground border border-border text-xs gap-1.5">
                      <ExternalLink size={13} />
                      Xem
                    </Button>
                  </Link>
                  <Link href={`/admin/${p.id}/edit`} className="flex-1">
                    <Button variant="ghost" size="sm" className="w-full h-8 text-muted-foreground hover:text-foreground border border-border text-xs gap-1.5">
                      <Pencil size={13} />
                      Sửa
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 h-8 text-red-500/80 hover:text-red-500 border border-red-500/20 hover:bg-red-500/10 text-xs gap-1.5"
                    onClick={() => handleDelete(p.id)}
                    disabled={deleting === p.id}
                  >
                    <Trash2 size={13} />
                    Xóa
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
