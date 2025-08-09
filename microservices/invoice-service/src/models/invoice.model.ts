import mongoose from "mongoose"

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false }
)

const invoiceSchema = new mongoose.Schema(
  {
    clientId: { type: mongoose.Schema.Types.ObjectId, required: true }, // no ref
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
    number: { type: String, required: true, unique: true },
    items: { type: [itemSchema], default: [] },
    currency: { type: String, default: "USD" },
    subtotal: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0 }, // percent, e.g. 13 for 13%
    taxAmount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["DRAFT", "SENT", "PAID", "VOID"],
      default: "DRAFT",
    },
    notes: { type: String },
    issuedAt: { type: Date, default: Date.now },
    dueDate: Date,
    // denormalized client snapshot
    clientSnapshot: {
      name: String,
      email: String,
      company: String,
    },
  },
  { timestamps: true }
)

invoiceSchema.index({ createdBy: 1 })
invoiceSchema.index({ clientId: 1 })

invoiceSchema.methods.recalculateTotals = function () {
  const subtotal = (this.items || []).reduce(
    (sum: number, it: any) => sum + (it.quantity ?? 0) * (it.unitPrice ?? 0),
    0
  )
  const taxAmount = subtotal * ((this.taxRate || 0) / 100)
  this.subtotal = +subtotal.toFixed(2)
  this.taxAmount = +taxAmount.toFixed(2)
  this.total = +(subtotal + taxAmount).toFixed(2)
}

invoiceSchema.pre("save", function (next) {
  // @ts-ignore
  this.recalculateTotals()
  next()
})

export const InvoiceModel = mongoose.model("Invoice", invoiceSchema)
