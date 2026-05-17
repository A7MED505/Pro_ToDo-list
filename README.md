# Full Stack Todo List (MERN)

A complete Todo List project using:
- React + Vite (frontend)
- Node.js + Express (backend)
- MongoDB + Mongoose
- JWT + bcryptjs authentication
- REST APIs
- Jest + Supertest tests

## Project Structure

- `frontend` - React client
- `backend` - Express API server

## Backend Setup

1. Open `backend/.env.example` and create `.env` with your values.
2. Install dependencies:

```bash
cd backend
npm install
```

3. Start backend server:

```bash
npm run dev
```

Backend runs on `http://localhost:5000` by default.

## Frontend Setup

1. Open `frontend/.env.example` and create `.env` with your values.
2. Install dependencies:

```bash
cd frontend
npm install
```

3. Start frontend app:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173` by default.

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile` (Bearer token required)

### Todos (Bearer token required)
- `GET /api/todos`
- `POST /api/todos`
- `PUT /api/todos/:id`
- `DELETE /api/todos/:id`

## Run Tests

```bash
cd backend
npm test
```

The tests run against an in-memory MongoDB instance.
