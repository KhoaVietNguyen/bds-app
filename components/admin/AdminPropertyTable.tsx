'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Property, PROPERTY_TYPE_LABELS, PROPERTY_STATUS_LABELS, PropertyType, CityKey } from '@/lib/types'
import { formatPrice } from '@/lib/format'
import { formatLocation, CITY_OPTIONS, DISTRICTS } from '@/lib/locations'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { lang } from '@/lib/lang'
import { Pencil, Trash2, Search, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

const STATUS_COLORS = {
  active: 'bg-green-500/20 text-green-600 dark:text-green-400',
  sold: 'bg-red-500/20 text-red-600 dark:text-red-400',
  rented: 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
}

export default function AdminPropertyTable({
  properties,
  filters,
}: {
  properties: Property[]
  filters: { q?: string; city?: string; district?: string; type?: string; days?: string }
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [q, setQ] = useState(filters.q ?? '')
  const [city, setCity] = useState(filters.city ?? '')
  const [district, setDistrict] = useState(filters.district ?? '')
  const [type, setType] = useState(filters.type ?? '')
  const [days, setDays] = useState(filters.days ?? '')
  const [deleting, setDeleting] = useState<string | null>(null)

  function handleCityChange(val: string | null) {
    const newCity = !val || val === 'all' ? '' : val
    setCity(newCity)
    setDistrict('')
  }

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (city) params.set('city', city)
    if (district) params.set('district', district)
    if (type && type !== 'all') params.set('type', type)
    if (days && days !== 'all') params.set('days', days)
    router.push(`${pathname}?${params.toString()}`)
  }, [q, city, district, type, days, router, pathname])

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
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder={lang.search.queryPlaceholder}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            className="flex-1"
          />
          <Select value={city || 'all'} onValueChange={handleCityChange}>
            <SelectTrigger className="w-full sm:w-44">
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
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder={lang.search.districtLabel} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{lang.search.districtAll}</SelectItem>
              {city && DISTRICTS[city as CityKey]?.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={type || 'all'} onValueChange={(v) => setType(v === 'all' ? '' : v as string)}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder={lang.search.typeLabel} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{lang.search.typeAllLong}</SelectItem>
              <SelectItem value="villa">{lang.propertyTypes.villa}</SelectItem>
              <SelectItem value="biet_thu">{lang.propertyTypes.biet_thu}</SelectItem>
              <SelectItem value="can_ho_dich_vu">{lang.propertyTypes.can_ho_dich_vu}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={days || 'all'} onValueChange={(v) => setDays(v === 'all' ? '' : (v ?? ''))}>
            <SelectTrigger className="w-full sm:w-36">
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
          <Button onClick={applyFilters} className="shrink-0">
            <Search size={16} className="mr-1.5" />
            {lang.search.filterBtn}
          </Button>
        </div>
      </div>

      {/* Table / Cards */}
      {properties.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center text-muted-foreground">
          {lang.admin.table.empty} <Link href="/admin/new" className="text-primary underline">{lang.admin.addBtn}</Link>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
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
                        <Link href={`/bds/${p.id}`} target="_blank">
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
              <div key={p.id} className="p-4 flex gap-3">
                <div className="w-20 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                  {coverImage(p) ? (
                    <Image src={coverImage(p)!} alt={p.name} width={80} height={64} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">{lang.property.noImage}</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs text-primary font-medium">{p.id}</p>
                  <p className="font-medium text-foreground truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{PROPERTY_TYPE_LABELS[p.type]} · {formatLocation(p.district, p.city)}</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{formatPrice(p.price)}</p>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <Link href={`/admin/${p.id}/edit`}>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Pencil size={13} />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-red-500 border-red-500/30 hover:bg-red-500/10"
                    onClick={() => handleDelete(p.id)}
                    disabled={deleting === p.id}
                  >
                    <Trash2 size={13} />
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
