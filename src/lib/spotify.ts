import { RateLimiter } from 'limiter';
import { Album } from '../types/album';

import { ApiFn, DataParams } from '../types/api';
import { AlbumSearch, AuthResponse } from '../types/spotify';
import { get, post } from '../utils/api';
import logger from '../utils/logger';

const {
  SPOTIFY_CLIENT_ID: clientId,
  SPOTIFY_CLIENT_SECRET: clientSecret,
  SPOTIFY_MAX_REQUEST_RATE: maxRate,
} = process.env;

const spotifyLimiter = new RateLimiter({
  tokensPerInterval: 1,
  interval: 1000 / (parseInt(maxRate || '8', 10)),
});

// The auth token has to be asked to Spotify. Will be set when connectToSpotify fn is exec
let spotifyAuthToken: string;

const spotifyAuthTokenUrl = 'https://accounts.spotify.com/api/token';

export const connectToSpotify = async () => {
  if (!clientId || !clientSecret) {
    throw Error(
      'Spotify Client ID or Client Secret is undefined. Check that SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET exist in .env file or are passed by param',
    );
  }
  try {
    logger.info('Connecting to Spotify');
    // Retrieve auth token from spotify
    const authResponse = await post(
      spotifyAuthTokenUrl,
      `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      undefined,
      { grant_type: 'client_credentials' },
      'application/x-www-form-urlencoded',
    ) as AuthResponse;
    const { access_token: accessToken, token_type: tokenType } = authResponse;

    spotifyAuthToken = `${tokenType} ${accessToken}`;
    logger.info('Successfully connected to Spotify');
  } catch (error) {
    logger.error(`Couldn't connect to Spotify. Error: ${error}`);
    throw new Error('Spotify connection Error');
  }
};

const spotifyApiBaseUrl = 'https://api.spotify.com';

const spotifyApiCall = async (
  methodFn: ApiFn,
  route: string,
  queryParams?: DataParams,
) => {
  if (!spotifyAuthToken) {
    logger.error(
      'Spotify AuthToken is undefined. Trying to connect to Spotify',
    );
    await connectToSpotify();
  }
  await spotifyLimiter.removeTokens(1);
  return methodFn(
    `${spotifyApiBaseUrl}${route}`,
    spotifyAuthToken,
    queryParams,
  );
};

export const searchAlbum = async (query: string) => {
  const route = '/v1/search';
  try {
    logger.info(`Searching album with title: ${query}`);
    const queryResult = await spotifyApiCall(
      get,
      route,
      { q: `album:${query}`, type: 'album' },
    ) as AlbumSearch;
    logger.info(`Search successful. Found ${queryResult.albums.total} albums with title ${query}`);
    return queryResult;
  } catch (error) {
    logger.error(`Search failed. Error: ${error}`);
    return null;
  }
};

export const getAlbumCover = async (album: Album) => {
  const queryResult = await searchAlbum(album.title);
  const correctAlbum = queryResult?.albums.items?.find(
    (item) => item.release_date.includes(album.year.toString()),
  );
  if (!correctAlbum) {
    logger.info('Cover not present');
    return null;
  }
  return correctAlbum.images[0].url;
};
