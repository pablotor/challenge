import 'dotenv/config';
import { exit } from 'process';

import logger from './utils/logger';
import {
  ApiError, ConnectionError, FileError, MissingEnvParamError,
} from './lib/errors';
import getAlbumsFromFile from './lib/fileOps';
import { connectToSpotify } from './lib/spotify';
import { checkTrelloConnection } from './lib/trello';
import {
  getCoversFromSpotify,
  postAlbumsToTrello,
  updateTrelloCardsWithAlbumCovers,
} from './lib/albumOps';

const main = async () => {
  const filePath = `${__dirname}/../${process.env.FILENAME}`;
  logger.info('Initializing app');
  try {
    logger.info('Checking connections');
    await Promise.all([
      connectToSpotify(),
      checkTrelloConnection(),
    ]);
    logger.info('Connections OK! Starting script.');
    const albumArray = getAlbumsFromFile(filePath);
    const [coverStore, trelloBoard] = await Promise.all([
      getCoversFromSpotify(albumArray),
      postAlbumsToTrello(albumArray),
    ]);
    await updateTrelloCardsWithAlbumCovers(trelloBoard.cards, coverStore);
    logger.info('Script finished. Goodbye!');
    exit(0);
  } catch (error) {
    if (error instanceof MissingEnvParamError) {
      logger.error(`Missing Enviroment Param Error. ${error}.\nExiting.`);
    } else if (error instanceof ConnectionError) {
      logger.error(`Connection Error. ${error}.\nExiting.`);
    } else if (error instanceof FileError) {
      logger.error(`File Error. ${error}.\nExiting.`);
    } else if (error instanceof ApiError) {
      logger.error(`Api Error. ${error}.\nExiting.`);
    } else {
      logger.error(`Unknown Error. ${error}.\nExiting.`);
    }
    exit(1);
  }
};

main();
