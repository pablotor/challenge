import { readFileSync } from 'fs';

import logger from '../utils/logger';

const getAlbumsFromFile = (path: string) => {
  // RegEx reminder:
  //  /s* 0 to n whitespaces
  //  (/d+) 1 to n digits
  //  /s+ 1 to n whitespaces
  //  (.+) 1 to n characters
  //  /s* 0 to n whitespaces
  const format = /^\s*(\d+)\s+(.+)\s*$/;
  let error = false;

  logger.info(`Reading file ${path}`);
  const fileLines = readFileSync(path, 'utf-8').split(/\r?\n/); // split file by line
  const albumArray = fileLines.map((line, index) => {
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
  const filteredAlbumArray = albumArray.filter((album) => album !== null);
  logger.info(`Read finished ${error ? 'with errors' : 'succesfully'}.`);
  logger.info(`${filteredAlbumArray.length} albums were found.`);
  return filteredAlbumArray;
};

export default getAlbumsFromFile;
