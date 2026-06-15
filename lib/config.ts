export interface ConfigItem {
  value: string
  label: string
  color?: string | null
  order_index: number
}

export const STATUS_COLOR_CLASSES: Record<string, string> = {
  green:  'bg-green-500/20 text-green-600 dark:text-green-400',
  blue:   'bg-blue-500/20 text-blue-600 dark:text-blue-400',
  red:    'bg-red-500/20 text-red-600 dark:text-red-400',
  orange: 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
  purple: 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
  yellow: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
  cyan:   'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400',
  pink:   'bg-pink-500/20 text-pink-600 dark:text-pink-400',
  gray:   'bg-gray-500/20 text-gray-600 dark:text-gray-400',
}

export function getStatusColorClass(color?: string | null): string {
  return STATUS_COLOR_CLASSES[color ?? ''] ?? STATUS_COLOR_CLASSES.gray
}

export const STATUS_BADGE_BG: Record<string, string> = {
  green:  'bg-green-500',
  blue:   'bg-blue-500',
  red:    'bg-red-500',
  orange: 'bg-orange-500',
  purple: 'bg-purple-500',
  yellow: 'bg-yellow-500',
  cyan:   'bg-cyan-500',
  pink:   'bg-pink-500',
  gray:   'bg-gray-500',
}

export function getStatusBadgeSolid(color?: string | null): string {
  return STATUS_BADGE_BG[color ?? ''] ?? STATUS_BADGE_BG.gray
}

export function toLabelsMap(items: ConfigItem[]): Record<string, string> {
  return Object.fromEntries(items.map(i => [i.value, i.label]))
}
