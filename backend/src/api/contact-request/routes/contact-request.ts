import type { Core } from '@strapi/strapi';

const config: Core.RouterConfig = {
  type: 'content-api',
  routes: [
    {
      method: 'POST',
      path: '/contact-requests',
      handler: 'api::contact-request.contact-request.send',
    },
  ],
};

export default config;
