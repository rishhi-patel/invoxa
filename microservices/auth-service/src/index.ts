import express from "express"
import dotenv from "dotenv"
import helmet from "helmet"
import cors from "cors"
import mongoose from "mongoose"
import authRoutes from "./routes/auth.routes"

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())
app.use(helmet())

app.use("/api/auth", authRoutes)

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/auth")
  .then(() => {
    console.log("MongoDB connected")
    app.listen(3002, () => console.log("Auth service running on port 3002"))
  })
  .catch((err) => console.error("MongoDB connection error:", err))

export default app
