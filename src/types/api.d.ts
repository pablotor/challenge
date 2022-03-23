export type QueryParams = Record<string, string | number | boolean>;

export type ApiFn = (
  route: string,
  authToken?: string,
  queryParams?: QueryParams,
) => Promise<unknown>;
