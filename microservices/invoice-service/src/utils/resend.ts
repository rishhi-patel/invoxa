import dotenv from "dotenv"
dotenv.config()

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

type SendArgs = { to: string; subject: string; html: string }

export const sendMail = async ({ to, subject, html }: SendArgs) => {
  if (!process.env.RESEND_API_KEY || !process.env.FROM_EMAIL) {
    console.warn(
      "[Resend] Skipping email: missing RESEND_API_KEY or FROM_EMAIL"
    )
    return
  }
  await resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to,
    subject,
    html,
  })
}

export const invoiceStatusTemplate = (opts: {
  clientName?: string
  invoiceNumber: string
  status: string
  total: number
}) => {
  const { clientName = "there", invoiceNumber, status, total } = opts
  return `
    <div style="font-family:Arial,sans-serif">
      <h2>Invoice ${invoiceNumber} ${
    status === "SENT" ? "has been sent" : `is now ${status}`
  }</h2>
      <p>Hi ${clientName},</p>
      <p>Your invoice <b>${invoiceNumber}</b> is now <b>${status}</b>.</p>
      <p>Total: <b>${total.toFixed(2)}</b></p>
      <p>Thank you,<br/>Invoxa</p>
    </div>
  `
}
