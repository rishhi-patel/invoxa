# 👥 Client Service

Manages **client data** including CRUD operations.

## 📌 Features

- Create, read, update, delete client records
- REST API endpoints for client management
- Authentication middleware for protected routes
- Centralized logging middleware
- Modular TypeScript codebase
- Internal API for service-to-service communication

## 🛠 Tech Stack

- Node.js / Express
- TypeScript
- MongoDB (planned)
- Jest (testing)
- Docker (containerization)

## 📂 Project Structure

```
src/
    middleware/      # Auth & logger middleware
    models/          # Data models
    routes/          # API route handlers
    services/        # Business logic
    types/           # Type definitions
    utils/           # Utility functions
    tests/           # Unit/integration tests
```

## 🚀 Running Locally

```bash
cd client-service
npm install
npm run dev
```

**Local URL:** http://localhost:5001

## 🧪 Running Tests

```bash
npm test
```

## 🐳 Docker

Build and run the service with Docker:

```bash
docker build -t client-service .
docker run -p 5001:5001 client-service
```

## 🔒 Authentication

All endpoints are protected by authentication middleware. See `src/middleware/auth.middleware.ts`.

## 📖 API Endpoints

- `POST /` - Create client
- `GET /` - Get all clients
- `GET /:id` - Get client by ID
- `PUT /:id` - Update client
- `DELETE /:id` - Delete client

## 🤝 Contributing

Feel free to open issues or submit PRs!
