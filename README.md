# React + TypeScript + Vite + Antd + Tailwind css

## Using Node:20.10.0

## How to running
- For npm
   - Install lib

   ```bash
   npm install
   ```

   - Running
   ```bash
   npm run dev
   ```
---
- For yarn
   - Install lib

   ```bash
   yarn install
   ```

   - Running
   ```bash
   yarn dev
   ```


### Lib

- Axios / antd / tailwind css

### Deploy with docker

- ```bash
  docker compose up -d --build
  ```

---

**Author:**

# TuanPA - [@Facebook](https://www.facebook.com/tuan6597/)

# Preview: Ctrl + Shift + v


## Agent settings

Open **Settings** in the sidebar or navigate to `/setting` after signing in.

- **Skills**: create and edit a name, description, and system prompt.
- **Funcalls**: manage HTTP URLs, methods, JSON headers/query/parameters, and timeout.
- **Agents**: choose an optional skill and any number of funcalls. The form previews the selected skill prompt. Empty tool selection removes all assignments.
- Lists support search and pagination. Failed requests display errors and allow retry; deletion requires confirmation.

Configure `.env` before starting Vite:

```env
VITE_GATEWAY_URL=http://127.0.0.1:9961/api/v1
```

Run the gateway with its PostgreSQL configuration and `ADMIN_ORIGIN=http://localhost:5173` (or your frontend origin). Restart the services after changing environment variables. This settings API uses a separate gateway base URL so existing authentication and knowledge APIs keep their current configuration.


## AI solution login

The `/login` page now has one ordinary username/email and password form. It calls the gateway `/auth/login`; LDAP and Standard tabs were removed. After login it opens Settings. `Ghi nhớ đăng nhập` controls whether tokens are persistent or session cookies. Protected routes validate `/auth/me`; gateway requests automatically refresh expired access tokens. Sign out calls `/auth/logout` before clearing local credentials.

Auth, user, and Settings API clients all use `VITE_GATEWAY_URL`. Existing unrelated API clients retain their own base URL. To create the first account or an admin, see `../gate-way/src/modules/auth/README.md`.
