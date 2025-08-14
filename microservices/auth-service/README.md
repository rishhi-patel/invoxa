# 🔐 Auth Service

A microservice for **user authentication** and **JWT token management**.

## 📌 Features

- User registration & login endpoints
- Secure password hashing with bcrypt
- JWT token generation, validation, and verification
- Modular code structure (controllers, models, routes, middleware)
- Ready for integration with other microservices

## 🛠 Tech Stack

- Node.js & Express
- TypeScript
- MongoDB (integration planned)
- JWT for stateless authentication
- Bcrypt for password security

## 🚀 Getting Started

1. **Navigate to Directory:**

   ```bash
   cd auth-service
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   - Copy `.env.example` to `.env` and update values as needed.

4. **Run the service:**
   ```bash
   npm run dev
   ```

**Local URL:** [http://localhost:3001](http://localhost:3001)

## 📂 Project Structure

```
src/
  controllers/    # Route handlers
  middleware/     # Custom middleware
  models/         # Mongoose models
  routes/         # API routes
  utils/          # Utility functions
tests/            # Test cases
```

## 🧪 Testing

Run unit tests with:

```bash
npm test
```

## 🤝 Contributing

Feel free to open issues or submit pull requests for improvements!
