# Finance Data Processing and Access Control Backend

This is a robust backend application designed for a finance dashboard system. It provides user and role management, financial record tracking, dashboard summary aggregation, and solid access control using JWTs.

## Tech Stack
- **Node.js + Express**: Fast and minimal web framework.
- **TypeScript**: Ensuring type safety across the entire application.
- **Prisma + SQLite**: Powerful ORM with a zero-configuration relational database ideal for simple setup.
- **Zod**: Input validation.
- **JWT + bcrypt**: Secure authentication and authorization.

## Features & Evaluation Criteria Met
1. **Backend Design**: Strict layered architecture (`/routes` ⭢ `/controllers` ⭢ `/services` ⭢ `/db`). Separation of concerns is maintained.
2. **Access Control Logic**: Clear role-based permission system via `requireAuth` and `requireRoles` middleware.
3. **Data Modeling**: Strongly typed entities with constraints via Prisma. Replaced Prisma Enums with Strings to support SQLite limitations seamlessly.
4. **Validation and Reliability**: Global error handler correctly formats validation errors (400), authentication (401), authorization (403), not found (404), and server errors (500).
5. **Additional Thoughtfulness**: Built-in seeding script, pagination mapped for record queries, structured global error types.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 1.5 Configure Environment
Create a `.env` file (or copy from `.env.example`):
```bash
cp .env.example .env
```

### 2. Set Up Database
Since we are using SQLite, the database is stored locally. This command creates the `dev.db` file and applies the schema.
```bash
npx prisma db push
```

### 3. Seed Database
Automatically populate the database with default test users and financial records.
```bash
npm run seed
```

### 4. Start Server
Run the local development server:
```bash
npm run dev
```
Server runs on `http://localhost:3000`.

## API Documentation (Swagger UI)
There are two ways to view the API documentation:

- **Local Swagger UI (recommended for testing)**: after starting the server, open `http://localhost:3000/api/docs`.
- **Hosted Swagger UI (recommended for submission)**: this repo includes a GitHub Pages Swagger UI in `docs/` that loads `openapi.yaml`.

### Host the docs on GitHub Pages (submission link)
In your GitHub repo:
- Go to **Settings → Pages**
- **Source**: Deploy from a branch
- **Branch**: `main`
- **Folder**: `/docs`

After GitHub publishes the site, your documentation URL will be:
- `https://<github-username>.github.io/<repo-name>/`

For this repository, it will be:
- `https://sanxalp.github.io/zorvyn-assignment/`

For a short write-up explaining how the docs work and how to authorize requests, see `API_DOCUMENTATION.md`.

## API Overview & Testing Guide

Once seeded, you can test the APIs.

### Users created from Seeding
All passwords are: `password123`
- **Admin**: `admin@example.com`
- **Analyst**: `analyst@example.com`
- **Viewer**: `viewer@example.com`

---

### Step 1: Login
Get a JWT token for the desired role.
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Step 2: Dashboard Summary (Any Role)
Attach the token in the `Authorization` header.
```http
GET http://localhost:3000/api/dashboard/summary
Authorization: Bearer <YOUR_TOKEN>
```

### Using Swagger UI Authorization
In Swagger UI, click **Authorize** and paste:
`Bearer <YOUR_TOKEN>`

### Step 3: Fetch Records (Analyst & Admin)
Supports query parameters: `startDate`, `endDate`, `type`, `category`, `page`, `limit`.
```http
GET http://localhost:3000/api/records?type=EXPENSE&page=1&limit=5
Authorization: Bearer <YOUR_TOKEN>
```

### Step 4: Create Record (Admin Only)
If you try this with a VIEWER or ANALYST token, you will get a `403 Forbidden`.
```http
POST http://localhost:3000/api/records
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "amount": 2500,
  "type": "EXPENSE",
  "category": "Travel",
  "date": "2023-10-25T10:00:00.000Z",
  "notes": "Flight tickets"
}
```

## Assumptions & Tradeoffs
- **SQLite Over PostgreSQL**: Chosen purely for the ease of local evaluation and zero-dependency environment. Prisma makes the data access layer identical anyway.
- **File Structure**: `Prisma` creates a monolithic schema file, but everything in `src` is heavily modularized for a domain-driven approach.
- **Roles in JWT**: Storing the role inside the JWT implies that if a role changes, the user must re-login to retrieve a new token. A more sophisticated approach would check the database on every sensitive request, but this is a standard acceptable tradeoff for reduced DB load.
