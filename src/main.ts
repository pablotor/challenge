import { exit } from 'process';

import logger from './utils/logger';

const main = async () => {
  logger.info('Initializing app');
  logger.info('Goodbye!');
  exit(0);
};

main();
