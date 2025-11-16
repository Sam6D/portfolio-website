import { NextResponse } from 'next/server';
import type { LastFmTopAlbumsResponse, LastFmError } from '@/types/lastfm';

/**
 * Route segment config - ensures this route is handled correctly
 */
export const dynamic = 'force-dynamic';

/**
 * API Route Handler for Last.fm Top Albums
 * 
 * This route fetches the top 2 albums from the past month for a user.
 * It acts as a proxy to keep the API key secure on the server side.
 * 
 * Endpoint: GET /api/lastfm
 * Returns: JSON array of top 2 albums with artwork and metadata
 */
export async function GET() {
  // Get environment variables
  const apiKey = process.env.LASTFM_API_KEY;
  const username = process.env.LASTFM_USERNAME;

  // Validate environment variables
  if (!apiKey || !username) {
    return NextResponse.json(
      { error: 'Last.fm API credentials not configured' },
      { status: 500 }
    );
  }

  // Build the Last.fm API URL
  // Parameters:
  // - method: user.getTopAlbums - fetches user's top albums
  // - user: the Last.fm username
  // - period: 1month - gets albums from the past month
  // - limit: 2 - only get the top 2 albums
  // - api_key: our API key for authentication
  // - format: json - request JSON response
  const apiUrl = new URL('http://ws.audioscrobbler.com/2.0/');
  apiUrl.searchParams.set('method', 'user.getTopAlbums');
  apiUrl.searchParams.set('user', username);
  apiUrl.searchParams.set('period', '1month');
  apiUrl.searchParams.set('limit', '2');
  apiUrl.searchParams.set('api_key', apiKey);
  apiUrl.searchParams.set('format', 'json');

  try {
    // Make the request to Last.fm API
    const response = await fetch(apiUrl.toString());

    // Check if the request was successful
    if (!response.ok) {
      return NextResponse.json(
        { error: `Last.fm API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    // Parse the JSON response
    const data: LastFmTopAlbumsResponse | LastFmError = await response.json();

    // Check if Last.fm returned an error
    if ('error' in data) {
      return NextResponse.json(
        { error: `Last.fm API error: ${data.message}` },
        { status: 400 }
      );
    }

    // Extract the albums array from the response
    const albums = data.topalbums.album;

    // Return the albums with caching headers
    // revalidate: 3600 means cache for 1 hour (3600 seconds)
    // This reduces API calls and improves performance
    return NextResponse.json(albums, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    // Handle network errors or other exceptions
    console.error('Error fetching Last.fm data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Last.fm data' },
      { status: 500 }
    );
  }
}

