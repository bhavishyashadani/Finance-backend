# Finance Data Processing and Access Control Backend

## Overview

This project is a backend system designed for a finance dashboard that supports:

* Role-based user management
* Financial records CRUD operations
* Dashboard analytics APIs
* Secure access control enforcement

The system is built with a strong focus on **clean architecture, maintainability, and clear business logic**, aligning with the requirements of the backend engineering assignment. 

---

## Key Highlights

* Role-Based Access Control (RBAC) implemented via middleware
* Aggregated analytics APIs (monthly trends, category totals, summaries)
* Clean separation of concerns (routes → controllers → models → middleware)
* Secure authentication using JWT
* Scalable and modular folder structure
* Strong validation and centralized error handling

---

## Design Approach (Very Important)

This backend is designed with the following principles:

### 1. Separation of Concerns

* Routes handle HTTP layer
* Controllers handle business logic
* Models define schema
* Middleware handles cross-cutting concerns (auth, validation)

### 2. Role-Based Architecture

* Permissions enforced at middleware level (`authorize(...)`)
* Prevents duplication of access logic across controllers

### 3. Scalable API Design

* Pagination, filtering, and search supported
* Easily extendable for future features (e.g., reports, exports)

### 4. Data Integrity

* Predefined categories ensure consistent analytics
* Soft delete ensures audit safety

---

## Tech Stack

| Layer          | Technology         | Reason                             |
| -------------- | ------------------ | ---------------------------------- |
| Runtime        | Node.js            | Async, scalable backend runtime    |
| Framework      | Express.js         | Lightweight & flexible             |
| Database       | MongoDB + Mongoose | Flexible schema for financial data |
| Authentication | JWT                | Stateless & scalable               |
| Validation     | express-validator  | Clean request validation           |
| Security       | express-rate-limit | Prevent abuse                      |

---

## Project Structure

```
finance-backend/
├── config/                # Database configuration
├── src/
│   ├── app.js             # Entry point
│   ├── models/            # Mongoose schemas
│   ├── controllers/       # Business logic
│   ├── routes/            # API routes
│   ├── middleware/        # Auth, validation, error handling
│   └── utils/             # Seed script
├── .env
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

```bash
.env
```

Configure:

```
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### Run Project

```bash
npm run dev
```

---

## User Roles & Access Control

| Role    | Permissions                    |
| ------- | ------------------------------ |
| Viewer  | View dashboard + records       |
| Analyst | View + analytics               |
| Admin   | Full control (users + records) |

### Implementation

* JWT-based authentication
* Role validation using middleware
* Unauthorized access blocked at route level

---

## Financial Records Module

Supports:

* Create / Read / Update / Delete (CRUD)
* Filtering by:

  * Type (income/expense)
  * Category
  * Date range
* Search (notes)
* Pagination

### Design Decisions

* Fixed categories → ensures consistent analytics
* Soft delete → preserves financial history

---

## Dashboard Analytics APIs

Implemented aggregation-based endpoints:

* Total income & expenses
* Net balance
* Category-wise breakdown
* Monthly trends
* Weekly trends
* Recent activity

### Why This Matters

These APIs demonstrate backend capability beyond CRUD by:

* Using aggregation pipelines
* Structuring data for frontend dashboards
* Handling real-world reporting use cases

---

## Authentication & Security

* JWT-based authentication
* Password hashing using bcrypt
* Rate limiting:

  * Global: 100 requests / 15 min
  * Auth routes: stricter limits

---

## Validation & Error Handling

* Request validation using `express-validator`
* Centralized error handler
* Consistent response format:

```json
{
  "success": false,
  "message": "Error message"
}
```

---

## Seed Data

Run:

```bash
npm run seed
```

Creates test users for all roles.

---

## Assumptions

1. Self-registration defaults to Viewer role
2. Financial records use predefined categories
3. Soft delete is required for audit integrity
4. Only Admin can modify records via API

---

## Tradeoffs

| Decision         | Alternative | Reason                            |
| ---------------- | ----------- | --------------------------------- |
| MongoDB          | SQL DB      | Faster iteration, flexible schema |
| JWT              | Sessions    | Stateless, scalable               |
| Soft Delete      | Hard Delete | Data safety                       |
| Fixed Categories | Dynamic     | Better aggregation                |

---

## Possible Improvements

* Refresh tokens & authentication hardening
* Unit & integration tests
* Role-based caching for dashboard
* Export reports (CSV/PDF)
* Audit logs for user actions

---

## Assignment Mapping

| Requirement            | Status              |
| ---------------------- | ------------------- |
| User & Role Management | ✅ Implemented       |
| Financial Records CRUD | ✅ Implemented       |
| Dashboard APIs         | ✅ Implemented       |
| Access Control         | ✅ Middleware-based  |
| Validation & Errors    | ✅ Strong handling   |
| Data Persistence       | ✅ MongoDB           |
| Optional Enhancements  | ✅ Multiple included |

---

## Conclusion

This project demonstrates a structured approach to backend engineering by combining:

* Clean architecture
* Secure authentication
* Proper access control
* Scalable API design
* Thoughtful tradeoffs

The focus was not just on making APIs work, but on designing a system that is **maintainable, extensible, and logically consistent**.

---
