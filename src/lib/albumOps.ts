import { Album, AlbumLibrary, CoverStore } from '../types/album';
import { Board, Card } from '../types/trello';
import asyncIterator from '../utils/asyncIterator';
import titleToID from '../utils/titleToID';
import { getAlbumCover } from './spotify';
import {
  addCardCover, createBoard, createCard, createList,
} from './trello';

// As 0 is a falsy value, it will default to title comparison if the year is equal
const compareAlbums = (albumA: Album, albumB: Album) => albumA.year - albumB.year
  || albumA.title.localeCompare(albumB.title);

/**
 * Given an Album array generates an AlbumLibrary with those albums organized by decade
 * Each decade is an array of Albums sorted by year or title, if the year matches
 * @param albumArray the albums to build the library
 * @returns AlbumLibrary
 */
const buildLibrary = (albumArray: Album[]) => {
  const library: AlbumLibrary = {};
  albumArray.forEach((album) => {
    const decade = (Math.floor(album.year / 10) * 10);
    if (library[decade]) {
      library[decade].push(album);
    } else {
      library[decade] = [album];
    }
  });
  Object.values<Album[]>(library).map((decadeArray) => decadeArray.sort(compareAlbums));
  return library;
};

/**
 * Given an Album array this fn post it to Trello as a board
 * The board will contain a list for each decade that contains at least one album
 * Each list will contain every album that belongs to that decade sorted by year
 * @param albumArray the array of Albums
 * @returns the board object with trello board representation
 */
export const postAlbumsToTrello = async (albumArray: Album[]) => {
  let board: Board;
  const albumLibrary = buildLibrary(albumArray);
  // First create the board
  const boardResponse = await createBoard('Discography');
  if (boardResponse) {
    board = {
      id: boardResponse.id,
      name: boardResponse.name,
      lists: [],
      cards: [],
    };
  } else {
    throw new Error('Board could not be created');
  }
  // Then create the lists
  // Sorting the years from higher to lower with reverse make the lists to
  // appear in the expected order
  const decadeArray = Object.keys(albumLibrary).reverse();
  await asyncIterator(decadeArray, async (decade: string) => {
    const listResponse = await createList(decade, board.id);
    if (listResponse) {
      board.lists.push({
        name: decade,
        id: listResponse.id,
        boardId: listResponse.idBoard,
        cards: [],
      });
    }
  });
  // Finally create the cards
  await Promise.all(
    board.lists.map(async (list) => {
      if (albumLibrary[list.name]) {
        await asyncIterator(albumLibrary[list.name], async (album: Album) => {
          const cardResponse = await createCard(`${album.year} ${album.title}`, list.id);
          if (cardResponse) {
            const card = {
              title: album.title,
              year: album.year,
              id: cardResponse.id,
              listId: list.id,
            };
            // to have the card in both the list and the board makes it easier to iterate
            // over all cards, or just the ones that belongs to this specific decade
            list.cards.push(card);
            board.cards.push(card);
          }
        });
      }
    }),
  );
  return board;
};

/**
 * Search covers on an Album array on spotify
 * @param albumArray the list of Albums
 * @returns an object with the album title transformed to an id as key and the promise of
 * the cover url or null as value, depending on if the album cover is found.
 */
export const getCoversFromSpotify = async (albumArray: Album[]) => {
  const coverStore: CoverStore = {};
  await Promise.all(
    albumArray.map(async (album) => {
      coverStore[titleToID(album.title)] = await getAlbumCover(album);
    }),
  );
  return coverStore;
};

/**
 * Updates an array of cards on Trello with its cover if it exist
 * @param cardArray the cards to be updated
 * @param coverStore the store of covers urls, where cardToID(card.title) is the key
 */
export const updateTrelloCardsWithAlbumCovers = async (
  cardArray: Card[],
  coverStore: CoverStore,
) => {
  await Promise.all(
    cardArray.map(async (card) => {
      const coverUrl = coverStore[titleToID(card.title)];
      if (coverUrl) {
        await addCardCover(card.id, coverUrl);
      }
    }),
  );
};
