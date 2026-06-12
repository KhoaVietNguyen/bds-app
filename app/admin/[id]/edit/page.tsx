import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import PropertyForm from '@/components/admin/PropertyForm'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()

  if (!property) notFound()

  const { data: images } = await supabase
    .from('property_images')
    .select('*')
    .eq('property_id', id)
    .order('order_index')

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/admin" className="text-slate-500 hover:text-slate-700 flex items-center gap-1 text-sm">
          <ChevronLeft size={16} />
          Quay lại
        </Link>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Chỉnh sửa BĐS</h1>
        <p className="text-sm text-slate-500 font-mono mt-1">{property.id}</p>
      </div>
      <PropertyForm property={property} existingImages={images ?? []} />
    </div>
  )
}
