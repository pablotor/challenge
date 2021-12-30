import { exit } from 'process';

import logger from './utils/logger';
import { signin, sendMessage } from './components/puppeteer';
import termImput from './components/termInput';

const main = async () => {
  logger.info('LinkedIn automation program initialized.')
  logger.info('Launching SignIn');

  // SignIn loop
  let signedin = false;
  let userInput = '';
  while (!signedin) {
    try {
      await signin();
      signedin = true;
    } catch (err) {
      logger.error('There was an ERROR while trying to SignIn:', err);
      while (userInput !== 'y' && userInput !== 'n') {
        const question = userInput === '' ? (
          'Should I try again? (y/n): '
        ) : (
          'Sorry, I didn\'t get that. Should I try again? (y/n): '
        );
        userInput = (await termImput(question)).toLowerCase();
      }
      if (userInput === 'n') exit(0);
    }
  }

  // Main loop
  logger.info('Initializing messaging test');
  await sendMessage(
    'https://www.linkedin.com/in/kerstin-schuster/',
    'Hallo meine Erdbeere'
  );

  logger.info('Goodbye!');
  exit(0);
}

main();
