## Draw2Deploy Frontend

React + Tailwind client for the Draw2Deploy backend (`http://localhost:9000`). It focuses on authentication flows and surfaces backend error messages exactly as returned by the API.

### Backend endpoints used

- `POST /public/auth/login`
  - Body: `{ "email": "user@email.com", "password": "secret" }`
  - Response: `ApiResponseDto<string>` where `data` is the JWT.  
- `POST /public/auth/register`
  - Body: `{ "firstName": "Jane", "lastName": "Doe", "email": "...", "password": "..." }`
  - Response: `ApiResponseDto<User>` and a verification email is sent asynchronously.
- `GET /public/auth/verify`
  - Requires `Authorization: Bearer <JWT>` to mark the authenticated user as verified.

The resend button calls `POST ${VITE_RESEND_ENDPOINT}` (default `/api/resend-verification`) with `{ "email": "..." }`. Update the endpoint once the backend route is available.

### Getting started

```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file (ignored by git) if you need to override any of these variables:

```
VITE_API_BASE_URL=http://localhost:9000
VITE_RESEND_ENDPOINT=/api/resend-verification
```

The React app stores the JWT in `localStorage` under the `d2d_token` key so subsequent requests automatically include it.

### Features

- Tailwind-powered login and sign-up screens with inline validation.
- Clear surfacing of backend error messages (e.g., `Invalid username or password`, `Email not verified`).
- Collapsible “Resend verification email” panel on both auth pages.
- API layer (Axios) configured with base URL + interceptor to attach the persisted JWT.

