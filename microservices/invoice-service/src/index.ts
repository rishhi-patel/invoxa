import express from "express"
import dotenv from "dotenv"
import helmet from "helmet"
import cors from "cors"
import { connectToDB } from "./utils/db"
import { requestLogger, errorHandler } from "./middleware/logger.middleware"
import invoiceRoutes from "./routes/invoice.routes"

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3003

app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(requestLogger)

app.get("/api/invoice/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "invoice-service" })
})

app.use("/api/invoice", invoiceRoutes)

// Not found handler with service name
app.use((_req, res) => {
  res.status(404).json({ error: "Not Found", service: "invoice-service" })
})
// Error handler last
app.use(errorHandler)

if (process.env.NODE_ENV !== "test") {
  connectToDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🧾 Invoice service running on http://localhost:${PORT}`)
    })
  })
}

export default app
