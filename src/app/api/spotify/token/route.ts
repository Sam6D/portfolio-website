import { NextResponse } from 'next/server';
import type { SpotifyTokenResponse, SpotifyError } from '@/types/spotify';

/**
 * Route segment config - ensures this route is handled correctly
 */
export const dynamic = 'force-dynamic';

/**
 * API Route Handler for Spotify Authentication
 * 
 * This route generates an access token using OAuth 2.0 Client Credentials flow.
 * The token is cached and refreshed when expired.
 * 
 * Endpoint: GET /api/spotify/token
 * Returns: JSON with access_token and expiration info
 */
export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  // Validate environment variables
  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: 'Spotify API credentials not configured' },
      { status: 500 }
    );
  }

  try {
    // Create Basic Auth credentials
    // Format: Base64 encoded "clientId:clientSecret"
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    // Request access token from Spotify
    // Using Client Credentials flow for server-side authentication
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const errorData: SpotifyError = await response.json().catch(() => ({
        error: {
          status: response.status,
          message: response.statusText,
        },
      }));
      return NextResponse.json(
        { error: `Spotify authentication error: ${errorData.error.message}` },
        { status: response.status }
      );
    }

    const data: SpotifyTokenResponse = await response.json();

    // Return token with caching headers
    // Cache for slightly less than expires_in to ensure fresh tokens
    // Subtract 60 seconds for safety margin
    const cacheMaxAge = Math.max(0, data.expires_in - 60);

    return NextResponse.json(
      {
        access_token: data.access_token,
        expires_in: data.expires_in,
        token_type: data.token_type,
      },
      {
        headers: {
          'Cache-Control': `private, max-age=${cacheMaxAge}, must-revalidate`,
        },
      }
    );
  } catch (error) {
    console.error('Error fetching Spotify token:', error);
    return NextResponse.json(
      { error: 'Failed to authenticate with Spotify' },
      { status: 500 }
    );
  }
}

