# Helpdesk frontend

A responsive React/Vite frontend for a customer and admin support-ticket workflow. It uses the backend's email/password JWT authentication, Axios for API calls, React Router for route UX protection, Tailwind CSS for styling, and Recharts for analytics.

## Setup

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and add your values.

## Environment variables

`VITE_API_URL` is the backend API base URL, for example `http://localhost:5001/api`.

## Routes

- `/login`, `/signup`
- `/customer`, `/customer/tickets`, `/customer/tickets/create`, `/customer/tickets/:id`
- `/admin/dashboard`, `/admin/tickets`, `/admin/tickets/:id`

## Backend assumptions

The ticket endpoints are `/tickets`, `/tickets/:id`, and `/tickets/:id/status`; analytics is `/analytics`. Login and signup call `/auth/login` and `/auth/signup`, then API requests include the backend JWT bearer token. Ticket list and analytics response shapes are handled flexibly for common wrapper formats.
