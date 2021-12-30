import puppeteer from 'puppeteer';

import url from '../../constants/urls.json';
import logger from '../../utils/logger';

import termImput from '../termInput';

const signin = async (browser: Promise<puppeteer.Browser>) => {
  logger.info('Opening linkedin login page');
  const page = await (await browser).newPage();
  await page.goto(url.login);
  const usernameInput = await page.$('#username');
  const passwordInput = await page.$('#password');
  const submitInput = await page.$('.login__form_action_container');
  if (!usernameInput || !passwordInput || !submitInput) throw Error('Missing input');
  const userInfo = {
    username: '',
    password: '',
    pin: '',
  };
  userInfo.username = await termImput('Enter your username: \n');
  userInfo.password = await termImput('Enter your password:', { hidden: true });
  logger.info('Loging you in! Please wait.')
  await usernameInput.type(userInfo.username);
  await passwordInput.type(userInfo.password);
  await submitInput.click();
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  const afterLoginRedirectURL = page.url();
  const afterLoginRedirectHTML = await page.evaluate(() => document.body.innerHTML);
  if (process.env.NODE_ENV !== 'production') {
    await page.screenshot({
      path: `./screenshots/login_redirect_${Date.now().toString()}.png`,
    });
    logger.debug('URL: %s', afterLoginRedirectURL);
  }
  if (afterLoginRedirectURL === url.feed) {
    logger.info('Successful SignIn');
  } else {
    await page.goto(url.feed, { waitUntil: 'networkidle2' });
    if (page.url() === url.feed) {
      logger.info('Successful SignIn');
    } else {
      logger.error('There was a problem with the SignIn')
      logger.error('URL: %s', afterLoginRedirectURL);
      logger.error(afterLoginRedirectHTML);
    }
  }
  page.close();
};

export default signin;
