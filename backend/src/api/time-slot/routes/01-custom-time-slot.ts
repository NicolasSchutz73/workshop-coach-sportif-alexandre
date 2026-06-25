import type { Core } from '@strapi/strapi';

const config: Core.RouterConfig = {
  type: 'content-api',
  routes: [
    {
      method: 'POST',
      path: '/time-slots/generate',
      handler: 'api::time-slot.time-slot.generate',
    },
  ],
};

export default config;
