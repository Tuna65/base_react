# AI Admin Frontend

React 18, TypeScript, Vite 4, Ant Design 6 and Tailwind CSS admin application.

## Run locally

Use Node.js 22 and run commands from this directory:

```powershell
npm ci
# Create .env from .env.example only if it does not already exist.
npm run dev
```

The current dev script serves port **8001**. Set `VITE_GATEWAY_URL=/api/v1`;
Vite proxies `/api/v1` to gateway at `http://127.0.0.1:8100`.
Restart Vite after changing environment settings. In production, configure the
hosting reverse proxy for `/api/v1` or use the appropriate gateway URL/CORS setup.
Only public browser configuration belongs in `VITE_*` variables.

## Pages

| Route | Purpose |
| --- | --- |
| `/login` | Username/email and password authentication |
| `/dashboard` | Landing page after login; currently a placeholder |
| `/users` | User CRUD, roles and branch assignment |
| `/roles` | Role CRUD and permission selection |
| `/branches` | Branch CRUD, OCR CCU and LLM CCU |
| `/documents` | File upload, document CRUD, content and extraction results |
| `/llm` | Connection settings, agent/skill CRUD, Queue & CCU |
| `/ocr` | Connection settings, Queue & CCU |

`/` redirects to login; successful login/session restoration opens dashboard.
The shared authenticated HTTP client stores `token` / `rf_token`, reads `/auth/me`,
refreshes expired access tokens through `/auth/refresh-token`, and clears invalid
sessions. Sign out clears local credentials.

## Queue configuration

`ocr_global_ccu` and `llm_global_ccu` are independent system-wide limits; each also
respects the branch limit. Zero pauses new jobs for that stage. Batch size and
retry settings are shared. LLM settings save without overwriting OCR capacity.
Both pages currently use the gateway `/admin/ocr/queue-settings` endpoint and its
`ocr.queue_settings.read/update` permissions. Queue tabs are kept in the URL.

## UI conventions

- Import base controls from `src/components` and icons from `components/Icons`.
- Keep page-specific components in `src/pages/<page>/components`.
- Style with Tailwind; admin content occupies the available width without a max-width cap.
- Header Light/Dark switch persists `app-theme`; dialogs and dropdowns inherit the theme.
- Use `useSearchQuery` for tab state that should survive refresh.

## Validation and build

```powershell
node --test tests/auth.test.cjs tests/llm.test.cjs
npm run build
npm run preview
```

`npm run build` runs TypeScript checking followed by Vite. Legacy unused components
and hooks still reference removed upload/category/product APIs and registration
helpers; those existing TypeScript errors must be resolved before a full build can
pass. A standalone Vite bundle does not validate those types.
Gateway integration tests also exercise the frontend API clients against controllers.

## Integration status

Document upload currently uses a fake S3 URL in gateway. Automated document-to-LLM
extraction is still a stub. Saved model connection settings do not automatically
replace the Python runtime environment. Do not interpret saved settings as proof
that inference or object storage is connected.
