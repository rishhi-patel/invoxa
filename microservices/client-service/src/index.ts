import express from "express"
import clientRoutes from "./routes/client.routes"
import { requestLogger, errorHandler } from "./middleware/logger.middleware"

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(requestLogger)
app.use("/api/clients", clientRoutes)
app.use(errorHandler)

app.get("/", (_req, res) => res.send("Client Service is running 🚀"))

app.listen(PORT, () => {
  console.log(`Client service is live on http://localhost:${PORT}`)
})
