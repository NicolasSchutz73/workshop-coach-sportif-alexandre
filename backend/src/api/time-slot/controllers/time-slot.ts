import { factories } from '@strapi/strapi';
import { z } from 'zod';

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

const generateSchema = z
  .object({
    startDate: z.string().regex(datePattern),
    endDate: z.string().regex(datePattern),
    times: z.array(z.string().regex(timePattern)).min(1),
    sessionTypeId: z.string().min(1),
  })
  .refine(({ startDate, endDate }) => startDate <= endDate, {
    message: 'La date de fin doit être postérieure à la date de début.',
    path: ['endDate'],
  });

function toDatabaseTime(value: string) {
  return `${value}:00.000`;
}

function dateRange(startDate: string, endDate: string) {
  const dates: string[] = [];
  const current = new Date(`${startDate}T00:00:00.000Z`);
  const end = new Date(`${endDate}T00:00:00.000Z`);

  while (current <= end) {
    dates.push(current.toISOString().slice(0, 10));
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return dates;
}

export default factories.createCoreController(
  'api::time-slot.time-slot' as any,
  ({ strapi }) => ({
    async generate(ctx) {
      const parsed = generateSchema.safeParse(ctx.request.body);

      if (!parsed.success) {
        ctx.badRequest('Paramètres de génération invalides', {
          issues: parsed.error.flatten(),
        });
        return;
      }

      const { startDate, endDate, sessionTypeId } = parsed.data;
      const times = [...new Set(parsed.data.times)].sort();
      const sessionType = await (
        strapi.documents('api::session-type.session-type' as any) as any
      ).findOne({
        documentId: sessionTypeId,
      });

      if (!sessionType) {
        ctx.notFound('Type de séance introuvable');
        return;
      }

      const dates = dateRange(startDate, endDate);
      const existingSlots = await strapi.db
        .query('api::time-slot.time-slot' as any)
        .findMany({
          where: {
            date: {
              $gte: startDate,
              $lte: endDate,
            },
            sessionType: {
              id: sessionType.id,
            },
          },
          select: ['date', 'startTime'],
        });
      const existingKeys = new Set(
        existingSlots.map(
          (slot: { date: string; startTime: string }) =>
            `${slot.date}|${slot.startTime.slice(0, 5)}`,
        ),
      );
      const created = [];
      let skipped = 0;

      await strapi.db.transaction(async () => {
        const documents = strapi.documents(
          'api::time-slot.time-slot' as any,
        ) as any;

        for (const date of dates) {
          for (const time of times) {
            const key = `${date}|${time}`;

            if (existingKeys.has(key)) {
              skipped += 1;
              continue;
            }

            const slot = await documents.create({
              data: {
                date,
                startTime: toDatabaseTime(time),
                isAvailable: true,
                sessionType: sessionTypeId,
              },
            });

            existingKeys.add(key);
            created.push(slot);
          }
        }
      });

      ctx.status = 201;
      ctx.body = {
        data: created,
        meta: {
          created: created.length,
          skipped,
        },
      };
    },
  }),
);
