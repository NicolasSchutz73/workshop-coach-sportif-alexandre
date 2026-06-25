import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => {
  const isProduction = env('NODE_ENV') === 'production';
  const smtpHost = env('SMTP_HOST');
  const smtpUsername = env('SMTP_USERNAME');
  const smtpPassword = env('SMTP_PASSWORD');
  const emailConfig = smtpHost && smtpUsername && smtpPassword
    ? {
        email: {
          config: {
            provider: 'nodemailer',
            providerOptions: {
              host: smtpHost,
              port: env.int('SMTP_PORT', 587),
              secure: env.bool('SMTP_SECURE', false),
              auth: {
                user: smtpUsername,
                pass: smtpPassword,
              },
            },
            settings: {
              defaultFrom: env('EMAIL_DEFAULT_FROM', smtpUsername),
              defaultReplyTo: env('EMAIL_DEFAULT_REPLY_TO', smtpUsername),
              testAddress: env('EMAIL_TEST_ADDRESS', smtpUsername),
            },
          },
        },
      }
    : {};

  return {
    ...emailConfig,
    mcp: {
      enabled: !isProduction,
      config: {
        session: {
          type: 'memory',
        },
        allowedIPs: ['127.0.0.1', '::1'],
      },
    },
  };
};

export default config;
