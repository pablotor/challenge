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
  logger.info('Checking connections');
  await connectToSpotify();
  await checkTrelloConnection();
  logger.info('Connections OK! Starting script.');
  const albumArray = getAlbumsFromFile(filePath);
  const coverStore = getCoversFromSpotify(albumArray);
  const trelloBoard = await postAlbumsToTrello(albumArray);
  await updateTrelloCardsWithAlbumCovers(trelloBoard.cards, await coverStore);
  logger.info('Script finished. Goodbye!');
  exit(0);
};

main();
