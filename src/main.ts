import 'dotenv/config';
import { exit } from 'process';

import logger from './utils/logger';
import { checkConnection } from './lib/trello';

const main = async () => {
  logger.info('Initializing app');
  await checkConnection();
  logger.info('Goodbye!');
  exit(0);
};

main();
