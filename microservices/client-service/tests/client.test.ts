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

describe("Client API", () => {
  it("should create a new client", async () => {
    const clientData = {
      name: "Rishikumar",
      email: "rishhi@example.com",
      phone: "1234567890",
      company: "Exo Code Labs",
    }

    const res = await request(app)
      .post("/api/clients")
      .send(clientData)
      .expect(201)

    expect(res.body).toMatchObject(clientData)

    const clients = await ClientModel.find()
    expect(clients.length).toBe(1)
    expect(clients[0].name).toBe("Rishikumar")
  })

  it("should fetch all clients", async () => {
    await ClientModel.create([
      { name: "Alice", email: "a@x.com", phone: "111", company: "A Corp" },
      { name: "Bob", email: "b@x.com", phone: "222", company: "B Corp" },
    ])

    const res = await request(app).get("/api/clients").expect(200)

    expect(res.body.length).toBe(2)
    expect(res.body[0]).toHaveProperty("name")
  })

  it("should fetch a client by ID", async () => {
    const client = await ClientModel.create({
      name: "Charlie",
      email: "c@x.com",
      phone: "333",
      company: "C Corp",
    })

    const res = await request(app).get(`/api/clients/${client._id}`).expect(200)

    expect(res.body.name).toBe("Charlie")
  })

  it("should update a client by ID", async () => {
    const client = await ClientModel.create({
      name: "Old Name",
      email: "old@example.com",
      phone: "000",
      company: "Old Co",
    })

    const updates = {
      name: "New Name",
      email: "new@example.com",
      company: "New Co",
    }

    const res = await request(app)
      .put(`/api/clients/${client._id}`)
      .send(updates)
      .expect(200)

    expect(res.body.name).toBe("New Name")
    expect(res.body.email).toBe("new@example.com")
    expect(res.body.company).toBe("New Co")
  })

  it("should delete a client by ID", async () => {
    const client = await ClientModel.create({
      name: "ToDelete",
      email: "delete@me.com",
      phone: "999",
      company: "Bye Co",
    })

    await request(app).delete(`/api/clients/${client._id}`).expect(204)

    const exists = await ClientModel.findById(client._id)
    expect(exists).toBeNull()
  })
})
