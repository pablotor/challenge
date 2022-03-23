import getAlbumsFromFile from '../../src/lib/getAlbumsFromFile';

describe('getAlbumsFromFile', () => {
  const absPath = `${__dirname}/../testFiles`;
  it(
    'try to open a file but it doesn\'t exist',
    () => expect(() => getAlbumsFromFile(`${absPath}/notExistingFile.txt`)).toThrow(/ENOENT: no such file or directory/),
  );
  it(
    'opens a file and it\'s empty',
    () => expect(getAlbumsFromFile(`${absPath}/emptyFile.txt`)).toMatchObject([]),
  );
  it(
    'opens a file with one album',
    () => expect(getAlbumsFromFile(`${absPath}/validFile.txt`)).toStrictEqual([
      {
        year: 2022,
        title: 'WyeWorks Album',
      },
    ]),
  );
  it(
    'opens a file with albums, but year is invalid',
    () => expect(getAlbumsFromFile(`${absPath}/invalidFile.txt`)).toMatchObject([]),
  );
  it(
    'opens a file with albums, only one is valid',
    () => expect(getAlbumsFromFile(`${absPath}/mixedFile.txt`)).toStrictEqual([
      {
        year: 2022,
        title: 'WyeWorks Album',
      },
    ]),
  );
});
