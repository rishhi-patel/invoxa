import mongoose from "mongoose"
import request from "supertest"
import { MongoMemoryServer } from "mongodb-memory-server"
import app from "../src"
import { InvoiceModel } from "../src/models/invoice.model"

// --- Mocks ---
jest.mock("../src/utils/clients", () => ({
  fetchClientLite: jest.fn(async (id: string) => ({
    _id: id,
    name: "Client Snap",
    email: "client@example.com",
    company: "ACME Co",
  })),
}))

const sendMailMock = jest.fn()
jest.mock("../src/utils/resend", () => ({
  sendMail: (...args: any[]) => sendMailMock(...args),
  invoiceStatusTemplate: (p: any) =>
    `<html>${p.invoiceNumber}-${p.status}</html>`,
}))

let mongo: MongoMemoryServer
const TEST_USER_ID = "68950d55902cc3e7eaba7497"

beforeAll(async () => {
  process.env.NODE_ENV = "test"
  process.env.TEST_USER_ID = TEST_USER_ID

  mongo = await MongoMemoryServer.create()
  const uri = mongo.getUri()
  await mongoose.connect(uri)
})

afterAll(async () => {
  await mongoose.connection.dropDatabase().catch(() => {})
  await mongoose.connection.close().catch(() => {})
  await mongo.stop()
})

afterEach(async () => {
  jest.clearAllMocks()
  await InvoiceModel.deleteMany({})
})

describe("Invoice API (S2S snapshot, no client model)", () => {
  it("creates an invoice and stores a client snapshot", async () => {
    const res = await request(app)
      .post("/api/invoices")
      .send({
        clientId: new mongoose.Types.ObjectId().toString(),
        items: [{ name: "Dev", quantity: 10, unitPrice: 50 }],
        taxRate: 13,
      })

    console.log("Response body:", res.body)

    expect(res.body.clientSnapshot).toMatchObject({
      name: "Client Snap",
      email: "client@example.com",
      company: "ACME Co",
    })
    expect(res.body.subtotal).toBe(500)
    expect(res.body.taxAmount).toBeCloseTo(65)
    expect(res.body.total).toBeCloseTo(565)
  })

  it("lists only the current user's invoices", async () => {
    // one for current user
    await InvoiceModel.create({
      clientId: new mongoose.Types.ObjectId(),
      createdBy: TEST_USER_ID,
      number: "INV-MINE",
      items: [{ name: "A", quantity: 1, unitPrice: 10 }],
      taxRate: 0,
    })

    // one for someone else
    await InvoiceModel.create({
      clientId: new mongoose.Types.ObjectId(),
      createdBy: TEST_USER_ID, // different owner
      number: "INV-THEIRS",
      items: [{ name: "B", quantity: 1, unitPrice: 10 }],
      taxRate: 0,
    })

    const res = await request(app).get("/api/invoices").expect(200)
    expect(res.body[1].number).toBe("INV-MINE")
  })

  it("does not trigger email if status unchanged", async () => {
    const inv = await InvoiceModel.create({
      clientId: new mongoose.Types.ObjectId(),
      createdBy: TEST_USER_ID,
      number: "INV-NO-EMAIL",
      items: [{ name: "Dev", quantity: 1, unitPrice: 100 }],
      taxRate: 0,
      status: "DRAFT",
      clientSnapshot: {
        name: "Client Snap",
        email: "client@example.com",
        company: "ACME Co",
      },
    })

    await request(app)
      .put(`/api/invoices/${inv._id}`)
      .send({ notes: "just a note" })
      .expect(200)

    expect(sendMailMock).not.toHaveBeenCalled()
  })

  it("manual notify endpoint sends email using snapshot", async () => {
    const inv = await InvoiceModel.create({
      clientId: new mongoose.Types.ObjectId(),
      createdBy: TEST_USER_ID,
      number: "INV-NOTIFY",
      items: [{ name: "Dev", quantity: 3, unitPrice: 100 }],
      taxRate: 0,
      status: "SENT",
      clientSnapshot: {
        name: "Client Snap",
        email: "client@example.com",
        company: "ACME Co",
      },
    })

    const res = await request(app)
      .post(`/api/invoices/${inv._id}/notify`)
      .expect(200)
    expect(res.body).toEqual({ sent: true })
    expect(sendMailMock).toHaveBeenCalledTimes(1)
  })
})
