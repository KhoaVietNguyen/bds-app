import { getPropertyTypes, getPropertyStatuses } from '@/lib/data'
import { ConfigContextProvider } from './ConfigContext'

export default async function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [types, statuses] = await Promise.all([getPropertyTypes(), getPropertyStatuses()])
  return (
    <ConfigContextProvider types={types} statuses={statuses}>
      {children}
    </ConfigContextProvider>
  )
}
