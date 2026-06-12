export type CityKey = 'ha_noi' | 'ho_chi_minh'

export const CITY_LABELS: Record<CityKey, string> = {
  ha_noi: 'Hà Nội',
  ho_chi_minh: 'TP. Hồ Chí Minh',
}

export const DISTRICTS: Record<CityKey, string[]> = {
  ha_noi: [
    'Hoàn Kiếm',
    'Ba Đình',
    'Đống Đa',
    'Hai Bà Trưng',
    'Hoàng Mai',
    'Long Biên',
    'Tây Hồ',
    'Cầu Giấy',
    'Nam Từ Liêm',
    'Bắc Từ Liêm',
  ],
  ho_chi_minh: [
    'Quận 1',
    'Quận 2',
    'Quận 3',
    'Quận 4',
    'Quận 5',
    'Quận 6',
    'Quận 7',
    'Quận 8',
    'Quận 10',
    'Quận 11',
    'Quận 12',
    'Bình Thạnh',
    'Gò Vấp',
    'Phú Nhuận',
    'Tân Bình',
    'Tân Phú',
    'Bình Tân',
    'Thủ Đức',
  ],
}

export function formatLocation(district: string, city: CityKey, address?: string | null): string {
  const base = `${district}, ${CITY_LABELS[city]}`
  return address ? `${address}, ${base}` : base
}

export const CITY_OPTIONS = (Object.keys(CITY_LABELS) as CityKey[]).map((k) => ({
  value: k,
  label: CITY_LABELS[k],
}))
