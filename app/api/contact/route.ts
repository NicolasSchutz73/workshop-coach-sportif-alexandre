import nodemailer from 'nodemailer'
import { z } from 'zod'

export const runtime = 'nodejs'

const contactRequestSchema = z
  .object({
    firstName: z.string().trim().min(2).max(60),
    lastName: z.string().trim().min(2).max(60),
    email: z.string().trim().email().max(254),
    phone: z
      .string()
      .trim()
      .max(40)
      .refine((value) => value.length === 0 || value.length >= 6)
      .optional(),
    message: z.string().trim().min(1).max(3000),
    contactVerification: z.string().max(0),
  })
  .strict()

function getRequiredEnvironment() {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT)
  const secure = process.env.SMTP_SECURE
  const user = process.env.SMTP_USERNAME
  const password = process.env.SMTP_PASSWORD
  const from = process.env.EMAIL_DEFAULT_FROM
  const coachEmail = process.env.COACH_EMAIL

  if (
    !host ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535 ||
    (secure !== 'true' && secure !== 'false') ||
    !user ||
    !password ||
    !from ||
    !coachEmail
  ) {
    throw new Error(
      'Missing contact SMTP environment',
    )
  }

  return {
    host,
    port,
    secure: secure === 'true',
    user,
    password,
    from,
    coachEmail,
  }
}

export async function POST(request: Request) {
  let environment: ReturnType<typeof getRequiredEnvironment>

  try {
    environment = getRequiredEnvironment()
  } catch (error) {
    console.error(error)
    return Response.json(
      { error: "L'envoi du message est temporairement indisponible." },
      { status: 500 },
    )
  }

  const body = await request.json().catch(() => null)
  const parsed = contactRequestSchema.safeParse(body)

  if (!parsed.success) {
    return Response.json(
      { error: 'Les informations de contact sont invalides.' },
      { status: 400 },
    )
  }

  const { firstName, lastName, email, phone, message } = parsed.data
  const text = [
    `Prénom : ${firstName}`,
    `Nom : ${lastName}`,
    `Email : ${email}`,
    phone ? `Téléphone : ${phone}` : null,
    '',
    message,
  ]
    .filter((line): line is string => line !== null)
    .join('\n')

  try {
    const transporter = nodemailer.createTransport({
      host: environment.host,
      port: environment.port,
      secure: environment.secure,
      auth: {
        user: environment.user,
        pass: environment.password,
      },
      disableFileAccess: true,
      disableUrlAccess: true,
    })

    await transporter.sendMail({
      from: environment.from,
      to: environment.coachEmail,
      replyTo: email,
      subject: `Nouveau message de ${firstName} ${lastName}`,
      text,
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error('Unable to send contact email via SMTP', error)
    return Response.json(
      { error: "L'envoi du message est temporairement indisponible." },
      { status: 502 },
    )
  }
}
