import request from "supertest"
import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import app from "../src"
import { encodeJwsToken } from "../src/utils/jwt"

let mongo: MongoMemoryServer

beforeAll(async () => {
  mongo = await MongoMemoryServer.create()
  const uri = mongo.getUri()
  await mongoose.connect(uri)
})

afterAll(async () => {
  await mongoose.connection.dropDatabase().catch(console.error)
  await mongoose.connection.close().catch(console.error)
  if (mongo) await mongo.stop()
})

describe("Auth Service", () => {
  const userData = {
    name: "Rishhi",
    email: "rishhi@example.com",
    password: "securepass123",
  }

  let token: string

  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send(userData)
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty("token")
    token = res.body.token
  })

  it("should login the user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: userData.email, password: userData.password })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty("token")
    token = res.body.token
  })

  it("should validate token", async () => {
    token = encodeJwsToken(userData)

    const res = await request(app)
      .get("/api/auth/validate")
      .set("Authorization", `Bearer ${token}`)

    expect(res.status).toBe(200)

    expect(res.body).toHaveProperty("valid", true)
  })
})
