/**
 * TypeScript interfaces for Last.fm API responses
 * Based on the user.getTopAlbums API endpoint
 */

export interface LastFmImage {
  '#text': string;
  size: 'small' | 'medium' | 'large' | 'extralarge';
}

export interface LastFmArtist {
  name: string;
  mbid?: string;
  url: string;
}

export interface LastFmAlbum {
  name: string;
  artist: LastFmArtist;
  playcount: string;
  mbid?: string;
  url: string;
  image: LastFmImage[];
  '@attr'?: {
    rank: string;
  };
}

export interface LastFmTopAlbumsResponse {
  topalbums: {
    album: LastFmAlbum[];
    '@attr': {
      user: string;
      page: string;
      perPage: string;
      totalPages: string;
      total: string;
    };
  };
}

export interface LastFmError {
  error: number;
  message: string;
}

