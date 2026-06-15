-- Bảng config động cho loại BĐS và trạng thái
CREATE TABLE IF NOT EXISTS property_config (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category     TEXT NOT NULL CHECK (category IN ('type', 'status')),
  value        TEXT NOT NULL,
  label        TEXT NOT NULL,
  color        TEXT,
  order_index  INTEGER DEFAULT 0,
  UNIQUE(category, value)
);

-- Seed loại BĐS
INSERT INTO property_config (category, value, label, order_index) VALUES
  ('type', 'villa',          'Villa',            0),
  ('type', 'biet_thu',       'Biệt thự',         1),
  ('type', 'can_ho_dich_vu', 'Căn hộ dịch vụ',  2),
  ('type', 'chung_cu',       'Chung cư',         3),
  ('type', 'penthouse',      'Penthouse',         4)
ON CONFLICT DO NOTHING;

-- Seed trạng thái
INSERT INTO property_config (category, value, label, color, order_index) VALUES
  ('status', 'selling', 'Đang bán',       'green',  0),
  ('status', 'renting', 'Cho thuê',       'blue',   1),
  ('status', 'sold',    'Đã bán',         'red',    2),
  ('status', 'rented',  'Đã cho thuê',   'orange', 3),
  ('status', 'vacant',  'Để trống',       'purple', 4)
ON CONFLICT DO NOTHING;

-- Bỏ check constraint cứng để type/status có thể linh hoạt từ DB
ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_type_check;
ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_status_check;

-- RLS
ALTER TABLE property_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_config"
  ON property_config FOR SELECT USING (true);

CREATE POLICY "auth_write_config"
  ON property_config FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
