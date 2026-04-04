# Finance Data Processing and Access Control Backend

A backend system for a finance dashboard that supports user role management, financial records CRUD, dashboard analytics, and role-based access control.

Built with **Node.js**, **Express**, **MongoDB**, and **Mongoose**.

---

## Tech Stack

| Layer        | Choice             | Reason                                      |
|--------------|--------------------|---------------------------------------------|
| Runtime      | Node.js            | Familiar, async-first, great ecosystem      |
| Framework    | Express.js         | Lightweight, unopinionated, widely used     |
| Database     | MongoDB + Mongoose | Flexible schema, good for financial records |
| Auth         | JWT (jsonwebtoken) | Stateless, scalable token-based auth        |
| Validation   | express-validator  | Declarative, field-level error messages     |
| Rate Limiting| express-rate-limit | Protect against brute force attacks         |

---

## Project Structure

```
finance-backend/
├── config/
│   └── db.js                  # MongoDB connection
├── src/
│   ├── app.js                 # Entry point, middleware setup, route mounting
│   ├── models/
│   │   ├── User.js            # User schema (name, email, password, role, isActive)
│   │   └── Record.js          # Financial record schema (amount, type, category, date, notes)
│   ├── controllers/
│   │   ├── authController.js      # Register, login, get current user
│   │   ├── userController.js      # Admin: list, update, delete users
│   │   ├── recordController.js    # CRUD for financial records
│   │   └── dashboardController.js # Aggregated analytics endpoints
│   ├── routes/
│   │   ├── auth.js            # /api/auth
│   │   ├── users.js           # /api/users
│   │   ├── records.js         # /api/records
│   │   └── dashboard.js       # /api/dashboard
│   ├── middleware/
│   │   ├── auth.js            # JWT verification + role-based authorization
│   │   ├── validators.js      # Input validation rules
│   │   └── errorHandler.js    # Centralized error handling + 404
│   └── utils/
│       └── seed.js            # Seed script for test data
├── .env.example
├── package.json
└── README.md
```

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd finance-backend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/finance_dashboard
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 3. Seed the database (optional but recommended)

```bash
npm run seed
```

This creates 3 test users:

| Role    | Email                  | Password    |
|---------|------------------------|-------------|
| Admin   | admin@finance.com      | admin123    |
| Analyst | analyst@finance.com    | analyst123  |
| Viewer  | viewer@finance.com     | viewer123   |

### 4. Start the server

```bash
# Development (with nodemon auto-reload)
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:5000`

Health check: `GET http://localhost:5000/health`

---

## Role-Based Access Control

Three roles with clearly enforced permissions:

| Action                        | Viewer | Analyst | Admin |
|-------------------------------|--------|---------|-------|
| View financial records        | ✅     | ✅      | ✅    |
| Search & filter records       | ✅     | ✅      | ✅    |
| View recent activity          | ✅     | ✅      | ✅    |
| View dashboard summary        | ❌     | ✅      | ✅    |
| View category totals          | ❌     | ✅      | ✅    |
| View monthly/weekly trends    | ❌     | ✅      | ✅    |
| Create financial records      | ❌     | ❌      | ✅    |
| Update financial records      | ❌     | ❌      | ✅    |
| Delete financial records      | ❌     | ❌      | ✅    |
| Manage users (CRUD)           | ❌     | ❌      | ✅    |

Access control is enforced at the route level using the `authorize(...roles)` middleware.

---

## API Documentation

All protected routes require the header:
```
Authorization: Bearer <your_jwt_token>
```

---

### Auth Endpoints

#### Register
```
POST /api/auth/register
```
Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
> Note: Self-registration always defaults to `viewer` role. Admins can create users with any role via this endpoint when authenticated.

