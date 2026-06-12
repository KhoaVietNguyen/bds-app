export function formatPrice(price: number | null): string {
  if (!price) return 'Liên hệ'
  if (price >= 1_000_000_000) return `${(price / 1_000_000_000).toFixed(1)} tỷ`
  if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(0)} triệu`
  return price.toLocaleString('vi-VN') + ' đ'
}
