import mongoose from "mongoose"
import request from "supertest"
import { MongoMemoryServer } from "mongodb-memory-server"
import app from "../src"
import { ClientModel } from "../src/models/client.model"

let mongo: MongoMemoryServer

// Mock token and user
const TEST_TOKEN = "testtoken"
const TEST_USER_ID = "68950d55902cc3e7eaba7497"

// Mock middleware for tests (in your actual app, use real auth middleware)
jest.mock("../src/middleware/auth.middleware", () => ({
  authenticate: (req: any, res: any, next: any) => {
    req.user = { id: TEST_USER_ID }
    next()
  },
}))

beforeAll(async () => {
  mongo = await MongoMemoryServer.create()
  const uri = mongo.getUri()
  await mongoose.connect(uri)
  process.env.NODE_ENV = "test"
})

afterAll(async () => {
  await mongoose.connection.dropDatabase().catch(console.error)
  await mongoose.connection.close().catch(console.error)
  if (mongo) await mongo.stop()
})

afterEach(async () => {
  await ClientModel.deleteMany({})
})

describe("Client API", () => {
  it("should hit logger middleware", async () => {
    const res = await request(app)
      .get("/logger-test")
      .set("Authorization", TEST_TOKEN)
    expect(res.status).toBe(200)
  })

  it("should create a new client", async () => {
    const res = await request(app).post("/api/clients").send({
      name: "Rishhi",
      email: "rishhi@example.com",
      phone: "1234567890",
      company: "Exo Code Labs",
    })

    expect(res.status).toBe(201)
    expect(res.body.name).toBe("Rishhi")
    expect(res.body.createdBy).toBe(TEST_USER_ID)
  })

  it("should return all clients", async () => {
    await ClientModel.create({
      name: "Test",
      email: "t@t.com",
      phone: "123",
      company: "X",
      createdBy: TEST_USER_ID,
    })
    const res = await request(app)
      .get("/api/clients")
      .set("Authorization", TEST_TOKEN)
    expect(res.status).toBe(200)
    expect(res.body.length).toBe(1)
    expect(res.body[0].createdBy).toBe(TEST_USER_ID)
  })

  it("should get client by ID", async () => {
    const client = await ClientModel.create({
      name: "R",
      email: "r@r.com",
      phone: "000",
      company: "C",
      createdBy: TEST_USER_ID,
    })
    const res = await request(app)
      .get(`/api/clients/${client._id}`)
      .set("Authorization", TEST_TOKEN)
    expect(res.status).toBe(200)
    expect(res.body.name).toBe("R")
    expect(res.body.createdBy).toBe(TEST_USER_ID)
  })

  it("should return 404 for non-existing client", async () => {
    const fakeId = new mongoose.Types.ObjectId()
    const res = await request(app)
      .get(`/api/clients/${fakeId}`)
      .set("Authorization", TEST_TOKEN)
    expect(res.status).toBe(404)
    expect(res.body.message).toBe("Client not found")
  })

  it("should update a client", async () => {
    const client = await ClientModel.create({
      name: "Old",
      email: "o@o.com",
      phone: "123",
      company: "OldCo",
      createdBy: TEST_USER_ID,
    })
    const res = await request(app)
      .put(`/api/clients/${client._id}`)
      .set("Authorization", TEST_TOKEN)
      .send({ name: "Updated" })
    expect(res.status).toBe(200)
    expect(res.body.name).toBe("Updated")
    expect(res.body.createdBy).toBe(TEST_USER_ID)
  })

  it("should return 404 on update if client not found", async () => {
    const res = await request(app)
      .put(`/api/clients/${new mongoose.Types.ObjectId()}`)
      .set("Authorization", TEST_TOKEN)
      .send({ name: "Test" })
    expect(res.status).toBe(404)
  })

  it("should delete a client", async () => {
    const client = await ClientModel.create({
      name: "ToDelete",
      email: "d@d.com",
      phone: "000",
      company: "X",
      createdBy: TEST_USER_ID,
    })
    const res = await request(app)
      .delete(`/api/clients/${client._id}`)
      .set("Authorization", TEST_TOKEN)
    expect(res.status).toBe(204)
  })

  it("should return 404 when deleting non-existent client", async () => {
    const res = await request(app)
      .delete(`/api/clients/${new mongoose.Types.ObjectId()}`)
      .set("Authorization", TEST_TOKEN)
    expect(res.status).toBe(404)
  })

  it("should return 500 on client creation error", async () => {
    const res = await request(app)
      .post("/api/clients")
      .set("Authorization", TEST_TOKEN)
      .send({
        name: "Test",
      })
    expect(res.status).toBe(500)
  })
})
