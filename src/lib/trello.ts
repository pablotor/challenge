import { RateLimiter } from 'limiter';

import { ApiFn, QueryParams } from '../types/api';
import { Board, Card, List } from '../types/trello';
import { get, post } from '../utils/api';
import logger from '../utils/logger';

const { TRELLO_API_KEY: apiKey, TRELLO_API_TOKEN: apiToken } = process.env;

const trelloLimiter = new RateLimiter({ tokensPerInterval: 1, interval: 150 });
const trelloApiBaseUrl = 'https://api.trello.com';
const trelloAuthToken = `OAuth oauth_consumer_key="${apiKey}", oauth_token="${apiToken}"`;

const trelloApiCall = async (
  methodFn: ApiFn,
  route: string,
  queryParams?: QueryParams,
) => {
  if (!apiKey || !apiToken) {
    throw Error(
      'Trello API Key or API Token are undefined. Check that TRELLO_API_KEY and TRELLO_API_TOKEN exist in .env file or are passed by param',
    );
  }
  await trelloLimiter.removeTokens(1);
  return methodFn(
    `${trelloApiBaseUrl}${route}`,
    trelloAuthToken,
    queryParams,
  );
};

export const checkConnection = async () => {
  const route = '/1/members/me';
  try {
    logger.info('Connecting to Trello API');
    await trelloApiCall(get, route);
    logger.info('Successfully connected to Trello API');
  } catch (error) {
    logger.error(`Couldn't connect to Trello API. Error: ${error}`);
  }
};

export const createBoard = async (name: string) => {
  const route = '/1/boards/';
  try {
    logger.info(`Creating board with name: ${name}`);
    const board = await trelloApiCall(post, route, { name, defaultLists: false }) as Board;
    logger.info(`Successfully created board ${name}`);
    return board;
  } catch (error) {
    logger.error(`Couldn't create board ${name}. Error: ${error}`);
    return null;
  }
};

export const createList = async (name: string, idBoard: string) => {
  const route = '/1/lists';
  try {
    logger.info(`Creating list with name: ${name} in board: ${idBoard}`);
    const list = await trelloApiCall(post, route, { name, idBoard });
    logger.info(`Successfully created list ${name}`);
    return list as List;
  } catch (error) {
    logger.error(`Couldn't create list ${name}. Error: ${error}`);
    return null;
  }
};

export const createCard = async (name: string, idList: string) => {
  const route = '/1/cards';
  try {
    logger.info(`Creating card with name: ${name} in list: ${idList}`);
    const card = await trelloApiCall(post, route, { name, idList });
    logger.info(`Successfully created card ${name}`);
    return card as Card;
  } catch (error) {
    logger.error(`Couldn't create card ${name}. Error: ${error}`);
    return null;
  }
};

// TODO: make this work
export const addCardCover = async (idCard: string, file: string) => {
  const route = `/1/cards/${idCard}/attachments`;
  try {
    logger.info(`Adding card cover to card ID: ${idCard}`);
    const list = await trelloApiCall(post, route, { file, setCover: true }) as Board;
    logger.info(`Successfully added cover to card ID: ${idCard}`);
    return list;
  } catch (error) {
    logger.error(`Couldn't add cover to card  ID: ${idCard}. Error: ${error}`);
    return null;
  }
};
