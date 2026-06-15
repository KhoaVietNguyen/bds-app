import { getPropertyTypes, getPropertyStatuses } from '@/lib/data'
import AdminConfigClient from './AdminConfigClient'

export default async function ConfigPage() {
  const [types, statuses] = await Promise.all([
    getPropertyTypes(),
    getPropertyStatuses(),
  ])
  return <AdminConfigClient initialTypes={types} initialStatuses={statuses} />
}
