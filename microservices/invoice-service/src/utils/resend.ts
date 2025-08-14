import dotenv from "dotenv"
dotenv.config()

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

type SendArgs = { to: string; subject: string; html: string }

export const sendMail = async (opts: {
  to: string
  subject: string
  html: string
}) => {
  if (!process.env.RESEND_API_KEY || !process.env.FROM_EMAIL) return
  await resend.emails.send({ from: process.env.FROM_EMAIL!, ...opts })
}
export const invoiceStatusTemplate = (p: {
  clientName?: string
  invoiceNumber: string
  status: string
  total: number
}) => `
  <div style="font-family:Arial,sans-serif">
    <h2>Invoice ${p.invoiceNumber} is now ${p.status}</h2>
    <p>Hi ${p.clientName || "there"},</p>
    <p>Your invoice <b>${p.invoiceNumber}</b> is now <b>${p.status}</b>.</p>
    <p>Total: <b>${p.total.toFixed(2)}</b></p>
    <p>— Invoxa</p>
  </div>
`
