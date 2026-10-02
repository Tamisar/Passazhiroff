import type { Core, UID } from '@strapi/strapi';

const populateAll: Core.MiddlewareFactory = (_config, { strapi }) => {
  return async (ctx, next) => {
    const match = ctx.method === 'GET' ? ctx.path.match(/^\/api\/([^/]+)/) : null;

    if (match && ctx.query.populate === undefined) {
      const model = findModelByRoute(strapi, match[1]);
      if (model) ctx.query = { ...ctx.query, populate: buildPopulate(strapi, model, true) };
    }

    await next();
  };
};

export default populateAll;

function findModelByRoute(strapi: Core.Strapi, route: string): UID.Schema | undefined {
  const contentType = Object.values(strapi.contentTypes).find(
    (ct) =>
      ct.uid.startsWith('api::') &&
      (ct.kind === 'singleType' ? ct.info.singularName === route : ct.info.pluralName === route),
  );
  return contentType?.uid;
}

type Attribute = {
  type: string;
  component?: UID.Component;
  components?: UID.Component[];
  target?: string;
};

function buildPopulate(strapi: Core.Strapi, uid: UID.Schema, withRelations: boolean) {
  const attributes = strapi.getModel(uid).attributes as Record<string, Attribute>;
  const populate: Record<string, unknown> = {};

  const nested = (componentUid: UID.Schema) => {
    const inner = buildPopulate(strapi, componentUid, withRelations);
    return Object.keys(inner).length ? { populate: inner } : true;
  };

  for (const [name, attr] of Object.entries(attributes)) {
    switch (attr.type) {
      case 'media':
        populate[name] = true;
        break;
      case 'component':
        populate[name] = nested(attr.component!);
        break;
      case 'dynamiczone':
        populate[name] = { on: Object.fromEntries(attr.components!.map((c) => [c, nested(c)])) };
        break;
      case 'relation':
        if (withRelations && attr.target?.startsWith('api::') && name !== 'localizations') {
          const inner = buildPopulate(strapi, attr.target as UID.Schema, false);
          populate[name] = Object.keys(inner).length ? { populate: inner } : true;
        }
        break;
    }
  }

  return populate;
}
