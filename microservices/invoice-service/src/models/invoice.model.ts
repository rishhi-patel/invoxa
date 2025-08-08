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
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    number: { type: String, required: true, unique: true }, // e.g., INV-2025-0001
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
    dueDate: { type: Date },
  },
  { timestamps: true }
)

// Helper to recalc totals
invoiceSchema.methods.recalculateTotals = function () {
  const subtotal = (this.items || []).reduce(
    (sum: number, it: any) => sum + it.quantity * it.unitPrice,
    0
  )
  const taxAmount = subtotal * ((this.taxRate || 0) / 100)
  const total = subtotal + taxAmount

  this.subtotal = +subtotal.toFixed(2)
  this.taxAmount = +taxAmount.toFixed(2)
  this.total = +total.toFixed(2)
}

invoiceSchema.pre("save", function (next) {
  // @ts-ignore
  this.recalculateTotals()
  next()
})

invoiceSchema.pre("findOneAndUpdate", function (next) {
  // recalc for updates: get update payload, simulate totals if items/taxRate changed
  const update: any = this.getUpdate() || {}
  // When using $set, merge up
  const merged = { ...(update.$set || {}), ...update }
  if (merged.items || typeof merged.taxRate !== "undefined") {
    // We can’t access existing doc totals here easily; let Mongoose run validators and then recalc in a post hook
    // Simpler approach: enforce runValidators and then do another update in controller after findOneAndUpdate result
  }
  next()
})

export const InvoiceModel = mongoose.model("Invoice", invoiceSchema)
