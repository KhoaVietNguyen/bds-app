export type CityKey = 'ha_noi' | 'ho_chi_minh' | 'vung_tau' | 'nha_trang' | 'da_lat'

export const CITY_LABELS: Record<CityKey, string> = {
  ha_noi: 'Hà Nội',
  ho_chi_minh: 'TP. Hồ Chí Minh',
  vung_tau: 'Vũng Tàu',
  nha_trang: 'Nha Trang',
  da_lat: 'Đà Lạt',
}

export const DISTRICTS: Record<CityKey, string[]> = {
  // ────────────────────────────────────────────────
  // HÀ NỘI
  // ────────────────────────────────────────────────
  ha_noi: [
    // Quận/Huyện cũ
    'Hoàn Kiếm', 'Ba Đình', 'Hai Bà Trưng', 'Đống Đa',
    'Tây Hồ', 'Thanh Xuân', 'Cầu Giấy', 'Long Biên',
    'Hoàng Mai', 'Hà Đông', 'Bắc Từ Liêm', 'Nam Từ Liêm',
    'Sơn Tây',
    'Đông Anh', 'Gia Lâm', 'Mê Linh', 'Sóc Sơn',
    'Ba Vì', 'Thạch Thất', 'Phúc Thọ', 'Đan Phượng',
    'Hoài Đức', 'Chương Mỹ', 'Thanh Oai', 'Thanh Trì',
    'Thường Tín', 'Phú Xuyên', 'Ứng Hòa', 'Mỹ Đức', 'Quốc Oai',
    // Phường mới từ 1/7/2025 — nội thành
    'Hoàn Kiếm (mới)', 'Cửa Nam', 'Hồng Hà',
    'Ba Đình (mới)', 'Ngọc Hà', 'Giảng Võ',
    'Hai Bà Trưng (mới)', 'Vĩnh Tuy', 'Bạch Mai',
    'Đống Đa (mới)', 'Kim Liên', 'Văn Miếu - Quốc Tử Giám', 'Láng', 'Ô Chợ Dừa',
    'Lĩnh Nam', 'Hoàng Mai (mới)', 'Vĩnh Hưng', 'Tương Mai',
    'Định Công', 'Hoàng Liệt', 'Yên Sở', 'Thanh Liệt',
    'Thanh Xuân (mới)', 'Khương Đình', 'Phương Liệt',
    'Cầu Giấy (mới)', 'Nghĩa Đô', 'Yên Hòa',
    'Tây Hồ (mới)', 'Phú Thượng',
    'Tây Tựu', 'Phú Diễn', 'Xuân Đỉnh', 'Đông Ngạc', 'Thượng Cát',
    'Từ Liêm', 'Xuân Phương', 'Tây Mỗ', 'Đại Mỗ',
    'Long Biên (mới)', 'Bồ Đề', 'Việt Hưng', 'Phúc Lợi',
    'Hà Đông (mới)', 'Dương Nội', 'Yên Nghĩa', 'Phú Lương', 'Kiến Hưng',
    // Xã mới từ 1/7/2025 — ngoại thành
    'Thanh Trì (xã)', 'Đại Thanh',
    'Nam Phù', 'Ngọc Hồi', 'Thượng Phúc', 'Thường Tín (xã)',
    'Chương Dương', 'Hồng Vân', 'Phú Xuyên (xã)', 'Phượng Dực', 'Chuyên Mỹ', 'Đại Xuyên',
    'Thanh Oai (xã)', 'Bình Minh', 'Tam Hưng', 'Dân Hòa',
    'Vân Đình', 'Ứng Thiên', 'Hòa Xá', 'Ứng Hòa (xã)',
    'Mỹ Đức (xã)', 'Hồng Sơn', 'Phúc Sơn', 'Hương Sơn', 'Phú Nghĩa',
    'Xuân Mai', 'Trần Phú', 'Hòa Phú', 'Quảng Bị', 'Minh Châu', 'Quảng Oai',
    'Vật Lại', 'Cổ Đô', 'Bất Bạt', 'Suối Hai', 'Ba Vì (xã)',
    'Yên Bài', 'Đoài Phương', 'Phúc Thọ (xã)', 'Phúc Lộc', 'Hát Môn',
    'Thạch Thất (xã)', 'Hạ Bằng', 'Tây Phương', 'Hòa Lạc', 'Yên Xuân', 'Kiều Phú', 'Phú Cát',
    'Hoài Đức (xã)', 'Dương Hòa', 'Sơn Đồng', 'An Khánh', 'Ô Diên', 'Liên Minh',
    'Gia Lâm (xã)', 'Thuận An', 'Bát Tràng', 'Phù Đổng',
    'Thư Lâm', 'Đông Anh (xã)', 'Phúc Thịnh', 'Thiên Lộc',
    'Vĩnh Thanh', 'Yên Lãng', 'Tiến Thắng', 'Quang Minh',
    'Sóc Sơn (xã)', 'Đa Phúc', 'Nội Bài', 'Trung Giã', 'Kim Anh',
  ],

  // ────────────────────────────────────────────────
  // TP. HỒ CHÍ MINH
  // ────────────────────────────────────────────────
  ho_chi_minh: [
    // Quận/Huyện cũ
    'Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6',
    'Quận 7', 'Quận 8', 'Quận 9', 'Quận 10', 'Quận 11', 'Quận 12',
    'Phú Nhuận', 'Bình Thạnh', 'Gò Vấp', 'Tân Bình', 'Tân Phú', 'Bình Tân',
    'Thủ Đức', 'Bình Chánh', 'Hóc Môn', 'Củ Chi', 'Cần Giờ', 'Nhà Bè',
    // Phường mới từ 1/7/2025 — TP Thủ Đức
    'Hiệp Bình', 'Tam Bình', 'Thủ Đức (mới)', 'Linh Xuân',
    'Long Bình', 'Tăng Nhơn Phú', 'Phước Long', 'Long Phước',
    'Long Trường', 'An Khánh', 'Bình Trưng', 'Cát Lái',
    // Quận 1
    'Tân Định', 'Bến Thành', 'Sài Gòn', 'Cầu Ông Lãnh',
    // Quận 3
    'Bàn Cờ', 'Xuân Hòa', 'Nhiêu Lộc',
    // Quận 4
    'Vĩnh Hội', 'Khánh Hội', 'Xóm Chiếu',
    // Quận 5
    'Chợ Quán', 'An Đông', 'Chợ Lớn',
    // Quận 6
    'Bình Tiên', 'Bình Tây', 'Bình Phú', 'Phú Lâm',
    // Quận 7
    'Tân Mỹ', 'Tân Hưng', 'Tân Thuận', 'Phú Thuận',
    // Quận 8
    'Chánh Hưng', 'Bình Đông', 'Phú Định',
    // Quận 10
    'Vườn Lài', 'Diên Hồng', 'Hòa Hưng',
    // Quận 11
    'Hòa Bình', 'Phú Thọ', 'Bình Thới', 'Minh Phụng',
    // Quận 12
    'Đông Hưng Thuận', 'Trung Mỹ Tây', 'Tân Thới Hiệp', 'Thới An', 'An Phú Đông',
    // Bình Thạnh
    'Gia Định', 'Bình Thạnh (mới)', 'Bình Lợi Trung', 'Thạnh Mỹ Tây', 'Bình Quới',
    // Bình Tân
    'Bình Tân (mới)', 'Bình Hưng Hòa', 'Bình Trị Đông', 'An Lạc', 'Tân Tạo',
    // Gò Vấp
    'Hạnh Thông', 'An Nhơn', 'Gò Vấp (mới)', 'Thống Tây Hội', 'An Hội Tây', 'An Hội Đông',
    // Phú Nhuận
    'Đức Nhuận', 'Cầu Kiệu', 'Phú Nhuận (mới)',
    // Tân Bình
    'Tân Sơn Hòa', 'Tân Sơn Nhất', 'Tân Hòa', 'Bảy Hiền', 'Tân Bình (mới)', 'Tân Sơn',
    // Tân Phú
    'Tây Thạnh', 'Tân Sơn Nhì', 'Phú Thọ Hòa', 'Phú Thạnh', 'Tân Phú (mới)',
    // Bình Chánh
    'Vĩnh Lộc', 'Tân Vĩnh Lộc', 'Bình Lợi', 'Tân Nhựt', 'Bình Chánh (xã)', 'Hưng Long', 'Bình Hưng',
    // Củ Chi
    'An Nhơn Tây', 'Thái Mỹ', 'Nhuận Đức', 'Tân An Hội', 'Củ Chi (xã)', 'Phú Hòa Đông', 'Bình Mỹ',
    // Cần Giờ
    'Bình Khánh', 'Cần Giờ (xã)', 'An Thới Đông', 'Thạnh An',
    // Hóc Môn
    'Hóc Môn (xã)', 'Bà Điểm', 'Xuân Thới Sơn', 'Đông Thạnh',
    // Nhà Bè
    'Nhà Bè (xã)', 'Hiệp Phước',
  ],

  // ────────────────────────────────────────────────
  // VŨNG TÀU (Bà Rịa - Vũng Tàu)
  // ────────────────────────────────────────────────
  vung_tau: [
    // Huyện/TP cũ
    'TP. Vũng Tàu', 'TP. Bà Rịa', 'TP. Phú Mỹ',
    'Châu Đức', 'Xuyên Mộc', 'Long Đất',
    'Long Điền', 'Đất Đỏ', 'Côn Đảo',
    // Phường cũ của TP. Vũng Tàu
    'Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5',
    'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10', 'Phường 11', 'Phường 12',
    'Thắng Nhất', 'Thắng Nhì', 'Thắng Tam', 'Nguyễn An Ninh', 'Rạch Dừa',
    'Long Sơn',
    // Phường mới từ 1/7/2025
    'Vũng Tàu (mới)', 'Tam Thắng', 'Rạch Dừa (mới)', 'Phước Thắng',
  ],

  // ────────────────────────────────────────────────
  // NHA TRANG (Khánh Hòa)
  // ────────────────────────────────────────────────
  nha_trang: [
    // Huyện/TP cũ
    'TP. Nha Trang', 'TP. Cam Ranh', 'TX. Ninh Hòa',
    'Cam Lâm', 'Diên Khánh', 'Vạn Ninh', 'Khánh Vĩnh', 'Khánh Sơn', 'Trường Sa',
    // Phường/xã mới từ 1/7/2025 — Nha Trang
    'Nha Trang (mới)', 'Bắc Nha Trang', 'Tây Nha Trang', 'Nam Nha Trang',
    // Cam Ranh
    'Bắc Cam Ranh', 'Cam Ranh (mới)', 'Cam Linh', 'Ba Ngòi', 'Nam Cam Ranh', 'Cam An',
    // Ninh Hòa
    'Ninh Hòa (mới)', 'Đông Ninh Hòa', 'Hòa Thắng', 'Bắc Ninh Hòa', 'Nam Ninh Hòa', 'Hòa Trí',
    // Cam Lâm
    'Cam Lâm (xã)', 'Suối Dầu', 'Cam Hiệp',
    // Vạn Ninh
    'Đại Lãnh', 'Tu Bông', 'Vạn Thắng', 'Vạn Ninh (xã)', 'Vạn Hưng', 'Suối Hiệp',
    // Khánh Vĩnh
    'Bắc Khánh Vĩnh', 'Trung Khánh Vĩnh', 'Tây Khánh Vĩnh', 'Nam Khánh Vĩnh', 'Khánh Vĩnh (xã)',
    // Khánh Sơn
    'Khánh Sơn (xã)', 'Tây Khánh Sơn', 'Đông Khánh Sơn',
    // Diên Khánh
    'Diên Khánh (xã)', 'Diên Lạc', 'Diên Điền', 'Diên Lâm', 'Diên Thọ',
    // Trường Sa
    'Đặc khu Trường Sa',
  ],

  // ────────────────────────────────────────────────
  // ĐÀ LẠT (Lâm Đồng)
  // ────────────────────────────────────────────────
  da_lat: [
    // Huyện/TP cũ
    'TP. Đà Lạt', 'TP. Bảo Lộc',
    'Lạc Dương', 'Đơn Dương', 'Đức Trọng', 'Lâm Hà',
    'Di Linh', 'Bảo Lâm', 'Đam Rông', 'Đạ Huoai',
    // Phường cũ của TP. Đà Lạt
    'Phường 1 (ĐL)', 'Phường 2 (ĐL)', 'Phường 3 (ĐL)', 'Phường 4 (ĐL)',
    'Phường 5 (ĐL)', 'Phường 6 (ĐL)', 'Phường 7 (ĐL)', 'Phường 8 (ĐL)',
    'Phường 9 (ĐL)', 'Phường 10 (ĐL)', 'Phường 11 (ĐL)', 'Phường 12 (ĐL)',
    'Tà Nung', 'Xuân Thọ', 'Xuân Trường (xã)', 'Trạm Hành',
    // Phường mới từ 1/7/2025
    'Xuân Hương', 'Cam Ly', 'Lâm Viên', 'Xuân Trường (mới)', 'Lang Biang',
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
