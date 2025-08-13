import serverlessExpress from "@vendia/serverless-express"
import app from "./index.js"
import { connectToDB } from "./utils/db"

// Ensure DB is connected once per cold start, before handling requests
let isReady = false
async function bootstrap() {
  if (!isReady) {
    await connectToDB()
    isReady = true
  }
}
export const handler = async (event: any, context: any) => {
  await bootstrap()
  const proxy = serverlessExpress({ app })
  return proxy(event, context)
}
