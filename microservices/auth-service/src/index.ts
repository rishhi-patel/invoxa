import express, { Request, Response } from "express"

const app = express()
const PORT = process.env.PORT || 3000

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello from Auth Service!")
})

app.listen(PORT, () => {
  console.log(`Service running on port ${PORT}`)
})
