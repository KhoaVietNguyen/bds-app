'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { STATUS_BADGE_BG } from '@/lib/config'
import type { ConfigItem } from '@/lib/config'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Trash2, Plus, Settings2, Pencil, Check, X } from 'lucide-react'
import { revalidateConfig } from './actions'

const COLOR_OPTIONS = [
  { value: 'green',  label: 'Xanh lá',    dot: 'bg-green-500' },
  { value: 'blue',   label: 'Xanh dương', dot: 'bg-blue-500' },
  { value: 'red',    label: 'Đỏ',         dot: 'bg-red-500' },
  { value: 'orange', label: 'Cam',        dot: 'bg-orange-500' },
  { value: 'purple', label: 'Tím',        dot: 'bg-purple-500' },
  { value: 'yellow', label: 'Vàng',       dot: 'bg-yellow-500' },
  { value: 'cyan',   label: 'Cyan',       dot: 'bg-cyan-500' },
  { value: 'pink',   label: 'Hồng',       dot: 'bg-pink-500' },
  { value: 'gray',   label: 'Xám',        dot: 'bg-gray-500' },
]

const isHex = (v: string) => v.startsWith('#')

function ColorPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const customActive = isHex(value)
  return (
    <div className="flex gap-1.5 flex-wrap items-center justify-center pt-1">
      {COLOR_OPTIONS.map((c) => (
        <button key={c.value} type="button" title={c.label} onClick={() => onChange(c.value)}
          className={`w-5 h-5 rounded-full ${c.dot} transition-all ${value === c.value ? 'ring-2 ring-offset-2 ring-foreground/40 scale-110' : 'opacity-50 hover:opacity-80'}`}
        />
      ))}
      <label title="Tuỳ chỉnh màu" className={`relative w-5 h-5 rounded-full overflow-hidden cursor-pointer transition-all ${customActive ? 'ring-2 ring-offset-2 ring-foreground/40 scale-110' : 'opacity-50 hover:opacity-80'}`}
        style={customActive ? { backgroundColor: value } : { background: 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)' }}>
        <input type="color" aria-label="Tuỳ chỉnh màu" value={customActive ? value : '#ff0000'}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
      </label>
    </div>
  )
}

function ItemRow({ item, category, editMode, onRefresh }: {
  item: ConfigItem
  category: 'type' | 'status'
  editMode: boolean
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
        <div className="flex gap-1.5">
          <Input className="text-sm h-7 flex-1" value={label} onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()} autoFocus />
          <Button size="sm" className="h-7 px-2 gap-1 bg-orange-500 hover:bg-orange-600 text-white text-xs"
            onClick={handleSave} disabled={loading || !label.trim()}>
            <Check size={12} />Lưu
          </Button>
          <Button size="sm" variant="ghost" className="h-7 px-2"
            onClick={() => { setEditing(false); setLabel(item.label); setColor(item.color ?? 'gray') }}>
            <X size={12} />
          </Button>
        </div>
        <ColorPicker value={color} onChange={setColor} />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {item.color && (
        isHex(item.color)
          ? <span className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
          : <span className={`w-4 h-4 rounded-full shrink-0 ${STATUS_BADGE_BG[item.color] ?? 'bg-gray-500'}`} />
      )}
      <span className="flex-1 text-sm text-foreground">{item.label}</span>
      <span className="text-xs text-muted-foreground font-mono">{item.value}</span>
      {editMode && (
        <>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-orange-500"
            onClick={() => setEditing(true)}>
            <Pencil size={12} />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-red-500"
            onClick={handleDelete}>
            <Trash2 size={13} />
          </Button>
        </>
      )}
    </div>
  )
}

function Section({ items, category, onRefresh }: {
  items: ConfigItem[]
  category: 'type' | 'status'
  onRefresh: () => void
}) {
  const [editMode, setEditMode] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
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
      setShowAdd(false)
      await revalidateConfig()
      onRefresh()
    }
    setLoading(false)
  }

  return (
    <div className="p-5 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <Button size="sm" variant={showAdd ? 'default' : 'outline'}
          className={`h-7 px-2.5 text-xs gap-1 ${showAdd ? 'bg-orange-500 hover:bg-orange-600 text-white border-0' : ''}`}
          onClick={() => { setShowAdd(v => !v); setEditMode(false) }}>
          <Plus size={11} />
          Thêm mới
        </Button>
        <Button size="sm" variant={editMode ? 'default' : 'outline'}
          className={`h-7 px-2.5 text-xs gap-1 ${editMode ? 'bg-orange-500 hover:bg-orange-600 text-white border-0' : ''}`}
          onClick={() => { setEditMode(v => !v); setShowAdd(false) }}>
          <Pencil size={11} />
          {editMode ? 'Xong' : 'Chỉnh sửa'}
        </Button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {items.map((item) => (
          <ItemRow key={item.value} item={item} category={category} editMode={editMode} onRefresh={onRefresh} />
        ))}
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="pt-3 border-t border-border space-y-2">
          <div className="flex gap-2">
            <Input className="text-sm h-8 flex-1" placeholder="Tên hiển thị..."
              value={label} onChange={(e) => setLabel(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()} autoFocus />
            <Button size="sm" className="h-8 px-3 bg-orange-500 hover:bg-orange-600 text-white gap-1 shrink-0"
              onClick={handleAdd} disabled={loading || !label.trim()}>
              <Check size={14} />Lưu
            </Button>
            <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => { setShowAdd(false); setLabel('') }}>
              <X size={14} />
            </Button>
          </div>
          <ColorPicker value={color} onChange={setColor} />
        </div>
      )}
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
      <div className="space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-1">Loại bất động sản</h2>
          <div className="bg-card/50 backdrop-blur-md rounded-xl border border-border overflow-hidden">
            <Section items={initialTypes} category="type" onRefresh={() => router.refresh()} />
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-1">Trạng thái</h2>
          <div className="bg-card/50 backdrop-blur-md rounded-xl border border-border overflow-hidden">
            <Section items={initialStatuses} category="status" onRefresh={() => router.refresh()} />
          </div>
        </div>
      </div>
    </div>
  )
}
