# FunQuiz

FunQuiz is a full-stack web application for creating, sharing, and playing quizzes with friends and organizations. It features a modern React/Next.js frontend and a robust Spring Boot backend with MongoDB and Redis support.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup (Spring Boot)](#backend-setup-spring-boot)
  - [Frontend Setup (Next.js)](#frontend-setup-nextjs)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Development Workflow](#development-workflow)
- [License](#license)

---

## Features

- User authentication (signup/login)
- Create, edit, and play quizzes
- Quiz sharing
- Event management
- Responsive, modern UI with charts and statistics
- Email notifications
- Secure JWT-based authentication
- Data storage with MongoDB and Redis

---

## Tech Stack

**Frontend:**
- Next.js 15 (React 19)
- TypeScript
- Tailwind CSS
- Redux Toolkit
- Radix UI, Tabler Icons, Lucide, Framer Motion, Recharts

**Backend:**
- Spring Boot 3.5
- Java 21
- MongoDB (Spring Data)
- Redis (Spring Data Redis)
- JWT (io.jsonwebtoken)
- Spring Security, Validation, Mail

---

## Project Structure

```
FunQuiz/
│
├── client/         # Next.js frontend
│   ├── app/        # App routes and pages
│   ├── components/ # Reusable UI components
│   ├── hooks/      # Custom React hooks
│   ├── lib/        # Utility libraries
│   ├── provider/   # Context providers
│   ├── store/      # Redux store and features
│   ├── types/      # TypeScript types and schemas
│   └── ...         # Config, assets, etc.
│
├── server/         # Spring Boot backend
│   ├── src/        # Java source code
│   ├── logs/       # Log files
│   ├── pom.xml     # Maven configuration
│   └── ...         # Dockerfile, target, etc.
│
└── README.md       # Project documentation
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Java 21
- Maven
- MongoDB instance
- Redis instance

---

### Backend Setup (Spring Boot)

1. **Configure MongoDB and Redis:**
   - Set your MongoDB and Redis connection details in `application.properties` or as environment variables.

2. **Build and Run:**
   ```powershell
   cd server
   mvnw clean install
   mvnw spring-boot:run
   ```
   The backend will start on `http://localhost:8080`.

3. **API Endpoints:**
   - RESTful endpoints for quizzes, users, events, organizations, etc.
   - JWT authentication for protected routes.

---

### Frontend Setup (Next.js)

1. **Install dependencies:**
   ```powershell
   cd client
   npm install
   ```

2. **Configure Environment:**
   - Create a `.env.local` file in `client/` with your API base URL and any other secrets.

3. **Run the development server:**
   ```powershell
   npm run dev
   ```
   The frontend will start on `http://localhost:3000`.

---

## Environment Variables

### Backend (`server/src/main/resources/application.properties` or env vars)
- `SPRING_DATA_MONGODB_URI`
- `SPRING_REDIS_HOST`
- `SPRING_REDIS_PORT`
- `JWT_SECRET`
- `MAIL_*` (for email features)

### Frontend (`client/.env.local`)
- `NEXT_PUBLIC_API_URL` (e.g., `http://localhost:8080`)

---

## Scripts

### Backend

- `mvnw clean install` — Build the backend
- `mvnw spring-boot:run` — Run the backend server

### Frontend

- `npm run dev` — Start Next.js in development mode
- `npm run build` — Build for production
- `npm start` — Start production server
- `npm run lint` — Lint code

---

## Development Workflow

1. Start MongoDB and Redis locally or use cloud services.
2. Run the backend server.
3. Run the frontend development server.
4. Access the app at `http://localhost:3000`.
