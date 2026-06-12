-- Reset data + sequence về 0
TRUNCATE TABLE property_images, properties CASCADE;
ALTER SEQUENCE property_seq RESTART WITH 1;

INSERT INTO properties (name, type, city, district, address, price, area_sqm, bedrooms, description, status) VALUES
(
  'Villa Thảo Điền hiện đại, hồ bơi riêng',
  'villa', 'ho_chi_minh', 'Quận 2', '15 Đường Quốc Hương',
  150000000000, 450, 5,
  'Villa cao cấp phong cách hiện đại tọa lạc tại Thảo Điền. Hồ bơi riêng, sân vườn xanh mát, nội thất nhập khẩu châu Âu. Hệ thống smarthome, thang máy riêng, gara 2 xe.',
  'active'
),
(
  'Biệt thự An Phú 5 phòng ngủ, gara đôi',
  'biet_thu', 'ho_chi_minh', 'Quận 2', '28 Đường Thảo Điền',
  185000000000, 520, 5,
  'Biệt thự compound An Phú an ninh 24/7, thiết kế kiến trúc Pháp cổ điển. 5 phòng ngủ suite, 2 phòng khách, bếp đảo nhập khẩu. Vị trí đắc địa gần trường quốc tế.',
  'active'
),
(
  'Villa Thủ Thiêm view sông, phong cách resort',
  'villa', 'ho_chi_minh', 'Quận 2', '42 Đường Mai Chí Thọ',
  200000000000, 600, 6,
  'Villa nghỉ dưỡng đẳng cấp 5 sao ngay bờ sông Sài Gòn. Thiết kế resort cao cấp với hồ bơi tràn bờ, vườn cây nhiệt đới, bến thuyền riêng. Nội thất Ý nhập khẩu toàn bộ.',
  'active'
),
(
  'Biệt thự Compound Thảo Điền đẳng cấp',
  'biet_thu', 'ho_chi_minh', 'Quận 2', '8 Đường Xuân Thủy',
  130000000000, 380, 4,
  'Biệt thự trong khu compound cao cấp Thảo Điền, an ninh nghiêm ngặt. Thiết kế Scandinavian tối giản, ánh sáng tự nhiên tối ưu. Sân vườn riêng 150m², hồ bơi chung khu.',
  'active'
),
(
  'Villa An Khánh 3 tầng hồ bơi vô cực',
  'villa', 'ho_chi_minh', 'Quận 2', '19 Đường Nguyễn Duy Trinh',
  110000000000, 350, 4,
  'Villa 3 tầng hiện đại với hồ bơi vô cực tầng thượng view toàn cảnh. Phòng khách thông tầng 6m, bếp mở cao cấp. Thiết kế tối ưu thông gió tự nhiên, gần metro An Phú.',
  'active'
),
(
  'Villa phong cách Á Đông, vườn rộng 800m²',
  'villa', 'ho_chi_minh', 'Quận 2', '33 Đường Lê Văn Thịnh',
  175000000000, 700, 6,
  'Villa kiến trúc Á Đông độc đáo kết hợp hiện đại, sân vườn Nhật rộng 800m², ao cá Koi. 6 phòng ngủ rộng rãi, phòng thờ trang trọng, nhà ngang phụ. Cổng gỗ và tường đá tự nhiên.',
  'sold'
),
(
  'Villa Bình Thạnh view sông Sài Gòn',
  'villa', 'ho_chi_minh', 'Bình Thạnh', '10 Đường Xô Viết Nghệ Tĩnh',
  125000000000, 400, 4,
  'Villa sang trọng view trực diện sông Sài Gòn và Landmark 81. Thiết kế contemporary với kính cường lực toàn diện. Hồ bơi riêng, rooftop garden, thang máy, gara ngầm.',
  'active'
),
(
  'Biệt thự Bình Thạnh sân thượng, hồ bơi',
  'biet_thu', 'ho_chi_minh', 'Bình Thạnh', '55 Đường Đinh Bộ Lĩnh',
  90000000000, 310, 3,
  'Biệt thự phố 3 tầng thiết kế thông minh với sân thượng hồ bơi. 3 phòng ngủ master suite, phòng gym riêng, văn phòng tại gia. Gần cầu Văn Thánh, tiện di chuyển trung tâm.',
  'active'
),
(
  'Villa compound Bình Thạnh an ninh 24/7',
  'villa', 'ho_chi_minh', 'Bình Thạnh', '22 Đường Nguyễn Hữu Cảnh',
  140000000000, 420, 5,
  'Villa nằm trong khu compound cao cấp ven sông, bảo vệ an ninh 24/7 với camera AI. Hồ bơi riêng 12x6m, sân BBQ ngoài trời, gym và phòng giải trí khép kín.',
  'active'
),
(
  'Biệt thự hiện đại cạnh Landmark 81',
  'biet_thu', 'ho_chi_minh', 'Bình Thạnh', '7 Đường Nguyễn Cửu Vân',
  165000000000, 480, 5,
  'Biệt thự vị trí kim cương cách Landmark 81 chỉ 500m. Thiết kế minimalist tinh tế, nội thất Bộ B&B Italia nhập khẩu Italy. Rooftop infinity pool, view toàn cảnh thành phố.',
  'active'
),
(
  'Villa phong cách Bali, vườn nhiệt đới',
  'villa', 'ho_chi_minh', 'Bình Thạnh', '38 Đường Nơ Trang Long',
  95000000000, 340, 4,
  'Villa thiết kế Bali thuần tuý với vật liệu tự nhiên: đá bazan, gỗ teak, tre. Vườn nhiệt đới 200m², hồ bơi nước mặn, sala ngoài trời. Không gian thiền định và yoga.',
  'rented'
),
(
  'Biệt thự cổ điển Pháp Quận 3, 5 phòng ngủ',
  'biet_thu', 'ho_chi_minh', 'Quận 3', '12 Đường Võ Thị Sáu',
  195000000000, 550, 5,
  'Biệt thự cổ điển kiến trúc Pháp thế kỷ XX được phục dựng nguyên vẹn. 5 phòng ngủ cao 4m, parquet gỗ sồi, trần thạch cao chạm khắc. Vị trí trung tâm quận 3, hiếm có.',
  'active'
),
(
  'Villa Địa Trung Hải Quận 3 trung tâm',
  'villa', 'ho_chi_minh', 'Quận 3', '20 Đường Nam Kỳ Khởi Nghĩa',
  155000000000, 430, 5,
  'Villa phong cách Địa Trung Hải với tường trắng, mái ngói đỏ đặc trưng. Sân trong courtyard với đài phun nước, vườn olive. 5 phòng ngủ cao cấp, phòng rượu, garage 3 xe.',
  'active'
),
(
  'Biệt thự phố Quận 3 gần Hồ Con Rùa',
  'biet_thu', 'ho_chi_minh', 'Quận 3', '5 Đường Trần Cao Vân',
  120000000000, 360, 4,
  'Biệt thự phố 4 tầng vị trí đắc địa cách Hồ Con Rùa 200m. Thiết kế Art Deco hiện đại, nội thất thương hiệu Molteni&C. Sân thượng panorama, thang máy riêng.',
  'active'
),
(
  'Villa Quận 3 hồ bơi sân thượng thoáng mát',
  'villa', 'ho_chi_minh', 'Quận 3', '17 Đường Lê Quý Đôn',
  170000000000, 490, 5,
  'Villa 5 tầng thiết kế tropical modern với hồ bơi sân thượng nhìn ra toàn thành phố. Kính two-way toàn bộ mặt tiền, phòng khách 8m thông tầng. Trang bị smarthome Crestron.',
  'active'
),
(
  'Biệt thự Quận 3 nội thất cao cấp 4 phòng ngủ',
  'biet_thu', 'ho_chi_minh', 'Quận 3', '9 Đường Tú Xương',
  80000000000, 300, 4,
  'Biệt thự phố thiết kế đương đại, nội thất do kiến trúc sư người Ý thực hiện. 4 phòng ngủ suite đầy đủ, phòng làm việc, bếp mở Bulthaup. Cây xanh phủ kín mặt tiền.',
  'sold'
),
(
  'Villa Phú Mỹ Hưng đẳng cấp quốc tế',
  'villa', 'ho_chi_minh', 'Quận 7', '3 Đường Nguyễn Lương Bằng',
  145000000000, 460, 5,
  'Villa trong khu đô thị Phú Mỹ Hưng chuẩn quốc tế, môi trường sống lý tưởng cho gia đình. 5 phòng ngủ, hồ bơi riêng, sân vườn 300m², gần trường RMIT và Crescent Mall.',
  'active'
),
(
  'Biệt thự Quận 1 trung tâm, cơ hội hiếm có',
  'biet_thu', 'ho_chi_minh', 'Quận 1', '25 Đường Phùng Khắc Khoan',
  190000000000, 540, 5,
  'Biệt thự siêu hiếm ngay trung tâm Quận 1, đất mặt tiền 12m. Thiết kế Neo-Classical, nội thất Baroque đẳng cấp. Tiềm năng khai thác thương mại cao, cách Nhà Thờ Đức Bà 5 phút.',
  'active'
),
(
  'Villa Tây Hồ phong cách Nhật Bản',
  'villa', 'ha_noi', 'Tây Hồ', '47 Đường Đặng Thai Mai',
  160000000000, 470, 5,
  'Villa phong cách Nhật Bản Wabi-sabi trên con đường Đặng Thai Mai thơ mộng. Vườn Nhật 250m² với hòn non bộ, suối nhân tạo. 5 phòng ngủ gỗ hinoki tự nhiên, view hồ Tây.',
  'active'
),
(
  'Biệt thự Cầu Giấy 4 tầng nội thất cao cấp',
  'biet_thu', 'ha_noi', 'Cầu Giấy', '30 Đường Trần Thái Tông',
  85000000000, 320, 4,
  'Biệt thự 4 tầng thiết kế hiện đại tại khu vực sôi động Cầu Giấy. 4 phòng ngủ cao cấp, phòng gym, sân thượng BBQ. Gần ĐH Quốc Gia, Keangnam, thuận tiện di chuyển toàn thành phố.',
  'active'
);

