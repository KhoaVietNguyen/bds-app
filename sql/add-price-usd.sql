-- Migration: thêm cột price_usd vào bảng properties
ALTER TABLE properties ADD COLUMN IF NOT EXISTS price_usd BIGINT;
