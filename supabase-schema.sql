-- Chạy file này trong Supabase SQL Editor
-- Lưu ý: script này DROP và recreate toàn bộ bảng

-- Xoá bảng cũ (nếu có) để áp dụng schema mới
DROP TABLE IF EXISTS property_images CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP SEQUENCE IF EXISTS property_seq CASCADE;

-- Sequence cho ID đẹp
CREATE SEQUENCE property_seq START 1;

-- Bảng bất động sản
CREATE TABLE IF NOT EXISTS properties (
  id          TEXT PRIMARY KEY DEFAULT 'BDS-' || LPAD(nextval('property_seq')::text, 5, '0'),
  name        TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('villa', 'biet_thu', 'can_ho_dich_vu', 'chung_cu')),
  city        TEXT NOT NULL CHECK (city IN ('ha_noi', 'ho_chi_minh')),
  district    TEXT NOT NULL,
  address     TEXT,
  price       BIGINT,
  price_usd   BIGINT,
  area_sqm    INTEGER,
  bedrooms    INTEGER,
  description TEXT,
  status      TEXT DEFAULT 'selling' CHECK (status IN ('selling', 'renting', 'sold', 'rented', 'vacant')),
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Bảng ảnh
CREATE TABLE IF NOT EXISTS property_images (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id  TEXT REFERENCES properties(id) ON DELETE CASCADE,
  url          TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  order_index  INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- Index tìm kiếm nhanh
CREATE INDEX IF NOT EXISTS idx_properties_type     ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_city     ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_district ON properties(district);
CREATE INDEX IF NOT EXISTS idx_properties_status   ON properties(status);
CREATE INDEX IF NOT EXISTS idx_images_property   ON property_images(property_id);

-- Row Level Security (public read, auth write)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;

-- Cho phép mọi người đọc
CREATE POLICY "public_read_properties"
  ON properties FOR SELECT USING (true);

CREATE POLICY "public_read_images"
  ON property_images FOR SELECT USING (true);

-- Chỉ user đăng nhập mới được ghi
CREATE POLICY "auth_write_properties"
  ON properties FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "auth_write_images"
  ON property_images FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
