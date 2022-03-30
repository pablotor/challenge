export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface Artist {
  external_urls: unknown;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface AlbumImage {
  height: number;
  url: string;
  width: number;
}

export interface AlbumItem {
  album_type: string;
  artists: Artist[];
  available_markets: string[];
  external_urls: Record<string, string>;
  href: string;
  id: string;
  images: AlbumImage[],
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number,
  type: string;
  uri: string;
}

export interface AlbumSearchResponse {
  albums: {
    href: string;
    items: Album[];
    limit: number;
    next: null;
    offset: number;
    previous: null;
    total: number;
  }
}
