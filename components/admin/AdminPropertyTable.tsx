'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Property, PROPERTY_TYPE_LABELS, PROPERTY_STATUS_LABELS, PropertyType } from '@/lib/types'
import { formatPrice } from '@/lib/format'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
  filters: { q?: string; area?: string; type?: string }
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [q, setQ] = useState(filters.q ?? '')
  const [area, setArea] = useState(filters.area ?? '')
  const [type, setType] = useState(filters.type ?? '')
  const [deleting, setDeleting] = useState<string | null>(null)

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (area) params.set('area', area)
    if (type && type !== 'all') params.set('type', type)
    router.push(`${pathname}?${params.toString()}`)
  }, [q, area, type, router, pathname])

  async function handleDelete(id: string) {
    if (!confirm(`Xóa BĐS ${id}? Hành động này không thể hoàn tác.`)) return
    setDeleting(id)
    const supabase = createClient()
    const { error } = await supabase.from('properties').delete().eq('id', id)
    if (error) {
      toast.error('Xóa thất bại: ' + error.message)
    } else {
      toast.success(`Đã xóa ${id}`)
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
            placeholder="Tìm theo ID hoặc tên..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            className="flex-1"
          />
          <Input
            placeholder="Khu vực..."
            value={area}
            onChange={(e) => setArea(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            className="flex-1"
          />
          <Select value={type || 'all'} onValueChange={(v) => setType(v === 'all' ? '' : v as string)}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Loại BĐS" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="biet_thu">Biệt thự</SelectItem>
              <SelectItem value="can_ho_dich_vu">Căn hộ dịch vụ</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={applyFilters} className="shrink-0">
            <Search size={16} className="mr-1.5" />
            Lọc
          </Button>
        </div>
      </div>

      {/* Table / Cards */}
      {properties.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center text-muted-foreground">
          Không có BĐS nào. <Link href="/admin/new" className="text-primary underline">Thêm mới</Link>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-muted-foreground text-xs uppercase tracking-wide">
                  <th className="px-4 py-3 text-left">Ảnh</th>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Tên BĐS</th>
                  <th className="px-4 py-3 text-left">Loại</th>
                  <th className="px-4 py-3 text-left">Khu vực</th>
                  <th className="px-4 py-3 text-left">Giá</th>
                  <th className="px-4 py-3 text-left">Trạng thái</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
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
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No img</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-primary font-medium">{p.id}</td>
                    <td className="px-4 py-3 font-medium text-foreground max-w-[200px] truncate">{p.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{PROPERTY_TYPE_LABELS[p.type]}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.area}</td>
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
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No img</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs text-primary font-medium">{p.id}</p>
                  <p className="font-medium text-foreground truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{PROPERTY_TYPE_LABELS[p.type]} · {p.area}</p>
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
