'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import imageCompression from 'browser-image-compression'
import { createClient } from '@/lib/supabase/client'
import { Property, PropertyImage, PropertyType, PropertyStatus } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Upload, X } from 'lucide-react'
import { toast } from 'sonner'

const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.5,        // 500 KB
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: 'image/webp',
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
  const [area, setArea] = useState(property?.area ?? '')
  const [price, setPrice] = useState(property?.price?.toString() ?? '')
  const [areaSqm, setAreaSqm] = useState(property?.area_sqm?.toString() ?? '')
  const [bedrooms, setBedrooms] = useState(property?.bedrooms?.toString() ?? '')
  const [description, setDescription] = useState(property?.description ?? '')
  const [status, setStatus] = useState<PropertyStatus>(property?.status ?? 'active')

  const [keepImages, setKeepImages] = useState<PropertyImage[]>(existingImages)
  const [newFiles, setNewFiles] = useState<{ file: File; preview: string }[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [compressing, setCompressing] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (files.length === 0) return

    setCompressing(true)
    try {
      const compressed = await Promise.all(
        files.map(async (file) => {
          const compressedFile = await imageCompression(file, COMPRESSION_OPTIONS)
          return { file: compressedFile, preview: URL.createObjectURL(compressedFile) }
        })
      )
      setNewFiles((prev) => [...prev, ...compressed])
    } catch {
      toast.error('Nén ảnh thất bại, thử lại')
    } finally {
      setCompressing(false)
    }
  }

  const removeExisting = (id: string) =>
    setKeepImages((prev) => prev.filter((img) => img.id !== id))

  const removeNew = (index: number) => {
    setNewFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !area) return toast.error('Vui lòng điền đầy đủ thông tin bắt buộc')

    setSaving(true)
    const supabase = createClient()

    try {
      // 1. Save property
      const propertyData = {
        name,
        type,
        area,
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
      const removedImages = existingImages.filter(
        (img) => !keepImages.find((k) => k.id === img.id)
      )
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

      // 3. Upload new images to Cloudinary
      if (newFiles.length > 0) {
        setUploading(true)
        let done = 0

        await Promise.all(
          newFiles.map(async ({ file }, i) => {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('folder', `bds-app/${propertyId}`)

            const res = await fetch('/api/upload', { method: 'POST', body: formData })
            if (!res.ok) throw new Error('Upload thất bại')
            const { url, publicId } = await res.json()

            await supabase.from('property_images').insert({
              property_id: propertyId,
              url,
              storage_path: publicId,
              order_index: keepImages.length + i,
            })

            done++
            setUploadProgress(Math.round((done / newFiles.length) * 100))
          })
        )
        setUploading(false)
      }

      toast.success(property?.id ? 'Đã cập nhật BĐS' : 'Đã thêm BĐS mới')
      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      toast.error('Lỗi: ' + (err.message ?? 'Không xác định'))
      setSaving(false)
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-card rounded-xl border border-border p-5 space-y-4">
        <h2 className="font-semibold text-foreground">Thông tin cơ bản</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 space-y-1.5">
            <Label>Tên BĐS <span className="text-red-500">*</span></Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: Villa Hồ Tây 3 phòng ngủ" required />
          </div>

          <div className="space-y-1.5">
            <Label>Loại BĐS</Label>
            <Select value={type} onValueChange={(v) => setType(v as PropertyType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="biet_thu">Biệt thự</SelectItem>
                <SelectItem value="can_ho_dich_vu">Căn hộ dịch vụ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Khu vực <span className="text-red-500">*</span></Label>
            <Input value={area} onChange={(e) => setArea(e.target.value)} placeholder="VD: Tây Hồ, Hà Nội" required />
          </div>

          <div className="space-y-1.5">
            <Label>Giá (VNĐ)</Label>
            <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="VD: 5000000000" />
          </div>

          <div className="space-y-1.5">
            <Label>Diện tích (m²)</Label>
            <Input type="number" value={areaSqm} onChange={(e) => setAreaSqm(e.target.value)} placeholder="VD: 200" />
          </div>

          <div className="space-y-1.5">
            <Label>Số phòng ngủ</Label>
            <Input type="number" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} placeholder="VD: 3" />
          </div>

          <div className="space-y-1.5">
            <Label>Trạng thái</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as PropertyStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Đang bán/cho thuê</SelectItem>
                <SelectItem value="sold">Đã bán</SelectItem>
                <SelectItem value="rented">Đã cho thuê</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <Label>Mô tả</Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Mô tả chi tiết về bất động sản..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-card rounded-xl border border-border p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">
            Ảnh BĐS <span className="text-muted-foreground font-normal text-sm">({keepImages.length + newFiles.length} ảnh)</span>
          </h2>
          <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={compressing}>
            {compressing ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <Upload size={14} className="mr-1.5" />}
            {compressing ? 'Đang nén...' : 'Thêm ảnh'}
          </Button>
        </div>
        <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />

        {(keepImages.length > 0 || newFiles.length > 0) && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {keepImages.map((img) => (
              <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
                <Image src={img.url} alt="" fill className="object-cover" sizes="120px" />
                <button
                  type="button"
                  onClick={() => removeExisting(img.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            {newFiles.map(({ preview }, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-muted group border-2 border-primary">
                <Image src={preview} alt="" fill className="object-cover" sizes="120px" />
                <button
                  type="button"
                  onClick={() => removeNew(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
                <span className="absolute bottom-1 left-1 bg-primary text-white text-xs px-1 rounded">Mới</span>
              </div>
            ))}
          </div>
        )}

        {keepImages.length === 0 && newFiles.length === 0 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-slate-200 rounded-xl p-8 text-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          >
            <Upload size={24} className="mx-auto mb-2" />
            <p className="text-sm">Nhấp để chọn ảnh</p>
            <p className="text-xs mt-1">Hỗ trợ nhiều ảnh cùng lúc</p>
          </button>
        )}

        {uploading && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Đang tải lên...</span>
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

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1 sm:flex-none">
          Hủy
        </Button>
        <Button type="submit" disabled={saving} className="flex-1 sm:flex-none bg-primary hover:bg-primary/90">
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {property ? 'Lưu thay đổi' : 'Thêm BĐS'}
        </Button>
      </div>
    </form>
  )
}
