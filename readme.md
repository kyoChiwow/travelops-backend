# TravelOps Backend

Production-grade travel management backend built with **Node.js, Express, TypeScript, MongoDB**, following scalable architecture patterns used in real SaaS systems.

This API powers a travel operations platform supporting booking management, guide assignment, payments, authentication, and analytics.

---

# System Overview

TravelOps Backend is designed using **modular architecture + service layer pattern** to ensure scalability, maintainability, and clean separation of concerns.

Core design goals:

* Clean architecture
* Scalable module structure
* Strong typing
* Secure authentication
* Reusable query system
* Production error handling

---

# Key Features

## Authentication & Security

* JWT Authentication
* Google OAuth Login
* Role Based Access Control (RBAC)
* Password hashing (bcrypt)
* Session support
* Protected routes middleware

## User System

* User registration & login
* Profile management
* Role management
* Booking history tracking
* Multiple auth providers support

## Booking System

* Create booking
* Assign guide
* Booking lifecycle management
* Payment tracking
* Booking statistics

## Guide System

* Guide application workflow
* Admin approval system
* Guide statistics
* Guide booking assignment

## Payment System

* SSLCommerz integration
* Payment verification
* Payment success/fail flow
* Booking payment linking

## Statistics & Analytics

* Total bookings
* Booking by status
* Revenue tracking
* Guide performance stats
* Platform metrics

## Advanced Backend Features

* Query Builder (filter/search/sort/paginate)
* Redis caching support
* Email notifications
* PDF generation support
* Cloud file upload
* Centralized error handling

---

# Tech Stack

## Backend

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose

## Authentication

* JWT
* Passport.js
* Google OAuth Strategy
* Local Strategy

## Validation

* Zod
* Custom validation middleware

## Infrastructure Tools

* Redis
* Cloudinary
* Multer
* Nodemailer
* Axios

## Code Quality

* ESLint
* TypeScript strict mode
* Modular architecture

---

# Architecture Pattern

This project follows:

Layered Architecture:

Controller → Service → Model → Database

And:

Route → Controller → Service → Query Builder → DB

---

# Project Structure

```
src/

app/
│
├── modules/
│   ├── auth/
│   ├── user/
│   ├── booking/
│   ├── guide/
│   ├── payment/
│   ├── stats/
│
├── middleware/
│   ├── auth.ts
│   ├── roleGuard.ts
│   ├── validateRequest.ts
│
├── utils/
│   ├── catchAsync.ts
│   ├── AppError.ts
│   ├── QueryBuilder.ts
│   ├── seedSuperAdmin.ts
│
├── config/
│   ├── env.ts
│   ├── passport.ts
│   ├── database.ts
│
├── routes/
│   ├── index.ts
│
server.ts
```

---

# Installation Guide

## Clone Project

```
git clone https://github.com/kyoChiwow/travelops-backend
```

## Install Dependencies

```
npm install
```

## Environment Setup

Create `.env`:

```
PORT=

DATABASE_URL=

JWT_SECRET=
JWT_EXPIRES=7d

BCRYPT_SALT_ROUNDS=

SUPER_ADMIN_EMAIL=
SUPER_ADMIN_PASSWORD=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

REDIS_URL=

EMAIL_USER=
EMAIL_PASS=

SSL_STORE_ID=
SSL_STORE_PASSWORD=
SSL_PAYMENT_URL=
SSL_VALIDATION_URL=
SSL_SUCCESS_URL=
SSL_FAIL_URL=
```

---

# Running Application

## Development

```
npm run dev
```

## Build

```
npm run build
```

## Production

```
npm start
```

## Lint

```
npm run lint
```

---

# API Design Example

## Create Booking

POST:

```
/api/v1/booking
```

Request:

```
{
    "tourId":"id",
    "date":"2026-04-10",
    "guests":2
}
```

Response:

```
{
    success:true,
    message:"Booking created",
    data:{}
}
```

---

# Query Builder Example

Supports:

* search
* filter
* pagination
* sorting

Example:

```
/api/booking?status=completed&sort=-createdAt&page=1&limit=10
```

Reusable pattern:

```
new QueryBuilder(Model.find(), query)
.search()
.filter()
.sort()
.paginate()
.fields()
```

---

# Database Relationship Design

User → Booking → Guide

Relations:

User:

```
bookings: ObjectId[]
```

Booking:

```
user → reference
guide → reference
payment → reference
```

Guide:

```
user reference
assigned bookings
```

---

# Security Practices

Implemented:

* Password hashing
* JWT expiration
* Role authorization
* Request validation
* Central error handler
* Environment variables
* Protected admin routes

Planned:

* Rate limiting
* Refresh tokens
* API throttling

---

# Error Handling Strategy

Centralized error flow:

Controller:

```
catchAsync()
```

Service:

```
throw new AppError()
```

Global handler manages:

* Zod errors
* Mongo errors
* Validation errors
* JWT errors
* Custom errors

---

# Performance Considerations

Optimizations used:

* Mongo aggregation for stats
* Promise parallel execution
* Reference population only when needed
* Query projection
* Redis ready caching layer

---

# Super Admin Seeder

Auto creates first admin.

Location:

```
src/app/utils/seedSuperAdmin.ts
```

Runs during server startup.

Prevents duplicate admin creation.

---

# Professional Practices Used

Patterns implemented:

* Service Layer Pattern
* Repository style data access
* Modular routing
* Async wrapper pattern
* Query abstraction layer
* DTO validation pattern

Industry practices:

* Separation of concerns
* DRY principle
* Typed responses
* Environment isolation
* Production error flow

---

# Future Roadmap

Planned improvements:

* Refresh token auth
* Swagger documentation
* Unit testing (Jest)
* Integration tests
* Docker setup
* CI/CD pipeline
* Event driven notifications
* Background jobs

---

# Developer Notes

Important design decisions:

Booking stores ObjectId references instead of embedded data for scalability.

Stats use Mongo aggregation instead of multiple queries.

Guide assignment uses reference linking instead of duplication.

QueryBuilder implemented to avoid repetitive filtering logic.

---

# Author

Backend architecture project demonstrating real-world scalable API design.

Focus areas:

* Backend engineering practices
* Database design
* API security
* Scalable structure
* Performance thinking

---

# License

ISC

---

# Contribution

Open to improvements and architecture suggestions.

---

# Project Status

Active development.

Architecture stable.

New features being added.
