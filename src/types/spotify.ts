/**
 * TypeScript interfaces for Spotify Web API responses
 * Based on the Spotify Web API documentation
 */

/**
 * OAuth token response from Spotify authentication endpoint
 */
export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

/**
 * Error response from Spotify API
 */
export interface SpotifyError {
  error: {
    status: number;
    message: string;
  };
}

/**
 * Artist object from Spotify API
 */
export interface SpotifyArtist {
  id: string;
  name: string;
  external_urls: {
    spotify: string;
  };
}

/**
 * Image object from Spotify API
 */
export interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

/**
 * Track object from Spotify API
 * Contains preview_url for 30-second preview playback
 */
export interface SpotifyTrack {
  id: string;
  name: string;
  preview_url: string | null; // 30-second preview MP3 URL, can be null
  track_number: number;
  duration_ms: number;
  artists: SpotifyArtist[];
  external_urls: {
    spotify: string;
  };
}

/**
 * Album object from Spotify API
 */
export interface SpotifyAlbum {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  images: SpotifyImage[];
  external_urls: {
    spotify: string;
  };
  release_date: string;
  popularity?: number;
}

/**
 * Search result structure from Spotify Search API
 */
export interface SpotifySearchResult {
  albums: {
    href: string;
    items: SpotifyAlbum[];
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
  };
}

/**
 * Album tracks response from Spotify API
 */
export interface SpotifyAlbumTracksResponse {
  href: string;
  items: SpotifyTrack[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}

/**
 * Matched album with preview URL for playback
 * Returned by our search API route
 */
export interface SpotifyAlbumMatch {
  albumId: string;
  albumTitle: string;
  artistName: string;
  previewUrl: string | null; // First track's preview_url, can be null
  coverUrl: string; // Album cover image URL
}

