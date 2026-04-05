# Finance Data Processing and Access Control Backend

## Overview

This project is a backend system for a finance dashboard that enables:

* Role-based user management
* Financial records CRUD operations
* Dashboard analytics
* Secure access control
* API documentation via Swagger

The system is designed with a focus on **clean architecture, scalability, and maintainability**, fulfilling all requirements of a backend engineering assignment.

---

## Key Features

* Role-Based Access Control (RBAC)
* JWT Authentication & Authorization
* Financial Records CRUD with filtering & pagination
* Dashboard analytics (summary, trends, category insights)
* Swagger API documentation
* Centralized error handling
* Input validation using express-validator
* Rate limiting for security
* Soft delete for audit safety

---

## Design Philosophy

### 1. Separation of Concerns

* Routes → Handle HTTP requests
* Controllers → Business logic
* Models → Database schema
* Middleware → Auth, validation, error handling
* Config → DB, roles, Swagger setup

### 2. Role-Based Architecture

* Roles defined centrally (`config/roles.js`)
* Access enforced via middleware (`authorize(...)`)
* Prevents duplication and improves maintainability

### 3. Scalable API Design

* Pagination, filtering, and search supported
* APIs structured for dashboard consumption

### 4. Documentation First Approach

* Swagger integration for API exploration and testing
* Makes backend easier to understand and integrate

---

## Tech Stack

| Layer          | Technology         | Purpose                   |
| -------------- | ------------------ | ------------------------- |
| Runtime        | Node.js            | Async backend execution   |
| Framework      | Express.js         | Lightweight API framework |
| Database       | MongoDB + Mongoose | Flexible data modeling    |
| Authentication | JWT                | Stateless authentication  |
| Validation     | express-validator  | Input validation          |
| Security       | express-rate-limit | Prevent abuse             |
| Docs           | Swagger            | API documentation         |

---

## Project Structure

```
finance-backend/
├── config/
│   ├── db.js              # MongoDB connection
│   ├── roles.js           # Role definitions
│   └── swagger.js         # Swagger configuration
│
├── src/
│   ├── app.js             # Entry point
│
│   ├── controllers/       # Business logic
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── recordController.js
│   │   └── dashboardController.js
│
│   ├── models/            # Mongoose schemas
│   │   ├── User.js
│   │   └── Record.js
│
│   ├── routes/            # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── records.js
│   │   └── dashboard.js
│
│   ├── middleware/        # Middleware
│   │   ├── auth.js
│   │   ├── validators.js
│   │   └── errorHandler.js
│
│   └── utils/
│       └── seed.js        # Seed script
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## Setup Instructions

### Prerequisites

* Node.js v18+
* MongoDB (local or Atlas)

### Installation

```bash
git clone <repo-url>
cd finance-backend
npm install
```

### Environment Setup

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### Run Server

```bash
npm run dev
```

Server runs at:
👉 http://localhost:5000

---

## API Documentation (Swagger)

Swagger UI available at:

👉 http://localhost:5000/api-docs

You can:

* View all endpoints
* Test APIs directly
* Understand request/response structure

---

## Role-Based Access Control

Roles are defined in `config/roles.js`.

| Role    | Permissions                   |
| ------- | ----------------------------- |
| Viewer  | View records & activity       |
| Analyst | View records + analytics      |
| Admin   | Full access (users + records) |

### Implementation

* JWT authentication
* Role-based middleware authorization
* Route-level protection

---

## Financial Records Module

### Features

* CRUD operations
* Filtering:

  * Type (income / expense)
  * Category
  * Date range
* Search by notes
* Pagination

### Design Decisions

* Fixed categories → ensures consistent analytics
* Soft delete → preserves financial history

---

## Dashboard APIs

Provides aggregated insights:

* Total income & expenses
* Net balance
* Category totals
* Monthly trends
* Weekly trends
* Recent activity

### Purpose

* Demonstrates aggregation logic
* Supports real-world dashboard requirements

---

## Authentication & Security

* JWT-based authentication
* Password hashing (bcrypt)
* Rate limiting:

  * Global: 100 requests / 15 min
  * Auth routes: stricter limits

---

## Validation & Error Handling

* Input validation using express-validator
* Centralized error handling middleware
* Consistent response format:

```json
{
  "success": false,
  "message": "Error message"
}
```

---

## Seed Script

Run:

```bash
npm run seed
```

Creates test users for all roles.

---

## Assumptions

1. Self-registration defaults to Viewer role
2. Categories are predefined for consistency
3. Soft delete ensures audit integrity
4. Only Admin can modify records

---

## Tradeoffs

| Decision         | Alternative | Reason           |
| ---------------- | ----------- | ---------------- |
| MongoDB          | SQL DB      | Flexible schema  |
| JWT              | Sessions    | Stateless        |
| Soft Delete      | Hard Delete | Data safety      |
| Fixed Categories | Dynamic     | Better analytics |

---

## Future Improvements

* Refresh tokens
* Unit & integration tests
* Audit logging
* Export reports (CSV/PDF)
* Real-time updates (WebSockets)

---

## Assignment Coverage

| Requirement            | Status             |
| ---------------------- | ------------------ |
| User & Role Management | ✅ Completed        |
| Financial Records CRUD | ✅ Completed        |
| Dashboard APIs         | ✅ Completed        |
| Access Control         | ✅ Middleware-based |
| Validation & Errors    | ✅ Implemented      |
| Data Persistence       | ✅ MongoDB          |
| Optional Enhancements  | ✅ Implemented      |

---

## Conclusion

This project demonstrates a backend system designed with:

* Clean and modular architecture
* Strong access control
* Scalable API design
* Real-world financial data handling

The focus was not just on functionality but on building a **maintainable, extensible, and production-oriented system**.

---
