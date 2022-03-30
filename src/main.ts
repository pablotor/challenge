import 'dotenv/config';
import { exit } from 'process';

import logger from './utils/logger';
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
  } catch (error) {
    logger.error(`Connections Error. ${error}. \nExiting.`);
    exit(1);
  }
  logger.info('Connections OK! Starting script.');
  const albumArray = getAlbumsFromFile(filePath);
  const [coverStore, trelloBoard] = await Promise.all([
    getCoversFromSpotify(albumArray),
    postAlbumsToTrello(albumArray),
  ]);
  await updateTrelloCardsWithAlbumCovers(trelloBoard.cards, coverStore);
  logger.info('Script finished. Goodbye!');
  exit(0);
};

main();
