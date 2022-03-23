import { get, post, put } from '../../src/utils/api';

describe('api', () => {
  const path = 'https://pablotor.dev/api/mocks';
  it(
    'test a get call',
    () => expect(
      get(
        path,
        'Bearer 12121212121212121212121212121212',
        {
          id: 'getTest',
          name: 'lalala',
        },
      ),
    ).resolves.toStrictEqual(
      {
        id: 'getTest',
        name: 'User getTest',
        authorization: 'Bearer 12121212121212121212121212121212',
      },
    ),
  );
  it(
    'test a put call',
    () => expect(
      put(
        path,
        'Bearer 34343434343434343434343434343434',
        {
          id: 'putTest',
          name: 'lelele',
        },
      ),
    ).resolves.toStrictEqual(
      {
        id: 'putTest',
        name: 'lelele',
        authorization: 'Bearer 34343434343434343434343434343434',
      },
    ),
  );
  it(
    'test an post call. should answer a 405 status.',
    () => expect(post(path)).rejects.toThrow(
      /API Error\. post call to route 'https:\/\/pablotor\.dev\/api\/mocks' returned status 405/,
    ),
  );
});
