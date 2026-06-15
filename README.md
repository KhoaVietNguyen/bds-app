# BĐS App — Nền tảng BĐS cá nhân

Ứng dụng quản lý và đăng tin bất động sản dành cho môi giới cá nhân. Xây dựng bằng Next.js 16 App Router + Supabase + Cloudinary.

---

## Tính năng

### Trang công khai (client)

- **Duyệt danh sách BĐS** — grid responsive, hiển thị ảnh bìa, giá, trạng thái, loại BĐS
- **Tìm kiếm & lọc** theo:
  - Từ khoá (tên hoặc mã BĐS)
  - Thành phố / Quận
  - Loại BĐS (Villa, Biệt thự, Căn hộ, Chung cư, Penthouse…)
  - Trạng thái (Đang bán, Cho thuê, Đã bán…)
  - Ngày đăng (7 / 30 / 90 / 180 ngày gần nhất)
  - **Khoảng giá** — thanh kéo dual-thumb với chip preset (VNĐ / USD)
- **Trang chi tiết BĐS**
  - Carousel ảnh fullscreen lightbox (swipe, blur backdrop)
  - Thông tin đầy đủ: diện tích, phòng ngủ, giá VNĐ & USD, địa chỉ, mô tả
  - Tải toàn bộ ảnh dưới dạng ZIP
  - Chia sẻ link / Zalo
  - Card liên hệ môi giới (gọi điện, nhắn Zalo)
- **Hồ sơ môi giới** — avatar, tên, số điện thoại hiển thị trên trang chủ
- **Dark mode / Light mode**

### Trang quản trị (admin — yêu cầu đăng nhập)

- **Đăng nhập** bằng email + mật khẩu (Supabase Auth)
- **Danh sách BĐS** — bảng với ảnh thumbnail, tìm kiếm & lọc, xoá, sửa
- **Thêm / Sửa BĐS**
  - Upload nhiều ảnh (nén trước khi upload)
  - Kéo thả để sắp xếp thứ tự ảnh
  - Nhập giá VNĐ lẫn USD
  - Chọn loại, trạng thái, địa điểm, mô tả
- **Quản lý hồ sơ** — tên, số điện thoại, bio, avatar
- **Quản lý cấu hình** (`/admin/config`)
  - CRUD loại BĐS và trạng thái
  - Chỉnh sửa nhãn và màu badge inline
  - Màu badge đồng bộ ra toàn bộ app (admin + client)

---

## Tech Stack

| Layer | Công nghệ |
|---|---|
| Framework | Next.js 16.2 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4, shadcn/ui (Base UI) |
| Database | Supabase (PostgreSQL + Auth + Storage) |
| Image CDN | Cloudinary |
| Carousel | Embla Carousel |
| Drag & Drop | dnd-kit |
| Icons | Lucide React |
| Notifications | Sonner |
| Theme | next-themes |
| Language | TypeScript |

---

## Cấu trúc thư mục

```
app/
  page.tsx                  # Trang chủ (public)
  bds/[id]/page.tsx         # Chi tiết BĐS (public)
  login/                    # Đăng nhập admin
  admin/
    page.tsx                # Danh sách BĐS
    new/                    # Thêm BĐS mới
    [id]/edit/              # Sửa BĐS
    profile/                # Hồ sơ môi giới
    config/                 # Cấu hình loại & trạng thái
  api/upload/               # API upload ảnh lên Cloudinary

components/
  ClientSearch.tsx          # Bộ lọc tìm kiếm phía client
  PriceRangeSlider.tsx      # Thanh kéo lọc giá
  ImageGallery.tsx          # Gallery + lightbox
  PropertyCard.tsx          # Card BĐS
  ConfigContext.tsx         # Context màu sắc config
  ConfigProvider.tsx        # Provider load config từ DB
  admin/
    AdminPropertyTable.tsx  # Bảng danh sách + filter admin
    PropertyForm.tsx        # Form thêm/sửa BĐS
    AdminSidebar.tsx        # Sidebar / FAB mobile

lib/
  data.ts                   # Server functions với 'use cache'
  config.ts                 # Helpers màu sắc, label
  actions.ts                # Server actions (revalidateTag)
  locations.ts              # Danh sách tỉnh/quận
  format.ts                 # Format giá, ngày tháng
  lang.ts                   # Chuỗi tiếng Việt

sql/
  supabase-schema.sql       # Schema đầy đủ
  add-property-config.sql   # Seed cấu hình mặc định
  seed.sql                  # Seed dữ liệu mẫu
```

---

## Cơ sở dữ liệu

### Bảng `properties`

