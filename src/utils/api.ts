import fetch from 'node-fetch';

const METHODS = ['get', 'put', 'post'];

const request = async (
  type: string,
  route: string,
  authToken?: string,
  queryParams?: Record<string, string | number | boolean>,
) => {
  const requestHeaders: HeadersInit = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: authToken ? `Bearer ${authToken}` : '',
  };
  let queryString: string | undefined;
  if (queryParams) {
    queryString = Object.keys(queryParams)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
      .join('&');
  }

  return fetch(
    queryString ? `${route}?${queryString}` : route,
    {
      method: type,
      headers: requestHeaders,
    },
  );
};

const httpMethods = METHODS.map(
  (method) => async (
    route: string,
    authToken?: string,
    queryParams?: Record<string, string | number | boolean>,
  ) => {
    const res = await request(method.toUpperCase(), route, authToken, queryParams);
    if (res.status >= 400) {
      const errorData = `API Error. ${method} call to route '${route}' returned status ${res.status} Message: ${res.statusText}`;
      throw new Error(errorData);
    }

    const resData = await res.json().catch(() => undefined);
    return resData;
  },
);

export const [get, put, post] = httpMethods;
