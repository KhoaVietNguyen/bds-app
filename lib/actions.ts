'use server'

import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'

export async function revalidateProperties() {
  revalidateTag('properties', 'max')
  revalidateTag('property-detail', 'max')
}

export async function revalidateAndRedirect(path: string) {
  revalidateTag('properties', 'max')
  revalidateTag('property-detail', 'max')
  redirect(path)
}
