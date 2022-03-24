export type DataParams = Record<string | number, string | number | boolean>;

export type ApiFn = (
  route: string,
  authToken?: string,
  queryParams?: DataParams,
  bodyParams?: DataParams,
  contentType?: 'application/json' | 'application/x-www-form-urlencoded',
) => Promise<unknown>;
