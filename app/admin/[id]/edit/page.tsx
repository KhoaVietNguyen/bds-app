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
      <div className="sticky top-0 z-20 bg-card/50 backdrop-blur-md -mx-4 -mt-4 px-4 py-3 border-b border-border flex items-center gap-3 md:mx-0 md:mt-0 md:rounded-xl md:border md:bg-card/90 md:top-4">
        <Link href="/admin" className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm shrink-0">
          <ChevronLeft size={16} />
          Quay lại
        </Link>
        <div className="flex-1 text-center pr-16">
          <h1 className="text-lg md:text-2xl font-bold text-foreground">Chỉnh sửa BĐS</h1>
          <p className="text-xs text-muted-foreground font-mono">{property.id}</p>
        </div>
      </div>
      <PropertyForm property={property} existingImages={images ?? []} />
    </div>
  )
}
