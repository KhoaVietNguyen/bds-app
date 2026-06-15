'use server'

import { revalidateTag } from 'next/cache'

export async function revalidateConfig() {
  revalidateTag('property-config', 'max')
}
