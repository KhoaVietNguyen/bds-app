import { lang } from './lang'
import type { CityKey } from './locations'

export type { CityKey }
export type PropertyType = 'villa' | 'biet_thu' | 'can_ho_dich_vu'
export type PropertyStatus = 'active' | 'sold' | 'rented'

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = lang.propertyTypes as Record<PropertyType, string>
export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = lang.propertyStatuses as Record<PropertyStatus, string>

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
  city: CityKey
  district: string
  address: string | null
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
  city?: CityKey | ''
  district?: string
  type?: PropertyType | ''
}