#### Login
```
POST /api/auth/login
```
Body:
```json
{
  "email": "admin@finance.com",
  "password": "admin123"
}
```
Response:
```json
{
  "success": true,
  "data": {
    "user": { "_id": "...", "name": "Admin User", "role": "admin" },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Current User
```
GET /api/auth/me
```
Returns the logged-in user's profile.

---

### User Management (Admin Only)

#### List All Users
```
GET /api/users?role=analyst&isActive=true&page=1&limit=10
```

#### Get User by ID
```
GET /api/users/:id
```

#### Update User Role or Status
```
PATCH /api/users/:id
```
Body (all fields optional):
```json
{
  "role": "analyst",
  "isActive": false,
  "name": "Updated Name"
}
```

#### Delete User
```
DELETE /api/users/:id
```

---

### Financial Records

#### List Records (with filters + pagination)
```
GET /api/records?type=income&category=salary&startDate=2026-01-01&endDate=2026-03-31&page=1&limit=10&search=salary
```
Query params:
- `type` — `income` or `expense`
- `category` — e.g. `salary`, `food`, `rent`, etc.
- `startDate`, `endDate` — ISO 8601 date strings
- `search` — searches within notes field
- `page`, `limit` — pagination

#### Get Record by ID
```
GET /api/records/:id
```

#### Create Record (Admin)
```
POST /api/records
```
Body:
```json
{
  "amount": 75000,
  "type": "income",
  "category": "salary",
  "date": "2026-04-01",
  "notes": "April salary payment"
}
```

Valid categories: `salary`, `freelance`, `investment`, `food`, `transport`, `utilities`, `entertainment`, `healthcare`, `education`, `rent`, `other`

#### Update Record (Admin)
```
PUT /api/records/:id
```
Body: any subset of record fields.

#### Delete Record (Admin) — Soft Delete
```
DELETE /api/records/:id
```
Records are soft-deleted (marked `isDeleted: true`) — they are not permanently removed from the database.

---

### Dashboard Analytics

#### Financial Summary
```
GET /api/dashboard/summary
```
Response:
```json
{
  "data": {
    "totalIncome": 268000,
    "totalExpenses": 31200,
    "netBalance": 236800
  }
}
```

#### Category Totals
```
GET /api/dashboard/category-totals?type=expense
```
Returns total and count per category (optionally filtered by type).

#### Monthly Trends
```
GET /api/dashboard/monthly-trends?year=2026
```
Returns income and expense totals for all 12 months of the given year.

#### Weekly Trends
```
GET /api/dashboard/weekly-trends
```
Returns day-by-day breakdown for the last 7 days.

#### Recent Activity
```
GET /api/dashboard/recent-activity?limit=5
```
Returns the most recently created records. Available to all roles.

---

## Error Handling

All errors return a consistent JSON shape:

```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

Status codes used:
- `200` — Success
- `201` — Created
- `400` — Bad request / validation failure
- `401` — Unauthenticated (missing or invalid token)
- `403` — Forbidden (authenticated but insufficient role)
- `404` — Resource not found
- `409` — Conflict (e.g. duplicate email)
- `429` — Rate limit exceeded
- `500` — Internal server error

---

## Optional Enhancements Implemented

- ✅ **JWT Authentication** — Token-based, stateless auth
- ✅ **Pagination** — All list endpoints support `page` and `limit`
- ✅ **Search** — Records searchable by notes keyword
- ✅ **Soft Delete** — Records marked `isDeleted` with `deletedAt` timestamp
- ✅ **Rate Limiting** — 100 req/15min globally, 10 req/15min on auth routes
- ✅ **Input Validation** — Field-level validation with clear error messages
- ✅ **Seed Script** — One command to populate test data

---

## Assumptions Made

1. **Self-registration defaults to `viewer`**— Only admins can assign elevated roles. This prevents privilege escalation via open registration.

2. **Soft delete for records** — Financial records are never permanently deleted to preserve audit integrity. Hard delete would be a separate admin-only operation if needed.

3. **Category list is predefined** — A fixed enum was chosen over free-text to ensure data consistency for analytics grouping. Can be extended.

4. **Analysts created records count** — Analysts are creators too (in seed data) because the assignment says they "view records and access insights", but in practice they may contribute data. In the API, only admins can create via REST. The seed bypasses this for realistic data.

5. **Password hashing** — bcryptjs with 12 salt rounds is used. This is secure for an internship project context.

---

## Tradeoffs Considered

| Decision | Alternative | Why I chose this |
|---|---|---|
| MongoDB | PostgreSQL | Faster to set up, flexible schema for variable financial records |
| JWT | Sessions | Stateless, no need for session store |
| Soft delete | Hard delete | Preserves financial audit trail |
| Fixed categories | Free-text category | Enables accurate aggregation queries |
| express-validator | Joi / Zod | Native Express integration, simpler setup |