| Cột | Kiểu | Mô tả |
|---|---|---|
| `id` | TEXT PK | Mã tự sinh: BDS-00001, BDS-00002… |
| `name` | TEXT | Tên BĐS |
| `type` | TEXT | Loại (villa, biet_thu, chung_cu…) |
| `city` | TEXT | Thành phố (ha_noi, ho_chi_minh) |
| `district` | TEXT | Quận/Huyện |
| `address` | TEXT | Địa chỉ chi tiết |
| `price` | BIGINT | Giá VNĐ |
| `price_usd` | BIGINT | Giá USD |
| `area_sqm` | INTEGER | Diện tích (m²) |
| `bedrooms` | INTEGER | Số phòng ngủ |
| `description` | TEXT | Mô tả |
| `status` | TEXT | Trạng thái (selling, renting, sold…) |
| `created_at` | TIMESTAMPTZ | Ngày đăng |

### Bảng `property_images`

| Cột | Kiểu | Mô tả |
|---|---|---|
| `id` | UUID PK | |
| `property_id` | TEXT FK | Khoá ngoại → properties |
| `url` | TEXT | URL ảnh |
| `storage_path` | TEXT | Đường dẫn storage |
| `order_index` | INTEGER | Thứ tự hiển thị |

### Bảng `property_config`

| Cột | Kiểu | Mô tả |
|---|---|---|
| `id` | UUID PK | |
| `category` | TEXT | `type` hoặc `status` |
| `value` | TEXT | Giá trị máy (villa, selling…) |
| `label` | TEXT | Nhãn hiển thị (Villa, Đang bán…) |
| `color` | TEXT | Màu badge (green, blue, red…) |
| `order_index` | INTEGER | Thứ tự hiển thị |

### Bảng `profile`

| Cột | Kiểu | Mô tả |
|---|---|---|
| `id` | INTEGER PK | Luôn = 1 (singleton) |
| `name` | TEXT | Tên môi giới |
| `phone` | TEXT | Số điện thoại |
| `bio` | TEXT | Giới thiệu |
| `avatar_url` | TEXT | Ảnh đại diện |

> RLS: tất cả bảng cho phép **SELECT public**, **INSERT/UPDATE/DELETE** yêu cầu đăng nhập.

---

## Thiết lập môi trường

### 1. Yêu cầu

- Node.js >= 20
- Tài khoản [Supabase](https://supabase.com)
- Tài khoản [Cloudinary](https://cloudinary.com)

### 2. Clone & cài đặt

```bash
git clone <repo-url>
cd bds-app
npm install
```

### 3. Biến môi trường

Tạo file `.env.local` ở thư mục gốc:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>

# Cloudinary
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
```

### 4. Khởi tạo Supabase

#### 4.1 Tạo database schema

Vào **Supabase Dashboard → SQL Editor**, chạy lần lượt:

```sql
-- 1. Tạo toàn bộ bảng và RLS
-- Copy nội dung file sql/supabase-schema.sql và paste vào SQL Editor

-- 2. Seed cấu hình loại & trạng thái mặc định
-- Copy nội dung file sql/add-property-config.sql và paste vào SQL Editor
```

#### 4.2 Tạo tài khoản admin

Vào **Supabase Dashboard → Authentication → Users → Add user**:
- Email: email của bạn
- Password: mật khẩu mạnh
- ✅ Auto Confirm User

### 5. Cấu hình Cloudinary

1. Vào [Cloudinary Console](https://console.cloudinary.com)
2. Copy **Cloud name**, **API Key**, **API Secret** vào `.env.local`

### 6. Chạy development

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000)

Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

### 7. Build production

```bash
npm run build
npm start
```

---

## Deploy

### Vercel (khuyến nghị)

```bash
npm i -g vercel
vercel
```

Thêm các biến môi trường trong **Vercel Dashboard → Project → Settings → Environment Variables**.

### Self-hosted (Docker / VPS)

```bash
npm run build
npm start
# hoặc dùng PM2
pm2 start npm --name bds-app -- start
```

---

## Caching

App sử dụng Next.js `'use cache'` directive với các tag:

| Tag | TTL | Mô tả |
|---|---|---|
| `properties` | stale 30s / expire 5m | Danh sách BĐS |
| `property-detail` | stale 30s / expire 5m | Chi tiết BĐS |
| `profile` | stale 10m / expire 24h | Hồ sơ môi giới |
| `property-config` | stale 1m / expire 1h | Loại & trạng thái |

Cache được xoá tự động qua `revalidateTag()` sau mỗi thao tác CRUD ở admin.

---

## Lọc giá

- **VNĐ**: nhập theo đơn vị **tỷ** (vd: `500tr`, `1.5ty`, `5 tỷ`)
- **USD**: nhập theo đơn vị **K$** (vd: `20K`, `2M`)
- Chip preset: bấm một lần để set max → slider xuất hiện với range 0 → max
- Kéo 2 nút tròn để thu hẹp khoảng
- Nhấn **Lọc** để áp dụng

---

## Ghi chú

- Ảnh được nén tự động trước khi upload (browser-image-compression)
- Mỗi lần thêm/sửa/xoá ở admin sẽ tự động revalidate cache
- App hỗ trợ đầy đủ dark mode, responsive mobile/desktop
- Sidebar admin trên mobile hiển thị dưới dạng FAB speed-dial góc phải màn hình
