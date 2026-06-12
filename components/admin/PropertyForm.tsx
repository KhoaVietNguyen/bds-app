'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import imageCompression from 'browser-image-compression'
import { createClient } from '@/lib/supabase/client'
import { Property, PropertyImage, PropertyType, PropertyStatus, CityKey, PROPERTY_TYPE_LABELS, PROPERTY_STATUS_LABELS } from '@/lib/types'
import { CITY_OPTIONS, CITY_LABELS, DISTRICTS } from '@/lib/locations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { lang } from '@/lib/lang'
import { Loader2, Upload, X, GripVertical } from 'lucide-react'
import { toast } from 'sonner'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.5,        // 500 KB
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: 'image/webp',
}

type ImgItem =
  | { kind: 'existing'; id: string; url: string }
  | { kind: 'new'; id: string; file: File; preview: string }

function SortableImage({ item, index, onRemove }: { item: ImgItem; index: number; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className={`relative aspect-square rounded-lg overflow-hidden bg-muted touch-none cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-60 ring-2 ring-primary z-10' : ''
      } ${item.kind === 'new' ? 'border-2 border-primary' : ''}`}
    >
      <Image
        src={item.kind === 'existing' ? item.url : item.preview}
        alt=""
        fill
        className="object-cover pointer-events-none select-none"
        sizes="120px"
        draggable={false}
      />
      <span className="absolute top-1 left-1 bg-black/60 text-white text-xs font-medium px-1.5 h-5 rounded-full flex items-center justify-center">
        {index === 0 ? 'Bìa' : index + 1}
      </span>
      <button
        type="button"
        onClick={onRemove}
        onPointerDown={(e) => e.stopPropagation()}
        aria-label="Xóa ảnh"
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
      >
        <X size={12} />
      </button>
      {item.kind === 'new' && (
        <span className="absolute bottom-1 left-1 bg-primary text-white text-xs px-1 rounded">{lang.form.newBadge}</span>
      )}
      <span className="absolute bottom-1 right-1 text-white/80 bg-black/40 rounded p-0.5">
        <GripVertical size={12} />
      </span>
    </div>
  )
}

interface Props {
  property?: Property
  existingImages?: PropertyImage[]
}

