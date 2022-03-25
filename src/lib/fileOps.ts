import { readFileSync } from 'fs';
import { Album } from '../types/album';

import logger from '../utils/logger';

// from https://stackoverflow.com/questions/43118692/typescript-filter-out-nulls-from-an-array
const notEmpty = <TValue>(
  value: TValue | null | undefined,
): value is TValue => value !== null && value !== undefined;

/**
 * Given the path of a text file with structure <year> <album-title> it generates an array of
 * Album objects
 * @param path filepath of the input file
 * @returns an array of Albums with year and title
 */
const getAlbumsFromFile = (path: string) => {
  // RegEx reminder:
  //  /s*   0 to n whitespaces
  //  (/d+) 1 to n digits
  //  /s+   1 to n whitespaces
  //  (.+)  1 to n characters
  //  /s*   0 to n whitespaces
  const format = /^\s*(\d+)\s+(.+)\s*$/;
  let error = false;

  logger.info(`Reading file ${path}`);
  const fileLines = readFileSync(path, 'utf-8').split(/\r?\n/); // split file by line
  const albumArray: (Album | null)[] = fileLines.map((line, index) => {
    // empty line
    if (line === '') return null;
    const album = format.exec(line);
    // wrong format line
    if (!album || album.length < 3 || !parseInt(album[1], 10)) {
      logger.error(`Parse error at line ${index + 1}`);
      logger.error(`Line: ${line}`);
      error = true;
      return null;
    }
    return {
      year: parseInt(album[1], 10),
      title: album[2],
    };
  });
  const filteredAlbumArray = albumArray.filter(notEmpty);
  logger.info(`Read finished ${error ? 'with errors' : 'succesfully'}.`);
  logger.info(`${filteredAlbumArray.length} albums were found.`);
  return filteredAlbumArray;
};

export default getAlbumsFromFile;
