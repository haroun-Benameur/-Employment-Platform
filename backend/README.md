# Employment Platform Backend

Express + MongoDB API powering the Employment Platform frontend.

## Setup

1. Install dependencies
```bash
cd backend
npm install
```

2. Configure environment
```bash
cp .env.example .env
# edit .env values
```

3. Run in development
```bash
npm run dev
```

## Structure
```
src/
  app.js              # Express app setup
  server.js           # Server bootstrap
  config/db.js        # Mongo connection
  models/             # Mongoose models
  middleware/         # JWT auth, validation, errors
  services/           # Business logic
  controllers/        # Route handlers
  routes/             # Route definitions
  utils/              # Helpers
```

## High-level Endpoints
- Auth: POST /api/auth/register, POST /api/auth/login, GET /api/auth/me
- Users: GET /api/users/me, PATCH /api/users/me
- Jobs: GET /api/jobs, GET /api/jobs/:id, POST /api/jobs, PATCH /api/jobs/:id, DELETE /api/jobs/:id
- Applications: GET /api/applications/my, POST /api/applications, PATCH /api/applications/:id, GET /api/jobs/:jobId/applications

Secured routes require `Authorization: Bearer <token>`.
