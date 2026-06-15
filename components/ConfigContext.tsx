'use client'

import { createContext, useContext, useMemo } from 'react'
import type { ConfigItem, BadgeProps } from '@/lib/config'
import { getSoftBadgeProps, getSolidBadgeProps } from '@/lib/config'

interface ConfigValue {
  types: ConfigItem[]
  statuses: ConfigItem[]
  typeLabels: Record<string, string>
  statusLabels: Record<string, string>
  getStatusColor: (value: string) => BadgeProps
  getStatusBadge: (value: string) => BadgeProps
  getTypeBadge: (value: string) => BadgeProps
}

const DEFAULT_SOFT: BadgeProps = { className: 'bg-gray-500/20 text-gray-600 dark:text-gray-400' }
const DEFAULT_SOLID: BadgeProps = { className: 'bg-gray-500' }

const ConfigCtx = createContext<ConfigValue>({
  types: [], statuses: [], typeLabels: {}, statusLabels: {},
  getStatusColor: () => DEFAULT_SOFT,
  getStatusBadge: () => DEFAULT_SOLID,
  getTypeBadge:   () => DEFAULT_SOLID,
})

export function ConfigContextProvider({ types, statuses, children }: {
  types: ConfigItem[]
  statuses: ConfigItem[]
  children: React.ReactNode
}) {
  const value = useMemo(() => {
    const typeLabels = Object.fromEntries(types.map(t => [t.value, t.label]))
    const statusLabels = Object.fromEntries(statuses.map(s => [s.value, s.label]))
    const statusColorMap = Object.fromEntries(statuses.map(s => [s.value, getSoftBadgeProps(s.color)]))
    const statusBadgeMap = Object.fromEntries(statuses.map(s => [s.value, getSolidBadgeProps(s.color)]))
    const typeBadgeMap = Object.fromEntries(types.map(t => [t.value, getSolidBadgeProps(t.color)]))
    return {
      types,
      statuses,
      typeLabels,
      statusLabels,
      getStatusColor: (v: string) => statusColorMap[v] ?? DEFAULT_SOFT,
      getStatusBadge: (v: string) => statusBadgeMap[v] ?? DEFAULT_SOLID,
      getTypeBadge: (v: string) => typeBadgeMap[v] ?? DEFAULT_SOLID,
    }
  }, [types, statuses])

  return <ConfigCtx.Provider value={value}>{children}</ConfigCtx.Provider>
}

export function useConfig() {
  return useContext(ConfigCtx)
}
