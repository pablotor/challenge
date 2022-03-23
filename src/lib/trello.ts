import { ApiFn, QueryParams } from '../types/api';
import { Board } from '../types/trello';
import { get, post } from '../utils/api';
import logger from '../utils/logger';

const { TRELLO_API_KEY: apiKey, TRELLO_API_TOKEN: apiToken } = process.env;

const trelloApiBaseUrl = 'https://api.trello.com';
const trelloAuthToken = `OAuth oauth_consumer_key="${apiKey}", oauth_token="${apiToken}"`;

const trelloApiCall = (
  methodFn: ApiFn,
  route: string,
  queryParams?: QueryParams,
) => {
  if (!apiKey || !apiToken) {
    throw Error(
      'Trello API Key or API Token are undefined. Check that TRELLO_API_KEY and TRELLO_API_TOKEN exist in .env file or are passed by param',
    );
  }
  return methodFn(
    `${trelloApiBaseUrl}${route}`,
    trelloAuthToken,
    queryParams,
  );
};

export const checkConnection = async () => {
  try {
    logger.info('Connecting to Trello API');
    await trelloApiCall(get, '/1/members/me');
    logger.info('Successfully connected to Trello API');
  } catch (error) {
    logger.error(`Couldn't connect to Trello API. Error: ${error}`);
  }
};

export const createBoard = async (name: string) => {
  try {
    logger.info(`Creating board with name: ${name}`);
    const board = await trelloApiCall(post, '/1/boards/', { name }) as Board;
    logger.info(`Successfully created board ${name}`);
    return board;
  } catch (error) {
    logger.error(`Couldn't create Board. Error: ${error}`);
    return null;
  }
};
