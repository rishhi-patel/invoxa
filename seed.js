// seed.js
import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

async function seed() {
  try {
    /** ------------------ 1. Connect to Auth Service DB ------------------ **/
    const authConn = await mongoose.createConnection(process.env.AUTH_DB_URI)
    const AuthUser = authConn.model(
      "User",
      new mongoose.Schema({
        email: String,
        password: String,
      })
    )
    await AuthUser.deleteMany({})
    await AuthUser.create({
      _id: new mongoose.Types.ObjectId("68950d55902cc3e7eaba7497"),
      email: "rishhi@example1.com",
      password: "$2b$10$yN4vSkqN5gvrwB1WAaDHfeCBo2ARa9IZ6j6VCi6FigIXBrofkjP0m",
    })
    console.log("✅ Auth users seeded")

    /** ------------------ 2. Connect to Client Service DB ------------------ **/
    const clientConn = await mongoose.createConnection(
      process.env.CLIENT_DB_URI
    )
    const Client = clientConn.model(
      "Client",
      new mongoose.Schema({
        name: String,
        email: String,
        phone: String,
        company: String,
        createdBy: mongoose.Schema.Types.ObjectId,
      })
    )
    await Client.deleteMany({})
    await Client.create({
      _id: new mongoose.Types.ObjectId("689576e4c8be9a3481fd7934"),
      name: "Rishhi Patel",
      email: "patel.rishi3001@gmail.com",
      phone: "+1-555-123-4567",
      company: "EXOcode Labs",
      createdBy: new mongoose.Types.ObjectId("68950d55902cc3e7eaba7497"),
      createdAt: new Date("2025-08-08T04:02:44.427Z"),
      updatedAt: new Date("2025-08-08T04:02:44.427Z"),
    })
    console.log("✅ Clients seeded")

    /** ------------------ 3. Connect to Invoice Service DB ------------------ **/
    const invoiceConn = await mongoose.createConnection(
      process.env.INVOICE_DB_URI
    )
    const Invoice = invoiceConn.model(
      "Invoice",
      new mongoose.Schema({
        clientId: mongoose.Schema.Types.ObjectId,
        createdBy: mongoose.Schema.Types.ObjectId,
        number: String,
        items: [
          {
            name: String,
            quantity: Number,
            unitPrice: Number,
          },
        ],
        currency: String,
        subtotal: Number,
        taxRate: Number,
        taxAmount: Number,
        total: Number,
        status: String,
        clientSnapshot: {
          name: String,
          email: String,
          company: String,
        },
        issuedAt: Date,
      })
    )
    await Invoice.deleteMany({})
    await Invoice.create({
      _id: new mongoose.Types.ObjectId("689796195005d1dce2974473"),
      clientId: new mongoose.Types.ObjectId("689576e4c8be9a3481fd7934"),
      createdBy: new mongoose.Types.ObjectId("68950d55902cc3e7eaba7497"),
      number: "INV-2025-0002",
      items: [
        {
          name: "API Dev",
          quantity: 8,
          unitPrice: 80,
        },
      ],
      currency: "USD",
      subtotal: 640,
      taxRate: 13,
      taxAmount: 83.2,
      total: 723.2,
      status: "DRAFT",
      clientSnapshot: {
        name: "Rishhi Patel",
        email: "patel.rishi3001@gmail.com",
        company: "EXOcode Labs",
      },
      issuedAt: new Date("2025-08-09T18:40:25.813Z"),
      createdAt: new Date("2025-08-09T18:40:25.815Z"),
      updatedAt: new Date("2025-08-09T18:40:25.815Z"),
    })
    console.log("✅ Invoices seeded")

    /** ------------------ Close Connections ------------------ **/
    await authConn.close()
    await clientConn.close()
    await invoiceConn.close()
    console.log("🎉 All seeding complete")
  } catch (err) {
    console.error("❌ Seeding failed:", err)
    process.exit(1)
  }
}

seed()
