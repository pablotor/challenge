export type DataParams = Record<string | number, string | number | boolean>;
export type ContentType = 'application/json' | 'application/x-www-form-urlencoded';

export type ApiFn = <ResponseBodyType>(
  route: string,
  authToken?: string,
  queryParams?: DataParams,
  bodyParams?: DataParams,
  contentType?: ContentType,
) => Promise<ResponseBodyType>;
