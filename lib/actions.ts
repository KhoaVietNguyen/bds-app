'use server'

import { revalidateTag } from 'next/cache'

export async function revalidateProperties() {
  revalidateTag('properties', 'max')
  revalidateTag('property-detail', 'max')
}
