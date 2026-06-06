# Full Stack Todo List (MERN)

A production-style todo app with authentication, advanced task metadata, and two task views (List + Kanban).

## Stack

- React + Vite (frontend)
- Node.js + Express (backend)
- MongoDB + Mongoose
- JWT + bcryptjs authentication
- Swagger UI (OpenAPI 3.0)
- Jest + Supertest (backend tests)

## Project Structure

- `frontend` - React client
- `backend` - Express API server

## Quick Start

1. Install root dependencies (for concurrent dev script):

```bash
npm install
```

2. Create env files:

- `backend/.env` (copy from `.env.example`)
- `frontend/.env` (copy from `.env.example` if needed)

3. Start backend + frontend together:

```bash
npm run dev
```

App URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Swagger UI: `http://localhost:5000/api-docs`
- Swagger JSON: `http://localhost:5000/api-docs.json`

## API Endpoints

### Health

- `GET /api/health`

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile` (Bearer token required)

### Todos (Bearer token required)

- `GET /api/todos`
- `POST /api/todos`
- `PUT /api/todos/:id`
- `DELETE /api/todos/:id`
- `DELETE /api/todos/completed`

Todo payload supports:

- `title`
- `completed`
- `status` (`todo`, `in_progress`, `done`)
- `priority` (`low`, `medium`, `high`)
- `tags` (string array)
- `subtasks` (array of `{ title, completed }`)
- `dueDate`
- `reminderAt`

## Useful Commands

```bash
# Root
npm run dev
npm run build

# Frontend only
npm run dev --prefix frontend
npm run lint --prefix frontend
npm run build --prefix frontend

# Backend only
npm run dev --prefix backend
npm test --prefix backend
```
