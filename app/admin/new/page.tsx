import PropertyForm from '@/components/admin/PropertyForm'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function NewPropertyPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/admin" className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm">
          <ChevronLeft size={16} />
          Quay lại
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-foreground">Thêm BĐS mới</h1>
      <PropertyForm />
    </div>
  )
}
