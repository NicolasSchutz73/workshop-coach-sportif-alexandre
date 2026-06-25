import { factories } from '@strapi/strapi';
import { z } from 'zod';

const bookingSchema = z.object({
  clientName: z.string().trim().min(2).max(120),
  clientEmail: z.string().trim().email().max(254),
  clientPhone: z.string().trim().min(6).max(40),
  message: z.string().trim().max(3000).optional(),
  timeSlotId: z.string().min(1),
  sessionTypeId: z.string().min(1),
});

class BookingConflictError extends Error {}
class BookingValidationError extends Error {}

function formatBookingDate(date: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'full',
    timeZone: 'Europe/Paris',
  }).format(new Date(`${date}T12:00:00.000Z`));
}

async function sendBookingEmails(
  strapi: any,
  booking: z.infer<typeof bookingSchema>,
  details: {
    timeSlot: { date: string; startTime: string };
    sessionType: { name: string };
  },
) {
  const coachEmail = process.env.COACH_EMAIL;

  if (!coachEmail) {
    strapi.log.warn('Booking emails skipped: COACH_EMAIL is not configured');
    return false;
  }

  const date = formatBookingDate(details.timeSlot.date);
  const time = details.timeSlot.startTime.slice(0, 5);
  const clientText = [
    `Bonjour ${booking.clientName},`,
    '',
    'Votre demande de réservation est bien enregistrée.',
    `Type de séance : ${details.sessionType.name}`,
    `Date : ${date}`,
    `Heure : ${time}`,
    '',
    'Le coach vous confirme personnellement le rendez-vous sous 24h.',
  ].join('\n');
  const coachText = [
    'Une nouvelle demande de réservation a été enregistrée.',
    '',
    `Nom : ${booking.clientName}`,
    `Email : ${booking.clientEmail}`,
    `Téléphone : ${booking.clientPhone}`,
    `Type de séance : ${details.sessionType.name}`,
    `Date : ${date}`,
    `Heure : ${time}`,
    booking.message ? `Message : ${booking.message}` : null,
  ]
    .filter((line): line is string => line !== null)
    .join('\n');
  const emailService = strapi.plugin('email').service('email');
  const deliveries = await Promise.allSettled([
    emailService.send({
      to: booking.clientEmail,
      subject: 'Votre demande de réservation est bien enregistrée',
      text: clientText,
    }),
    emailService.send({
      to: coachEmail,
      replyTo: booking.clientEmail,
      subject: `Nouvelle demande de réservation - ${booking.clientName}`,
      text: coachText,
    }),
  ]);
  const failures = deliveries.filter(
    (delivery) => delivery.status === 'rejected',
  );

  if (failures.length > 0) {
    strapi.log.error(
      'One or more booking emails failed',
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
  }

  return failures.length === 0;
}


export default factories.createCoreController(
  'api::booking.booking' as any,
  ({ strapi }) => ({
    async create(ctx) {
      const parsed = bookingSchema.safeParse(ctx.request.body?.data);

      if (!parsed.success) {
        ctx.badRequest('Données de réservation invalides', {
          issues: parsed.error.flatten(),
        });
        return;
      }

      const {
        clientName,
        clientEmail,
        clientPhone,
        message,
        timeSlotId,
        sessionTypeId,
      } = parsed.data;

      try {
        let booking: any;
        let timeSlot: any;
        let sessionType: any;

        await strapi.db.transaction(async () => {
          timeSlot = await strapi.db
            .query('api::time-slot.time-slot' as any)
            .findOne({
              where: {
                documentId: timeSlotId,
              },
              populate: {
                sessionType: true,
              },
            });

          if (!timeSlot || !timeSlot.isAvailable) {
            throw new BookingConflictError(
              'Ce créneau vient d’être pris, veuillez en choisir un autre',
            );
          }

          sessionType = timeSlot.sessionType;

          if (!sessionType || sessionType.documentId !== sessionTypeId) {
            throw new BookingValidationError(
              'Le créneau ne correspond pas au type de séance sélectionné.',
            );
          }

          const updatedSlot = await strapi.db
            .query('api::time-slot.time-slot' as any)
            .update({
              where: {
                id: timeSlot.id,
                isAvailable: true,
              },
              data: {
                isAvailable: false,
              },
            });

          if (!updatedSlot) {
            throw new BookingConflictError(
              'Ce créneau vient d’être pris, veuillez en choisir un autre',
            );
          }

          booking = await (
            strapi.documents('api::booking.booking' as any) as any
          ).create({
            data: {
              clientName,
              clientEmail,
              clientPhone,
              message: message || null,
              status: 'pending',
              timeSlot: timeSlotId,
              sessionType: sessionTypeId,
            },
          });
        });

        const details = {
          timeSlot: {
            documentId: timeSlot.documentId,
            date: timeSlot.date,
            startTime: timeSlot.startTime,
          },
          sessionType: {
            documentId: sessionType.documentId,
            name: sessionType.name,
            duration: sessionType.duration,
            mode: sessionType.mode,
            slug: sessionType.slug,
          },
        };
        const emailsSent = await sendBookingEmails(strapi, parsed.data, details);

        ctx.status = 201;
        ctx.body = {
          data: booking,
          meta: {
            ...details,
            emailsSent,
          },
        };
      } catch (error) {
        if (error instanceof BookingConflictError) {
          ctx.status = 409;
          ctx.body = {
            error: {
              status: 409,
              name: 'BookingConflictError',
              message: error.message,
            },
          };
          return;
        }

        if (error instanceof BookingValidationError) {
          ctx.badRequest(error.message);
          return;
        }

        throw error;
      }
    },
  }),
);
