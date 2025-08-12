import { Request, Response } from "express"
import { InvoiceModel } from "../models/invoice.model"
import { fetchClientLite } from "../utils/clients"
import { sendMail, invoiceStatusTemplate } from "../utils/resend"

type AuthedReq = Request & { user?: { id?: string } }

function getUserId(req: AuthedReq, res: Response): string | undefined {
  if (!req?.user || !req.user.id) {
    res.status(401).json({ message: "Unauthorized" })
    return undefined
  }
  return req.user.id
}

async function generateUniqueInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear()
  let counter = 1
  let invoiceNumber: string
  let exists = true

  while (exists) {
    invoiceNumber = `INV-${year}-${counter.toString().padStart(4, "0")}`
    // Check if invoice number already exists
    // @ts-ignore
    exists = await InvoiceModel.exists({ number: invoiceNumber })
    if (exists) counter++
  }
  return invoiceNumber!
}

export const createInvoice = async (req: AuthedReq, res: Response) => {
  try {
    const userId = getUserId(req, res)
    if (!userId) return

    const client = await fetchClientLite(req.body.clientId)
    req.body.number = await generateUniqueInvoiceNumber()
    const inv = new InvoiceModel({
      ...req.body,
      createdBy: userId,
      clientSnapshot: client
        ? { name: client.name, email: client.email, company: client.company }
        : undefined,
    })

    const saved = await inv.save()
    return res.status(201).json(saved)
  } catch (e) {
    return res.status(500).json({ message: `Failed to create invoice: ${e}` })
  }
}

export const listInvoices = async (req: AuthedReq, res: Response) => {
  const userId = getUserId(req, res)
  if (!userId) return
  const list = await InvoiceModel.find({ createdBy: userId }).sort({
    createdAt: -1,
  })
  return res.json(list)
}

export const getInvoiceById = async (req: AuthedReq, res: Response) => {
  const userId = getUserId(req, res)
  if (!userId) return
  const doc = await InvoiceModel.findOne({
    _id: req.params.id,
    createdBy: userId,
  })
  if (!doc) return res.status(404).json({ message: "Invoice not found" })
  return res.json(doc)
}

export const updateInvoice = async (req: AuthedReq, res: Response) => {
  try {
    const userId = getUserId(req, res)
    if (!userId) return
    const doc = await InvoiceModel.findOne({
      _id: req.params.id,
      createdBy: userId,
    })
    if (!doc) return res.status(404).json({ message: "Invoice not found" })

    const prevStatus = doc.status

    // merge updates
    Object.assign(doc, req.body)

    // refresh snapshot if clientId changed
    if (req.body.clientId) {
      const client = await fetchClientLite(req.body.clientId)
      doc.clientSnapshot = client
        ? { name: client.name, email: client.email, company: client.company }
        : undefined
    }

    // @ts-ignore
    doc.recalculateTotals()
    const saved = await doc.save()

    // email on status change
    if (
      req.body.status &&
      req.body.status !== prevStatus &&
      saved.clientSnapshot?.email
    ) {
      const html = invoiceStatusTemplate({
        clientName: saved.clientSnapshot.name ?? undefined,
        invoiceNumber: saved.number,
        status: saved.status,
        total: saved.total!,
      })
      // fire-and-forget
      sendMail({
        to: saved.clientSnapshot.email,
        subject: `Invoice ${saved.number} is now ${saved.status}`,
        html,
      }).catch(console.error)
    }

    return res.json(saved)
  } catch (e) {
    return res.status(500).json({ message: `Failed to update invoice: ${e}` })
  }
}

export const deleteInvoice = async (req: AuthedReq, res: Response) => {
  const userId = getUserId(req, res)
  if (!userId) return
  const deleted = await InvoiceModel.findOneAndDelete({
    _id: req.params.id,
    createdBy: userId,
  })
  if (!deleted) return res.status(404).json({ message: "Invoice not found" })
  return res.status(204).send()
}

export const notifyInvoice = async (req: AuthedReq, res: Response) => {
  const userId = getUserId(req, res)
  if (!userId) return
  const inv = await InvoiceModel.findOne({
    _id: req.params.id,
    createdBy: userId,
  })
  if (!inv) return res.status(404).json({ message: "Invoice not found" })
  if (!inv.clientSnapshot?.email)
    return res.status(400).json({ message: "Client has no email" })

  const html = invoiceStatusTemplate({
    clientName: inv.clientSnapshot.name ?? undefined,
    invoiceNumber: inv.number,
    status: inv.status,
    total: inv.total!,
  })
  await sendMail({
    to: inv.clientSnapshot.email,
    subject: `Invoice ${inv.number} is now ${inv.status}`,
    html,
  })
  return res.json({ sent: true })
}
