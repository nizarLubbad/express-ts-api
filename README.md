# 🚀 Express TypeScript API - Modular Architecture

A production-ready Express.js API built with TypeScript featuring JWT authentication, role-based access control, and a Generic Repository Pattern. This project implements a complete course management system with user authentication and authorization.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Authentication](#-authentication)
- [Error Handling](#-error-handling)
- [Development](#-development)
- [Testing](#-testing)

## ✨ Features

- **Modular Architecture** - Clean separation of concerns with dedicated modules
- **Generic Repository Pattern** - Reusable data access layer with TypeScript generics
- **JWT Authentication** - Secure token-based authentication system
- **Role-Based Access Control** - Three-tier permission system (ADMIN/COACH/STUDENT)
- **Input Validation** - Comprehensive validation using Zod schemas
- **Error Handling** - Global error handling with custom error classes
- **TypeScript** - Full type safety and modern development experience
- **In-Memory Storage** - Simple data persistence (resets on server restart)
- **Security Features** - Helmet, CORS, password hashing, and JWT tokens

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Password Hashing**: bcryptjs
- **Security**: Helmet, CORS
- **Development**: ts-node, nodemon

## 📁 Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── auth.controller.ts   # Auth route handlers
│   ├── auth.service.ts      # Auth business logic
│   ├── auth.dto.ts          # Auth data transfer objects
│   └── auth.routes.ts       # Auth route definitions
├── users/                   # User management module
│   ├── user.controller.ts   # User route handlers
│   ├── user.service.ts      # User business logic
│   ├── user.dto.ts          # User data transfer objects
│   └── user.routes.ts       # User route definitions
├── courses/                 # Course management module
│   ├── course.controller.ts # Course route handlers
│   ├── course.service.ts    # Course business logic
│   ├── course.dto.ts        # Course data transfer objects
│   └── course.routes.ts     # Course route definitions
├── shared/                  # Shared utilities and middleware
│   ├── repository.ts        # Generic repository pattern
│   ├── middleware.ts        # Authentication & error middleware
│   ├── errors.ts            # Custom error classes
│   └── types.ts             # TypeScript type definitions
└── server.ts                # Application entry point
```

## 🔧 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd express-typescript-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Install TypeScript globally (optional)**

   ```bash
   npm install -g typescript
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000`

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### Default Admin User

The system automatically creates a default admin user on startup:

- **Email**: `admin@no.com`
- **Password**: `admin123`
- **Role**: `ADMIN`

## 🎯 Usage

### Development

````bash
# Start development server with hot reload
npm run dev

# Build TypeScript
npm run build

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "node dist/server.js",
    "build": "tsc",
  }
}
````

## 📚 API Documentation

### Base URL

```
http://localhost:3000
```

### Response Format

All API responses follow a consistent format:

```json
{
  "success": true|false,
  "message": "Response message",
  "data": {} // Response data (optional)
}
```

### Authentication Routes (`/auth`)

#### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "abc123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "STUDENT",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    },
    "token": "jwt.token.here"
  }
}
```

#### Login User

```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@no.com",
  "password": "admin123"
}
```

### User Routes (`/users`)

#### Get Current User Profile

```http
GET /users/me
Authorization: Bearer <jwt-token>
```

#### Update Current User Profile

```http
PUT /users/me
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "newemail@example.com"
}
```

#### Create Coach User (Admin Only)

```http
POST /users/coach
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "name": "Coach Name",
  "email": "coach@example.com",
  "password": "password123"
}
```

### Course Routes (`/courses`)

#### Get All Courses (Public)

```http
GET /courses
```

#### Get Course by ID (Public)

```http
GET /courses/:id
```

#### Create Course (Coach/Admin Only)

```http
POST /courses
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "JavaScript Fundamentals",
  "description": "Learn the basics of JavaScript programming",
  "image": "https://example.com/image.jpg"
}
```

#### Update Course (Creator/Admin Only)

```http
PUT /courses/:id
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Updated Course Title",
  "description": "Updated description"
}
```

#### Delete Course (Creator/Admin Only)

```http
DELETE /courses/:id
Authorization: Bearer <jwt-token>
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. After successful login or registration, you'll receive a token that must be included in the Authorization header for protected routes.

### Token Format

```
Authorization: Bearer <jwt-token>
```

### Token Payload

```json
{
  "id": "user-id",
  "email": "user@example.com",
  "role": "USER_ROLE",
  "iat": 1640995200,
  "exp": 1641081600
}
```

## 🛡️ Role-Based Access Control

### User Roles

| Role        | Permissions                                                                    |
| ----------- | ------------------------------------------------------------------------------ |
| **STUDENT** | • View courses<br>• Update own profile<br>• Default role for new registrations |
| **COACH**   | • All STUDENT permissions<br>• Create courses<br>• Update/delete own courses   |
| **ADMIN**   | • All permissions<br>• Create COACH users<br>• Update/delete any course        |

### Permission Matrix

| Route                 | STUDENT | COACH    | ADMIN    |
| --------------------- | ------- | -------- | -------- |
| `GET /courses`        | ✅      | ✅       | ✅       |
| `GET /courses/:id`    | ✅      | ✅       | ✅       |
| `POST /courses`       | ❌      | ✅       | ✅       |
| `PUT /courses/:id`    | ❌      | ✅ (own) | ✅ (any) |
| `DELETE /courses/:id` | ❌      | ✅ (own) | ✅ (any) |
| `POST /users/coach`   | ❌      | ❌       | ✅       |
| `GET /users/me`       | ✅      | ✅       | ✅       |
| `PUT /users/me`       | ✅      | ✅       | ✅       |

## ❌ Error Handling

The API implements comprehensive error handling with custom error classes:

### Error Types

- **ValidationError (400)** - Input validation failures
- **UnauthorizedError (401)** - Authentication failures
- **ForbiddenError (403)** - Authorization failures
- **NotFoundError (404)** - Resource not found
- **CustomError (500)** - Internal server errors

### Error Response Format

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Error Scenarios

```bash
# Missing Authorization Header
HTTP 401: "Access token required"

# Invalid Token
HTTP 401: "Invalid or expired token"

# Insufficient Permissions
HTTP 403: "Insufficient permissions"

# Resource Not Found
HTTP 404: "Course not found"

# Validation Error
HTTP 400: "Name must be at least 2 characters"
```

## 💻 Development

### Code Quality

The project follows TypeScript best practices:

- **Strict Type Checking** - Full type safety with strict TypeScript configuration
- **Modular Architecture** - Clean separation of concerns
- **Error Handling** - Comprehensive error handling with custom classes
- **Input Validation** - Schema-based validation with Zod
- **Security** - JWT tokens, password hashing, and security headers

### Generic Repository Pattern

The project implements a Generic Repository Pattern for data access:

```typescript
export class Repository<
  T extends { id: string; createdAt: Date; updatedAt: Date }
> {
  private data: T[] = [];

  findAll(): T[] {
    /* ... */
  }
  findById(id: string): T | undefined {
    /* ... */
  }
  create(item: Omit<T, "id" | "createdAt" | "updatedAt">): T {
    /* ... */
  }
  update(id: string, updates: Partial<T>): T | undefined {
    /* ... */
  }
  delete(id: string): boolean {
    /* ... */
  }
}
```

### Middleware Stack

- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Express.json()** - JSON parsing
- **Custom Authentication** - JWT token verification
- **Custom Authorization** - Role-based access control
- **Error Handling** - Global error handler

## 🧪 Testing

### Manual Testing with cURL

```bash
# Register a new user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Login as admin
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@no.com",
    "password": "admin123"
  }'

# Create a course (replace TOKEN with actual JWT)
curl -X POST http://localhost:3000/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "title": "Test Course",
    "description": "A test course description"
  }'

# Get all courses
curl -X GET http://localhost:3000/courses
```

### Health Check

```bash
curl -X GET http://localhost:3000/health
```

Expected response:

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

### Development Guidelines

- Follow TypeScript best practices
- Maintain modular architecture
- Add proper error handling
- Update documentation for new features
- Ensure type safety throughout
