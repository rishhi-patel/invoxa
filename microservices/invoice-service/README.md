# 🧾 Invoice Service

Handles **invoice creation, retrieval, and management**.

## 📌 Features

- Create, retrieve, update, and delete invoices
- Notify clients about invoices
- Planned PDF export
- Authentication middleware for secure endpoints
- Modular structure (controllers, middleware, models, routes, utils)

## 🛠 Tech Stack

- Node.js / Express
- TypeScript
- MongoDB

## 📂 Project Structure

```
src/
    controllers/      # Business logic (invoice.controller.ts)
    middleware/       # Auth & logger middleware
    models/           # Data models (invoice.model.ts)
    routes/           # API routes (invoice.routes.ts)
    utils/            # Utility functions
tests/              # Test cases
```

## 🚀 Running Locally

```bash
cd invoice-service
npm install
npm run dev
```

**Local URL:** http://localhost:3002

## 📬 API Endpoints

| Method | Endpoint      | Description          |
| ------ | ------------- | -------------------- |
| POST   | `/`           | Create invoice       |
| GET    | `/`           | List invoices        |
| GET    | `/:id`        | Get invoice by ID    |
| PUT    | `/:id`        | Update invoice       |
| DELETE | `/:id`        | Delete invoice       |
| POST   | `/:id/notify` | Notify about invoice |

> All endpoints require authentication.
