import fetch from 'node-fetch';

import { ApiFn, DataParams } from '../types/api';

const METHODS = ['get', 'put', 'post'];

const toQueryString = (params: DataParams) => Object.keys(params)
  .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  .join('&');

const request = async (
  type: string,
  route: string,
  authToken?: string,
  queryParams?: DataParams,
  bodyParams?: DataParams,
  contentType = 'application/json',
) => {
  const headers: HeadersInit = {
    Accept: 'application/json',
    'Content-Type': contentType,
    Authorization: authToken || '',
  };
  let queryString: string | undefined;
  if (queryParams) {
    queryString = toQueryString(queryParams);
  }
  let body: string | undefined;
  if (bodyParams) {
    body = contentType === 'application/json'
      ? JSON.stringify(bodyParams)
      : toQueryString(bodyParams);
  }

  return fetch(
    queryString ? `${route}?${queryString}` : route,
    {
      method: type,
      headers,
      body,
    },
  );
};

const httpMethods: ApiFn[] = METHODS.map(
  (method) => async (
    route: string,
    authToken?: string,
    queryParams?: DataParams,
    bodyParams?: DataParams,
    contentType?: string,
  ) => {
    const res = await request(
      method.toUpperCase(),
      route,
      authToken,
      queryParams,
      bodyParams,
      contentType,
    );
    if (res.status >= 400) {
      const errorData = `API Error. ${method} call to route '${route}' returned status ${res.status} Message: ${res.statusText}`;
      throw new Error(errorData);
    }

    const resData = await res.json().catch(() => undefined);
    return resData;
  },
);

export const [get, put, post] = httpMethods;
