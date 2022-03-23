import 'dotenv/config';
import { exit } from 'process';

import logger from './utils/logger';
import { checkConnection, createBoard } from './lib/trello';

const main = async () => {
  logger.info('Initializing app');
  await checkConnection();
  await createBoard('Test board');
  logger.info('Goodbye!');
  exit(0);
};

main();
