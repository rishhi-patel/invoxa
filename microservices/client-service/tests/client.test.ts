import mongoose from "mongoose"
import request from "supertest"
import { MongoMemoryServer } from "mongodb-memory-server"
import app from "../src"
import { ClientModel } from "../src/models/client.model"

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

afterEach(async () => {
  await ClientModel.deleteMany({})
})

jest.spyOn(ClientModel.prototype, "save").mockImplementationOnce(() => {
  throw new Error("Mock error")
})

describe("Client API", () => {
  it("should hit logger middleware", async () => {
    const res = await request(app).get("/logger-test")
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
  })

  it("should return all clients", async () => {
    await ClientModel.create({
      name: "Test",
      email: "t@t.com",
      phone: "123",
      company: "X",
    })
    const res = await request(app).get("/api/clients")
    expect(res.status).toBe(200)
    expect(res.body.length).toBe(1)
  })

  it("should get client by ID", async () => {
    const client = await ClientModel.create({
      name: "R",
      email: "r@r.com",
      phone: "000",
      company: "C",
    })
    const res = await request(app).get(`/api/clients/${client._id}`)
    expect(res.status).toBe(200)
    expect(res.body.name).toBe("R")
  })

  it("should return 404 for non-existing client", async () => {
    const fakeId = new mongoose.Types.ObjectId()
    const res = await request(app).get(`/api/clients/${fakeId}`)
    expect(res.status).toBe(404)
    expect(res.body.message).toBe("Client not found")
  })

  it("should update a client", async () => {
    const client = await ClientModel.create({
      name: "Old",
      email: "o@o.com",
      phone: "123",
      company: "OldCo",
    })
    const res = await request(app)
      .put(`/api/clients/${client._id}`)
      .send({ name: "Updated" })
    expect(res.status).toBe(200)
    expect(res.body.name).toBe("Updated")
  })

  it("should return 404 on update if client not found", async () => {
    const res = await request(app)
      .put(`/api/clients/${new mongoose.Types.ObjectId()}`)
      .send({ name: "Test" })
    expect(res.status).toBe(404)
  })

  it("should delete a client", async () => {
    const client = await ClientModel.create({
      name: "ToDelete",
      email: "d@d.com",
      phone: "000",
      company: "X",
    })
    const res = await request(app).delete(`/api/clients/${client._id}`)
    expect(res.status).toBe(204)
  })

  it("should return 404 when deleting non-existent client", async () => {
    const res = await request(app).delete(
      `/api/clients/${new mongoose.Types.ObjectId()}`
    )
    expect(res.status).toBe(404)
  })

  it("should handle malformed ObjectId in get by ID", async () => {
    const res = await request(app).get("/api/clients/invalid-id")
    expect(res.status).toBe(500)
    expect(res.body.message).toMatch(/Failed to fetch client/)
  })

  it("should return 500 on client creation error", async () => {
    const res = await request(app).post("/api/clients").send({
      name: "Test",
      email: "fail@example.com",
    })
    expect(res.status).toBe(500)
  })
})
