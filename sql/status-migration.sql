-- Migration: tách trạng thái 'active' thành 'selling' / 'renting'
-- Chạy trong Supabase SQL Editor (project đang có data, KHÔNG drop bảng)

ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_status_check;

-- Data cũ 'active' chuyển hết về 'selling' — record nào thực ra là cho thuê
-- thì vào admin sửa lại thành 'Đang cho thuê'
UPDATE properties SET status = 'selling' WHERE status = 'active';

ALTER TABLE properties ALTER COLUMN status SET DEFAULT 'selling';

ALTER TABLE properties ADD CONSTRAINT properties_status_check
  CHECK (status IN ('selling', 'renting', 'sold', 'rented'));
