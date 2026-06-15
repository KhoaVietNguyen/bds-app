ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_type_check;
ALTER TABLE properties ADD CONSTRAINT properties_type_check
  CHECK (type IN ('villa', 'biet_thu', 'can_ho_dich_vu', 'chung_cu', 'penthouse'));
