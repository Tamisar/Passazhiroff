import type { Core } from '@strapi/strapi';

const REVALIDATE_WEBHOOK_NAME = 'Next.js revalidate';

async function syncRevalidateWebhook(strapi: Core.Strapi) {
  const frontendUrl = process.env.FRONTEND_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!frontendUrl || !secret) {
    strapi.log.warn('FRONTEND_URL or REVALIDATE_SECRET is not set, skipping revalidate webhook');
    return;
  }

  const store = strapi.get('webhookStore');
  const runner = strapi.get('webhookRunner');

  const data = {
    name: REVALIDATE_WEBHOOK_NAME,
    url: new URL('/api/revalidate', frontendUrl).toString(),
    headers: { Authorization: `Bearer ${secret}` },
    events: ['entry.create', 'entry.update', 'entry.delete', 'entry.publish', 'entry.unpublish'],
    isEnabled: true,
  };

  const webhooks: Array<{ id: string; name: string }> = await store.findWebhooks();
  const existing = webhooks.find((w) => w.name === REVALIDATE_WEBHOOK_NAME);
  if (existing) {
    const updated = await store.updateWebhook(existing.id, data);
    if (updated) runner.update(updated);
  } else {
    runner.add(await store.createWebhook(data));
  }
}

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await syncRevalidateWebhook(strapi);
  },
};
