import puppeteer from 'puppeteer';

import logger from '../../utils/logger';

export const sendSimpleMessage = async (
  to: string,
  message: string,
  browser: Promise<puppeteer.Browser>,
) => {
  logger.info('Opening selected profile');
  const page = await (await browser).newPage();
  await page.goto(to);
  logger.info('Opening message form');
  const messageButton = await page.$('.message-anywhere-button');
  if (!messageButton) throw Error(`Cant find message button for candidate: ${to}`);
  await messageButton.click();

  const formText = await page.waitForSelector('.msg-form__message-texteditor');
  const formSubmitButton = await page.$('.msg-form__send-button');
  
  if (!formText || !formSubmitButton) throw Error(`Cant find message form`);
  logger.info('Sending message');

  await formText.type(message);
  await formSubmitButton.click();
  logger.info('Message sent!');

};
