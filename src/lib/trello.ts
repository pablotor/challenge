import { RateLimiter } from 'limiter';

import { ApiFn, DataParams } from '../types/api';
import {
  BoardResponse,
  CardResponse,
  ListResponse,
} from '../types/trello';
import { get, post } from '../utils/api';
import logger from '../utils/logger';
import { ConnectionError, MissingEnvParamError } from './errors';

const {
  TRELLO_API_KEY: apiKey,
  TRELLO_API_TOKEN: apiToken,
  TRELLO_MAX_REQUEST_RATE: maxRate,
} = process.env;

const trelloLimiter = new RateLimiter({
  tokensPerInterval: 1,
  interval: 1000 / (parseInt(maxRate || '8', 10)),
});
const trelloApiBaseUrl = 'https://api.trello.com';
const trelloAuthToken = `OAuth oauth_consumer_key="${apiKey}", oauth_token="${apiToken}"`;

const trelloApiCall = async <ResponseBodyType>(
  methodFn: ApiFn,
  route: string,
  queryParams?: DataParams,
) => {
  if (!apiKey || !apiToken) {
    throw new MissingEnvParamError(
      'Trello API Key or API Token are undefined. Check that TRELLO_API_KEY and TRELLO_API_TOKEN exist in .env file or are passed by param',
    );
  }
  await trelloLimiter.removeTokens(1);
  return methodFn<ResponseBodyType>(
    `${trelloApiBaseUrl}${route}`,
    trelloAuthToken,
    queryParams,
  );
};

export const checkTrelloConnection = async () => {
  const route = '/1/members/me';
  try {
    logger.info('Connecting to Trello API');
    await trelloApiCall(get, route);
    logger.info('Successfully connected to Trello API');
  } catch (error) {
    if (error instanceof MissingEnvParamError) throw error;
    logger.error(`Couldn't connect to Trello API. ${error}`);
    throw new ConnectionError('Trello connection Error');
  }
};

export const createBoard = async (name: string) => {
  const route = '/1/boards/';
  const params = { name, defaultLists: false };
  try {
    logger.info(`Creating board with name: ${name}`);
    const board = await trelloApiCall<BoardResponse>(post, route, params);
    logger.info(`Successfully created board ${name}`);
    return board;
  } catch (error) {
    logger.error(`Couldn't create board ${name}. Error: ${error}`);
    return null;
  }
};

export const createList = async (name: string, idBoard: string) => {
  const route = '/1/lists';
  const params = { name, idBoard };
  try {
    logger.info(`Creating list with name: ${name} in board: ${idBoard}`);
    const list = await trelloApiCall<ListResponse>(post, route, params);
    logger.info(`Successfully created list ${name}`);
    return list;
  } catch (error) {
    logger.error(`Couldn't create list ${name}. Error: ${error}`);
    return null;
  }
};

export const createCard = async (name: string, idList: string) => {
  const route = '/1/cards';
  const params = { name, idList };
  try {
    logger.info(`Creating card with name: ${name} in list: ${idList}`);
    const card = await trelloApiCall<CardResponse>(post, route, params);
    logger.info(`Successfully created card ${name}. Card ID is: ${card.id}`);
    return card;
  } catch (error) {
    logger.error(`Couldn't create card ${name}. Error: ${error}`);
    return null;
  }
};

export const addCardCover = async (idCard: string, url: string) => {
  const route = `/1/cards/${idCard}/attachments`;
  const params = { url, setCover: true };
  try {
    logger.info(`Adding card cover to card ID: ${idCard}`);
    const card = await trelloApiCall<CardResponse>(post, route, params);
    logger.info(`Successfully added cover to card ID: ${idCard}`);
    return card;
  } catch (error) {
    logger.error(`Couldn't add cover to card  ID: ${idCard}. Error: ${error}`);
    return null;
  }
};
