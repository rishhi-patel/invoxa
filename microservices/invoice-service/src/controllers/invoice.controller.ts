import { Request, Response } from "express"
import { InvoiceModel } from "../models/invoice.model"
import { sendMail, invoiceStatusTemplate } from "../utils/resend"

type AuthedReq = Request & {
  user?: { id?: string; email?: string; role?: string }
}

export const createInvoice = async (req: AuthedReq, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" })

    const payload = {
      ...req.body,
      createdBy: req.user,
    }
    console.log("Creating invoice with payload:", payload)

    const invoice = new InvoiceModel(payload)
    const saved = await invoice.save()

    console.log("Invoice created:", saved)
    // return populated client info
    const populated = await InvoiceModel.findById(saved._id)
      .populate({ path: "clientId", select: "name email company" })
      .exec()
    console
    res.status(201).json(populated)
  } catch (error) {
    res.status(500).json({ message: `Failed to create invoice: ${error}` })
  }
}

export const listInvoices = async (req: AuthedReq, res: Response) => {
  try {
    if (!req?.user) return res.status(401).json({ message: "Unauthorized" })

    const list = await InvoiceModel.find({ createdBy: req.user })
      .sort({ createdAt: -1 })
      .populate({ path: "clientId", select: "name email company" })

    res.json(list)
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch invoices: ${error}` })
  }
}

export const getInvoiceById = async (req: AuthedReq, res: Response) => {
  try {
    if (!req?.user) return res.status(401).json({ message: "Unauthorized" })

    const doc = await InvoiceModel.findOne({
      _id: req.params.id,
      createdBy: req.user,
    }).populate({ path: "clientId", select: "name email company" })

    if (!doc) return res.status(404).json({ message: "Invoice not found" })
    res.json(doc)
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch invoice: ${error}` })
  }
}

export const updateInvoice = async (req: AuthedReq, res: Response) => {
  try {
    if (!req?.user) return res.status(401).json({ message: "Unauthorized" })

    const doc = await InvoiceModel.findOne({
      _id: req.params.id,
      createdBy: req.user,
    })

    if (!doc) return res.status(404).json({ message: "Invoice not found" })

    // track status before update
    const prevStatus = doc.status

    // apply changes
    const fields = [
      "items",
      "taxRate",
      "currency",
      "status",
      "notes",
      "issuedAt",
      "dueDate",
      "number",
      "clientId",
    ]
    for (const k of fields) {
      if (k in req.body) (doc as any)[k] = (req.body as any)[k]
    }
    // @ts-ignore
    doc.recalculateTotals()
    const saved = await doc.save()

    // populate for response & email
    const populated = await InvoiceModel.findById(saved._id).populate({
      path: "clientId",
      select: "name email company",
    })

    // if status changed, notify client
    if (req.body.status && req.body.status !== prevStatus) {
      const client = (populated as any)?.clientId
      if (client?.email) {
        const html = invoiceStatusTemplate({
          clientName: client.name,
          invoiceNumber: populated?.number!,
          status: populated?.status!,
          total: populated?.total!,
        })
        // fire and forget; do not block response
        sendMail({
          to: client.email,
          subject: `Invoice ${populated?.number} is now ${populated?.status}`,
          html,
        }).catch(console.error)
      }
    }

    res.json(populated)
  } catch (error) {
    res.status(500).json({ message: `Failed to update invoice: ${error}` })
  }
}

export const deleteInvoice = async (req: AuthedReq, res: Response) => {
  try {
    if (!req?.user) return res.status(401).json({ message: "Unauthorized" })

    const deleted = await InvoiceModel.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user,
    })

    if (!deleted) return res.status(404).json({ message: "Invoice not found" })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ message: `Failed to delete invoice: ${error}` })
  }
}

// Manual resend endpoint (optional)
export const notifyInvoice = async (req: AuthedReq, res: Response) => {
  try {
    if (!req?.user) return res.status(401).json({ message: "Unauthorized" })

    const inv = await InvoiceModel.findOne({
      _id: req.params.id,
      createdBy: req.user,
    }).populate({ path: "clientId", select: "name email company" })

    if (!inv) return res.status(404).json({ message: "Invoice not found" })

    const client = (inv as any).clientId
    if (!client?.email)
      return res.status(400).json({ message: "Client has no email" })

    const html = invoiceStatusTemplate({
      clientName: client.name,
      invoiceNumber: inv.number,
      status: inv.status,
      total: inv.total,
    })

    await sendMail({
      to: client.email,
      subject: `Invoice ${inv.number} is now ${inv.status}`,
      html,
    })

    res.json({ sent: true })
  } catch (error) {
    res.status(500).json({ message: `Failed to notify: ${error}` })
  }
}
