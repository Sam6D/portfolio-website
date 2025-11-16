# Spotify Integration Plan

## Overview
This plan outlines the steps to integrate Spotify's Web API to enable album search and 30-second preview playback for the RecentlyListened component in the portfolio footer.

## Key Differences from Tidal
- **Preview Playback**: Spotify provides 30-second preview URLs directly in API responses (no SDK required)
- **Authentication**: Client Credentials flow for server-side search (no user login needed)
- **Search Endpoint**: More straightforward search API with better documentation
- **No Access Tier Issues**: Spotify's API is generally more accessible for development

---

## Phase 1: Setup & Configuration

### 1.1 Spotify Developer Account Setup
- [ ] Register at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
- [ ] Create a new application
- [ ] Obtain Client ID and Client Secret
- [ ] Add redirect URI (if needed for future user auth features)
- [ ] Note: No app review required for basic API access

### 1.2 Environment Variables
Add to `.env.local`:
```env
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
```

**Note**: These are server-side only (no `NEXT_PUBLIC_` prefix needed)

---

## Phase 2: TypeScript Types

### 2.1 Create Spotify Types File
**File**: `src/types/spotify.ts`

Define interfaces for:
- `SpotifyTokenResponse` - OAuth token response
- `SpotifySearchResult` - Search API response
- `SpotifyAlbum` - Album object with preview URLs
- `SpotifyArtist` - Artist object
- `SpotifyTrack` - Track object with `preview_url`
- `SpotifyAlbumMatch` - Matched album with first track preview URL
- `SpotifyError` - Error response structure

**Key Fields**:
- Albums have `tracks.items[]` array
- Each track has `preview_url` (30-second preview, can be null)
- Search returns `albums.items[]` array

---

## Phase 3: API Routes

### 3.1 Authentication Route
**File**: `src/app/api/spotify/token/route.ts`

**Purpose**: Generate access tokens using Client Credentials flow

**Flow**:
1. Get `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` from env
2. Create Basic Auth header: `Base64(clientId:clientSecret)`
3. POST to `https://accounts.spotify.com/api/token`
   - Body: `grant_type=client_credentials`
   - Headers: `Authorization: Basic {base64}`, `Content-Type: application/x-www-form-urlencoded`
4. Return `access_token` and `expires_in`
5. Cache token (subtract 60 seconds from `expires_in` for safety)

**Response**:
```json
{
  "access_token": "BQC...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### 3.2 Search Route
**File**: `src/app/api/spotify/search/route.ts`

**Purpose**: Search Spotify catalog for albums matching Last.fm data

**Query Parameters**:
- `albumName` (required)
- `artistName` (required)

**Search Strategy**:
1. Get access token from `/api/spotify/token`
2. Search for album: `GET https://api.spotify.com/v1/search`
   - Query: `album:{albumName} artist:{artistName}`
   - Type: `album`
   - Limit: `20` (to handle duplicates)
3. Filter results:
   - Normalize album and artist names for matching
   - Prefer exact matches
   - Sort by popularity if multiple matches
4. Get album tracks: `GET https://api.spotify.com/v1/albums/{albumId}/tracks`
   - Limit: `1` (just need first track)
5. Return match with first track's `preview_url`

**Response**:
```json
{
  "albumId": "4iZCPM8x6A7tF4sZx9K8xL",
  "albumTitle": "Industry Plant",
  "artistName": "Miki",
  "previewUrl": "https://p.scdn.co/mp3-preview/...",
  "coverUrl": "https://i.scdn.co/image/..."
}
```

**Error Handling**:
- Return `null` if no match found (graceful degradation)
- Log errors server-side only
- Handle rate limiting (429 status)

---

## Phase 4: Component Updates

### 4.1 Update RecentlyListened Component
**File**: `src/components/ui/RecentlyListened.tsx`

**Changes**:
1. Add state for Spotify matches:
   - `spotifyMatches: (SpotifyAlbumMatch | null)[]`
   - `playingAlbumIndex: number | null`
   - `isPlaying: boolean`
   - `spotifyLoading: boolean[]`

2. Add `useEffect` to fetch Spotify matches:
   - Trigger when albums are loaded
   - Call `/api/spotify/search` for each album
   - Store matches in state

3. Add play/pause handlers:
   - `handlePlay(index)`: Play preview URL using HTML5 Audio API
   - `handlePause()`: Stop current playback
   - Track playing state

4. Add PlayButton component (recreate for Spotify)

