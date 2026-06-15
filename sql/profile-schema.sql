-- Chạy file này trong Supabase SQL Editor (an toàn, không đụng bảng properties)
-- Bảng hồ sơ sale (singleton — chỉ 1 dòng id = 1)

CREATE TABLE IF NOT EXISTS profile (
  id         INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  name       TEXT NOT NULL DEFAULT '',
  phone      TEXT,
  bio        TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tạo sẵn dòng duy nhất
INSERT INTO profile (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- RLS: public đọc, auth ghi
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_profile" ON profile;
CREATE POLICY "public_read_profile"
  ON profile FOR SELECT USING (true);

DROP POLICY IF EXISTS "auth_write_profile" ON profile;
CREATE POLICY "auth_write_profile"
  ON profile FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
