import { createBrowserClient } from '@supabase/ssr'
import { cacheTag, cacheLife } from 'next/cache'
import type { ConfigItem } from './config'

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export interface PropertyQueryParams {
  q?: string
  city?: string
  district?: string
  type?: string
  status?: string
  since?: string
  priceMin?: number
  priceMax?: number
  priceCurrency?: 'vnd' | 'usd'
}

export async function getProperties(params: PropertyQueryParams) {
  'use cache'
  cacheLife({ stale: 30, revalidate: 60, expire: 300 })
  cacheTag('properties')

  const supabase = getSupabase()
  let query = supabase
    .from('properties')
    .select('*, property_images(id, url, order_index)')
    .order('created_at', { ascending: false })

  if (params.q) query = query.or(`id.ilike.%${params.q}%,name.ilike.%${params.q}%`)
  if (params.city) query = query.eq('city', params.city)
  if (params.district) query = query.eq('district', params.district)
  if (params.type) query = query.eq('type', params.type)
  if (params.status) query = query.eq('status', params.status)
  if (params.since) query = query.gte('created_at', params.since)

  if (params.priceCurrency === 'usd') {
    if (params.priceMin != null) query = query.gte('price_usd', params.priceMin)
    if (params.priceMax != null) query = query.lte('price_usd', params.priceMax)
  } else if (params.priceMin != null || params.priceMax != null) {
    if (params.priceMin != null) query = query.gte('price', params.priceMin)
    if (params.priceMax != null) query = query.lte('price', params.priceMax)
  }

  const { data } = await query
  return data ?? []
}

export async function getProfile() {
  'use cache'
  cacheLife({ stale: 600, revalidate: 3600, expire: 86400 })
  cacheTag('profile')

  const supabase = getSupabase()
  const { data } = await supabase.from('profile').select('*').eq('id', 1).single()
  return data
}

export async function getPropertyDetail(id: string) {
  'use cache'
  cacheLife({ stale: 30, revalidate: 60, expire: 300 })
  cacheTag('property-detail')
  cacheTag(`property-detail-${id}`)

  const supabase = getSupabase()
  const [{ data: property }, { data: images }, { data: profile }] = await Promise.all([
    supabase.from('properties').select('*').eq('id', id).single(),
    supabase.from('property_images').select('*').eq('property_id', id).order('order_index'),
    supabase.from('profile').select('*').eq('id', 1).single(),
  ])
  return { property, images: images ?? [], profile }
}

export async function getPropertyTypes(): Promise<ConfigItem[]> {
  'use cache'
  cacheLife({ stale: 60, revalidate: 300, expire: 3600 })
  cacheTag('property-config')

  const { data } = await getSupabase()
    .from('property_config')
    .select('value, label, color, order_index')
    .eq('category', 'type')
    .order('order_index')
  return data ?? []
}

export async function getPropertyStatuses(): Promise<ConfigItem[]> {
  'use cache'
  cacheLife({ stale: 60, revalidate: 300, expire: 3600 })
  cacheTag('property-config')

  const { data } = await getSupabase()
    .from('property_config')
    .select('value, label, color, order_index')
    .eq('category', 'status')
    .order('order_index')
  return data ?? []
}
