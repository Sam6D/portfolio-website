import { NextRequest, NextResponse } from 'next/server';
import type { SpotifySearchResult, SpotifyAlbumTracksResponse, SpotifyAlbumMatch, SpotifyError } from '@/types/spotify';

/**
 * Route segment config - ensures this route is handled correctly
 */
export const dynamic = 'force-dynamic';

/**
 * API Route Handler for Spotify Album Search
 * 
 * This route searches Spotify's catalog to match Last.fm albums.
 * Returns the first track's preview URL for playback.
 * 
 * Endpoint: GET /api/spotify/search?albumName={name}&artistName={name}
 * Returns: JSON with Spotify album match or null if no match found
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const albumName = searchParams.get('albumName');
  const artistName = searchParams.get('artistName');

  // Validate query parameters
  if (!albumName || !artistName) {
    return NextResponse.json(
      { error: 'Missing albumName or artistName query parameters' },
      { status: 400 }
    );
  }

  try {
    // First, get an access token
    const tokenResponse = await fetch(`${request.nextUrl.origin}/api/spotify/token`);
    if (!tokenResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to authenticate with Spotify' },
        { status: 500 }
      );
    }
    const { access_token } = await tokenResponse.json();

    // Search for album using Spotify Search API
    // Query format: "album:{albumName} artist:{artistName}"
    // This searches for albums matching both the album name and artist name
    const searchUrl = new URL('https://api.spotify.com/v1/search');
    searchUrl.searchParams.set('q', `album:${albumName} artist:${artistName}`);
    searchUrl.searchParams.set('type', 'album');
    searchUrl.searchParams.set('limit', '20'); // Get multiple results to handle duplicates

    const searchResponse = await fetch(searchUrl.toString(), {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!searchResponse.ok) {
      // Handle rate limiting (429)
      if (searchResponse.status === 429) {
        return NextResponse.json(
          { error: 'Spotify API rate limit exceeded' },
          { status: 429 }
        );
      }
      const errorData: SpotifyError = await searchResponse.json().catch(() => ({
        error: {
          status: searchResponse.status,
          message: searchResponse.statusText,
        },
      }));
      return NextResponse.json(null); // Graceful degradation - return null on error
    }

    const searchData: SpotifySearchResult = await searchResponse.json();

    // If no albums found, return null
    if (!searchData.albums?.items || searchData.albums.items.length === 0) {
      return NextResponse.json(null);
    }

    // Normalize strings for matching (lowercase, trim, remove special chars)
    const normalizedAlbumName = normalizeString(albumName);
    const normalizedArtistName = normalizeString(artistName);

    // Filter and match albums
    // Prefer exact matches, then partial matches
    const matchingAlbums = searchData.albums.items
      .map(album => {
        const normalizedFoundAlbum = normalizeString(album.name);
        const normalizedFoundArtist = normalizeString(album.artists[0]?.name || '');
        
        // Calculate match score
        const albumMatch = normalizedFoundAlbum === normalizedAlbumName ? 2 : 
                          (normalizedFoundAlbum.includes(normalizedAlbumName) || 
                           normalizedAlbumName.includes(normalizedFoundAlbum)) ? 1 : 0;
        const artistMatch = normalizedFoundArtist === normalizedArtistName ? 2 :
                           (normalizedFoundArtist.includes(normalizedArtistName) || 
                            normalizedArtistName.includes(normalizedFoundArtist)) ? 1 : 0;
        
        return {
          album,
          score: albumMatch + artistMatch,
          popularity: album.popularity || 0,
        };
      })
      .filter(item => item.score > 0) // Only keep albums with some match
      .sort((a, b) => {
        // Sort by match score first, then by popularity
        if (b.score !== a.score) return b.score - a.score;
        return b.popularity - a.popularity;
      });

    if (matchingAlbums.length === 0) {
      return NextResponse.json(null);
    }

    // Get the best matching album
    const selectedAlbum = matchingAlbums[0].album;

    // Get tracks from the album to find one with a preview URL
    // Check up to 20 tracks to find one with a preview
    const tracksUrl = new URL(`https://api.spotify.com/v1/albums/${selectedAlbum.id}/tracks`);
    tracksUrl.searchParams.set('limit', '20'); // Get more tracks to find one with preview

    const tracksResponse = await fetch(tracksUrl.toString(), {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });

    let previewUrl: string | null = null;
    if (tracksResponse.ok) {
      const tracksData: SpotifyAlbumTracksResponse = await tracksResponse.json();
      if (tracksData.items && tracksData.items.length > 0) {
        // Loop through tracks to find the first one with a preview URL
        // Try extracting from embed page if API preview_url is null
        for (const track of tracksData.items) {
          // First try the API preview_url
          if (track.preview_url) {
            previewUrl = track.preview_url;
            break;
          }
          
          // If API doesn't have preview, try extracting from embed page
          try {
            const embedUrl = `https://open.spotify.com/embed/track/${track.id}`;
            const embedResponse = await fetch(embedUrl);
            if (embedResponse.ok) {
              const embedHtml = await embedResponse.text();
              // Extract JSON data from __NEXT_DATA__ script tag
              const jsonMatch = embedHtml.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
              if (jsonMatch) {
                const embedData = JSON.parse(jsonMatch[1]);
                const audioPreview = embedData?.props?.pageProps?.state?.data?.entity?.audioPreview;
                if (audioPreview?.url) {
                  previewUrl = audioPreview.url;
                  break; // Found a preview URL from embed page
                }
              }
            }
          } catch (error) {
            // If embed extraction fails, continue to next track
            continue;
          }
        }
        // If no track has a preview URL, previewUrl remains null
      }
    }

    // Get the best quality album cover image
    const coverUrl = selectedAlbum.images && selectedAlbum.images.length > 0
      ? selectedAlbum.images[0].url // First image is usually the largest
      : '';

    // Return match with preview URL
    const match: SpotifyAlbumMatch = {
      albumId: selectedAlbum.id,
      albumTitle: selectedAlbum.name,
      artistName: selectedAlbum.artists[0]?.name || artistName,
      previewUrl,
      coverUrl,
    };

    return NextResponse.json(match, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error searching Spotify catalog:', error);
    return NextResponse.json(null); // Graceful degradation - return null on error
  }
}

/**
 * Normalize string for comparison (lowercase, trim, remove special chars)
 * Helps with matching album and artist names that may have different formatting
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' '); // Normalize whitespace
}

