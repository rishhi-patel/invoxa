import express from "express"
import dotenv from "dotenv"
import clientRoutes from "./routes/client.routes"
import { connectToDB } from "./utils/db"
import { requestLogger, errorHandler } from "./middleware/logger.middleware"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())
app.use(requestLogger)

app.get("/api/client/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "client-service" })
})
app.use("/api/client", clientRoutes)
app.get("/logger-test", (req, res) => {
  res.status(200).send("OK")
})

// Not found handler with service name
app.use((_req, res) => {
  res.status(404).json({ error: "Not Found", service: "client-service" })
})

app.use(errorHandler)

if (process.env.NODE_ENV !== "test") {
  connectToDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Client service running on http://localhost:${PORT}`)
    })
  })
}

export default app
