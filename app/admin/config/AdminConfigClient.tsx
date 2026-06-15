'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { STATUS_COLOR_CLASSES } from '@/lib/config'
import type { ConfigItem } from '@/lib/config'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Trash2, Plus, Settings2, Pencil, Check, X } from 'lucide-react'
import { revalidateConfig } from './actions'

const COLOR_OPTIONS = [
  { value: 'green',  label: 'Xanh lá' },
  { value: 'blue',   label: 'Xanh dương' },
  { value: 'red',    label: 'Đỏ' },
  { value: 'orange', label: 'Cam' },
  { value: 'purple', label: 'Tím' },
  { value: 'yellow', label: 'Vàng' },
  { value: 'cyan',   label: 'Cyan' },
  { value: 'pink',   label: 'Hồng' },
  { value: 'gray',   label: 'Xám' },
]

function ColorPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-1 flex-wrap mt-1.5">
      {COLOR_OPTIONS.map((c) => (
        <button key={c.value} type="button" onClick={() => onChange(c.value)}
          className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${STATUS_COLOR_CLASSES[c.value]} ${value === c.value ? 'ring-2 ring-offset-1 ring-current' : 'opacity-50'}`}>
          {c.label}
        </button>
      ))}
    </div>
  )
}

function ItemRow({ item, category, onRefresh }: {
  item: ConfigItem
  category: 'type' | 'status'
  onRefresh: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [label, setLabel] = useState(item.label)
  const [color, setColor] = useState(item.color ?? 'gray')
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    if (!label.trim()) return
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('property_config')
      .update({ label: label.trim(), color })
      .eq('category', category).eq('value', item.value)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Đã lưu')
      setEditing(false)
      await revalidateConfig()
      onRefresh()
    }
    setLoading(false)
  }

  async function handleDelete() {
    if (!confirm(`Xóa "${item.label}"?`)) return
    const supabase = createClient()
    const { error } = await supabase.from('property_config')
      .delete().eq('category', category).eq('value', item.value)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success(`Đã xóa "${item.label}"`)
      await revalidateConfig()
      onRefresh()
    }
  }

  if (editing) {
    return (
      <div className="rounded-lg border border-orange-300 bg-orange-50 dark:bg-orange-950/20 p-2.5 space-y-2">
        <Input className="text-sm h-7" value={label} onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()} autoFocus />
        <ColorPicker value={color} onChange={setColor} />
        <div className="flex gap-1.5 pt-0.5">
          <Button size="sm" className="h-7 gap-1 bg-orange-500 hover:bg-orange-600 text-white text-xs flex-1"
            onClick={handleSave} disabled={loading || !label.trim()}>
            <Check size={12} />Lưu
          </Button>
          <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs"
            onClick={() => { setEditing(false); setLabel(item.label); setColor(item.color ?? 'gray') }}>
            <X size={12} />Hủy
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 group">
      {item.color && (
        <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_COLOR_CLASSES[item.color]?.split(' ')[0]}`} />
      )}
      <span className="flex-1 text-sm text-foreground">{item.label}</span>
      <span className="text-xs text-muted-foreground font-mono">{item.value}</span>
      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-orange-500 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
        onClick={() => setEditing(true)}>
        <Pencil size={12} />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-red-500 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
        onClick={handleDelete}>
        <Trash2 size={13} />
      </Button>
    </div>
  )
}

function Section({ title, items, category, onRefresh }: {
  title: string
  items: ConfigItem[]
  category: 'type' | 'status'
  onRefresh: () => void
}) {
  const [label, setLabel] = useState('')
  const [color, setColor] = useState('green')
  const [loading, setLoading] = useState(false)

  async function handleAdd() {
    if (!label.trim()) return
    const value = label.trim()
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('property_config').insert({
      category, value, label: label.trim(),
      color,
      order_index: items.length,
    })
    if (error) {
      toast.error((error as any).code === '23505' ? `"${label.trim()}" đã tồn tại` : error.message)
    } else {
      toast.success(`Đã thêm "${label.trim()}"`)
      setLabel('')
      await revalidateConfig()
      onRefresh()
    }
    setLoading(false)
  }

  return (
    <div className="bg-card rounded-xl border border-border p-5 space-y-4">
      <h2 className="font-semibold text-foreground">{title}</h2>
      <div className="space-y-2">
        {items.map((item) => (
          <ItemRow key={item.value} item={item} category={category} onRefresh={onRefresh} />
        ))}
      </div>
      <div className="pt-3 border-t border-border space-y-2">
        <Input className="text-sm h-8" placeholder="Tên hiển thị..."
          value={label} onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()} />
        <ColorPicker value={color} onChange={setColor} />
        <Button size="sm" className="w-full h-8 bg-orange-500 hover:bg-orange-600 text-white gap-1.5 mt-1"
          onClick={handleAdd} disabled={loading || !label.trim()}>
          <Plus size={14} />Thêm
        </Button>
      </div>
    </div>
  )
}

export default function AdminConfigClient({ initialTypes, initialStatuses }: {
  initialTypes: ConfigItem[]
  initialStatuses: ConfigItem[]
}) {
  const router = useRouter()
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-orange-500 text-white p-2 rounded-lg"><Settings2 size={18} /></div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Cấu hình</h1>
          <p className="text-xs text-muted-foreground">Quản lý loại BĐS và trạng thái</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Section title="Loại BĐS" items={initialTypes} category="type" onRefresh={() => router.refresh()} />
        <Section title="Trạng thái" items={initialStatuses} category="status" onRefresh={() => router.refresh()} />
      </div>
    </div>
  )
}
