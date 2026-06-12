export type PropertyType = 'villa' | 'biet_thu' | 'can_ho_dich_vu'
export type PropertyStatus = 'active' | 'sold' | 'rented'

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  villa: 'Villa',
  biet_thu: 'Biệt thự',
  can_ho_dich_vu: 'Căn hộ dịch vụ',
}

export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  active: 'Đang bán/cho thuê',
  sold: 'Đã bán',
  rented: 'Đã cho thuê',
}

export interface PropertyImage {
  id: string
  property_id: string
  url: string
  storage_path: string
  order_index: number
  created_at: string
}

export interface Property {
  id: string
  name: string
  type: PropertyType
  area: string
  price: number | null
  area_sqm: number | null
  bedrooms: number | null
  description: string | null
  status: PropertyStatus
  created_at: string
  updated_at: string
  property_images?: PropertyImage[]
}

export interface PropertyFilters {
  q?: string
  area?: string
  type?: PropertyType | ''
}
