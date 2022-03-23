import getAlbumsFromFile from '../src/lib/getAlbumsFromFile';

describe('getAlbumsFromFile', () => {
  let availabilities: any[] | null;

  describe('skeleton', () => {
    it('returns an Object', () => {
      expect.hasAssertions();
      availabilities = getAlbumsFromFile('lalala.txt');
      expect(typeof availabilities).toBe('object');
      expect(Array.isArray(availabilities)).toBe(true);
    });
  });
});
