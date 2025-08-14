import express from "express"
import dotenv from "dotenv"
import helmet from "helmet"
import cors from "cors"
import authRoutes from "./routes/auth.routes"
import { connectToDB } from "./utils/db"
import { errorHandler, requestLogger } from "./middleware/logger.middleware"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3002
app.use(cors())
app.use(requestLogger)

app.use(express.json())

app.use(helmet())

app.use("/api/auth", authRoutes)

app.use(errorHandler)
if (process.env.NODE_ENV !== "test") {
  connectToDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Client service running on http://localhost:${PORT}`)
    })
  })
}

export default app
