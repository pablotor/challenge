export interface Album {
  year: number;
  title: string;
}

export interface AlbumLibrary {
  [decade: string]: Album[];
}

export type CoverStore = Record<string, string | null>;
