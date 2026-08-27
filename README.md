# Support Ticket / Helpdesk System

A full-stack MERN support ticket management system with customer and admin roles, JWT-based API authorization, manual authentication, Google authentication through Clerk, ticket status tracking, file attachments, search/filtering, pagination, and admin analytics.

## Tech Stack

**Frontend**

* React + Vite
* React Router
* Axios
* Clerk
* Recharts

**Backend**

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT
* bcryptjs
* Multer

## Features

### Authentication & Authorization

* Manual email/password signup and login
* Google sign-in using Clerk
* JWT-based authorization for protected backend APIs
* Customer and Admin roles
* Role-based authorization enforced on backend APIs
* Protected frontend routes

### Customer

* Create support tickets
* Upload ticket attachments
* View own tickets
* Track ticket status
* View ticket status history

### Admin

* View all support tickets
* Search tickets
* Filter tickets by status and priority
* Paginate ticket results
* Update ticket status
* View ticket analytics

### Ticket Workflow

```text
Open → In Progress → Resolved
```

Every status change is recorded with a timestamp and displayed in the ticket status history.

### File Attachments

Ticket creation supports file attachments with file type and size validation.

## Project Structure

```text
.
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .env.example
│   └── vite.config.js
│
└── README.md
```

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Backend

```bash
cd backend
npm install
```

Create `backend/.env` using `backend/.env.example`:

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env` using `frontend/.env.example` and add the required Clerk configuration and API URL.

Start the frontend:

```bash
npm run dev
```

Open the local URL provided by Vite.

## Environment Variables

### Backend

| Variable      | Description                    |
| ------------- | ------------------------------ |
| `PORT`        | Backend server port            |
| `MONGODB_URI` | MongoDB connection string      |
| `JWT_SECRET`  | Secret used to sign JWT tokens |

### Frontend

| Variable                     | Description           |
| ---------------------------- | --------------------- |
| `VITE_API_URL`               | Backend API base URL  |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |

> Never commit `.env` files or secret credentials. Use the provided `.env.example` files as templates.

## API Overview

### Authentication

```text
POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/me
```

### Tickets

```text
POST /api/tickets
GET  /api/tickets
GET  /api/tickets/:id
PATCH /api/tickets/:id/status
```

Protected endpoints require valid JWT authentication and enforce the appropriate user role.

## Backend Testing

All backend REST API endpoints were tested independently during development, including authentication, authorization, ticket operations, status updates, filtering, pagination, and other implemented API functionality.

## Live Demo

**Frontend:** `<live-frontend-url>`

**Backend API:** `<live-backend-url>`

## GitHub Repository

**Repository:** `<github-repository-url>`

## Assessment Coverage

| Requirement                | Status  |
| -------------------------- | ------- |
| REST API                   | ✅       |
| JWT authentication         | ✅       |
| Customer/Admin RBAC        | ✅       |
| Manual signup/login        | ✅       |
| Google authentication      | ✅ Clerk |
| User & Ticket models       | ✅       |
| Ticket status workflow     | ✅       |
| Status history             | ✅       |
| File attachments           | ✅       |
| File validation            | ✅       |
| Search/filter/pagination   | ✅       |
| Customer ticket management | ✅       |
| Admin ticket management    | ✅       |
| Admin analytics            | ✅       |
| Loading/error/empty states | ✅       |

## Notes

Google authentication is implemented using Clerk, while the application's protected backend APIs use JWT-based authorization and role-based access control.

This project was developed as part of a MERN Stack Developer technical assessment.
