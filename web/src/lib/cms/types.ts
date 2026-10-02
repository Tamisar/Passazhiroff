export type Query = {
  filters?: Record<string, string>;
  sort?: `${string}:${'asc' | 'desc'}`;
};

export interface CmsProvider {
  list(type: string, query?: Query): Promise<unknown[]>;
  get(type: string): Promise<unknown>;
}