export default function PropertyForm({ property, existingImages = [] }: Props) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [name, setName] = useState(property?.name ?? '')
  const [type, setType] = useState<PropertyType>(property?.type ?? 'villa')
  const [city, setCity] = useState<CityKey>(property?.city ?? 'ho_chi_minh')
  const [district, setDistrict] = useState(property?.district ?? '')
  const [address, setAddress] = useState(property?.address ?? '')
  const [price, setPrice] = useState(property?.price?.toString() ?? '')
  const [areaSqm, setAreaSqm] = useState(property?.area_sqm?.toString() ?? '')
  const [bedrooms, setBedrooms] = useState(property?.bedrooms?.toString() ?? '')
  const [description, setDescription] = useState(property?.description ?? '')
  const [status, setStatus] = useState<PropertyStatus>(property?.status ?? 'selling')

  const [items, setItems] = useState<ImgItem[]>(
    existingImages.map((img) => ({ kind: 'existing' as const, id: img.id, url: img.url }))
  )
  const [uploadProgress, setUploadProgress] = useState(0)
  const [compressing, setCompressing] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setItems((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id)
      const newIndex = prev.findIndex((i) => i.id === over.id)
      return arrayMove(prev, oldIndex, newIndex)
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (files.length === 0) return

    setCompressing(true)
    try {
      const compressed: ImgItem[] = await Promise.all(
        files.map(async (file) => {
          const compressedFile = await imageCompression(file, COMPRESSION_OPTIONS)
          return {
            kind: 'new' as const,
            id: crypto.randomUUID(),
            file: compressedFile,
            preview: URL.createObjectURL(compressedFile),
          }
        })
      )
      setItems((prev) => [...prev, ...compressed])
    } catch {
      toast.error(lang.form.errorCompress)
    } finally {
      setCompressing(false)
    }
  }

  const removeItem = (id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id)
      if (item?.kind === 'new') URL.revokeObjectURL(item.preview)
      return prev.filter((i) => i.id !== id)
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !district) return toast.error(lang.form.errorRequired)

    setSaving(true)
    const supabase = createClient()

    try {
      // 1. Save property
      const propertyData = {
        name,
        type,
        city,
        district,
        address: address || null,
        price: price ? parseInt(price) : null,
        area_sqm: areaSqm ? parseInt(areaSqm) : null,
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        description: description || null,
        status,
        updated_at: new Date().toISOString(),
      }

      let propertyId = property?.id

      if (property?.id) {
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', property.id)
        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from('properties')
          .insert(propertyData)
          .select('id')
          .single()
        if (error) throw error
        propertyId = data.id
      }

      // 2. Delete removed existing images from Cloudinary + DB
      const keptIds = new Set(items.filter((i) => i.kind === 'existing').map((i) => i.id))
      const removedImages = existingImages.filter((img) => !keptIds.has(img.id))
      if (removedImages.length > 0) {
        await Promise.all(
          removedImages.map((img) =>
            fetch('/api/upload', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ publicId: img.storage_path }),
            })
          )
        )
        await supabase
          .from('property_images')
          .delete()
          .in('id', removedImages.map((img) => img.id))
      }

      // 3. Walk items in display order: update order_index of existing, upload new at their slot
      const newCount = items.filter((i) => i.kind === 'new').length
      if (newCount > 0) setUploading(true)
      let done = 0

      await Promise.all(
        items.map(async (item, i) => {
          if (item.kind === 'existing') {
            await supabase.from('property_images').update({ order_index: i }).eq('id', item.id)
          } else {
            const formData = new FormData()
            formData.append('file', item.file)
            formData.append('folder', `bds-app/${propertyId}`)

            const res = await fetch('/api/upload', { method: 'POST', body: formData })
            if (!res.ok) throw new Error(lang.form.errorUpload)
            const { url, publicId } = await res.json()

            await supabase.from('property_images').insert({
              property_id: propertyId,
              url,
              storage_path: publicId,
              order_index: i,
            })

            done++
            setUploadProgress(Math.round((done / newCount) * 100))
          }
        })
      )
      setUploading(false)

      toast.success(property?.id ? lang.form.successUpdate : lang.form.successCreate)
      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      toast.error(lang.form.errorPrefix + ' ' + (err.message ?? 'Không xác định'))
      setSaving(false)
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <div className="bg-card/60 backdrop-blur rounded-xl border border-border p-5 space-y-4">
        <h2 className="font-semibold text-foreground">{lang.form.sectionBasic}</h2>

        {/* Nhóm 1: Thông tin chung */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{lang.form.groupGeneral}</h3>
          <div className="space-y-1.5">
            <Label className="text-[10px]">{lang.form.nameLabel} <span className="text-red-500">*</span></Label>
            <Input className="text-xs md:text-sm" value={name} onChange={(e) => setName(e.target.value)} placeholder={lang.form.namePlaceholder} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px]">{lang.form.typeLabel}</Label>
              <Select value={type} onValueChange={(v) => setType(v as PropertyType)}>
                <SelectTrigger className="w-full text-xs md:text-sm">{PROPERTY_TYPE_LABELS[type]}</SelectTrigger>
                <SelectContent>
                  <SelectItem value="villa">{lang.propertyTypes.villa}</SelectItem>
                  <SelectItem value="biet_thu">{lang.propertyTypes.biet_thu}</SelectItem>
                  <SelectItem value="can_ho_dich_vu">{lang.propertyTypes.can_ho_dich_vu}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px]">{lang.form.statusLabel}</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as PropertyStatus)}>
                <SelectTrigger className="w-full text-xs md:text-sm">{PROPERTY_STATUS_LABELS[status]}</SelectTrigger>
                <SelectContent>
                  <SelectItem value="selling">{lang.propertyStatuses.selling}</SelectItem>
                  <SelectItem value="renting">{lang.propertyStatuses.renting}</SelectItem>
                  <SelectItem value="sold">{lang.propertyStatuses.sold}</SelectItem>
                  <SelectItem value="rented">{lang.propertyStatuses.rented}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Nhóm 2: Vị trí */}
        <div className="space-y-3 pt-4 border-t border-border">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{lang.form.groupLocation}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px]">{lang.form.cityLabel} <span className="text-red-500">*</span></Label>
              <Select value={city} onValueChange={(v) => {
                const newCity = v as CityKey
                setCity(newCity)
                if (!DISTRICTS[newCity].includes(district)) setDistrict('')
              }}>
                <SelectTrigger className="w-full text-xs md:text-sm">{CITY_LABELS[city]}</SelectTrigger>
                <SelectContent>
                  {CITY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px]">{lang.form.districtLabel} <span className="text-red-500">*</span></Label>
              <Select value={district} onValueChange={(v) => setDistrict(v ?? '')} disabled={!city}>
                <SelectTrigger className="w-full text-xs md:text-sm">
                  {district || <span className="text-muted-foreground">{lang.form.districtLabel}</span>}
                </SelectTrigger>
                <SelectContent>
                  {DISTRICTS[city]?.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px]">{lang.form.addressLabel}</Label>
            <Input className="text-xs md:text-sm" value={address} onChange={(e) => setAddress(e.target.value)} placeholder={lang.form.addressPlaceholder} />
          </div>
        </div>

        {/* Nhóm 3: Thông số & giá */}
        <div className="space-y-3 pt-4 border-t border-border">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{lang.form.groupSpecs}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px]">{lang.form.priceLabel}</Label>
              <Input className="text-xs md:text-sm" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder={lang.form.pricePlaceholder} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px]">{lang.form.areaSqmLabel}</Label>
              <Input className="text-xs md:text-sm" type="number" value={areaSqm} onChange={(e) => setAreaSqm(e.target.value)} placeholder={lang.form.areaSqmPlaceholder} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px]">{lang.form.bedroomsLabel}</Label>
              <Input className="text-xs md:text-sm" type="number" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} placeholder={lang.form.bedroomsPlaceholder} />
            </div>
          </div>
        </div>

        {/* Nhóm 4: Mô tả */}
        <div className="space-y-3 pt-4 border-t border-border">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{lang.form.descLabel}</h3>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder={lang.form.descPlaceholder}
            className="w-full rounded-lg border border-input bg-transparent dark:bg-input/30 px-2.5 py-2 text-xs md:text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-none"
          />
        </div>
      </div>

      {/* Images + Save */}
      <div className="space-y-4">
      <div className="bg-card/60 backdrop-blur rounded-xl border border-border p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">
            {lang.form.sectionImages} <span className="text-muted-foreground font-normal text-sm">({lang.form.imageCount(items.length)})</span>
          </h2>
          <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={compressing}>
            {compressing ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <Upload size={14} className="mr-1.5" />}
            {compressing ? lang.form.compressingBtn : lang.form.addImageBtn}
          </Button>
        </div>
        <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileChange} aria-label={lang.form.addImageBtn} className="hidden" />

        {items.length > 0 && (
          <>
            <p className="text-xs text-muted-foreground">
              Kéo thả để sắp xếp — ảnh đầu tiên là ảnh bìa
            </p>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {items.map((item, i) => (
                    <SortableImage key={item.id} item={item} index={i} onRemove={() => removeItem(item.id)} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </>
        )}

        {items.length === 0 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-slate-200 rounded-xl p-8 text-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          >
            <Upload size={24} className="mx-auto mb-2" />
            <p className="text-sm">{lang.form.uploadClickHint}</p>
            <p className="text-xs mt-1">{lang.form.uploadMultiHint}</p>
          </button>
        )}

        {uploading && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{lang.form.uploadingMsg}</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <Button type="submit" disabled={saving} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {property ? lang.form.saveBtn : lang.form.createBtn}
      </Button>
      </div>
      </div>
    </form>
  )
}
