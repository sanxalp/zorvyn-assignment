## Endpoint walkthrough (how to use Swagger UI for everything)

This section is a step-by-step guide you can follow in Swagger UI.

### 0) Open the docs UI

- **Local**: `http://localhost:3000/api/docs`
- **Hosted**: `https://sanxalp.github.io/zorvyn-assignment/`

### 1) Health check (no auth)

- **Endpoint**: `GET /health`
- **How**: expand the endpoint → **Try it out** → **Execute**
- **Expected**: `200` with `{ "status": "ok" }`

### 2) Auth (get a token)

Use one of the seeded users (password is always `password123`):

- **Admin**: `admin@example.com`
- **Analyst**: `analyst@example.com`
- **Viewer**: `viewer@example.com`

**Login**
- **Endpoint**: `POST /api/auth/login`
- **How**: **Try it out** → paste JSON body → **Execute**
- **Expected**: `200` with `data.token`

**Authorize Swagger UI**
- Click **Authorize** (top-right)
- Paste: `Bearer <token-from-login>`
- Click **Authorize** and close the modal

### 3) Dashboard (VIEWER / ANALYST / ADMIN)

- **Endpoint**: `GET /api/dashboard/summary`
- **Who can call it**: any authorized user
- **Expected**: totals (`totalIncome`, `totalExpense`, `netBalance`), plus `categoryTotals` and `recentActivity`

### 4) Records (ANALYST / ADMIN for read; ADMIN for write)

**List records**
- **Endpoint**: `GET /api/records`
- **Who can call it**: `ANALYST`, `ADMIN`
- **How**:
  - Optionally set query params: `type`, `category`, `startDate`, `endDate`, `page`, `limit`
  - **Execute**
- **Expected**: `data` array + `metadata` pagination fields

**Get record by id**
- **Endpoint**: `GET /api/records/{id}`
- **Who can call it**: `ANALYST`, `ADMIN`
- **How**: copy an `id` from the list response → paste into `{id}` → **Execute**

**Create record**
- **Endpoint**: `POST /api/records`
- **Who can call it**: `ADMIN` only
- **How**:
  - Provide JSON body (`amount`, `type`, `category`, `date`, optional `notes`)
  - Use ISO date-time for `date` (example: `2023-10-25T10:00:00.000Z`)
  - **Execute**
- **Expected**: `201` with the created record

**Update record**
- **Endpoint**: `PUT /api/records/{id}`
- **Who can call it**: `ADMIN` only
- **How**: paste an existing `id` → provide any fields to update → **Execute**

**Delete record**
- **Endpoint**: `DELETE /api/records/{id}`
- **Who can call it**: `ADMIN` only
- **Expected**: `204 No Content`

### 5) Users (ADMIN only)

**List users**
- **Endpoint**: `GET /api/users`
- **Who can call it**: `ADMIN` only
- **Expected**: array of users

**Create user**
- **Endpoint**: `POST /api/users`
- **Who can call it**: `ADMIN` only
- **How**: provide `name`, `email`, `password`, optional `role` → **Execute**

**Update role / status**
- **Endpoint**: `PUT /api/users/{id}/role`
- **Who can call it**: `ADMIN` only
- **How**: copy a user `id` from the list → set `role` and/or `status` → **Execute**