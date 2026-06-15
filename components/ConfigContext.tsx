'use client'

import { createContext, useContext, useMemo } from 'react'
import type { ConfigItem } from '@/lib/config'
import { getStatusColorClass, getStatusBadgeSolid } from '@/lib/config'

interface ConfigValue {
  types: ConfigItem[]
  statuses: ConfigItem[]
  typeLabels: Record<string, string>
  statusLabels: Record<string, string>
  getStatusColor: (value: string) => string
  getStatusBadge: (value: string) => string
  getTypeBadge: (value: string) => string
}

const DEFAULT_BADGE = 'bg-gray-500'

const ConfigCtx = createContext<ConfigValue>({
  types: [], statuses: [], typeLabels: {}, statusLabels: {},
  getStatusColor: () => 'bg-gray-500/20 text-gray-600 dark:text-gray-400',
  getStatusBadge: () => DEFAULT_BADGE,
  getTypeBadge:   () => DEFAULT_BADGE,
})

export function ConfigContextProvider({ types, statuses, children }: {
  types: ConfigItem[]
  statuses: ConfigItem[]
  children: React.ReactNode
}) {
  const value = useMemo(() => {
    const typeLabels = Object.fromEntries(types.map(t => [t.value, t.label]))
    const statusLabels = Object.fromEntries(statuses.map(s => [s.value, s.label]))
    const statusColorMap = Object.fromEntries(statuses.map(s => [s.value, getStatusColorClass(s.color)]))
    const statusBadgeMap = Object.fromEntries(statuses.map(s => [s.value, getStatusBadgeSolid(s.color)]))
    const typeBadgeMap = Object.fromEntries(types.map(t => [t.value, getStatusBadgeSolid(t.color)]))
    return {
      types,
      statuses,
      typeLabels,
      statusLabels,
      getStatusColor: (v: string) => statusColorMap[v] ?? getStatusColorClass(null),
      getStatusBadge: (v: string) => statusBadgeMap[v] ?? DEFAULT_BADGE,
      getTypeBadge: (v: string) => typeBadgeMap[v] ?? DEFAULT_BADGE,
    }
  }, [types, statuses])

  return <ConfigCtx.Provider value={value}>{children}</ConfigCtx.Provider>
}

export function useConfig() {
  return useContext(ConfigCtx)
}
