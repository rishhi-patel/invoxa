import mongoose from "mongoose"

export const connectToDB = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/invoxa"
  try {
    await mongoose.connect(mongoUri)
    console.log("[MongoDB] Connected successfully")
  } catch (err) {
    console.error("[MongoDB] Connection failed:", err)
    process.exit(1)
  }
}
