import getAlbumsFromFile from '../../src/lib/getAlbumsFromFile';

describe('getAlbumsFromFile', () => {
  const relPath = `${__dirname}/../testFiles/`;
  it(
    'try to open a file but it doesn\'t exist',
    () => expect(() => getAlbumsFromFile(`${relPath}notExistingFile.txt`)).toThrow(/ENOENT: no such file or directory/),
  );
  it(
    'opens a file and it\'s empty',
    () => expect(getAlbumsFromFile(`${relPath}emptyFile.txt`)).toMatchObject([]),
  );
  it(
    'opens a file with one album',
    () => expect(getAlbumsFromFile(`${relPath}validFile.txt`)).toStrictEqual([
      {
        year: 2022,
        title: 'WyeWorks Album',
      },
    ]),
  );
  it(
    'opens a file with albums, but year is invalid',
    () => expect(getAlbumsFromFile(`${relPath}invalidFile.txt`)).toMatchObject([]),
  );
  it(
    'opens a file with albums, only one is valid',
    () => expect(getAlbumsFromFile(`${relPath}mixedFile.txt`)).toStrictEqual([
      {
        year: 2022,
        title: 'WyeWorks Album',
      },
    ]),
  );
});
