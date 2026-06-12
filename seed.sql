-- Chạy file này trong Supabase SQL Editor để seed 10 records mẫu
-- Dashboard > SQL Editor > New query > paste > Run
-- Lưu ý: ảnh dùng Unsplash làm placeholder (cần thêm images.unsplash.com vào next.config.ts)

INSERT INTO properties (name, type, area, price, area_sqm, bedrooms, description, status) VALUES
(
  'Villa Hồ Tây view trực diện hồ, 4 phòng ngủ',
  'villa',
  'Tây Hồ, Hà Nội',
  25000000000,
  350,
  4,
  'Villa cao cấp mặt hồ Tây, thiết kế hiện đại, hồ bơi riêng, sân vườn rộng. Nội thất nhập khẩu cao cấp, view trực diện hồ tuyệt đẹp.',
  'active'
),
(
  'Biệt thự Vinhomes Riverside 5 phòng ngủ',
  'biet_thu',
  'Long Biên, Hà Nội',
  18000000000,
  280,
  5,
  'Biệt thự song lập trong khu đô thị Vinhomes Riverside, an ninh 24/7, đầy đủ tiện ích. Nội thất châu Âu, sân vườn đẹp.',
  'active'
),
(
  'Căn hộ dịch vụ Trần Duy Hưng, full nội thất',
  'can_ho_dich_vu',
  'Cầu Giấy, Hà Nội',
  35000000,
  65,
  2,
  'Căn hộ dịch vụ cao cấp tại trung tâm Cầu Giấy, full nội thất cao cấp, ban công thoáng mát. Giá thuê hàng tháng.',
  'active'
),
(
  'Villa Đà Lạt nghỉ dưỡng sân vườn 1000m²',
  'villa',
  'Đà Lạt, Lâm Đồng',
  12000000000,
  420,
  6,
  'Villa nghỉ dưỡng phong cách Pháp cổ điển, sân vườn trồng hoa rộng 1000m², view thung lũng. Phù hợp kinh doanh homestay.',
  'active'
),
(
  'Biệt thự Thảo Điền 3 tầng hồ bơi',
  'biet_thu',
  'Thảo Điền, TP.HCM',
  32000000000,
  500,
  5,
  'Biệt thự phong cách Địa Trung Hải, hồ bơi riêng, gara 2 xe, khu vực an ninh khép kín. Gần trường quốc tế.',
  'sold'
),
(
  'Căn hộ dịch vụ Bùi Viện, trung tâm Q1',
  'can_ho_dich_vu',
  'Quận 1, TP.HCM',
  28000000,
  45,
  1,
  'Studio cao cấp ngay trung tâm phố Tây Bùi Viện, thiết kế hiện đại tối giản. Giá thuê hàng tháng, bao điện nước.',
  'rented'
),
(
  'Villa Nha Trang biển Bãi Dài, 3 phòng ngủ',
  'villa',
  'Cam Lâm, Khánh Hòa',
  8500000000,
  220,
  3,
  'Villa nghỉ dưỡng cách biển 200m, thiết kế nhiệt đới, hồ bơi vô cực view biển. Sổ đỏ lâu dài, pháp lý rõ ràng.',
  'active'
),
(
  'Biệt thự Ecopark 4 phòng ngủ full nội thất',
  'biet_thu',
  'Văn Giang, Hưng Yên',
  9800000000,
  260,
  4,
  'Biệt thự đơn lập trong khu đô thị sinh thái Ecopark, môi trường trong lành, tiện ích đầy đủ. Bàn giao đầy đủ nội thất.',
  'active'
),
(
  'Căn hộ dịch vụ Mỹ Đình, gần Keangnam',
  'can_ho_dich_vu',
  'Nam Từ Liêm, Hà Nội',
  22000000,
  55,
  2,
  'Căn hộ dịch vụ 2 phòng ngủ gần tòa nhà Keangnam, phù hợp chuyên gia nước ngoài. Full nội thất, dịch vụ dọn phòng hàng tuần.',
  'active'
),
(
  'Villa Phú Quốc resort 5 sao, mặt biển',
  'villa',
  'Phú Quốc, Kiên Giang',
  45000000000,
  800,
  7,
  'Villa resort 5 sao mặt biển Bãi Trường, hồ bơi riêng, bến du thuyền, đầu bếp riêng. Đầu tư sinh lời cao từ cho thuê nghỉ dưỡng.',
  'active'
);

-- Seed ảnh cho từng property (2-3 ảnh/property)
INSERT INTO property_images (property_id, url, storage_path, order_index)
SELECT ranked.id,
       img.url,
       'seed/placeholder-' || ranked.id || '-' || img.idx::text,
       img.idx
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) AS rn
  FROM properties
  ORDER BY created_at
  LIMIT 10
) AS ranked
JOIN (
  VALUES
    (1, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop', 0),
    (1, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop', 1),
    (1, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop', 2),
    (2, 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop', 0),
    (2, 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop', 1),
    (3, 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop', 0),
    (3, 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop', 1),
    (4, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop', 0),
    (4, 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=600&fit=crop', 1),
    (4, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop', 2),
    (5, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop', 0),
    (5, 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop', 1),
    (6, 'https://images.unsplash.com/photo-1574691250077-03a929faece5?w=800&h=600&fit=crop', 0),
    (7, 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&h=600&fit=crop', 0),
    (7, 'https://images.unsplash.com/photo-1505873242700-f289a29e1724?w=800&h=600&fit=crop', 1),
    (7, 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop', 2),
    (8, 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&h=600&fit=crop', 0),
    (8, 'https://images.unsplash.com/photo-1543489822-c49534f3271f?w=800&h=600&fit=crop', 1),
    (9, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop', 0),
    (9, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop', 1),
    (10, 'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=800&h=600&fit=crop', 0),
    (10, 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop', 1),
    (10, 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=600&fit=crop', 2)
) AS img(seq, url, idx) ON img.seq = ranked.rn;
