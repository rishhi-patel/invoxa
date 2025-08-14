// src/handler.ts
import serverlessExpress from "@vendia/serverless-express"
import app from "./index.js"
import { connectToDB } from "./utils/db"

let ready = false
async function bootstrap() {
  if (!ready) {
    await connectToDB()
    ready = true
  }
}
export const handler = async (event: any, context: any) => {
  await bootstrap()
  const proxy = serverlessExpress({ app })
  return proxy(event, context)
}