-- Seed ảnh cho từng property
INSERT INTO property_images (property_id, url, storage_path, order_index)
SELECT p.id, v.url, 'seed/' || p.name || '/' || v.idx, v.idx
FROM properties p
JOIN (VALUES
  -- Villa Thảo Điền hiện đại (7 ảnh)
  ('Villa Thảo Điền hiện đại, hồ bơi riêng','https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',0),
  ('Villa Thảo Điền hiện đại, hồ bơi riêng','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',1),
  ('Villa Thảo Điền hiện đại, hồ bơi riêng','https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',2),
  ('Villa Thảo Điền hiện đại, hồ bơi riêng','https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',3),
  ('Villa Thảo Điền hiện đại, hồ bơi riêng','https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80',4),
  ('Villa Thảo Điền hiện đại, hồ bơi riêng','https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',5),
  ('Villa Thảo Điền hiện đại, hồ bơi riêng','https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',6),
  -- Biệt thự An Phú 5PN (7 ảnh)
  ('Biệt thự An Phú 5 phòng ngủ, gara đôi','https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',0),
  ('Biệt thự An Phú 5 phòng ngủ, gara đôi','https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',1),
  ('Biệt thự An Phú 5 phòng ngủ, gara đôi','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',2),
  ('Biệt thự An Phú 5 phòng ngủ, gara đôi','https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',3),
  ('Biệt thự An Phú 5 phòng ngủ, gara đôi','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',4),
  ('Biệt thự An Phú 5 phòng ngủ, gara đôi','https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',5),
  ('Biệt thự An Phú 5 phòng ngủ, gara đôi','https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',6),
  -- Villa Thủ Thiêm view sông (8 ảnh)
  ('Villa Thủ Thiêm view sông, phong cách resort','https://images.unsplash.com/photo-1574691250077-03a929faece5?w=800&q=80',0),
  ('Villa Thủ Thiêm view sông, phong cách resort','https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80',1),
  ('Villa Thủ Thiêm view sông, phong cách resort','https://images.unsplash.com/photo-1505873242700-f289a29e1724?w=800&q=80',2),
  ('Villa Thủ Thiêm view sông, phong cách resort','https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80',3),
  ('Villa Thủ Thiêm view sông, phong cách resort','https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80',4),
  ('Villa Thủ Thiêm view sông, phong cách resort','https://images.unsplash.com/photo-1543489822-c49534f3271f?w=800&q=80',5),
  ('Villa Thủ Thiêm view sông, phong cách resort','https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',6),
  ('Villa Thủ Thiêm view sông, phong cách resort','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',7),
  -- Biệt thự Compound Thảo Điền (6 ảnh)
  ('Biệt thự Compound Thảo Điền đẳng cấp','https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',0),
  ('Biệt thự Compound Thảo Điền đẳng cấp','https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=800&q=80',1),
  ('Biệt thự Compound Thảo Điền đẳng cấp','https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80',2),
  ('Biệt thự Compound Thảo Điền đẳng cấp','https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80',3),
  ('Biệt thự Compound Thảo Điền đẳng cấp','https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',4),
  ('Biệt thự Compound Thảo Điền đẳng cấp','https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',5),
  -- Villa An Khánh 3 tầng (7 ảnh)
  ('Villa An Khánh 3 tầng hồ bơi vô cực','https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',0),
  ('Villa An Khánh 3 tầng hồ bơi vô cực','https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',1),
  ('Villa An Khánh 3 tầng hồ bơi vô cực','https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80',2),
  ('Villa An Khánh 3 tầng hồ bơi vô cực','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',3),
  ('Villa An Khánh 3 tầng hồ bơi vô cực','https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',4),
  ('Villa An Khánh 3 tầng hồ bơi vô cực','https://images.unsplash.com/photo-1505873242700-f289a29e1724?w=800&q=80',5),
  ('Villa An Khánh 3 tầng hồ bơi vô cực','https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80',6),
  -- Villa Á Đông vườn 800m² (8 ảnh)
  ('Villa phong cách Á Đông, vườn rộng 800m²','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',0),
  ('Villa phong cách Á Đông, vườn rộng 800m²','https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',1),
  ('Villa phong cách Á Đông, vườn rộng 800m²','https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',2),
  ('Villa phong cách Á Đông, vườn rộng 800m²','https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',3),
  ('Villa phong cách Á Đông, vườn rộng 800m²','https://images.unsplash.com/photo-1574691250077-03a929faece5?w=800&q=80',4),
  ('Villa phong cách Á Đông, vườn rộng 800m²','https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80',5),
  ('Villa phong cách Á Đông, vườn rộng 800m²','https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',6),
  ('Villa phong cách Á Đông, vườn rộng 800m²','https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80',7),
  -- Villa Bình Thạnh view sông (7 ảnh)
  ('Villa Bình Thạnh view sông Sài Gòn','https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',0),
  ('Villa Bình Thạnh view sông Sài Gòn','https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',1),
  ('Villa Bình Thạnh view sông Sài Gòn','https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',2),
  ('Villa Bình Thạnh view sông Sài Gòn','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',3),
  ('Villa Bình Thạnh view sông Sài Gòn','https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80',4),
  ('Villa Bình Thạnh view sông Sài Gòn','https://images.unsplash.com/photo-1543489822-c49534f3271f?w=800&q=80',5),
  ('Villa Bình Thạnh view sông Sài Gòn','https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',6),
  -- Biệt thự Bình Thạnh sân thượng (6 ảnh)
  ('Biệt thự Bình Thạnh sân thượng, hồ bơi','https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',0),
  ('Biệt thự Bình Thạnh sân thượng, hồ bơi','https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80',1),
  ('Biệt thự Bình Thạnh sân thượng, hồ bơi','https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',2),
  ('Biệt thự Bình Thạnh sân thượng, hồ bơi','https://images.unsplash.com/photo-1574691250077-03a929faece5?w=800&q=80',3),
  ('Biệt thự Bình Thạnh sân thượng, hồ bơi','https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=800&q=80',4),
  ('Biệt thự Bình Thạnh sân thượng, hồ bơi','https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',5),
  -- Villa compound Bình Thạnh (7 ảnh)
  ('Villa compound Bình Thạnh an ninh 24/7','https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',0),
  ('Villa compound Bình Thạnh an ninh 24/7','https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',1),
  ('Villa compound Bình Thạnh an ninh 24/7','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',2),
  ('Villa compound Bình Thạnh an ninh 24/7','https://images.unsplash.com/photo-1505873242700-f289a29e1724?w=800&q=80',3),
  ('Villa compound Bình Thạnh an ninh 24/7','https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',4),
  ('Villa compound Bình Thạnh an ninh 24/7','https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80',5),
  ('Villa compound Bình Thạnh an ninh 24/7','https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80',6),
  -- Biệt thự cạnh Landmark 81 (7 ảnh)
  ('Biệt thự hiện đại cạnh Landmark 81','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',0),
  ('Biệt thự hiện đại cạnh Landmark 81','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',1),
  ('Biệt thự hiện đại cạnh Landmark 81','https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',2),
  ('Biệt thự hiện đại cạnh Landmark 81','https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80',3),
  ('Biệt thự hiện đại cạnh Landmark 81','https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',4),
  ('Biệt thự hiện đại cạnh Landmark 81','https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',5),
  ('Biệt thự hiện đại cạnh Landmark 81','https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80',6),
  -- Villa Bali vườn nhiệt đới (7 ảnh)
  ('Villa phong cách Bali, vườn nhiệt đới','https://images.unsplash.com/photo-1596596542815-ffad4c1539a9?w=800&q=80',0),
  ('Villa phong cách Bali, vườn nhiệt đới','https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',1),
  ('Villa phong cách Bali, vườn nhiệt đới','https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80',2),
  ('Villa phong cách Bali, vườn nhiệt đới','https://images.unsplash.com/photo-1574691250077-03a929faece5?w=800&q=80',3),
  ('Villa phong cách Bali, vườn nhiệt đới','https://images.unsplash.com/photo-1543489822-c49534f3271f?w=800&q=80',4),
  ('Villa phong cách Bali, vườn nhiệt đới','https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80',5),
  ('Villa phong cách Bali, vườn nhiệt đới','https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',6),
  -- Biệt thự Pháp Quận 3 (7 ảnh)
  ('Biệt thự cổ điển Pháp Quận 3, 5 phòng ngủ','https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',0),
  ('Biệt thự cổ điển Pháp Quận 3, 5 phòng ngủ','https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',1),
  ('Biệt thự cổ điển Pháp Quận 3, 5 phòng ngủ','https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',2),
  ('Biệt thự cổ điển Pháp Quận 3, 5 phòng ngủ','https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',3),
  ('Biệt thự cổ điển Pháp Quận 3, 5 phòng ngủ','https://images.unsplash.com/photo-1505873242700-f289a29e1724?w=800&q=80',4),
  ('Biệt thự cổ điển Pháp Quận 3, 5 phòng ngủ','https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80',5),
  ('Biệt thự cổ điển Pháp Quận 3, 5 phòng ngủ','https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=800&q=80',6),
  -- Villa Địa Trung Hải Quận 3 (7 ảnh)
  ('Villa Địa Trung Hải Quận 3 trung tâm','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',0),
  ('Villa Địa Trung Hải Quận 3 trung tâm','https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',1),
  ('Villa Địa Trung Hải Quận 3 trung tâm','https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',2),
  ('Villa Địa Trung Hải Quận 3 trung tâm','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',3),
  ('Villa Địa Trung Hải Quận 3 trung tâm','https://images.unsplash.com/photo-1599793983690-e29da59ef1c2?w=800&q=80',4),
  ('Villa Địa Trung Hải Quận 3 trung tâm','https://images.unsplash.com/photo-1543489822-c49534f3271f?w=800&q=80',5),
  ('Villa Địa Trung Hải Quận 3 trung tâm','https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80',6),
  -- Biệt thự phố Quận 3 Hồ Con Rùa (7 ảnh)
  ('Biệt thự phố Quận 3 gần Hồ Con Rùa','https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',0),
  ('Biệt thự phố Quận 3 gần Hồ Con Rùa','https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',1),
  ('Biệt thự phố Quận 3 gần Hồ Con Rùa','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',2),
  ('Biệt thự phố Quận 3 gần Hồ Con Rùa','https://images.unsplash.com/photo-1574691250077-03a929faece5?w=800&q=80',3),
  ('Biệt thự phố Quận 3 gần Hồ Con Rùa','https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80',4),
  ('Biệt thự phố Quận 3 gần Hồ Con Rùa','https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',5),
  ('Biệt thự phố Quận 3 gần Hồ Con Rùa','https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',6),
  -- Villa Quận 3 hồ bơi sân thượng (8 ảnh)
  ('Villa Quận 3 hồ bơi sân thượng thoáng mát','https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',0),
  ('Villa Quận 3 hồ bơi sân thượng thoáng mát','https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',1),
  ('Villa Quận 3 hồ bơi sân thượng thoáng mát','https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80',2),
  ('Villa Quận 3 hồ bơi sân thượng thoáng mát','https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',3),
  ('Villa Quận 3 hồ bơi sân thượng thoáng mát','https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80',4),
  ('Villa Quận 3 hồ bơi sân thượng thoáng mát','https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80',5),
  ('Villa Quận 3 hồ bơi sân thượng thoáng mát','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',6),
  ('Villa Quận 3 hồ bơi sân thượng thoáng mát','https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',7),
  -- Biệt thự Quận 3 nội thất cao cấp (5 ảnh)
  ('Biệt thự Quận 3 nội thất cao cấp 4 phòng ngủ','https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',0),
  ('Biệt thự Quận 3 nội thất cao cấp 4 phòng ngủ','https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',1),
  ('Biệt thự Quận 3 nội thất cao cấp 4 phòng ngủ','https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',2),
  ('Biệt thự Quận 3 nội thất cao cấp 4 phòng ngủ','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',3),
  ('Biệt thự Quận 3 nội thất cao cấp 4 phòng ngủ','https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=800&q=80',4),
  -- Villa Phú Mỹ Hưng (9 ảnh)
  ('Villa Phú Mỹ Hưng đẳng cấp quốc tế','https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',0),
  ('Villa Phú Mỹ Hưng đẳng cấp quốc tế','https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',1),
  ('Villa Phú Mỹ Hưng đẳng cấp quốc tế','https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',2),
  ('Villa Phú Mỹ Hưng đẳng cấp quốc tế','https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',3),
  ('Villa Phú Mỹ Hưng đẳng cấp quốc tế','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',4),
  ('Villa Phú Mỹ Hưng đẳng cấp quốc tế','https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',5),
  ('Villa Phú Mỹ Hưng đẳng cấp quốc tế','https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80',6),
  ('Villa Phú Mỹ Hưng đẳng cấp quốc tế','https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80',7),
  ('Villa Phú Mỹ Hưng đẳng cấp quốc tế','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',8),
  -- Biệt thự Quận 1 trung tâm (8 ảnh)
  ('Biệt thự Quận 1 trung tâm, cơ hội hiếm có','https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',0),
  ('Biệt thự Quận 1 trung tâm, cơ hội hiếm có','https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',1),
  ('Biệt thự Quận 1 trung tâm, cơ hội hiếm có','https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',2),
  ('Biệt thự Quận 1 trung tâm, cơ hội hiếm có','https://images.unsplash.com/photo-1505873242700-f289a29e1724?w=800&q=80',3),
  ('Biệt thự Quận 1 trung tâm, cơ hội hiếm có','https://images.unsplash.com/photo-1543489822-c49534f3271f?w=800&q=80',4),
  ('Biệt thự Quận 1 trung tâm, cơ hội hiếm có','https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',5),
  ('Biệt thự Quận 1 trung tâm, cơ hội hiếm có','https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80',6),
  ('Biệt thự Quận 1 trung tâm, cơ hội hiếm có','https://images.unsplash.com/photo-1574691250077-03a929faece5?w=800&q=80',7),
  -- Villa Tây Hồ Nhật Bản (8 ảnh)
  ('Villa Tây Hồ phong cách Nhật Bản','https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',0),
  ('Villa Tây Hồ phong cách Nhật Bản','https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',1),
  ('Villa Tây Hồ phong cách Nhật Bản','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',2),
  ('Villa Tây Hồ phong cách Nhật Bản','https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80',3),
  ('Villa Tây Hồ phong cách Nhật Bản','https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',4),
  ('Villa Tây Hồ phong cách Nhật Bản','https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',5),
  ('Villa Tây Hồ phong cách Nhật Bản','https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',6),
  ('Villa Tây Hồ phong cách Nhật Bản','https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80',7),
  -- Biệt thự Cầu Giấy (6 ảnh)
  ('Biệt thự Cầu Giấy 4 tầng nội thất cao cấp','https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',0),
  ('Biệt thự Cầu Giấy 4 tầng nội thất cao cấp','https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',1),
  ('Biệt thự Cầu Giấy 4 tầng nội thất cao cấp','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',2),
  ('Biệt thự Cầu Giấy 4 tầng nội thất cao cấp','https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',3),
  ('Biệt thự Cầu Giấy 4 tầng nội thất cao cấp','https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',4),
  ('Biệt thự Cầu Giấy 4 tầng nội thất cao cấp','https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',5)
) AS v(pname, url, idx) ON p.name = v.pname;
