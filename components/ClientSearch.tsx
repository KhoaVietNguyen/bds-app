'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, X } from 'lucide-react'

export default function ClientSearch({
  initialQ,
  initialArea,
  initialType,
}: {
  initialQ?: string
  initialArea?: string
  initialType?: string
}) {
  const router = useRouter()
  const [q, setQ] = useState(initialQ ?? '')
  const [area, setArea] = useState(initialArea ?? '')
  const [type, setType] = useState(initialType ?? '')

  const search = useCallback(() => {
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    if (area.trim()) params.set('area', area.trim())
    if (type && type !== 'all') params.set('type', type)
    router.push(`/?${params.toString()}`)
  }, [q, area, type, router])

  const clear = () => {
    setQ('')
    setArea('')
    setType('')
    router.push('/')
  }

  const hasFilters = q || area || (type && type !== 'all')

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && search()}
          placeholder="Tìm theo ID (BDS-00001) hoặc tên..."
          className="bg-background/90 text-foreground placeholder:text-muted-foreground border-0 shadow-lg"
        />
        <Button onClick={search} className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shrink-0">
          <Search size={18} />
        </Button>
      </div>
      <div className="flex gap-2">
        <Input
          value={area}
          onChange={(e) => setArea(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && search()}
          placeholder="Khu vực..."
          className="bg-background/80 text-foreground placeholder:text-muted-foreground border-0"
        />
        <Select value={type || 'all'} onValueChange={(v) => setType(v === 'all' ? '' : v as string)}>
          <SelectTrigger className="bg-background/80 text-foreground border-0 w-48 shrink-0">
            <SelectValue placeholder="Loại BĐS" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="villa">Villa</SelectItem>
            <SelectItem value="biet_thu">Biệt thự</SelectItem>
            <SelectItem value="can_ho_dich_vu">Căn hộ dịch vụ</SelectItem>
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
