import { Request, Response } from "express"
import { InvoiceModel } from "../models/invoice.model"

/**
 * Expect body:
 * {
 *   clientId: string(ObjectId),
 *   number: string,
 *   items: [{ name, quantity, unitPrice }],
 *   taxRate?: number,
 *   currency?: string,
 *   notes?: string,
 *   issuedAt?: Date,
 *   dueDate?: Date
 * }
 */
export const createInvoice = async (req: Request, res: Response) => {
  try {
    const invoice = new InvoiceModel(req.body)
    const saved = await invoice.save()
    res.status(201).json(saved)
  } catch (error) {
    res.status(500).json({ message: `Failed to create invoice: ${error}` })
  }
}

export const listInvoices = async (_req: Request, res: Response) => {
  try {
    const list = await InvoiceModel.find().sort({ createdAt: -1 })
    res.json(list)
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch invoices: ${error}` })
  }
}

export const getInvoiceById = async (req: Request, res: Response) => {
  try {
    const doc = await InvoiceModel.findById(req.params.id)
    if (!doc) return res.status(404).json({ message: "Invoice not found" })
    res.json(doc)
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch invoice: ${error}` })
  }
}

export const updateInvoice = async (req: Request, res: Response) => {
  try {
    // Use findById first so we can recalc totals reliably
    const doc = await InvoiceModel.findById(req.params.id)
    if (!doc) return res.status(404).json({ message: "Invoice not found" })

    // update fields
    const fields = [
      "items",
      "taxRate",
      "currency",
      "status",
      "notes",
      "issuedAt",
      "dueDate",
      "number",
    ]
    for (const k of fields) {
      if (k in req.body) (doc as any)[k] = (req.body as any)[k]
    }
    // totals
    // @ts-ignore
    doc.recalculateTotals()

    const saved = await doc.save()
    res.json(saved)
  } catch (error) {
    res.status(500).json({ message: `Failed to update invoice: ${error}` })
  }
}

export const deleteInvoice = async (req: Request, res: Response) => {
  try {
    const deleted = await InvoiceModel.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ message: "Invoice not found" })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ message: `Failed to delete invoice: ${error}` })
  }
}
