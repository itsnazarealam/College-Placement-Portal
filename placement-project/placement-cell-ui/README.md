# Placement Cell UI

React frontend for the College Placement Cell Management System. Talks to the Spring Boot API with JWT authentication.

## Run locally

### Backend (`Placement-check`)

```bash
cd ../Placement-check
mvn spring-boot:run
```

API listens on **http://localhost:8080**. Ensure MySQL is running and `src/main/resources/application.properties` points at your DB.

### Frontend (`placement-cell-ui`)

```bash
npm install
npm run dev
```

Vite app on **http://localhost:5173**. API base URL is set via `VITE_API_URL` in `.env` (defaults to `http://localhost:8080`).

## Auth & roles

1. Register users with `POST /user/register` (or company self-register on `/company/register`).
2. Login returns `{ token, role, username, userId, userMail }`. The token is stored in `localStorage` and sent as `Authorization: Bearer <token>` on every request.
3. On refresh, `GET /user/me` rehydrates the session.

| Role | Login page | Lands on |
|------|------------|----------|
| `ADMIN` | `/admin/login` | `/admin/upload` |
| `STUDENT` | `/student/login` | `/student/dashboard` |
| `COMPANY` | `/company/login` | `/company/dashboard` |

Public routes: `/`, `/companies`, `/login`, `/eligibility`, `/company/register`. Admin/student/company dashboards are wrapped in `ProtectedRoute`.

## Notes

- Admin Excel upload parses `.xlsx` client-side, then `POST /Student/addAll`.
- Public companies list uses `GET /api/companies` (approved only, no JWT).
- Student profile for eligibility comes from `GET /Student/me` (email must match the JWT subject).
