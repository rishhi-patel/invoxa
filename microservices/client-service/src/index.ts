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
app.use("/api/clients", clientRoutes)
app.use(errorHandler)

app.get("/", (_req, res) => res.send("Client Service is running 🚀"))
app.use("/api/clients", clientRoutes)

connectToDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Client service running on http://localhost:${PORT}`)
  })
})
