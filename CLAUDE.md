# Ban Hang Admin — CLAUDE.md
- Bạn là trợ lý coding của Tuấn. Hãy gọi Anh xưng em trong tất cả các cuộc trò truyện.

## Project Overview
Admin dashboard cho hệ thống quản lý bán hàng. Frontend React + TypeScript, giao tiếp với backend qua REST API.

## Architecture

```
src/
├── apis/          # HTTP clients (axios) — mỗi file tương ứng 1 entity
├── components/    # Reusable UI components
├── configs/       # Hằng số cấu hình (storage keys, v.v.)
├── hooks/         # Custom React hooks
├── i18n/          # Dịch thuật: vi.json, en.json
├── layout/        # Layout, Header, ProtectedRoute
├── models/        # TypeScript interfaces (entity types)
├── pages/         # Feature pages (lazy-loaded)
├── store/         # Redux Toolkit slices
├── types/         # Additional TypeScript types
└── utils/         # Tiện ích, hằng số (Pathname, env, func)
```

## Key Conventions

### Routing
- Tất cả routes dùng slug tiếng Việt: `/don-hang`, `/san-pham`, `/nhan-vien`, v.v.
- Định nghĩa tập trung tại `src/utils/Pathname.ts` — luôn dùng `PATHNAME.*` thay vì hardcode string
- Mỗi feature có pattern: `INDEX / CREATE / DETAIL / EDIT` + helper `EDIT_ID(id?)` / `DETAIL_ID(id?)`
- Pages đăng ký tập trung trong `src/pages/index.tsx` qua `routerList`

### Pages & Lazy Loading
- Mỗi page dùng `React.lazy()` và wrap bằng `LazyLayout()` helper
- Thêm page mới: tạo file, export qua `src/pages/index.tsx`, đăng ký route trong `src/App.tsx`

### API Layer
- Base URL: `http://localhost:3070/api/v1`
- Axios instance duy nhất tại `src/apis/http.ts` — có interceptor tự refresh token (401/403)
- Mỗi entity có file API riêng trong `src/apis/`
- Dùng hook `useApi` / `useAsync` từ `src/apis/useApi.ts` cho async operations (có loading/status/error)

### State Management
- Redux Toolkit cho global state: auth, language, sidebar, pos, tanstackKey
- Local UI state dùng `useState`

### Path Alias
- `@/` → `src/` (cấu hình trong `vite.config.ts` và `tsconfig.json`)

### Styling
- Ant Design 6 cho component library, primary color: `#5932EA`
- Tailwind CSS cho utility classes
- Không mix inline styles với Tailwind khi không cần thiết

### Token Storage
- js-cookie qua `cookieStorageUtil` từ `src/service/storage.ts`
- Access token: 30 giây, Refresh token: 100 giờ
- Keys định nghĩa trong `src/configs/storage.ts` (STORAGE.TOKEN_KEY, STORAGE.REFRESH_TOKEN_KEY)

### i18n
- Hook `useTranslation()` từ react-i18next
- Translation files: `src/i18n/vi.json` và `src/i18n/en.json`

## Feature Modules (Pages)

| Route | Mô tả |
|---|---|
| `/dang-nhap` | Đăng nhập |
| `/dang-ky` | Đăng ký |
| `/don-hang` | Quản lý đơn hàng |
| `/san-pham` | Quản lý sản phẩm |
| `/phan-loai` | Quản lý phân loại |
| `/nhan-vien` | Quản lý nhân viên |
| `/khach-hang` | Quản lý khách hàng |
| `/nhap-hang` | Phiếu nhập hàng |
| `/shop` | Tạo cửa hàng |
