import { z } from 'zod';

const optionalPhoneSchema = z
  .string()
  .trim()
  .max(40)
  .refine((value) => value.length === 0 || value.length >= 6)
  .optional();

const contactRequestSchema = z
  .object({
    firstName: z.string().trim().min(2).max(60),
    lastName: z.string().trim().min(2).max(60),
    email: z.string().trim().email().max(254),
    phone: optionalPhoneSchema,
    goal: z.string().trim().max(120).optional(),
    message: z.string().trim().min(1).max(3000),
    contactVerification: z.string().max(0),
  })
  .strict();

type ContactRequest = z.infer<typeof contactRequestSchema>;

function fullName(contact: ContactRequest) {
  return `${contact.firstName} ${contact.lastName}`;
}

function customerEmailText(contact: ContactRequest) {
  return [
    `Bonjour ${contact.firstName},`,
    '',
    'Votre message a bien été reçu.',
    'Alexandre vous répondra personnellement sous 24h ouvrées.',
    '',
    'À bientôt,',
    'Alexandre Schutz',
  ].join('\n');
}

function coachEmailText(contact: ContactRequest) {
  return [
    'Une nouvelle demande de contact a été reçue.',
    '',
    `Nom : ${fullName(contact)}`,
    `Email : ${contact.email}`,
    contact.phone ? `Téléphone : ${contact.phone}` : null,
    contact.goal ? `Objectif : ${contact.goal}` : null,
    '',
    'Message :',
    contact.message,
  ]
    .filter((line): line is string => line !== null)
    .join('\n');
}

export default {
  async send(ctx) {
    const parsed = contactRequestSchema.safeParse(ctx.request.body?.data);

    if (!parsed.success) {
      ctx.badRequest('Données de contact invalides', {
        issues: parsed.error.flatten(),
      });
      return;
    }

    const coachEmail = process.env.COACH_EMAIL;

    if (!coachEmail) {
      strapi.log.error('Contact emails skipped: COACH_EMAIL is not configured');
      ctx.internalServerError("L'envoi du message est temporairement indisponible.");
      return;
    }

    const contact = parsed.data;
    const emailService = strapi.plugin('email').service('email');
    const deliveries = await Promise.allSettled([
      emailService.send({
        to: coachEmail,
        replyTo: contact.email,
        subject: `Nouvelle demande de contact - ${fullName(contact)}`,
        text: coachEmailText(contact),
      }),
      emailService.send({
        to: contact.email,
        subject: 'Votre message a bien été reçu',
        text: customerEmailText(contact),
      }),
    ]);
    const failures = deliveries.filter(
      (delivery) => delivery.status === 'rejected',
    );

    if (failures.length > 0) {
      strapi.log.error(
        'One or more contact emails failed',
        failures.map((delivery) => ({
          status: 'rejected',
          message:
            delivery.status === 'rejected' && delivery.reason instanceof Error
              ? delivery.reason.message
              : delivery.status === 'rejected'
                ? String(delivery.reason)
                : 'Unknown email error',
        })),
      );
      ctx.internalServerError("L'envoi du message est temporairement indisponible.");
      return;
    }

    ctx.status = 204;
  },
};