### 4.2 Create PlayButton Component
**File**: `src/components/ui/PlayButton.tsx`

**Features**:
- Play/pause icon toggle
- Loading state (spinner)
- Disabled state (no preview available)
- Hover overlay on album cover
- Uses HTML5 `<audio>` element or Audio API

**Props**:
```typescript
interface PlayButtonProps {
  isPlaying: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  onPlay: () => void;
  onPause: () => void;
  className?: string;
}
```

---

## Phase 5: Audio Playback Implementation

### 5.1 HTML5 Audio API Approach
**Why**: Spotify preview URLs are direct MP3 links, no SDK needed

**Implementation**:
1. Create `Audio` instance in component
2. Store in `useRef` to persist across renders
3. Set `src` to preview URL when playing
4. Handle `ended` event to reset state
5. Clean up on unmount

**Example**:
```typescript
const audioRef = useRef<HTMLAudioElement | null>(null);

function handlePlay(index: number) {
  const match = spotifyMatches[index];
  if (!match?.previewUrl) return;
  
  // Stop any currently playing audio
  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }
  
  // Create new audio instance
  const audio = new Audio(match.previewUrl);
  audioRef.current = audio;
  
  audio.play();
  setPlayingAlbumIndex(index);
  setIsPlaying(true);
  
  // Reset when preview ends (30 seconds)
  audio.addEventListener('ended', () => {
    setIsPlaying(false);
    setPlayingAlbumIndex(null);
  });
}
```

### 5.2 Error Handling
- Handle `preview_url` being `null` (no preview available)
- Handle network errors during playback
- Gracefully degrade if Spotify search fails (show albums without play button)

---

## Phase 6: Testing

### 6.1 Local Testing Checklist
- [ ] Spotify token generation works
- [ ] Search API finds matching albums
- [ ] Preview URLs are valid and playable
- [ ] Play/pause functionality works
- [ ] Multiple albums can be played sequentially
- [ ] Error handling works (no preview, search fails)
- [ ] Albums display correctly without Spotify matches

### 6.2 Test Cases
1. **Happy Path**: Album exists in Spotify with preview
2. **No Preview**: Album exists but no preview URL
3. **No Match**: Album not found in Spotify
4. **Network Error**: Spotify API unavailable
5. **Rate Limiting**: Handle 429 responses

---

## Phase 7: Production Considerations

### 7.1 Rate Limiting
- Spotify API: 10,000 requests per hour per app
- Cache search results (1 hour)
- Cache tokens (until expiration)

### 7.2 Error Handling
- Server-side: Log errors, return null gracefully
- Client-side: Hide play button if no preview available
- User-facing: No error messages, just graceful degradation

### 7.3 Performance
- Search albums in parallel (Promise.all)
- Lazy load preview URLs (only fetch when needed)
- Cache album matches in component state

---

## Implementation Order

1. ✅ **Setup** (Phase 1) - Developer account, env variables
2. ✅ **Types** (Phase 2) - Create TypeScript interfaces
3. ✅ **Auth Route** (Phase 3.1) - Token generation
4. ✅ **Search Route** (Phase 3.2) - Album matching
5. ✅ **PlayButton** (Phase 4.2) - Reusable component
6. ✅ **Component Updates** (Phase 4.1) - Integrate Spotify
7. ✅ **Audio Playback** (Phase 5) - HTML5 Audio implementation
8. ✅ **Testing** (Phase 6) - Verify everything works

---

## Key Advantages of Spotify

1. **No SDK Required**: Preview URLs work with standard HTML5 Audio
2. **Better Documentation**: More comprehensive API docs
3. **No Access Tier Issues**: Works immediately after account creation
4. **Larger Catalog**: Spotify has a very extensive music library
5. **Preview URLs**: Built-in 30-second previews in API responses

---

## Resources

- [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
- [Web API Reference](https://developer.spotify.com/documentation/web-api/)
- [Search API Documentation](https://developer.spotify.com/documentation/web-api/reference/search)
- [Authorization Guide](https://developer.spotify.com/documentation/general/guides/authorization/)
- [Client Credentials Flow](https://developer.spotify.com/documentation/general/guides/authorization/client-credentials/)

---

## Notes

- Preview URLs are 30-second clips
- Some tracks may not have preview URLs (especially older/rare tracks)
- Search is case-insensitive and handles partial matches well
- Album search can return multiple results (releases, compilations, etc.) - we'll pick the most popular match

